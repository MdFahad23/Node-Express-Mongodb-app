const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

module.exports = (app) => {
  app.use(express.json());
  app.use(compression());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  if (process.env.NODE_ENV === "development") {
    app.use(morgan());
  }
};
