$(document).ready(function () {
  // Handle click on Submit button
    $("#artist-submit").click(function () {
        submitArtist();
    });

    // Handle Enter key press in the artist input field
    $("#artist").keydown(function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission if inside a form element
            submitArtist();
        }
    });
  
  // Function to handle artist submission
    function submitArtist() {
        const artistName = $("#artist").val();
        if (!artistName) {
            alert("Please enter an artist name.");
            return;
        }

        $.post("", { artist: artistName }, function (artist, status) {
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
                        crossOrigin: "Anonymous",
                    });

                    var overlay = $("<div>", { class: "overlay", text: album.name });

                    $("#albums").prepend(container);
                    container.append(albumImage);
                    container.append(overlay);
                });
            });
        });
    }
});

