const router = require("express").Router();

// matches GET requests to /api/example/
router.get("/", function (req, res, next) {
  /* etc */
});

module.exports = router;
