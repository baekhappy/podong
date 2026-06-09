const KEY = 'podong_favorites';

export function loadFavorites(): string[] {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(word: string): string[] {
  const current = loadFavorites();
  const next = current.includes(word)
    ? current.filter((w) => w !== word)
    : [...current, word];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
