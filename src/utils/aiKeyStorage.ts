const CUSTOM_GEMINI_KEY_STORAGE = 'jee_physics_custom_gemini_key';
const KEY_UPDATED_EVENT = 'jee-ai-key-updated';

export function getCustomGeminiKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    return (window.localStorage.getItem(CUSTOM_GEMINI_KEY_STORAGE) || '').trim();
  } catch {
    return '';
  }
}

export function hasCustomGeminiKey(): boolean {
  return getCustomGeminiKey().length > 0;
}

export function saveCustomGeminiKey(rawKey: string): boolean {
  if (typeof window === 'undefined') return false;
  const trimmed = rawKey.trim();
  try {
    if (!trimmed) {
      window.localStorage.removeItem(CUSTOM_GEMINI_KEY_STORAGE);
    } else {
      window.localStorage.setItem(CUSTOM_GEMINI_KEY_STORAGE, trimmed);
    }
    window.dispatchEvent(new Event(KEY_UPDATED_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function clearCustomGeminiKey(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CUSTOM_GEMINI_KEY_STORAGE);
    window.dispatchEvent(new Event(KEY_UPDATED_EVENT));
  } catch {
    // Ignore storage access errors
  }
}

export function maskGeminiKey(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) return '';
  if (trimmed.length <= 10) return '••••••••';
  return `${trimmed.slice(0, 6)}••••••${trimmed.slice(-4)}`;
}

export function subscribeCustomGeminiKey(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handleCustom = () => onChange();
  const handleStorage = (ev: StorageEvent) => {
    if (ev.key === null || ev.key === CUSTOM_GEMINI_KEY_STORAGE) {
      onChange();
    }
  };
  window.addEventListener(KEY_UPDATED_EVENT, handleCustom);
  window.addEventListener('storage', handleStorage);
  return () => {
    window.removeEventListener(KEY_UPDATED_EVENT, handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}
