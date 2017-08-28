const express = require('express');
const mocks = require('./mock_api')
const api = require('./api')

const app = express();
const port = process.env.PORT || 8000

app.set('etag', false); // diable etag (cache control)
app.set('x-powered-by', false); // hide x-powered-by header
app.set('json spaces', 2); // pretty print JSON

app.use('/api/', mocks)
app.use('/api/', api)

app.get('/', (req, res) => {
    res.send(`Hello World! API routes found under /api/`);
});

app.listen(port, (err) => {
    if (!err) {
        console.log(`Listening on port ${port}`);
    }
});


