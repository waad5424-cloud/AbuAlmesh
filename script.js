document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('intro-screen');
  const audio = document.getElementById('audio-player');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
  const progressBar = document.getElementById('progress-bar');
  const volumeBar = document.getElementById('volume-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');
  const disc = document.getElementById('disc');
  const volNum = document.querySelector('.vol-num');

  // 1. تشغيل الصوت
  function startAudio() {
    if (audio) {
      if (volumeBar) {
        audio.volume = volumeBar.value / 100;
      }
      audio.play().then(() => {
        if (playIcon) playIcon.className = 'fas fa-pause';
        if (disc) disc.classList.add('playing');
      }).catch(err => {
        console.log("Audio play error:", err);
      });
    }
  }

  if (introScreen) {
    introScreen.addEventListener('click', () => {
      introScreen.classList.add('fade-out');
      startAudio();
    });
  }

  if (playPauseBtn && audio) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (audio.paused) {
        startAudio();
      } else {
        audio.pause();
        if (playIcon) playIcon.className = 'fas fa-play';
        if (disc) disc.classList.remove('playing');
      }
    });
  }

  if (audio) {
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.value = progressPercent;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
      }
    });

    audio.addEventListener('ended', () => {
      if (playIcon) playIcon.className = 'fas fa-play';
      if (disc) disc.classList.remove('playing');
      if (progressBar) progressBar.value = 0;
    });
  }

  if (progressBar && audio) {
    progressBar.addEventListener('input', () => {
      if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
      }
    });
  }

  if (volumeBar && audio) {
    volumeBar.addEventListener('input', () => {
      audio.volume = volumeBar.value / 100;
      if (volNum) {
        volNum.textContent = `${volumeBar.value}%`;
      }
    });
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }


  // 2. تفعيل تأثير إشعاع الماوس (Mouse Glow)
  const glow = document.createElement('div');
  glow.classList.add('mouse-glow');
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });


  // 3. تفعيل أوراق الشجر المتساقطة
  const leavesContainer = document.createElement('div');
  leavesContainer.classList.add('leaves-container');
  document.body.appendChild(leavesContainer);

  const leavesCount = 15; // عدد الأوراق
  for (let i = 0; i < leavesCount; i++) {
    const leaf = document.createElement('div');
    leaf.classList.add('leaf');
    
    // خصائص عشوائية لكل ورقة
    const size = Math.random() * 10 + 10; // الحجم بين 10 و 20 بكسل
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size * 1.4}px`;
    leaf.style.left = `${Math.random() * 100}vw`;
    leaf.style.animationDuration = `${Math.random() * 5 + 5}secs`; // السرعة بين 5 إلى 10 ثواني
    leaf.style.animationDelay = `${Math.random() * 5}secs`;
    
    leavesContainer.appendChild(leaf);
  }
});
