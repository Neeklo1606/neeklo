<template>
    <div>
        <textarea
            v-model="raw"
            @blur="onBlur"
            :class="[
                'w-full px-3 py-2 rounded-lg bg-background border font-mono text-sm',
                hasError ? 'border-red-500' : 'border-border',
            ]"
            rows="6"
            :placeholder="placeholder"
        ></textarea>
        <p v-if="hasError" class="mt-1 text-sm text-red-500">{{ errorMessage }}</p>
    </div>
</template>

<script>
export default {
    name: 'JsonTextarea',
    props: {
        modelValue: {
            type: [Object, Array],
            default: null,
        },
        placeholder: {
            type: String,
            default: '{}',
        },
    },
    emits: ['update:modelValue', 'error'],
    data() {
        return {
            raw: '',
            localError: null,
        };
    },
    computed: {
        hasError() {
            return !!this.localError;
        },
        errorMessage() {
            return this.localError || '';
        },
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(val) {
                if (val === null || val === undefined) {
                    this.raw = '';
                } else if (typeof val === 'object') {
                    try {
                        const s = JSON.stringify(val, null, 2);
                        if (this.raw !== s) this.raw = s;
                    } catch {
                        // ignore
                    }
                }
            },
        },
    },
    methods: {
        onBlur() {
            this.validate();
        },
        validate() {
            this.localError = null;
            const trimmed = this.raw.trim();
            if (!trimmed) {
                this.$emit('update:modelValue', null);
                this.$emit('error', null);
                return true;
            }
            try {
                const parsed = JSON.parse(trimmed);
                this.$emit('update:modelValue', parsed);
                this.$emit('error', null);
                return true;
            } catch (err) {
                this.localError = 'Некорректный JSON: ' + (err.message || 'ошибка парсинга');
                this.$emit('error', this.localError);
                return false;
            }
        },
    },
};
</script>
