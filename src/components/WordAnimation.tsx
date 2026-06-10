import { useEffect } from 'react';

interface Props {
  animationType: string;
  emoji: string;
}

const STYLE_ID = 'word-animation-styles';

const CSS = `
.wa-box {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
@media (max-width: 600px) {
  .wa-box { width: 150px; height: 150px; }
}
.wa-lg { font-size: 80px; display: inline-block; line-height: 1; }
.wa-md { font-size: 52px; display: inline-block; line-height: 1; }
.wa-sm { font-size: 34px; display: inline-block; line-height: 1; }
@media (max-width: 600px) {
  .wa-lg { font-size: 60px; }
  .wa-md { font-size: 40px; }
  .wa-sm { font-size: 26px; }
}

@keyframes wa-heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.38); }
}
@keyframes wa-twinkle-on {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.12; transform: scale(0.55); }
}
@keyframes wa-twinkle-off {
  0%, 100% { opacity: 0.12; transform: scale(0.55); }
  50% { opacity: 1; transform: scale(1); }
}
@keyframes wa-sneak {
  0%    { transform: translateX(-45px) scaleX(1); }
  44%   { transform: translateX(45px)  scaleX(1); }
  45%   { transform: translateX(45px)  scaleX(-1); }
  89%   { transform: translateX(-45px) scaleX(-1); }
  90%, 100% { transform: translateX(-45px) scaleX(1); }
}
@keyframes wa-wobble {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-20deg); }
  75% { transform: rotate(20deg); }
}
@keyframes wa-bounce {
  0%, 100% { transform: translateY(25px) scaleY(0.88); }
  48% { transform: translateY(-30px) scaleY(1.1); }
}
@keyframes wa-crawl {
  0%    { transform: translateX(-50px) scaleX(1); }
  44%   { transform: translateX(50px)  scaleX(1); }
  45%   { transform: translateX(50px)  scaleX(-1); }
  89%   { transform: translateX(-50px) scaleX(-1); }
  90%, 100% { transform: translateX(-50px) scaleX(1); }
}
@keyframes wa-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes wa-nod {
  0%, 100% { transform: translateY(0); }
  30%, 70% { transform: translateY(20px); }
}
@keyframes wa-shake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-18px); }
  30% { transform: translateX(18px); }
  45% { transform: translateX(-12px); }
  60% { transform: translateX(12px); }
  75% { transform: translateX(-6px); }
  90% { transform: translateX(6px); }
}
@keyframes wa-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-24px); }
}
@keyframes wa-rain {
  0%   { transform: translateY(-80px); opacity: 0; }
  12%  { opacity: 1; }
  88%  { opacity: 1; }
  100% { transform: translateY(85px); opacity: 0; }
}
@keyframes wa-snow {
  0%   { transform: translateY(-80px) rotate(0deg); opacity: 0; }
  12%  { opacity: 0.9; }
  88%  { opacity: 0.9; }
  100% { transform: translateY(85px) rotate(360deg); opacity: 0; }
}
@keyframes wa-flash {
  0%, 100% { opacity: 1; transform: scale(1); }
  45%, 55% { opacity: 0.05; transform: scale(0.88); }
}
@keyframes wa-roll {
  0%   { transform: translateX(-50px) rotate(0deg); }
  100% { transform: translateX(50px)  rotate(720deg); }
}
@keyframes wa-zigzag {
  0%   { transform: translate(-38px, 0); }
  25%  { transform: translate(0, -28px); }
  50%  { transform: translate(38px, 0); }
  75%  { transform: translate(0, 28px); }
  100% { transform: translate(-38px, 0); }
}
@keyframes wa-chaos-a {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(34px, -24px) rotate(45deg); }
  66% { transform: translate(-28px, 20px) rotate(-30deg); }
}
@keyframes wa-chaos-b {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(-34px, 24px) rotate(-45deg); }
  66% { transform: translate(28px, -20px) rotate(30deg); }
}
@keyframes wa-chaos-c {
  0%, 100% { transform: translate(0, 0) rotate(90deg); }
  33% { transform: translate(18px, 34px) rotate(180deg); }
  66% { transform: translate(-22px, -28px) rotate(270deg); }
}
@keyframes wa-idle {
  0%, 48%, 100% { transform: translateY(0) rotate(0deg); }
  55% { transform: translateY(-9px) rotate(-9deg); }
  65% { transform: translateY(-4px) rotate(6deg); }
  72% { transform: translateY(-7px) rotate(-4deg); }
  82% { transform: translateY(0) rotate(2deg); }
}
@keyframes wa-steady-pop {
  0%,  24% { opacity: 0; transform: scale(0.2) rotate(-22deg); }
  30%       { opacity: 1; transform: scale(1.28) rotate(6deg); }
  38%, 68%  { opacity: 1; transform: scale(1)    rotate(0deg); }
  78%, 100% { opacity: 0; transform: scale(0.2) rotate(-22deg); }
}
@keyframes wa-bow {
  0%, 100% { transform: rotate(0deg); }
  35%, 65% { transform: rotate(40deg); }
}
@keyframes wa-hesitate {
  0%, 100% { transform: translateX(0); }
  18%  { transform: translateX(34px); }
  38%  { transform: translateX(10px); }
  62%  { transform: translateX(38px); }
  78%  { transform: translateX(18px); }
  90%  { transform: translateX(32px); }
}
@keyframes wa-careful {
  0%   { transform: translateX(-38px); }
  100% { transform: translateX(38px); }
}
@keyframes wa-slow {
  0%   { transform: translateX(-55px); }
  100% { transform: translateX(55px); }
}
@keyframes wa-bubble {
  0%   { transform: translateY(65px) scale(0.5); opacity: 0; }
  14%  { opacity: 0.9; transform: translateY(48px) scale(0.78); }
  86%  { opacity: 0.9; }
  100% { transform: translateY(-65px) scale(1.1); opacity: 0; }
}
@keyframes wa-sizzle {
  0%, 100% { transform: translateX(0)   scaleY(1);    }
  14%       { transform: translateX(-4px) scaleY(1.12); }
  28%       { transform: translateX(4px)  scaleY(0.94); }
  42%       { transform: translateX(-3px) scaleY(1.08); }
  56%       { transform: translateX(3px)  scaleY(0.96); }
  70%       { transform: translateX(-2px) scaleY(1.04); }
  85%       { transform: translateX(2px)  scaleY(0.99); }
}
@keyframes wa-default {
  0%, 100% { transform: translateY(0)    scale(1);    }
  50%       { transform: translateY(-16px) scale(1.08); }
}
`;

export default function WordAnimation({ animationType, emoji }: Props) {
  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const el = document.createElement('style');
      el.id = STYLE_ID;
      el.textContent = CSS;
      document.head.appendChild(el);
    }
  }, []);

  switch (animationType) {

    case 'heartbeat':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-heartbeat 1s ease-in-out infinite' }}>❤️</span>
        </div>
      );

    case 'twinkle': {
      const stars = [
        { cls: 'wa-lg', x: '18%', y: '12%', dur: '1.2s', fn: 'wa-twinkle-on' },
        { cls: 'wa-md', x: '60%', y: '20%', dur: '0.9s', fn: 'wa-twinkle-off' },
        { cls: 'wa-sm', x: '8%',  y: '54%', dur: '1.5s', fn: 'wa-twinkle-on' },
        { cls: 'wa-md', x: '70%', y: '56%', dur: '1.1s', fn: 'wa-twinkle-off' },
        { cls: 'wa-md', x: '40%', y: '38%', dur: '0.8s', fn: 'wa-twinkle-on' },
      ];
      return (
        <div className="wa-box">
          {stars.map((s, i) => (
            <span
              key={i}
              className={s.cls}
              style={{ position: 'absolute', left: s.x, top: s.y, animation: `${s.fn} ${s.dur} ease-in-out infinite` }}
            >✨</span>
          ))}
        </div>
      );
    }

    case 'sneak':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-sneak 3s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );

    case 'wobble':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-wobble 1.2s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );

    case 'bounce':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-bounce 0.85s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );

    case 'crawl':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-crawl 4s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );

    case 'spin':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-spin 1.5s linear infinite' }}>{emoji}</span>
        </div>
      );

    case 'nod':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-nod 1.2s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );

    case 'shake':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-shake 1s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );

    case 'float':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-float 2.5s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );

    case 'rain': {
      const drops = [
        { x: '14%', dur: '1.2s', delay: '0s',    cls: 'wa-md' },
        { x: '29%', dur: '0.9s', delay: '0.4s',  cls: 'wa-sm' },
        { x: '49%', dur: '1.5s', delay: '0.15s', cls: 'wa-md' },
        { x: '65%', dur: '1.1s', delay: '0.7s',  cls: 'wa-sm' },
        { x: '80%', dur: '1.3s', delay: '0.28s', cls: 'wa-sm' },
      ];
      return (
        <div className="wa-box">
          {drops.map((d, i) => (
            <span
              key={i}
              className={d.cls}
              style={{ position: 'absolute', left: d.x, animation: `wa-rain ${d.dur} ease-in infinite`, animationDelay: d.delay }}
            >💧</span>
          ))}
        </div>
      );
    }

    case 'snow': {
      const flakes = [
        { x: '9%',  dur: '2.5s', delay: '0s' },
        { x: '26%', dur: '3.2s', delay: '0.8s' },
        { x: '47%', dur: '2.8s', delay: '0.3s' },
        { x: '65%', dur: '3.5s', delay: '1.2s' },
        { x: '82%', dur: '2.2s', delay: '0.6s' },
      ];
      return (
        <div className="wa-box">
          {flakes.map((f, i) => (
            <span
              key={i}
              className="wa-md"
              style={{ position: 'absolute', left: f.x, animation: `wa-snow ${f.dur} ease-in-out infinite`, animationDelay: f.delay }}
            >❄️</span>
          ))}
        </div>
      );
    }

    case 'flash':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-flash 0.8s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );

    case 'roll':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-roll 2s linear infinite alternate' }}>{emoji}</span>
        </div>
      );

    case 'zigzag':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-zigzag 2s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );

    case 'chaos':
      return (
        <div className="wa-box">
          <span className="wa-md" style={{ position: 'absolute', animation: 'wa-chaos-a 2s ease-in-out infinite' }}>↔️</span>
          <span className="wa-md" style={{ position: 'absolute', animation: 'wa-chaos-b 2.3s ease-in-out infinite', animationDelay: '0.3s' }}>↕️</span>
          <span className="wa-md" style={{ position: 'absolute', animation: 'wa-chaos-c 1.8s ease-in-out infinite', animationDelay: '0.6s' }}>↗️</span>
        </div>
      );

    case 'idle':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-idle 3s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );

    case 'steady': {
      const checks = [
        { x: '10%', delay: '0s' },
        { x: '38%', delay: '-1.4s' },
        { x: '66%', delay: '-0.7s' },
      ];
      return (
        <div className="wa-box">
          {checks.map((c, i) => (
            <span
              key={i}
              className="wa-md"
              style={{ position: 'absolute', left: c.x, top: '28%', opacity: 0, animation: 'wa-steady-pop 2.1s ease-in-out infinite', animationDelay: c.delay }}
            >✅</span>
          ))}
        </div>
      );
    }

    case 'bow':
      return (
        <div className="wa-box">
          <span
            className="wa-lg"
            style={{ animation: 'wa-bow 1.5s ease-in-out infinite', transformOrigin: 'top center' }}
          >{emoji}</span>
        </div>
      );

    case 'hesitate':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-hesitate 2.5s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );

    case 'careful':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-careful 5s ease-in-out infinite alternate' }}>{emoji}</span>
        </div>
      );

    case 'slow':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-slow 7s linear infinite alternate' }}>{emoji}</span>
        </div>
      );

    case 'bubble': {
      const bubbles = [
        { x: '16%', dur: '1.8s', delay: '0s',   cls: 'wa-md' },
        { x: '36%', dur: '2.2s', delay: '0.5s', cls: 'wa-lg' },
        { x: '57%', dur: '1.5s', delay: '0.9s', cls: 'wa-sm' },
        { x: '75%', dur: '2.5s', delay: '0.3s', cls: 'wa-md' },
      ];
      return (
        <div className="wa-box">
          {bubbles.map((b, i) => (
            <span
              key={i}
              className={b.cls}
              style={{ position: 'absolute', left: b.x, animation: `wa-bubble ${b.dur} ease-in-out infinite`, animationDelay: b.delay }}
            >🫧</span>
          ))}
        </div>
      );
    }

    case 'sizzle':
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-sizzle 0.5s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );

    default:
      return (
        <div className="wa-box">
          <span className="wa-lg" style={{ animation: 'wa-default 2s ease-in-out infinite' }}>{emoji}</span>
        </div>
      );
  }
}
