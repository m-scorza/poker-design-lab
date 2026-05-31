// Text scramble decoder. Resolves a target string from random glyphs.
export function scrambleText(elementId, finalString, duration = 0.8) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@+-./";
  const length = finalString.length;
  let frame = 0;
  const totalFrames = duration * 60;

  const interval = setInterval(() => {
    let currentString = "";
    for (let i = 0; i < length; i++) {
      if (Math.random() < frame / totalFrames) {
        currentString += finalString[i];
      } else {
        currentString += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    el.innerText = currentString;
    frame++;
    if (frame >= totalFrames) {
      clearInterval(interval);
      el.innerText = finalString;
    }
  }, 1000 / 60);
}
