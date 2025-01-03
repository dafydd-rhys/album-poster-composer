import {
  cutName,
  getAlbumNumber,
  getMonthName,
  getImageColourPalette,
  convertImageToBase64,
  removeFirstRectFromSVG,
} from "../../js//utils.js";
import { getAlbumArtwork } from "../../js/api.js";

export async function loadVintage(
  album,
  albumContainer,
  albumNumber,
  htmlFile
) {
  alert(
    `${album.name}\n${album.total_tracks}\n${album.label}\n${album.release_date}\n${album.copyrights[0].text}`
  );

  const tracks = album.tracks.items
    .map((track) => `${cutName(track.name)}`)
    .join(", ");

  // Convert image URL to Base64
  const imageUrl = album.images[0].url;
  const base64Image = await convertImageToBase64(imageUrl);

  // Convert Spotify code image URL to Base64 and make it transparent
  const spotifyCodeUrl = `https://scannables.scdn.co/uri/plain/svg/000000/black/256/${album.uri}`;
  const modifiedSVG = await removeFirstRectFromSVG(spotifyCodeUrl);

  var w = window.open(htmlFile);
  if (w) {
    w.addEventListener("load", function () {
      // ARTIST NAME
      const albumArtist = w.document.querySelector(".albumArtist");
      if (albumArtist) {
        albumArtist.innerHTML = "Album by <i>" + album.artists[0].name + "</i>";
        const albumName = w.document.querySelector(".albumName");
        if (albumName)
          albumName.innerHTML = cutName(album.name.toUpperCase()).trim();
      }

      // ARTWORK
      const albumCover = w.document.querySelector(".albumCover");
      if (albumCover) {
        albumCover.src = base64Image;
      }

      // TRACK NAMES
      const songTitles = w.document.querySelector(".song-content");
      if (songTitles) {
        songTitles.innerHTML = tracks;
      }
    });
  } else {
    console.error("Failed to open the new window.");
  }
}
