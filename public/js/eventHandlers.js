import { updateAlbumUI } from './albumDetails.js';

let selectedAlbum = null;
let selectedDesign = null;
export function handleAlbumClick(event) {
    // Remove 'selected' class from any previously selected album
    $('.albumContainer').removeClass('selected');

    // Add 'selected' class to the clicked album
    $(event.currentTarget).addClass('selected');
    
    // Extract the data-value from the clicked album container
    selectedAlbum = $(event.currentTarget).data('value'); // 'value' is used here because jQuery automatically maps data-value to .data('value')

    console.log("Selected Album Value:", selectedAlbum); // Debugging line
  checkIfProceedEnabled();
}

export function handleDesignSelection(event) {
    // Remove 'selected' class from any previously selected design
    $('.design').removeClass('selected');
    
    // Add 'selected' class to the clicked design
    $(event.currentTarget).addClass('selected');
    selectedDesign = $(event.currentTarget).data('design'); // Extract data-design

    console.log("Selected Design:", selectedDesign); // Debugging line
    checkIfProceedEnabled();
  
}

function checkIfProceedEnabled() {
    // Enable or disable the proceed button based on album and design selection
    $('#proceed').prop('disabled', !(selectedAlbum && selectedDesign));
}

export async function handleAlbumProceed() {
    let albumNumber = $('.albumContainer.selected').index(); // Assuming you need index of selected album
    const albumContainer = $('.albumContainer.selected');
    
    // Load the appropriate HTML based on selected design
    let htmlFile = `posters/designs/${selectedDesign}.html`; // Update the path based on your setup

    $.post("", { album: selectedAlbum }, async function (album, status) {
        await updateAlbumUI(album, albumContainer, albumNumber, htmlFile);
    });
}
