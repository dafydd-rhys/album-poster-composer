$(document).ready(function () {
  $("#artist-submit").click(function () {
    console.log("button pressed");
    $.post("", { artist: $("#artist").val() }, function (artist, status) {
      $.post("", { artistId: artist.id }, function (albums, status) {
        albums.items.forEach(function (album) {
          $('#albums').prepend($('<img>',{class:'album', src:album.images[0].url}));
        })
      });
    });
  });
});