<template>
    <div class="page-edit">
        <div class="mb-6 flex items-center justify-between">
            <div>
                <router-link to="/admin/pages" class="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">← Страницы</router-link>
                <h1 class="text-2xl font-bold text-foreground">{{ isCreate ? 'Новая страница' : 'Редактирование страницы' }}</h1>
            </div>
            <div v-if="!isCreate" class="flex gap-2">
                <button
                    @click="handleDelete"
                    class="px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-500/10 transition-colors"
                >
                    Удалить
                </button>
            </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            {{ error }}
        </div>

        <!-- Success -->
        <div v-if="saved" class="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400">
            Сохранено
        </div>

        <!-- Loading -->
        <div v-if="loading && !isCreate" class="py-8 text-muted-foreground">Загрузка...</div>

        <template v-else>
            <!-- Basic form -->
            <div class="rounded-lg bg-card border border-border p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">Основное</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Title *</label>
                        <input
                            v-model="form.title"
                            @input="maybeAutoSlug"
                            type="text"
                            class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Slug *</label>
                        <input
                            v-model="form.slug"
                            @input="slugManuallyEdited = true"
                            type="text"
                            placeholder="page-slug"
                            class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-mono"
                        />
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
                            <label class="block text-sm font-medium mb-2">Template</label>
                            <input v-model="form.template" type="text" placeholder="default" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Locale</label>
                            <input v-model="form.locale" type="text" placeholder="ru" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                        </div>
                        <div v-if="form.status === 'published'">
                            <label class="block text-sm font-medium mb-2">Published at</label>
                            <input v-model="form.published_at" type="datetime-local" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Excerpt</label>
                        <textarea v-model="form.excerpt" rows="2" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Content</label>
                        <textarea v-model="form.content" rows="8" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"></textarea>
                    </div>
                </div>
            </div>

            <!-- SEO -->
            <div class="rounded-lg bg-card border border-border p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">SEO</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">SEO Title</label>
                        <input v-model="form.seo_title" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">SEO Description</label>
                        <textarea v-model="form.seo_description" rows="2" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">OG (JSON)</label>
                        <JsonTextarea ref="ogRef" v-model="form.og" placeholder='{"title":"","description":"","image":""}' @error="ogError = $event" />
                    </div>
                </div>
            </div>

            <!-- Blocks (only in edit mode) -->
            <div v-if="!isCreate && pageId" class="rounded-lg bg-card border border-border p-6">
                <h2 class="text-lg font-semibold mb-4">Блоки</h2>

                <!-- Add block form -->
                <div class="mb-6 p-4 rounded-lg bg-muted/20 border border-border">
                    <h3 class="text-sm font-medium mb-3">Добавить блок</h3>
                    <div class="space-y-3">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-medium mb-1">Type</label>
                                <select v-model="newBlock.type" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm">
                                    <option value="hero">hero</option>
                                    <option value="text">text</option>
                                    <option value="image">image</option>
                                    <option value="cta">cta</option>
                                    <option value="gallery">gallery</option>
                                    <option value="columns">columns</option>
                                    <option value="other">other</option>
                                </select>
                            </div>
                            <div class="flex items-end">
                                <label class="flex items-center gap-2">
                                    <input v-model="newBlock.is_enabled" type="checkbox" class="rounded" />
                                    <span class="text-sm">is_enabled</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium mb-1">Data (JSON)</label>
                            <textarea v-model="newBlock.dataStr" rows="3" placeholder='{"title":"","content":""}' class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-mono text-sm"></textarea>
                            <p v-if="newBlockDataError" class="mt-1 text-xs text-red-500">{{ newBlockDataError }}</p>
                        </div>
                        <button
                            @click="addBlock"
                            :disabled="addingBlock || !newBlock.type"
                            class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 text-sm"
                        >
                            {{ addingBlock ? 'Добавление...' : 'Добавить блок' }}
                        </button>
                    </div>
                </div>

                <!-- Blocks list -->
                <div class="space-y-3">
                    <div
                        v-for="(block, idx) in blocks"
                        :key="block.id"
                        class="p-4 rounded-lg border border-border bg-background/50"
                    >
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex items-center gap-2 shrink-0">
                                <button
                                    @click="moveBlock(idx, -1)"
                                    :disabled="idx === 0"
                                    class="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Вверх"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                                </button>
                                <button
                                    @click="moveBlock(idx, 1)"
                                    :disabled="idx === blocks.length - 1"
                                    class="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Вниз"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div v-if="editingBlockId === block.id" class="space-y-3">
                                    <div class="flex items-center gap-2">
                                        <select v-model="editBlock.type" class="px-2 py-1 rounded bg-background border border-border text-sm">
                                            <option value="hero">hero</option>
                                            <option value="text">text</option>
                                            <option value="image">image</option>
                                            <option value="cta">cta</option>
                                            <option value="gallery">gallery</option>
                                            <option value="columns">columns</option>
                                            <option value="other">other</option>
                                        </select>
                                        <label class="flex items-center gap-1 text-sm">
                                            <input v-model="editBlock.is_enabled" type="checkbox" class="rounded" />
                                            enabled
                                        </label>
                                    </div>
                                    <div>
                                        <label class="block text-xs mb-1">Data (JSON)</label>
                                        <textarea v-model="editBlock.dataStr" rows="4" class="w-full px-2 py-1 rounded border border-border text-sm font-mono"></textarea>
                                        <p v-if="editBlockDataError" class="text-xs text-red-500 mt-1">{{ editBlockDataError }}</p>
                                    </div>
                                    <div class="flex gap-2">
                                        <button @click="saveBlock(block.id)" :disabled="savingBlock" class="px-3 py-1 rounded bg-primary text-primary-foreground text-sm disabled:opacity-50">Сохранить блок</button>
                                        <button @click="editingBlockId = null" class="px-3 py-1 rounded border border-border text-sm">Отмена</button>
                                    </div>
                                </div>
                                <div v-else>
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="font-mono text-sm text-muted-foreground">#{{ block.position }}</span>
                                        <span class="font-medium">{{ block.type }}</span>
                                        <span v-if="!block.is_enabled" class="text-xs text-amber-600">(выкл)</span>
                                    </div>
                                    <pre v-if="block.data && Object.keys(block.data).length" class="mt-2 text-xs text-muted-foreground overflow-x-auto">{{ JSON.stringify(block.data) }}</pre>
                                    <div class="mt-2 flex gap-2">
                                        <button @click="startEditBlock(block)" class="text-xs text-primary hover:underline">Редактировать</button>
                                        <button @click="deleteBlock(block)" class="text-xs text-red-600 hover:underline">Удалить</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="blocks.length === 0" class="text-center py-6 text-muted-foreground text-sm">
                        Нет блоков. Добавьте первый.
                    </div>
                </div>
            </div>

            <!-- Media (only in edit mode) -->
            <div v-if="!isCreate && pageId" class="rounded-lg bg-card border border-border p-6 mb-6">
                <MediaManager
                    entity-type="pages"
                    :entity-id="pageId"
                    :media-collections="pageData?.media_collections || {}"
                    :collections-config="[
                        { key: 'cover', label: 'Обложка', mode: 'single', allowReorder: false, allowMeta: true },
                        { key: 'gallery', label: 'Галерея', mode: 'multiple', allowReorder: true, allowMeta: true },
                        { key: 'attachments', label: 'Вложения', mode: 'multiple', allowReorder: true, allowMeta: false },
                    ]"
                    @updated="onMediaUpdated"
                />
            </div>

            <!-- Save / Create -->
            <div class="mt-6 flex gap-3">
                <button
                    @click="savePage"
                    :disabled="saving"
                    class="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                    {{ saving ? 'Сохранение...' : (isCreate ? 'Создать' : 'Сохранить') }}
                </button>
                <router-link to="/admin/pages" class="px-6 py-2 rounded-lg border border-border hover:bg-muted">
                    Отмена
                </router-link>
            </div>
        </template>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import JsonTextarea from '../../../components/admin/cms/JsonTextarea.vue';
import MediaManager from '../../../components/admin/cms/MediaManager.vue';

export default {
    name: 'CmsPageEdit',
    components: { JsonTextarea, MediaManager },
    data() {
        return {
            pageId: null,
            loading: false,
            saving: false,
            error: null,
            saved: false,
            slugManuallyEdited: false,
            ogError: null,
            form: {
                title: '',
                slug: '',
                status: 'draft',
                template: 'default',
                locale: 'ru',
                published_at: '',
                excerpt: '',
                content: '',
                seo_title: '',
                seo_description: '',
                og: null,
            },
            blocks: [],
            newBlock: { type: 'text', is_enabled: true, dataStr: '{}' },
            newBlockDataError: null,
            addingBlock: false,
            editingBlockId: null,
            editBlock: { type: '', is_enabled: true, dataStr: '' },
            editBlockDataError: null,
            savingBlock: false,
            pageData: null,
        };
    },
    computed: {
        isCreate() {
            return this.$route.path.endsWith('/create');
        },
    },
    watch: {
        saved(val) {
            if (val) setTimeout(() => { this.saved = false; }, 3000);
        },
    },
    async mounted() {
        if (!this.isCreate) {
            this.pageId = this.$route.params.id;
            await this.fetchPage();
        }
    },
    methods: {
        slugify(str) {
            return String(str || '')
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
        },
        maybeAutoSlug() {
            if (!this.slugManuallyEdited) {
                this.form.slug = this.slugify(this.form.title) || this.form.slug;
            }
        },
        async fetchPage() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get(`/api/admin/cms/pages/${this.pageId}`);
                const p = data.data;
                this.form = {
                    title: p.title || '',
                    slug: p.slug || '',
                    status: p.status || 'draft',
                    template: p.template || 'default',
                    locale: p.locale || 'ru',
                    published_at: p.published_at ? p.published_at.slice(0, 16) : '',
                    excerpt: p.excerpt || '',
                    content: p.content || '',
                    seo_title: p.seo_title || '',
                    seo_description: p.seo_description || '',
                    og: p.og && typeof p.og === 'object' ? p.og : (p.og ? JSON.parse(JSON.stringify(p.og)) : null),
                };
                this.blocks = (p.blocks || []).map(b => ({ ...b }));
                this.pageData = p;
            } catch (err) {
                this.handleApiError(err, 'Ошибка загрузки');
            } finally {
                this.loading = false;
            }
        },
        async savePage() {
            if (this.$refs.ogRef && !this.$refs.ogRef.validate()) return;
            this.saving = true;
            this.error = null;
            const payload = {
                title: this.form.title || 'Untitled',
                slug: this.form.slug || this.slugify(this.form.title) || 'page',
                status: this.form.status,
                template: this.form.template || 'default',
                locale: this.form.locale || 'ru',
                excerpt: this.form.excerpt || null,
                content: this.form.content || null,
                seo_title: this.form.seo_title || null,
                seo_description: this.form.seo_description || null,
                og: this.form.og,
            };
            if (this.form.published_at) payload.published_at = this.form.published_at;

            try {
                if (this.isCreate) {
                    const { data } = await axios.post('/api/admin/cms/pages', payload);
                    this.$router.replace(`/admin/pages/${data.data.id}`);
                } else {
                    await axios.put(`/api/admin/cms/pages/${this.pageId}`, payload);
                    this.saved = true;
                }
            } catch (err) {
                this.handleApiError(err, 'Ошибка сохранения');
            } finally {
                this.saving = false;
            }
        },
        parseBlockData(str) {
            if (!str || !str.trim()) return {};
            try {
                return JSON.parse(str);
            } catch (e) {
                return null;
            }
        },
        async addBlock() {
            const data = this.parseBlockData(this.newBlock.dataStr);
            if (data === null) {
                this.newBlockDataError = 'Некорректный JSON';
                return;
            }
            this.newBlockDataError = null;
            this.addingBlock = true;
            try {
                const { data: res } = await axios.post(`/api/admin/cms/pages/${this.pageId}/blocks`, {
                    type: this.newBlock.type,
                    is_enabled: this.newBlock.is_enabled,
                    data,
                    position: this.blocks.length,
                });
                this.blocks.push(res.data);
                this.newBlock = { type: 'text', is_enabled: true, dataStr: '{}' };
            } catch (err) {
                this.handleApiError(err, 'Ошибка добавления блока');
            } finally {
                this.addingBlock = false;
            }
        },
        startEditBlock(block) {
            this.editingBlockId = block.id;
            this.editBlock = {
                type: block.type,
                is_enabled: !!block.is_enabled,
                dataStr: JSON.stringify(block.data || {}, null, 2),
            };
            this.editBlockDataError = null;
        },
        async saveBlock(blockId) {
            const data = this.parseBlockData(this.editBlock.dataStr);
            if (data === null) {
                this.editBlockDataError = 'Некорректный JSON';
                return;
            }
            this.editBlockDataError = null;
            this.savingBlock = true;
            try {
                const { data: res } = await axios.put(`/api/admin/cms/blocks/${blockId}`, {
                    type: this.editBlock.type,
                    is_enabled: this.editBlock.is_enabled,
                    data,
                });
                const idx = this.blocks.findIndex(b => b.id === blockId);
                if (idx >= 0) this.blocks[idx] = res.data;
                this.editingBlockId = null;
            } catch (err) {
                this.handleApiError(err, 'Ошибка сохранения блока');
            } finally {
                this.savingBlock = false;
            }
        },
        async deleteBlock(block) {
            const result = await Swal.fire({
                title: 'Удалить блок?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Да',
                cancelButtonText: 'Отмена',
                confirmButtonColor: '#dc2626',
            });
            if (!result.isConfirmed) return;

            try {
                await axios.delete(`/api/admin/cms/blocks/${block.id}`);
                this.blocks = this.blocks.filter(b => b.id !== block.id);
                Swal.fire({ title: 'Удалено', icon: 'success', timer: 1000, showConfirmButton: false, toast: true, position: 'top-end' });
            } catch (err) {
                this.handleApiError(err, 'Ошибка удаления блока');
            }
        },
        async moveBlock(idx, delta) {
            const newIdx = idx + delta;
            if (newIdx < 0 || newIdx >= this.blocks.length) return;
            const arr = [...this.blocks];
            [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
            this.blocks = arr;
            await this.saveBlocksOrder();
        },
        async saveBlocksOrder() {
            const blockIds = this.blocks.map(b => b.id);
            try {
                const { data } = await axios.post(`/api/admin/cms/pages/${this.pageId}/blocks/reorder`, { block_ids: blockIds });
                this.blocks = data.data || this.blocks;
            } catch (err) {
                this.handleApiError(err, 'Ошибка сохранения порядка блоков');
                await this.fetchPage();
            }
        },
        async handleDelete() {
            const result = await Swal.fire({
                title: 'Удалить страницу?',
                html: `Страница <strong>${this.form.title}</strong> будет удалена.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Да, удалить',
                cancelButtonText: 'Отмена',
                confirmButtonColor: '#dc2626',
            });
            if (!result.isConfirmed) return;

            try {
                await axios.delete(`/api/admin/cms/pages/${this.pageId}`);
                Swal.fire({ title: 'Удалено', icon: 'success', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
                this.$router.replace('/admin/pages');
            } catch (err) {
                this.handleApiError(err, 'Ошибка удаления');
            }
        },
        onMediaUpdated(newPage) {
            this.pageData = newPage;
        },
        handleApiError(err, fallback) {
            const msg = err.response?.data?.message
                || (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(', '))
                || fallback;
            this.error = msg;
            if (err.response?.status === 401 || err.response?.status === 403) {
                Swal.fire({ title: 'Ошибка доступа', text: msg, icon: 'error' });
            } else if (err.response?.status === 422) {
                Swal.fire({ title: 'Ошибка валидации', text: msg, icon: 'error' });
            }
        },
    },
};
</script>
