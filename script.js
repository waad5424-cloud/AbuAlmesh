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
  // ربط ديسكورد لايف عبر Lanyard API (I4.J)
  // ==========================================
  const DISCORD_ID = "1159623336041652244";

  async function fetchDiscordStatus() {
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      const data = await response.json();

      if (data.success && data.data) {
        const user = data.data;

        // 1. الصورة الشخصية
        const avatarUrl = user.discord_user.avatar
          ? `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.discord_user.avatar}.png?size=128`
          : `https://cdn.discordapp.com/embed/avatars/0.png`;
        const avatarEl = document.querySelector('.discord-avatar');
        if (avatarEl) avatarEl.src = avatarUrl;

        // 2. اسم الحساب
        const nameEl = document.querySelector('.discord-user-header h3');
        if (nameEl) nameEl.textContent = user.discord_user.global_name || user.discord_user.username;

        // 3. نقطة حالة الاتصال (أونلاين/مشغول/خامل/أوفلاين)
        const statusDot = document.querySelector('.status-indicator');
        if (statusDot) statusDot.className = `status-indicator ${user.discord_status}`;

        // 4. النشاط الحالي
        const activityEl = document.querySelector('.discord-activity');
        if (activityEl) {
          if (user.activities && user.activities.length > 0) {
            const customStatus = user.activities.find(a => a.type === 4);
            const gameStatus = user.activities.find(a => a.type === 0);
            const spotifyStatus = user.activities.find(a => a.name === "Spotify");

            if (spotifyStatus) {
              activityEl.textContent = `🎵 الاستماع إلى ${spotifyStatus.details}`;
            } else if (gameStatus) {
              activityEl.textContent = `🎮 يلعب ${gameStatus.name}`;
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
      console.error("خطأ في جلب بيانات ديسكورد:", error);
    }
  }

  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 10000);
});
