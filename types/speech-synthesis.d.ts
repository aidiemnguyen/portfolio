interface SpeechSynthesisEvent extends Event {
  charIndex: number;
  charLength?: number;
  elapsedTime: number;
  name: string;
}

interface SpeechSynthesisUtterance {
  onboundary: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null;
}
