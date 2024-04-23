import request from "supertest"
import app from "../../app"

const body = {
    isbn: 999999999,
    name: 'Mock Book',
    description: 'description',
    author: 'author',
    stock: 12
}

describe('Router', () => {
    beforeAll(async () => {
        await request(app).delete('/book/999999999')
        await request(app).delete('/book/10000000')
    })
    describe('addBook', () => {        
        test('Deve retornar status 200 na rota de adicionar livros', async () => {
            const response = await request(app).post('/book').send(body)
            expect(response.status).toBe(200)
            expect(response.body).toStrictEqual({
                message: 'Livro cadastrado com sucesso.'
            })
        })
    
        test('Deve retornar status 409 ao tentar adicionar um livro com isbn já existente', async () => {
            const response = await request(app).post('/book').send(body)
            expect(response.status).toBe(409)
            expect(response.body).toStrictEqual({
                "code": "SQLITE_CONSTRAINT",
                "errno": 19,
                "message": "model :: addBook :: Já existe um livro com a mesma isbn cadastrada"
            })
        })
    })

    describe('editBook', () => {
        test('Deve retornar status 200 na rota de editar livros', async () => {
            const bodyCopy = {
                ...body,
                name: 'Titulo editado'
            }

            const response = await request(app).put('/book').send(body)
            expect(response.status).toBe(200)
            expect(response.body).toStrictEqual({
                message: 'Livro editado com sucesso'
            })
        })

        test('Deve retornar status 200, mas sem alterações, ao tentar editar um livro que não existe', async () => {
            const bodyCopy = {
                ...body,
                isbn: 10000000
            }

            const response = await request(app).put('/book').send(bodyCopy)
            expect(response.status).toBe(200)
            expect(response.body).toStrictEqual({
                message: 'O código isbn informado não está registrado à nenhum livro. Nenhuma alteração foi feita'
            })
        })

        test('Deve retonar status 400 ao tentar editar um livro com um ISBN inválido', async () => {
            const bodyCopy = {
                ...body,
                isbn: 'string'
            }

            const response = await request(app).put('/book').send(bodyCopy)
            expect(response.status).toBe(400)
            expect(response.body).toStrictEqual({
                "message": "controller :: editBook :: Campo isbn deve ser um número"
            })
        })
    })

    describe('getBooks', () => {
        test('Deve retornar status 200 na rota de buscar livros', async () => {
            const response = await request(app).get('/books')
            expect(response.status).toBe(200)
        })

        test('Deve retornar status 200 na rota de buscar livros fora de estoque', async () => {
            const response = await request(app).get('/books/out-of-stock')
            expect(response.status).toBe(200)
        })

        test('Deve retornar 400 ao informar um parametro inválido', async () => {
            const response = await request(app).get('/books?size=string')
            expect(response.status).toBe(400)
            expect(response.body).toStrictEqual({
                "message": "controller :: listBooks :: Query size deve ser um número"
            })
        })
    })

    describe('getBookByISBN', () => {
        test('Deve retornar status 200 na rota de buscar livros', async () => {
            const response = await request(app).get('/book/isbn/999999999')
            expect(response.status).toBe(200)
        })

        test('Deve retornar 400 ao informar um ISBN inválido', async () => {
            const response = await request(app).get('/book/isbn/string')
            expect(response.status).toBe(400)
            expect(response.body).toStrictEqual({
                "message": "controller :: getBookByISBN :: Parâmetro isbn deve ser um número"
            })
        })
    })

    describe('getBookByName', () => {
        test('Deve retornar status 200 na rota de buscar livros', async () => {
            const response = await request(app).get('/book/name/Teste de Livro')
            expect(response.status).toBe(200)
        })
    })

    describe('deleteBookByISBN', () => {
        test('Deve retornar status 200 na rota de deletar livros', async () => {
            const response = await request(app).delete('/book/999999999')
            expect(response.status).toBe(200)
            expect(response.body).toStrictEqual({
                "message": "Livro deletado com sucesso"
            })
        })

        test('Deve retornar status 200, mas sem alterações, ao tentar deletar um livro que não existe', async () => {
            const response = await request(app).delete('/book/10000000')
            expect(response.status).toBe(200)
            expect(response.body).toStrictEqual({
                "message": "O código isbn informado não está registrado à nenhum livro. Nenhuma alteração foi feita"
            })
        })

        test('Deve retornar 400 ao informar um ISBN inválido', async () => {
            const response = await request(app).delete('/book/string')
            expect(response.status).toBe(400)
            expect(response.body).toStrictEqual({
                "message": "controller :: deleteBookByISBN :: Parâmetro isbn deve ser um número"
            })
        })
        
    })

    describe('Outros', () => {
        test('Deve retornar status 200 na rota raiz', async () => {
            const response = await request(app).get('/')
            expect(response.status).toBe(200)
            expect(response.body).toStrictEqual({message: 'OK'})
        })

        test('Deve retornar 404 informando uma rota inexistente', async () => {
            const response = await request(app).get('/404')
            expect(response.status).toBe(404)
        })
    })
})