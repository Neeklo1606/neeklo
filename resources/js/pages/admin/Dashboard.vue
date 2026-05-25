<template>
    <div class="dashboard-page">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-foreground">Панель управления</h1>
            <p class="text-muted-foreground mt-1">Добро пожаловать в админ панель</p>
        </div>

        <SubscriptionInfo />

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-card rounded-lg border border-border p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-muted-foreground">Новые заявки</span>
                    <span v-if="stats.today_submissions > 0" class="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                        +{{ stats.today_submissions }} сегодня
                    </span>
                </div>
                <div v-if="loading" class="h-9 bg-muted/40 rounded animate-pulse w-16"></div>
                <div v-else class="text-3xl font-bold text-foreground">{{ stats.new_submissions ?? '—' }}</div>
                <router-link to="/submissions" class="text-xs text-primary hover:underline mt-2 inline-block">Открыть заявки →</router-link>
            </div>

            <div class="bg-card rounded-lg border border-border p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-muted-foreground">Всего кейсов</span>
                </div>
                <div v-if="loading" class="h-9 bg-muted/40 rounded animate-pulse w-16"></div>
                <div v-else class="text-3xl font-bold text-foreground">{{ stats.total_cases ?? '—' }}</div>
                <router-link to="/cases" class="text-xs text-primary hover:underline mt-2 inline-block">Управление кейсами →</router-link>
            </div>

            <div class="bg-card rounded-lg border border-border p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-muted-foreground">Опубликованных статей</span>
                </div>
                <div v-if="loading" class="h-9 bg-muted/40 rounded animate-pulse w-16"></div>
                <div v-else class="text-3xl font-bold text-foreground">{{ stats.published_posts ?? '—' }}</div>
                <router-link to="/posts" class="text-xs text-primary hover:underline mt-2 inline-block">Управление блогом →</router-link>
            </div>
        </div>

        <!-- Recent Submissions -->
        <div class="bg-card rounded-lg border border-border">
            <div class="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 class="text-lg font-semibold">Последние заявки</h2>
                <router-link to="/submissions" class="text-sm text-primary hover:underline">Все заявки →</router-link>
            </div>
            <div v-if="loading" class="p-6 text-center text-muted-foreground">Загрузка...</div>
            <div v-else-if="!stats.recent_submissions || stats.recent_submissions.length === 0" class="p-6 text-center text-muted-foreground">
                Нет заявок
            </div>
            <div v-else class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-muted/30 border-b border-border">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Имя</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Контакт</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Компания</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Статус</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Дата</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        <tr
                            v-for="sub in stats.recent_submissions"
                            :key="sub.id"
                            class="hover:bg-muted/10 cursor-pointer"
                            @click="$router.push('/submissions?id=' + sub.id)"
                        >
                            <td class="px-6 py-4 text-sm font-medium text-foreground">{{ sub.name }}</td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ sub.phone || sub.email || '—' }}</td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ sub.company || '—' }}</td>
                            <td class="px-6 py-4 text-sm">
                                <span class="px-2 py-1 text-xs rounded" :class="statusClass(sub.status)">
                                    {{ statusLabel(sub.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-muted-foreground">{{ formatDate(sub.created_at) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="error" class="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{{ error }}</div>
    </div>
</template>

<script>
import axios from 'axios';
import SubscriptionInfo from '../../components/admin/SubscriptionInfo.vue';

export default {
    name: 'Dashboard',
    components: { SubscriptionInfo },
    data() {
        return {
            stats: {},
            loading: true,
            error: null,
        };
    },
    mounted() {
        this.fetchStats();
    },
    methods: {
        async fetchStats() {
            this.loading = true;
            this.error = null;
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/admin/dashboard/stats', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                this.stats = res.data;
            } catch (e) {
                this.error = 'Не удалось загрузить статистику';
            } finally {
                this.loading = false;
            }
        },
        statusClass(status) {
            const map = {
                new:       'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                contacted: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
                in_work:   'bg-purple-500/10 text-purple-600 dark:text-purple-400',
                done:      'bg-green-500/10 text-green-600 dark:text-green-400',
                rejected:  'bg-red-500/10 text-red-500',
            };
            return map[status] || 'bg-muted/30 text-muted-foreground';
        },
        statusLabel(status) {
            const map = {
                new: 'Новая', contacted: 'Связались', in_work: 'В работе',
                done: 'Готово', rejected: 'Отклонено',
            };
            return map[status] || status;
        },
        formatDate(dt) {
            if (!dt) return '—';
            return new Date(dt).toLocaleDateString('ru-RU', {
                day: '2-digit', month: '2-digit', year: 'numeric',
            });
        },
    },
};
</script>
