$(document).ready(function () {
  $("artist-submit").click(function () {
    console.log("button pressed");
    $.post(
      "server.js",
      { name: "Donald Duck", city: "Duckburg" },
      function (data, status) {
        alert("Data: " + data + "\\nStatus: " + status);
      }
    );
  });
});
