// To restart project use nodemon app on the terminal must be on server folder.
//You must also have two terminals open, one for the server and the other for react.
// Open on localhost:4000/graphql.

const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//Allow Cross-Origin-Requests
app.use(cors());

mongoose.connect(
  "mongodb://ralph1786:rc042101@ds153980.mlab.com:53980/graphql-lessons",
  { useNewUrlParser: true }
);

mongoose.connection.once("open", () => {
  console.log("connected to Mlab");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);

app.listen(4000, () => {
  console.log("Listening on Port 4000");
});
