export function speakText(text: string, level: string): void {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  const speedMap: Record<string, number> = {
    children: 0.6,
    beginner: 0.7,
    intermediate: 0.85,
    advanced: 1.0,
  };
  utterance.rate = speedMap[level] ?? 0.85;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  window.speechSynthesis.speak(utterance);
}
