const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const usersRouter = require("../users/usersRouter.js");
const authRouter = require("../auth/router.js");
const restricted = require("../auth/restricted-middleware.js");

const server = express();

const sessionConfig = {
  name: "oreo",
  secret: "better with milk!",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, 
    httpOnly: true, 
  },
  resave: false,
  saveUninitialized: true 
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", restricted, usersRouter);
server.use("/api", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
