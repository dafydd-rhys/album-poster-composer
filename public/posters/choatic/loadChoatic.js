import {
  cutName,
  getAlbumNumber,
  getMonthName,
  getImageColourPalette,
  convertImageToBase64
} from "../../js/utils.js";
import { getAlbumArtwork } from "../../js/api.js";

// Function to remove black background from a base64 image
function makeBlackBackgroundTransparent(base64) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {
          const offset = (y * imageData.width + x) * 4;
          const r = imageData.data[offset];
          const g = imageData.data[offset + 1];
          const b = imageData.data[offset + 2];
          // if it is pure black, change its alpha to 0
          if (r === 0 && g === 0 && b === 0) {
            imageData.data[offset + 3] = 0;
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL()); // Output base64
    };
    image.src = base64;
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

  // Convert image URL to Base64
  const imageUrl = album.images[0].url;
  const base64Image = await convertImageToBase64(imageUrl);

  // Convert Spotify code image URL to Base64 and make it transparent
  console.log(album.uri);
  const spotifyCodeUrl = `https://scannables.scdn.co/uri/plain/png/000000/white/256/${album.uri}`;
  const base64SpotifyCodeImage = await convertImageToBase64(spotifyCodeUrl);
  const transparentSpotifyCodeImage = await makeBlackBackgroundTransparent(base64SpotifyCodeImage);

  var w = window.open(htmlFile);

  if (w) {
    w.addEventListener("load", function () {
      // ARTWORK
      const albumCover = w.document.querySelector(".albumCover");
      if (albumCover) {
        albumCover.src = base64Image;
      }
      
      // Set background image with blur effect
      const indexElement = w.document.querySelector(".index");
      if (indexElement) {
        const style = indexElement.style;
        const beforeStyle = `
          background-image: url(${base64Image});
          background-size: cover;
          background-position: center;
        `;
        indexElement.insertAdjacentHTML('beforeend', `<style>
          .index::before { ${beforeStyle} }
        </style>`);
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
        spotifyCode.src = transparentSpotifyCodeImage;
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
