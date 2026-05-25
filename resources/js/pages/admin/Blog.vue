<template>
    <div class="blog-page">
        <div class="mb-6 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Блог</h1>
                <p class="text-muted-foreground mt-1">Статьи и публикации</p>
            </div>
            <button
                @click="openModal(null)"
                class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Написать статью
            </button>
        </div>

        <!-- Фильтр по статусу -->
        <div class="flex gap-2 mb-6 flex-wrap">
            <button
                v-for="tab in tabs" :key="tab.value"
                @click="filterStatus = tab.value; page = 1; fetchItems()"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
                :class="filterStatus === tab.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:bg-muted/20'"
            >
                {{ tab.label }}
            </button>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{{ error }}</div>
        <div v-if="loading" class="text-center py-8 text-muted-foreground">Загрузка...</div>
        <div v-else-if="items.length === 0" class="text-center py-8 text-muted-foreground rounded-lg bg-card border border-border">
            Нет статей. Напишите первую!
        </div>

        <div v-else class="rounded-lg bg-card border border-border overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-muted/30 border-b border-border">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Заголовок</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Статус</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Дата публикации</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Обновлено</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Действия</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        <tr v-for="item in items" :key="item.id" class="hover:bg-muted/10">
                            <td class="px-6 py-4">
                                <div class="font-medium text-sm text-foreground">{{ item.title }}</div>
                                <div class="text-xs text-muted-foreground mt-0.5">{{ item.slug }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 text-xs rounded" :class="statusClass(item.status)">
                                    {{ statusLabel(item.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ item.published_at ? formatDate(item.published_at) : '—' }}</td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ formatDate(item.updated_at) }}</td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button
                                        v-if="item.status !== 'published'"
                                        @click="publishPost(item)"
                                        class="px-2 py-1 text-xs bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 rounded"
                                    >
                                        Опубликовать
                                    </button>
                                    <button
                                        v-else
                                        @click="unpublishPost(item)"
                                        class="px-2 py-1 text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 rounded"
                                    >
                                        Снять
                                    </button>
                                    <button
                                        @click="openModal(item)"
                                        class="px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded"
                                    >
                                        Изменить
                                    </button>
                                    <button
                                        @click="confirmDelete(item)"
                                        class="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="mt-6 flex items-center justify-between rounded-lg bg-card border border-border p-4">
            <div class="text-sm text-muted-foreground">Всего: {{ pagination.total }}</div>
            <div class="flex gap-2">
                <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page <= 1"
                    class="px-3 py-2 text-sm border border-border rounded-lg bg-background hover:bg-muted/10 disabled:opacity-50">Назад</button>
                <span class="px-3 py-2 text-sm text-muted-foreground">{{ pagination.current_page }} / {{ pagination.last_page }}</span>
                <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page >= pagination.last_page"
                    class="px-3 py-2 text-sm border border-border rounded-lg bg-background hover:bg-muted/10 disabled:opacity-50">Вперед</button>
            </div>
        </div>

        <!-- Modal создания/редактирования -->
        <div v-if="modal" class="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
            <div class="w-full max-w-2xl bg-card rounded-xl border border-border shadow-2xl my-8">
                <div class="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h3 class="text-lg font-semibold">{{ form.id ? 'Редактировать статью' : 'Новая статья' }}</h3>
                    <button @click="closeModal" class="text-muted-foreground hover:text-foreground text-xl">✕</button>
                </div>
                <div class="p-6 space-y-4">
                    <div v-if="modalError" class="p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm">{{ modalError }}</div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Заголовок <span class="text-red-500">*</span></label>
                        <input v-model="form.title" @input="autoSlug" type="text" placeholder="Заголовок статьи"
                            class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Slug</label>
                        <input v-model="form.slug" type="text" placeholder="url-slug"
                            class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm font-mono" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Превью-текст</label>
                        <textarea v-model="form.excerpt" rows="2" placeholder="Краткое описание для списка статей"
                            class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm resize-none"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Полный текст</label>
                        <textarea v-model="form.body" rows="8" placeholder="Содержимое статьи..."
                            class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm font-mono resize-y"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">SEO-заголовок</label>
                            <input v-model="form.seo_title" type="text" placeholder="Meta title"
                                class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Дата публикации</label>
                            <input v-model="form.published_at" type="datetime-local"
                                class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">SEO-описание</label>
                        <textarea v-model="form.seo_description" rows="2" placeholder="Meta description"
                            class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm resize-none"></textarea>
                    </div>

                    <div class="flex items-center gap-6">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" v-model="form.is_published" class="rounded" />
                            <span class="text-sm font-medium">Опубликовать сразу</span>
                        </label>
                    </div>
                </div>
                <div class="px-6 py-4 border-t border-border flex items-center gap-3">
                    <button @click="savePost" :disabled="saving"
                        class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 text-sm">
                        {{ saving ? 'Сохранение...' : 'Сохранить' }}
                    </button>
                    <button v-if="form.id && form.status !== 'published'" @click="publishPost(form, true)" :disabled="saving"
                        class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 text-sm">
                        Опубликовать
                    </button>
                    <button @click="closeModal" class="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted/10">Отмена</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Blog',
    data() {
        return {
            items: [],
            loading: true,
            error: null,
            filterStatus: '',
            page: 1,
            perPage: 15,
            pagination: null,
            modal: false,
            saving: false,
            modalError: null,
            form: this.emptyForm(),
            tabs: [
                { label: 'Все', value: '' },
                { label: 'Черновики', value: 'draft' },
                { label: 'Опубликованные', value: 'published' },
                { label: 'Архив', value: 'archived' },
            ],
        };
    },
    mounted() {
        this.fetchItems();
    },
    methods: {
        emptyForm() {
            return { id: null, title: '', slug: '', excerpt: '', body: '', seo_title: '', seo_description: '', published_at: '', status: 'draft', is_published: false };
        },
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
                const res = await axios.get('/api/admin/cms/posts', { headers: this.authHeaders(), params });
                this.items = res.data.data;
                this.pagination = res.data.meta?.pagination || null;
            } catch {
                this.error = 'Не удалось загрузить статьи';
            } finally {
                this.loading = false;
            }
        },
        changePage(p) { this.page = p; this.fetchItems(); },
        openModal(item) {
            this.modalError = null;
            if (item) {
                this.form = {
                    id: item.id,
                    title: item.title || '',
                    slug: item.slug || '',
                    excerpt: item.excerpt || '',
                    body: item.body || '',
                    seo_title: item.seo_title || '',
                    seo_description: item.seo_description || '',
                    published_at: item.published_at ? item.published_at.substring(0, 16) : '',
                    status: item.status || 'draft',
                    is_published: item.status === 'published',
                };
            } else {
                this.form = this.emptyForm();
            }
            this.modal = true;
        },
        closeModal() { this.modal = false; },
        autoSlug() {
            if (!this.form.id) {
                this.form.slug = this.form.title
                    .toLowerCase()
                    .replace(/[^a-zа-яё0-9\s-]/gi, '')
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');
            }
        },
        async savePost() {
            if (!this.form.title.trim()) { this.modalError = 'Введите заголовок'; return; }
            if (!this.form.slug.trim()) { this.modalError = 'Введите slug'; return; }
            this.saving = true;
            this.modalError = null;
            try {
                const payload = {
                    title: this.form.title,
                    slug: this.form.slug,
                    excerpt: this.form.excerpt || '',
                    body: this.form.body || '',
                    seo_title: this.form.seo_title || null,
                    seo_description: this.form.seo_description || null,
                    status: this.form.is_published ? 'published' : 'draft',
                    published_at: this.form.is_published ? (this.form.published_at || new Date().toISOString()) : null,
                };
                if (this.form.id) {
                    await axios.put(`/api/admin/cms/posts/${this.form.id}`, payload, { headers: this.authHeaders() });
                } else {
                    await axios.post('/api/admin/cms/posts', payload, { headers: this.authHeaders() });
                }
                this.closeModal();
                this.fetchItems();
            } catch (e) {
                this.modalError = e.response?.data?.message || 'Ошибка сохранения';
            } finally {
                this.saving = false;
            }
        },
        async publishPost(item, closeAfter = false) {
            try {
                await axios.put(`/api/admin/cms/posts/${item.id}`, { status: 'published', published_at: new Date().toISOString() }, { headers: this.authHeaders() });
                if (closeAfter) this.closeModal();
                this.fetchItems();
            } catch { this.error = 'Ошибка публикации'; }
        },
        async unpublishPost(item) {
            try {
                await axios.put(`/api/admin/cms/posts/${item.id}`, { status: 'draft' }, { headers: this.authHeaders() });
                this.fetchItems();
            } catch { this.error = 'Ошибка'; }
        },
        async confirmDelete(item) {
            if (!confirm(`Удалить статью «${item.title}»?`)) return;
            try {
                await axios.delete(`/api/admin/cms/posts/${item.id}`, { headers: this.authHeaders() });
                this.fetchItems();
            } catch { this.error = 'Ошибка при удалении'; }
        },
        statusClass(status) {
            return {
                published: 'bg-green-500/10 text-green-600 dark:text-green-400',
                draft:     'bg-muted/40 text-muted-foreground',
                archived:  'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
            }[status] || 'bg-muted/30 text-muted-foreground';
        },
        statusLabel(status) {
            return { published: 'Опубликовано', draft: 'Черновик', archived: 'Архив' }[status] || status;
        },
        formatDate(dt) {
            if (!dt) return '—';
            return new Date(dt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },
    },
};
</script>
