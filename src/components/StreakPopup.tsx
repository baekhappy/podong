import { useState, useEffect } from 'react';

interface Props {
  streak: number;
  onDismiss: () => void;
}

export default function StreakPopup({ streak, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDismiss]);

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        top: 80,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? 0 : -14}px)`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        zIndex: 300,
        background: 'linear-gradient(135deg, #FFF5B8 0%, #FFD6E8 100%)',
        borderRadius: 20,
        padding: '14px 28px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        textAlign: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 28, display: 'block', marginBottom: 4 }}>🔥</span>
      <span style={{
        fontSize: 15,
        fontWeight: 900,
        color: 'var(--text-dark)',
        fontFamily: "'Jua', sans-serif",
      }}>
        {streak}일 연속 학습 중!
      </span>
    </div>
  );
}
