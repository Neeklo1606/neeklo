<template>
    <div class="menus-page">
        <div class="mb-6">
            <div class="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Меню</h1>
                    <p class="text-muted-foreground mt-1">Управление меню навигации</p>
                </div>
                <button
                    v-if="!formVisible"
                    @click="openCreate"
                    class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Создать
                </button>
            </div>
        </div>

        <div v-if="formVisible" class="mb-6 rounded-lg bg-card border border-border p-6">
            <h2 class="text-lg font-semibold mb-4">Новое меню</h2>
            <div class="space-y-4 max-w-md">
                <div>
                    <label class="block text-sm font-medium mb-2">Key *</label>
                    <input v-model="form.key" type="text" placeholder="header" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-mono" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Title *</label>
                    <input v-model="form.title" type="text" placeholder="Главное меню" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                </div>
            </div>
            <div class="mt-6 flex gap-3">
                <button @click="saveMenu" :disabled="saving" class="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{{ saving ? 'Сохранение...' : 'Сохранить' }}</button>
                <button @click="cancelForm" class="px-6 py-2 rounded-lg border border-border hover:bg-muted">Отмена</button>
            </div>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">{{ error }}</div>
        <div v-if="loading" class="text-center py-8 text-muted-foreground">Загрузка...</div>
        <div v-else-if="items.length === 0" class="text-center py-8 text-muted-foreground rounded-lg bg-card border border-border">Нет меню. Нажмите «Создать».</div>
        <div v-else class="rounded-lg bg-card border border-border overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-muted/30 border-b border-border">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Key</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Title</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Updated</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Действия</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        <tr v-for="item in items" :key="item.id" class="hover:bg-muted/10">
                            <td class="px-6 py-4 text-sm text-foreground">{{ item.id }}</td>
                            <td class="px-6 py-4 text-sm font-mono text-foreground">{{ item.key }}</td>
                            <td class="px-6 py-4 text-sm font-medium text-foreground">{{ item.title }}</td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ formatDate(item.updated_at) }}</td>
                            <td class="px-6 py-4 text-sm text-right">
                                <router-link :to="`/admin/menus/${item.id}`" class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded mr-2">Edit</router-link>
                                <button @click="deleteItem(item)" class="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'CmsMenus',
    data() {
        return {
            items: [],
            loading: true,
            error: null,
            formVisible: false,
            saving: false,
            form: { key: '', title: '' },
        };
    },
    mounted() { this.fetchItems(); },
    methods: {
        async fetchItems() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get('/api/admin/cms/menus', { params: { per_page: 100 } });
                this.items = data.data || [];
            } catch (err) {
                this.handleApiError(err, 'Ошибка загрузки');
            } finally {
                this.loading = false;
            }
        },
        openCreate() {
            this.form = { key: '', title: '' };
            this.formVisible = true;
        },
        cancelForm() { this.formVisible = false; },
        async saveMenu() {
            this.saving = true;
            this.error = null;
            const payload = { key: this.form.key || 'menu', title: this.form.title || 'Menu' };
            try {
                const { data } = await axios.post('/api/admin/cms/menus', payload);
                Swal.fire({ title: 'Создано', icon: 'success', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
                this.cancelForm();
                this.$router.push(`/admin/menus/${data.data.id}`);
            } catch (err) {
                this.handleApiError(err, 'Ошибка сохранения');
            } finally {
                this.saving = false;
            }
        },
        async deleteItem(item) {
            const result = await Swal.fire({
                title: 'Удалить?',
                html: `Меню <strong>${item.title}</strong> будет удалено.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Да, удалить',
                cancelButtonText: 'Отмена',
                confirmButtonColor: '#dc2626',
            });
            if (!result.isConfirmed) return;
            try {
                await axios.delete(`/api/admin/cms/menus/${item.id}`);
                Swal.fire({ title: 'Удалено', icon: 'success', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
                this.fetchItems();
            } catch (err) {
                this.handleApiError(err, 'Ошибка удаления');
            }
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
