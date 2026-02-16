<template>
    <div class="services-page">
        <div class="mb-6">
            <div class="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Услуги</h1>
                    <p class="text-muted-foreground mt-1">Управление услугами CMS</p>
                </div>
                <router-link
                    to="/admin/services/create"
                    class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Создать
                </router-link>
            </div>
        </div>
        <div class="mb-6 p-4 rounded-lg bg-card border border-border">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Поиск</label>
                    <input v-model="search" @input="debouncedFetch" type="text" placeholder="title, slug..." class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Статус</label>
                    <select v-model="status" @change="fetchItems" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                        <option value="">Все</option>
                        <option value="draft">draft</option>
                        <option value="published">published</option>
                        <option value="archived">archived</option>
                    </select>
                </div>
            </div>
        </div>
        <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">{{ error }}</div>
        <div v-if="loading" class="text-center py-8 text-muted-foreground">Загрузка...</div>
        <div v-else-if="items.length === 0" class="text-center py-8 text-muted-foreground rounded-lg bg-card border border-border">Нет услуг. <router-link to="/admin/services/create" class="text-primary hover:underline">Создать</router-link></div>
        <div v-else class="rounded-lg bg-card border border-border overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-muted/30 border-b border-border">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Title</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Slug</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Position</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Updated</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Действия</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        <tr v-for="item in items" :key="item.id" class="hover:bg-muted/10">
                            <td class="px-6 py-4 text-sm text-foreground">{{ item.id }}</td>
                            <td class="px-6 py-4 text-sm font-medium text-foreground">{{ item.title }}</td>
                            <td class="px-6 py-4 text-sm text-muted-foreground font-mono">{{ item.slug }}</td>
                            <td class="px-6 py-4 text-sm"><span class="px-2 py-1 text-xs rounded" :class="statusClass(item.status)">{{ item.status }}</span></td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ item.position ?? '-' }}</td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ formatDate(item.updated_at) }}</td>
                            <td class="px-6 py-4 text-sm text-right">
                                <router-link :to="`/admin/services/${item.id}`" class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded mr-2">Edit</router-link>
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
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'CmsServices',
    data() {
        return {
            items: [],
            loading: true,
            error: null,
            search: '',
            status: '',
            page: 1,
            perPage: 15,
            pagination: null,
            searchTimeout: null,
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
    },
    mounted() {
        this.fetchItems();
    },
    methods: {
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
                if (this.status) params.status = this.status;
                const { data } = await axios.get('/api/admin/cms/services', { params });
                this.items = data.data || [];
                this.pagination = data.meta?.pagination || null;
            } catch (err) {
                this.handleApiError(err, 'Ошибка загрузки');
            } finally {
                this.loading = false;
            }
        },
        changePage(p) {
            if (p >= 1 && p <= (this.pagination?.last_page || 1)) { this.page = p; this.fetchItems(); }
        },
        async deleteItem(item) {
            const result = await Swal.fire({ title: 'Удалить?', html: `Услуга <strong>${item.title}</strong> будет удалена.`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Да, удалить', cancelButtonText: 'Отмена', confirmButtonColor: '#dc2626' });
            if (!result.isConfirmed) return;
            try {
                await axios.delete(`/api/admin/cms/services/${item.id}`);
                Swal.fire({ title: 'Удалено', icon: 'success', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
                this.fetchItems();
            } catch (err) {
                this.handleApiError(err, 'Ошибка удаления');
            }
        },
        statusClass(s) {
            return { draft: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400', published: 'bg-green-500/20 text-green-700 dark:text-green-400', archived: 'bg-gray-500/20 text-gray-700 dark:text-gray-400' }[s] || 'bg-muted';
        },
        formatDate(iso) {
            return iso ? new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
        },
        handleApiError(err, fallback) {
            this.error = err.response?.data?.message || (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(', ')) || fallback;
            if (err.response?.status === 401 || err.response?.status === 403) Swal.fire({ title: 'Ошибка доступа', text: this.error, icon: 'error' });
        },
    },
};
</script>
