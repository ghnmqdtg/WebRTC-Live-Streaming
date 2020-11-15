var express = require('express');
var router = express.Router();
var url = ['/', '/', '#', '/about', '/login'];
var navbar = ['WebRTC Live Steaming', '主頁', '最新消息', '關於我們'];
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
router.get('/about', function(req, res, next) {
  res.render('about', {
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
