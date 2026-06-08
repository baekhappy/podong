import type { Level, WordData, ThemeData } from '../data/types';

interface Props {
  correct: number;
  total: number;
  wrongWords: WordData[];
  elapsedSeconds: number;
  level: Level;
  theme: ThemeData;
  onRetry: () => void;
  onRetryWrong: () => void;
  onGoTheme: () => void;
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

function getRating(pct: number) {
  if (pct === 100) return { msg: '완벽해요!', emoji: '🏆', bg: 'linear-gradient(135deg, #FFF5B8 0%, #B8F0E6 100%)' };
  if (pct >= 80)  return { msg: '잘했어요!',  emoji: '🌟', bg: 'linear-gradient(135deg, #B8F0E6 0%, #C8EEFF 100%)' };
  if (pct >= 60)  return { msg: '좋아요!',    emoji: '👍', bg: 'linear-gradient(135deg, #B8D4FF 0%, #FFD6E8 100%)' };
  return           { msg: '다시 도전해봐요!', emoji: '💪', bg: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)' };
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}분 ${s % 60}초` : `${s}초`;
}

export default function QuizResult({ correct, total, wrongWords, elapsedSeconds, level, theme, onRetry, onRetryWrong, onGoTheme }: Props) {
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  const rating = getRating(pct);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 20px', gap: 20 }}>

      {/* 점수 카드 */}
      <div style={{
        background: rating.bg,
        borderRadius: 28,
        padding: '32px 24px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}>
        <div className="anim-bounce" style={{ fontSize: 64, marginBottom: 8 }}>{rating.emoji}</div>
        <h2 style={{
          fontSize: 28,
          fontWeight: 900,
          color: 'var(--text-dark)',
          margin: '0 0 20px',
          fontFamily: "'Jua', sans-serif",
        }}>
          {rating.msg}
        </h2>

        <div style={{
          background: 'rgba(255,255,255,0.7)',
          borderRadius: 20,
          padding: '20px',
          marginBottom: 12,
        }}>
          <div style={{
            fontSize: 60,
            fontWeight: 900,
            color: 'var(--text-dark)',
            fontFamily: "'Nunito', sans-serif",
            lineHeight: 1,
          }}>
            {correct}
            <span style={{ fontSize: 28, color: 'var(--text-soft)' }}>/{total}</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-soft)', margin: '6px 0 12px' }}>
            {pct}%
          </div>
          <div style={{ height: 10, background: 'rgba(0,0,0,0.08)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #B8F0E6, #B8D4FF)',
              borderRadius: 8,
              width: `${pct}%`,
              transition: 'width 0.8s ease',
            }} />
          </div>
          {elapsedSeconds > 0 && (
            <div style={{ fontSize: 13, color: 'var(--text-soft)', fontWeight: 700, marginTop: 10 }}>
              ⏱ {formatTime(elapsedSeconds)}
            </div>
          )}
        </div>

        <div style={{ fontSize: 14, color: 'var(--text-soft)', fontWeight: 700 }}>
          {theme.emoji} {theme.title}
        </div>
      </div>

      {/* 틀린 단어 복습 */}
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 20,
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        backdropFilter: 'blur(8px)',
      }}>
        <h3 style={{
          fontSize: 17,
          fontWeight: 900,
          color: 'var(--text-dark)',
          margin: '0 0 16px',
          fontFamily: "'Jua', sans-serif",
        }}>
          틀린 단어 복습
        </h3>

        {wrongWords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 22 }}>
            모두 맞혔어요! 🎉
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {wrongWords.map((word) => (
              <div
                key={word.word}
                style={{
                  background: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)',
                  borderRadius: 16,
                  padding: '16px',
                }}
              >
                {/* 단어 + 발음 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>{word.emoji}</span>
                  <span style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: 'var(--text-dark)',
                    fontFamily: "'Jua', sans-serif",
                    flex: 1,
                  }}>
                    {word.word}
                  </span>
                  <button
                    onClick={() => speakText(word.word)}
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      border: 'none',
                      borderRadius: 10,
                      width: 32,
                      height: 32,
                      fontSize: 16,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    🔊
                  </button>
                </div>

                {/* 뜻 */}
                <p style={{
                  fontSize: 15,
                  color: 'var(--text-dark)',
                  fontWeight: 700,
                  margin: '0 0 10px',
                }}>
                  {word.definition}
                </p>

                {/* 예문 */}
                <div style={{
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <p style={{
                    fontSize: 14,
                    color: 'var(--text-soft)',
                    fontWeight: 600,
                    margin: 0,
                    flex: 1,
                    lineHeight: 1.6,
                  }}>
                    {getExample(word, level)}
                  </p>
                  <button
                    onClick={() => speakText(getExample(word, level))}
                    style={{
                      background: 'rgba(255,255,255,0.6)',
                      border: 'none',
                      borderRadius: 8,
                      width: 28,
                      height: 28,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    🔊
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={onRetry}
          style={{
            background: 'linear-gradient(135deg, #B8F0E6 0%, #B8D4FF 100%)',
            border: 'none',
            borderRadius: 20,
            padding: '18px',
            fontSize: 17,
            fontWeight: 900,
            color: 'var(--text-dark)',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            fontFamily: "'Jua', sans-serif",
          }}
        >
          🔄 다시 풀기
        </button>

        {wrongWords.length > 0 && (
          <button
            onClick={onRetryWrong}
            style={{
              background: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)',
              border: 'none',
              borderRadius: 20,
              padding: '18px',
              fontSize: 17,
              fontWeight: 900,
              color: 'var(--text-dark)',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              fontFamily: "'Jua', sans-serif",
            }}
          >
            ❌ 틀린 단어만 다시 풀기 ({wrongWords.length}개)
          </button>
        )}

        <button
          onClick={onGoTheme}
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: 'none',
            borderRadius: 20,
            padding: '18px',
            fontSize: 17,
            fontWeight: 900,
            color: 'var(--text-dark)',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            fontFamily: "'Jua', sans-serif",
          }}
        >
          📚 테마 목록으로
        </button>
      </div>

    </div>
  );
}
