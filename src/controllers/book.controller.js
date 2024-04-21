import * as BookModel from '../models/book.model.js'
import * as Validations from '../utils/validations.js'

export const addBook = async (request, response) => {
    await Validations.isValidBody(request.body)
    .then(async (_) => {
        await BookModel.addBook(request.body)
        .then((_) => {
            response.status(200).json({
                'message': 'Livro cadastrado com sucesso'
            })
        })
        .catch((error) => {
            response.status(error.code && error.code == 'SQLITE_CONSTRAINT' ? 409 : 500).json(error)
        })
    })
    .catch((error) => {
        response.status(500).json({
            message: `controller :: addBook :: ${error.message}`
        })
    })
}

export const listBooks = async (request, response) => {
    await Validations.isValidPaginationQuery(request.query)
    .then(async (_) => {
        const { page = 1, size = 5 } = request?.query
        await BookModel.listBooks(page, size)
        .then((result) => {
            response.status(200).json(result)
        })
        .catch((error) => {
            response.status(500).json(error)
        })
    })
    .catch((error) => {
        response.status(500).json({
            message: `controller :: listBooks :: ${error.message}`
        })
    })
}

export const getBookByISBN = async (request, response) => {
    await Validations.isValidISBNParam(request?.params)
    .then(async (_) => {
        await BookModel.getBookByUniqueParam(request.params.isbn, false)
        .then((result) => {
            response.status(200).json(result)
        })
        .catch((error) => {
            response.status(500).json(error)
        })
    })
    .catch((error) => {
        response.status(500).json({
            message: `controller :: getBookByISBN :: ${error.message}`
        })
    })
}

export const getBookByName = async (request, response) => {
    await Validations.isValidNameParam(request?.params)
    .then(async (_) => {
        await BookModel.getBookByUniqueParam(request.params.name, true)
        .then((result) => {
            response.status(200).json(result)
        })
        .catch((error) => {
            response.status(500).json(error)
        })
    })
    .catch((error) => {
        response.status(500).json({
            message: `controller :: getBookByName :: ${error.message}`
        })
    })
}

export const editBook = async (request, response) => {    
    await Validations.isValidBody(request.body)
    .then(async (_) => {
        await BookModel.editBook(request.body)
        .then((result) => {
            let message = ''
            if(result.changes == 0) {
                message = 'O código isbn informado não está registrado à nenhum livro. Nenhuma alteração foi feita'
            } else {
                message = 'Livro editado com sucesso'
            }
            response.status(200).json({
                message
            })
        })
        .catch((error) => {
            response.status(500).json(error)
        })
    })
    .catch((error) => {
        response.status(500).json({
            message: `controller :: editBook :: ${error.message}`
        })
    })
}

export const deleteBookByISBN = async (request, response) => {
    await Validations.isValidISBNParam(request?.params)
    .then(async (_) => {
        await BookModel.deleteBookByUniqueParam(request.params.isbn)
        .then((result) => {
            let message = ''
            if(result.changes == 0) {
                message = 'O código isbn informado não está registrado à nenhum livro. Nenhuma alteração foi feita'
            } else {
                message = 'Livro deletado com sucesso'
            }
            response.status(200).json({
                message
            })
        })
        .catch((error) => {
            response.status(500).json(error)
        })
    })
    .catch((error) => {
        response.status(500).json({
            message: `controller :: deleteBookByISBN :: ${error.message}`
        })
    })
}


