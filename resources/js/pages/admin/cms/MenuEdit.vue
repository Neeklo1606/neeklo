<template>
    <div class="menu-edit">
        <div class="mb-6 flex items-center justify-between">
            <div>
                <router-link to="/admin/menus" class="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">← Меню</router-link>
                <h1 class="text-2xl font-bold text-foreground">Редактирование меню</h1>
            </div>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">{{ error }}</div>
        <div v-if="saved" class="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400">Сохранено</div>
        <div v-if="loading" class="py-8 text-muted-foreground">Загрузка...</div>

        <template v-else>
            <div class="rounded-lg bg-card border border-border p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">Меню</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                    <div>
                        <label class="block text-sm font-medium mb-2">Key</label>
                        <input v-model="menuForm.key" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-mono" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Title</label>
                        <input v-model="menuForm.title" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                    </div>
                </div>
                <button @click="saveMenu" :disabled="savingMenu" class="mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{{ savingMenu ? 'Сохранение...' : 'Сохранить меню' }}</button>
            </div>

            <div class="rounded-lg bg-card border border-border p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold">Пункты меню</h2>
                    <button @click="openAddRoot" class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm">+ Добавить пункт</button>
                </div>
                <div v-if="itemsTree.length === 0" class="py-8 text-center text-muted-foreground text-sm rounded-lg border border-dashed border-border">
                    Нет пунктов. Нажмите «Добавить пункт».
                </div>
                <MenuItemsTree
                    v-else
                    :items="itemsTree"
                    :level="0"
                    :valid-parent-options="validParentOptions"
                    @move="onMove"
                    @addChild="openAddChild"
                    @edit="openEdit"
                    @remove="onRemove"
                    @changeParent="onChangeParent"
                />
            </div>

            <!-- Item Form Modal -->
            <div v-if="itemFormVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="cancelItemForm">
                <div class="rounded-lg bg-card border border-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" @click.stop>
                    <h3 class="text-lg font-semibold mb-4">{{ editingItemId ? 'Редактировать пункт' : 'Новый пункт' }}</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Label *</label>
                            <input v-model="itemForm.label" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Type *</label>
                            <select v-model="itemForm.type" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground">
                                <option value="url">url</option>
                                <option value="page">page</option>
                                <option value="service">service</option>
                                <option value="case_study">case_study</option>
                                <option value="post">post</option>
                            </select>
                        </div>
                        <div>
                            <label class="flex items-center gap-2">
                                <input v-model="itemForm.is_enabled" type="checkbox" class="rounded" />
                                <span class="text-sm">is_enabled</span>
                            </label>
                        </div>
                        <div v-if="itemForm.type === 'url'">
                            <label class="block text-sm font-medium mb-2">URL *</label>
                            <input v-model="itemForm.url" type="text" placeholder="/about" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                        </div>
                        <div v-if="['page','service','case_study','post'].includes(itemForm.type)">
                            <label class="block text-sm font-medium mb-2">Reference</label>
                            <ReferencePicker
                                :ref-type="itemForm.type"
                                :model-value="refSelected"
                                @update:model-value="onRefSelected"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Meta (JSON)</label>
                            <textarea v-model="itemForm.metaStr" rows="2" placeholder="{}" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-mono text-sm"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex gap-3">
                        <button @click="saveItem" :disabled="savingItem" class="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{{ savingItem ? 'Сохранение...' : 'Сохранить' }}</button>
                        <button @click="cancelItemForm" class="px-6 py-2 rounded-lg border border-border hover:bg-muted">Отмена</button>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import MenuItemsTree from '../../../components/admin/cms/MenuItemsTree.vue';
import ReferencePicker from '../../../components/admin/cms/ReferencePicker.vue';

function flattenTree(items, parentId = null) {
    const out = [];
    (items || []).forEach((item, pos) => {
        out.push({ id: item.id, position: pos, parent_id: parentId });
        if (item.children && item.children.length) {
            out.push(...flattenTree(item.children, item.id));
        }
    });
    return out;
}

function collectDescendantIds(items, itemId) {
    const ids = new Set();
    const item = findItemInTree(items, itemId);
    if (!item) return ids;
    const recurse = (list) => {
        (list || []).forEach((i) => {
            ids.add(i.id);
            if (i.children?.length) recurse(i.children);
        });
    };
    if (item.children?.length) recurse(item.children);
    return ids;
}

function findItemInTree(items, itemId) {
    for (const i of items || []) {
        if (i.id === parseInt(itemId, 10)) return i;
        const found = findItemInTree(i.children, itemId);
        if (found) return found;
    }
    return null;
}

function collectAllItemsWithParent(items, parentId = null) {
    const out = [];
    (items || []).forEach((item) => {
        out.push({ ...item, _parent_id: parentId });
        if (item.children?.length) out.push(...collectAllItemsWithParent(item.children, item.id));
    });
    return out;
}

function moveItemAndRebuildTree(itemsTree, itemId, newParentId) {
    const flat = collectAllItemsWithParent(itemsTree);
    const moved = flat.find((f) => f.id === parseInt(itemId, 10));
    if (!moved) return itemsTree;
    moved._parent_id = newParentId;
    const byParent = {};
    flat.forEach((f) => {
        const pid = f._parent_id;
        if (!byParent[pid]) byParent[pid] = [];
        byParent[pid].push(f);
    });
    const buildNode = (item) => {
        const { _parent_id, children: _, ...rest } = item;
        const kids = (byParent[item.id] || []).map(buildNode);
        return { ...rest, parent_id: _parent_id, children: kids };
    };
    const roots = (byParent[null] || []).map(buildNode);
    return roots;
}

function swapSibling(items, itemId, delta) {
    const list = items || [];
    const idx = list.findIndex((i) => i.id === parseInt(itemId, 10));
    if (idx >= 0) {
        const newIdx = idx + delta;
        if (newIdx >= 0 && newIdx < list.length) {
            [list[idx], list[newIdx]] = [list[newIdx], list[idx]];
            return true;
        }
        return false;
    }
    for (let i = 0; i < list.length; i++) {
        if (list[i].children && swapSibling(list[i].children, itemId, delta)) return true;
    }
    return false;
}

export default {
    name: 'CmsMenuEdit',
    components: { MenuItemsTree, ReferencePicker },
    data() {
        return {
            menuId: null,
            loading: true,
            error: null,
            saved: false,
            savingMenu: false,
            menuForm: { key: '', title: '' },
            itemsTree: [],
            itemFormVisible: false,
            editingItemId: null,
            addParentId: null,
            savingItem: false,
            refSelected: null,
            itemForm: {
                label: '',
                type: 'url',
                url: '',
                ref_id: null,
                is_enabled: true,
                metaStr: '{}',
            },
        };
    },
    computed: {
        validParentOptions() {
            const opts = {};
            const flat = collectAllItemsWithParent(this.itemsTree);
            flat.forEach((item) => {
                const excluded = new Set([item.id, ...collectDescendantIds(this.itemsTree, item.id)]);
                const valid = [{ id: null, label: '— Root —' }, ...flat.filter((f) => !excluded.has(f.id)).map((f) => ({ id: f.id, label: f.label || `#${f.id}` }))];
                opts[item.id] = valid;
            });
            return opts;
        },
    },
    watch: { saved(val) { if (val) setTimeout(() => { this.saved = false; }, 3000); } },
    mounted() {
        this.menuId = this.$route.params.id;
        this.fetch();
    },
    methods: {
        async fetch() {
            this.loading = true;
            this.error = null;
            try {
                const [menuRes, itemsRes] = await Promise.all([
                    axios.get(`/api/admin/cms/menus/${this.menuId}`),
                    axios.get(`/api/admin/cms/menus/${this.menuId}/items`),
                ]);
                const m = menuRes.data.data;
                this.menuForm = { key: m.key || '', title: m.title || '' };
                this.itemsTree = itemsRes.data.data || [];
            } catch (err) {
                this.handleApiError(err, 'Ошибка загрузки');
            } finally {
                this.loading = false;
            }
        },
        async saveMenu() {
            this.savingMenu = true;
            this.error = null;
            try {
                await axios.put(`/api/admin/cms/menus/${this.menuId}`, this.menuForm);
                this.saved = true;
            } catch (err) {
                this.handleApiError(err, 'Ошибка сохранения меню');
            } finally {
                this.savingMenu = false;
            }
        },
        openAddRoot() {
            this.editingItemId = null;
            this.addParentId = null;
            this.resetItemForm();
            this.itemFormVisible = true;
        },
        openAddChild(parentId) {
            this.editingItemId = null;
            this.addParentId = parentId;
            this.resetItemForm();
            this.itemFormVisible = true;
        },
        openEdit(item) {
            this.editingItemId = item.id;
            this.addParentId = null;
            this.itemForm = {
                label: item.label || '',
                type: item.type || 'url',
                url: item.url || '',
                ref_id: item.ref_id ?? null,
                is_enabled: item.is_enabled !== false,
                metaStr: typeof item.meta === 'object' ? JSON.stringify(item.meta || {}, null, 2) : (item.meta || '{}'),
            };
            this.refSelected = item.ref_id ? { id: item.ref_id, title: item.label, type: item.type } : null;
            this.itemFormVisible = true;
        },
        resetItemForm() {
            this.itemForm = { label: '', type: 'url', url: '', ref_id: null, is_enabled: true, metaStr: '{}' };
            this.refSelected = null;
        },
        onRefSelected(v) {
            this.refSelected = v;
            this.itemForm.ref_id = v ? v.id : null;
        },
        cancelItemForm() {
            this.itemFormVisible = false;
            this.editingItemId = null;
            this.addParentId = null;
        },
        async saveItem() {
            this.savingItem = true;
            this.error = null;
            let meta = null;
            try {
                if (this.itemForm.metaStr.trim()) {
                    meta = JSON.parse(this.itemForm.metaStr);
                }
            } catch {
                Swal.fire({ title: 'Ошибка', text: 'Meta: неверный JSON', icon: 'error' });
                this.savingItem = false;
                return;
            }
            const payload = {
                label: this.itemForm.label || 'Item',
                type: this.itemForm.type,
                is_enabled: this.itemForm.is_enabled,
                url: this.itemForm.type === 'url' ? (this.itemForm.url || '/') : null,
                ref_id: ['page','service','case_study','post'].includes(this.itemForm.type) ? (this.itemForm.ref_id ?? this.refSelected?.id) : null,
                meta,
            };
            if (!this.editingItemId) payload.parent_id = this.addParentId;
            try {
                if (this.editingItemId) {
                    await axios.put(`/api/admin/cms/menu-items/${this.editingItemId}`, payload);
                    Swal.fire({ title: 'Сохранено', icon: 'success', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
                } else {
                    await axios.post(`/api/admin/cms/menus/${this.menuId}/items`, payload);
                    Swal.fire({ title: 'Создано', icon: 'success', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
                }
                this.cancelItemForm();
                this.fetch();
            } catch (err) {
                this.handleApiError(err, 'Ошибка сохранения пункта');
            } finally {
                this.savingItem = false;
            }
        },
        onMove(itemId, delta) {
            if (!swapSibling(this.itemsTree, itemId, delta)) return;
            this.saveReorder();
        },
        onChangeParent(itemId, newParentId) {
            this.itemsTree = moveItemAndRebuildTree(this.itemsTree, itemId, newParentId);
            this.saveReorder();
        },
        async saveReorder() {
            const flat = flattenTree(this.itemsTree);
            try {
                const { data } = await axios.post(`/api/admin/cms/menus/${this.menuId}/items/reorder`, { items: flat });
                this.itemsTree = data.data || [];
            } catch (err) {
                this.handleApiError(err, 'Ошибка изменения порядка');
            }
        },
        async onRemove(item) {
            const result = await Swal.fire({
                title: 'Удалить?',
                html: `Пункт <strong>${item.label}</strong> будет удалён.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Да, удалить',
                cancelButtonText: 'Отмена',
                confirmButtonColor: '#dc2626',
            });
            if (!result.isConfirmed) return;
            try {
                await axios.delete(`/api/admin/cms/menu-items/${item.id}`);
                Swal.fire({ title: 'Удалено', icon: 'success', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
                this.fetch();
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
