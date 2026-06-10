import { useState } from 'react';
import type { Level, Screen, ThemeData, WordData } from './data/types';
import LevelSelect from './components/LevelSelect';
import ThemeSelect from './components/ThemeSelect';
import WordCard from './components/WordCard';
import Quiz from './components/Quiz';
import QuizResult from './components/QuizResult';
import Progress from './components/Progress';
import Favorites from './components/Favorites';
import Search from './components/Search';
import Onboarding from './components/Onboarding';
import StreakPopup from './components/StreakPopup';
import { loadProgress, recordWord, saveWrongWords } from './utils/progress';
import type { ProgressData } from './utils/progress';
import { loadStreak, updateStreak } from './utils/streak';
import type { StreakData } from './utils/streak';
import { loadFavorites, toggleFavorite } from './utils/favorites';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

const levelBadgeEmoji: Record<Level, string> = {
  children: '🌈',
  beginner: '🌱',
  intermediate: '🌿',
  advanced: '🌊',
};

const levelBadgeColor: Record<Level, string> = {
  children: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)',
  beginner: 'linear-gradient(135deg, #B8F0E6 0%, #FFFFFF 100%)',
  intermediate: 'linear-gradient(135deg, #B8D4FF 0%, #FFFFFF 100%)',
  advanced: 'linear-gradient(135deg, #C8EEFF 0%, #B8F0E6 100%)',
};

const NAV = [
  { id: 'home',      icon: '🏠' },
  { id: 'theme',     icon: '📚' },
  { id: 'favorites', icon: '⭐' },
  { id: 'progress',  icon: '📊' },
  { id: 'settings',  icon: '⚙️' },
];

function AppContent() {
  const { lang, t, toggleLang } = useLanguage();

  const [screen, setScreen] = useState<Screen>('level');
  const [level, setLevel] = useState<Level>('beginner');
  const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0, elapsed: 0 });
  const [quizWrongWords, setQuizWrongWords] = useState<WordData[]>([]);
  const [quizOverrideTheme, setQuizOverrideTheme] = useState<ThemeData | null>(null);
  const [quizKey, setQuizKey] = useState(0);
  const [progress, setProgress] = useState<ProgressData>(() => loadProgress());
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('podong_onboarded'));
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());
  const [showSearch, setShowSearch] = useState(false);

  const handleOnboardingComplete = () => {
    localStorage.setItem('podong_onboarded', '1');
    setShowOnboarding(false);
  };

  const [streakData, setStreakData] = useState<StreakData>(() => loadStreak());
  const [showStreakPopup, setShowStreakPopup] = useState(false);

  const handleToggleFavorite = (word: string) => setFavorites(toggleFavorite(word));

  const handleLevelSelect = (l: Level) => {
    setLevel(l);
    setScreen('theme');
  };

  const handleThemeSelect = (theme: ThemeData) => {
    setSelectedTheme(theme);
    setScreen('study');
  };

  const handleQuizComplete = (correct: number, total: number, wrongWords: WordData[], elapsed: number) => {
    setQuizScore({ correct, total, elapsed });
    setQuizWrongWords(wrongWords);
    if (selectedTheme) {
      setProgress(saveWrongWords(selectedTheme.id, wrongWords.map((w) => w.word)));
    }
    setScreen('result');
  };

  const handleWordViewed = (themeId: string, wordText: string, isLast: boolean) => {
    setProgress(recordWord(themeId, wordText, isLast));
    const { data, isNew } = updateStreak();
    setStreakData(data);
    if (isNew) setShowStreakPopup(true);
  };

  const activeNav =
    screen === 'level' ? 'home' :
    screen === 'progress' ? 'progress' :
    screen === 'favorites' ? 'favorites' :
    'theme';

  const handleNavClick = (id: string) => {
    if (id === 'home') setScreen('level');
    if (id === 'theme' && screen !== 'level') setScreen('theme');
    if (id === 'progress') setScreen('progress');
    if (id === 'favorites') setScreen('favorites');
  };

  const navLabel = (id: string) => {
    if (id === 'home') return t.home;
    if (id === 'theme') return t.themes;
    if (id === 'favorites') return t.favorites;
    if (id === 'progress') return t.myProgress;
    return t.settings;
  };

  const levelBadgeText = `${t[`level_${level}` as keyof typeof t]} ${levelBadgeEmoji[level]}`;

  const streakText = lang === 'ko'
    ? `🔥 ${streakData.streak}일`
    : `🔥 ${streakData.streak} ${t.days}`;

  const todayText = lang === 'ko'
    ? `📖 오늘 ${progress.todayWords.length}단어`
    : `📖 ${progress.todayWords.length} words`;

  return (
    <div className="app-layout">

      {showSearch && (
        <Search
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setShowSearch(false)}
        />
      )}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      {showStreakPopup && (
        <StreakPopup streak={streakData.streak} onDismiss={() => setShowStreakPopup(false)} />
      )}

      {/* ── Header ── */}
      <header className="app-header">

        {/* Left: Logo + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <span style={{ fontSize: 28 }}>🐡</span>
          <div>
            <div style={{
              fontSize: 17, fontWeight: 900,
              color: 'var(--text-dark)',
              fontFamily: "'Jua', sans-serif",
              lineHeight: 1.1,
            }}>
              포동포동
            </div>
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: 'var(--text-soft)',
              letterSpacing: 1,
            }}>
              Podong
            </div>
          </div>
        </div>

        {/* Center: Level badge */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {screen !== 'level' && screen !== 'progress' && screen !== 'favorites' && (
            <span style={{
              background: levelBadgeColor[level],
              borderRadius: 20,
              padding: '4px 16px',
              fontSize: 14,
              fontWeight: 800,
              color: 'var(--text-dark)',
            }}>
              {levelBadgeText}
            </span>
          )}
        </div>

        {/* Right: Lang toggle + Streak + Today count + Login */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
          <button
            onClick={toggleLang}
            title={lang === 'ko' ? '영어로 보기' : '한국어로 보기'}
            style={{
              background: 'rgba(255,255,255,0.6)',
              border: 'none',
              borderRadius: 14,
              padding: '5px 9px',
              fontSize: 20,
              cursor: 'pointer',
              lineHeight: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            {lang === 'ko' ? '🇺🇸' : '🇰🇷'}
          </button>
          {streakData.streak > 0 && (
            <span style={{
              fontSize: 13,
              fontWeight: 800,
              color: streakData.streak >= 7 ? '#E05000' : 'var(--text-soft)',
              whiteSpace: 'nowrap',
            }}>
              {streakText}
            </span>
          )}
          {progress.todayWords.length > 0 && (
            <span style={{
              fontSize: 13,
              fontWeight: 800,
              color: 'var(--text-soft)',
              whiteSpace: 'nowrap',
            }}>
              {todayText}
            </span>
          )}
          <button
            onClick={() => setShowSearch(true)}
            title={t.search}
            style={{
              background: 'rgba(255,255,255,0.6)',
              border: 'none',
              borderRadius: 14,
              padding: '5px 9px',
              fontSize: 20,
              cursor: 'pointer',
              lineHeight: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            🔍
          </button>
          <button style={{
            background: 'linear-gradient(135deg, #B8D4FF, #B8F0E6)',
            border: 'none',
            borderRadius: 16,
            padding: '8px 20px',
            fontSize: 14,
            fontWeight: 800,
            color: 'var(--text-dark)',
            cursor: 'pointer',
          }}>
            {t.login}
          </button>
        </div>

      </header>

      {/* ── Body: Sidebar + Main ── */}
      <div className="app-body">

        {/* Sidebar (desktop only) */}
        <aside className="app-sidebar">
          <nav style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`app-sidebar-btn${activeNav === item.id ? ' active' : ''}`}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {navLabel(item.id)}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="app-main">
          <div className="app-main-inner">

            {screen === 'level' && (
              <LevelSelect onSelect={handleLevelSelect} />
            )}
            {screen === 'theme' && (
              <ThemeSelect
                level={level}
                onSelect={handleThemeSelect}
                onBack={() => setScreen('level')}
                completedThemes={progress.completedThemes}
              />
            )}
            {screen === 'study' && selectedTheme && (
              <WordCard
                theme={selectedTheme}
                level={level}
                onStartQuiz={() => {
                  setQuizOverrideTheme(null);
                  setQuizKey((k) => k + 1);
                  setScreen('quiz');
                }}
                onBack={() => setScreen('theme')}
                onWordViewed={handleWordViewed}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
            {screen === 'quiz' && selectedTheme && (
              <Quiz
                key={quizKey}
                theme={quizOverrideTheme ?? selectedTheme}
                level={level}
                onComplete={handleQuizComplete}
                onBack={() => {
                  setQuizOverrideTheme(null);
                  setScreen(selectedTheme?.id === 'favorites' ? 'favorites' : 'study');
                }}
              />
            )}
            {screen === 'result' && selectedTheme && (
              <QuizResult
                correct={quizScore.correct}
                total={quizScore.total}
                wrongWords={quizWrongWords}
                elapsedSeconds={quizScore.elapsed}
                level={level}
                theme={quizOverrideTheme ?? selectedTheme}
                onRetry={() => {
                  setQuizOverrideTheme(null);
                  setQuizKey((k) => k + 1);
                  setScreen('quiz');
                }}
                onRetryWrong={() => {
                  if (quizWrongWords.length > 0) {
                    setQuizOverrideTheme({ ...selectedTheme, words: quizWrongWords });
                    setQuizKey((k) => k + 1);
                    setScreen('quiz');
                  }
                }}
                onGoTheme={() => {
                  setQuizOverrideTheme(null);
                  setScreen(selectedTheme?.id === 'favorites' ? 'favorites' : 'theme');
                }}
              />
            )}
            {screen === 'progress' && (
              <Progress progress={progress} />
            )}
            {screen === 'favorites' && (
              <Favorites
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onStartQuiz={(favTheme) => {
                  setSelectedTheme(favTheme);
                  setQuizOverrideTheme(null);
                  setQuizKey((k) => k + 1);
                  setScreen('quiz');
                }}
              />
            )}

          </div>
        </main>

      </div>

      {/* ── Bottom tabs (mobile only) ── */}
      <nav className="app-bottom-tabs">
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: activeNav === item.id ? 'var(--text-dark)' : 'var(--text-soft)',
              fontSize: 10,
              fontWeight: activeNav === item.id ? 800 : 600,
              padding: '4px 0',
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{navLabel(item.id)}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
