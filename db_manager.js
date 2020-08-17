const sqlite3 = require('sqlite3').verbose();

// connect to the database
var db = new sqlite3.Database('base_url.db', (err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to SQlite database.');
});

function shortenUrl(url) {
  if(url!="") {
    db.get('SELECT * from url WHERE originalUrl=?', [url], (err, row) => {
      if(err) throw err;

      if(row === undefined) {
        db.serialize(() => {
          db.run('INSERT INTO url(originalUrl) VALUES(?)', [url]);
          db.run('UPDATE url SET shortUrl=? WHERE originalUrl=?', randomHexNumber(), [url]);
        });
      }
    })
  }
}

function findUrls() {
  return new Promise((resolve, reject) => {
    var url = [];
    db.each('SELECT * FROM url', (err, row) => {
      if (err) {
        throw err;
      }
      url.push(row);
    }, () => {
      resolve(url);
    });
 });
}

function findUrl(short) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM url WHERE shortUrl=?", [short], (err, row) => {
      if (err) {
        throw err;
      }
      resolve(row);
    });
  });
}

function randomHexNumber() {
  var n = (Math.random() * 0xfffff * 1000000).toString(16);
  return n.slice(0, 6);
}

module.exports = {shortenUrl, findUrl, findUrls}
