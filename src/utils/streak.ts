const STREAK_KEY = 'podong_streak';
const LAST_DATE_KEY = 'podong_last_study_date';
const MAX_STREAK_KEY = 'podong_max_streak';

export interface StreakData {
  streak: number;
  lastStudyDate: string;
  maxStreak: number;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function loadStreak(): StreakData {
  return {
    streak: parseInt(localStorage.getItem(STREAK_KEY) || '0', 10),
    lastStudyDate: localStorage.getItem(LAST_DATE_KEY) || '',
    maxStreak: parseInt(localStorage.getItem(MAX_STREAK_KEY) || '0', 10),
  };
}

export function updateStreak(): { data: StreakData; isNew: boolean } {
  const today = todayStr();
  const current = loadStreak();

  if (current.lastStudyDate === today) {
    return { data: current, isNew: false };
  }

  const newStreak = current.lastStudyDate === yesterdayStr() ? current.streak + 1 : 1;
  const newMax = Math.max(newStreak, current.maxStreak);

  localStorage.setItem(STREAK_KEY, String(newStreak));
  localStorage.setItem(LAST_DATE_KEY, today);
  localStorage.setItem(MAX_STREAK_KEY, String(newMax));

  return {
    data: { streak: newStreak, lastStudyDate: today, maxStreak: newMax },
    isNew: true,
  };
}
