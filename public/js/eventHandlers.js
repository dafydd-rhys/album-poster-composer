import { updateAlbumUI } from './albumDetails.js';

let selectedAlbum = null;
let selectedDesign = null;

export function handleAlbumClick(event) {
    // Remove 'selected' class from any previously selected album
    $('.albumContainer').removeClass('selected');

    // Add 'selected' class to the clicked album
    $(event.currentTarget).addClass('selected');
    selectedAlbum = $(event.currentTarget).data('value'); // Extract data-value

    console.log("Selected Album Value:", selectedAlbum); // Debugging line

    // Check if album is selected
    checkIfProceedEnabled();
}

export function handleDesignSelection(event) {
    // Remove 'selected' class from any previously selected design
    $('.design').removeClass('selected');
    
    // Add 'selected' class to the clicked design
    $(event.currentTarget).addClass('selected');
    selectedDesign = $(event.currentTarget).data('design'); // Extract data-design

    console.log("Selected Design:", selectedDesign); // Debugging line

    // Check if proceed button can be enabled
    checkIfProceedEnabled();
}

function checkIfProceedEnabled() {
    // Enable or disable the proceed button based on album and design selection
    $('#proceed').prop('disabled', !(selectedAlbum && selectedDesign));
}

export async function handleAlbumProceed() {
    if (!selectedAlbum || !selectedDesign) {
        console.error("No album or design selected.");
        return;
    }

    let albumNumber = $('.albumContainer.selected').index(); // Assuming you need index of selected album
    const albumContainer = $('.albumContainer.selected');
    
    // Load the appropriate HTML based on selected design
    let htmlFile = `designs/${selectedDesign}.html`; // Update the path based on your setup

    $.post("", { album: selectedAlbum }, async function (album, status) {
        await updateAlbumUI(album, albumContainer, albumNumber);
        
        // Load the HTML file
        window.open(htmlFile, '_blank'); // Opens the HTML file in a new tab
    });
}
