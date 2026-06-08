import { themes } from '../data/index';
import type { ProgressData } from '../utils/progress';

interface Props {
  progress: ProgressData;
}

export default function Progress({ progress }: Props) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 24,
          fontWeight: 900,
          color: 'var(--text-dark)',
          margin: '0 0 4px',
          fontFamily: "'Jua', sans-serif",
        }}>
          학습 진도
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-soft)', fontWeight: 600, margin: 0 }}>
          나의 학습 기록을 확인해요
        </p>
      </div>

      {/* 통계 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{
          background: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)',
          borderRadius: 20,
          padding: '20px 16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>📖</div>
          <div style={{
            fontSize: 36,
            fontWeight: 900,
            color: 'var(--text-dark)',
            fontFamily: "'Jua', sans-serif",
            lineHeight: 1,
          }}>
            {progress.todayWords.length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-soft)', fontWeight: 700, marginTop: 6 }}>
            오늘 학습
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #B8F0E6 0%, #FFFFFF 100%)',
          borderRadius: 20,
          padding: '20px 16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🏆</div>
          <div style={{
            fontSize: 36,
            fontWeight: 900,
            color: 'var(--text-dark)',
            fontFamily: "'Jua', sans-serif",
            lineHeight: 1,
          }}>
            {progress.totalWords}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-soft)', fontWeight: 700, marginTop: 6 }}>
            전체 누적
          </div>
        </div>

        <div style={{
          gridColumn: '1 / -1',
          background: 'linear-gradient(135deg, #B8D4FF 0%, #C8EEFF 100%)',
          borderRadius: 20,
          padding: '20px 16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🔥</div>
          <div style={{
            fontSize: 44,
            fontWeight: 900,
            color: 'var(--text-dark)',
            fontFamily: "'Jua', sans-serif",
            lineHeight: 1,
          }}>
            {progress.streak}일
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-soft)', fontWeight: 700, marginTop: 6 }}>
            연속 학습 중!
          </div>
        </div>
      </div>

      {/* 틀린 단어 복습 */}
      {Object.keys(progress.wrongWords || {}).some((k) => (progress.wrongWords[k]?.length ?? 0) > 0) && (
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 20,
          padding: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          backdropFilter: 'blur(8px)',
          marginBottom: 0,
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(progress.wrongWords)
              .filter(([, words]) => words.length > 0)
              .map(([themeId, words]) => {
                const theme = themes.find((t) => t.id === themeId);
                if (!theme) return null;
                return (
                  <div key={themeId} style={{
                    background: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)',
                    borderRadius: 14,
                    padding: '12px 16px',
                  }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: 'var(--text-dark)',
                      fontFamily: "'Jua', sans-serif",
                      marginBottom: 6,
                    }}>
                      {theme.emoji} {theme.title}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {words.map((w) => (
                        <span key={w} style={{
                          background: 'rgba(255,255,255,0.7)',
                          borderRadius: 10,
                          padding: '3px 10px',
                          fontSize: 14,
                          fontWeight: 700,
                          color: 'var(--text-dark)',
                        }}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 테마 현황 */}
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
          테마 학습 현황
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {themes.map((theme) => {
            const done = progress.completedThemes.includes(theme.id);
            return (
              <div
                key={theme.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  background: done
                    ? 'linear-gradient(135deg, #B8F0E6 0%, #C8EEFF 100%)'
                    : 'rgba(0,0,0,0.03)',
                  borderRadius: 14,
                  border: done
                    ? '1px solid rgba(184,240,230,0.6)'
                    : '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <span style={{ fontSize: 22 }}>{theme.emoji}</span>
                <span style={{
                  flex: 1,
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  fontFamily: "'Jua', sans-serif",
                }}>
                  {theme.title}
                </span>
                <span style={{ fontSize: done ? 18 : 13, color: done ? undefined : 'var(--text-soft)', fontWeight: 600 }}>
                  {done ? '✅' : '미완료'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
