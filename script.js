document.addEventListener('DOMContentLoaded', () => {

  // --- 1. عداد الزيارات (Visitor Counter) ---
  const visitorCountEl = document.getElementById('visitor-count');
  if (visitorCountEl) {
    let visits = localStorage.getItem('site_visits');
    if (!visits) {
      visits = 1042; // رقم بداية فخم
    } else {
      if (!sessionStorage.getItem('counted')) {
        visits = parseInt(visits) + 1;
        localStorage.setItem('site_visits', visits);
        sessionStorage.setItem('counted', 'true');
      }
    }
    visitorCountEl.textContent = visits.toLocaleString();
  }

  // --- 2. شاشة الترحيب (Intro Screen) ---
  const introScreen = document.getElementById('intro-screen');
  const enterBtn = document.getElementById('enter-btn');

  function removeIntro() {
    if (introScreen) {
      introScreen.classList.add('fade-out');
      setTimeout(() => {
        introScreen.style.display = 'none';
      }, 600);
    }
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', removeIntro);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.code === 'Space') {
      removeIntro();
    }
  });

  if (introScreen) {
    introScreen.addEventListener('click', removeIntro);
  }

  // --- 3. مشغل الموسيقى (Music Player) ---
  const audioPlayer = document.getElementById('audio-player');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const progressBar = document.getElementById('progress-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');
  const volumeBar = document.getElementById('volume-bar');
  const trackTitle = document.getElementById('current-track-title');
  const trackCounter = document.getElementById('track-counter');
  const disc = document.getElementById('disc');
  const discTrackName = document.getElementById('disc-track-name');
  const discArtistName = document.getElementById('disc-artist-name');
  const playlistItems = document.querySelectorAll('.playlist-item');

  // قائمة الأغاني
  const playlist = [
    {
      title: "I Wanna Be Yours",
      artist: "Arctic Monkeys",
      src: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3" // رابط تجريبي مؤقت
    },
    {
      title: "Thank You",
      artist: "Dido (Slowed/Reverb)",
      src: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3"
    },
    {
      title: "All Girls Are The Same",
      artist: "Juice WRLD",
      src: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3"
    }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;

  function loadTrack(index) {
    const track = playlist[index];
    audioPlayer.src = track.src;
    trackTitle.textContent = track.title;
    discTrackName.textContent = track.title;
    discArtistName.textContent = track.artist;
    trackCounter.textContent = `${index + 1}/${playlist.length}`;
    
    playlistItems.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  function togglePlay() {
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      disc.classList.remove('playing');
    } else {
      audioPlayer.play().catch(e => console.log("Audio play blocked:", e));
      isPlaying = true;
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      disc.classList.add('playing');
    }
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlay);
  }

  // تحديث شريط التقدم
  if (audioPlayer) {
    audioPlayer.addEventListener('timeupdate', () => {
      if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercent;
        
        // حساب الوقت الحالي
        let currentMinutes = Math.floor(audioPlayer.currentTime / 60);
        let currentSeconds = Math.floor(audioPlayer.currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;

        // حساب الوقت الكلي
        let durationMinutes = Math.floor(audioPlayer.duration / 60);
        let durationSeconds = Math.floor(audioPlayer.duration % 60);
        if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
        if (!isNaN(audioPlayer.duration)) {
          durationTimeEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }
      }
    });

    audioPlayer.addEventListener('ended', () => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      loadTrack(currentTrackIndex);
      audioPlayer.play();
    });
  }

  if (progressBar) {
    progressBar.addEventListener('input', () => {
      if (audioPlayer.duration) {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
      }
    });
  }

  // التحكم بالصوت
  if (volumeBar && audioPlayer) {
    audioPlayer.volume = volumeBar.value / 100;
    volumeBar.addEventListener('input', () => {
      audioPlayer.volume = volumeBar.value / 100;
    });
  }

  // الضغط على القائمة لتغيير الأغنية
  playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentTrackIndex = index;
      loadTrack(currentTrackIndex);
      audioPlayer.play();
      isPlaying = true;
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      disc.classList.add('playing');
    });
  });

  // أزرار التالي والسابق
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      loadTrack(currentTrackIndex);
      if (isPlaying) audioPlayer.play();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      loadTrack(currentTrackIndex);
      if (isPlaying) audioPlayer.play();
    });
  }

  // تحميل الأغنية الأولى كبداية
  loadTrack(currentTrackIndex);

});
