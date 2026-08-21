// 16:9 Vertical Game Screen Interactive Logic (Screen 1 & Screen 2 Navigation)

document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('gameContainer');
  const bgImg = document.getElementById('bgImg');
  const typingTextEl = document.getElementById('typingText');
  const btBack = document.getElementById('btBack');

  let currentScreen = 1;
  let typingInProgress = false;
  let typingTimeoutId = null;

  // 1. Responsive 9:16 Scale Handler for Stage Container
  function resizeGameContainer() {
    const baseWidth = 655;
    const baseHeight = 1163;

    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight;

    const scaleX = availableWidth / baseWidth;
    const scaleY = availableHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    gameContainer.style.transform = `scale(${scale})`;
  }

  window.addEventListener('resize', resizeGameContainer);
  resizeGameContainer();

  // 2. Korean Hangul Jamo Decomposition Helper
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

  // 3. Screen Data Definitions
  const screens = {
    1: {
      bg: "assets/backgrond1.svg",
      audio: "sound/중국에서 베트남까지 택배를 15톤 운송하려고 해요.mp3",
      fallbackDuration: 3600,
      textParts: [
        { text: "중국에서 베트남까지\n택배를 ", isBlack: false },
        { text: "15톤 운송", isBlack: true },
        { text: "하려고 해요", isBlack: false }
      ]
    },
    2: {
      bg: "assets/background2.svg",
      audio: "sound/그 과정에서 다양한 운송수단이 활용돼요.mp3",
      fallbackDuration: 2800,
      textParts: [
        { text: "그 과정에서 다양한\n운송수단이 활용돼요", isBlack: false }
      ]
    }
  };

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

  function renderScreen(screenNum) {
    currentScreen = screenNum;
    const config = screens[screenNum];

    // Change Background SVG
    bgImg.src = config.bg;

    // Start Typing Animation
    startTypingMotion(config.textParts, config.audio, config.fallbackDuration);
  }

  // 4. Typing Motion / Timing Portion Reveal synchronized with Audio
  function startTypingMotion(textParts, audioPath, fallbackDuration = 3000) {
    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
    }
    if (typingAudio) {
      typingAudio.pause();
      typingAudio.currentTime = 0;
    }

    typingTextEl.innerHTML = '<span class="typing-cursor"></span>';
    typingInProgress = true;

    let audioStarted = false;

    if (audioPath) {
      const encodedPath = encodeURI(audioPath);
      typingAudio = new Audio(encodedPath);
      typingAudio.currentTime = 0;

      const startSyncMotion = () => {
        if (audioStarted) return;
        audioStarted = true;
      };

      const playPromise = typingAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          startSyncMotion();
        }).catch(err => {
          console.log('Voice audio autoplay wait for user gesture:', err);

          const unlockAndRestart = () => {
            window.removeEventListener('click', unlockAndRestart);
            window.removeEventListener('touchstart', unlockAndRestart);
            window.removeEventListener('keydown', unlockAndRestart);

            if (typingAudio) {
              typingAudio.currentTime = 0;
              typingAudio.play().then(() => {
                // Restart typing synchronized with voice audio
                startTypingMotion(textParts, audioPath, fallbackDuration);
              }).catch(() => {});
            }
          };

          window.addEventListener('click', unlockAndRestart);
          window.addEventListener('touchstart', unlockAndRestart);
          window.addEventListener('keydown', unlockAndRestart);
        });
      }
    }

    const totalUnits = calculateTotalStepUnits(textParts);

    function getTargetDurationMs() {
      if (typingAudio && typingAudio.duration && isFinite(typingAudio.duration) && typingAudio.duration > 0) {
        return typingAudio.duration * 1000;
      }
      return fallbackDuration;
    }

    let currentPartIndex = 0;
    let currentCharIndex = 0;
    let currentJamoIndex = 0;
    let baseHTML = "";

    function step() {
      if (!typingInProgress) return;

      if (currentPartIndex >= textParts.length) {
        typingTextEl.innerHTML = baseHTML;
        typingInProgress = false;
        return;
      }

      const currentPart = textParts[currentPartIndex];
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

  // 5. Click anywhere on screen to move from Screen 1 -> Screen 2
  gameContainer.addEventListener('click', (e) => {
    // Prevent triggering screen transition when clicking the back button
    if (e.target.closest('#btBack')) return;

    if (currentScreen === 1) {
      renderScreen(2);
    }
  });

  // 6. Back Button Navigation Handler
  btBack.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentScreen === 2) {
      // On Screen 2: return to Screen 1
      renderScreen(1);
    } else {
      // On Screen 1: trigger browser history back
      if (window.history.length > 1) {
        window.history.back();
      } else {
        console.log('뒤로가기 실행 (이전 페이지가 없습니다.)');
        window.history.back();
      }
    }
  });

  // Initial load: Screen 1
  renderScreen(1);
});

