const express = require('express')
const app = express()
const port = 8080
const bodyParser = require('body-parser')
const { readCsv } = require('./generate')
const { readCsv1 } = require('./generate2')
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('../generatedData'))

app.get('/', (req, res) => res.send('Running'))

app.post('/generateCsv', async (req, res) => {
    try {
        const { dType, noOfRows, nodesInColumns } = req.body;
        console.log(req.body)
        if(dType === 'columns'){
            await readCsv1(nodesInColumns)
            res.send('columnRespective.csv')
        }else {
            await readCsv(noOfRows)
            res.send('rowRespective.csv')
        }
    } catch (err) {
        console.log(err)
        res.status(400).send('error')
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))