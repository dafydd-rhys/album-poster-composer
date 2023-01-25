$(document).ready(function () {
  $(document).on('click', '.albumContainer', function () {
    console.log("album selected: " + $(this).attr("data-value"));
    $.post(
      "",
      { album: $(this).attr("data-value") },
      function (album, status) {
        alert(album.name);
      }
    );
  });
});
