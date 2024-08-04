import { fetchAlbumDetails } from './api.js';
import { updateAlbumUI } from './albumDetails.js';

export function handleAlbumClick(event) {
    // Remove the border from any previously selected album
    $(".albumContainer").removeClass("selected");

    // Add the border to the clicked album
    $(event.currentTarget).addClass("selected");
}

export function handleAlbumProceed() {
    let albumNumber = $(this).index();
    const albumContainer = $(this);
    
    $.post("", { album: albumContainer.attr("data-value") }, async function (album, status) {
        await updateAlbumUI(album, albumContainer, albumNumber);
    });
}
