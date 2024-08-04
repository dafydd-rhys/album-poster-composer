import { handleAlbumClick, handleAlbumProceed } from './eventHandlers.js';

$(document).ready(function () {
    $(document).on("click", ".albumContainer", handleAlbumClick);
    $('#proceed').on('click', handleAlbumProceed); // Bind proceed button
    $('#proceed').prop('disabled', true); // Ensure button is disabled initially
});
