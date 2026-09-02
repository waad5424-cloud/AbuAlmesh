document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('intro-screen');
  const mainContent = document.getElementById('main-content');
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  let isPlaying = false;

  // عند الضغط على شاشة البداية
  introScreen.addEventListener('click', () => {
    introScreen.classList.add('fade-out');
    mainContent.classList.remove('hidden');

    // تشغيل الأغنية
    bgMusic.play().then(() => {
      isPlaying = true;
    }).catch(err => {
      console.log("Audio play blocked", err);
    });
  });

  // التحكم بصوت الموسيقى (Mute/Unmute)
  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
      isPlaying = false;
    } else {
      bgMusic.play();
      musicToggle.innerHTML = '<i class="fas fa-music"></i>';
      isPlaying = true;
    }
  });
});
