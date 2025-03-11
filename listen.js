const app = require('./app')
const port = process.env.port || 9292

app.listen(port, () => {
    console.log(`app listening on http://localhost:${port}`)
})