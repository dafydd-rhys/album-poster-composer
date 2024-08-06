// Updated JavaScript

$(document).ready(function () {
  
    let currentPage = 1;
    const albumsPerPage = 24; // 8 albums per row * 2 rows

    // Function to fetch and display albums
    function fetchAlbums(page) {
        $.post("", { artist: $("#artist").val() }, function (artist, status) {
            $.post("", { artistId: artist.id }, function (albums, status) {
                const totalAlbums = albums.items.length;
                const start = (page - 1) * albumsPerPage;
                const end = Math.min(start + albumsPerPage, totalAlbums);
                const albumsToShow = albums.items.slice(start, end);

                $("#albums").empty();

                albumsToShow.forEach(function (album) {
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

                    $("#albums").append(container);
                    container.append(albumImage);
                    container.append(overlay);
                });

                $("#prev-page").prop("disabled", page <= 1);
                $("#next-page").prop("disabled", end >= totalAlbums);
            });
        });
    }

    // Handle click on Submit button
    $("#artist-submit").click(function () {
        currentPage = 1;
        fetchAlbums(currentPage);  
    });

    // Handle Enter key press in the artist input field
    $("#artist").keydown(function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission if inside a form element
            currentPage = 1;
            fetchAlbums(currentPage);
        }
    });

    // Handle pagination controls
    $("#prev-page").click(function () {
        if (currentPage > 1) {
            currentPage--;
            fetchAlbums(currentPage);
        }
    });

    $("#next-page").click(function () {
        currentPage++;
        fetchAlbums(currentPage);
    });
});
