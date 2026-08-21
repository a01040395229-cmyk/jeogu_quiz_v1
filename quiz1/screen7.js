// Screen 7 Interactive Logic (Air Transport Quiz)

document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('gameContainer');
  const optionButtons = document.querySelectorAll('.option-btn');
  const popupWrapper = document.getElementById('popupWrapper');
  const popupContent = document.getElementById('popupContent');
  const popupImg = document.getElementById('popupImg');
  const congratulationWrapper = document.getElementById('congratulationWrapper');
  const btnNext = document.getElementById('btnNext');

  let congratulationTimer = null;

  // Audio Files Setup
  const clickAudio = new Audio('sound/클릭효과음 1.mp3');
  const correctAudio = new Audio('sound/정답 효과음.mp3');
  const incorrectAudio1 = new Audio('sound/오답 효과음 1.mp3');
  const incorrectAudio2 = new Audio('sound/오답 효과음 2.mp3');

  function playClickSound() {
    try {
      clickAudio.currentTime = 0;
      clickAudio.play().catch(() => {});
    } catch (e) {}
  }

  function playCorrectSound() {
    try {
      correctAudio.currentTime = 0;
      correctAudio.play().catch(() => {});
    } catch (e) {}
  }

  function playIncorrectSound() {
    try {
      incorrectAudio2.currentTime = 0;
      incorrectAudio2.play().catch(() => {});
    } catch (e) {}
  }

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

  // Incorrect Popups List for Random Alternating Display
  const incorrectPopups = [
    'assets/quiz1_incorrect_popup1_jeogu_o.svg',
    'assets/quiz1_incorrect_popup2_jeogu_o.svg'
  ];

  let lastIncorrectIndex = -1;

  function getNextIncorrectPopup() {
    let nextIndex = Math.floor(Math.random() * incorrectPopups.length);
    if (nextIndex === lastIncorrectIndex) {
      nextIndex = (nextIndex + 1) % incorrectPopups.length;
    }
    lastIncorrectIndex = nextIndex;
    return incorrectPopups[nextIndex];
  }

  /* ══ 축하 컨패티 파티클 시스템 (screen2 퀴즈2.html 그대로 적용) ══ */
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx    = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiParticles = [];
  let confettiAnimId    = null;

  const CONFETTI_COLORS = [
    '#35D047', '#0E9D2D', '#4CEE5F', // 지구저구 그린
    '#FF66B6', '#FFD7EC', '#FF1493', // 핑크
    '#FFC25F', '#FFA500', '#FFD700', // 옐로우/골드
    '#407AB9', '#60A5FA', '#38BDF8', // 블루
    '#FFFFFF'                         // 화이트
  ];

  class ConfettiParticle {
    constructor(originX, originY) {
      this.x = originX + (Math.random() * 260 - 130);
      this.y = originY + (Math.random() * 100 - 50);

      // 상단 및 양옆으로 팡 터져나가는 속도
      const angle = (Math.PI * 1.5) + (Math.random() * 1.6 - 0.8);
      const speed = 22 + Math.random() * 26;
      this.vx = Math.cos(angle) * speed + (Math.random() * 16 - 8);
      this.vy = Math.sin(angle) * speed - (10 + Math.random() * 14);

      this.gravity = 0.65 + Math.random() * 0.3;
      this.friction = 0.965;

      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.type  = Math.floor(Math.random() * 3); // 0: 리본, 1: 원형 도트, 2: 별/다이아

      this.size   = 18 + Math.random() * 18;
      this.aspect = 0.35 + Math.random() * 0.5;

      this.rotation  = Math.random() * Math.PI * 2;
      this.rotSpeed  = (Math.random() * 0.16 - 0.08);

      this.flip      = Math.random() * Math.PI;
      this.flipSpeed = 0.09 + Math.random() * 0.14;

      this.opacity   = 1;
      this.fadeSpeed = 0.004 + Math.random() * 0.006;
      this.life      = 1;
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;

      this.x += this.vx;
      this.y += this.vy;

      this.rotation += this.rotSpeed;
      this.flip += this.flipSpeed;

      // 하강 시작 후 페이드아웃
      if (this.vy > 3) {
        this.life -= this.fadeSpeed * 2;
        this.opacity = Math.max(0, this.life);
      }
    }

    draw(ctx) {
      if (this.opacity <= 0) return;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(1, Math.cos(this.flip)); // 3D 회전 텀블링
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle   = this.color;

      if (this.type === 0) {
        // 직사각형 리본 조각
        ctx.fillRect(-this.size / 2, (-this.size * this.aspect) / 2, this.size, this.size * this.aspect);
      } else if (this.type === 1) {
        // 원형 도트
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.38, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // 다이아몬드 / 별 조각
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.55);
        ctx.lineTo(this.size * 0.45, 0);
        ctx.lineTo(0, this.size * 0.55);
        ctx.lineTo(-this.size * 0.45, 0);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function launchConfetti() {
    if (!confettiCanvas || !confettiCtx) return;
    confettiCanvas.style.display = 'block';
    confettiParticles = [];

    // 팝업 뒤쪽 상단에서 160개 파티클 동시 폭발
    for (let i = 0; i < 160; i++) {
      confettiParticles.push(new ConfettiParticle(540, 750));
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);

    function render() {
      confettiCtx.clearRect(0, 0, 1080, 1920);
      let aliveCount = 0;

      for (let p of confettiParticles) {
        p.update();
        p.draw(confettiCtx);
        if (p.opacity > 0 && p.y < 1950) aliveCount++;
      }

      if (aliveCount > 0) {
        confettiAnimId = requestAnimationFrame(render);
      } else {
        confettiCanvas.style.display = 'none';
        confettiCtx.clearRect(0, 0, 1080, 1920);
      }
    }

    render();
  }

  function stopConfetti() {
    if (confettiAnimId) {
      cancelAnimationFrame(confettiAnimId);
      confettiAnimId = null;
    }
    if (confettiCanvas) {
      confettiCanvas.style.display = 'none';
    }
    if (confettiCtx) {
      confettiCtx.clearRect(0, 0, 1080, 1920);
    }
  }

  // LocalStorage Setup
  let solvedAnswers = [];
  try {
    const stored = localStorage.getItem('quiz1_solved_answers');
    if (stored) solvedAnswers = JSON.parse(stored);
  } catch(e) {}

  // Option Button Click Event Listeners
  optionButtons.forEach(btn => {
    const answer = btn.getAttribute('data-answer');

    // Dim if already solved
    if (solvedAnswers.includes(answer)) {
      btn.style.opacity = '0.5';
      btn.style.pointerEvents = 'none';
    }

    const handleOptionSelect = (e) => {
      e.stopPropagation();
      if (e.type === 'touchend') e.preventDefault();

      // 1. Play click sound immediately
      playClickSound();

      // 2. 0.25s Delay before showing popup and playing result sound
      setTimeout(() => {
        if (answer === 'rhino') {
          playCorrectSound();
          if (!solvedAnswers.includes(answer)) {
            solvedAnswers.push(answer);
            localStorage.setItem('quiz1_solved_answers', JSON.stringify(solvedAnswers));
          }
          popupImg.src = 'assets/air_correct_popup_jeogu_o.svg';
          popupWrapper.classList.remove('hidden');
        } else {
          if (congratulationWrapper) {
            congratulationWrapper.classList.add('hidden');
            stopConfetti();
          }
          playIncorrectSound();
          popupImg.src = getNextIncorrectPopup();
          popupWrapper.classList.remove('hidden');
        }
      }, 250);
    };

    btn.addEventListener('click', handleOptionSelect);
    btn.addEventListener('touchend', handleOptionSelect);
  });

  // Next Button Click Handler
  const handleNextClick = (e) => {
    e.stopPropagation();
    if (e.type === 'touchend') e.preventDefault();
    playClickSound();
    stopConfetti();
    if (congratulationWrapper) {
      congratulationWrapper.classList.add('hidden');
    }
    if (popupWrapper) {
      popupWrapper.classList.add('hidden');
    }
    setTimeout(() => {
      window.location.href = '../road/scene2.html';
    }, 100);
  };

  if (btnNext) {
    btnNext.addEventListener('click', handleNextClick);
    btnNext.addEventListener('touchend', handleNextClick);
  }

  // Popup Overlay Click to Dismiss / Close
  const handlePopupDismiss = (e) => {
    if (e) {
      e.stopPropagation();
      if (e.type === 'touchend') e.preventDefault();
    }
    playClickSound();
    stopConfetti();
    popupWrapper.classList.add('hidden');
    
    // Check if it was correct popup
    if (popupImg && !popupImg.src.includes('incorrect_popup')) {
      if (congratulationWrapper) {
        congratulationWrapper.classList.remove('hidden');
        launchConfetti();
      }
    }
  };

  if (popupWrapper) {
    popupWrapper.addEventListener('click', handlePopupDismiss);
    popupWrapper.addEventListener('touchend', handlePopupDismiss);
  }

  if (popupContent) {
    popupContent.addEventListener('click', handlePopupDismiss);
    popupContent.addEventListener('touchend', handlePopupDismiss);
  }
});
