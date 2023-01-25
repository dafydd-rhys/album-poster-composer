$(document).ready(function () {
  $("#artist-submit").click(function () {
    $.post("", { artist: $("#artist").val() }, function (artist, status) {
      $.post("", { artistId: artist.id }, function (albums, status) {
        $("#albums").empty();
        albums.items.forEach(function (album) {
          var container = $("<div>", {
            class: "albumContainer",
            "data-value": album.id,
          });
          var albumImage = $("<img>", {
            class: "album",
            src: album.images[0].url,
            alt: album.name,
            crossOrigin: 'Anonymous'
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
