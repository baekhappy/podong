import { useState, useEffect, useRef } from 'react';
import type { Level, ThemeData, WordData } from '../data/types';
import { playSound } from '../utils/sound';

interface Props {
  theme: ThemeData;
  level: Level;
  onComplete: (correct: number, total: number, wrongWords: WordData[], elapsedSeconds: number) => void;
  onBack: () => void;
}

interface Question {
  word: WordData;
  options: string[];
  example?: string;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeBlank(sentence: string, word: string): string {
  return sentence.replace(word, ' _____  ');
}

function generateQuestions(theme: ThemeData, level: Level): Question[] {
  const words = shuffle(theme.words);
  return words.map((word) => {
    const others = theme.words.filter((w) => w.word !== word.word);
    const distractors = shuffle(others).slice(0, 3).map((w) => w.word);
    const options = shuffle([word.word, ...distractors]);

    const example =
      level === 'advanced'
        ? makeBlank(word.exampleAdvanced, word.word)
        : level === 'intermediate'
        ? makeBlank(word.exampleIntermediate, word.word)
        : undefined;

    return { word, options, example };
  });
}

const feedbackColors = {
  correct: 'linear-gradient(135deg, #B8F0E6 0%, #C8EEFF 100%)',
  wrong: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)',
};

export default function Quiz({ theme, level, onComplete, onBack }: Props) {
  const [questions] = useState(() => generateQuestions(theme, level));
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongWordsRef = useRef<WordData[]>([]);
  const startTimeRef = useRef(Date.now());

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const q = questions[qIndex];
  const isAnswered = selected !== null;

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelected(option);
    const isCorrect = option === q.word.word;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setScore((s) => s + 1);
      playSound('correct');
    } else {
      playSound('wrong');
      if (!wrongWordsRef.current.some((w) => w.word === q.word.word)) {
        wrongWordsRef.current = [...wrongWordsRef.current, q.word];
      }
    }
    timerRef.current = setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        onComplete(isCorrect ? score + 1 : score, questions.length, wrongWordsRef.current, elapsed);
      } else {
        setQIndex((i) => i + 1);
        setSelected(null);
        setFeedback(null);
      }
    }, 1200);
  };

  const getOptionStyle = (option: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%',
      background: 'rgba(255,255,255,0.85)',
      border: 'none',
      borderRadius: 18,
      padding: '16px 20px',
      fontSize: 20,
      fontWeight: 800,
      color: 'var(--text-dark)',
      cursor: isAnswered ? 'not-allowed' : 'pointer',
      boxShadow: '0 6px 16px rgba(0,0,0,0.07)',
      transition: 'transform 0.15s, background 0.2s',
      textAlign: 'left',
      fontFamily: "'Jua', 'Nunito', sans-serif",
    };
    if (!isAnswered) return base;
    if (option === q.word.word) {
      return { ...base, background: 'linear-gradient(135deg, #B8F0E6, #C8EEFF)', boxShadow: '0 6px 20px rgba(184,240,230,0.5)' };
    }
    if (option === selected) {
      return { ...base, background: 'linear-gradient(135deg, #FFD6E8, #FFF5B8)', opacity: 0.8 };
    }
    return { ...base, opacity: 0.5 };
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.8)',
            border: 'none',
            borderRadius: 16,
            width: 44,
            height: 44,
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-dark)', fontFamily: "'Jua', sans-serif" }}>
            {theme.emoji} 퀴즈
          </span>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.8)',
          borderRadius: 16,
          padding: '8px 14px',
          fontSize: 15,
          fontWeight: 800,
          color: 'var(--text-soft)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        }}>
          {qIndex + 1}/{questions.length}
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: 8, background: 'rgba(255,255,255,0.6)', borderRadius: 8, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #B8F0E6, #B8D4FF)',
          borderRadius: 8,
          width: `${((qIndex + 1) / questions.length) * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Score display */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <span style={{
          background: 'rgba(255,255,255,0.8)',
          borderRadius: 14,
          padding: '6px 16px',
          fontSize: 15,
          fontWeight: 800,
          color: 'var(--text-dark)',
        }}>
          점수 {score} / {qIndex}
        </span>
      </div>

      {/* Question Card */}
      <div style={{
        background: feedback ? feedbackColors[feedback] : 'rgba(255,255,255,0.85)',
        borderRadius: 28,
        padding: '28px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        marginBottom: 20,
        transition: 'background 0.3s',
        backdropFilter: 'blur(8px)',
      }}>
        {/* For fill-in-blank (intermediate/advanced) */}
        {(level === 'intermediate' || level === 'advanced') && q.example ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: 15,
              color: 'var(--text-soft)',
              fontWeight: 700,
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              빈칸에 알맞은 단어를 고르세요
            </p>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text-dark)',
              lineHeight: 1.7,
              background: 'rgba(255,255,255,0.6)',
              borderRadius: 16,
              padding: '16px',
            }}>
              {q.example}
            </div>
            {feedback === 'correct' && (
              <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700, color: 'var(--text-dark)' }}>
                ✅ 정답! <strong>{q.word.word}</strong>
              </div>
            )}
            {feedback === 'wrong' && (
              <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700, color: 'var(--text-dark)' }}>
                ❌ 정답은 <strong>{q.word.word}</strong>
              </div>
            )}
          </div>
        ) : (
          /* For children/beginner: emoji + definition */
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: 15,
              color: 'var(--text-soft)',
              fontWeight: 700,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              이 표현은 무엇일까요?
            </p>
            <div style={{ fontSize: 64, marginBottom: 12 }}>{q.word.emoji}</div>
            <p style={{
              fontSize: 20,
              fontWeight: 800,
              color: 'var(--text-dark)',
              margin: '0 0 8px',
              fontFamily: "'Jua', sans-serif",
            }}>
              {q.word.definition}
            </p>
            {level === 'beginner' && (
              <p style={{ fontSize: 16, color: 'var(--text-soft)', fontWeight: 700, fontStyle: 'italic', margin: 0 }}>
                ({q.word.english})
              </p>
            )}
            {feedback === 'correct' && (
              <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700, color: 'var(--text-dark)' }}>
                ✅ 정답! <strong>{q.word.word}</strong>
              </div>
            )}
            {feedback === 'wrong' && (
              <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700, color: 'var(--text-dark)' }}>
                ❌ 정답은 <strong>{q.word.word}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {q.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={!isAnswered ? 'option-btn' : ''}
            style={getOptionStyle(option)}
          >
            <span style={{ fontSize: 24, marginRight: 12 }}>
              {isAnswered && option === q.word.word ? '✅ ' : isAnswered && option === selected && option !== q.word.word ? '❌ ' : ''}
            </span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
