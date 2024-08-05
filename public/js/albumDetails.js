import {
  cutName,
  getAlbumNumber,
  getMonthName,
  getImageColourPalette,
} from "./utils.js";
import { getAlbumArtwork } from "./api.js";

export async function updateAlbumUI(
  album,
  albumContainer,
  albumNumber,
  htmlFile
) {
  if (htmlFile.includes("classic")) {
    loadClassic(album, albumContainer, albumNumber, htmlFile);
  } else {
    loadModern(album, albumContainer, albumNumber, htmlFile);
  }
}

export async function loadModern(album, albumContainer, albumNumber, htmlFile) {
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
  let albumReleaseMonth = album.release_date.substr(5, 2); // Changed from 7 to 2
  let albumReleaseDay = album.release_date.substr(8, 2); // Changed from 10 to 2
  let workYear = parseInt(albumReleaseYear) - 1;

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
      } else {
        console.error("Element .albumCover not found.");
      }

      // LENGTH AND WORK YEARS
      const albumLengthAndYear = w.document.querySelector(
        ".albumLengthAndYear"
      );
      if (albumLengthAndYear) {
        albumLengthAndYear.innerHTML = `${albumDurationLength} ${workYear}-${albumReleaseYear}<br /> RELEASED BY ${album.label.toUpperCase()}`;
      } else {
        console.error("Element .albumLengthAndYear not found.");
      }

      //------ LEFT SIDE ------
      // TRACK NAMES
      const maxSongsPerColumn = 12;
      const numberOfColumns = Math.ceil(trackArray.length / maxSongsPerColumn);

      const container = w.document.getElementById("song-list-container");
      console.log(trackArray); // Ensure trackArray is an array
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
      } else {
        console.error("Element #song-list-container not found.");
      }

      //------ RIGHT SIDE ------
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
        } else {
          console.error(`Element .paletteColour${i} not found.`);
        }
      }

      // RELEASED BY (ARTIST)
      const albumBy = w.document.querySelector(".albumBy");
      if (albumBy) {
        albumBy.innerHTML = `AN ALBUM BY ${album.artists[0].name.toUpperCase()}`;
      } else {
        console.error("Element .albumBy not found.");
      }

      // SPOTIFY URL CODE
      const spotifyCode = w.document.querySelector(".spotifyCode");
      if (spotifyCode) {
        spotifyCode.src = `https://scannables.scdn.co/uri/plain/png/ffffff/black/256/${album.uri}`;
      } else {
        console.error("Element .spotifyCode not found.");
      }

      // RELEASED BY (DATE, LABEL, NUMBER)
      const albumRelease = w.document.querySelector(".albumRelease");
      var label = "";
      if (albumRelease) {
        label = `RELEASED BY ${album.label.toUpperCase()}`;
        albumRelease.innerHTML = `OUT NOW / ${getMonthName(
          parseInt(albumReleaseMonth)
        )} ${albumReleaseDay}, ${albumReleaseYear}<br />${label}`;
      } else {
        console.error("Element .albumRelease not found.");
      }

      // ARTIST NAME
      const albumArtist = w.document.querySelector(".albumArtist");
      if (albumArtist) {
        albumArtist.innerHTML = album.artists[0].name.toUpperCase();
        const albumName = w.document.querySelector(".albumName");
        if (albumName) {
          albumName.innerHTML = cutName(album.name.toUpperCase()).trim();
        } else {
          console.error("Element .albumName not found.");
        }
      } else {
        console.error("Element .albumArtist not found.");
      }
    });
  } else {
    console.error("Failed to open the new window.");
  }
}


export async function loadClassic(
  album,
  albumContainer,
  albumNumber,
  htmlFile
) {
  alert(
    `${album.name}\n${album.total_tracks}\n${album.label}\n${album.release_date}\n${album.copyrights[0].text}`
  );

  const tracks = album.tracks.items
    .map(
      (track) => `${track.track_number} ${cutName(track.name.toUpperCase())}`
    )
    .join("<br />");

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
  let albumReleaseMonth = album.release_date.substr(5, 7);
  let albumReleaseDay = album.release_date.substr(8, 10);
  let workYear = parseInt(albumReleaseYear) - 1;

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

      // LENGTH AND WORK YEARS
      const albumLengthAndYear = w.document.querySelector(
        ".albumLengthAndYear"
      );
      if (albumLengthAndYear) {
        albumLengthAndYear.innerHTML = `${albumDurationLength} ${workYear}-${albumReleaseYear}<br /> RELEASED BY ${album.label.toUpperCase()}`;
      }

      //------ LEFT SIDE ------
      // TRACK NAMES
      const songTitles = w.document.querySelector(".songTitles");
      if (songTitles) {
        let spacing = Math.floor(-0.4 * album.total_tracks + 23.8);
        songTitles.style.lineHeight = `${spacing}px`;
        songTitles.innerHTML = tracks;
      }

      //------ RIGHT SIDE ------
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

      // RELEASED BY (ARTIST)
      const albumBy = w.document.querySelector(".albumBy");
      if (albumBy)
        albumBy.innerHTML = `AN ALBUM BY ${album.artists[0].name.toUpperCase()}`;

      // SPOTIFY URL CODE
      const spotifyCode = w.document.querySelector(".spotifyCode");
      if (spotifyCode)
        spotifyCode.src = `https://scannables.scdn.co/uri/plain/png/ffffff/black/256/${album.uri}`;

      // RELEASED BY (DATE, LABEL, NUMBER)
      const albumRelease = w.document.querySelector(".albumRelease");
      var label = "";
      if (albumRelease) {
        label = `RELEASED BY ${album.label.toUpperCase()}`;
        albumRelease.innerHTML = `OUT NOW / ${getMonthName(
          parseInt(albumReleaseMonth)
        )} ${albumReleaseDay}, ${albumReleaseYear}<br />${label}<br />${getAlbumNumber(
          albumNumber + 1
        )}`;
      }

      // ARTIST NAME
      const albumArtist = w.document.querySelector(".albumArtist");
      if (albumArtist) {
        // ALBUM NAME
        let lines = Math.ceil(cutName(album.name).trim().length / 20);
        let margin = 10;
        if (lines < 4) {
          margin = 115 - (lines - 1) * 30;
          if (lines === 3) {
            margin += 10;
          }
        }
        if (label.length > 40) {
          margin -= 15;
        }
        albumArtist.style.marginTop = `${margin}px`;
        albumArtist.innerHTML = album.artists[0].name.toUpperCase();
        const albumName = w.document.querySelector(".albumName");
        if (albumName)
          albumName.innerHTML = cutName(album.name.toUpperCase()).trim();
      }
    });
  } else {
    console.error("Failed to open the new window.");
  }
}

// Function to convert image URL to Base64
async function convertImageToBase64(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
