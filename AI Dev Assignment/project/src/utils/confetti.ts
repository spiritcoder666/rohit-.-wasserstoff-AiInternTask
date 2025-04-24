import confetti from 'canvas-confetti';

export function playConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4F46E5', '#10B981', '#F59E0B'],
  });
}