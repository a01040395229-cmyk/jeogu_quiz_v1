// Screen 2 Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('gameContainer');
  const typingTextEl = document.getElementById('typingText');

  let typingInProgress = false;
  let typingTimeoutId = null;

  // Responsive 9:16 Vertical Scale Handler
  function resizeGameContainer() {
    const baseWidth = 1080;
    const baseHeight = 1920;

    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight;

    const scaleX = availableWidth / baseWidth;
    const scaleY = availableHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    gameContainer.style.transform = `scale(${scale})`;
  }

  window.addEventListener('resize', resizeGameContainer);
  resizeGameContainer();

  // Korean Hangul Jamo Decomposition Helper
  const CHO = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const JUNG = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ"];
  const JONG = ["", "ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

  function decomposeHangul(char) {
    const code = char.charCodeAt(0) - 44032;
    if (code < 0 || code > 11172) return [char];

    const choIndex = Math.floor(code / 588);
    const jungIndex = Math.floor((code % 588) / 28);
    const jongIndex = code % 28;

    const choChar = CHO[choIndex];
    const choJungChar = String.fromCharCode(44032 + (choIndex * 588) + (jungIndex * 28));

    const steps = [choChar, choJungChar];
    if (jongIndex > 0) {
      steps.push(char);
    }
    return steps;
  }

  let typingAudio = null;
  let audioStarted = false;

  // Screen 2 Text Data
  const textParts = [
    { text: "그 과정에서 다양한\n운송수단이 활용돼요", isBlack: false }
  ];

  function calculateTotalStepUnits(parts) {
    let count = 0;
    parts.forEach(part => {
      for (let i = 0; i < part.text.length; i++) {
        const char = part.text[i];
        if (char === "\n") {
          count += 1.5;
        } else if (char === " ") {
          count += 1.2;
        } else {
          const jamos = decomposeHangul(char);
          count += jamos.length;
        }
      }
    });
    return count;
  }

  function initVoiceAndTyping() {
    if (typingTimeoutId) clearTimeout(typingTimeoutId);
    if (typingAudio) {
      typingAudio.pause();
      typingAudio.currentTime = 0;
    }

    const audioPath = encodeURI('sound/그 과정에서 다양한 운송수단이 활용돼요.mp3');
    typingAudio = new Audio(audioPath);
    typingAudio.currentTime = 0;

    const startSyncMotion = () => {
      if (audioStarted) return;
      audioStarted = true;
      startTypingMotion(textParts);
    };

    // Attempt playback immediately
    const playPromise = typingAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        startSyncMotion();
      }).catch(err => {
        console.log('Voice audio autoplay wait for user gesture:', err);
        // Start typing right away, and restart in sync when user clicks/taps
        startTypingMotion(textParts);

        const unlockAndRestart = () => {
          window.removeEventListener('click', unlockAndRestart);
          window.removeEventListener('touchstart', unlockAndRestart);
          window.removeEventListener('keydown', unlockAndRestart);

          if (typingAudio) {
            typingAudio.currentTime = 0;
            typingAudio.play().then(() => {
              audioStarted = false;
              startSyncMotion();
            }).catch(() => {});
          }
        };

        window.addEventListener('click', unlockAndRestart);
        window.addEventListener('touchstart', unlockAndRestart);
        window.addEventListener('keydown', unlockAndRestart);
      });
    } else {
      startSyncMotion();
    }
  }

  function startTypingMotion(parts) {
    if (typingTimeoutId) clearTimeout(typingTimeoutId);

    typingTextEl.innerHTML = '<span class="typing-cursor"></span>';
    typingInProgress = true;

    const totalUnits = calculateTotalStepUnits(parts);

    function getTargetDurationMs() {
      if (typingAudio && typingAudio.duration && isFinite(typingAudio.duration) && typingAudio.duration > 0) {
        return typingAudio.duration * 1000;
      }
      return 2800; // Fallback estimate in ms
    }

    let currentPartIndex = 0;
    let currentCharIndex = 0;
    let currentJamoIndex = 0;
    let baseHTML = "";

    function step() {
      if (!typingInProgress) return;

      if (currentPartIndex >= parts.length) {
        typingTextEl.innerHTML = baseHTML;
        typingInProgress = false;
        return;
      }

      const currentPart = parts[currentPartIndex];
      const char = currentPart.text[currentCharIndex];

      const durationMs = getTargetDurationMs();
      const baseUnitDelay = Math.max(15, durationMs / totalUnits);

      if (char === "\n") {
        baseHTML += "<br>";
        typingTextEl.innerHTML = baseHTML + '<span class="typing-cursor"></span>';
        currentCharIndex++;
        if (currentCharIndex >= currentPart.text.length) {
          currentCharIndex = 0;
          currentPartIndex++;
        }
        typingTimeoutId = setTimeout(step, Math.round(baseUnitDelay * 1.5));
        return;
      }

      const jamos = decomposeHangul(char);
      const currentJamo = jamos[currentJamoIndex];

      const formattedJamo = currentPart.isBlack
        ? `<span class="font-black">${currentJamo}</span>`
        : currentJamo;

      typingTextEl.innerHTML = baseHTML + formattedJamo + '<span class="typing-cursor"></span>';

      currentJamoIndex++;

      if (currentJamoIndex >= jamos.length) {
        const fullFormattedChar = currentPart.isBlack
          ? `<span class="font-black">${char}</span>`
          : char;
        baseHTML += fullFormattedChar;
        currentJamoIndex = 0;
        currentCharIndex++;

        if (currentCharIndex >= currentPart.text.length) {
          currentCharIndex = 0;
          currentPartIndex++;
        }
      }

      const delay = (char === ' ') ? Math.round(baseUnitDelay * 1.2) : Math.round(baseUnitDelay);
      typingTimeoutId = setTimeout(step, delay);
    }

    step();
  }

  const handleAnyClick = (e) => {
    if (e && e.type === 'touchend') e.preventDefault();
    if (!typingInProgress) {
      window.location.href = 'screen3.html';
    }
  };
  gameContainer.addEventListener('click', handleAnyClick);
  gameContainer.addEventListener('touchend', handleAnyClick);

  initVoiceAndTyping();
});
