import { useState } from 'react';
import type { Level, ThemeData, WordData } from '../data/types';
import { useLanguage } from '../i18n/LanguageContext';
import WordAnimation from './WordAnimation';

interface Props {
  theme: ThemeData;
  level: Level;
  onStartQuiz: () => void;
  onBack: () => void;
  onWordViewed?: (themeId: string, wordText: string, isLast: boolean) => void;
  favorites?: string[];
  onToggleFavorite?: (word: string) => void;
}

function getExample(word: WordData, level: Level): string {
  if (level === 'children') return word.exampleChildren;
  if (level === 'beginner') return word.exampleBeginner;
  if (level === 'intermediate') return word.exampleIntermediate;
  return word.exampleAdvanced;
}


function speakText(text: string) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function WordCard({ theme, level, onStartQuiz, onBack, onWordViewed, favorites = [], onToggleFavorite }: Props) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [justFavorited, setJustFavorited] = useState(false);
  const word = theme.words[index];
  const total = theme.words.length;
  const isFavorited = favorites.includes(word.word);

  const handlePrev = () => setIndex((i) => Math.max(0, i - 1));
  const handleNext = () => {
    onWordViewed?.(theme.id, word.word, false);
    setIndex((i) => Math.min(total - 1, i + 1));
  };
  const handleStartQuiz = () => {
    onWordViewed?.(theme.id, word.word, true);
    onStartQuiz();
  };
  const handleToggleFavorite = () => {
    if (!isFavorited) {
      setJustFavorited(true);
      setTimeout(() => setJustFavorited(false), 350);
    }
    onToggleFavorite?.(word.word);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 12 }}>
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
          <span style={{
            fontSize: 18,
            fontWeight: 900,
            color: 'var(--text-dark)',
            fontFamily: "'Jua', sans-serif",
          }}>
            {theme.emoji} {theme.title}
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
          {index + 1}/{total}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 8,
        background: 'rgba(255,255,255,0.6)',
        borderRadius: 8,
        marginBottom: 24,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #B8F0E6, #B8D4FF)',
          borderRadius: 8,
          width: `${((index + 1) / total) * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Main Card */}
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 28,
        padding: '32px 28px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        backdropFilter: 'blur(8px)',
      }}>
        {/* Word animation */}
        <div style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => speakText(word.word)}>
          <WordAnimation animationType={word.animationType} emoji={word.emoji} />
        </div>

        {/* Word */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <h2 style={{
              fontSize: 52,
              fontWeight: 900,
              color: 'var(--text-dark)',
              margin: 0,
              fontFamily: "'Jua', 'Nunito', sans-serif",
              letterSpacing: 2,
            }}>
              {word.word}
            </h2>
            <button
              onClick={() => speakText(word.word)}
              title={t.listen}
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: 12,
                width: 36,
                height: 36,
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                flexShrink: 0,
                transition: 'background 0.2s',
              }}
            >
              🔊
            </button>
            <button
              onClick={handleToggleFavorite}
              style={{
                background: isFavorited ? 'rgba(255,214,100,0.35)' : 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: 12,
                width: 36,
                height: 36,
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                flexShrink: 0,
                transition: 'transform 0.2s, background 0.2s',
                transform: justFavorited ? 'scale(1.5)' : 'scale(1)',
              }}
            >
              {isFavorited ? '⭐' : '☆'}
            </button>
          </div>

          {level !== 'advanced' && (
            <p style={{
              fontSize: 20,
              color: 'var(--text-soft)',
              fontWeight: 700,
              margin: '8px 0 0',
              fontStyle: 'italic',
            }}>
              {word.english}
            </p>
          )}
        </div>

        {/* Definition */}
        <div style={{
          background: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)',
          borderRadius: 18,
          padding: '14px 20px',
          width: '100%',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 18,
            color: 'var(--text-dark)',
            fontWeight: 700,
            margin: 0,
          }}>
            {word.definition}
          </p>
          {(level === 'children' || level === 'beginner') && (
            <p style={{
              fontSize: 14,
              color: 'var(--text-soft)',
              fontWeight: 600,
              margin: '6px 0 0',
              fontStyle: 'italic',
            }}>
              {word.definitionEn}
            </p>
          )}
        </div>

        {/* Example */}
        {(
          <div style={{
            background: 'linear-gradient(135deg, #C8EEFF 0%, #B8D4FF 100%)',
            borderRadius: 18,
            padding: '14px 20px',
            width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <p style={{
                fontSize: 13,
                color: 'var(--text-soft)',
                fontWeight: 700,
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                {t.example}
              </p>
              <button
                onClick={() => speakText(getExample(word, level))}
                title={t.listen}
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  border: 'none',
                  borderRadius: 10,
                  width: 30,
                  height: 30,
                  fontSize: 15,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  flexShrink: 0,
                  transition: 'background 0.2s',
                }}
              >
                🔊
              </button>
            </div>
            <p style={{
              fontSize: 17,
              color: 'var(--text-dark)',
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.6,
            }}>
              {getExample(word, level).replace(word.word, `✦ ${word.word} ✦`)}
            </p>
            {(level === 'children' || level === 'beginner') && (
              <p style={{
                fontSize: 14,
                color: 'var(--text-soft)',
                fontWeight: 600,
                margin: '6px 0 0',
                lineHeight: 1.5,
                fontStyle: 'italic',
              }}>
                {level === 'children' ? word.exampleChildrenEn : word.exampleBeginnerEn}
              </p>
            )}
          </div>
        )}


      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button
          onClick={handlePrev}
          disabled={index === 0}
          style={{
            flex: 1,
            background: index === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)',
            border: 'none',
            borderRadius: 18,
            padding: '16px',
            fontSize: 18,
            fontWeight: 800,
            color: index === 0 ? 'var(--text-soft)' : 'var(--text-dark)',
            cursor: index === 0 ? 'not-allowed' : 'pointer',
            boxShadow: index === 0 ? 'none' : '0 6px 16px rgba(0,0,0,0.08)',
            transition: 'transform 0.15s',
          }}
        >
          ← {t.prev}
        </button>

        {index === total - 1 ? (
          <button
            onClick={handleStartQuiz}
            style={{
              flex: 2,
              background: 'linear-gradient(135deg, #B8F0E6 0%, #B8D4FF 100%)',
              border: 'none',
              borderRadius: 18,
              padding: '16px',
              fontSize: 18,
              fontWeight: 900,
              color: 'var(--text-dark)',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
              fontFamily: "'Jua', sans-serif",
              transition: 'transform 0.15s',
            }}
          >
            {t.startQuiz} 🎯
          </button>
        ) : (
          <button
            onClick={handleNext}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.85)',
              border: 'none',
              borderRadius: 18,
              padding: '16px',
              fontSize: 18,
              fontWeight: 800,
              color: 'var(--text-dark)',
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
              transition: 'transform 0.15s',
            }}
          >
            {t.next} →
          </button>
        )}
      </div>

      {/* Quiz shortcut */}
      {index < total - 1 && (
        <button
          onClick={handleStartQuiz}
          style={{
            background: 'none',
            border: 'none',
            marginTop: 12,
            fontSize: 15,
            color: 'var(--text-soft)',
            cursor: 'pointer',
            fontWeight: 700,
            textDecoration: 'underline',
          }}
        >
          {t.goQuizNow}
        </button>
      )}
    </div>
  );
}
