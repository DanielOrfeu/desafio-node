import * as BookModel from '../../models/book.model.js'
import { openDb } from '../../configs/db.config'

jest.mock('../../configs/db.config.js', () => ({
    openDb: jest.fn(),
}))

describe('createBookTable', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('createBookTable', () => {
        test('Deve executar a criação da tabela com sucesso', async () => {
            const mockDb = {
                exec: jest.fn(),
            }
            openDb.mockResolvedValue(mockDb)
            await BookModel.createBookTable()
            expect(openDb).toHaveBeenCalled()
        })
    
        test('Deve gerar erro ao executar a criação da tabela', async () => {
            try {
                await BookModel.createBookTable()
                expect(openDb).toHaveBeenCalled()
            } catch (error) {
                expect(error).toEqual({
                    message: 'model :: createBookTable :: Erro ao executar criação da tabela de livros!'
                })
            }
        })
    })

    describe('addBook', () => {
        test('Deve executar a inserção do livro com sucesso', async () => {
            const mockDb = {
                run: jest.fn(),
            }
            openDb.mockResolvedValue(mockDb)
            await BookModel.addBook({
                isbn: 1,
                name: 'name',
                description: 'description',
                author: 'author',
                stock: 1
            })
            expect(mockDb.run).toHaveBeenCalled()
        })

        test('Deve gerar erro ao executar a inserção do livro', async () => {
            const mockDb = {
                run: jest.fn().mockRejectedValue(new Error('Internal server error')),
            }
            openDb.mockResolvedValue(mockDb)
            try {
                await BookModel.addBook({
                    isbn: 1,
                    name: 'name',
                    description: 'description',
                    author: 'author',
                    stock: 1
                })
                expect(mockDb.run).toHaveBeenCalled()
            } catch (error) {
                expect(error).toEqual({
                    message: 'model :: addBook :: Erro ao cadastrar livro',
                })
            }
        })

        test('Deve gerar erro ao executar a inserção do livro devido ao erro de SQLITE_CONSTRAINT', async () => {
            const mockDb = {
                run: jest.fn().mockRejectedValue({ code: 'SQLITE_CONSTRAINT', errno: 19 }),
            }
            openDb.mockResolvedValue(mockDb)
            try {
                await BookModel.addBook({
                    isbn: 1,
                    name: 'name',
                    description: 'description',
                    author: 'author',
                    stock: 1
                })
                expect(mockDb.run).toHaveBeenCalled()
            } catch (error) {
                expect(error).toEqual({
                    message: 'model :: addBook :: Já existe um livro com a mesma isbn cadastrada',
                    errno: 19,
                    code: 'SQLITE_CONSTRAINT'
                })
            }
        })
    })

    describe('listBooks', () => {
        test('Deve executar a listagem dos livros com sucesso (busca de livros com estoque)', async () => {
            const mockDb = {
                all: jest.fn().mockResolvedValue([
                    {
                        name: 'Sample Book',
                    },
                    {
                        name: 'Outro livro',
                    },
                ]),
            }
            openDb.mockResolvedValue(mockDb)
            await BookModel.listBooks(1, 5, false)
            expect(mockDb.all).toHaveBeenCalled()
        })

        test('Deve executar a listagem dos livros com sucesso (busca de livros sem estoque)', async () => {
            const mockDb = {
                all: jest.fn().mockResolvedValue([
                    {
                        name: 'Sem estoque',
                    },
                ]),
            }
            openDb.mockResolvedValue(mockDb)
            await BookModel.listBooks(0, 5, true)
            expect(mockDb.all).toHaveBeenCalled()
        })

        test('Deve retornar uma lista vazia de livros', async () => {
            const mockDb = {
                all: jest.fn().mockResolvedValue([]),
            }
            openDb.mockResolvedValue(mockDb)
            await BookModel.listBooks(1, 5)
            expect(mockDb.all).toHaveBeenCalled()
        })

        test('Deve gerar erro ao executar a listagem dos livros', async () => {
            const mockDb = {
                all: jest.fn().mockRejectedValue(new Error('Internal server error')),
            }
            openDb.mockResolvedValue(mockDb)
            try {
                await BookModel.listBooks(1, 5)
                expect(mockDb.all).toHaveBeenCalled()
            } catch (error) {
                expect(error).toEqual({"message": "model :: listBooks :: Erro ao listar livros"})
            }
        })
    })

    describe('getBookByUniqueParam', () => {
        test('Deve retornar uma lista de dados dos livros (busca por nome do livro)', async () => {
            const mockDb = {
                all: jest.fn().mockResolvedValue([
                    {
                        isbn: 1,
                        name: 'Um título muito legal',
                        description: 'description',
                        author: 'author',
                        stock: 1
                    },
                    {
                        isbn: 12,
                        name: 'Outro título muito legal',
                        description: 'description',
                        author: 'author',
                        stock: 1
                    }
                ]),
            }
            openDb.mockResolvedValue(mockDb)
            await BookModel.getBookByUniqueParam('legal', true)
            expect(mockDb.all).toHaveBeenCalled()
        })

        test('Deve retornar uma lista vazia de dados dos livros (busca por nome do livro)', async () => {
            const mockDb = {
                all: jest.fn().mockResolvedValue([]),
            }
            openDb.mockResolvedValue(mockDb)
            await BookModel.getBookByUniqueParam('legal', true)
            expect(mockDb.all).toHaveBeenCalled()
        })
        
        test('Deve gerar erro ao executar a listagem dos livros (busca por nome do livro)', async () => {
            const mockDb = {
                all: jest.fn().mockRejectedValue(new Error('Internal server error')),
            }
            openDb.mockResolvedValue(mockDb)
            try {
                await BookModel.getBookByUniqueParam('legal', true)
                expect(mockDb.all).toHaveBeenCalled()
            } catch (error) {
                expect(error).toEqual({"message": "model :: getBookByUniqueParam :: Erro ao listar detalhes do(s) livro(s)"})
            }
        })

        test('Deve retornar os dados dos livros (busca por ISBN do livro)', async () => {
            const mockDb = {
                get: jest.fn().mockResolvedValue({
                    isbn: 1,
                    name: 'Um título muito legal',
                    description: 'description',
                    author: 'author',
                    stock: 1
                }),
            }
            openDb.mockResolvedValue(mockDb)
            await BookModel.getBookByUniqueParam(1, false)
            expect(mockDb.get).toHaveBeenCalled()
        })

        test('Deve retornar sem resultados ("") (busca por ISBN do livro)', async () => {
            const mockDb = {
                get: jest.fn().mockResolvedValue(""),
            }
            openDb.mockResolvedValue(mockDb)
            await BookModel.getBookByUniqueParam(1, false)
            expect(mockDb.get).toHaveBeenCalled()
        })

        test('Deve gerar erro ao executar a listagem dos livros (busca por ISBN do livro)', async () => {
            const mockDb = {
                get: jest.fn().mockRejectedValue(new Error('Internal server error')),
            }
            openDb.mockResolvedValue(mockDb)
            try {
                await BookModel.getBookByUniqueParam(1, false)
                expect(mockDb.get).toHaveBeenCalled()
            } catch (error) {
                expect(error).toEqual({"message": "model :: getBookByUniqueParam :: Erro ao listar detalhes do(s) livro(s)"})
            }
        })

    })

    describe('editBook', () => {
        test('Deve atualizar os dados de um livro com sucesso', async () => {
            const mockDb = {
                run: jest.fn(),
            }
            openDb.mockResolvedValue(mockDb)
            await BookModel.editBook(1, {
                name: 'name',
                description: 'description',
                author: 'author',
                stock: 1
            })
            expect(mockDb.run).toHaveBeenCalled()
        })

        test('Deve gerar erro ao atualizar os dados de um livro', async () => {
            const mockDb = {
                run: jest.fn().mockRejectedValue(new Error('Internal server error')),
            }
            openDb.mockResolvedValue(mockDb)
            try {
                await BookModel.editBook(1, {
                    name: 'name',
                    description: 'description',
                    author: 'author',
                    stock: 1
                })
                expect(mockDb.run).toHaveBeenCalled()
            } catch (error) {
                expect(error).toEqual({"message": "model :: editBook :: Erro ao editar o livro"})
            }
        })
    })

    describe('deleteBook', () => {
        test('Deve deletar um livro com sucesso', async () => {
            const mockDb = {
                run: jest.fn(),
            }
            openDb.mockResolvedValue(mockDb)
            await BookModel.deleteBookByISBN(1)
            expect(mockDb.run).toHaveBeenCalled()
        })

        test('Deve gerar erro ao deletar um livro', async () => {
            const mockDb = {
                run: jest.fn().mockRejectedValue(new Error('Internal server error')),
            }
            openDb.mockResolvedValue(mockDb)
            try {
                await BookModel.deleteBookByISBN(1)
                expect(mockDb.run).toHaveBeenCalled()
            } catch (error) {
                expect(error).toEqual({"message": "model :: deleteBookByISBN :: Erro ao deletar o livro"})
            }
        })
    })
})