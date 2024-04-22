import * as BookModel from '../models/book.model.js'
import * as Validations from '../middlewares/validations.js'
import { errorMessageFormatter } from '../middlewares/errorMessageFormatter.js'

export const addBook = async (request, response) => {
    try {
        await Validations.isValidBody(request.body)
        await BookModel.addBook(request.body)
        response.status(200).json({ 
            message: 'Livro cadastrado com sucesso.' 
        })
    } catch (error) {
        errorMessageFormatter(response, error, 'controller :: addBook')
    }
}

export const listBooks = async (request, response) => {
    try {
        await Validations.isValidPaginationQuery(request.query)
        const { page = 1, size = 5 } = request?.query
        const result = await BookModel.listBooks(page, size)
        response.status(200).json(result)
    } catch (error) {
        errorMessageFormatter(response, error, 'controller :: listBooks')
    }
}

export const getBookByISBN = async (request, response) => {
    try {
        await Validations.isValidISBNParam(request?.params)
        const result = await BookModel.getBookByUniqueParam(request.params.isbn, false)
        response.status(200).json(result)
    } catch (error) {
        errorMessageFormatter(response, error, 'controller :: getBookByISBN')
    }
}

export const getBookByName = async (request, response) => {
    try {
        await Validations.isValidNameParam(request?.params)
        const result = await BookModel.getBookByUniqueParam(request.params.name, true)
        response.status(200).json(result)
    } catch (error) {
        errorMessageFormatter(response, error, 'controller :: getBookByName')
    }
}

export const editBook = async (request, response) => { 
    try {
        await Validations.isValidBody(request.body)
        const result = await BookModel.editBook(request.body)
        let message = ''
        if(result.changes == 0) {
            message = 'O código isbn informado não está registrado à nenhum livro. Nenhuma alteração foi feita'
        } else {
            message = 'Livro editado com sucesso'
        }
        response.status(200).json({message})
    } catch (error) {
        errorMessageFormatter(response, error, 'controller :: editBook')
    }
}

export const deleteBookByISBN = async (request, response) => {
    try {
        await Validations.isValidISBNParam(request?.params)
        const result = await BookModel.deleteBookByISBN(request.params.isbn)
        let message = ''
        if(result.changes == 0) {
            message = 'O código isbn informado não está registrado à nenhum livro. Nenhuma alteração foi feita'
        } else {
            message = 'Livro deletado com sucesso'
        }
        response.status(200).json({message})
    } catch (error) {
        errorMessageFormatter(response, error, 'controller :: deleteBookByISBN')
    }
}