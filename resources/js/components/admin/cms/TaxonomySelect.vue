<template>
    <div class="taxonomy-select">
        <label v-if="label" class="block text-sm font-medium mb-2">{{ label }}</label>
        <div class="rounded-lg border border-border bg-background overflow-hidden">
            <input
                v-model="search"
                type="text"
                placeholder="Поиск..."
                class="w-full px-3 py-2 border-b border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <div class="max-h-48 overflow-y-auto p-2">
                <div v-if="loading" class="py-4 text-center text-muted-foreground text-sm">Загрузка...</div>
                <div v-else-if="filteredItems.length === 0" class="py-4 text-center text-muted-foreground text-sm">Нет таксономий</div>
                <label
                    v-for="item in filteredItems"
                    :key="item.id"
                    class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer"
                >
                    <input
                        type="checkbox"
                        :checked="isSelected(item.id)"
                        @change="toggle(item.id)"
                        class="rounded"
                    />
                    <span class="text-sm">{{ item.title }}</span>
                    <span class="text-xs text-muted-foreground">({{ item.type }})</span>
                </label>
            </div>
        </div>
        <p v-if="selectedIds.length > 0" class="mt-1 text-xs text-muted-foreground">Выбрано: {{ selectedIds.length }}</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'TaxonomySelect',
    props: {
        modelValue: { type: Array, default: () => [] },
        types: { type: [Array, String], default: () => ['tag', 'category'] },
        label: { type: String, default: '' },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            items: [],
            search: '',
            loading: false,
        };
    },
    computed: {
        typesArr() {
            return Array.isArray(this.types) ? this.types : [this.types];
        },
        selectedIds() {
            return this.modelValue || [];
        },
        filteredItems() {
            const q = (this.search || '').trim().toLowerCase();
            if (!q) return this.items;
            return this.items.filter(
                (i) =>
                    (i.title || '').toLowerCase().includes(q) ||
                    (i.slug || '').toLowerCase().includes(q)
            );
        },
    },
    watch: {
        typesArr: { immediate: true, handler() { this.fetch(); } },
    },
    mounted() {
        this.fetch();
    },
    methods: {
        async fetch() {
            this.loading = true;
            try {
                const all = [];
                for (const type of this.typesArr) {
                    const { data } = await axios.get('/api/admin/cms/taxonomies', {
                        params: { type, per_page: 200 },
                    });
                    all.push(...(data.data || []));
                }
                const seen = new Set();
                this.items = all.filter((i) => {
                    if (seen.has(i.id)) return false;
                    seen.add(i.id);
                    return true;
                });
            } catch (err) {
                this.items = [];
            } finally {
                this.loading = false;
            }
        },
        isSelected(id) {
            return this.selectedIds.includes(id);
        },
        toggle(id) {
            const arr = [...this.selectedIds];
            const idx = arr.indexOf(id);
            if (idx >= 0) arr.splice(idx, 1);
            else arr.push(id);
            this.$emit('update:modelValue', arr);
        },
    },
};
</script>
