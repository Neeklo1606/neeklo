// КРИТИЧНО: Фильтрация ошибок расширений браузера ДО импорта других модулей
// Это должно быть самым первым кодом, который выполняется
(function() {
    'use strict';
    if (typeof window === 'undefined') return;
    
    // Перехватываем ошибки ДО загрузки Vue/React
    const originalErrorHandler = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        // Игнорируем ошибки из расширений браузера
        if (source && (
            source.includes('chrome-extension://') ||
            source.includes('moz-extension://') ||
            source.includes('safari-extension://') ||
            source.includes('adblock') ||
            source.includes('content.js') ||
            source.includes('counter.js') ||
            source.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
            source.includes('Error handling response')
        )) {
            return true; // Предотвращаем показ ошибки
        }
        // Также проверяем сообщение об ошибке (в т.ч. AdBlock: Error handling response, message port closed)
        if (message && typeof message === 'string') {
            const msgLower = message.toLowerCase();
            if (msgLower.includes('chrome-extension://') ||
                msgLower.includes('moz-extension://') ||
                msgLower.includes('safari-extension://') ||
                msgLower.includes('adblock') ||
                msgLower.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
                msgLower.includes('error handling response') ||
                (msgLower.includes('indexof') && (msgLower.includes('undefined') || msgLower.includes('reading'))) ||
                msgLower.includes("reading 'indexof'") ||
                msgLower.includes('safari is not defined') ||
                msgLower.includes('uncaught referenceerror: safari') ||
                (msgLower.includes('cannot read properties') && (msgLower.includes('indexof') || msgLower.includes('undefined'))) ||
                msgLower.includes('unchecked runtime.lasterror') ||
                msgLower.includes('message port closed') ||
                msgLower.includes('the message port closed')) {
                return true;
            }
        }
        // Проверяем stack trace
        if (error && error.stack) {
            const stack = error.stack.toLowerCase();
            if (stack.includes('chrome-extension://') ||
                stack.includes('moz-extension://') ||
                stack.includes('safari-extension://') ||
                stack.includes('adblock') ||
                stack.includes('counter.js') ||
                stack.includes('content.js') ||
                stack.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) {
                return true;
            }
        }
        // Вызываем оригинальный обработчик для остальных ошибок
        if (originalErrorHandler) {
            return originalErrorHandler.call(this, message, source, lineno, colno, error);
        }
        return false;
    };
    
    // Перехватываем ошибки через addEventListener
    window.addEventListener('error', function(event) {
        if (event.filename && (
            event.filename.includes('chrome-extension://') ||
            event.filename.includes('moz-extension://') ||
            event.filename.includes('safari-extension://') ||
            event.filename.includes('adblock') ||
            event.filename.includes('content.js') ||
            event.filename.includes('counter.js') ||
            event.filename.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')
        )) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return false;
        }
        if (event.message) {
            const msgLower = event.message.toLowerCase();
            if (msgLower.includes('error handling response') ||
                (msgLower.includes('indexof') && (msgLower.includes('undefined') || msgLower.includes('reading'))) ||
                msgLower.includes("reading 'indexof'") ||
                msgLower.includes('safari is not defined') ||
                msgLower.includes('uncaught referenceerror: safari') ||
                (msgLower.includes('cannot read properties') && (msgLower.includes('indexof') || msgLower.includes('undefined'))) ||
                msgLower.includes('unchecked runtime.lasterror') ||
                msgLower.includes('message port closed') ||
                msgLower.includes('the message port closed')) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                return false;
            }
        }
    }, true);
    
    // Перехватываем необработанные промисы
    window.addEventListener('unhandledrejection', function(event) {
        const reason = event.reason;
        if (reason) {
            const message = (reason.message || String(reason) || '').toLowerCase();
            const stack = (reason.stack || '').toLowerCase();
            if (message.includes('error handling response') ||
                message.includes('chrome-extension://') ||
                message.includes('adblock') ||
                message.includes('safari is not defined') ||
                message.includes('indexof') ||
                message.includes('message port closed') ||
                message.includes('unchecked runtime.lasterror') ||
                message.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
                stack.includes('chrome-extension://') ||
                stack.includes('adblock') ||
                stack.includes('counter.js') ||
                stack.includes('content.js') ||
                stack.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                return false;
            }
        }
    }, true);
    
    // Фильтруем console.error
    const originalError = console.error;
    console.error = function(...args) {
        const errorString = args.join(' ').toLowerCase();
        if (errorString.includes('chrome-extension://') || 
            errorString.includes('moz-extension://') ||
            errorString.includes('safari-extension://') ||
            errorString.includes('adblock') ||
            errorString.includes('message port closed') ||
            errorString.includes('safari is not defined') ||
            errorString.includes('uncaught referenceerror: safari') ||
            errorString.includes('content.js') ||
            errorString.includes('counter.js') ||
            errorString.includes('indexof') ||
            errorString.includes('error handling response') ||
            errorString.includes('unchecked runtime.lasterror') ||
            errorString.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
            (errorString.includes('indexof') && errorString.includes('undefined')) ||
            (errorString.includes('cannot read properties') && errorString.includes('indexof'))) {
            return; // Не показываем эти ошибки
        }
        originalError.apply(console, args);
    };
    
    // Фильтруем console.warn
    const originalWarn = console.warn;
    console.warn = function(...args) {
        const warnString = args.join(' ').toLowerCase();
        if (warnString.includes('runtime.lasterror') ||
            warnString.includes('unchecked runtime.lasterror') ||
            warnString.includes('message port closed') ||
            warnString.includes('chrome-extension://') ||
            warnString.includes('moz-extension://') ||
            warnString.includes('safari-extension://') ||
            warnString.includes('adblock') ||
            warnString.includes('error handling response') ||
            warnString.includes('safari is not defined') ||
            warnString.includes('indexof') ||
            warnString.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) {
            return;
        }
        originalWarn.apply(console, args);
    };
})();

import './bootstrap';
import { createApp } from 'vue';
import { createStore } from 'vuex';
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';

// Базовый URL для API: с сервера (ADMIN_API_BASE из blade) или текущий origin
if (typeof window !== 'undefined') {
    const apiBase = (window.ADMIN_API_BASE || window.location.origin).replace(/\/$/, '');
    axios.defaults.baseURL = apiBase;
    if (typeof console !== 'undefined' && console.log) {
        console.log('[Admin] API base URL:', apiBase, '| Login will POST to:', apiBase + '/api/auth/login');
    }
}

// Дополнительная фильтрация (на случай, если что-то пропустили)
if (typeof window !== 'undefined') {
    // Перехватываем глобальные ошибки до инициализации приложения (дополнительная защита)
    const originalErrorHandler2 = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        // Игнорируем ошибки из расширений браузера
        if (source && (
            source.includes('chrome-extension://') ||
            source.includes('moz-extension://') ||
            source.includes('safari-extension://') ||
            source.includes('adblock') ||
            source.includes('content.js') ||
            source.includes('counter.js') ||
            source.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
            source.includes('Error handling response')
        )) {
            return true; // Предотвращаем показ ошибки
        }
        // Также проверяем сообщение об ошибке
        if (message && (
            typeof message === 'string' && (
                message.includes('chrome-extension://') ||
                message.includes('moz-extension://') ||
                message.includes('safari-extension://') ||
                message.includes('adblock') ||
                message.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
                message.includes('Error handling response') ||
                (message.includes('indexOf') && message.includes('undefined')) ||
                message.includes('safari is not defined') ||
                message.includes('Uncaught ReferenceError: safari')
            )
        )) {
            return true;
        }
        // Проверяем stack trace
        if (error && error.stack && (
            error.stack.includes('chrome-extension://') ||
            error.stack.includes('moz-extension://') ||
            error.stack.includes('safari-extension://') ||
            error.stack.includes('adblock') ||
            error.stack.includes('counter.js') ||
            error.stack.includes('content.js') ||
            error.stack.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')
        )) {
            return true;
        }
        // Вызываем оригинальный обработчик для остальных ошибок
        if (originalErrorHandler) {
            return originalErrorHandler.call(this, message, source, lineno, colno, error);
        }
        return false;
    };
    
    // Фильтруем ошибки через addEventListener('error')
    window.addEventListener('error', function(event) {
        if (event.filename && (
            event.filename.includes('chrome-extension://') ||
            event.filename.includes('moz-extension://') ||
            event.filename.includes('safari-extension://') ||
            event.filename.includes('adblock') ||
            event.filename.includes('content.js') ||
            event.filename.includes('counter.js') ||
            event.filename.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')
        )) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        if (event.message && (
            event.message.includes('Error handling response') ||
            (event.message.includes('indexOf') && event.message.includes('undefined')) ||
            event.message.includes('safari is not defined') ||
            event.message.includes('Uncaught ReferenceError: safari') ||
            (event.message.includes('Cannot read properties') && event.message.includes('indexOf'))
        )) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }, true);
    
    // Фильтруем необработанные промисы (unhandledrejection)
    window.addEventListener('unhandledrejection', function(event) {
        const reason = event.reason;
        if (reason && typeof reason === 'object') {
            const message = reason.message || String(reason);
            const stack = reason.stack || '';
            if (
                message.includes('Error handling response') ||
                message.includes('chrome-extension://') ||
                message.includes('adblock') ||
                message.includes('safari is not defined') ||
                message.includes('indexOf') ||
                message.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
                stack.includes('chrome-extension://') ||
                stack.includes('adblock') ||
                stack.includes('counter.js') ||
                stack.includes('content.js') ||
                stack.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')
            ) {
                event.preventDefault();
                return false;
            }
        }
    });
}

// Store
const store = createStore({
    state: {
        user: null,
        token: localStorage.getItem('token') || null,
        menu: [],
        notifications: [],
        theme: localStorage.getItem('theme') || 'light',
    },
    mutations: {
        SET_USER(state, user) {
            console.log('🔍 SET_USER mutation - Setting user:', {
                user,
                roles: user?.roles,
                rolesCount: user?.roles?.length || 0,
            });
            state.user = user;
            console.log('✅ SET_USER mutation - User set:', {
                user: state.user,
                roles: state.user?.roles,
                rolesCount: state.user?.roles?.length || 0,
            });
        },
        SET_TOKEN(state, token) {
            state.token = token;
            if (token) {
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            }
        },
        SET_MENU(state, menu) {
            state.menu = menu;
        },
        SET_NOTIFICATIONS(state, notifications) {
            state.notifications = notifications;
        },
        LOGOUT(state) {
            state.user = null;
            state.token = null;
            state.menu = [];
            state.notifications = [];
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        },
        SET_THEME(state, theme) {
            state.theme = theme;
            localStorage.setItem('theme', theme);
            // Применяем тему к документу
            const html = document.documentElement;
            const body = document.body;
            if (theme === 'dark') {
                html.classList.add('dark');
                html.setAttribute('data-theme', 'dark');
                if (body) body.classList.add('dark');
                html.style.colorScheme = 'dark';
            } else {
                html.classList.remove('dark');
                html.setAttribute('data-theme', 'light');
                if (body) body.classList.remove('dark');
                html.style.colorScheme = 'light';
            }
        },
    },
    actions: {
        async login({ commit, dispatch }, credentials) {
            try {
                const response = await axios.post('/api/auth/login', credentials);
                // Проверяем, что ответ содержит необходимые данные
                if (response.data && response.data.token && response.data.user) {
                    commit('SET_TOKEN', response.data.token);
                    commit('SET_USER', response.data.user);
                } else {
                    throw new Error('Неверный формат ответа от сервера');
                }
                // Загружаем меню после успешной авторизации
                await dispatch('fetchMenu');
                await dispatch('fetchNotifications');
                return { success: true };
            } catch (error) {
                console.error('Login error:', error);
                // Обработка сетевых ошибок (нет ответа: CORS, неверный URL, сеть)
                if (!error.response) {
                    return { success: false, error: 'Нет соединения с сервером. Проверьте интернет и откройте админку по основному адресу сайта (как в браузере).' };
                }
                // Обработка ошибок валидации
                if (error.response?.status === 422) {
                    const errors = error.response?.data?.errors;
                    if (errors && typeof errors === 'object') {
                        // Функция перевода ошибок на русский
                        const translateError = (errorText) => {
                            const translations = {
                                'The email field is required.': 'Поле email обязательно для заполнения.',
                                'The email field must be a valid email address.': 'Email должен быть действительным адресом электронной почты.',
                                'The password field is required.': 'Поле пароль обязательно для заполнения.',
                                'The password field must be at least 8 characters.': 'Пароль должен содержать минимум 8 символов.',
                                'The password field confirmation does not match.': 'Подтверждение пароля не совпадает.',
                            };
                            return translations[errorText] || errorText;
                        };
                        // Формируем детальное сообщение об ошибках
                        const errorMessages = Object.values(errors).flat().map(translateError).join(', ');
                        // Преобразуем errors в объект с первым сообщением для каждого поля
                        const fieldErrors = {};
                        Object.keys(errors).forEach(key => {
                            const errorMsg = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
                            fieldErrors[key] = translateError(errorMsg);
                        });
                        return { 
                            success: false, 
                            error: errorMessages || (error.response?.data?.message) || 'Ошибка валидации',
                            fieldErrors: fieldErrors
                        };
                    }
                }
                // Обработка других ошибок
                if (error.response?.status === 401) {
                    return { success: false, error: 'Неверные учетные данные. Проверьте email и пароль.' };
                }
                if (error.response?.status >= 500) {
                    return { success: false, error: 'Ошибка сервера. Попробуйте позже.' };
                }
                return { 
                    success: false, 
                    error: (error.response?.data?.message) || error.message || 'Ошибка авторизации' 
                };
            }
        },
        async register({ commit, dispatch }, userData) {
            try {
                const response = await axios.post('/api/auth/register', userData);
                // Проверяем, что ответ содержит необходимые данные
                if (response.data && response.data.token && response.data.user) {
                    commit('SET_TOKEN', response.data.token);
                    commit('SET_USER', response.data.user);
                } else {
                    throw new Error('Неверный формат ответа от сервера');
                }
                // Загружаем меню после успешной регистрации
                await dispatch('fetchMenu');
                await dispatch('fetchNotifications');
                return { success: true };
            } catch (error) {
                console.error('Register error:', error);
                // Обработка сетевых ошибок
                if (!error.response) {
                    return { success: false, error: 'Нет соединения с сервером. Проверьте интернет и что сайт открыт по тому же адресу (например, с или без www).' };
                }
                // Обработка ошибок валидации
                if (error.response?.status === 422) {
                    const errors = error.response?.data?.errors;
                    if (errors) {
                        // Функция перевода ошибок на русский
                        const translateError = (errorText) => {
                            const translations = {
                                'The name field is required.': 'Поле имя обязательно для заполнения.',
                                'The email field is required.': 'Поле email обязательно для заполнения.',
                                'The email field must be a valid email address.': 'Email должен быть действительным адресом электронной почты.',
                                'The email has already been taken.': 'Этот email уже используется.',
                                'The password field is required.': 'Поле пароль обязательно для заполнения.',
                                'The password field must be at least 8 characters.': 'Пароль должен содержать минимум 8 символов.',
                                'The password field confirmation does not match.': 'Подтверждение пароля не совпадает.',
                            };
                            return translations[errorText] || errorText;
                        };
                        // Формируем детальное сообщение об ошибках
                        const errorMessages = Object.values(errors).flat().map(translateError).join(', ');
                        // Преобразуем errors в объект с первым сообщением для каждого поля
                        const fieldErrors = {};
                        Object.keys(errors).forEach(key => {
                            const errorMsg = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
                            fieldErrors[key] = translateError(errorMsg);
                        });
                        return { 
                            success: false, 
                            error: errorMessages || (error.response?.data?.message) || 'Ошибка валидации',
                            fieldErrors: fieldErrors
                        };
                    }
                }
                // Обработка других ошибок
                if (error.response?.status === 401) {
                    return { success: false, error: 'Ошибка авторизации. Попробуйте позже.' };
                }
                if (error.response?.status >= 500) {
                    return { success: false, error: 'Ошибка сервера. Попробуйте позже.' };
                }
                return { 
                    success: false, 
                    error: (error.response?.data?.message) || error.message || 'Ошибка регистрации' 
                };
            }
        },
        async logout({ commit }) {
            try {
                await axios.post('/api/auth/logout');
            } catch (error) {
                console.error('Logout error:', error);
            }
            commit('LOGOUT');
        },
        async fetchUser({ commit, state }) {
            if (!state.token) return;
            try {
                const response = await axios.get('/api/auth/user');
                // Проверяем, что ответ содержит данные пользователя
                if (response.data && response.data.user) {
                    console.log('🔍 fetchUser - Response:', {
                        user: response.data.user,
                        roles: response.data.user?.roles,
                        rolesCount: response.data.user?.roles?.length || 0,
                    });
                    commit('SET_USER', response.data.user);
                    console.log('✅ fetchUser - User set in store:', {
                        user: state.user,
                        roles: state.user?.roles,
                    });
                } else {
                    throw new Error('Неверный формат ответа от сервера');
                }
            } catch (error) {
                console.error('❌ fetchUser - Error:', error);
                // Если ошибка 401 (неавторизован), очищаем токен
                if (error.response?.status === 401) {
                    commit('LOGOUT');
                }
            }
        },
        async fetchMenu({ commit, state }) {
            if (!state.token) return;
            try {
                const response = await axios.get('/api/admin/menu');
                // Используем JSON для правильного логирования реактивных объектов
                console.log('Menu loaded:', JSON.parse(JSON.stringify(response.data.menu)));
                commit('SET_MENU', response.data.menu);
            } catch (error) {
                console.error('Menu fetch error:', error);
            }
        },
        async fetchNotifications({ commit, state }) {
            if (!state.token) return;
            try {
                const response = await axios.get('/api/notifications');
                commit('SET_NOTIFICATIONS', response.data.notifications);
            } catch (error) {
                // 401 — не логируем в консоль (токен истёк/невалиден, глобальный interceptor очистит сессию)
                if (error.response?.status !== 401) {
                    console.error('Notifications fetch error:', error);
                }
            }
        },
        toggleTheme({ commit, state }) {
            const newTheme = state.theme === 'dark' ? 'light' : 'dark';
            commit('SET_THEME', newTheme);
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        user: (state) => state.user,
        menu: (state) => state.menu,
        notifications: (state) => state.notifications,
        theme: (state) => state.theme,
        isDarkMode: (state) => state.theme === 'dark',
        unreadNotificationsCount: (state) => {
            return state.notifications.filter(n => !n.read).length;
        },
        hasRole: (state) => (roleSlug) => {
            if (!state.user || !state.user.roles) return false;
            return state.user.roles.some(role => role.slug === roleSlug);
        },
        hasAnyRole: (state) => (roleSlugs) => {
            if (!state.user || !state.user.roles) return false;
            return state.user.roles.some(role => roleSlugs.includes(role.slug));
        },
        isAdmin: (state) => {
            if (!state.user || !state.user.roles) return false;
            return state.user.roles.some(role => role.slug === 'admin');
        },
    },
});

// Router - используем базовый путь /admin
// Все маршруты определены относительно /admin, поэтому в router они без префикса /admin
const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/auth/Login.vue'),
        meta: { requiresAuth: false },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('./pages/auth/Register.vue'),
        meta: { requiresAuth: false },
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('./pages/auth/ForgotPassword.vue'),
        meta: { requiresAuth: false },
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('./pages/auth/ResetPassword.vue'),
        meta: { requiresAuth: false },
    },
    {
        path: '/',
        component: () => import('./layouts/AdminLayout.vue'),
        meta: { requiresAuth: true, requiresRole: ['admin'] },
        children: [
            {
                path: '',
                name: 'admin.dashboard',
                component: () => import('./pages/admin/Dashboard.vue'),
                meta: { requiresAuth: true, title: 'Главная' },
            },
            {
                path: 'media',
                name: 'admin.media',
                component: () => import('./pages/admin/Media.vue'),
                meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Медиа' },
            },
            {
                path: 'submissions',
                name: 'admin.submissions',
                component: () => import('./pages/admin/Submissions.vue'),
                meta: { requiresAuth: true, requiresRole: ['admin', 'manager'], title: 'Заявки' },
            },
            {
                path: 'cases',
                name: 'admin.cases',
                component: () => import('./pages/admin/Cases.vue'),
                meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Кейсы' },
            },
            {
                path: 'blog',
                name: 'admin.blog',
                component: () => import('./pages/admin/Blog.vue'),
                meta: { requiresAuth: true, requiresRole: ['admin', 'manager'], title: 'Блог' },
            },
            {
                path: 'notifications',
                name: 'admin.notifications',
                component: () => import('./pages/admin/Notifications.vue'),
                meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Уведомления' },
            },
            {
                path: 'users',
                name: 'admin.users',
                component: () => import('./pages/admin/Users.vue'),
                meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Пользователи' },
            },
            {
                path: 'roles',
                name: 'admin.roles',
                component: () => import('./pages/admin/Roles.vue'),
                meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Роли' },
            },
            {
                path: 'subscription',
                name: 'admin.subscription',
                component: () => import('./pages/admin/Subscription.vue'),
                meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Подписка' },
            },
            // Документация
            {
                path: 'documentation',
                name: 'admin.documentation',
                component: () => import('./pages/admin/Documentation.vue'),
                meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Документация' },
            },
            {
                path: 'support',
                name: 'admin.support',
                component: () => import('./pages/admin/Support.vue'),
                meta: { requiresAuth: true, requiresRole: ['admin', 'manager'], title: 'Поддержка' },
            },
            {
                path: 'support/:id',
                name: 'admin.support.ticket',
                component: () => import('./pages/admin/SupportTicket.vue'),
                meta: { requiresAuth: true, requiresRole: ['admin', 'manager'], title: 'Тикет поддержки', parent: 'admin.support' },
            },
            {
                path: 'bots',
                name: 'admin.bots',
                component: () => import('./pages/admin/Bots.vue'),
                meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Боты' },
            },
            // CMS
            { path: 'pages', name: 'admin.pages', component: () => import('./pages/admin/cms/Pages.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Страницы' } },
            { path: 'pages/create', name: 'admin.pages.create', component: () => import('./pages/admin/cms/PageEdit.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Новая страница' } },
            { path: 'pages/:id', name: 'admin.pages.edit', component: () => import('./pages/admin/cms/PageEdit.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Редактирование страницы' } },
            { path: 'services', name: 'admin.services', component: () => import('./pages/admin/cms/Services.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Услуги' } },
            { path: 'services/create', name: 'admin.services.create', component: () => import('./pages/admin/cms/ServiceEdit.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Новая услуга' } },
            { path: 'services/:id', name: 'admin.services.edit', component: () => import('./pages/admin/cms/ServiceEdit.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Редактирование услуги' } },
            { path: 'case-studies', name: 'admin.case-studies', component: () => import('./pages/admin/cms/CaseStudies.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Кейс-стади' } },
            { path: 'case-studies/create', name: 'admin.case-studies.create', component: () => import('./pages/admin/cms/CaseStudyEdit.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Новый кейс-стади' } },
            { path: 'case-studies/:id', name: 'admin.case-studies.edit', component: () => import('./pages/admin/cms/CaseStudyEdit.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Редактирование кейс-стади' } },
            { path: 'posts', name: 'admin.posts', component: () => import('./pages/admin/cms/Posts.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Посты' } },
            { path: 'posts/create', name: 'admin.posts.create', component: () => import('./pages/admin/cms/PostEdit.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Новый пост' } },
            { path: 'posts/:id', name: 'admin.posts.edit', component: () => import('./pages/admin/cms/PostEdit.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Редактирование поста' } },
            { path: 'taxonomies', name: 'admin.taxonomies', component: () => import('./pages/admin/cms/Taxonomies.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Таксономии' } },
            { path: 'menus', name: 'admin.menus', component: () => import('./pages/admin/cms/Menus.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Меню' } },
            { path: 'menus/:id', name: 'admin.menus.edit', component: () => import('./pages/admin/cms/MenuEdit.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Редактирование меню' } },
            { path: 'settings-cms', name: 'admin.settings-cms', component: () => import('./pages/admin/cms/SettingsCms.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Настройки CMS' } },
            { path: 'leads', name: 'admin.leads', component: () => import('./pages/admin/cms/Leads.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Лиды' } },
            { path: 'leads/:id', name: 'admin.leads.show', component: () => import('./pages/admin/cms/LeadShow.vue'), meta: { requiresAuth: true, requiresRole: ['admin'], title: 'Просмотр лида' } },
        ],
    },
];

// КРИТИЧНО: Исправляем текущий путь ДО инициализации Vue Router
// Это нужно сделать как можно раньше, чтобы Vue Router не использовал неправильный путь
const currentPath = window.location.pathname;
const currentHref = window.location.href;

console.log('🔍 Initial path check:', {
    pathname: currentPath,
    href: currentHref,
    documentBaseURI: document.baseURI,
});

// Исправляем путь, если он содержит /public/
if (currentPath.includes('/public/')) {
    const fixedPath = currentPath.replace(/\/public\/?/g, '/');
    const fixedHref = currentHref.replace(/\/public\/?/g, '/');
    console.log('🔧 Fixing current path with /public/:', { 
        originalPath: currentPath, 
        fixedPath,
        originalHref: currentHref,
        fixedHref,
    });
    // Заменяем текущий URL на исправленный БЕЗ перезагрузки страницы
    window.history.replaceState({}, '', fixedPath);
    console.log('✅ Replaced history state with fixed path');
}

// Исправляем base для Vue Router
// Всегда используем '/admin' как base, независимо от document.baseURI
let routerBase = '/admin';
console.log('🔧 Vue Router - Base:', { 
    routerBase, 
    documentBaseURI: document.baseURI,
    currentPath: window.location.pathname,
    fixedPath: window.location.pathname.replace(/\/public\/?/g, '/'),
});

const router = createRouter({
    history: createWebHistory(routerBase),
    routes,
});

// Обработка ошибок при загрузке компонентов
router.onError((error) => {
    console.error('❌ Router error:', error);
    console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
    });
    // Не прерываем навигацию, просто логируем ошибку
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
    // КРИТИЧНО: Исправляем путь, если он содержит /public/
    if (to.path.includes('/public/')) {
        const fixedPath = to.path.replace(/\/public\/?/g, '/');
        console.log('🔧 Router Guard - Fixing path with /public/:', { original: to.path, fixed: fixedPath });
        // Редиректим на исправленный путь
        next(fixedPath);
        return;
    }
    
    // Исправляем fullPath, если он содержит /public/
    if (to.fullPath.includes('/public/')) {
        const fixedFullPath = to.fullPath.replace(/\/public\/?/g, '/');
        console.log('🔧 Router Guard - Fixing fullPath with /public/:', { original: to.fullPath, fixed: fixedFullPath });
        // Редиректим на исправленный путь
        next(fixedFullPath);
        return;
    }
    
    const isAuthenticated = store.getters.isAuthenticated;
    
    // КРИТИЧНО: Если требуется авторизация или роль, но пользователь еще не загружен, загружаем его
    if ((to.meta.requiresAuth || to.meta.requiresRole) && isAuthenticated && !store.state.user) {
        console.log('⏳ Router Guard - User not loaded, fetching user...');
        try {
            await store.dispatch('fetchUser');
            console.log('✅ Router Guard - User loaded:', {
                user: store.state.user,
                roles: store.state.user?.roles?.map(r => r.slug) || [],
            });
        } catch (error) {
            console.error('❌ Router Guard - Failed to fetch user:', error);
            next('/login');
            return;
        }
    }
    
    console.log('🔍 Router Guard - Navigation:', {
        to: to.path,
        fullPath: to.fullPath,
        from: from.path,
        requiresAuth: to.meta.requiresAuth,
        requiresRole: to.meta.requiresRole,
        isAuthenticated,
        user: store.state.user,
        userRoles: store.state.user?.roles?.map(r => r.slug) || [],
    });
    
    // 1. Проверка авторизации - ПЕРВЫЙ ПРИОРИТЕТ
    if (to.meta.requiresAuth && !isAuthenticated) {
        console.log('❌ Router Guard - Not authenticated, redirecting to /login');
        next('/login');
        return;
    }
    
    // 2. Если пользователь авторизован и пытается зайти на страницы авторизации, редиректим на главную
    if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
        console.log('✅ Router Guard - Already authenticated, redirecting to /');
        next('/');
        return;
    }
    
    // 3. Проверка подписки для админ-панели
    if (to.meta.requiresAuth && isAuthenticated && to.path !== '/subscription-expired') {
        try {
            const subscriptionResponse = await axios.get('/api/subscription/check');
            if (!subscriptionResponse.data.success || !subscriptionResponse.data.is_active) {
                console.log('❌ Router Guard - Subscription expired or inactive, redirecting to expired page');
                window.location.href = '/subscription-expired';
                return;
            }
        } catch (error) {
            // Если получили 403, значит подписка истекла
            if (error.response && error.response.status === 403) {
                console.log('❌ Router Guard - Subscription check failed (403), redirecting to expired page');
                window.location.href = '/subscription-expired';
                return;
            }
            // Для других ошибок продолжаем (может быть временная проблема с API)
            console.warn('⚠️ Router Guard - Subscription check error, continuing:', error.message);
        }
    }
    
    // 4. Проверка ролей - ВАЖНО: проверяем ПОСЛЕ загрузки пользователя
    if (to.meta.requiresRole) {
        const requiredRoles = Array.isArray(to.meta.requiresRole) 
            ? to.meta.requiresRole 
            : [to.meta.requiresRole];
        
        const userRoles = store.state.user?.roles?.map(r => r.slug) || [];
        const hasRole = store.getters.hasAnyRole(requiredRoles);
        
        console.log('🔍 Router Guard - Role check:', {
            route: to.path,
            routeName: to.name,
            requiredRoles,
            hasRole,
            userRoles,
            user: store.state.user,
            userRolesFull: store.state.user?.roles,
        });
        
        if (!hasRole) {
            // Пользователь авторизован, но без нужной роли — очищаем сессию и редирект на логин.
            // Иначе на /login сработает "Already authenticated" → редирект на / → цикл.
            console.log('❌ Router Guard - No required role, clearing session and redirecting to /login', {
                route: to.path,
                requiredRoles,
                userRoles,
            });
            store.commit('LOGOUT');
            next('/login');
            return;
        } else {
            console.log('✅ Router Guard - Role check passed', {
                route: to.path,
                requiredRoles,
                userRoles,
            });
        }
    }
    
    console.log('✅ Router Guard - All checks passed, allowing navigation');
    next();
});

// Initialize app
import App from './App.vue';
const app = createApp(App);

// Фильтрация ошибок расширений браузера в консоли
if (typeof console !== 'undefined' && typeof window !== 'undefined') {
    // Перехватываем глобальные ошибки
    window.addEventListener('error', function(event) {
        // Игнорируем ошибки из расширений браузера
        if (event.filename && (
            event.filename.includes('chrome-extension://') ||
            event.filename.includes('moz-extension://') ||
            event.filename.includes('safari-extension://') ||
            event.filename.includes('adblock') ||
            event.filename.includes('content.js') ||
            event.filename.includes('counter.js') ||
            event.filename.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')
        )) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        // Также проверяем сообщение об ошибке
        if (event.message && (
            event.message.includes('chrome-extension://') ||
            event.message.includes('moz-extension://') ||
            event.message.includes('safari-extension://') ||
            event.message.includes('adblock') ||
            event.message.includes('Error handling response') ||
            event.message.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
            (event.message.includes('indexOf') && event.message.includes('undefined')) ||
            event.message.includes('safari is not defined') ||
            event.message.includes('Uncaught ReferenceError: safari') ||
            (event.message.includes('Cannot read properties') && event.message.includes('indexOf'))
        )) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }, true);
    
    // Перехватываем необработанные промисы (для ошибок типа "message port closed")
    window.addEventListener('unhandledrejection', function(event) {
        const reason = event.reason?.message || event.reason?.toString() || '';
        const stack = event.reason?.stack || '';
        if (reason.includes('message port closed') || 
            reason.includes('chrome-extension://') ||
            reason.includes('moz-extension://') ||
            reason.includes('safari-extension://') ||
            reason.includes('adblock') ||
            reason.includes('Error handling response') ||
            reason.includes('safari is not defined') ||
            reason.includes('indexOf') ||
            reason.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
            stack.includes('chrome-extension://') ||
            stack.includes('adblock') ||
            stack.includes('counter.js') ||
            stack.includes('content.js') ||
            stack.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) {
            event.preventDefault();
            return false;
        }
    });
    
    // Фильтруем console.error
    const originalError = console.error;
    console.error = function(...args) {
        const errorString = args.join(' ').toLowerCase();
        // Фильтруем ошибки из расширений браузера
        if (errorString.includes('chrome-extension://') || 
            errorString.includes('moz-extension://') ||
            errorString.includes('safari-extension://') ||
            errorString.includes('adblock') ||
            errorString.includes('message port closed') ||
            errorString.includes('safari is not defined') ||
            errorString.includes('uncaught referenceerror: safari') ||
            errorString.includes('content.js') ||
            errorString.includes('counter.js') ||
            errorString.includes('indexof') ||
            errorString.includes('error handling response') ||
            errorString.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
            (errorString.includes('indexof') && errorString.includes('undefined')) ||
            (errorString.includes('cannot read properties') && errorString.includes('indexof'))) {
            return; // Не показываем эти ошибки
        }
        originalError.apply(console, args);
    };
    
    // Фильтруем console.warn для runtime.lastError
    const originalWarn = console.warn;
    console.warn = function(...args) {
        const warnString = args.join(' ').toLowerCase();
        if (warnString.includes('runtime.lasterror') ||
            warnString.includes('message port closed') ||
            warnString.includes('unchecked runtime.lasterror') ||
            warnString.includes('chrome-extension://') ||
            warnString.includes('moz-extension://') ||
            warnString.includes('safari-extension://') ||
            warnString.includes('adblock') ||
            warnString.includes('error handling response') ||
            warnString.includes('safari is not defined') ||
            warnString.includes('indexof') ||
            warnString.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) {
            return;
        }
        originalWarn.apply(console, args);
    };
}

// Set up axios defaults (токен из store уже взят из localStorage при создании store)
if (store.state.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`;
}

// Request interceptor: токен и CSRF для Laravel
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    return config;
});

// Response interceptor: при 401 очищаем сессию (истёкший/невалидный токен)
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && store.state.token) {
            store.commit('LOGOUT');
        }
        return Promise.reject(error);
    }
);

// Единый блок инициализации пользователя при загрузке приложения
if (store.state.token) {
    console.log('🔍 App initialization - Token found, fetching user...');
    store.dispatch('fetchUser').then(() => {
        console.log('✅ App initialization - User fetched:', {
            user: store.state.user,
            roles: store.state.user?.roles,
            rolesCount: store.state.user?.roles?.length || 0,
        });
        store.dispatch('fetchMenu');
        store.dispatch('fetchNotifications');
    }).catch((error) => {
        console.error('❌ App initialization - Error fetching user:', error);
    });
} else {
    console.log('⚠️ App initialization - No token found');
}

// Инициализация темы при загрузке приложения
const savedTheme = localStorage.getItem('theme') || 'light';
const html = document.documentElement;
if (savedTheme === 'dark') {
    html.classList.add('dark');
    html.setAttribute('data-theme', 'dark');
    html.style.colorScheme = 'dark';
} else {
    html.classList.remove('dark');
    html.setAttribute('data-theme', 'light');
    html.style.colorScheme = 'light';
}
store.state.theme = savedTheme;

app.use(store);
app.use(router);

// Mount app
// Монтируем приложение в контейнер #admin-app
// Mount app
// Монтируем приложение в контейнер #admin-app
// Используем DOMContentLoaded для гарантии, что DOM готов
function mountApp() {
    const appContainer = document.getElementById('admin-app');
    if (appContainer) {
        app.mount('#admin-app');
        console.log('✅ Vue app mounted successfully');
    } else {
        console.error('❌ Admin app container not found!');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
} else {
    // DOM уже загружен
    mountApp();
}

