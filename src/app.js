import express from 'express'
import router from './router.js'
import { createBookTable } from './models/book.model.js'

const app = express()

app.use(express.json())
app.use(router)

createBookTable()

export default app