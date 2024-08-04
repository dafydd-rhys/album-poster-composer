const { spotifyApi, refreshToken } = require("../../config/spotify");
const { getArtistAlbums } = require("../utils/spotify");

const artistRoute = async (fastify) => {
  fastify.post("/", async (request, reply) => {
    let artist = request.body.artist;
    let artistId = request.body.artistId;
    let albumId = request.body.album;

    refreshToken();

    if (artist) {
      artist = artist.toLowerCase().replace(/\s/g, "");

      try {
        const data = await spotifyApi.searchArtists(artist);
        console.log("Artist information", data.body.artists.items[0].name);

        if (data.body.artists.items[0] !== undefined) {
          return reply
            .code(200)
            .header("Content-Type", "application/json")
            .send(data.body.artists.items[0]);
        } else {
          return reply.code(404).send();
        }
      } catch (err) {
        console.log(err + "!");
        return reply.code(404).send();
      }
    } else if (artistId) {
      try {
        const albums = await getArtistAlbums(artistId);
        return reply
          .code(200)
          .header("Content-Type", "application/json")
          .send(albums);
      } catch (error) {
        return reply.code(404).send();
      }
    } else if (albumId) {
      try {
        const data = await spotifyApi.getAlbum(albumId);
        return reply
          .code(200)
          .header("Content-Type", "application/json")
          .send(data.body);
      } catch (error) {
        return reply.code(404).send();
      }
    }
  });
};

module.exports = artistRoute;
