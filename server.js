const path = require("path");
const fetch = require("fetch");
const SpotifyWebApi = require("spotify-web-api-node");
const fastify = require("fastify")({ logger: false });

let tokenExpirationEpoch;
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
    spotifyApi.setRefreshToken(data.body["refresh_token"]);

    tokenExpirationEpoch = new Date().getTime() / 1000 + data.body["expires_in"];

    console.log("Got an access token: " + spotifyApi.getAccessToken());
    console.log("Got a refresh token: " + spotifyApi.getRefreshToken());
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token!", err.message);
  }
);

function refreshToken() {
  if (tokenExpirationEpoch < new Date().getTime() / 1000) {
    spotifyApi.refreshAccessToken().then(
      function(data) {
        tokenExpirationEpoch = new Date().getTime() / 1000 + data.body["expires_in"];
        spotifyApi.setAccessToken(data.body["access_token"]);
        console.log("Refreshed token");
      },
      function(err) {
        console.log("Could not refresh the token.", err.message);
      }
    );
  }
}

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/"
});

fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars")
  }
});

const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

fastify.get("/", function(request, reply) {
  let params = { seo: seo };

  if (request.query.randomize) {
    const artists = require("./src/artists.json");
    const allArtists = Object.keys(artists);
    let currentArtist = allArtists[(allArtists.length * Math.random()) << 0];

    refreshToken();

    spotifyApi.getArtist(artists[currentArtist]).then(
      function(artistData) {
        console.log("Artist information requested for ", artistData.body.name);

        params = {
          artist_name: artistData.body.name,
          artist_image: artistData.body.images[0].url,
          artist_id: artistData.body.id,
          seo: seo
        };

        return reply.view("/src/pages/index.hbs", params);
      },
      function(err) {
        console.error(err);
      }
    );
  } else {
    params = {
      seo: seo
    };
    refreshToken();
    return reply.view("/src/pages/index.hbs", params);
  }
});

fastify.post("/", function(request, reply) {
  let params = { seo: seo };
  let artist = request.body.artist;
  let artistId = request.body.artistId;
  let albumId = request.body.album;

  refreshToken();

  if (artist) {
    artist = artist.toLowerCase().replace(/\s/g, "");

    spotifyApi.searchArtists(artist).then(
      function(data) {
        console.log("Artist information", data.body.artists.items[0].name);
        if (data.body.artists.items[0] !== undefined) {
          return reply
            .code(200)
            .header("Content-Type", "application/json")
            .send(data.body.artists.items[0]);
        } else {
          return reply.code(404).send();
        }
      },
      function(err) {
        console.log(err + "!");
        return reply.code(404).send();
      }
    );
  } else if (artistId) {
    getArtistAlbums(artistId).then(
      function(albums) {
        return reply
          .code(200)
          .header("Content-Type", "application/json")
          .send(albums);
      },
      function(error) {
        return reply.code(404).send();
      }
    );
  } else if (albumId) {
    spotifyApi.getAlbum(albumId).then(
      function(data) {
        return reply
          .code(200)
          .header("Content-Type", "application/json")
          .send(data.body);
      },
      function(error) {
        return reply.code(404).send();
      }
    );
  }
});

fastify.listen({ port: process.env.PORT, host: "0.0.0.0" }, function(err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
});

async function getArtistAlbums(id) {
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
}

async function getAlbumArtwork(albumName) {
  const url =
    "https://artwork.themoshcrypt.net/api/search?keyword=" + encodeURIComponent(albumName);
  const response = fetch.fetch(url);
  const data = await response.json();
  return data;
}
