const path = require('path');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../dist/cms/index.html'));
});

router.post('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../dist/cms/index.html'));
});

router.get('/:id', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../dist/cms/index.html'));
});

router.put('/:id', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../dist/cms/index.html'));
});

router.delete('/:id', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../dist/cms/index.html'));
});

module.exports = router;
