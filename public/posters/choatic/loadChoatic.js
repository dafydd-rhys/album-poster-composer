import {
  cutName,
  getAlbumNumber,
  getMonthName,
  getImageColourPalette,
  convertImageToBase64,
  removeFirstRectFromSVG,
} from "../../js/utils.js";
import { getAlbumArtwork } from "../../js/api.js";

// Function to blur an image using canvas
async function blurImage(imageUrl, blurRadius = 10) {
  const image = new Image();
  image.crossOrigin = "Anonymous"; // Handle CORS

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  return new Promise((resolve, reject) => {
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      // Apply blur effect
      ctx.filter = `blur(${blurRadius}px)`;
      ctx.drawImage(image, 0, 0);

      // Convert to Base64
      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = reject;
    image.src = imageUrl;
  });
}

export async function loadChoatic(
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
    .map((track) => track.trim())
    .filter((track) => track.length > 0);

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

  // Convert image URL to Base64 and apply blur
  const imageUrl = album.images[0].url;
  const base64Image = await convertImageToBase64(imageUrl); // Clear image for album cover
  const blurredImage = await blurImage(imageUrl, 5); // Apply 10px blur for background

  // Convert Spotify code image URL to Base64 and make it transparent
  const spotifyCodeUrl = `https://scannables.scdn.co/uri/plain/svg/000000/white/256/${album.uri}`;
  const modifiedSVG = await removeFirstRectFromSVG(spotifyCodeUrl);

  var w = window.open(htmlFile);
  if (w) {
    w.addEventListener("load", function () {
      // ARTWORK
      const albumCover = w.document.querySelector(".albumCover");
      if (albumCover) {
        albumCover.src = base64Image;
      }

      // Set background image with blur effect
      const indexElement = w.document.querySelector(".blurred-background");
      if (indexElement) {
        indexElement.style.backgroundImage = `url(${blurredImage})`;
      }

      // TRACK NAMES
      const maxSongsPerColumn = 12;
      const numberOfColumns = Math.ceil(trackArray.length / maxSongsPerColumn);

      const container = w.document.getElementById("song-list-container");
      if (container) {
        container.innerHTML = ""; // Clear any existing content

        for (let i = 0; i < numberOfColumns; i++) {
          const column = document.createElement("div");
          column.classList.add("song-column");

          const startIndex = i * maxSongsPerColumn;
          const endIndex = Math.min(
            startIndex + maxSongsPerColumn,
            trackArray.length
          );

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
        spotifyCode.src = modifiedSVG;
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
    });
  } else {
    console.error("Failed to open the new window.");
  }
}
