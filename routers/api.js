const express = require("express");
const router = express.Router();
const qs = require('qs');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();
const Sentencer = require('sentencer');

router.get('/nouns', (req, res) => {
  const count = req.query.count || 10;
  wordpos.randNoun({ count })
    .then(nouns => {
      res.json(nouns);
    })
})

module.exports = router;
