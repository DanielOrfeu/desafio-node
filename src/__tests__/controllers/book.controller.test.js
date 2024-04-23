import { jest } from '@jest/globals'
import * as BookController from '../../controllers/book.controller.js'
import * as BookModel from '../../models/book.model.js'
import * as Validations from '../../middlewares/validations.js'

jest.mock('../../models/book.model.js')
jest.mock('../../middlewares/validations.js')

const request = {
    body: {
        isbn: 1234567890,
        name: 'Livro Teste',
        description: 'Descrição do Livro Teste',
        author: 'Autor do Livro Teste',
        stock: 10
    },
    query: {
        page: 1,
        size: 3
    },
    params: {
        isbn: 1234567890,
        name: 'Livro teste'
    }
}

const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
}

describe('Book Controller', () => {
    describe('addBook', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })
        test('Deve retornar status 200 indicando que todas as promisses foram resolvidas', async () => {          
            await BookController.addBook(request, response)
            expect(Validations.isValidBody).toHaveBeenCalledTimes(1)
            expect(Validations.isValidBody).toHaveBeenCalledWith(request.body)
            expect(BookModel.addBook).toHaveBeenCalledTimes(1)
            expect(BookModel.addBook).toHaveBeenCalledWith(request.body)
            expect(response.status).toHaveBeenLastCalledWith(200)
        })

        test('Deve gerar erro 400 por erro no método do Validations.isValidBody', async () => {
            Validations.isValidBody.mockRejectedValue({
                message: [ 'Campo author é obrigatório' ],
                code: 'SCHEMA_VALIDATE_FAIL'
            })
            await BookController.addBook(request, response)
            expect(response.status).toHaveBeenLastCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({
                "message": "controller :: addBook :: Campo author é obrigatório"
            })
        })

        test('Deve gerar erro 409 no método BookModel.addBook por inserção duplicada', async () => {
            Validations.isValidBody.mockResolvedValue()
            BookModel.addBook.mockRejectedValue({
                "message": "model :: addBook :: Já existe um livro com a mesma isbn e/ou nome cadastrados",
                "errno": 19,
                "code": "SQLITE_CONSTRAINT"
            })
            await BookController.addBook(request, response)
            expect(BookModel.addBook).toHaveBeenCalledTimes(1)
            expect(BookModel.addBook).toHaveBeenCalledWith(request.body)
            expect(response.status).toHaveBeenLastCalledWith(409)
            expect(response.json).toHaveBeenCalledWith({
                "message": "model :: addBook :: Já existe um livro com a mesma isbn e/ou nome cadastrados",
                "errno": 19,
                "code": "SQLITE_CONSTRAINT"
            })
        })

        test('Deve gerar erro 500 por erro no método BookModel.addBook', async () => {
            Validations.isValidBody.mockResolvedValue()
            BookModel.addBook.mockRejectedValue(new Error('Internal server error'))
            await BookController.addBook(request, response)
            expect(BookModel.addBook).toHaveBeenCalledTimes(1)
            expect(BookModel.addBook).toHaveBeenCalledWith(request.body)
            expect(response.status).toHaveBeenLastCalledWith(500)
            expect(response.json).toHaveBeenCalledWith({
                "message": "Internal server error"
            })
        })
    })

    describe('listBooks', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })
        test('Deve retornar status 200 indicando que todas as promisses foram resolvidas (busca de livros com estoque)', async () => {        
            const showOutOfStock = false
            
            await BookController.listBooks(request, response, showOutOfStock)
            expect(Validations.isValidPaginationQuery).toHaveBeenCalledTimes(1)
            expect(Validations.isValidPaginationQuery).toHaveBeenCalledWith(request.query)
            expect(BookModel.listBooks).toHaveBeenCalledTimes(1)
            expect(BookModel.listBooks).toHaveBeenCalledWith(request.query.page, request.query.size, showOutOfStock)
            expect(response.status).toHaveBeenLastCalledWith(200)
        })

        test('Deve retornar status 200 indicando que todas as promisses foram resolvidas (busca de livros sem estoque)', async () => {
            const showOutOfStock = true
            let requestCopy = {
                ...request,
                originalUrl: 'out-of-stock'
            }
            await BookController.listBooks(requestCopy, response, showOutOfStock)
            expect(Validations.isValidPaginationQuery).toHaveBeenCalledTimes(1)
            expect(Validations.isValidPaginationQuery).toHaveBeenCalledWith(request.query)
            expect(BookModel.listBooks).toHaveBeenCalledTimes(1)
            expect(BookModel.listBooks).toHaveBeenCalledWith(request.query.page, request.query.size, showOutOfStock)
            expect(response.status).toHaveBeenLastCalledWith(200)
        })

        test('Deve gerar erro 400 por erro no método do Validations.isValidPaginationQuery', async () => {
            Validations.isValidPaginationQuery.mockRejectedValue({
                message: [ 'Campo author é obrigatório' ],
                code: 'SCHEMA_VALIDATE_FAIL'
            })
            await BookController.listBooks(request, response)
            expect(response.status).toHaveBeenLastCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({
                "message": "controller :: listBooks :: Campo author é obrigatório"
            })
        })

        test('Deve gerar erro 500 por erro no método BookModel.listBooks', async () => {
            const showOutOfStock = false
            
            Validations.isValidPaginationQuery.mockResolvedValue()
            BookModel.listBooks.mockRejectedValue(new Error('Internal server error'))
            await BookController.listBooks(request, response, showOutOfStock)
            expect(BookModel.listBooks).toHaveBeenCalledTimes(1)
            expect(BookModel.listBooks).toHaveBeenCalledWith(request.query.page, request.query.size, showOutOfStock)
            expect(response.status).toHaveBeenLastCalledWith(500)
            expect(response.json).toHaveBeenCalledWith({
                "message": "Internal server error"
            })
        })
    })

    describe('getBookByISBN', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })
        test('Deve retornar status 200 indicando que todas as promisses foram resolvidas', async () => {        
            await BookController.getBookByISBN(request, response)
            expect(Validations.isValidISBNParam).toHaveBeenCalledTimes(1)
            expect(Validations.isValidISBNParam).toHaveBeenCalledWith(request.params)
            expect(BookModel.getBookByUniqueParam).toHaveBeenCalledTimes(1)
            expect(BookModel.getBookByUniqueParam).toHaveBeenCalledWith(request.params.isbn, false)
            expect(response.status).toHaveBeenLastCalledWith(200)
        })

        test('Deve gerar erro 400 por erro no método do Validations.isValidISBNParam', async () => {
            Validations.isValidISBNParam.mockRejectedValue({
                message: [ 'Campo isbn é obrigatório' ],
                code: 'SCHEMA_VALIDATE_FAIL'
            })
            await BookController.getBookByISBN(request, response)
            expect(response.status).toHaveBeenLastCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({
                "message": "controller :: getBookByISBN :: Campo isbn é obrigatório"
            })
        })

        test('Deve gerar erro 500 por erro no método BookModel.getBookByISBN', async () => {
            Validations.isValidISBNParam.mockResolvedValue()
            BookModel.getBookByUniqueParam.mockRejectedValue(new Error('Internal server error'))
            await BookController.getBookByISBN(request, response)
            expect(BookModel.getBookByUniqueParam).toHaveBeenCalledTimes(1)
            expect(BookModel.getBookByUniqueParam).toHaveBeenCalledWith(request.params.isbn, false)
            expect(response.status).toHaveBeenLastCalledWith(500)
            expect(response.json).toHaveBeenCalledWith({
                "message": "Internal server error"
            })
        })
    })

    describe('getBookByName', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })
        test('Deve retornar status 200 indicando que todas as promisses foram resolvidas', async () => {        
            BookModel.getBookByUniqueParam.mockResolvedValue()
            await BookController.getBookByName(request, response)
            expect(Validations.isValidNameParam).toHaveBeenCalledTimes(1)
            expect(Validations.isValidNameParam).toHaveBeenCalledWith(request.params)
            expect(BookModel.getBookByUniqueParam).toHaveBeenCalledTimes(1)
            expect(BookModel.getBookByUniqueParam).toHaveBeenCalledWith(request.params.name, true)
            expect(response.status).toHaveBeenLastCalledWith(200)
        })

        test('Deve gerar erro 400 por erro no método do Validations.isValidNameParam', async () => {
            Validations.isValidNameParam.mockRejectedValue({
                message: [ 'Campo name é obrigatório' ],
                code: 'SCHEMA_VALIDATE_FAIL'
            })
            await BookController.getBookByName(request, response)
            expect(response.status).toHaveBeenLastCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({
                "message": "controller :: getBookByName :: Campo name é obrigatório"
            })
        })

        test('Deve gerar erro 500 por erro no método BookModel.getBookByName', async () => {
            Validations.isValidNameParam.mockResolvedValue()
            BookModel.getBookByUniqueParam.mockRejectedValue(new Error('Internal server error'))
            await BookController.getBookByName(request, response)
            expect(BookModel.getBookByUniqueParam).toHaveBeenCalledTimes(1)
            expect(BookModel.getBookByUniqueParam).toHaveBeenCalledWith(request.params.name, true)
            expect(response.status).toHaveBeenLastCalledWith(500)
            expect(response.json).toHaveBeenCalledWith({
                "message": "Internal server error"
            })
        })
    })

    describe('editBook', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })
        test('Deve retornar status 200 indicando que todas as promisses foram resolvidas e que um livro foi alterado', async () => {   
            BookModel.editBook.mockResolvedValue({
                changes: 1
            })
            
            await BookController.editBook(request, response)
            expect(Validations.isValidBody).toHaveBeenCalledTimes(1)
            expect(Validations.isValidBody).toHaveBeenCalledWith(request.body)
            expect(BookModel.editBook).toHaveBeenCalledTimes(1)
            expect(BookModel.editBook).toHaveBeenCalledWith(request.body)
            expect(response.status).toHaveBeenLastCalledWith(200)
            expect(response.json).toHaveBeenLastCalledWith({
                "message" : "Livro editado com sucesso"
            })
        })

        test('Deve retornar status 200 indicando que todas as promisses foram resolvidas mas nenhum livro foi alterado', async () => {   
            BookModel.editBook.mockResolvedValue({
                changes: 0
            })
            
            await BookController.editBook(request, response)
            expect(Validations.isValidBody).toHaveBeenCalledTimes(1)
            expect(Validations.isValidBody).toHaveBeenCalledWith(request.body)
            expect(BookModel.editBook).toHaveBeenCalledTimes(1)
            expect(BookModel.editBook).toHaveBeenCalledWith(request.body)
            expect(response.status).toHaveBeenLastCalledWith(200)
            expect(response.json).toHaveBeenLastCalledWith({
                "message" : "O código isbn informado não está registrado à nenhum livro. Nenhuma alteração foi feita"
            })
        })

        test('Deve gerar erro 400 por erro no método do Validations.isValidBody', async () => {
            Validations.isValidBody.mockRejectedValue({
                message: [ 'Campo author é obrigatório' ],
                code: 'SCHEMA_VALIDATE_FAIL'
            })
            await BookController.editBook(request, response)
            expect(response.status).toHaveBeenLastCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({
                "message": "controller :: editBook :: Campo author é obrigatório"
            })
        })


        test('Deve gerar erro 500 por erro no método BookModel.editBook', async () => {
            Validations.isValidBody.mockResolvedValue()
            BookModel.editBook.mockRejectedValue(new Error('Internal server error'))
            await BookController.editBook(request, response)
            expect(BookModel.editBook).toHaveBeenCalledTimes(1)
            expect(BookModel.editBook).toHaveBeenCalledWith(request.body)
            expect(response.status).toHaveBeenLastCalledWith(500)
            expect(response.json).toHaveBeenCalledWith({
                "message": "Internal server error"
            })
        })
    })

    describe('deleteBookByISBN', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })
        test('Deve retornar status 200 indicando que todas as promisses foram resolvidas e que um livro foi deletado', async () => {   
            BookModel.deleteBookByISBN.mockResolvedValue({
                changes: 1
            })
            
            await BookController.deleteBookByISBN(request, response)
            expect(Validations.isValidISBNParam).toHaveBeenCalledTimes(1)
            expect(Validations.isValidISBNParam).toHaveBeenCalledWith(request.params)
            expect(BookModel.deleteBookByISBN).toHaveBeenCalledTimes(1)
            expect(BookModel.deleteBookByISBN).toHaveBeenCalledWith(request.params.isbn)
            expect(response.status).toHaveBeenLastCalledWith(200)
            expect(response.json).toHaveBeenLastCalledWith({
                "message" : "Livro deletado com sucesso"
            })
        })

        test('Deve retornar status 200 indicando que todas as promisses foram resolvidas mas nenhum livro foi deletado', async () => {   
            BookModel.deleteBookByISBN.mockResolvedValue({
                changes: 0
            })
            
            await BookController.deleteBookByISBN(request, response)
            expect(Validations.isValidISBNParam).toHaveBeenCalledTimes(1)
            expect(Validations.isValidISBNParam).toHaveBeenCalledWith(request.params)
            expect(BookModel.deleteBookByISBN).toHaveBeenCalledTimes(1)
            expect(BookModel.deleteBookByISBN).toHaveBeenCalledWith(request.params.isbn)
            expect(response.status).toHaveBeenLastCalledWith(200)
            expect(response.json).toHaveBeenLastCalledWith({
                "message" : "O código isbn informado não está registrado à nenhum livro. Nenhuma alteração foi feita"
            })
        })

        test('Deve gerar erro 400 por erro no método do Validations.isValidISBNParam', async () => {
            Validations.isValidISBNParam.mockRejectedValue({
                message: [ 'Campo isbn é obrigatório' ],
                code: 'SCHEMA_VALIDATE_FAIL'
            })
            await BookController.deleteBookByISBN(request, response)
            expect(response.status).toHaveBeenLastCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({
                "message": "controller :: deleteBookByISBN :: Campo isbn é obrigatório"
            })
        })


        test('Deve gerar erro 500 por erro no método BookModel.deleteBookByISBN', async () => {
            Validations.isValidISBNParam.mockResolvedValue()
            BookModel.deleteBookByISBN.mockRejectedValue(new Error('Internal server error'))
            await BookController.deleteBookByISBN(request, response)
            expect(BookModel.deleteBookByISBN).toHaveBeenCalledTimes(1)
            expect(BookModel.deleteBookByISBN).toHaveBeenCalledWith(request.params.isbn)
            expect(response.status).toHaveBeenLastCalledWith(500)
            expect(response.json).toHaveBeenCalledWith({
                "message": "Internal server error"
            })
        })
    })
})
