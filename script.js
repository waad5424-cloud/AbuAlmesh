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

  // دالة تشغيل الصوت
  function startAudio() {
    if (audio) {
      if (volumeBar) {
        audio.volume = volumeBar.value / 100;
      }
      audio.play().then(() => {
        if (playIcon) playIcon.className = 'fas fa-pause';
        if (disc) disc.classList.add('playing');
      }).catch(err => {
        console.log("Audio playback error:", err);
      });
    }
  }

  // عند الضغط على شاشة الدخول
  if (introScreen) {
    introScreen.addEventListener('click', () => {
      introScreen.classList.add('fade-out');
      startAudio();
    });
  }

  // زر التشغيل والإيقاف
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

  // تحديث شريط التقدم والوقت
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

  // تقديم وتأخير الأغنية
  if (progressBar && audio) {
    progressBar.addEventListener('input', () => {
      if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
      }
    });
  }

  // التحكم في مستوى الصوت
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
});
