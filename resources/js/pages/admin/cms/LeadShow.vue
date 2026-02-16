<template>
    <div class="lead-show">
        <div class="mb-6 flex items-center justify-between">
            <div>
                <router-link to="/admin/leads" class="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">← Лиды</router-link>
                <h1 class="text-2xl font-bold text-foreground">Лид #{{ lead?.id }}</h1>
            </div>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">{{ error }}</div>
        <div v-if="saved" class="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400">Сохранено</div>
        <div v-if="loading" class="py-8 text-muted-foreground">Загрузка...</div>

        <template v-else-if="lead">
            <div class="rounded-lg bg-card border border-border p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">Информация</h2>
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><dt class="text-sm text-muted-foreground">Name</dt><dd class="font-medium">{{ lead.name }}</dd></div>
                    <div><dt class="text-sm text-muted-foreground">Phone</dt><dd>{{ lead.phone }}</dd></div>
                    <div><dt class="text-sm text-muted-foreground">Email</dt><dd>{{ lead.email }}</dd></div>
                    <div><dt class="text-sm text-muted-foreground">Source</dt><dd>{{ lead.source || '-' }}</dd></div>
                    <div><dt class="text-sm text-muted-foreground">Page URL</dt><dd class="truncate max-w-xs" :title="lead.page_url">{{ lead.page_url || '-' }}</dd></div>
                    <div><dt class="text-sm text-muted-foreground">Created</dt><dd>{{ formatDate(lead.created_at) }}</dd></div>
                </dl>
                <div v-if="lead.message" class="mt-4">
                    <dt class="text-sm text-muted-foreground">Message</dt>
                    <dd class="mt-1 p-3 rounded bg-muted/30 text-sm whitespace-pre-wrap">{{ lead.message }}</dd>
                </div>
                <div v-if="lead.utm && Object.keys(lead.utm).length" class="mt-4">
                    <dt class="text-sm text-muted-foreground">UTM</dt>
                    <dd class="mt-1 p-3 rounded bg-muted/30 text-sm font-mono">{{ JSON.stringify(lead.utm) }}</dd>
                </div>
            </div>

            <div class="rounded-lg bg-card border border-border p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">Управление</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                    <div>
                        <label class="block text-sm font-medium mb-2">Status</label>
                        <select v-model="form.status" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                            <option value="new">new</option>
                            <option value="in_progress">in_progress</option>
                            <option value="won">won</option>
                            <option value="lost">lost</option>
                            <option value="spam">spam</option>
                        </select>
                    </div>
                    <div v-if="users.length > 0">
                        <label class="block text-sm font-medium mb-2">Assigned to</label>
                        <select v-model="form.assigned_to" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                            <option :value="null">— Не назначен —</option>
                            <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }} ({{ u.email }})</option>
                        </select>
                    </div>
                </div>
                <button @click="save" :disabled="saving" class="mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{{ saving ? 'Сохранение...' : 'Сохранить' }}</button>
            </div>
        </template>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'CmsLeadShow',
    data() {
        return {
            leadId: null,
            lead: null,
            loading: true,
            error: null,
            saved: false,
            saving: false,
            users: [],
            form: { status: 'new', assigned_to: null },
        };
    },
    watch: { saved(val) { if (val) setTimeout(() => { this.saved = false; }, 3000); } },
    mounted() {
        this.leadId = this.$route.params.id;
        this.fetch();
        this.fetchUsers();
    },
    methods: {
        async fetch() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get(`/api/admin/cms/leads/${this.leadId}`);
                this.lead = data.data;
                this.form = { status: this.lead.status || 'new', assigned_to: this.lead.assigned_to ?? null };
            } catch (err) {
                this.handleApiError(err, 'Ошибка загрузки');
            } finally {
                this.loading = false;
            }
        },
        async fetchUsers() {
            try {
                const { data } = await axios.get('/api/v1/users', { params: { per_page: 100 } });
                this.users = data.data || [];
            } catch {
                this.users = [];
            }
        },
        async save() {
            this.saving = true;
            this.error = null;
            const payload = { status: this.form.status };
            if (this.users.length > 0) payload.assigned_to = this.form.assigned_to;
            try {
                await axios.put(`/api/admin/cms/leads/${this.leadId}`, payload);
                this.saved = true;
                this.fetch();
            } catch (err) {
                this.handleApiError(err, 'Ошибка сохранения');
            } finally {
                this.saving = false;
            }
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
