document.addEventListener('DOMContentLoaded', () => {
  const customMenu = document.getElementById('custom-menu');
  let currentImageUrl = '';

  // Function to show the custom menu
  function showMenu(event, imageUrl) {
    event.preventDefault();
    currentImageUrl = imageUrl; // Set the current image URL
    customMenu.style.display = 'block';
    customMenu.style.left = `${event.pageX}px`;
    customMenu.style.top = `${event.pageY}px`;
  }

  // Add event listeners to all .design elements and their child images
  document.querySelectorAll('.design').forEach(design => {
    design.addEventListener('click', (event) => {
      const img = design.querySelector('img');
      if (img) {
        showMenu(event, img.src);
      }
    });
    
    design.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      const img = design.querySelector('img');
      if (img) {
        showMenu(event, img.src);
      }
    });
  });

  // Hide the custom menu when clicking anywhere else
  document.addEventListener('click', (event) => {
    if (!customMenu.contains(event.target)) {
      customMenu.style.display = 'none';
    }
  });

  // Handle the preview link click
  document.getElementById('preview-link').addEventListener('click', (event) => {
    event.preventDefault();
    if (currentImageUrl) {
      window.open(currentImageUrl, '_blank');
    }
  });
});
