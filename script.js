document.addEventListener('DOMContentLoaded', () => {
  // العناصر الأساسية
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

  // 1. تشغيل الأغنية تلقائياً عند الضغط في أي مكان بشاشة الدخول
  if (introScreen) {
    introScreen.addEventListener('click', () => {
      introScreen.classList.add('fade-out');
      
      if (audio) {
        // ضبط مستوى الصوت المبدئي
        if (volumeBar) {
          audio.volume = volumeBar.value / 100;
        }

        // تشغيل الصوت
        audio.play().then(() => {
          if (playIcon) playIcon.className = 'fas fa-pause';
          if (disc) disc.classList.add('playing');
        }).catch(err => {
          console.log("تعذر التشغيل التلقائي للصوت:", err);
        });
      }
    });
  }

  // 2. زر التشغيل والإيقاف المؤقت (Play / Pause)
  if (playPauseBtn && audio) {
    playPauseBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        if (playIcon) playIcon.className = 'fas fa-pause';
        if (disc) disc.classList.add('playing');
      } else {
        audio.pause();
        if (playIcon) playIcon.className = 'fas fa-play';
        if (disc) disc.classList.remove('playing');
      }
    });
  }

  // 3. تحديث شريط التقدم والوقت المتبقي أثناء تشغيل الأغنية
  if (audio) {
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.value = progressPercent;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
      }
    });

    // عند انتهاء الأغنية (في حال لم يكن التكرار مفعّلاً)
    audio.addEventListener('ended', () => {
      if (playIcon) playIcon.className = 'fas fa-play';
      if (disc) disc.classList.remove('playing');
      if (progressBar) progressBar.value = 0;
    });
  }

  // 4. السحب على شريط التقدم لتقديم/تأخير الأغنية
  if (progressBar && audio) {
    progressBar.addEventListener('input', () => {
      if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
      }
    });
  }

  // 5. التحكم بمستوى الصوت
  if (volumeBar && audio) {
    // ضبط الصوت عند التحميل
    audio.volume = volumeBar.value / 100;

    volumeBar.addEventListener('input', () => {
      audio.volume = volumeBar.value / 100;
      if (volNum) {
        volNum.textContent = `${volumeBar.value}%`;
      }
    });
  }

  // دالة تحويل الثواني إلى صيغة دقيقة:ثانية (0:00)
  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
});
