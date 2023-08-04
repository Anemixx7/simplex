const express = require('express');
const app = express();
const port = 3001;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.post('/', express.json(), (req, res) => {
    const solver = require('javascript-lp-solver');
    const model = req.body;

    const result = solver.Solve(model);
    console.log(result);
    res.send(result);
});


app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
