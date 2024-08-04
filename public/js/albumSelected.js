import { handleAlbumClick } from './eventHandlers.js';

$(document).ready(function () {
    $(document).on("click", ".albumContainer", handleAlbumClick);
    $('#proceed').prop('disabled', true); // Ensure button is disabled initially
});