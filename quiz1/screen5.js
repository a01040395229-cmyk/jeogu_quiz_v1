// Screen 5 Interactive Logic (Rail Transport Quiz)

document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('gameContainer');
  const optionButtons = document.querySelectorAll('.option-btn');
  const popupWrapper = document.getElementById('popupWrapper');
  const popupContent = document.getElementById('popupContent');
  const popupImg = document.getElementById('popupImg');

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
        if (answer === 'boar') {
          playCorrectSound();
          if (!solvedAnswers.includes(answer)) {
            solvedAnswers.push(answer);
            localStorage.setItem('quiz1_solved_answers', JSON.stringify(solvedAnswers));
          }
          popupImg.src = 'assets/rail_correct_popup_jeogu_o.svg';
          popupWrapper.classList.remove('hidden');
        } else {
          playIncorrectSound();
          popupImg.src = getNextIncorrectPopup();
          popupWrapper.classList.remove('hidden');
        }
      }, 250);
    };

    btn.addEventListener('click', handleOptionSelect);
    btn.addEventListener('touchend', handleOptionSelect);
  });

  // Popup Overlay Click to Dismiss / Close
  const handlePopupDismiss = (e) => {
    if (e) {
      e.stopPropagation();
      if (e.type === 'touchend') e.preventDefault();
    }
    playClickSound();
    popupWrapper.classList.add('hidden');
    
    // Check if it was correct popup
    if (popupImg && !popupImg.src.includes('incorrect_popup')) {
      window.location.href = 'screen6.html';
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
