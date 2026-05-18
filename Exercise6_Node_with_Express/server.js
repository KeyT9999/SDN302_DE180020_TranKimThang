const express = require('express');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(express.json());

app.get('/data', (req, res) => {
    const data = fs.readFileSync('./data.json', 'utf8');
    res.json(JSON.parse(data));
});

app.post('/update', (req, res) => {
    fs.writeFileSync('./data.json', JSON.stringify(req.body, null, 2));
    res.json({
        message: 'Data updated successfully',
        data: req.body
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});