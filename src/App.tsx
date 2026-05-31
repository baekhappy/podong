import { useState } from 'react';
import type { Level, Screen, ThemeData } from './data/types';
import LevelSelect from './components/LevelSelect';
import ThemeSelect from './components/ThemeSelect';
import WordCard from './components/WordCard';
import Quiz from './components/Quiz';
import Result from './components/Result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('level');
  const [level, setLevel] = useState<Level>('beginner');
  const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

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

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      {screen === 'level' && (
        <LevelSelect onSelect={handleLevelSelect} />
      )}
      {screen === 'theme' && (
        <ThemeSelect
          level={level}
          onSelect={handleThemeSelect}
          onBack={() => setScreen('level')}
        />
      )}
      {screen === 'study' && selectedTheme && (
        <WordCard
          theme={selectedTheme}
          level={level}
          onStartQuiz={() => setScreen('quiz')}
          onBack={() => setScreen('theme')}
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
    </div>
  );
}
