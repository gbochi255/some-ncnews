const app = require('./app')
//const PORT = process.env.port || 9292

const { PORT=9000 } = process.env

app.listen(PORT, () => {
    console.log(`app listening on http://localhost:${PORT}`)
})