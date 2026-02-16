<template>
    <div class="leads-page">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-foreground">Лиды</h1>
            <p class="text-muted-foreground mt-1">Заявки и обращения</p>
        </div>

        <div class="mb-6 p-4 rounded-lg bg-card border border-border">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Поиск</label>
                    <input v-model="search" @input="debouncedFetch" type="text" placeholder="name, phone, email..." class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Статус</label>
                    <select v-model="status" @change="fetchItems" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                        <option value="">Все</option>
                        <option value="new">new</option>
                        <option value="in_progress">in_progress</option>
                        <option value="won">won</option>
                        <option value="lost">lost</option>
                        <option value="spam">spam</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Дата от</label>
                    <input v-model="dateFrom" @change="fetchItems" type="date" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Дата до</label>
                    <input v-model="dateTo" @change="fetchItems" type="date" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                </div>
            </div>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">{{ error }}</div>
        <div v-if="loading" class="text-center py-8 text-muted-foreground">Загрузка...</div>
        <div v-else-if="items.length === 0" class="text-center py-8 text-muted-foreground rounded-lg bg-card border border-border">Нет лидов</div>
        <div v-else class="rounded-lg bg-card border border-border overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-muted/30 border-b border-border">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Phone</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Source</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Created</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        <tr v-for="item in items" :key="item.id" class="hover:bg-muted/10">
                            <td class="px-6 py-4 text-sm text-foreground">{{ item.id }}</td>
                            <td class="px-6 py-4 text-sm font-medium text-foreground">{{ item.name }}</td>
                            <td class="px-6 py-4 text-sm text-foreground">{{ item.phone }}</td>
                            <td class="px-6 py-4 text-sm text-foreground">{{ item.email }}</td>
                            <td class="px-6 py-4 text-sm"><span class="px-2 py-1 text-xs rounded" :class="statusClass(item.status)">{{ item.status }}</span></td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ item.source || '-' }}</td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ formatDate(item.created_at) }}</td>
                            <td class="px-6 py-4 text-sm text-right">
                                <router-link :to="`/admin/leads/${item.id}`" class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded">View</router-link>
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
    name: 'CmsLeads',
    data() {
        return {
            items: [],
            loading: true,
            error: null,
            search: '',
            status: '',
            dateFrom: '',
            dateTo: '',
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
    mounted() { this.fetchItems(); },
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
                if (this.dateFrom) params.date_from = this.dateFrom;
                if (this.dateTo) params.date_to = this.dateTo;
                const { data } = await axios.get('/api/admin/cms/leads', { params });
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
        statusClass(s) {
            return { new: 'bg-blue-500/20 text-blue-700', in_progress: 'bg-amber-500/20 text-amber-700', won: 'bg-green-500/20 text-green-700', lost: 'bg-red-500/20 text-red-700', spam: 'bg-gray-500/20 text-gray-700' }[s] || 'bg-muted';
        },
        formatDate(iso) {
            return iso ? new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
        },
        handleApiError(err, fallback) {
            this.error = err.response?.data?.message || (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(', ')) || fallback;
            if (err.response?.status === 401 || err.response?.status === 403) Swal.fire({ title: 'Ошибка доступа', text: this.error, icon: 'error' });
            else if (err.response?.status === 422) Swal.fire({ title: 'Ошибка валидации', text: this.error, icon: 'error' });
        },
    },
};
</script>
