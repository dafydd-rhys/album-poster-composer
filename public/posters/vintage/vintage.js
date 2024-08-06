  function adjustFontSize() {
      const songTitles = document.querySelectorAll('.songTitles');
      const container = document.querySelector('.song-list-container');
      songTitles.forEach(songTitle => {
        let fontSize = 15; // Start with an initial font size
        songTitle.style.fontSize = fontSize + 'px';
        while (songTitle.scrollHeight > songTitle.offsetHeight || songTitle.scrollWidth > container.offsetWidth) {
          fontSize--;
          songTitle.style.fontSize = fontSize + 'px';
        }
      });
    }

    document.addEventListener('DOMContentLoaded', adjustFontSize);
    window.addEventListener('resize', adjustFontSize); // Adjust on window resize