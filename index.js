const express = require('express')
const app = express()
const { client, seed } = require('./db')
app.use(express.json())
app.use('/api', require('./api'))

const init = async () => {
    await client.connect()
    console.log('connected to db')

    await seed()

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}` )
    })
}

init()