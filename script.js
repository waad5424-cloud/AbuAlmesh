document.addEventListener('DOMContentLoaded', () => {

  // --- 1. عداد الزيارات (Visitor Counter) ---
  const visitorCountEl = document.getElementById('visitor-count');
  if (visitorCountEl) {
    let visits = localStorage.getItem('site_visits');
    if (!visits) {
      visits = 1042;
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

  // --- 3. زر العودة إلى الأعلى ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 4. جلب حالة الدسكورد (Discord Status API) ---
  const DISCORD_USER_ID = "YOUR_DISCORD_ID_HERE"; 
  
  async function fetchDiscordStatus() {
    const avatarEl = document.getElementById('discord-avatar');
    const statusDot = document.getElementById('discord-status-dot');
    const usernameEl = document.getElementById('discord-username');
    const statusTextEl = document.getElementById('discord-status-text');
    const deviceEl = document.getElementById('discord-device');
    const activityEl = document.getElementById('discord-activity');

    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      const data = await res.json();

      if (data.success && data.data) {
        const { discord_user, discord_status, activities, active_on_discord_desktop, active_on_discord_mobile, active_on_discord_web } = data.data;

        if (avatarEl && discord_user.avatar) {
          avatarEl.src = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`;
        }
        if (usernameEl) {
          usernameEl.textContent = discord_user.username;
        }

        if (statusDot && statusTextEl) {
          statusDot.className = `status-indicator ${discord_status}`;
          statusTextEl.textContent = discord_status.toUpperCase();
          statusTextEl.className = `dc-badge ${discord_status}`;
        }

        if (deviceEl) {
          let devices = [];
          if (active_on_discord_desktop) devices.push("Desktop");
          if (active_on_discord_mobile) devices.push("Mobile");
          if (active_on_discord_web) devices.push("Web");
          deviceEl.textContent = devices.length > 0 ? `Active on: ${devices.join(', ')}` : "Offline";
        }

        if (activityEl) {
          if (activities && activities.length > 0) {
            const currentAct = activities.find(a => a.type === 0) || activities[0];
            activityEl.textContent = `Playing / Doing: ${currentAct.name}`;
          } else {
            activityEl.textContent = "No activities right now.";
          }
        }
      }
    } catch (err) {
      console.log("Discord API error:", err);
      if (activityEl) activityEl.textContent = "Offline or API error";
    }
  }

  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 30000);

  // --- 5. مشغل الموسيقى (Music Player) ---
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

  // روابط صوتية مباشرة ومفتوحة المصدر لضمان العمل الفوري
  const playlist = [
    {
      title: "I Wanna Be Yours",
      artist: "Arctic Monkeys",
      src: "https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg"
    },
    {
      title: "Thank You",
      artist: "Dido (Slowed/Reverb)",
      src: "https://actions.google.com/sounds/v1/weather/wind_heavy.ogg"
    },
    {
      title: "All Girls Are The Same",
      artist: "Juice WRLD",
      src: "https://actions.google.com/sounds/v1/relax/ocean_waves.ogg"
    }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;

  function loadTrack(index) {
    const track = playlist[index];
    audioPlayer.src = track.src;
    track.title ? trackTitle.textContent = track.title : null;
    if(discTrackName) discTrackName.textContent = track.title;
    if(discArtistName) discArtistName.textContent = track.artist;
    if(trackCounter) trackCounter.textContent = `${index + 1}/${playlist.length}`;
    
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
      audioPlayer.play().then(() => {
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        disc.classList.add('playing');
      }).catch(e => {
        console.log("Audio play blocked by browser:", e);
      });
    }
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlay);
  }

  if (audioPlayer) {
    audioPlayer.addEventListener('timeupdate', () => {
      if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercent;
        
        let currentMinutes = Math.floor(audioPlayer.currentTime / 60);
        let currentSeconds = Math.floor(audioPlayer.currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;

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

  if (volumeBar && audioPlayer) {
    audioPlayer.volume = volumeBar.value / 100;
    volumeBar.addEventListener('input', () => {
      audioPlayer.volume = volumeBar.value / 100;
    });
  }

  playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentTrackIndex = index;
      loadTrack(currentTrackIndex);
      audioPlayer.play().then(() => {
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        disc.classList.add('playing');
      });
    });
  });

  const nextBtn = document.getElementById('next-bin') || document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-bin') || document.getElementById('prev-btn');

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

  loadTrack(currentTrackIndex);

});
