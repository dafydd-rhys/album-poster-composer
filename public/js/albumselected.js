$(document).ready(function () {
    $(document).on("click", ".albumContainer", function () {
        let albumNumber = $(this).index();
        const albumContainer = $(this);
        $.post("", { album: albumContainer.attr("data-value") }, function (album, status) {
            alert(album.name + "\n" + album.total_tracks + "\n" + album.label + "\n" + album.release_date + "\n" + album.copyrights[0].text);
            const tracks = album.tracks.items
                .map(function (track) {
                    return track.track_number + " " + cutName(track.name.toUpperCase());
                })
                .join("<br />");

            //ALBUM DURATION
            let albumDuration = 0;

            for (const track of album.tracks.items) {
                albumDuration = albumDuration + track.duration_ms;
            }

            //HH:SS
            let albumMinutes = albumDuration / 60 / 1000;
            let albumMinutesFloor = Math.floor(albumMinutes);
            let albumSeconds = Math.floor((albumMinutes - albumMinutesFloor) * 60);
            let albumDurationLength = albumMinutesFloor + ":" + albumSeconds;

            //PARSING DATE FROM JSON
            let albumReleaseYear = album.release_date.substr(0, 4);
            let albumReleaseMonth = album.release_date.substr(5, 7);
            let albumReleaseDay = album.release_date.substr(8, 10);
            let workYear = parseInt(albumReleaseYear) - 1;

            const swatches = getImageColourPalette(albumContainer.children("img:first").get(0));

            getAlbumArtwork(album.name, album.artists[0].name, album.images[0].url).then(function (image) {
                var w = window.open("poster_v1.html");
                w.addEventListener("load", function () {
                    //ARTWORK
                    w.document.querySelector(".albumCover").src = image;
                    //LENGTH AND WORK YEARS
                    w.document.querySelector(".albumLengthAndYear").innerHTML = albumDurationLength + " " + workYear + "-" + albumReleaseYear + "<br /> RELEASED BY " + album.label.toUpperCase();
                    //------ LEFT SIDE ------
                    //TRACK NAMES
                    let songTitles = w.document.querySelector(".songTitles");

                    let spacing = Math.floor(-0.4 * album.total_tracks + 23.8);
                    songTitles.style.lineHeight = spacing + "px";
                    songTitles.innerHTML = tracks;

                    //------ RIGHT SIDE ------
                    //PALETTE
                    for (var i = 0; i < 5; i++) {
                        // Create a canvas element
                        var canvas = document.createElement("canvas");
                        canvas.width = 46;
                        canvas.height = 48;

                        // Get the canvas context
                        var context = canvas.getContext("2d");

                        // Set the fill color to rbg of swatch
                        context.fillStyle = "rgb(" + swatches[i][0] + ", " + swatches[i][1] + ", " + swatches[i][2] + ")";

                        // Fill the entire canvas with black color
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        w.document.querySelector(".paletteColour" + i).src = canvas.toDataURL("image/png");
                    }
                    //RELEASED BY (ARTIST)
                    w.document.querySelector(".albumBy").innerHTML = "AN ALBUM BY " + album.artists[0].name.toUpperCase();
                    //SPOTIFY URL CODE
                    w.document.querySelector(".spotifyCode").src = "https://scannables.scdn.co/uri/plain/png/ffffff/black/256/" + album.uri;
                    //RELEASED BY (DATE, LABEL, NUMBER)
                    let label = "RELEASED BY " + album.label.toUpperCase();

                    w.document.querySelector(".albumRelease").innerHTML =
                        "OUT NOW / " + getMonthName(parseInt(albumReleaseMonth)) + " " + albumReleaseDay + ", " + albumReleaseYear + "<br />" + label + "<br />" + getAlbumNumber(albumNumber + 1);
                    //ARTIST NAME
                    let albumArtist = w.document.querySelector(".albumArtist");

                    //ALBUM NAME
                    let lines = Math.ceil(cutName(album.name).trim().length / 20);
                    let margin = 10;
                    if (lines < 4) {
                        margin = 115 - (lines - 1) * 30;
                        if (lines == 3) {
                            margin += 10;
                        }
                    }
                    if (label.length > 40) {
                        margin -= 15;
                    }
                    albumArtist.style.marginTop = margin + "px";

                    albumArtist.innerHTML = album.artists[0].name.toUpperCase();
                    w.document.querySelector(".albumName").innerHTML = cutName(album.name.toUpperCase()).trim();
                });
            });
        });
    });
});

function getAlbumNumber(number) {
    let albumNumber = "";
    let lastDigit = number % 10;
    let lastTwoDigits = number % 100;

    //11th - 21st - 31st
    if (lastTwoDigits != 11 && lastTwoDigits != 12 && lastTwoDigits != 13) {
        //1st - 2nd - 3rd - 4th
        switch (lastDigit) {
            case 1:
                albumNumber = number + "st";
                break;
            case 2:
                albumNumber = number + "nd";
                break;
            case 3:
                albumNumber = number + "rd";
                break;
            default:
                albumNumber = number + "th";
                break;
        }
    } else {
        albumNumber = number + "th";
    }

    return albumNumber + " STUDIO PROJECT";
}

function cutName(songName) {
    let bracketSplit = songName.split("(");
    let hyphenSplit = songName.split("-");

    if (bracketSplit[0].length > hyphenSplit[0].length) {
        return hyphenSplit[0];
    } else {
        return bracketSplit[0];
    }
}

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-US", { month: "long" }).toUpperCase();
}

function getImageColourPalette(image) {
    var vibrant = new Vibrant(image);
    var swatches = vibrant.swatches();
    var swatchesArray = [];

    for (var key in swatches) {
        if (swatches.hasOwnProperty(key) && swatches[key]) {
            swatchesArray.push(swatches[key].getRgb());
        }
    }

    return swatchesArray;
}

async function getAlbumArtwork(albumName, artistName, albumThumbnail) {
    const url = "https://artwork.themoshcrypt.net/api/search?keyword=" + encodeURIComponent(albumName);
    const response = await fetch(url);
    const data = await response.json();

    var highestMatch = data.results.find((album) => album.collectionName.toUpperCase() == albumName.toUpperCase() && album.artistName.toUpperCase() == artistName.toUpperCase());

    //use image recognition to find closest match if exact match from artist/album names cannot be found
    if (highestMatch == undefined) {
        data.results.forEach((album) => {
            var diff = resemble(albumThumbnail)
                .compareTo(album.artworkUrl100)
                .scaleToSameSize()
                .ignoreColors()
                .onComplete(function (data) {
                    album.matchPercent = 100 - data.rawMisMatchPercentage;
                });
        });
        data.results.sort((a, b) => b.matchPercent - a.matchPercent);
        highestMatch = data.results[0];
    }

    return highestMatch.artworkUrl100.replace(/(.*?)\d(.*?)(.*?)thumb\//, "http://a1.mzstatic.com/us/r1000/063/").replace("/100x100bb.jpg", "");
}
