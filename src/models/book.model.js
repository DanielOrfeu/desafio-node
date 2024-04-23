import { openDb } from "../configs/db.config.js"

export const createBookTable = async () => {
    try {
        const db = await openDb()
        await db.exec(
            `CREATE TABLE IF NOT EXISTS Books (
                isbn INTEGER PRIMARY KEY NOT NULL,
                description TEXT NOT NULL, 
                author TEXT NOT NULL, 
                stock INTEGER NOT NULL,
                name TEXT NOT NULL
            )`
        )
    } catch (error) {
        throw {
            message: 'model :: createBookTable :: Erro ao executar criação da tabela de livros!'
        }
    }
}

export const addBook = async (book) => {
    try {
        const { isbn, name, description, author, stock } = book
        const db = await openDb()
        await db.run(
            `INSERT INTO Books (isbn, name, description, author, stock)
            VALUES (?, ?, ?, ?, ?)`,
            [isbn, name, description, author, stock]
        )
    } catch (error) {
        let message = 'model :: addBook :: '
        if (error.code && error.code == 'SQLITE_CONSTRAINT'){
            message = `${message}Já existe um livro com a mesma isbn cadastrada`
        } else {
            message = `${message}Erro ao cadastrar livro`
        }

        throw {
            ...error,
            message,
        }
    }
}

export const listBooks = async (page, size, showOutOfStock) => {  
    const where = showOutOfStock ? 'WHERE stock = 0' : 'WHERE stock > 0'
    
    try {
        page = Number(page)
        size = Number(size)
        const db = await openDb()
        const countResult = await db.all(
            `SELECT COUNT(*) as total FROM Books
            ${where}`
        )
        if(countResult[0]?.total > 0){
    
            const totalResults = countResult[0].total
            const offset = (page - 1) * size
            const totalPages = Math.ceil(totalResults / size)
            const previousPage = page > 1 ? page <= totalPages ? page - 1 : totalPages : null
            const nextPage = page < totalPages ? page + 1 : null
    
            const result = await db.all(
                `SELECT name FROM Books
                ${where}
                LIMIT ? OFFSET ?`,
                [size, offset]
            )
    
            return {
                previousPage,
                page,
                nextPage,
                totalPages,
                totalResults,
                result
            }
        } else {
            return []
        }
    } catch (error) {
        throw {
            message: 'model :: listBooks :: Erro ao listar livros',
            ...error,
        }
    }
}

export const getBookByUniqueParam = async (param, isText) => {
    try {  
        const db = await openDb()

        if (isText) {
            return await db.all(
                `SELECT * FROM Books
                WHERE name LIKE '%${param}%'`
            )
        } else {
            return await db.get(
                `SELECT * FROM Books
                WHERE isbn=${param}`
            )
        }
    } catch (error) {
        throw {
            message: 'model :: getBookByUniqueParam :: Erro ao listar detalhes do(s) livro(s)',
            ...error,
        }
    }
}

export const editBook = async (book) => {
    try {
        const { isbn, name, description, author, stock } = book

        const db = await openDb()
        return await db.run(
            `UPDATE Books 
            SET name=?, description=?, author=?, stock=? 
            WHERE isbn=? AND EXISTS (SELECT 1 FROM Books WHERE isbn=?)`,
            [name, description, author, stock, isbn, isbn]
        )
    } catch (error) {
        throw {
            message: 'model :: editBook :: Erro ao editar o livro',
            ...error,
        }
    }
}

export const deleteBookByISBN = async (isbn) => {
    try {
        const db = await openDb()
        return await db.run(
            `DELETE FROM Books  
            WHERE isbn=?`,
            [isbn]
        )
    } catch (error) {
        throw {
            message: 'model :: deleteBookByISBN :: Erro ao deletar o livro',
            ...error,
        }
    }
}