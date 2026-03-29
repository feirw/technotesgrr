import { supabase } from '@/utils/supabaseClient';
import { apiFetch } from '@/utils/apiClient';

export interface PendingQuizSubmission {
  id: string;
  nickname: string;
  question_id: string;
  selected_answer: number;
  createdAt: number;
}

const STORAGE_KEY = 'pendingQuizSubmissions:v1';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8001';
const MAX_QUEUE_ITEMS = 500;

const readQueue = (): PendingQuizSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PendingQuizSubmission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeQueue = (items: PendingQuizSubmission[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(-MAX_QUEUE_ITEMS)));
};

export const enqueueQuizSubmission = (submission: Omit<PendingQuizSubmission, 'id' | 'createdAt'>) => {
  const queue = readQueue();
  const item: PendingQuizSubmission = {
    ...submission,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  queue.push(item);
  writeQueue(queue);
  return item.id;
};

export const getPendingSubmissionCount = () => readQueue().length;

export const flushPendingQuizSubmissions = async () => {
  const queue = readQueue();
  if (!queue.length) return { sent: 0, failed: 0 };

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (!token) return { sent: 0, failed: queue.length };

  const remaining: PendingQuizSubmission[] = [];
  let sent = 0;

  for (const item of queue) {
    try {
      await apiFetch(`${BACKEND_URL}/api/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeoutMs: 8000,
        retries: 1,
        body: JSON.stringify({
          nickname: item.nickname,
          question_id: item.question_id,
          selected_answer: item.selected_answer,
        }),
      });
      sent += 1;
    } catch {
      remaining.push(item);
    }
  }

  writeQueue(remaining);
  return { sent, failed: remaining.length };
};

