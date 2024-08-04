import { handleAlbumClick } from './eventHandlers.js';

$(document).ready(function () {
    $(document).on("click", ".albumContainer", handleAlbumClick);
});
