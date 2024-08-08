import {
  cutName,
  getAlbumNumber,
  getMonthName,
  getImageColourPalette,
  convertImageToBase64
} from "../../js//utils.js";
import { getAlbumArtwork } from "../../js/api.js";

export async function loadElegant(
  album,
  albumContainer,
  albumNumber,
  htmlFile
) {
  alert(
    `${album.name}\n${album.total_tracks}\n${album.label}\n${album.release_date}\n${album.copyrights[0].text}`
  );

  // Convert the tracks string to an array
  const tracksString = album.tracks.items
    .map(
      (track) => `${track.track_number} ${cutName(track.name.toUpperCase())}`
    )
    .join("<br />");
  
  // Convert the tracksString to an array using split
  const trackArray = tracksString
    .split("<br />")
    .map(track => track.trim())
    .filter(track => track.length > 0);

  // ALBUM DURATION
  let albumDuration = album.tracks.items.reduce(
    (sum, track) => sum + track.duration_ms,
    0
  );
  let albumMinutes = albumDuration / 60 / 1000;
  let albumMinutesFloor = Math.floor(albumMinutes);
  let albumSeconds = Math.floor((albumMinutes - albumMinutesFloor) * 60);
  let albumDurationLength = `${albumMinutesFloor}:${albumSeconds}`;

  // PARSING DATE FROM JSON
  let albumReleaseYear = album.release_date.substr(0, 4);

  const swatches = getImageColourPalette(
    albumContainer.children("img:first").get(0)
  );

  // Convert image URL to Base64
  const imageUrl = album.images[0].url;
  const base64Image = await convertImageToBase64(imageUrl);

  var w = window.open(htmlFile);

  if (w) {
    w.addEventListener("load", function () {
      // ARTWORK
      const albumCover = w.document.querySelector(".albumCover");
      if (albumCover) {
        albumCover.src = base64Image;
      }

      // TRACK NAMES
      const maxSongsPerColumn = 15;
      const numberOfColumns = Math.ceil(trackArray.length / maxSongsPerColumn);

      const container = w.document.getElementById("song-list-container");
      if (container) {
        container.innerHTML = ""; // Clear any existing content

        for (let i = 0; i < numberOfColumns; i++) {
          const column = document.createElement("div");
          column.classList.add("song-column");

          const startIndex = i * maxSongsPerColumn;
          const endIndex = Math.min(startIndex + maxSongsPerColumn, trackArray.length);

          const columnContent = document.createElement("p");
          columnContent.classList.add("songTitles");
          columnContent.innerHTML = trackArray
            .slice(startIndex, endIndex)
            .join("<br />");

          column.appendChild(columnContent);
          container.appendChild(column);
        }

        // Ensure there are at least two columns
        if (numberOfColumns < 2) {
          const emptyColumn = document.createElement("div");
          emptyColumn.classList.add("song-column");
          container.appendChild(emptyColumn);
        }

        // Add the album release details column
        const releaseColumn = document.createElement("div");
        releaseColumn.classList.add("song-column");

        const releaseContent = document.createElement("p");
        releaseContent.classList.add("albumRelease");
        releaseContent.innerHTML = `
          <strong>Release Date</strong><br />
          <span id="releaseDate">${albumReleaseYear}</span><br /><br />
          <strong>Release Label</strong><br />
          <span id="releaseLabel">${album.label}</span><br /><br />
          <strong>Album Length</strong><br />
          <span id="albumLength">${albumDurationLength}</span><br />
        `;

        releaseColumn.appendChild(releaseContent);
        container.appendChild(releaseColumn);
      } else {
        console.error("Element #song-list-container not found.");
      }

      // SPOTIFY URL CODE
      const spotifyCode = w.document.querySelector(".spotifyCode");
      if (spotifyCode) {
        //Load spotify code as vector SVG and remove background fill
        
        spotifyCode.src = `https://scannables.scdn.co/uri/plain/svg/000000/white/256/${album.uri}`;
        
      }

      // UPDATE RELEASE DETAILS
      const releaseDate = w.document.getElementById("releaseDate");
      const releaseLabel = w.document.getElementById("releaseLabel");
      const albumLength = w.document.getElementById("albumLength");

      if (releaseDate) releaseDate.innerHTML = albumReleaseYear;
      if (releaseLabel) releaseLabel.innerHTML = album.label;
      if (albumLength) albumLength.innerHTML = albumDurationLength;

      // ARTIST NAME
      const albumArtist = w.document.querySelector(".albumArtist");
      if (albumArtist) {
        albumArtist.innerHTML = album.artists[0].name.toUpperCase();
        const albumName = w.document.querySelector(".albumName");
        if (albumName)
          albumName.innerHTML = cutName(album.name.toUpperCase()).trim();
      }

      // PALETTE
      for (var i = 0; i < 5; i++) {
        const paletteColour = w.document.querySelector(`.paletteColour${i}`);
        if (paletteColour) {
          // Create a canvas element
          var canvas = document.createElement("canvas");
          canvas.width = 46;
          canvas.height = 48;
          // Get the canvas context
          var context = canvas.getContext("2d");
          // Set the fill color to rgb of swatch
          context.fillStyle = `rgb(${swatches[i][0]}, ${swatches[i][1]}, ${swatches[i][2]})`;
          // Fill the entire canvas with color
          context.fillRect(0, 0, canvas.width, canvas.height);
          paletteColour.src = canvas.toDataURL("image/png");
        }
      }
    });
  } else {
    console.error("Failed to open the new window.");
  }
}
