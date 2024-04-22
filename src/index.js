import app from './app.js'
import dotenv from 'dotenv'
import { openDb } from './configs/db.config.js'

dotenv.config()
openDb()

const port = process.env.PORT || 3333

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
}) 