import express from 'express'
import router from './router.js'
import { createBookTable } from './models/book.model.js'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)

createBookTable()

export default app