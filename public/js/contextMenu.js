document.addEventListener('DOMContentLoaded', () => {
  const customMenu = document.getElementById('custom-menu');
  let currentImageUrl = '';

  document.querySelectorAll('.design img').forEach(img => {
    img.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      currentImageUrl = img.src; // Use img.src to get the image URL directly
      customMenu.style.display = 'block';
      customMenu.style.left = `${event.pageX}px`;
      customMenu.style.top = `${event.pageY}px`;
    });
  });

  document.addEventListener('click', () => {
    customMenu.style.display = 'none';
  });

  document.getElementById('preview-link').addEventListener('click', (event) => {
    event.preventDefault();
    if (currentImageUrl) {
      window.open(currentImageUrl, '_blank');
    }
  });
});
