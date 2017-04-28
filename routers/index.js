const express = require("express");
const router = express.Router();

// ----------------------------------------
// Index Redirect
// ----------------------------------------
router.get("/", (req, res) => {
  res.redirect('/users/show');
});

module.exports = router;
