import {
  cutName,
  getAlbumNumber,
  getMonthName,
  getImageColourPalette,
  convertImageToBase64
} from "../../js//utils.js";
import { getAlbumArtwork } from "../../js/api.js";

export async function loadSleek(
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
      (track) => `${cutName(track.name.toUpperCase())}`
    )
    .join("<br />");

  // PARSING DATE FROM JSON
  let albumReleaseYear = album.release_date.substr(0, 4);
  
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
      const songTitles = w.document.querySelector(".songTitles");
      if (songTitles) {
        let spacing = Math.floor(-0.4 * album.total_tracks + 23.8);
        songTitles.style.lineHeight = `${spacing}px`;
        songTitles.innerHTML = tracks;
      }

      // ARTIST NAME
      const albumArtist = w.document.querySelector(".albumArtist");
      if (albumArtist) {
        albumArtist.innerHTML = `By ${album.artists[0].name} • ${albumReleaseYear}`;;
        const albumName = w.document.querySelector(".albumName");
        if (albumName)
          albumName.innerHTML = cutName(album.name.toUpperCase()).trim();
      }
    });
  } else {
    console.error("Failed to open the new window.");
  }
}