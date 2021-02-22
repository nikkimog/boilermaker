const router = require("express").Router();

router.use("/example", require("./example")); // matches all requests to  /api/example/

router.use(function (req, res, next) {
  const err = new Error("Not found.");
  err.status = 404;
  next(err);
});

module.exports = router;
