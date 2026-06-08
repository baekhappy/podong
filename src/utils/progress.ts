const STORAGE_KEY = 'podong_progress';

export interface ProgressData {
  todayDate: string;
  todayWords: string[];
  totalWords: number;
  completedThemes: string[];
  streak: number;
  lastLearnDate: string;
  wrongWords: Record<string, string[]>;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as ProgressData;
      const withDefaults: ProgressData = { ...data, wrongWords: data.wrongWords ?? {} };
      if (withDefaults.todayDate !== todayStr()) {
        return { ...withDefaults, todayDate: todayStr(), todayWords: [] };
      }
      return withDefaults;
    }
  } catch {}
  return {
    todayDate: todayStr(),
    todayWords: [],
    totalWords: 0,
    completedThemes: [],
    streak: 0,
    lastLearnDate: '',
    wrongWords: {},
  };
}

export function recordWord(
  themeId: string,
  wordText: string,
  isLastWord: boolean
): ProgressData {
  const data = loadProgress();
  const wordId = `${themeId}:${wordText}`;
  const today = todayStr();
  const updated: ProgressData = { ...data };

  if (!data.todayWords.includes(wordId)) {
    updated.todayWords = [...data.todayWords, wordId];
    updated.totalWords = data.totalWords + 1;
  }

  if (data.lastLearnDate !== today) {
    updated.streak = data.lastLearnDate === yesterdayStr() ? data.streak + 1 : 1;
    updated.lastLearnDate = today;
  }

  if (isLastWord && !data.completedThemes.includes(themeId)) {
    updated.completedThemes = [...data.completedThemes, themeId];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function saveWrongWords(themeId: string, wordTexts: string[]): ProgressData {
  const data = loadProgress();
  const updated: ProgressData = {
    ...data,
    wrongWords: { ...data.wrongWords, [themeId]: wordTexts },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
