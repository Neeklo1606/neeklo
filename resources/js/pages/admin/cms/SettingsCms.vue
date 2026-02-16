<template>
    <div class="settings-cms">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-foreground">Настройки CMS</h1>
            <p class="text-muted-foreground mt-1">Глобальные настройки контента</p>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">{{ error }}</div>
        <div v-if="saved" class="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400">Сохранено</div>

        <div class="flex gap-2 border-b border-border pb-2 mb-6">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="selectTab(tab.id)"
                :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted text-foreground']"
            >
                {{ tab.label }}
            </button>
        </div>

        <div v-if="loading" class="py-8 text-muted-foreground">Загрузка...</div>
        <template v-else>
            <div v-if="activeTab === 'contacts'" class="rounded-lg bg-card border border-border p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">Контакты</h2>
                <div class="space-y-4 max-w-xl">
                    <div>
                        <label class="block text-sm font-medium mb-2">Phones</label>
                        <div v-for="(p, i) in form.phones" :key="i" class="flex gap-2 mb-2">
                            <input v-model="form.phones[i]" type="text" placeholder="+7 (999) 123-45-67" class="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                            <button @click="removePhone(i)" type="button" class="px-3 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-500/10">×</button>
                        </div>
                        <button @click="addPhone" type="button" class="px-3 py-2 rounded-lg border border-border hover:bg-muted text-sm">+ Добавить</button>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Address</label>
                        <input v-model="form.address" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Email</label>
                        <input v-model="form.email" type="email" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'social'" class="rounded-lg bg-card border border-border p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">Соцсети</h2>
                <div class="space-y-4 max-w-xl">
                    <div><label class="block text-sm font-medium mb-2">Telegram</label><input v-model="form.telegram" type="text" placeholder="https://t.me/..." class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" /></div>
                    <div><label class="block text-sm font-medium mb-2">VK</label><input v-model="form.vk" type="text" placeholder="https://vk.com/..." class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" /></div>
                    <div><label class="block text-sm font-medium mb-2">WhatsApp</label><input v-model="form.whatsapp" type="text" placeholder="https://wa.me/..." class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" /></div>
                    <div><label class="block text-sm font-medium mb-2">Instagram</label><input v-model="form.instagram" type="text" placeholder="https://instagram.com/..." class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" /></div>
                </div>
            </div>

            <div v-if="activeTab === 'seo'" class="rounded-lg bg-card border border-border p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">SEO</h2>
                <div class="space-y-4 max-w-xl">
                    <div><label class="block text-sm font-medium mb-2">default_title</label><input v-model="form.default_title" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" /></div>
                    <div><label class="block text-sm font-medium mb-2">default_description</label><input v-model="form.default_description" type="text" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground" /></div>
                </div>
            </div>

            <div v-if="otherKeys.length > 0" class="rounded-lg bg-card border border-border p-6 mb-6">
                <h2 class="text-lg font-semibold mb-4">Прочие</h2>
                <div class="space-y-4">
                    <div v-for="item in otherKeys" :key="item.key" class="flex flex-col gap-2">
                        <label class="text-sm font-medium">{{ item.key }}</label>
                        <JsonTextarea v-if="isObjectOrArray(item.value)" v-model="form.other[item.key]" :placeholder="'{}'" @error="onJsonError" />
                        <input v-else v-model="form.other[item.key]" type="text" class="w-full max-w-xl px-3 py-2 rounded-lg bg-background border border-border text-foreground" />
                    </div>
                </div>
            </div>

            <button @click="save" :disabled="saving" class="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{{ saving ? 'Сохранение...' : 'Сохранить' }}</button>
        </template>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import JsonTextarea from '../../../components/admin/cms/JsonTextarea.vue';

const TYPED_KEYS = {
    contacts: ['phones', 'address', 'email'],
    social: ['telegram', 'vk', 'whatsapp', 'instagram'],
    seo: ['default_title', 'default_description'],
};

function getByKey(data, key) {
    const item = data.find((s) => s.key === key);
    if (!item) return null;
    const v = item.value;
    if (key === 'phones' && Array.isArray(v)) return v;
    if (Array.isArray(v) && v.length > 0) return v[0];
    if (typeof v === 'string') return v;
    if (typeof v === 'number') return String(v);
    return v;
}

export default {
    name: 'CmsSettingsCms',
    components: { JsonTextarea },
    data() {
        return {
            activeTab: 'contacts',
            tabs: [
                { id: 'contacts', label: 'Контакты' },
                { id: 'social', label: 'Соцсети' },
                { id: 'seo', label: 'SEO' },
            ],
            loading: true,
            error: null,
            saved: false,
            saving: false,
            rawData: [],
            form: {
                phones: [''],
                address: '',
                email: '',
                telegram: '',
                vk: '',
                whatsapp: '',
                instagram: '',
                default_title: '',
                default_description: '',
                other: {},
            },
        };
    },
    computed: {
        otherKeys() {
            const typed = [...TYPED_KEYS.contacts, ...TYPED_KEYS.social, ...TYPED_KEYS.seo];
            return this.rawData.filter((s) => s.group === this.activeTab && !typed.includes(s.key));
        },
    },
    watch: { saved(val) { if (val) setTimeout(() => { this.saved = false; }, 3000); } },
    mounted() { this.fetch(); },
    methods: {
        selectTab(id) {
            this.activeTab = id;
            this.fetch();
        },
        async fetch() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get('/api/admin/cms/settings', { params: { group: this.activeTab } });
                this.rawData = data.data || [];
                this.fillForm();
            } catch (err) {
                this.handleApiError(err, 'Ошибка загрузки');
            } finally {
                this.loading = false;
            }
        },
        fillForm() {
            const d = this.rawData;
            const phonesVal = d.find((s) => s.key === 'phones')?.value;
            this.form.phones = Array.isArray(phonesVal) && phonesVal.length > 0 ? [...phonesVal] : [''];
            this.form.address = getByKey(d, 'address') ?? '';
            this.form.email = getByKey(d, 'email') ?? '';
            this.form.telegram = getByKey(d, 'telegram') ?? '';
            this.form.vk = getByKey(d, 'vk') ?? '';
            this.form.whatsapp = getByKey(d, 'whatsapp') ?? '';
            this.form.instagram = getByKey(d, 'instagram') ?? '';
            this.form.default_title = getByKey(d, 'default_title') ?? '';
            this.form.default_description = getByKey(d, 'default_description') ?? '';
            this.form.other = {};
            this.otherKeys.forEach((s) => { this.form.other[s.key] = s.value; });
        },
        addPhone() { this.form.phones.push(''); },
        removePhone(i) { this.form.phones.splice(i, 1); if (this.form.phones.length === 0) this.form.phones = ['']; },
        isObjectOrArray(v) {
            return v !== null && typeof v === 'object';
        },
        onJsonError(e) { this.error = e || 'Неверный JSON'; },
        buildSettingsPayload() {
            const settings = [];
            const g = this.activeTab;
            if (g === 'contacts') {
                settings.push({ group: g, key: 'phones', value: this.form.phones.filter((p) => String(p || '').trim()) });
                settings.push({ group: g, key: 'address', value: this.form.address ? [this.form.address] : [] });
                settings.push({ group: g, key: 'email', value: this.form.email ? [this.form.email] : [] });
            } else if (g === 'social') {
                ['telegram', 'vk', 'whatsapp', 'instagram'].forEach((k) => { settings.push({ group: g, key: k, value: this.form[k] ? [this.form[k]] : [] }); });
            } else if (g === 'seo') {
                settings.push({ group: g, key: 'default_title', value: this.form.default_title ? [this.form.default_title] : [] });
                settings.push({ group: g, key: 'default_description', value: this.form.default_description ? [this.form.default_description] : [] });
            }
            Object.entries(this.form.other || {}).forEach(([k, v]) => {
                const val = Array.isArray(v) ? v : (typeof v === 'object' && v !== null ? v : [v]);
                settings.push({ group: g, key: k, value: val });
            });
            return { settings };
        },
        async save() {
            this.saving = true;
            this.error = null;
            try {
                const payload = this.buildSettingsPayload();
                if (payload.settings.length === 0) { this.saving = false; return; }
                await axios.put('/api/admin/cms/settings/bulk', payload);
                this.saved = true;
                this.fetch();
            } catch (err) {
                this.handleApiError(err, 'Ошибка сохранения');
            } finally {
                this.saving = false;
            }
        },
        handleApiError(err, fallback) {
            this.error = err.response?.data?.message || (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(', ')) || fallback;
            if (err.response?.status === 422) Swal.fire({ title: 'Ошибка валидации', text: this.error, icon: 'error' });
            else if (err.response?.status === 401 || err.response?.status === 403) Swal.fire({ title: 'Ошибка доступа', text: this.error, icon: 'error' });
        },
    },
};
</script>
