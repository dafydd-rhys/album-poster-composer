import { handleAlbumClick } from './eventHandlers.js';

$(document).ready(function () {
    console.log("Ready"); // Add this line
    $(document).on("click", ".albumContainer", handleAlbumClick);
});
