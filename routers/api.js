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

router.get('/verbs', (req, res) => {
  const count = req.query.count || 10;
  wordpos.randVerb({ count })
    .then(verbs => {
      res.json(verbs);
    })
})

router.get('/adjectives', (req, res) => {
  const count = req.query.count || 10;
  wordpos.randAdjective({ count })
    .then(adjectives => {
      res.json(adjectives);
    })
})

router.get('/adverbs', (req, res) => {
  const count = req.query.count || 10;
  wordpos.randAdverb({ count })
    .then(adverbs => {
      res.json(adverbs);
    })
})

router.post('/mad_libs', (req, res) => {
  const story = req.body.story;
  const words = req.body.words;

  wordpos.getPOS(words.join(' '))
    .then((pos) => {
      console.log(pos);
    });

  let data = {
    words: ['dog', 'cat'],
    story: "The {{ noun }} ran over the {{ noun }}"
  }

  request.post("http://localhost:3000/api/mad_libs/?token=8b2b40c9b3998966089a312d3cee6b1b", (err, res, body) => {
  }).form(data)






})

//words=cat&words=dog&story="The {{ noun }} ran over the {{ noun }}"

module.exports = router;
