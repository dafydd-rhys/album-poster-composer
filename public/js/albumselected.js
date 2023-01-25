$(document).ready(function () {
  $(document).on("click", ".albumContainer", function () {
    console.log("album selected: " + $(this).attr("data-value"));
    $.post("", { album: $(this).attr("data-value") }, function (album, status) {
      alert(
        album.name +
          "\n" +
          album.total_tracks +
          "\n" +
          album.label +
          "\n" +
          album.release_date +
          "\n" +
          album.copyrights[0].text
      );
      const tracks = album.tracks.items
        .map(function (track) {
          return track.track_number + " " + track.name.toUpperCase();
        })
        .join("\n");
      alert(tracks);
    });
  });
});
