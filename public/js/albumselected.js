$(document).ready(function () {
  $("#albumContainer").on("click", function () {
    console.log("album selected");
    $.post(
      "",
      { album: $("this").attr("data-value") },
      function (album, status) {
        alert(album.name);
      }
    );
  });
});
