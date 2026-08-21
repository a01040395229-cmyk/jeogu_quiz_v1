/**
 * Confetti (3D 폭죽/꽃가루 파티클 시스템)
 * - 외부 라이브러리 없이 독립적으로 작동
 * - 3D 텀블링 회전, 3종류 형태 (리본, 원형, 다이아몬드)
 */

(function (global) {
  const CONFETTI_COLORS = [
    '#35D047', '#0E9D2D', '#4CEE5F', // 그린
    '#FF66B6', '#FFD7EC', '#FF1493', // 핑크
    '#FFC25F', '#FFA500', '#FFD700', // 옐로우
    '#407AB9', '#60A5FA', '#38BDF8', // 블루
    '#FFFFFF', '#BDD5EE'             // 화이트 & 스카이블루
  ];

  class ConfettiParticle {
    constructor(originX, originY) {
      this.x = originX + (Math.random() * 260 - 130);
      this.y = originY + (Math.random() * 100 - 50);

      const angle = Math.PI * 1.5 + (Math.random() * 1.6 - 0.8);
      const speed = 22 + Math.random() * 26;
      this.vx = Math.cos(angle) * speed + (Math.random() * 16 - 8);
      this.vy = Math.sin(angle) * speed - (10 + Math.random() * 14);

      this.gravity = 0.65 + Math.random() * 0.3;
      this.friction = 0.965;

      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.type = Math.floor(Math.random() * 3); // 0: 리본, 1: 원형, 2: 다이아몬드

      this.size = 18 + Math.random() * 18;
      this.aspect = 0.35 + Math.random() * 0.5;

      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = Math.random() * 0.16 - 0.08;

      this.flip = Math.random() * Math.PI;
      this.flipSpeed = 0.09 + Math.random() * 0.14;

      this.opacity = 1;
      this.fadeSpeed = 0.004 + Math.random() * 0.006;
      this.life = 1;
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.flip += this.flipSpeed;

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
      ctx.scale(1, Math.cos(this.flip));
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.type === 0) {
        ctx.fillRect(-this.size / 2, (-this.size * this.aspect) / 2, this.size, this.size * this.aspect);
      } else if (this.type === 1) {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.38, 0, Math.PI * 2);
        ctx.fill();
      } else {
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

  let confettiParticles = [];
  let confettiAnimId = null;

  global.launchConfetti = function (originX = 540, originY = 750, count = 160) {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
      console.warn('[Confetti] #confetti-canvas 요소를 찾을 수 없습니다.');
      return;
    }

    const ctx = canvas.getContext('2d');
    canvas.style.display = 'block';
    confettiParticles = [];

    for (let i = 0; i < count; i++) {
      confettiParticles.push(new ConfettiParticle(originX, originY));
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      for (let p of confettiParticles) {
        p.update();
        p.draw(ctx);
        if (p.opacity > 0 && p.y < canvas.height + 50) aliveCount++;
      }

      if (aliveCount > 0) {
        confettiAnimId = requestAnimationFrame(render);
      } else {
        canvas.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    render();
  };
})(window);
