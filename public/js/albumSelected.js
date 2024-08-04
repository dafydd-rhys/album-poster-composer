import { handleAlbumClick, handleAlbumProceed } from './eventHandlers.js';

$(document).ready(function () {
    $(document).on("click", ".albumContainer", handleAlbumClick);
    $('#proceed').on('click', handleAlbumProceed);
    $('#proceed').prop('disabled', true); // Ensure button is disabled initially
});
