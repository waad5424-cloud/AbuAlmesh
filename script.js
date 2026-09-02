document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('intro-screen');
  const mainContent = document.getElementById('main-content');
  const audio = document.getElementById('audio-player');
  const playBtn = document.getElementById('play-pause-btn');
  const disc = document.getElementById('disc');
  const progressBar = document.getElementById('progress-bar');
  const volumeBar = document.getElementById('volume-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');

  let isPlaying = false;

  // شاشة البداية وتشغيل الصوت
  introScreen.addEventListener('click', () => {
    introScreen.classList.add('fade-out');
    mainContent.classList.remove('hidden');
    togglePlay();
  });

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
      disc.classList.remove('playing');
      isPlaying = false;
    } else {
      audio.play().then(() => {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        disc.classList.add('playing');
        isPlaying = true;
      }).catch(err => console.log(err));
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', togglePlay);
  }

  // تحديث شريط تقدم الأغنية
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
      currentTimeEl.textContent = formatTime(audio.currentTime);
      durationTimeEl.textContent = formatTime(audio.duration);
    }
  });

  if (progressBar) {
    progressBar.value = 0;
    progressBar.addEventListener('input', () => {
      if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
      }
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
});
