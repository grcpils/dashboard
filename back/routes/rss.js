var express = require('express');
var router = express.Router();

let Parser = require('rss-parser');
let parser = new Parser();

router.get('/', async function(req, res) {
    const {url} = req.query

    let feed = await parser.parseURL(url);

    let parsedRSS = {data: []};
    feed.items.forEach(item => {
        parsedRSS['data'].push({title: item.title,
                        content: item.content,
                        link: item.link})
      });
    return res.json(parsedRSS);
});

module.exports = router;