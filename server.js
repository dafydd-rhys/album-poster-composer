const path = require("path");
const fastify = require("fastify")({ logger: false });
const { initializeSpotify } = require("./config/spotify");

// Initialize Spotify API
initializeSpotify();

// Register Fastify plugins
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Register routes
const indexRoute = require("./src/routes/index");
const artistRoute = require("./src/routes/artist");

indexRoute(fastify);
artistRoute(fastify);

// Start the server
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
