document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('intro-screen');
  const mainContent = document.getElementById('main-content');
  const audio = document.getElementById('audio-player');
  const playBtn = document.getElementById('play-pause-btn');
  const coverBox = document.getElementById('disc');
  const progressBar = document.getElementById('progress-bar');
  const volumeBar = document.getElementById('volume-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');

  let isPlaying = false;

  // ==========================================
  // 1. خلفية التساقط والجسيمات (Particles Canvas)
  // ==========================================
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let particlesArray = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 1;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.speedY = Math.random() * 1 + 0.6;
      this.color = `rgba(${168 + Math.random() * 50}, 85, 247, ${Math.random() * 0.7 + 0.3})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.y > canvas.height) {
        this.y = 0 - this.size;
        this.x = Math.random() * canvas.width;
      }
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 8000);
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // ==========================================
  // 2. أثر حركة الماوس الأرجواني (Mouse Trail Canvas)
  // ==========================================
  const trailCanvas = document.createElement('canvas');
  trailCanvas.id = 'cursor-trail';
  trailCanvas.style.position = 'fixed';
  trailCanvas.style.top = '0';
  trailCanvas.style.left = '0';
  trailCanvas.style.width = '100%';
  trailCanvas.style.height = '100%';
  trailCanvas.style.pointerEvents = 'none';
  trailCanvas.style.zIndex = '9999';
  document.body.appendChild(trailCanvas);

  const trailCtx = trailCanvas.getContext('2d');
  let trailParticles = [];

  function resizeTrailCanvas() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  resizeTrailCanvas();
  window.addEventListener('resize', resizeTrailCanvas);

  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = (Math.random() - 0.5) * 1.5;
      this.color = `rgba(168, 85, 247, ${Math.random() * 0.5 + 0.5})`;
      this.life = 1;
      this.decay = Math.random() * 0.03 + 0.02;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.size *= 0.95;
      this.life -= this.decay;
    }

    draw() {
      trailCtx.save();
      trailCtx.globalAlpha = Math.max(0, this.life);
      trailCtx.fillStyle = this.color;
      trailCtx.shadowBlur = 10;
      trailCtx.shadowColor = '#c084fc';
      trailCtx.beginPath();
      trailCtx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
      trailCtx.fill();
      trailCtx.restore();
    }
  }

  window.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 3; i++) {
      trailParticles.push(new TrailParticle(e.clientX, e.clientY));
    }
  });

  function animateTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    for (let i = 0; i < trailParticles.length; i++) {
      trailParticles[i].update();
      trailParticles[i].draw();
      if (trailParticles[i].life <= 0 || trailParticles[i].size <= 0.2) {
        trailParticles.splice(i, 1);
        i--;
      }
    }
    requestAnimationFrame(animateTrail);
  }

  animateTrail();

  // ==========================================
  // 3. التحكم بالموسيقى وشاشة الدخول
  // ==========================================
  introScreen.addEventListener('click', () => {
    introScreen.classList.add('fade-out');
    mainContent.classList.remove('hidden');
    togglePlay();
  });

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
      coverBox.classList.remove('playing');
      isPlaying = false;
    } else {
      audio.play().then(() => {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        coverBox.classList.add('playing');
        isPlaying = true;
      }).catch(err => console.log(err));
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', togglePlay);
  }

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
      currentTimeEl.textContent = formatTime(audio.currentTime);
      durationTimeEl.textContent = formatTime(audio.duration);
    }
  });

  if (progressBar) {
    progressBar.addEventListener('input', () => {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    });
  }

  if (volumeBar) {
    volumeBar.addEventListener('input', () => {
      audio.volume = volumeBar.value / 100;
    });
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // ==========================================
  // 4. ديسكورد عبر Lanyard API
  // ==========================================
  const DISCORD_ID = "1159623336041652244";

  async function fetchDiscordStatus() {
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      const data = await response.json();

      if (data.success && data.data) {
        const user = data.data;

        const avatarUrl = user.discord_user.avatar
          ? `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.discord_user.avatar}.png?size=128`
          : `https://cdn.discordapp.com/embed/avatars/0.png`;
        const avatarEl = document.querySelector('.discord-avatar');
        if (avatarEl) avatarEl.src = avatarUrl;

        const nameEl = document.querySelector('.discord-user-header h3');
        if (nameEl) nameEl.textContent = user.discord_user.global_name || user.discord_user.username;

        const statusDot = document.querySelector('.status-indicator');
        if (statusDot) statusDot.className = `status-indicator ${user.discord_status}`;

        const activityEl = document.querySelector('.discord-activity');
        if (activityEl) {
          if (user.activities && user.activities.length > 0) {
            const customStatus = user.activities.find(a => a.type === 4);
            const gameStatus = user.activities.find(a => a.type === 0);
            const spotifyStatus = user.activities.find(a => a.name === "Spotify");

            if (spotifyStatus) {
              activityEl.textContent = `🎵 Listening to ${spotifyStatus.details}`;
            } else if (gameStatus) {
              activityEl.textContent = `🎮 Playing ${gameStatus.name}`;
            } else if (customStatus && customStatus.state) {
              activityEl.textContent = customStatus.state;
            } else {
              activityEl.textContent = user.activities[0].name;
            }
          } else {
            activityEl.textContent = "لا يوجد نشاط حالي";
          }
        }
      }
    } catch (error) {
      console.error("خطأ في جلب بيانات ديسكورد:", error);
    }
  }

  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 10000);
});
