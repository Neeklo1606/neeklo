<template>
    <div class="media-manager">
        <h2 class="text-lg font-semibold mb-4">Медиа</h2>

        <div class="flex flex-wrap gap-2 border-b border-border pb-2 mb-4">
            <button
                v-for="col in collectionsConfig"
                :key="col.key"
                @click="activeCollection = col.key"
                :class="[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    activeCollection === col.key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 hover:bg-muted text-foreground',
                ]"
            >
                {{ col.label }}
            </button>
        </div>

        <div v-for="col in collectionsConfig" :key="col.key" v-show="activeCollection === col.key" class="space-y-3">
            <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">{{ getCollectionLabel(col.key) }}{{ col.maxCount ? ` (макс. ${col.maxCount})` : '' }}</span>
                <button
                    @click="openPicker(col)"
                    :disabled="col.maxCount != null && items(col.key).length >= col.maxCount"
                    class="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Добавить
                </button>
            </div>

            <div v-if="items(col.key).length === 0" class="py-6 text-center text-muted-foreground text-sm rounded-lg border border-dashed border-border">
                Нет медиа. Нажмите «Добавить».
            </div>

            <div v-else class="space-y-2">
                <div
                    v-for="(item, idx) in items(col.key)"
                    :key="item.id"
                    class="flex items-center gap-4 p-3 rounded-lg border border-border bg-background/50"
                >
                    <div class="flex items-center gap-2 shrink-0">
                        <button
                            v-if="col.allowReorder"
                            @click="moveItem(col.key, idx, -1)"
                            :disabled="idx === 0"
                            class="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Вверх"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                        </button>
                        <button
                            v-if="col.allowReorder"
                            @click="moveItem(col.key, idx, 1)"
                            :disabled="idx === items(col.key).length - 1"
                            class="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Вниз"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                    </div>
                    <div class="w-14 h-14 rounded overflow-hidden bg-muted/30 shrink-0 flex items-center justify-center">
                        <img
                            v-if="isImage(item) && getPreviewUrl(item)"
                            :src="getPreviewUrl(item)"
                            :alt="getAlt(item)"
                            class="w-full h-full object-cover"
                            @error="handleImageError"
                        />
                        <span v-else class="text-2xl text-muted-foreground">{{ item.type === 'video' ? '🎬' : '📄' }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate">{{ item.original_name || item.name }}</p>
                        <div v-if="col.allowMeta && isImage(item)" class="mt-1">
                            <input
                                :value="getAlt(item)"
                                @input="updateMetaAlt(col.key, item.id, $event.target.value)"
                                type="text"
                                placeholder="Alt текст"
                                class="w-full px-2 py-1 text-xs rounded border border-border bg-background"
                            />
                        </div>
                    </div>
                    <button
                        @click="detach(col.key, item.id)"
                        class="p-2 rounded text-red-600 hover:bg-red-500/10 shrink-0"
                        title="Удалить"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {{ error }}
        </div>

        <MediaPickerModal
            :show="pickerShow"
            :mode="pickerConfig.mode"
            :initial-selected-ids="[]"
            @close="pickerShow = false"
            @selected="onMediaSelected"
        />
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import MediaPickerModal from './MediaPickerModal.vue';

export default {
    name: 'MediaManager',
    components: { MediaPickerModal },
    props: {
        entityType: { type: String, required: true },
        entityId: { type: Number, required: true },
        mediaCollections: {
            type: Object,
            default: () => ({}),
        },
        collectionsConfig: {
            type: Array,
            default: () => [
                { key: 'cover', label: 'Обложка', mode: 'single', allowReorder: false, allowMeta: true },
                { key: 'gallery', label: 'Галерея', mode: 'multiple', allowReorder: true, allowMeta: true },
                { key: 'attachments', label: 'Вложения', mode: 'multiple', allowReorder: true, allowMeta: false },
            ],
        },
    },
    emits: ['updated'],
    data() {
        return {
            activeCollection: null,
            collections: {},
            pickerShow: false,
            pickerConfig: { key: '', mode: 'single' },
            error: null,
        };
    },
    watch: {
        mediaCollections: {
            immediate: true,
            handler(val) {
                const out = {};
                for (const col of this.collectionsConfig) {
                    const arr = val?.[col.key];
                    out[col.key] = Array.isArray(arr) ? arr : [];
                }
                this.collections = out;
                if (!this.activeCollection && this.collectionsConfig.length) {
                    this.activeCollection = this.collectionsConfig[0].key;
                }
            },
        },
    },
    methods: {
        getCollectionLabel(key) {
            return this.collectionsConfig.find((c) => c.key === key)?.label || key;
        },
        items(key) {
            return this.collections[key] || [];
        },
        openPicker(col) {
            this.pickerConfig = { key: col.key, mode: col.mode };
            this.pickerShow = true;
            this.error = null;
        },
        async onMediaSelected(ids) {
            this.pickerShow = false;
            if (ids === null || (Array.isArray(ids) && ids.length === 0)) return;
            const idsArr = Array.isArray(ids) ? ids : [ids];
            const col = this.pickerConfig.key;

            try {
                const base = `/api/admin/cms/${this.entityType}/${this.entityId}/media`;
                const payload = this.pickerConfig.mode === 'single'
                    ? { media_id: idsArr[0], collection: this.pickerConfig.key }
                    : { media_ids: idsArr, collection: this.pickerConfig.key };
                const { data } = await axios.post(`${base}/attach`, payload);
                this.emitUpdated(data.data);
            } catch (err) {
                this.handleApiError(err);
            }
        },
        async detach(colKey, mediaId) {
            try {
                const base = `/api/admin/cms/${this.entityType}/${this.entityId}/media`;
                const { data } = await axios.post(`${base}/detach`, { media_id: mediaId, collection: colKey });
                this.emitUpdated(data.data);
            } catch (err) {
                this.handleApiError(err);
            }
        },
        async moveItem(colKey, idx, delta) {
            const arr = [...(this.collections[colKey] || [])];
            const newIdx = idx + delta;
            if (newIdx < 0 || newIdx >= arr.length) return;
            [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
            const order = arr.map((m) => m.id);
            try {
                const base = `/api/admin/cms/${this.entityType}/${this.entityId}/media`;
                const { data } = await axios.post(`${base}/reorder`, { collection: colKey, order });
                this.emitUpdated(data.data);
            } catch (err) {
                this.handleApiError(err);
            }
        },
        updateMetaAlt(colKey, mediaId, alt) {
            const arr = this.collections[colKey] || [];
            const item = arr.find((m) => m.id === mediaId);
            const existing = (item?.pivot?.meta && typeof item.pivot.meta === 'object') ? { ...item.pivot.meta } : {};
            this.debouncedMetaUpdate(colKey, mediaId, { ...existing, alt: alt || undefined });
        },
        debouncedMetaUpdate(colKey, mediaId, meta) {
            clearTimeout(this._metaTimeout);
            this._metaTimeout = setTimeout(() => {
                this.doMetaUpdate(colKey, mediaId, meta);
            }, 500);
        },
        async doMetaUpdate(colKey, mediaId, meta) {
            try {
                const base = `/api/admin/cms/${this.entityType}/${this.entityId}/media`;
                const { data } = await axios.put(`${base}/meta`, { collection: colKey, media_id: mediaId, meta });
                this.emitUpdated(data.data);
            } catch (err) {
                this.handleApiError(err);
            }
        },
        emitUpdated(entityData) {
            this.error = null;
            this.$emit('updated', entityData);
        },
        handleApiError(err) {
            const msg = err.response?.data?.message
                || (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(', '))
                || 'Ошибка операции';
            this.error = msg;
            if (err.response?.status === 422) {
                Swal.fire({ title: 'Ошибка', text: msg, icon: 'error' });
            } else if (err.response?.status === 401 || err.response?.status === 403) {
                Swal.fire({ title: 'Ошибка доступа', text: msg, icon: 'error' });
            }
        },
        getPreviewUrl(item) {
            if (!item || !item.url) return null;
            if (item.url.startsWith('http://') || item.url.startsWith('https://')) return item.url;
            return item.url.startsWith('/') ? item.url : '/' + item.url;
        },
        handleImageError(e) {
            if (e.target) e.target.style.display = 'none';
        },
        isImage(item) {
            return item?.type === 'photo' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes((item?.extension || '').toLowerCase());
        },
        getAlt(item) {
            return item?.pivot?.meta?.alt ?? '';
        },
    },
};
</script>
