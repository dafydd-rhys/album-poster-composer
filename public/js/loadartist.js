$(document).ready(function () {
  $("#artist-submit").click(function () {
    $.post("", { artist: $("#artist").val() }, function (artist, status) {
      $.post("", { artistId: artist.id }, function (albums, status) {
        albums.items.forEach(function (album) {
          var container = $("<div>", {
            class: "albumContainer",
            "data-value": album.id,
          });
          var albumImage = $("<img>", {
            class: "album",
            src: album.images[0].url,
            alt: album.name,
          });
          var overlay = $("<div>", { class: "overlay", text: album.name });
          $("#albums").prepend(container);
          container.append(albumImage);
          container.append(overlay);
        });
      });
    });
  });
});
