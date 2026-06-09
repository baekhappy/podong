import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onComplete: () => void;
}

const TOTAL = 3;

export default function Onboarding({ onComplete }: Props) {
  const { t } = useLanguage();
  const [slide, setSlide] = useState(0);

  const goNext = () => {
    if (slide < TOTAL - 1) setSlide(slide + 1);
    else onComplete();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #FFD6E8 0%, #C8EEFF 50%, #B8F0E6 100%)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* 건너뛰기 */}
      <button
        onClick={onComplete}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          background: 'rgba(255,255,255,0.7)',
          border: 'none',
          borderRadius: 12,
          padding: '8px 16px',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text-soft)',
          cursor: 'pointer',
        }}
      >
        {t.skip}
      </button>

      {/* 슬라이드 뷰포트 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          width: `${TOTAL * 100}%`,
          height: '100%',
          transform: `translateX(-${slide * (100 / TOTAL)}%)`,
          transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}>

          {/* ── 슬라이드 1: 앱 소개 ── */}
          <div style={{
            width: `${100 / TOTAL}%`,
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '56px 24px 16px',
            gap: 18,
            boxSizing: 'border-box',
          }}>
            {/* 로고 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 32 }}>🐡</span>
              <span style={{
                fontSize: 22,
                fontWeight: 900,
                color: 'var(--text-dark)',
                fontFamily: "'Jua', sans-serif",
              }}>
                포동포동
              </span>
            </div>

            <div className="anim-bounce" style={{ fontSize: 72 }}>🎵</div>

            <h1 style={{
              fontSize: 24,
              fontWeight: 900,
              color: 'var(--text-dark)',
              margin: 0,
              textAlign: 'center',
              fontFamily: "'Jua', sans-serif",
              lineHeight: 1.4,
            }}>
              한국어 의성어·의태어를<br />배워요!
            </h1>

            <p style={{
              fontSize: 15,
              color: 'var(--text-soft)',
              fontWeight: 600,
              textAlign: 'center',
              margin: 0,
              lineHeight: 1.7,
            }}>
              소리와 움직임을 표현하는 재미있는 한국어 단어들을 배워보세요.
              듣고, 읽고, 퀴즈로 확인해요!
            </p>

            {/* 예시 단어 */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { word: '두근두근', emoji: '💓', cls: 'anim-heartbeat' },
                { word: '반짝반짝', emoji: '✨', cls: 'anim-twinkle' },
                { word: '살금살금', emoji: '🐱', cls: 'anim-creep' },
              ].map((item) => (
                <div key={item.word} style={{
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: 18,
                  padding: '14px 18px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
                  minWidth: 88,
                }}>
                  <div className={item.cls} style={{ fontSize: 28 }}>{item.emoji}</div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 900,
                    color: 'var(--text-dark)',
                    fontFamily: "'Jua', sans-serif",
                    marginTop: 6,
                  }}>
                    {item.word}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 슬라이드 2: 학습 방법 ── */}
          <div style={{
            width: `${100 / TOTAL}%`,
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '56px 24px 16px',
            gap: 20,
            boxSizing: 'border-box',
          }}>
            <div className="anim-bounce" style={{ fontSize: 72 }}>📚</div>

            <h2 style={{
              fontSize: 26,
              fontWeight: 900,
              color: 'var(--text-dark)',
              margin: 0,
              fontFamily: "'Jua', sans-serif",
            }}>
              이렇게 배워요!
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 360 }}>
              {[
                { icon: '🎯', title: '테마 선택', desc: '동물, 날씨, 감정 등 9가지 테마' },
                { icon: '📖', title: '단어 학습', desc: '뜻과 예문, 발음까지 확인' },
                { icon: '✏️', title: '퀴즈',     desc: '배운 단어를 퀴즈로 확인' },
              ].map((step, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.85)',
                  borderRadius: 18,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #B8D4FF, #B8F0E6)',
                    borderRadius: 14,
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    flexShrink: 0,
                  }}>
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-dark)', fontFamily: "'Jua', sans-serif" }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-soft)', fontWeight: 600, marginTop: 2 }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 슬라이드 3: 레벨 선택 안내 ── */}
          <div style={{
            width: `${100 / TOTAL}%`,
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '56px 24px 16px',
            gap: 18,
            boxSizing: 'border-box',
          }}>
            <div className="anim-twinkle" style={{ fontSize: 72 }}>🌟</div>

            <h2 style={{
              fontSize: 22,
              fontWeight: 900,
              color: 'var(--text-dark)',
              margin: 0,
              textAlign: 'center',
              fontFamily: "'Jua', sans-serif",
              lineHeight: 1.4,
            }}>
              나에게 맞는 레벨을<br />선택하세요!
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 360 }}>
              {[
                { emoji: '🌈', label: '어린이', desc: '한국어를 처음 배우는 어린이', bg: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)' },
                { emoji: '🌱', label: '초급',   desc: '한국어를 배우기 시작한 분',  bg: 'linear-gradient(135deg, #B8F0E6 0%, #FFFFFF 100%)' },
                { emoji: '🌿', label: '중급',   desc: '기본 한국어를 아는 분',      bg: 'linear-gradient(135deg, #B8D4FF 0%, #FFFFFF 100%)' },
                { emoji: '🌊', label: '고급',   desc: '한국어를 잘 하는 분',        bg: 'linear-gradient(135deg, #C8EEFF 0%, #B8F0E6 100%)' },
              ].map((lvl) => (
                <div key={lvl.label} style={{
                  background: lvl.bg,
                  borderRadius: 18,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}>
                  <span style={{ fontSize: 28 }}>{lvl.emoji}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-dark)', fontFamily: "'Jua', sans-serif" }}>
                      {lvl.label}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-soft)', fontWeight: 600, marginTop: 2 }}>
                      {lvl.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 하단: 인디케이터 + 버튼 */}
      <div style={{
        padding: '16px 24px 36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)',
      }}>
        {/* 슬라이드 인디케이터 */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === slide ? 'var(--text-dark)' : 'rgba(0,0,0,0.2)',
                transition: 'width 0.3s ease, background 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* 다음 / 시작하기 버튼 */}
        <button
          onClick={goNext}
          style={{
            background: 'linear-gradient(135deg, #B8D4FF 0%, #B8F0E6 100%)',
            border: 'none',
            borderRadius: 20,
            padding: '16px 56px',
            fontSize: 18,
            fontWeight: 900,
            color: 'var(--text-dark)',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            fontFamily: "'Jua', sans-serif",
            transition: 'transform 0.15s',
          }}
        >
          {slide === TOTAL - 1 ? `${t.start} 🚀` : `${t.next} →`}
        </button>
      </div>

    </div>
  );
}
