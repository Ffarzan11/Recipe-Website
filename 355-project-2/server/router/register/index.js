const express = require('express');
const router = express.Router();
const path = require('path');

router.use('/img', express.static(path.join(__dirname, '../../../client/assets')));
router.use('/js', express.static(path.join(__dirname, '../../../client/code/js')));
router.use('/css', express.static(path.join(__dirname, '../../../client/code/css')));

router.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '../../../client/code/Html/register.html'));
});

module.exports = router;
