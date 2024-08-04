import { cutName, getAlbumNumber, getMonthName, getImageColourPalette } from './utils.js';
import { getAlbumArtwork } from './api.js';

export async function updateAlbumUI(album, albumContainer, albumNumber) {
    alert(`${album.name}\n${album.total_tracks}\n${album.label}\n${album.release_date}\n${album.copyrights[0].text}`);

    const tracks = album.tracks.items
        .map(track => `${track.track_number} ${cutName(track.name.toUpperCase())}`)
        .join("<br />");

    //ALBUM DURATION
    let albumDuration = album.tracks.items.reduce((sum, track) => sum + track.duration_ms, 0);
    let albumMinutes = albumDuration / 60 / 1000;
    let albumMinutesFloor = Math.floor(albumMinutes);
    let albumSeconds = Math.floor((albumMinutes - albumMinutesFloor) * 60);
    let albumDurationLength = `${albumMinutesFloor}:${albumSeconds}`;

    //PARSING DATE FROM JSON
    let albumReleaseYear = album.release_date.substr(0, 4);
    let albumReleaseMonth = album.release_date.substr(5, 7);
    let albumReleaseDay = album.release_date.substr(8, 10);
    let workYear = parseInt(albumReleaseYear) - 1;

    const swatches = getImageColourPalette(albumContainer.children("img:first").get(0));

    const image = await getAlbumArtwork(album.name, album.artists[0].name, album.images[0].url);
    var w = window.open("poster_v1.html");

    w.addEventListener("load", function () {
        //ARTWORK
        w.document.querySelector(".albumCover").src = image;
        //LENGTH AND WORK YEARS
        w.document.querySelector(".albumLengthAndYear").innerHTML = `${albumDurationLength} ${workYear}-${albumReleaseYear}<br /> RELEASED BY ${album.label.toUpperCase()}`;
        
        //------ LEFT SIDE ------
        //TRACK NAMES
        let songTitles = w.document.querySelector(".songTitles");
        let spacing = Math.floor(-0.4 * album.total_tracks + 23.8);
        songTitles.style.lineHeight = `${spacing}px`;
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
            context.fillStyle = `rgb(${swatches[i][0]}, ${swatches[i][1]}, ${swatches[i][2]})`;
            // Fill the entire canvas with color
            context.fillRect(0, 0, canvas.width, canvas.height);
            w.document.querySelector(`.paletteColour${i}`).src = canvas.toDataURL("image/png");
        }
        
        //RELEASED BY (ARTIST)
        w.document.querySelector(".albumBy").innerHTML = `AN ALBUM BY ${album.artists[0].name.toUpperCase()}`;
        //SPOTIFY URL CODE
        w.document.querySelector(".spotifyCode").src = `https://scannables.scdn.co/uri/plain/png/ffffff/black/256/${album.uri}`;
        //RELEASED BY (DATE, LABEL, NUMBER)
        let label = `RELEASED BY ${album.label.toUpperCase()}`;
        w.document.querySelector(".albumRelease").innerHTML = `OUT NOW / ${getMonthName(parseInt(albumReleaseMonth))} ${albumReleaseDay}, ${albumReleaseYear}<br />${label}<br />${getAlbumNumber(albumNumber + 1)}`;
        
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
        albumArtist.style.marginTop = `${margin}px`;
        albumArtist.innerHTML = album.artists[0].name.toUpperCase();
        w.document.querySelector(".albumName").innerHTML = cutName(album.name.toUpperCase()).trim();
    });
}
