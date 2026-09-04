document.addEventListener('DOMContentLoaded', () => {

  // --- 1. عداد الزيارات ---
  const visitorCountEl = document.getElementById('visitor-count');
  if (visitorCountEl) {
    let visits = localStorage.getItem('site_visits') || 1042;
    if (!sessionStorage.getItem('counted')) {
      visits = parseInt(visits) + 1;
      localStorage.setItem('site_visits', visits);
      sessionStorage.setItem('counted', 'true');
    }
    visitorCountEl.textContent = Number(visits).toLocaleString();
  }

  // --- 2. شاشة الترحيب وتشغيل الموسيقى ---
  const introScreen = document.getElementById('intro-screen');
  const enterBtn = document.getElementById('enter-btn');
  const audioPlayer = document.getElementById('audio-player');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const disc = document.getElementById('disc');

  let isPlaying = false;

  function removeIntro() {
    if (introScreen) {
      introScreen.classList.add('fade-out');
      setTimeout(() => introScreen.style.display = 'none', 600);
      
      if (audioPlayer && !isPlaying) {
        audioPlayer.play().then(() => {
          isPlaying = true;
          if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
          if (disc) disc.classList.add('playing');
        }).catch(err => console.log("Autoplay blocked:", err));
      }
    }
  }

  if (enterBtn) enterBtn.addEventListener('click', removeIntro);
  window.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.code === 'Space') removeIntro(); });
  if (introScreen) introScreen.addEventListener('click', removeIntro);

  // --- 3. زر العودة للأعلى ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // --- 4. جلب حالة الديسكورد ---
  const DISCORD_USER_ID = "1159623336041652244";
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
        if (usernameEl && discord_user.username) {
          usernameEl.textContent = discord_user.username;
        }
        if (statusDot && statusTextEl) {
          statusDot.className = `status-indicator ${discord_status || 'offline'}`;
          statusTextEl.textContent = (discord_status || 'offline').toUpperCase();
        }
        if (deviceEl) {
          let devices = [];
          if (active_on_discord_desktop) devices.push("Desktop");
          if (active_on_discord_mobile) devices.push("Mobile");
          if (active_on_discord_web) devices.push("Web");
          deviceEl.textContent = devices.length ? `Active on: ${devices.join(', ')}` : "Offline";
        }
        if (activityEl) {
          activityEl.textContent = activities?.length ? `Playing: ${activities[0].name}` : "No activities right now.";
        }
      }
    } catch (e) {
      if (statusTextEl) statusTextEl.textContent = "OFFLINE";
      if (statusDot) statusDot.className = "status-indicator offline";
      if (deviceEl) deviceEl.textContent = "Offline";
      if (activityEl) activityEl.textContent = "No activities right now.";
    }
  }
  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 30000);

  // --- 5. مشغل الموسيقى وقائمة الأغاني ---
  const progressBar = document.getElementById('progress-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');
  const volumeBar = document.getElementById('volume-bar');
  const trackTitle = document.getElementById('current-track-title');
  const trackCounter = document.getElementById('track-counter');
  const discTrackName = document.getElementById('disc-track-name');
  const discArtistName = document.getElementById('disc-artist-name');
  const playlistItems = document.querySelectorAll('.playlist-item');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');

  // الـ 4 أغاني بترتيبها الصحيح المطابق للـ HTML تماماً
  const playlist = [
    { title: "Runaway", artist: "AURORA", src: "https://files.catbox.moe/7wl70w.mp3" },
    { title: "I Wanna Be Yours", artist: "Arctic Monkeys", src: "https://files.catbox.moe/azuegp.mp3" },
    { title: "Thank You", artist: "Dido (Slowed/Reverb)", src: "https://files.catbox.moe/f0ui4v.mp4" },
    { title: "All Girls Are The Same", artist: "Juice WRLD", src: "https://files.catbox.moe/2zyo0g.mp4" }
  ];

  let currentTrackIndex = 0;

  function loadTrack(index) {
    if (!playlist[index]) return;
    const track = playlist[index];
    if (audioPlayer) audioPlayer.src = track.src;
    if (trackTitle) trackTitle.textContent = track.title;
    if (discTrackName) discTrackName.textContent = track.title;
    if (discArtistName) discArtistName.textContent = track.artist;
    if (trackCounter) trackCounter.textContent = `${index + 1}/${playlist.length}`;
    
    playlistItems.forEach((item, idx) => {
      item.classList.toggle('active', idx === index);
    });
  }

  function togglePlay() {
    if (!audioPlayer) return;
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      if (disc) disc.classList.remove('playing');
    } else {
      audioPlayer.play().then(() => {
        isPlaying = true;
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        if (disc) disc.classList.add('playing');
      }).catch(err => console.log("Playback error:", err));
    }
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlay);
  }

  if (audioPlayer) {
    audioPlayer.addEventListener('timeupdate', () => {
      if (audioPlayer.duration && progressBar) {
        progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        
        let cMin = Math.floor(audioPlayer.currentTime / 60);
        let cSec = Math.floor(audioPlayer.currentTime % 60);
        if (currentTimeEl) currentTimeEl.textContent = `${cMin}:${cSec < 10 ? '0' : ''}${cSec}`;

        let dMin = Math.floor(audioPlayer.duration / 60);
        let dSec = Math.floor(audioPlayer.duration % 60);
        if (durationTimeEl && !isNaN(audioPlayer.duration)) {
          durationTimeEl.textContent = `${dMin}:${dSec < 10 ? '0' : ''}${dSec}`;
        }
      }
    });

    audioPlayer.addEventListener('ended', () => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      loadTrack(currentTrackIndex);
      if (audioPlayer) audioPlayer.play();
    });
  }

  if (progressBar && audioPlayer) {
    progressBar.addEventListener('input', () => {
      if (audioPlayer.duration) {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
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
      if (audioPlayer) {
        audioPlayer.play().then(() => {
          isPlaying = true;
          if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
          if (disc) disc.classList.add('playing');
        }).catch(err => console.log("Play error:", err));
      }
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      loadTrack(currentTrackIndex);
      if (isPlaying && audioPlayer) audioPlayer.play();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      loadTrack(currentTrackIndex);
      if (isPlaying && audioPlayer) audioPlayer.play();
    });
  }

  loadTrack(currentTrackIndex);
});
