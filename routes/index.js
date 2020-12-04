var express = require('express');
var router = express.Router();
var url = ['#', '/', '/login', 'https://github.com/ghnmqdtg/WebRTC-Live-Streaming'];
var navbar = ['WebRTC Live Steaming', '首頁', '登入', 'GitHub'];
var AddressBar = '<meta name="theme-color" content="#000" >'

/* GET home page. */
// it render "index.ejs" in /views (default path)
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'WebRTC-Live-Steaming',
    AddressBar: AddressBar,
    navbar: navbar,
    url: url,
  });
});

/* GET about page. */
// it render "about.ejs" in /views (default path)
router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'WebRTC-Live-Steaming',
    AddressBar: AddressBar,
    navbar: navbar,
    url: url,
  });
});

router.get('/chat', function(req, res, next) {
  res.render('chat', {
    title: 'WebRTC-Live-Steaming',
    AddressBar: AddressBar,
    navbar: navbar,
    url: url,
  });
});

module.exports = router;
