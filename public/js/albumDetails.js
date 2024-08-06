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
  }  else if (htmlFile.includes("vintage")) {
    loadVintage(album, albumContainer, albumNumber, htmlFile);
  }  else if (htmlFile.includes("sleek")) {
    
  } else {
    
  }
}