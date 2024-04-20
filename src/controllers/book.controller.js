import * as BookModel from '../models/book.model.js'

export const addBook = async (request, response) => {
    if(Object.keys(request?.body).length == 0) {
        response.status(400).json({
            message: 'controller :: addBook :: Corpo da requestuisição inválido ou inexistente',
        })
    } else {
        await BookModel.addBook(request.body)
        .then((_) => {
            response.status(200).json({
                'message': 'Livro cadastrado com sucesso'
            })
        })
        .catch((error) => {
            response.status(error.code && error.code == 'SQLITE_CONSTRAINT' ? 409 : 500).json(error)
        })
    }
}

export const listBooks = async (request, response) => {
    const { page = 1, size = 5 } = request?.query
    
    if(isNaN(page) || isNaN(size) || page == 0 || size == 0) {
        response.status(400).json({
            message: 'controller :: listBooks :: os parâmetros page e/ou size são inválidos.',
        })
    } else {
        await BookModel.listBooks(page, size)
        .then((result) => {
            response.status(200).json(result)
        })
        .catch((error) => {
            response.status(500).json(error)
        })
    }
}

export const getBookByISBN = async (request, response) => {
    if(!request?.params?.isbn) {
        response.status(400).json({
            message: 'controller :: getBookByISBN :: Código isbn obrigatório para obter detalhes do livro',
        })
    } else {
        await BookModel.getBookByISBN(request.params.isbn)
        .then((result) => {
            response.status(200).json(result)
        })
        .catch((error) => {
            response.status(500).json(error)
        })
    }
}

export const editBook = async (request, response) => {    
    if(Object.keys(request?.body).length == 0) {
        response.status(400).json({
            message: 'controller :: editBook :: Corpo da requestuisição inválido ou inexistente',
        })
    } else {
        await BookModel.editBook(request.body)
        .then((result) => {
            let message = ''
            if(result.changes == 0) {
                message = 'O código isbn informado não está registrado à nenhum livro. Nenhuma alteração foi feita'
            } else {
                message = 'Livro editado com sucesso'
            }
            response.status(200).json({
                'message': message
            })
        })
        .catch((error) => {
            response.status(500).json(error)
        })
    }

}

export const deleteBook = async (request, response) => {
    if(!request?.params?.isbn) {
        response.status(400).json({
            message: 'controller :: deleteBook :: Código isbn obrigatório para deleção',
        })
    } else {
        await BookModel.deleteBook(request.params.isbn)
        .then((result) => {
            let message = ''
            if(result.changes == 0) {
                message = 'O código isbn informado não está registrado à nenhum livro. Nenhuma alteração foi feita'
            } else {
                message = 'Livro deletado com sucesso'
            }
            response.status(200).json({
                'message': message
            })
        })
        .catch((error) => {
            response.status(500).json(error)
        })
    }
}