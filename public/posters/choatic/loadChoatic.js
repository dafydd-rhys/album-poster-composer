import {
  cutName,
  getAlbumNumber,
  getMonthName,
  getImageColourPalette,
  convertImageToBase64
} from "../../js/utils.js";
import { getAlbumArtwork } from "../../js/api.js";

// Function to fetch image from URL and convert to Blob
async function fetchImageBlob(imageUrl) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Error fetching image: ${response.statusText}`);
  }
  return await response.blob();
}

// Function to process image through Clipping Magic API
async function getTransparentImage(imageUrl) {
  const apiKey = 'a126rdt80furr1e1r9hn5a91dpqg6cukkckej355u3eudi1oq62u'; // Replace with your Clipping Magic API key

  const imageBlob = await fetchImageBlob(imageUrl);

  const formData = new FormData();
  formData.append('image', imageBlob, 'image.jpg'); // Use any name for the file

  const response = await fetch(`https://api.clippingmagic.com/v1/images?test=true`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(apiKey + ':')}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result = await response.json();
  const imageId = result.id;

  const downloadResponse = await fetch(`https://api.clippingmagic.com/v1/images/${imageId}/result`);
  if (!downloadResponse.ok) {
    throw new Error(`Error: ${downloadResponse.statusText}`);
  }

  const resultBlob = await downloadResponse.blob();
  return URL.createObjectURL(resultBlob); // Create an object URL for the transparent image
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

  // Spotify code image URL
  const spotifyCodeUrl = `https://scannables.scdn.co/uri/plain/png/ffffff/black/256/${album.uri}`;

  var w = window.open(htmlFile);

  if (w) {
    w.addEventListener("load", async function () {
      // ARTWORK
      const albumCover = w.document.querySelector(".albumCover");
      if (albumCover) {
        albumCover.src = base64Image;
      }

      // Set background image with blur effect
      const indexElement = w.document.querySelector(".index");
      if (indexElement) {
        const transparentImageUrl = await getTransparentImage(imageUrl); // Get transparent image
        const style = indexElement.style;
        const beforeStyle = `
          background-image: url(${transparentImageUrl});
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
          const column = w.document.createElement("div");
          column.classList.add("song-column");

          const startIndex = i * maxSongsPerColumn;
          const endIndex = Math.min(startIndex + maxSongsPerColumn, trackArray.length);

          const columnContent = w.document.createElement("p");
          columnContent.classList.add("songTitles");
          columnContent.innerHTML = trackArray
            .slice(startIndex, endIndex)
            .join("<br />");

          column.appendChild(columnContent);
          container.appendChild(column);
        }

        // Ensure there are at least two columns
        if (numberOfColumns < 2) {
          const emptyColumn = w.document.createElement("div");
          emptyColumn.classList.add("song-column");
          container.appendChild(emptyColumn);
        }

        // Add the album release details column
        const releaseColumn = w.document.createElement("div");
        releaseColumn.classList.add("song-column");

        const releaseContent = w.document.createElement("p");
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
        const transparentSpotifyCodeUrl = await getTransparentImage(spotifyCodeUrl); // Get transparent Spotify code image
        spotifyCode.src = transparentSpotifyCodeUrl; // Set the transparent image URL
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
