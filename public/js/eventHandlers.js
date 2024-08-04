import { fetchAlbumDetails } from './api.js';
import { updateAlbumUI } from './albumDetails.js';

// albumSelected.js
let selectedAlbum = null;

export function handleAlbumClick(event) {
    // Remove 'selected' class from any previously selected album
    $('.albumContainer').removeClass('selected');

    // Add 'selected' class to the clicked album
    $(event.currentTarget).addClass('selected');
    selectedAlbum = $(event.currentTarget).data('data-value'); // Assuming you have a data attribute for album ID

    console.log("Selected Album ID:", selectedAlbum); // Debugging line

    // Check if album is selected
    checkIfProceedEnabled();
}


function checkIfProceedEnabled() {
    // Enable or disable the proceed button based on album selection
    $('#proceed').prop('disabled', !selectedAlbum);
}

export function handleAlbumProceed() {
    let albumNumber = $(this).index();
    const albumContainer = $(this);
    
    $.post("", { album: albumContainer.attr("data-value") }, async function (album, status) {
        await updateAlbumUI(album, albumContainer, albumNumber);
    });
}
