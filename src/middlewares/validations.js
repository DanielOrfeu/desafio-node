import * as yup from 'yup'

const ValidateSchema = async (shape, itemToValidate) => {
    const schema = yup.object().shape(shape)

    try {
        await schema.validate(itemToValidate)
    } catch (error) {
        throw {
            'message': error.errors,
            'code': "SCHEMA_VALIDATE_FAIL"
        }
    }
}

export const isValidBody = async (body) => {
    const shape = {
        isbn: 
            yup.number().typeError('Campo isbn deve ser um número')
            .min(0, 'Campo isbn deve ser maior ou igual à zero')
            .required('Campo isbn é obrigatório'),
        name:
            yup.string()
            .trim()
            .required('Campo name é obrigatório'),
        description:
            yup.string()
            .trim()
            .required('Campo description é obrigatório'),
        author:
            yup.string()
            .trim()
            .required('Campo author é obrigatório'),
        stock: 
            yup.number().typeError('Campo stock deve ser um número')
            .min(0, 'Campo stock deve ser maior ou igual à zero')
            .required('Campo stock é obrigatório'),
    }

    return await ValidateSchema(shape, body)
}

export const isValidPaginationQuery = async (query) => {
    const shape = {
        page:   
            yup.number().typeError('Query page deve ser um número')
            .positive('Query page deve ser um valor maior que zero'),
        size:
            yup.number().typeError('Query size deve ser um número')
            .positive('Query size deve ser um valor maior que zero')
    }

    return await ValidateSchema(shape, query)
}

export const isValidISBNParam = async (param) => {    
    const shape = {
        isbn: 
            yup.number().typeError('Parâmetro isbn deve ser um número')
            .min(0, 'Parâmetro isbn deve ser maior ou igual à zero')
            .required('Parâmetro isbn é obrigatório'),
    }

    return await ValidateSchema(shape, param)
}

export const isValidNameParam = async (param) => {
    const shape = {
        name:
            yup.string()
            .trim()
            .required('Parâmetro name é obrigatório'),
    }

    return await ValidateSchema(shape, param)
}