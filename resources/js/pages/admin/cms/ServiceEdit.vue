<template>
    <div class="service-edit">
        <div class="mb-6 flex items-center justify-between">
            <div>
                <router-link to="/admin/services" class="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">← Услуги</router-link>
                <h1 class="text-2xl font-bold text-foreground">{{ isCreate ? 'Новая услуга' : 'Редактирование услуги' }}</h1>
            </div>
            <button v-if="!isCreate" @click="handleDelete" class="px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-500/10">Удалить</button>
        </div>
        <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">{{ error }}</div>
        <div v-if="saved" class="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400">Сохранено</div>
        <div v-if="loading && !isCreate" class="py-8 text-muted-foreground">Загрузка...</div>

        <template v-else>
            <div class="rounded-lg bg-card border border-border p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">Основное</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Title *</label>
                        <input v-model="form.title" @input="maybeAutoSlug" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Slug *</label>
                        <input v-model="form.slug" @input="slugManuallyEdited = true" type="text" placeholder="service-slug" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-mono" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Status</label>
                            <select v-model="form.status" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                                <option value="draft">draft</option>
                                <option value="published">published</option>
                                <option value="archived">archived</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Position</label>
                            <input v-model.number="form.position" type="number" min="0" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Price from</label>
                        <input v-model="form.price_from" type="number" min="0" step="0.01" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Short</label>
                        <textarea v-model="form.short" rows="2" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Body</label>
                        <textarea v-model="form.body" rows="6" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"></textarea>
                    </div>
                </div>
            </div>

            <div class="rounded-lg bg-card border border-border p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">SEO</h2>
                <div class="space-y-4">
                    <div><label class="block text-sm font-medium mb-2">SEO Title</label><input v-model="form.seo_title" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" /></div>
                    <div><label class="block text-sm font-medium mb-2">SEO Description</label><textarea v-model="form.seo_description" rows="2" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"></textarea></div>
                </div>
            </div>

            <div class="rounded-lg bg-card border border-border p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">Таксономии</h2>
                <TaxonomySelect v-model="taxonomyIds" :types="['tag','category']" label="" />
            </div>

            <div v-if="!isCreate && serviceId" class="rounded-lg bg-card border border-border p-6 mb-6">
                <MediaManager
                    entity-type="services"
                    :entity-id="serviceId"
                    :media-collections="serviceData?.media_collections || {}"
                    :collections-config="[
                        { key: 'cover', label: 'Обложка', mode: 'single', allowReorder: false, allowMeta: true },
                        { key: 'icon', label: 'Иконка', mode: 'single', allowReorder: false, allowMeta: true },
                        { key: 'gallery', label: 'Галерея', mode: 'multiple', allowReorder: true, allowMeta: true },
                    ]"
                    @updated="onMediaUpdated"
                />
            </div>

            <div class="mt-6 flex gap-3">
                <button @click="save" :disabled="saving" class="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{{ saving ? 'Сохранение...' : (isCreate ? 'Создать' : 'Сохранить') }}</button>
                <router-link to="/admin/services" class="px-6 py-2 rounded-lg border border-border hover:bg-muted">Отмена</router-link>
            </div>
        </template>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import TaxonomySelect from '../../../components/admin/cms/TaxonomySelect.vue';
import MediaManager from '../../../components/admin/cms/MediaManager.vue';

export default {
    name: 'CmsServiceEdit',
    components: { TaxonomySelect, MediaManager },
    data() {
        return {
            serviceId: null,
            loading: false,
            saving: false,
            error: null,
            saved: false,
            slugManuallyEdited: false,
            serviceData: null,
            form: { title: '', slug: '', status: 'draft', position: 0, price_from: '', short: '', body: '', seo_title: '', seo_description: '' },
            taxonomyIds: [],
        };
    },
    computed: { isCreate() { return this.$route.path.endsWith('/create'); } },
    watch: { saved(val) { if (val) setTimeout(() => { this.saved = false; }, 3000); } },
    async mounted() {
        if (!this.isCreate) {
            this.serviceId = this.$route.params.id;
            await this.fetchItem();
        }
    },
    methods: {
        slugify(str) {
            return String(str || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
        },
        maybeAutoSlug() {
            if (!this.slugManuallyEdited) this.form.slug = this.slugify(this.form.title) || this.form.slug;
        },
        async fetchItem() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get(`/api/admin/cms/services/${this.serviceId}`);
                const s = data.data;
                this.form = { title: s.title || '', slug: s.slug || '', status: s.status || 'draft', position: s.position ?? 0, price_from: s.price_from ?? '', short: s.short || '', body: s.body || '', seo_title: s.seo_title || '', seo_description: s.seo_description || '' };
                this.taxonomyIds = (s.taxonomies || []).map((t) => t.id);
                this.serviceData = s;
            } catch (err) {
                this.handleApiError(err, 'Ошибка загрузки');
            } finally {
                this.loading = false;
            }
        },
        async save() {
            this.saving = true;
            this.error = null;
            const payload = { title: this.form.title || 'Untitled', slug: this.form.slug || this.slugify(this.form.title) || 'service', status: this.form.status, position: this.form.position ?? 0, price_from: this.form.price_from ? parseFloat(this.form.price_from) : null, short: this.form.short || null, body: this.form.body || null, seo_title: this.form.seo_title || null, seo_description: this.form.seo_description || null };
            try {
                if (this.isCreate) {
                    const { data } = await axios.post('/api/admin/cms/services', payload);
                    const newId = data.data.id;
                    await axios.post(`/api/admin/cms/services/${newId}/taxonomies/sync`, { taxonomy_ids: this.taxonomyIds || [] });
                    this.$router.replace(`/admin/services/${newId}`);
                } else {
                    await axios.put(`/api/admin/cms/services/${this.serviceId}`, payload);
                    await this.syncTaxonomies();
                    this.saved = true;
                }
            } catch (err) {
                this.handleApiError(err, 'Ошибка сохранения');
            } finally {
                this.saving = false;
            }
        },
        async syncTaxonomies() {
            if (!this.serviceId) return;
            try {
                const { data } = await axios.post(`/api/admin/cms/services/${this.serviceId}/taxonomies/sync`, { taxonomy_ids: this.taxonomyIds || [] });
                this.serviceData = data.data;
            } catch (err) {
                this.handleApiError(err, 'Ошибка сохранения таксономий');
            }
        },
        onMediaUpdated(data) { this.serviceData = data; },
        async handleDelete() {
            const result = await Swal.fire({ title: 'Удалить?', html: `Услуга <strong>${this.form.title}</strong> будет удалена.`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Да, удалить', cancelButtonText: 'Отмена', confirmButtonColor: '#dc2626' });
            if (!result.isConfirmed) return;
            try {
                await axios.delete(`/api/admin/cms/services/${this.serviceId}`);
                Swal.fire({ title: 'Удалено', icon: 'success', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
                this.$router.replace('/admin/services');
            } catch (err) {
                this.handleApiError(err, 'Ошибка удаления');
            }
        },
        handleApiError(err, fallback) {
            this.error = err.response?.data?.message || (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(', ')) || fallback;
            if (err.response?.status === 401 || err.response?.status === 403) Swal.fire({ title: 'Ошибка доступа', text: this.error, icon: 'error' });
            else if (err.response?.status === 422) Swal.fire({ title: 'Ошибка валидации', text: this.error, icon: 'error' });
        },
    },
};
</script>
