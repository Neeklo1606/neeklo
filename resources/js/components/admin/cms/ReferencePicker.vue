<template>
    <div class="reference-picker rounded-lg border border-border p-4 bg-background/50">
        <div class="flex gap-2 mb-3">
            <span class="px-2 py-2 text-sm text-muted-foreground shrink-0">{{ refTypeLabel }}</span>
            <input
                v-model="search"
                @input="debouncedSearch"
                type="text"
                placeholder="Поиск..."
                class="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
            />
        </div>
        <div v-if="loading" class="py-4 text-center text-sm text-muted-foreground">Загрузка...</div>
        <div v-else-if="options.length === 0" class="py-4 text-center text-sm text-muted-foreground">Нет результатов</div>
        <div v-else class="max-h-40 overflow-y-auto border border-border rounded p-2 space-y-1">
            <button
                v-for="opt in options"
                :key="opt.id"
                type="button"
                @click="pick(opt)"
                class="w-full text-left px-3 py-2 rounded text-sm hover:bg-muted/50 transition-colors"
            >
                {{ opt.title }} <span class="text-muted-foreground">#{{ opt.id }}</span>
            </button>
        </div>
        <div v-if="selected" class="mt-3 p-2 rounded bg-muted/30 text-sm">
            Выбрано: <strong>{{ selected.title }}</strong> (id: {{ selected.id }})
            <button type="button" @click="clear" class="ml-2 text-red-600 hover:underline text-xs">Сбросить</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

const API_MAP = {
    page: '/api/admin/cms/pages',
    service: '/api/admin/cms/services',
    case_study: '/api/admin/cms/case-studies',
    post: '/api/admin/cms/posts',
};

export default {
    name: 'ReferencePicker',
    props: {
        modelValue: { type: Object, default: null },
        refType: { type: String, default: 'page' },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            search: '',
            loading: false,
            options: [],
            searchTimeout: null,
        };
    },
    computed: {
        refTypeLabel() {
            return { page: 'Страницы', service: 'Услуги', case_study: 'Кейс-стади', post: 'Посты' }[this.refType] || this.refType;
        },
        selected: {
            get() { return this.modelValue; },
            set(v) { this.$emit('update:modelValue', v); },
        },
    },
    watch: {
        refType() { this.search = ''; this.options = []; this.fetch(); },
    },
    mounted() { this.fetch(); },
    methods: {
        debouncedSearch() {
            if (this.searchTimeout) clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => this.fetch(), 300);
        },
        async fetch() {
            this.loading = true;
            try {
                const params = { per_page: 20 };
                if (this.search.trim()) params.search = this.search.trim();
                const { data } = await axios.get(API_MAP[this.refType] || API_MAP.page, { params });
                this.options = data.data || [];
            } catch {
                this.options = [];
            } finally {
                this.loading = false;
            }
        },
        pick(opt) {
            this.$emit('update:modelValue', { id: opt.id, title: opt.title, type: this.refType });
        },
        clear() {
            this.$emit('update:modelValue', null);
        },
    },
};
</script>
