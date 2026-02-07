/**
 * API utility for Laravel backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Make API request
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message || 'Ошибка запроса',
      errors: data.errors,
    };
  }

  return {
    success: true,
    data,
  };
}

/**
 * Upload files to Laravel backend
 */
export async function uploadFiles(
  files: File[],
  submissionId?: string
): Promise<{ success: boolean; files?: Array<{ name: string; size: number; type: string; url: string }>; message?: string }> {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files[]', file);
  });
  
  if (submissionId) {
    formData.append('submission_id', submissionId);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/brief-submissions/upload-files`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Ошибка загрузки файлов',
      };
    }

    return {
      success: true,
      files: data.files || [],
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: 'Ошибка загрузки файлов',
    };
  }
}

/**
 * Submit brief submission
 */
export async function submitBriefSubmission(data: {
  name: string;
  company?: string;
  role: string;
  project_name?: string;
  description: string;
  phone: string;
  email: string;
  files?: Array<{ name: string; size: number; type: string; url: string }>;
}): Promise<{ success: boolean; message?: string }> {
  const response = await apiRequest('/brief-submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return {
    success: response.success,
    message: response.message,
  };
}

/**
 * Send message to Telegram (via Laravel backend)
 */
export async function sendTelegramMessage(data: {
  name: string;
  phone: string;
  email?: string;
  role: string;
  description: string;
}): Promise<{ success: boolean; message?: string }> {
  const response = await apiRequest('/brief-submissions/send-telegram', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return {
    success: response.success,
    message: response.message,
  };
}

// --- Cases API (публичные и админ) ---

const getAuthHeaders = (): Record<string, string> => {
  const t = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (t) return { Authorization: `Bearer ${t}` };
  return {};
};

/** Базовый URL бэкенда для /storage (если фронт на другом origin). */
export function resolveStorageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = import.meta.env.VITE_APP_URL || (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '') || '';
  return base + (url.startsWith('/') ? url : '/' + url);
}

/** Список кейсов (публичный) */
export async function getCases(): Promise<{ success: boolean; data?: any[]; message?: string }> {
  const r = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/cases`, {
    headers: { Accept: 'application/json' },
  });
  const d = await r.json();
  if (!r.ok) return { success: false, message: d.message || 'Ошибка' };
  return { success: true, data: d.data || [] };
}

/** Кейс по slug (публичный) */
export async function getCaseBySlug(slug: string): Promise<{ success: boolean; data?: any; message?: string }> {
  const r = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/cases/slug/${encodeURIComponent(slug)}`, {
    headers: { Accept: 'application/json' },
  });
  const d = await r.json();
  if (!r.ok) return { success: false, message: d.message || 'Ошибка' };
  return { success: true, data: d.data };
}

const apiV1 = (p: string) => (import.meta.env.VITE_API_URL || '/api').replace(/\/?$/, '') + '/v1' + p;

/** Кейс по id (админ) */
export async function getCaseById(id: number): Promise<{ success: boolean; data?: any; message?: string }> {
  const r = await fetch(apiV1(`/cases/${id}`), { headers: { Accept: 'application/json', ...getAuthHeaders() } });
  const d = await r.json();
  if (!r.ok) return { success: false, message: d.message || 'Ошибка' };
  return { success: true, data: d.data };
}

/** Создать кейс (админ) */
export async function createCase(v: { slug: string; title: string; category?: string; year?: number; featured?: boolean; description?: string; meta?: object }): Promise<{ success: boolean; data?: any; message?: string }> {
  const r = await fetch(apiV1('/cases'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(v),
  });
  const d = await r.json();
  if (!r.ok) return { success: false, message: d.message || 'Ошибка' };
  return { success: true, data: d.data };
}/** Обновить кейс (админ) */
export async function updateCase(id: number, v: Partial<{ slug: string; title: string; category: string; year: number; featured: boolean; description: string; meta: object }>): Promise<{ success: boolean; data?: any; message?: string }> {
  const r = await fetch(apiV1(`/cases/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(v),
  });
  const d = await r.json();
  if (!r.ok) return { success: false, message: d.message || 'Ошибка' };
  return { success: true, data: d.data };
}/** Загрузить медиа (админ). type: 'image' | 'video' */
export async function uploadCaseMedia(caseId: number, file: File, type: 'image' | 'video'): Promise<{ success: boolean; data?: any; message?: string }> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('type', type);
  const r = await fetch(apiV1(`/cases/${caseId}/media`), {
    method: 'POST',
    headers: { Accept: 'application/json', ...getAuthHeaders() },
    body: fd,
  });
  const d = await r.json();
  if (!r.ok) return { success: false, message: d.message || 'Ошибка' };
  return { success: true, data: d.data };
}/** Удалить медиа (админ) */
export async function deleteCaseMedia(mediaId: number): Promise<{ success: boolean; message?: string }> {
  const r = await fetch(apiV1(`/cases/media/${mediaId}`), {
    method: 'DELETE',
    headers: { Accept: 'application/json', ...getAuthHeaders() },
  });
  const d = await r.json();
  if (!r.ok) return { success: false, message: d.message || 'Ошибка' };
  return { success: true };
}/** Изменить порядок медиа (админ). order — массив id. */
export async function reorderCaseMedia(caseId: number, order: number[]): Promise<{ success: boolean; message?: string }> {
  const r = await fetch(apiV1(`/cases/${caseId}/media/reorder`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ order }),
  });
  const d = await r.json();
  if (!r.ok) return { success: false, message: d.message || 'Ошибка' };
  return { success: true };
}
