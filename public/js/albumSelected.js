import { handleAlbumClick, handleAlbumProceed } from './eventHandlers.js';
import { handleDesignSelection } from './designSelection.js'; // Assuming you have a file for design selection

$(document).ready(function () {
    $(document).on("click", ".albumContainer", handleAlbumClick);
    $(document).on("click", ".design", handleDesignSelection); // Bind design selection
    $('#proceed').on('click', handleAlbumProceed); // Bind proceed button
    $('#proceed').prop('disabled', true); // Ensure button is disabled initially
});
