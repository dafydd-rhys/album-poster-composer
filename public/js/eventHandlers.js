import { fetchAlbumDetails } from './api.js';
import { updateAlbumUI } from './albumDetails.js';

export function handleAlbumClick() {
    let albumNumber = $(this).index();
    const albumContainer = $(this);
    
    $.post("", { album: albumContainer.attr("data-value") }, async function (album, status) {
        await updateAlbumUI(album, albumContainer, albumNumber);
    });
}
