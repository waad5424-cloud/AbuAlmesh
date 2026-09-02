document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('intro-screen');
  const audio = document.getElementById('audio-player');
  const playBtn = document.getElementById('play-pause-btn');
  const disc = document.getElementById('disc');
  const progressBar = document.getElementById('progress-bar');
  const volumeBar = document.getElementById('volume-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');

  let isPlaying = false;

  // تأثير جزيئات الخلفية المتصلة (Constellation Canvas)
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Star());

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.strokeStyle = `rgba(168, 85, 247, ${1 - dist / 120 * 0.8})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // دخول المواقع
  if (introScreen) {
    introScreen.addEventListener('click', () => {
      introScreen.classList.add('fade-out');
      togglePlay();
    });
  }

  function togglePlay() {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
      if (disc) disc.classList.remove('playing');
      isPlaying = false;
    } else {
      audio.play().then(() => {
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        if (disc) disc.classList.add('playing');
        isPlaying = true;
      }).catch(err => console.log(err));
    }
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);

  if (audio) {
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.value = progress;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
      }
    });
  }

  if (progressBar && audio) {
    progressBar.addEventListener('input', () => {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    });
  }

  if (volumeBar && audio) {
    volumeBar.addEventListener('input', () => {
      audio.volume = volumeBar.value / 100;
    });
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Lanyard Discord Status
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

        const nameEl = document.querySelector('.dc-username');
        if (nameEl) nameEl.textContent = user.discord_user.global_name || user.discord_user.username;

        const activityEl = document.querySelector('.dc-activity');
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
            activityEl.textContent = "ما فيه نشاط ظاهر حاليًا";
          }
        }
      }
    } catch (error) {
      console.error("Discord API Error:", error);
    }
  }

  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 10000);
});
