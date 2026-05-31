import type { Level } from '../data/types';
import { playSound } from '../utils/sound';
import { useEffect } from 'react';

interface Props {
  correct: number;
  total: number;
  level: Level;
  onRestart: () => void;
  onRetry: () => void;
  onGoHome: () => void;
}

function getRating(correct: number, total: number) {
  const pct = total === 0 ? 0 : correct / total;
  if (pct === 1) return { emoji: '🏆', label: '완벽해요!', msg: 'Perfect Score!', bg: 'linear-gradient(135deg, #FFF5B8 0%, #B8F0E6 100%)' };
  if (pct >= 0.8) return { emoji: '⭐', label: '훌륭해요!', msg: 'Excellent!', bg: 'linear-gradient(135deg, #B8F0E6 0%, #C8EEFF 100%)' };
  if (pct >= 0.6) return { emoji: '👍', label: '잘했어요!', msg: 'Good Job!', bg: 'linear-gradient(135deg, #B8D4FF 0%, #FFD6E8 100%)' };
  if (pct >= 0.4) return { emoji: '🌱', label: '조금 더!', msg: 'Keep Going!', bg: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)' };
  return { emoji: '💪', label: '다시 도전!', msg: 'Try Again!', bg: 'linear-gradient(135deg, #C8EEFF 0%, #B8D4FF 100%)' };
}

const levelLabels: Record<Level, string> = {
  children: '어린이',
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
};

export default function Result({ correct, total, level, onRestart, onRetry, onGoHome }: Props) {
  const rating = getRating(correct, total);
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);

  useEffect(() => {
    if (correct / total >= 0.8) playSound('correct');
  }, [correct, total]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px',
      gap: 24,
    }}>
      {/* Result Card */}
      <div style={{
        width: '100%',
        maxWidth: 440,
        background: rating.bg,
        borderRadius: 32,
        padding: '40px 32px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}>
        <div className="anim-bounce" style={{ fontSize: 80, marginBottom: 8 }}>
          {rating.emoji}
        </div>
        <h1 style={{
          fontSize: 36,
          fontWeight: 900,
          color: 'var(--text-dark)',
          margin: '0 0 4px',
          fontFamily: "'Jua', sans-serif",
        }}>
          {rating.label}
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-soft)', fontWeight: 700, margin: '0 0 28px' }}>
          {rating.msg}
        </p>

        {/* Score */}
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          borderRadius: 24,
          padding: '24px',
          marginBottom: 24,
        }}>
          <div style={{
            fontSize: 64,
            fontWeight: 900,
            color: 'var(--text-dark)',
            fontFamily: "'Nunito', sans-serif",
            lineHeight: 1,
          }}>
            {correct}<span style={{ fontSize: 32, color: 'var(--text-soft)' }}>/{total}</span>
          </div>
          <p style={{ fontSize: 16, color: 'var(--text-soft)', fontWeight: 700, margin: '8px 0 16px' }}>
            {pct}% 정답
          </p>
          {/* Progress bar */}
          <div style={{ height: 12, background: 'rgba(0,0,0,0.08)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #B8F0E6, #B8D4FF)',
              borderRadius: 8,
              width: `${pct}%`,
              transition: 'width 0.8s ease',
            }} />
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-soft)', fontWeight: 700, margin: '12px 0 0' }}>
            {levelLabels[level]} 레벨
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={onRetry}
          style={{
            background: 'linear-gradient(135deg, #B8F0E6 0%, #B8D4FF 100%)',
            border: 'none',
            borderRadius: 20,
            padding: '18px',
            fontSize: 18,
            fontWeight: 900,
            color: 'var(--text-dark)',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            fontFamily: "'Jua', sans-serif",
            transition: 'transform 0.15s',
          }}
        >
          🔄 다시 풀기
        </button>
        <button
          onClick={onGoHome}
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: 'none',
            borderRadius: 20,
            padding: '18px',
            fontSize: 18,
            fontWeight: 900,
            color: 'var(--text-dark)',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            fontFamily: "'Jua', sans-serif",
            transition: 'transform 0.15s',
          }}
        >
          🎯 다른 테마
        </button>
        <button
          onClick={onRestart}
          style={{
            background: 'none',
            border: 'none',
            padding: '12px',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-soft)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          레벨 다시 선택
        </button>
      </div>
    </div>
  );
}
