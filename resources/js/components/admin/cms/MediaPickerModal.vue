<template>
    <Teleport to="body">
        <div
            v-if="show"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            @click.self="$emit('close')"
        >
            <div class="bg-background border border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col m-4">
                <div class="p-4 border-b border-border flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Выбор медиа</h3>
                    <button @click="$emit('close')" class="p-1 rounded hover:bg-muted">✕</button>
                </div>
                <div class="p-4 border-b border-border">
                    <input
                        v-model="search"
                        @input="debouncedFetch"
                        type="text"
                        placeholder="Поиск по имени..."
                        class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"
                    />
                </div>
                <div class="flex-1 overflow-y-auto p-4">
                    <div v-if="loading" class="text-center py-8 text-muted-foreground">Загрузка...</div>
                    <div v-else-if="mediaList.length === 0" class="text-center py-8 text-muted-foreground">Нет медиа</div>
                    <div v-else class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        <div
                            v-for="item in mediaList"
                            :key="item.id"
                            @click="toggleSelect(item.id)"
                            :class="[
                                'p-2 rounded-lg border cursor-pointer transition-colors',
                                isSelected(item.id)
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50',
                            ]"
                        >
                            <div class="aspect-square rounded overflow-hidden bg-muted/30 mb-2 flex items-center justify-center">
                                <img
                                    v-if="item.type === 'photo' && getPreviewUrl(item)"
                                    :src="getPreviewUrl(item)"
                                    :alt="item.original_name"
                                    class="w-full h-full object-cover"
                                    @error="handleImageError"
                                />
                                <div v-else class="text-4xl text-muted-foreground">
                                    {{ item.type === 'video' ? '🎬' : item.type === 'document' ? '📄' : '📁' }}
                                </div>
                            </div>
                            <p class="text-xs font-medium truncate" :title="item.original_name">{{ item.original_name }}</p>
                            <p class="text-xs text-muted-foreground">{{ item.type }} · {{ formatSize(item.size) }}</p>
                            <div v-if="mode === 'single'" class="mt-1">
                                <span v-if="isSelected(item.id)" class="text-xs text-primary">✓ Выбрано</span>
                            </div>
                            <div v-else class="mt-1">
                                <input
                                    type="checkbox"
                                    :checked="isSelected(item.id)"
                                    @change.prevent="toggleSelect(item.id)"
                                    class="rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-4 border-t border-border flex items-center justify-between">
                    <div class="text-sm text-muted-foreground">
                        <span v-if="pagination">Стр. {{ pagination.current_page }} / {{ pagination.last_page }}</span>
                    </div>
                    <div class="flex gap-2">
                        <button
                            v-if="pagination && pagination.current_page > 1"
                            @click="goPage(pagination.current_page - 1)"
                            class="px-3 py-1 rounded border border-border hover:bg-muted text-sm"
                        >
                            ←
                        </button>
                        <button
                            v-if="pagination && pagination.current_page < pagination.last_page"
                            @click="goPage(pagination.current_page + 1)"
                            class="px-3 py-1 rounded border border-border hover:bg-muted text-sm"
                        >
                            →
                        </button>
                        <button
                            @click="confirmSelect"
                            :disabled="selectedIds.length === 0"
                            class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 text-sm"
                        >
                            Выбрать ({{ selectedIds.length }})
                        </button>
                        <button @click="$emit('close')" class="px-4 py-2 rounded-lg border border-border hover:bg-muted text-sm">
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script>
import axios from 'axios';

export default {
    name: 'MediaPickerModal',
    props: {
        show: { type: Boolean, default: false },
        mode: { type: String, default: 'single' },
        initialSelectedIds: { type: Array, default: () => [] },
    },
    emits: ['close', 'selected'],
    data() {
        return {
            mediaList: [],
            loading: false,
            search: '',
            page: 1,
            perPage: 20,
            pagination: null,
            selectedIds: [],
            searchTimeout: null,
        };
    },
    watch: {
        show(val) {
            if (val) {
                this.selectedIds = [...(this.initialSelectedIds || [])];
                this.fetchMedia();
            }
        },
    },
    methods: {
        debouncedFetch() {
            if (this.searchTimeout) clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.page = 1;
                this.fetchMedia();
            }, 300);
        },
        async fetchMedia() {
            this.loading = true;
            try {
                const params = { page: this.page, per_page: this.perPage };
                if (this.search.trim()) params.search = this.search.trim();
                const { data } = await axios.get('/api/v1/media', { params });
                this.mediaList = data.data || [];
                this.pagination = data.meta || null;
            } catch (err) {
                console.error('Media fetch error:', err);
                this.mediaList = [];
            } finally {
                this.loading = false;
            }
        },
        goPage(p) {
            this.page = p;
            this.fetchMedia();
        },
        getPreviewUrl(item) {
            if (!item || !item.url) return null;
            return item.url.startsWith('/') ? item.url : '/' + item.url;
        },
        handleImageError(e) {
            e.target.style.display = 'none';
        },
        formatSize(bytes) {
            if (!bytes) return '-';
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / 1024 / 1024).toFixed(1) + ' MB';
        },
        isSelected(id) {
            return this.selectedIds.includes(id);
        },
        toggleSelect(id) {
            if (this.mode === 'single') {
                this.selectedIds = this.isSelected(id) ? [] : [id];
            } else {
                if (this.isSelected(id)) {
                    this.selectedIds = this.selectedIds.filter((x) => x !== id);
                } else {
                    this.selectedIds = [...this.selectedIds, id];
                }
            }
        },
        confirmSelect() {
            this.$emit('selected', this.mode === 'single' ? (this.selectedIds[0] ?? null) : [...this.selectedIds]);
            this.$emit('close');
        },
    },
};
</script>
