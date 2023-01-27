require('dotenv').config();
const fs = require('fs');
const bodyparser = require('body-parser')
const express = require('express');
const cors = require('cors');
const dns = require('dns');

const app = express();
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const readUrls = ()=>{
  const data = fs.readFileSync("urls.json");
  return JSON.parse(data);
}

const writeUrls = (data) =>{
  fs.writeFileSync('urls.json', JSON.stringify(data));
}

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  try {
    const myUrl = new URL(req.body.url);
    dns.lookup(myUrl.hostname, (err, addresses) => {
      if(err){
        res.json({error:"Invalid URL"});
      }
      else{
      const urls = readUrls();
      const id = Object.keys(urls).length+1;
      const original_url = myUrl.href;
      writeUrls({...urls, [id]:original_url});
      res.json({ original_url, short_url : id});
    }
  });
  } catch (error) {
    res.json({error:"Invalid URL"});
  }
});

app.get('/api/shorturl/:id', async function(req, res) {
  try {
    const urls = readUrls();

    const id = req.params.id;
    const original_url = urls[id];
    
    res.redirect(original_url);
  } catch (error) {
    res.json({error:"Invalid URL"});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
