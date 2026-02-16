<template>
    <div class="menu-items-tree">
        <template v-for="(item, idx) in items" :key="item.id">
            <div
                class="flex items-center gap-2 py-2 border-b border-border"
                :style="{ paddingLeft: (level * 16) + 'px' }"
            >
                <div class="flex items-center gap-1 shrink-0">
                    <button
                        @click="$emit('move', item.id, -1)"
                        :disabled="idx === 0"
                        class="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Вверх"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                    </button>
                    <button
                        @click="$emit('move', item.id, 1)"
                        :disabled="idx === items.length - 1"
                        class="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Вниз"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>
                <div class="flex-1 min-w-0">
                    <span class="font-medium">{{ item.label }}</span>
                    <span class="text-muted-foreground text-sm ml-2">({{ item.type }}{{ item.url ? ': ' + (item.url.length > 30 ? item.url.slice(0,30)+'...' : item.url) : '' }}{{ item.ref_id ? ' #' + item.ref_id : '' }})</span>
                    <span v-if="!item.is_enabled" class="ml-2 text-xs text-amber-600">[выкл]</span>
                </div>
                <div class="flex gap-1 shrink-0 items-center flex-wrap">
                    <button v-if="item.parent_id" @click="$emit('changeParent', item.id, null)" class="px-2 py-1 text-xs rounded border border-border hover:bg-muted" title="Сделать root">Root</button>
                    <select
                        v-if="parentOptions(item).length > 0"
                        :value="item.parent_id ?? ''"
                        @change="onParentChange(item.id, $event.target.value)"
                        class="px-2 py-1 text-xs rounded border border-border bg-background text-foreground max-w-[120px]"
                        title="Родитель"
                    >
                        <option v-for="opt in parentOptions(item)" :key="opt.id ?? 'root'" :value="opt.id ?? ''">{{ opt.label }}</option>
                    </select>
                    <button @click="$emit('addChild', item.id)" class="px-2 py-1 text-xs rounded bg-primary/20 hover:bg-primary/30 text-primary">+ Child</button>
                    <button @click="$emit('edit', item)" class="px-2 py-1 text-xs rounded border border-border hover:bg-muted">Edit</button>
                    <button @click="$emit('remove', item)" class="px-2 py-1 text-xs rounded text-red-600 hover:bg-red-500/10">Delete</button>
                </div>
            </div>
            <MenuItemsTree
                v-if="item.children && item.children.length > 0"
                :items="item.children"
                :level="level + 1"
                :valid-parent-options="validParentOptions"
                @move="$emit('move', $event)"
                @addChild="$emit('addChild', $event)"
                @edit="$emit('edit', $event)"
                @remove="$emit('remove', $event)"
                @changeParent="(id, pid) => $emit('changeParent', id, pid)"
            />
        </template>
    </div>
</template>

<script>
export default {
    name: 'MenuItemsTree',
    props: {
        items: { type: Array, default: () => [] },
        level: { type: Number, default: 0 },
        validParentOptions: { type: Object, default: () => ({}) },
    },
    emits: ['move', 'addChild', 'edit', 'remove', 'changeParent'],
    methods: {
        parentOptions(item) {
            const opts = this.validParentOptions[item.id] || [];
            return opts;
        },
        onParentChange(itemId, val) {
            const newParentId = val === '' ? null : parseInt(val, 10);
            this.$emit('changeParent', itemId, newParentId);
        },
    },
};
</script>
