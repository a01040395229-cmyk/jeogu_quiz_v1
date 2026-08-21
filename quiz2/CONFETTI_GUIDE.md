# 🎉 컨패티(Confetti / 폭죽) 효과 가이드

현재 프로젝트(`screen2.html`)에 적용된 3D 컨패티 효과를 그대로 다른 화면/파일에 추가하는 가이드입니다.

---

## 🤖 1. AI에게 그대로 전달하는 프롬프트

사용 중인 AI(ChatGPT, Claude, Cursor 등)에게 아래 내용을 그대로 복사해서 전달하세요.

```markdown
현재 내 HTML/JS 코드에 아래와 동일한 '3D 컨패티(폭죽) 효과'를 추가해줘.

### 1. HTML에 추가
```html
<canvas id="confetti-canvas" width="1080" height="1920"></canvas>
```

### 2. CSS에 추가
```css
#confetti-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 1080px;
  height: 1920px;
  z-index: 250;
  pointer-events: none;
  display: none;
}
```

### 3. JavaScript에 추가
```javascript
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx    = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiAnimId    = null;

const CONFETTI_COLORS = [
  '#35D047', '#0E9D2D', '#4CEE5F', // 그린
  '#FF66B6', '#FFD7EC', '#FF1493', // 핑크
  '#FFC25F', '#FFA500', '#FFD700', // 옐로우/골드
  '#407AB9', '#60A5FA', '#38BDF8', // 블루
  '#FFFFFF'                         // 화이트
];

class ConfettiParticle {
  constructor(originX, originY) {
    this.x = originX + (Math.random() * 260 - 130);
    this.y = originY + (Math.random() * 100 - 50);

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
    ctx.fillStyle   = this.color;

    if (this.type === 0) {
      // 직사각형 리본
      ctx.fillRect(-this.size / 2, (-this.size * this.aspect) / 2, this.size, this.size * this.aspect);
    } else if (this.type === 1) {
      // 원형 도트
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.38, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 다이아몬드 / 별
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
  confettiCanvas.style.display = 'block';
  confettiParticles = [];

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
```

### 4. 실행 방법
원하는 시점(팝업이 나타날 때 등)에 아래 함수를 호출하도록 연결해줘:
```javascript
launchConfetti();
```
```

---

## 🛠 2. 직접 복사해서 적용할 때

1. **HTML**: `<canvas id="confetti-canvas" width="1080" height="1920"></canvas>` 를 화면 컨테이너에 추가
2. **CSS**: `#confetti-canvas` 스타일 추가
3. **JS**: 위 JavaScript 코드 그대로 붙여넣기
4. **호출**: 실행하고 싶은 시점에 `launchConfetti();` 호출
