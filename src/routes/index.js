const { spotifyApi, refreshToken } = require("../../config/spotify");
const seo = require("../../config/seo.json");

const indexRoute = async (fastify) => {
  fastify.get("/", async (request, reply) => {
    let params = { seo: seo };

    if (request.query.randomize) {
      const artists = require("../artists.json");
      const allArtists = Object.keys(artists);
      let currentArtist = allArtists[(allArtists.length * Math.random()) << 0];

      refreshToken();

      try {
        const artistData = await spotifyApi.getArtist(artists[currentArtist]);
        console.log("Artist information requested for ", artistData.body.name);

        params = {
          artist_name: artistData.body.name,
          artist_image: artistData.body.images[0].url,
          artist_id: artistData.body.id,
          seo: seo
        };

        return reply.view("/src/pages/index.hbs", params);
      } catch (err) {
        console.error(err);
      }
    } else {
      params = {
        seo: seo
      };
      refreshToken();
      return reply.view("/src/pages/index.hbs", params);
    }
  });
};

module.exports = indexRoute;
