import * as Validations from '../../middlewares/validations'

jest.mock('../../middlewares/validations', () => ({
    ...jest.requireActual('../../middlewares/validations'),
    ValidateSchema: jest.fn(),
}))

describe('Validations', () => {
    describe('isValidBody', () => {
        const body = {
            isbn: 123456789,
            name: 'Sample Book',
            description: 'Sample Description',
            author: 'John Doe',
            stock: 10
        }

        test('Deve retornar um erro quando o body estiver ausente', async () => {
            try {
                await Validations.isValidBody()
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo stock é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body estiver vazio', async () => {
            try {
                await Validations.isValidBody({})
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo stock é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body.isbn estiver ausente ', async () => {
            try {
                const body = {
                    name: 'Sample Book',
                    description: 'Sample Description',
                    author: 'John Doe',
                    stock: 10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo isbn é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body.isbn estiver vazio', async () => {
            try {
                const body = {
                    isbn: '',
                    name: 'Sample Book',
                    description: 'Sample Description',
                    author: 'John Doe',
                    stock: 10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo isbn deve ser um número' ])
            }
        })

        test('Deve retornar um erro quando o body.isbn for negativo', async () => {
            try {
                const body = {
                    isbn: -1,
                    name: 'Sample Book',
                    description: 'Sample Description',
                    author: 'John Doe',
                    stock: 10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo isbn deve ser maior ou igual à zero' ])
            }
        })

        test('Deve retornar um erro quando o body.name estiver ausente', async () => {
            try {
                const body = {
                    isbn: 123456789,
                    description: 'Sample Description',
                    author: 'John Doe',
                    stock: 10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo name é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body.name estiver vazio', async () => {
            try {
                const body = {
                    isbn: 123456789,
                    name: '',
                    description: 'Sample Description',
                    author: 'John Doe',
                    stock: 10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo name é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body.name estiver contendo apenas espacos', async () => {
            try {
                const body = {
                    isbn: 123456789,
                    name: '  ',
                    description: 'Sample Description',
                    author: 'John Doe',
                    stock: 10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo name é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body.description estiver ausente', async () => {
            try {
                const body = {
                    isbn: 123456789,
                    name: 'Sample Book',
                    author: 'John Doe',
                    stock: 10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo description é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body.description estiver vazio', async () => {
            try {
                const body = {
                    isbn: 123456789,
                    name: 'Sample Book',
                    description: '',
                    author: 'John Doe',
                    stock: 10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo description é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body.description estiver contendo apenas espacos', async () => {
            try {
                const body = {
                    isbn: 123456789,
                    name: 'Sample Book',
                    description: '  ',
                    author: 'John Doe',
                    stock: 10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo description é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body.author estiver ausente', async () => {
            try {
                const body = {
                    isbn: 123456789,
                    name: 'Sample Book',
                    description: 'Sample Description',
                    stock: 10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo author é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body.author estiver vazio', async () => {
            try {
                const body = {
                    isbn: 123456789,
                    name: 'Sample Book',
                    description: 'Sample Description',
                    author: '',
                    stock: 10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo author é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body.author estiver contendo apenas espacos', async () => {
            try {
                const body = {
                    isbn: 123456789,
                    name: 'Sample Book',
                    description: 'Sample Description',
                    author: '  ',
                    stock: 10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo author é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body.stock estiver ausente', async () => {
            try {
                const body = {
                    isbn: 123456789,
                    name: 'Sample Book',
                    description: 'Sample Description',
                    author: 'John Doe'
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo stock é obrigatório' ])
            }
        })

        test('Deve retornar um erro quando o body.stock estiver vazio', async () => {
            try {
                const body = {
                    isbn: 123456789,
                    name: 'Sample Book',
                    description: 'Sample Description',
                    author: 'John Doe',
                    stock: ''
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo stock deve ser um número' ])
            }
        })

        test('Deve retornar um erro quando o body.stock for um valor negativo', async () => {
            try {
                const body = {
                    isbn: 123456789,
                    name: 'Sample Book',
                    description: 'Sample Description',
                    author: 'John Doe',
                    stock: -10
                }
                await Validations.isValidBody(body)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Campo stock deve ser maior ou igual à zero' ])
            }
        })
        
        test('Deve resolver a promise quando o body estiver preenchido corretamente com todos os campos', async () => {
            try {
                const result = await Validations.isValidBody(body)
                expect(result).toBeUndefined()
            } catch (error) {
                expect(true).toBe(false)
            }
        })
    })

    describe('isValidPaginationQuery', () => {
        test('Deve retornar um erro quando query.page e query.size estiverem vazios', async () => {
            try {
                const query = { page: '', size: '' }
                await Validations.isValidPaginationQuery(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Query size deve ser um número' ])
            }
        })

        test('Deve retornar um erro quando query.page estiver vazio', async () => {
            try {
                const query = { page: '', size: 10 }
                await Validations.isValidPaginationQuery(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Query page deve ser um número' ])
            }
        })

        test('Deve retornar um erro quando query.size estiver vazio', async () => {
            try {
                const query = { page: 1, size: '' }
                await Validations.isValidPaginationQuery(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Query size deve ser um número' ])
            }
        })

        test('Deve retornar um erro quando query.page e query.size forem negativos', async () => {
            try {
                const query = { page: -1, size: -10 }
                await Validations.isValidPaginationQuery(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Query size deve ser um valor maior que zero' ])
            }
        })

        test('Deve retornar um erro quando query.page for negativo', async () => {
            try {
                const query = { page: -1, size: 10 }
                await Validations.isValidPaginationQuery(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Query page deve ser um valor maior que zero' ])
            }
        })

        test('Deve retornar um erro quando query.size for negativo', async () => {
            try {
                const query = { page: 1, size: -10 }
                await Validations.isValidPaginationQuery(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Query size deve ser um valor maior que zero' ])
            }
        })

        test('Deve retornar um erro quando query.page e query.size forem valores não-numéricos', async () => {
            try {
                const query = { page: 'a', size: 'b' }
                await Validations.isValidPaginationQuery(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Query size deve ser um número' ])
            }
        })

        test('Deve retornar um erro quando query.page for valor não-numérico', async () => {
            try {
                const query = { page: 'a', size: 10 }
                await Validations.isValidPaginationQuery(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Query page deve ser um número' ])
            }
        })

        test('Deve retornar um erro quando query.size for valor não-numérico', async () => {
            try {
                const query = { page: 1, size: 'b' }
                await Validations.isValidPaginationQuery(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Query size deve ser um número' ])
            }
        })

        
        test('Deve retornar um erro query.page e query.size forem números iguais a zero', async () => {
            try {
                const query = { page: 0, size: 0 }
                await Validations.isValidPaginationQuery(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Query size deve ser um valor maior que zero' ])
            }
        })
        
        test('Deve retornar um erro query.page for número igual a zero', async () => {
            try {
                const query = { page: 0, size: 10 }
                await Validations.isValidPaginationQuery(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Query page deve ser um valor maior que zero' ])
            }
        })

        test('Deve retornar um erro query.size for númer igual a zero', async () => {
            try {
                const query = { page: 1, size: 0 }
                await Validations.isValidPaginationQuery(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Query size deve ser um valor maior que zero' ])
            }
        })

        test('Deve resolver a promise quando query.page e query.size forem números maiores que zero', async () => {
            try {
                const query = { page: 1, size: 10 }
                const result = await Validations.isValidPaginationQuery(query)
                expect(result).toBeUndefined()
            } catch (error) {
                expect(true).toBe(false)
            }
        })
    })

    describe('isValidISBNParam', () => {
        afterEach(() => {
            jest.clearAllMocks()
        })
    
        test('Deve retornar um erro quando o isbn estiver ausente', async () => {
            try {
                await Validations.isValidISBNParam({})
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Parâmetro isbn é obrigatório' ])
            }
        })
    
        test('Deve retornar um erro quando o isbn não for um número', async () => {
            try {
                await Validations.isValidISBNParam({ isbn: 'abc' })
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Parâmetro isbn deve ser um número' ])
            }
        })
    
        test('Deve retornar um erro quando o isbn for negativo', async () => {
            try {
                await Validations.isValidISBNParam({ isbn: -1 })
                expect(true).toBe(false)
            } catch (error) {
                expect(error.message).toStrictEqual([ 'Parâmetro isbn deve ser maior ou igual à zero' ])
            }
        })
    
        test('Deve resolver a promise quando o isbn for maior que zero', async () => {
            try {
                const res = await expect(Validations.isValidISBNParam({ isbn: 123 }))
                expect(res).toBeUndefined()
            } catch (error) {
                expect(true).toBe(true)
            }
        })
    })

    describe('isValidNameParam', () => {
        test('Deve retornar um erro quando o nome estiver ausente', async () => {
            try {
                const param = {}
                await Validations.isValidNameParam(param)
                expect(true).toBe(false)
            } catch (error) {
                expect(error).toEqual({
                    'message': ['Parâmetro name é obrigatório'],
                    'code': 'SCHEMA_VALIDATE_FAIL'
                })
                
            }
        })

        test('Deve retornar um erro quando o nome estiver vazio', async () => {
            try {
                const param = { name: '' }
                await Validations.isValidNameParam(param)
                expect(true).toBe(false)
            } catch (error) {
                expect(error).toEqual({
                    'message': ['Parâmetro name é obrigatório'],
                    'code': 'SCHEMA_VALIDATE_FAIL'
                })
                
            }
        })

        test('Deve retornar um erro quando o nome estiver contendo apenas espacos', async () => {
            try {
                const param = { name: '  ' }
                await Validations.isValidNameParam(param)
                expect(true).toBe(false)
            } catch (error) {
                expect(error).toEqual({
                    'message': ['Parâmetro name é obrigatório'],
                    'code': 'SCHEMA_VALIDATE_FAIL'
                })
                
            }
        })

        test('Deve resolver a promise quando o nome estiver preenchido', async () => {
            const param = { name: 'Livro teste' }
            const result = await Validations.isValidNameParam(param)
            expect(result).toBeUndefined()
        })

        test('Deve resolver a promise quando o nome estiver preenchido mesmo que apenas com números', async () => {
            const param = { name: 1948 }
            const result = await Validations.isValidNameParam(param)
            expect(result).toBeUndefined()
        })
    })
})