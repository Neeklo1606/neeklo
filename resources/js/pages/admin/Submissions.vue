<template>
    <div class="submissions-page">
        <div class="mb-6 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">
                    Заявки
                    <span v-if="counts.new > 0" class="ml-2 px-2 py-0.5 text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                        {{ counts.new }} новых
                    </span>
                </h1>
                <p class="text-muted-foreground mt-1">Входящие заявки с сайта</p>
            </div>
        </div>

        <!-- Status filter tabs -->
        <div class="flex gap-2 mb-6 flex-wrap">
            <button
                v-for="tab in tabs"
                :key="tab.value"
                @click="filterStatus = tab.value; page = 1; fetchItems()"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
                :class="filterStatus === tab.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:bg-muted/20'"
            >
                {{ tab.label }}
                <span v-if="tab.value && counts[tab.value] !== undefined" class="ml-1 text-xs opacity-70">({{ counts[tab.value] }})</span>
                <span v-else-if="!tab.value && counts.all !== undefined" class="ml-1 text-xs opacity-70">({{ counts.all }})</span>
            </button>
        </div>

        <!-- Search -->
        <div class="mb-4">
            <input
                v-model="search"
                @input="debouncedFetch"
                type="text"
                placeholder="Поиск по имени, телефону, email, компании..."
                class="w-full max-w-md px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
            />
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{{ error }}</div>

        <div v-if="loading" class="text-center py-8 text-muted-foreground">Загрузка...</div>
        <div v-else-if="items.length === 0" class="text-center py-8 text-muted-foreground rounded-lg bg-card border border-border">
            Нет заявок
        </div>
        <div v-else class="rounded-lg bg-card border border-border overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-muted/30 border-b border-border">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Имя</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Телефон / Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Компания / Роль</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Статус</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Дата</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Действия</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        <tr
                            v-for="item in items"
                            :key="item.id"
                            class="hover:bg-muted/10 cursor-pointer"
                            @click="openDrawer(item)"
                        >
                            <td class="px-6 py-4 text-sm font-medium text-foreground">{{ item.name }}</td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">
                                <div>{{ item.phone || '—' }}</div>
                                <div class="text-xs">{{ item.email || '' }}</div>
                            </td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">
                                <div>{{ item.company || '—' }}</div>
                                <div class="text-xs">{{ item.role || '' }}</div>
                            </td>
                            <td class="px-6 py-4 text-sm">
                                <span class="px-2 py-1 text-xs rounded" :class="statusClass(item.status)">
                                    {{ statusLabel(item.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ formatDate(item.created_at) }}</td>
                            <td class="px-6 py-4 text-sm text-right">
                                <button
                                    @click.stop="confirmDelete(item)"
                                    class="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded"
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="mt-6 flex items-center justify-between rounded-lg bg-card border border-border p-4">
            <div class="text-sm text-muted-foreground">
                Всего: {{ pagination.total }}
            </div>
            <div class="flex gap-2">
                <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page <= 1"
                    class="px-3 py-2 text-sm border border-border rounded-lg bg-background hover:bg-muted/10 disabled:opacity-50">
                    Назад
                </button>
                <span class="px-3 py-2 text-sm text-muted-foreground">
                    {{ pagination.current_page }} / {{ pagination.last_page }}
                </span>
                <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page >= pagination.last_page"
                    class="px-3 py-2 text-sm border border-border rounded-lg bg-background hover:bg-muted/10 disabled:opacity-50">
                    Вперед
                </button>
            </div>
        </div>

        <!-- Drawer: submission detail -->
        <transition name="drawer">
            <div v-if="drawer" class="fixed inset-0 z-50 flex justify-end" @click.self="closeDrawer">
                <div class="w-full max-w-lg bg-card border-l border-border shadow-2xl flex flex-col h-full overflow-y-auto">
                    <div class="flex items-center justify-between px-6 py-4 border-b border-border">
                        <h2 class="text-lg font-semibold">Заявка</h2>
                        <button @click="closeDrawer" class="text-muted-foreground hover:text-foreground text-xl leading-none">✕</button>
                    </div>

                    <div class="flex-1 p-6 space-y-4">
                        <div v-if="drawerSaved" class="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm">Сохранено</div>

                        <dl class="grid grid-cols-2 gap-4">
                            <div>
                                <dt class="text-xs text-muted-foreground">Имя</dt>
                                <dd class="font-medium text-sm">{{ drawer.name }}</dd>
                            </div>
                            <div>
                                <dt class="text-xs text-muted-foreground">Компания</dt>
                                <dd class="text-sm">{{ drawer.company || '—' }}</dd>
                            </div>
                            <div>
                                <dt class="text-xs text-muted-foreground">Телефон</dt>
                                <dd class="text-sm">
                                    <a v-if="drawer.phone" :href="'tel:' + drawer.phone" class="text-primary hover:underline">{{ drawer.phone }}</a>
                                    <span v-else>—</span>
                                </dd>
                            </div>
                            <div>
                                <dt class="text-xs text-muted-foreground">Email</dt>
                                <dd class="text-sm">
                                    <a v-if="drawer.email" :href="'mailto:' + drawer.email" class="text-primary hover:underline">{{ drawer.email }}</a>
                                    <span v-else>—</span>
                                </dd>
                            </div>
                            <div>
                                <dt class="text-xs text-muted-foreground">Роль</dt>
                                <dd class="text-sm">{{ drawer.role || '—' }}</dd>
                            </div>
                            <div>
                                <dt class="text-xs text-muted-foreground">Проект</dt>
                                <dd class="text-sm">{{ drawer.project_name || '—' }}</dd>
                            </div>
                            <div class="col-span-2">
                                <dt class="text-xs text-muted-foreground">Дата</dt>
                                <dd class="text-sm">{{ formatDateFull(drawer.created_at) }}</dd>
                            </div>
                        </dl>

                        <div v-if="drawer.description">
                            <p class="text-xs text-muted-foreground mb-1">Описание</p>
                            <div class="p-3 rounded bg-muted/30 text-sm whitespace-pre-wrap">{{ drawer.description }}</div>
                        </div>

                        <div v-if="drawer.files && drawer.files.length > 0">
                            <p class="text-xs text-muted-foreground mb-1">Файлы ({{ drawer.files.length }})</p>
                            <div class="space-y-1">
                                <a v-for="(f, i) in drawer.files" :key="i"
                                    :href="f.url || f.path || '#'"
                                    target="_blank"
                                    class="block text-sm text-primary hover:underline truncate">
                                    {{ f.name || f.original_name || 'Файл ' + (i + 1) }}
                                </a>
                            </div>
                        </div>

                        <!-- Status change -->
                        <div>
                            <label class="block text-xs text-muted-foreground mb-1">Статус</label>
                            <select v-model="drawerForm.status" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm">
                                <option value="new">Новая</option>
                                <option value="contacted">Связались</option>
                                <option value="in_work">В работе</option>
                                <option value="done">Готово</option>
                                <option value="rejected">Отклонено</option>
                            </select>
                        </div>

                        <!-- Notes -->
                        <div>
                            <label class="block text-xs text-muted-foreground mb-1">Заметки</label>
                            <textarea
                                v-model="drawerForm.notes"
                                rows="4"
                                placeholder="Внутренние заметки..."
                                class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div class="px-6 py-4 border-t border-border flex items-center gap-3">
                        <button
                            @click="saveDrawer"
                            :disabled="drawerSaving"
                            class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 text-sm"
                        >
                            {{ drawerSaving ? 'Сохранение...' : 'Сохранить' }}
                        </button>
                        <button @click="closeDrawer" class="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted/10">Закрыть</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Submissions',
    data() {
        return {
            items: [],
            loading: true,
            error: null,
            search: '',
            filterStatus: '',
            page: 1,
            perPage: 20,
            pagination: null,
            counts: {},
            searchTimeout: null,

            drawer: null,
            drawerForm: { status: 'new', notes: '' },
            drawerSaving: false,
            drawerSaved: false,

            tabs: [
                { label: 'Все', value: '' },
                { label: 'Новые', value: 'new' },
                { label: 'Связались', value: 'contacted' },
                { label: 'В работе', value: 'in_work' },
                { label: 'Готово', value: 'done' },
                { label: 'Отклонено', value: 'rejected' },
            ],
        };
    },
    mounted() {
        this.fetchCounts();
        this.fetchItems();

        // Open specific submission if ?id= is in URL
        const id = new URLSearchParams(window.location.search).get('id');
        if (id) {
            this.fetchAndOpenDrawer(id);
        }
    },
    methods: {
        authHeaders() {
            const token = localStorage.getItem('token');
            return { Authorization: `Bearer ${token}` };
        },
        async fetchItems() {
            this.loading = true;
            this.error = null;
            try {
                const params = { page: this.page, per_page: this.perPage };
                if (this.filterStatus) params.status = this.filterStatus;
                if (this.search) params.search = this.search;

                const res = await axios.get('/api/admin/submissions/', {
                    headers: this.authHeaders(),
                    params,
                });
                this.items = res.data.data;
                this.pagination = res.data.meta?.pagination || null;
            } catch (e) {
                this.error = 'Не удалось загрузить заявки';
            } finally {
                this.loading = false;
            }
        },
        async fetchCounts() {
            try {
                const res = await axios.get('/api/admin/submissions/counts', {
                    headers: this.authHeaders(),
                });
                this.counts = res.data;
            } catch {}
        },
        debouncedFetch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.page = 1;
                this.fetchItems();
            }, 400);
        },
        changePage(p) {
            this.page = p;
            this.fetchItems();
        },
        openDrawer(item) {
            this.drawer = item;
            this.drawerForm = { status: item.status || 'new', notes: item.notes || '' };
            this.drawerSaved = false;
        },
        async fetchAndOpenDrawer(id) {
            try {
                const res = await axios.get(`/api/admin/submissions/${id}`, {
                    headers: this.authHeaders(),
                });
                this.openDrawer(res.data.data);
            } catch {}
        },
        closeDrawer() {
            this.drawer = null;
        },
        async saveDrawer() {
            this.drawerSaving = true;
            try {
                const res = await axios.put(`/api/admin/submissions/${this.drawer.id}`, this.drawerForm, {
                    headers: this.authHeaders(),
                });
                const updated = res.data.data;
                const idx = this.items.findIndex(i => i.id === updated.id);
                if (idx !== -1) this.items[idx] = updated;
                this.drawer = updated;
                this.drawerSaved = true;
                this.fetchCounts();
                setTimeout(() => { this.drawerSaved = false; }, 3000);
            } catch {
                this.error = 'Ошибка при сохранении';
            } finally {
                this.drawerSaving = false;
            }
        },
        async confirmDelete(item) {
            if (!confirm(`Удалить заявку от "${item.name}"?`)) return;
            try {
                await axios.delete(`/api/admin/submissions/${item.id}`, {
                    headers: this.authHeaders(),
                });
                this.items = this.items.filter(i => i.id !== item.id);
                if (this.drawer?.id === item.id) this.closeDrawer();
                this.fetchCounts();
            } catch {
                this.error = 'Ошибка при удалении';
            }
        },
        statusClass(status) {
            const map = {
                new:       'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                contacted: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
                in_work:   'bg-purple-500/10 text-purple-600 dark:text-purple-400',
                done:      'bg-green-500/10 text-green-600 dark:text-green-400',
                rejected:  'bg-red-500/10 text-red-500',
            };
            return map[status] || 'bg-muted/30 text-muted-foreground';
        },
        statusLabel(status) {
            const map = {
                new: 'Новая', contacted: 'Связались', in_work: 'В работе',
                done: 'Готово', rejected: 'Отклонено',
            };
            return map[status] || status;
        },
        formatDate(dt) {
            if (!dt) return '—';
            return new Date(dt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },
        formatDateFull(dt) {
            if (!dt) return '—';
            return new Date(dt).toLocaleString('ru-RU', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            });
        },
    },
};
</script>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.2s; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
</style>
