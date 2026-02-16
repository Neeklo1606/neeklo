<template>
    <div class="case-study-edit">
        <div class="mb-6 flex items-center justify-between">
            <div>
                <router-link to="/case-studies" class="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">← Кейс-стади</router-link>
                <h1 class="text-2xl font-bold text-foreground">{{ isCreate ? 'Новый кейс-стади' : 'Редактирование кейс-стади' }}</h1>
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
                        <input v-model="form.slug" @input="slugManuallyEdited = true" type="text" placeholder="case-study-slug" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-mono" />
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
                            <label class="block text-sm font-medium mb-2">Published at</label>
                            <input v-model="form.published_at" type="datetime-local" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Client</label>
                            <input v-model="form.client" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Industry</label>
                            <input v-model="form.industry" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Problem</label>
                        <textarea v-model="form.problem" rows="2" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Solution</label>
                        <textarea v-model="form.solution" rows="2" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Result</label>
                        <textarea v-model="form.result" rows="2" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"></textarea>
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
                <TaxonomySelect v-model="taxonomyIds" :types="['tag','industry']" label="" />
            </div>

            <div v-if="!isCreate && caseStudyId" class="rounded-lg bg-card border border-border p-6 mb-6">
                <MediaManager
                    entity-type="case-studies"
                    :entity-id="caseStudyId"
                    :media-collections="caseStudyData?.media_collections || {}"
                    :collections-config="[
                        { key: 'cover', label: 'Обложка', mode: 'single', allowReorder: false, allowMeta: true },
                        { key: 'gallery', label: 'Галерея', mode: 'multiple', allowReorder: true, allowMeta: true },
                    ]"
                    @updated="onMediaUpdated"
                />
            </div>

            <div class="mt-6 flex gap-3">
                <button @click="save" :disabled="saving" class="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{{ saving ? 'Сохранение...' : (isCreate ? 'Создать' : 'Сохранить') }}</button>
                <router-link to="/case-studies" class="px-6 py-2 rounded-lg border border-border hover:bg-muted">Отмена</router-link>
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
    name: 'CmsCaseStudyEdit',
    components: { TaxonomySelect, MediaManager },
    data() {
        return {
            caseStudyId: null,
            loading: false,
            saving: false,
            error: null,
            saved: false,
            slugManuallyEdited: false,
            caseStudyData: null,
            form: { title: '', slug: '', status: 'draft', published_at: '', client: '', industry: '', problem: '', solution: '', result: '', body: '', seo_title: '', seo_description: '' },
            taxonomyIds: [],
        };
    },
    computed: { isCreate() { return this.$route.path.endsWith('/create'); } },
    watch: { saved(val) { if (val) setTimeout(() => { this.saved = false; }, 3000); } },
    async mounted() {
        if (!this.isCreate) {
            this.caseStudyId = this.$route.params.id;
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
        toDatetimeLocal(iso) {
            if (!iso) return '';
            const d = new Date(iso);
            const pad = (n) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        },
        async fetchItem() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get(`/api/admin/cms/case-studies/${this.caseStudyId}`);
                const s = data.data;
                this.form = {
                    title: s.title || '',
                    slug: s.slug || '',
                    status: s.status || 'draft',
                    published_at: this.toDatetimeLocal(s.published_at),
                    client: s.client || '',
                    industry: s.industry || '',
                    problem: s.problem || '',
                    solution: s.solution || '',
                    result: s.result || '',
                    body: s.body || '',
                    seo_title: s.seo_title || '',
                    seo_description: s.seo_description || '',
                };
                this.taxonomyIds = (s.taxonomies || []).map((t) => t.id);
                this.caseStudyData = s;
            } catch (err) {
                this.handleApiError(err, 'Ошибка загрузки');
            } finally {
                this.loading = false;
            }
        },
        async save() {
            this.saving = true;
            this.error = null;
            const pubAt = this.form.published_at ? new Date(this.form.published_at).toISOString() : null;
            const payload = {
                title: this.form.title || 'Untitled',
                slug: this.form.slug || this.slugify(this.form.title) || 'case-study',
                status: this.form.status,
                published_at: pubAt,
                client: this.form.client || null,
                industry: this.form.industry || null,
                problem: this.form.problem || null,
                solution: this.form.solution || null,
                result: this.form.result || null,
                body: this.form.body || null,
                seo_title: this.form.seo_title || null,
                seo_description: this.form.seo_description || null,
            };
            try {
                if (this.isCreate) {
                    const { data } = await axios.post('/api/admin/cms/case-studies', payload);
                    const newId = data.data.id;
                    await axios.post(`/api/admin/cms/case-studies/${newId}/taxonomies/sync`, { taxonomy_ids: this.taxonomyIds || [] });
                    this.$router.replace('/case-studies/' + newId);
                } else {
                    await axios.put(`/api/admin/cms/case-studies/${this.caseStudyId}`, payload);
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
            if (!this.caseStudyId) return;
            try {
                const { data } = await axios.post(`/api/admin/cms/case-studies/${this.caseStudyId}/taxonomies/sync`, { taxonomy_ids: this.taxonomyIds || [] });
                this.caseStudyData = data.data;
            } catch (err) {
                this.handleApiError(err, 'Ошибка сохранения таксономий');
            }
        },
        onMediaUpdated(data) { this.caseStudyData = data; },
        async handleDelete() {
            const result = await Swal.fire({ title: 'Удалить?', html: `Кейс-стади <strong>${this.form.title}</strong> будет удалён.`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Да, удалить', cancelButtonText: 'Отмена', confirmButtonColor: '#dc2626' });
            if (!result.isConfirmed) return;
            try {
                await axios.delete(`/api/admin/cms/case-studies/${this.caseStudyId}`);
                Swal.fire({ title: 'Удалено', icon: 'success', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
                this.$router.replace('case-studies');
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
