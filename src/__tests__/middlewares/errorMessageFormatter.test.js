import { errorMessageFormatter } from '../../middlewares/errorMessageFormatter'

describe('errorMessageFormatter', () => {
  let response

  beforeEach(() => {
    response = { status: jest.fn(), json: jest.fn() }
    response.status = jest.fn().mockReturnValue(response)
    response.json = jest.fn().mockReturnValue(response)
  })

  test('Deve retornar objeto com status 409 e code SQLITE_CONSTRAINT ', () => {
    const error = { code: 'SQLITE_CONSTRAINT' }
    errorMessageFormatter(response, error)
    expect(response.status).toHaveBeenCalledWith(409)
    expect(response.json).toHaveBeenCalledWith(error)
  })

  test('Deve retornar objeto com status 400, code SCHEMA_VALIDATE_FAIL e mensagem de local desconhecido', () => {
    const error = { code: 'SCHEMA_VALIDATE_FAIL', message: 'Erro ao validar schema' }
    const errorLocation = 'Controller :: addBook'
    errorMessageFormatter(response, error, errorLocation)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Controller :: addBook :: Erro ao validar schema',
    })
  })

  test('Deve retornar objeto com status 400, code SCHEMA_VALIDATE_FAIL e mensagem genérica de local desconhecido', () => {
    const error = { code: 'SCHEMA_VALIDATE_FAIL', message: 'Bad Request' }
    errorMessageFormatter(response, error)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Local desconhecido :: Bad Request',
    })
  })

  test('Deve retornar objeto com status 400, code SCHEMA_VALIDATE_FAIL e mensagem genérica de Campos inválidos', () => {
    const error = { code: 'SCHEMA_VALIDATE_FAIL' }
    const errorLocation = 'Controller :: addBook'
    errorMessageFormatter(response, error, errorLocation)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Controller :: addBook :: Campos inválidos',
    })
  })

  test('Deve retornar erro 500 devido por nào possuir a propriedade code', () => {
    const error = { message: 'Internal server error' }
    errorMessageFormatter(response, error)
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    })
  })
})