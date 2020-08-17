const express = require('express');
const app = express();
const db_manager = require('./db_manager.js')

const PORT = 5000;

app.use("/assets",express.static(__dirname + "/assets"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req,res) => {
    var shortUrls = await db_manager.findUrls();
    res.render('index', { shortUrls: shortUrls });
});

app.post('/shortenUrl', async (req, res) => {
    await db_manager.shortenUrl(req.body.originalUrl);
    res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
    var short = await db_manager.findUrl(req.params.shortUrl);
    if(short==null) {
        return res.sendStatus(404);
    }
    res.redirect(short.originalUrl);
});

app.listen(PORT);