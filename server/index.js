const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())


app.get('/api/apewisdom', async (req, res) => {
    const apewisdom = 'https://apewisdom.io/api/v1.0/filter/all-stocks'
    const apewisdomResponse = await fetch(apewisdom)
    const apewisdomJSON = await apewisdomResponse.json()
    res.json(apewisdomJSON.results)
})

app.listen(8888, () => {
    console.log('Listening on port 8888...')
})
