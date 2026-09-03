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
  
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const trackCounter = document.getElementById('track-counter');
  const currentTrackTitle = document.getElementById('current-track-title');
  const discTrackName = document.getElementById('disc-track-name');
  const discArtistName = document.getElementById('disc-artist-name');
  const playlistItems = document.querySelectorAll('.playlist-item');

  // قائمة الأغاني (الأولى هي I Wanna Be Yours)
  const playlist = [
    {
      title: "I Wanna Be Yours",
      artist: "Arctic Monkeys",
      src: "https://files.catbox.moe/ves6c4.webm"
    },
    {
      title: "Thank You",
      artist: "Dido (Slowed/Reverb)",
      src: "https://files.catbox.moe/f0ui4v.mp4"
    },
    {
      title: "All Girls Are The Same",
      artist: "Juice WRLD",
      src: "https://files.catbox.moe/2zyo0g.mp4"
    }
  ];

  let currentTrackIndex = 0;

  function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = playlist[index].src;
    currentTrackTitle.textContent = playlist[index].title;
    discTrackName.textContent = playlist[index].title;
    discArtistName.textContent = playlist[index].artist;
    trackCounter.textContent = `${index + 1}/${playlist.length}`;

    playlistItems.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // تحميل الأغنية الأولى افتراضياً
  loadTrack(0);

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

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let nextIndex = (currentTrackIndex + 1) % playlist.length;
      loadTrack(nextIndex);
      startAudio();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      loadTrack(prevIndex);
      startAudio();
    });
  }

  playlistItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index'));
      loadTrack(idx);
      startAudio();
    });
  });

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
      let nextIndex = (currentTrackIndex + 1) % playlist.length;
      loadTrack(nextIndex);
      startAudio();
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

  // إشعاع الماوس الأحمر الفاتح
  const glow = document.createElement('div');
  glow.classList.add('mouse-glow');
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });

  // أوراق الشجر المتساقطة
  const leavesContainer = document.createElement('div');
  leavesContainer.classList.add('leaves-container');
  document.body.appendChild(leavesContainer);

  const leavesCount = 20; 
  for (let i = 0; i < leavesCount; i++) {
    const leaf = document.createElement('div');
    leaf.classList.add('leaf');
    
    const size = Math.random() * 12 + 10; 
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size * 1.3}px`;
    leaf.style.left = `${Math.random() * 100}vw`;
    leaf.style.animationDuration = `${Math.random() * 6 + 4}s`; 
    leaf.style.animationDelay = `${Math.random() * 5}s`;
    
    leavesContainer.appendChild(leaf);
  }

  // جلب بيانات الديسكورد عبر Lanyard API
  const discordId = "1159623336041652244";
  const avatarEl = document.getElementById("discord-avatar");
  const usernameEl = document.getElementById("discord-username");
  const statusDot = document.getElementById("discord-status-dot");
  const statusText = document.getElementById("discord-status-text");
  const deviceEl = document.getElementById("discord-device");
  const activityEl = document.getElementById("discord-activity");

  function fetchDiscordStatus() {
    fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const user = data.data;
          
          if (user.discord_user) {
            usernameEl.textContent = user.discord_user.username;
            if (user.discord_user.avatar) {
              avatarEl.src = `https://cdn.discordapp.com/avatars/${discordId}/${user.discord_user.avatar}.png?size=128`;
            }
          }

          const status = user.discord_status;
          statusDot.className = `status-indicator ${status}`;
          statusText.textContent = status.toUpperCase();

          if (user.active_on_discord_desktop) deviceEl.textContent = "Desktop";
          else if (user.active_on_discord_mobile) deviceEl.textContent = "Mobile";
          else if (user.active_on_discord_web) deviceEl.textContent = "Web";
          else deviceEl.textContent = "Offline";

          if (user.activities && user.activities.length > 0) {
            const currentAct = user.activities[0];
            activityEl.textContent = `يتفاعل مع: ${currentAct.name}`;
          } else {
            activityEl.textContent = "ما فيه نشاط ظاهر حاليًا";
          }
        }
      })
      .catch(err => console.log("Lanyard fetch error:", err));
  }

  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 15000);
});
