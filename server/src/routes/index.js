const express = require('express');
const router = express.Router();

const route = router.get("/", (req, res, next) => {
    res.status(200).send({
      title: "Teste  OK",
      version: "00.00.02"
    });
  });

  module.exports = router;