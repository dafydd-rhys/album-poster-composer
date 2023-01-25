$(document).ready(function () {
  $("#artist-submit").click(function () {
    console.log("button pressed");
    $.post("", { artist: $("#artist").val() }, function (artist, status) {
      $.post("", { artistId: artist.data.id }, function (albums, status) {
        
      });
    });
  });
});
