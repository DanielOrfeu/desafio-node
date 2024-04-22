export const errorMessageFormatter = (response, error, errorLocation) => {
    const { code = 'NOT_DEFINED', message = 'Internal server error'} = error

    switch (code) {
        case 'SQLITE_CONSTRAINT':
            response.status(409).json(error)
            break
        case 'SCHEMA_VALIDATE_FAIL':
            response.status(400).json({
                message: `${errorLocation || 'Local desconhecido'} :: ${error.message || 'Campos inválidos'}`
            })
            break
        default:
            response.status(500).json({...error, message})
            break
    }
}