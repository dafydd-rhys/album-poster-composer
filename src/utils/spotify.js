const { spotifyApi } = require("../../config/spotify");

const getArtistAlbums = async (id) => {
  const albums = (
    await spotifyApi.getArtistAlbums(id, { include_groups: "album", limit: 50 })
  ).body;

  if (albums.total > albums.limit) {
    for (let i = 1; i < Math.ceil(albums.total / albums.limit); i++) {
      const albumsToAdd = (
        await spotifyApi.getArtistAlbums(id, {
          include_groups: "album",
          limit: 50,
          offset: albums.limit * i
        })
      ).body;

      albumsToAdd.items.forEach(item => albums.items.push(item));
    }
  }
  return albums;
};

const getAlbumArtwork = async (albumName) => {
  const url = "https://artwork.themoshcrypt.net/api/search?keyword=" + encodeURIComponent(albumName);
  const response = await fetch.fetch(url);
  const data = await response.json();
  return data;
};

module.exports = { getArtistAlbums, getAlbumArtwork };
