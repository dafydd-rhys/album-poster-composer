$(document).ready(function () {
  $("#artist-submit").click(function () {
    console.log("button pressed");
    $.post(
      "",
      { artist: "Donald Duck" },
      function (data, status) {
        alert("Data: " + data + "\\nStatus: " + status);
      }
    );
  });
});
