import express from 'express'
import router from './router.js'
import { createBookTable } from './models/book.model.js'

const app = express()

app.use(router)
app.use(express.json())

createBookTable()

export default app