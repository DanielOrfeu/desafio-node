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
            if (error.code && error.code == 'SQLITE_CONSTRAINT'){
                response.status(409).json(error)
            } else {
                response.status(500).json(error)
            }
        })
    }
}

export const listBooks = async (_, response) => {
    //TODO paginação
    await BookModel.listBooks()
    .then((result) => {
        response.status(200).json(result)
    })
    .catch((error) => {
        response.status(500).json(error)
    })
}

export const getBookDetails = async (request, response) => {
    if(!request?.params?.sbn) {
        response.status(400).json({
            message: 'controller :: getBookDetails :: Código sbn obrigatório para obter detalhes do livro',
        })
    } else {
        await BookModel.getBookDetails(request.params.sbn)
        .then((result) => {
            if (result.length == 0) {
                response.status(200).json({
                    'message': 'Não foi encontranho nenhum livro com o sbn informado'
                })
            } else {
                response.status(200).json(result)
            }
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
                message = 'O código sbn informado não está registrado à nenhum livro. Nenhuma alteração foi feita'
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
    if(!request?.params?.sbn) {
        response.status(400).json({
            message: 'controller :: deleteBook :: Código sbn obrigatório para deleção',
        })
    } else {
        await BookModel.deleteBook(request.params.sbn)
        .then((result) => {
            let message = ''
            if(result.changes == 0) {
                message = 'O código sbn informado não está registrado à nenhum livro. Nenhuma alteração foi feita'
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