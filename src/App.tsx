import { useState } from 'react';
import type { Level, Screen, ThemeData } from './data/types';
import LevelSelect from './components/LevelSelect';
import ThemeSelect from './components/ThemeSelect';
import WordCard from './components/WordCard';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Progress from './components/Progress';
import { loadProgress, recordWord } from './utils/progress';
import type { ProgressData } from './utils/progress';

const levelBadge: Record<Level, string> = {
  children: '어린이 🌈',
  beginner: '초급 🌱',
  intermediate: '중급 🌿',
  advanced: '고급 🌊',
};

const levelBadgeColor: Record<Level, string> = {
  children: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)',
  beginner: 'linear-gradient(135deg, #B8F0E6 0%, #FFFFFF 100%)',
  intermediate: 'linear-gradient(135deg, #B8D4FF 0%, #FFFFFF 100%)',
  advanced: 'linear-gradient(135deg, #C8EEFF 0%, #B8F0E6 100%)',
};

const NAV = [
  { id: 'home',      icon: '🏠', label: '홈',      shortLabel: '홈' },
  { id: 'theme',     icon: '📚', label: '테마 목록', shortLabel: '테마' },
  { id: 'favorites', icon: '⭐', label: '즐겨찾기', shortLabel: '즐겨찾기' },
  { id: 'progress',  icon: '📊', label: '학습 진도', shortLabel: '진도' },
  { id: 'settings',  icon: '⚙️', label: '설정',     shortLabel: '설정' },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('level');
  const [level, setLevel] = useState<Level>('beginner');
  const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [progress, setProgress] = useState<ProgressData>(() => loadProgress());

  const handleLevelSelect = (l: Level) => {
    setLevel(l);
    setScreen('theme');
  };

  const handleThemeSelect = (theme: ThemeData) => {
    setSelectedTheme(theme);
    setScreen('study');
  };

  const handleQuizComplete = (correct: number, total: number) => {
    setQuizScore({ correct, total });
    setScreen('result');
  };

  const handleWordViewed = (themeId: string, wordText: string, isLast: boolean) => {
    setProgress(recordWord(themeId, wordText, isLast));
  };

  const activeNav =
    screen === 'level' ? 'home' :
    screen === 'progress' ? 'progress' :
    'theme';

  const handleNavClick = (id: string) => {
    if (id === 'home') setScreen('level');
    if (id === 'theme' && screen !== 'level') setScreen('theme');
    if (id === 'progress') setScreen('progress');
  };

  return (
    <div className="app-layout">

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
          {screen !== 'level' && screen !== 'progress' && (
            <span style={{
              background: levelBadgeColor[level],
              borderRadius: 20,
              padding: '4px 16px',
              fontSize: 14,
              fontWeight: 800,
              color: 'var(--text-dark)',
            }}>
              {levelBadge[level]}
            </span>
          )}
        </div>

        {/* Right: Today count + Login */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
          {progress.todayWords.length > 0 && (
            <span style={{
              fontSize: 13,
              fontWeight: 800,
              color: 'var(--text-soft)',
              whiteSpace: 'nowrap',
            }}>
              📖 오늘 {progress.todayWords.length}단어
            </span>
          )}
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
            로그인
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
                {item.label}
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
                onStartQuiz={() => setScreen('quiz')}
                onBack={() => setScreen('theme')}
                onWordViewed={handleWordViewed}
              />
            )}
            {screen === 'quiz' && selectedTheme && (
              <Quiz
                theme={selectedTheme}
                level={level}
                onComplete={handleQuizComplete}
                onBack={() => setScreen('study')}
              />
            )}
            {screen === 'result' && (
              <Result
                correct={quizScore.correct}
                total={quizScore.total}
                level={level}
                onRestart={() => setScreen('level')}
                onRetry={() => setScreen('quiz')}
                onGoHome={() => setScreen('theme')}
              />
            )}
            {screen === 'progress' && (
              <Progress progress={progress} />
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
            <span>{item.shortLabel}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}
