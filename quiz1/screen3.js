// Screen 3 Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('gameContainer');

  // Responsive 9:16 Vertical Scale Handler (1080px x 1920px)
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

  const handleAnyClick = (e) => {
    if (e && e.type === 'touchend') e.preventDefault();
    window.location.href = 'screen4.html';
  };
  gameContainer.addEventListener('click', handleAnyClick);
  gameContainer.addEventListener('touchend', handleAnyClick);
});
