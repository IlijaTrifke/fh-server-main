const express = require('express');
const router = express.Router();

const { napraviPrijavu } = require('../controllers/prijave');

router.route('/').post(napraviPrijavu);

module.exports = router;