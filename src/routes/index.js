const express = require("express");
const router = express.Router();
const accessRouter = require("./access");
const { apiKey, permissions } = require("../auth/checkAuth");

router.use(apiKey);
// check permission
router.use(permissions('0000'))
router.use('/v1/api',accessRouter);

module.exports = router;
