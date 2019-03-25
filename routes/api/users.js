const express = require('express');

const router = express.Router();

router.get('/test', (req, res) => res.json({ meassge: 'users route ' }));

module.exports = router;
