<template>
    <div class="taxonomies-page">
        <div class="mb-6">
            <div class="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Таксономии</h1>
                    <p class="text-muted-foreground mt-1">Управление тегами, категориями и типами</p>
                </div>
                <button
                    @click="openCreate"
                    class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Создать
                </button>
            </div>
        </div>

        <div class="mb-6 p-4 rounded-lg bg-card border border-border">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Поиск</label>
                    <input v-model="search" @input="debouncedFetch" type="text" placeholder="title, slug..." class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Тип</label>
                    <select v-model="typeFilter" @change="fetchItems" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                        <option value="">Все</option>
                        <option value="tag">tag</option>
                        <option value="category">category</option>
                        <option value="industry">industry</option>
                    </select>
                </div>
            </div>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">{{ error }}</div>
        <div v-if="loading" class="text-center py-8 text-muted-foreground">Загрузка...</div>
        <div v-else-if="items.length === 0" class="text-center py-8 text-muted-foreground rounded-lg bg-card border border-border">Нет таксономий. Нажмите «Создать».</div>
        <div v-else class="rounded-lg bg-card border border-border overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-muted/30 border-b border-border">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Title</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Slug</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Parent</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Position</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Updated</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Действия</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        <tr v-for="item in items" :key="item.id" class="hover:bg-muted/10">
                            <td class="px-6 py-4 text-sm text-foreground">{{ item.id }}</td>
                            <td class="px-6 py-4 text-sm"><span class="px-2 py-1 text-xs rounded" :class="typeClass(item.type)">{{ item.type }}</span></td>
                            <td class="px-6 py-4 text-sm font-medium text-foreground">{{ item.title }}</td>
                            <td class="px-6 py-4 text-sm text-muted-foreground font-mono">{{ item.slug }}</td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ item.parent ? item.parent.title : '-' }}</td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ item.position ?? 0 }}</td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ formatDate(item.updated_at) }}</td>
                            <td class="px-6 py-4 text-sm text-right">
                                <button @click="openEdit(item)" class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded mr-2">Edit</button>
                                <button @click="deleteItem(item)" class="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="pagination && pagination.last_page > 1" class="mt-6 flex items-center justify-between rounded-lg bg-card border border-border p-4">
            <div class="text-sm text-muted-foreground">Показано {{ paginationFrom }} — {{ paginationTo }} из {{ pagination.total }}</div>
            <div class="flex gap-2">
                <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page <= 1" class="px-3 py-2 text-sm border border-border rounded-lg bg-background hover:bg-muted/10 disabled:opacity-50">Назад</button>
                <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page >= pagination.last_page" class="px-3 py-2 text-sm border border-border rounded-lg bg-background hover:bg-muted/10 disabled:opacity-50">Вперед</button>
            </div>
        </div>

        <!-- Create/Edit Form -->
        <div v-if="formVisible" class="mt-6 rounded-lg bg-card border border-border p-6">
            <h2 class="text-lg font-semibold mb-4">{{ editingId ? 'Редактирование' : 'Новая таксономия' }}</h2>
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Type *</label>
                        <select v-model="form.type" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                            <option value="tag">tag</option>
                            <option value="category">category</option>
                            <option value="industry">industry</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Position</label>
                        <input v-model.number="form.position" type="number" min="0" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Title *</label>
                    <input v-model="form.title" @input="maybeAutoSlug" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Slug *</label>
                    <input v-model="form.slug" @input="slugManuallyEdited = true" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-mono" />
                </div>
                <div v-if="form.type === 'category'">
                    <label class="block text-sm font-medium mb-2">Parent</label>
                    <select v-model="form.parent_id" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                        <option :value="null">— Нет —</option>
                        <option v-for="p in categoryParents" :key="p.id" :value="p.id">{{ p.title }} ({{ p.slug }})</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Description</label>
                    <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"></textarea>
                </div>
            </div>
            <div class="mt-6 flex gap-3">
                <button @click="save" :disabled="saving" class="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{{ saving ? 'Сохранение...' : 'Сохранить' }}</button>
                <button @click="cancelForm" class="px-6 py-2 rounded-lg border border-border hover:bg-muted">Отмена</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'CmsTaxonomies',
    data() {
        return {
            items: [],
            loading: true,
            error: null,
            search: '',
            typeFilter: '',
            page: 1,
            perPage: 50,
            pagination: null,
            searchTimeout: null,
            formVisible: false,
            editingId: null,
            saving: false,
            slugManuallyEdited: false,
            categoryList: [],
            form: {
                type: 'tag',
                title: '',
                slug: '',
                description: '',
                parent_id: null,
                position: 0,
            },
        };
    },
    computed: {
        paginationFrom() {
            if (!this.pagination) return 0;
            const { current_page, per_page, total } = this.pagination;
            return total === 0 ? 0 : (current_page - 1) * per_page + 1;
        },
        paginationTo() {
            if (!this.pagination) return 0;
            const { current_page, per_page, total } = this.pagination;
            return Math.min(current_page * per_page, total);
        },
        categoryParents() {
            return this.categoryList.filter((c) => c.type === 'category' && c.id !== this.editingId);
        },
    },
    mounted() {
        this.fetchItems();
        this.fetchCategoriesForParent();
    },
    methods: {
        slugify(str) {
            return String(str || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
        },
        maybeAutoSlug() {
            if (!this.slugManuallyEdited) this.form.slug = this.slugify(this.form.title) || this.form.slug;
        },
        debouncedFetch() {
            if (this.searchTimeout) clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => { this.page = 1; this.fetchItems(); }, 400);
        },
        async fetchItems() {
            this.loading = true;
            this.error = null;
            try {
                const params = { per_page: this.perPage, page: this.page };
                if (this.search.trim()) params.search = this.search.trim();
                if (this.typeFilter) params.type = this.typeFilter;
                const { data } = await axios.get('/api/admin/cms/taxonomies', { params });
                this.items = data.data || [];
                this.pagination = data.meta?.pagination || null;
            } catch (err) {
                this.handleApiError(err, 'Ошибка загрузки');
            } finally {
                this.loading = false;
            }
        },
        async fetchCategoriesForParent() {
            try {
                const { data } = await axios.get('/api/admin/cms/taxonomies', { params: { type: 'category', per_page: 200 } });
                this.categoryList = data.data || [];
            } catch {
                this.categoryList = [];
            }
        },
        changePage(p) {
            if (p >= 1 && p <= (this.pagination?.last_page || 1)) { this.page = p; this.fetchItems(); }
        },
        openCreate() {
            this.editingId = null;
            this.slugManuallyEdited = false;
            this.form = { type: 'tag', title: '', slug: '', description: '', parent_id: null, position: 0 };
            this.formVisible = true;
        },
        openEdit(item) {
            this.editingId = item.id;
            this.slugManuallyEdited = false;
            this.form = {
                type: item.type || 'tag',
                title: item.title || '',
                slug: item.slug || '',
                description: item.description || '',
                parent_id: item.parent_id ?? null,
                position: item.position ?? 0,
            };
            this.formVisible = true;
        },
        cancelForm() {
            this.formVisible = false;
            this.editingId = null;
        },
        async save() {
            this.saving = true;
            this.error = null;
            const payload = {
                type: this.form.type,
                title: this.form.title || 'Untitled',
                slug: this.form.slug || this.slugify(this.form.title) || 'slug',
                description: this.form.description || null,
                parent_id: this.form.type === 'category' && this.form.parent_id ? this.form.parent_id : null,
                position: this.form.position ?? 0,
            };
            try {
                if (this.editingId) {
                    await axios.put(`/api/admin/cms/taxonomies/${this.editingId}`, payload);
                    Swal.fire({ title: 'Сохранено', icon: 'success', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
                } else {
                    await axios.post('/api/admin/cms/taxonomies', payload);
                    Swal.fire({ title: 'Создано', icon: 'success', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
                }
                this.cancelForm();
                this.fetchItems();
                this.fetchCategoriesForParent();
            } catch (err) {
                this.handleApiError(err, 'Ошибка сохранения');
            } finally {
                this.saving = false;
            }
        },
        async deleteItem(item) {
            const result = await Swal.fire({
                title: 'Удалить?',
                html: `Таксономия <strong>${item.title}</strong> будет удалена.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Да, удалить',
                cancelButtonText: 'Отмена',
                confirmButtonColor: '#dc2626',
            });
            if (!result.isConfirmed) return;
            try {
                await axios.delete(`/api/admin/cms/taxonomies/${item.id}`);
                Swal.fire({ title: 'Удалено', icon: 'success', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
                this.fetchItems();
                this.fetchCategoriesForParent();
            } catch (err) {
                if (err.response?.status === 422) {
                    const msg = err.response?.data?.message || 'Невозможно удалить: таксономия используется в записях.';
                    Swal.fire({ title: 'Удаление невозможно', text: msg, icon: 'error' });
                } else {
                    this.handleApiError(err, 'Ошибка удаления');
                }
            }
        },
        typeClass(t) {
            return { tag: 'bg-blue-500/20 text-blue-700 dark:text-blue-400', category: 'bg-green-500/20 text-green-700 dark:text-green-400', industry: 'bg-amber-500/20 text-amber-700 dark:text-amber-400' }[t] || 'bg-muted';
        },
        formatDate(iso) {
            return iso ? new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
        },
        handleApiError(err, fallback) {
            this.error = err.response?.data?.message || (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(', ')) || fallback;
            if (err.response?.status === 401 || err.response?.status === 403) Swal.fire({ title: 'Ошибка доступа', text: this.error, icon: 'error' });
            else if (err.response?.status === 422) Swal.fire({ title: 'Ошибка валидации', text: this.error, icon: 'error' });
        },
    },
};
</script>
