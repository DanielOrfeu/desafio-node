import { Router } from 'express'
import * as BookController from './controllers/book.controller.js'

const router = Router()

router.get('/', (_, response) => response.send({message: 'OK'}))
router.post('/book', BookController.addBook)
router.put('/book', BookController.editBook)
router.get('/books', BookController.listBooks)
router.get('/book/isbn/:isbn', BookController.getBookByISBN)
router.get('/book/name/:name', BookController.getBookByName)
router.delete('/book/:isbn', BookController.deleteBookByISBN)

export default router
