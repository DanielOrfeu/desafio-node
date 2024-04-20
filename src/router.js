import { Router } from 'express'
import * as BookController from './controllers/book.controller.js'

const router = Router()

router.post('/book', BookController.addBook)
router.put('/book', BookController.editBook)
router.get('/books', BookController.listBooks)
router.get('/book/:sbn', BookController.getBookDetails)
router.delete('/book/:sbn', BookController.deleteBook)

export default router
