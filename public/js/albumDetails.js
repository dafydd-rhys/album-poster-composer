import {
  cutName,
  getAlbumNumber,
  getMonthName,
  getImageColourPalette,
} from "./utils.js";
import { getAlbumArtwork } from "./api.js";
import { loadClassic } from "../../posters/classic/loadClassic.js";
import { loadModern } from "../../posters/modern/loadModern.js";
import { loadVintage } from "../../posters/vintage/loadVintage.js";
import { loadSleek } from "../../posters/sleek/loadSleek.js";
import { loadElegant } from "../../posters/elegant/loadElegant.js";
import { loadChoatic } from "../../posters/choatic/loadChoatic.js";

export async function updateAlbumUI(
  album,
  albumContainer,
  albumNumber,
  htmlFile
) {
  if (htmlFile.includes("classic")) {
    loadClassic(album, albumContainer, albumNumber, htmlFile);
  } else if (htmlFile.includes("modern")) {
    loadModern(album, albumContainer, albumNumber, htmlFile);
  } else if (htmlFile.includes("vintage")) {
    loadVintage(album, albumContainer, albumNumber, htmlFile);
  } else if (htmlFile.includes("sleek")) {
    loadSleek(album, albumContainer, albumNumber, htmlFile);
  } else if (htmlFile.includes("elegant")) {
    loadElegant(album, albumContainer, albumNumber, htmlFile);
  } else {
    loadChoatic(album, albumContainer, albumNumber, htmlFile);
  }
}
