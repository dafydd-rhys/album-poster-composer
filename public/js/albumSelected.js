import { handleAlbumClick, handleAlbumProceed, handleDesignSelection } from './eventHandlers.js';

$(document).ready(function () {
    $(document).on("click", ".albumContainer", handleAlbumClick);
    $(document).on("click", ".design", handleDesignSelection); // Bind design selection
    $('#proceed').on('click', handleAlbumProceed); // Bind proceed button
    $('#proceed').prop('disabled', true); // Ensure button is disabled initially
});
