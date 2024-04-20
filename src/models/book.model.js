import { openDb } from "../db.config.js"

export const createBookTable = async () => {
    //name UNIQUE para buscar livros
    openDb()
    .then((db) => {
        db.exec(
            `CREATE TABLE IF NOT EXISTS Books (
                sbn INTEGER PRIMARY KEY NOT NULL,
                description TEXT NOT NULL, 
                author TEXT NOT NULL, 
                stock INTEGER NOT NULL,
                name TEXT NOT NULL
            )`
        )
        .catch((_) => {
            console.log('erro ao executar criação da tabela de livros!')
        })
    })
}

export const addBook = async (book) => {

    let invalidProp = Object.values(book).some((value) => {
        return !value
    })

    if (invalidProp) {
        throw {
            message: 'model :: addBook :: Há propriedades ausentes/inválidas na requisição'
        }
    }

    const { sbn, name, description, author, stock } = book
    /*TODO: 
        props faltando, 
        props extras,
        nome duplicado
    */
    return await openDb()
    .then((db) => {
        return db.run(
            `INSERT INTO Books (sbn, name, description, author, stock)
            VALUES (?, ?, ?, ?, ?)`,
            [sbn, name.trim(), description.trim(), author.trim(), stock]
        )
        .catch((error) => {
            if (error.code && error.code == 'SQLITE_CONSTRAINT'){
                throw {
                    message: 'model :: addBook :: Já existe um livro com a mesma SBN cadastrada',
                    ...error,
                }
            } else {
                throw {
                    message: 'model :: addBook :: erro ao cadastrar livro',
                    ...error,
                }
            }
        })
    })
    .catch((error) => {
        throw {
            message: 'model :: addBook :: erro ao conectar-se ao banco de dados',
            ...error,
        }
    })
}

export const listBooks = async () => {
    //TODO paginação; apenas nome no select
    return await openDb()
    .then((db) => {
        return db.all(
            `SELECT * FROM Books`
        )
        .then((result) => {
            return result
        })
        .catch((error) => {
            throw {
                message: 'model :: listBooks :: erro ao listar os livros cadastrados',
                ...error,
            }
        })
    })
    .catch((error) => {
        throw {
            message: 'model :: listBooks :: erro ao conectar-se ao banco de dados',
            ...error,
        }
    })
}

export const getBookDetails = async (sbn) => {
    return await openDb()
    .then((db) => {
        return db.all(
            `SELECT * FROM Books
            WHERE sbn=?`,
            [sbn]
        )
        .then((result) => {
            return result
        })
        .catch((error) => {
            throw {
                message: 'model :: getBookDetails :: erro ao listar detalhes do livro',
                ...error,
            }
        })
    })
    .catch((error) => {
        throw {
            message: 'model :: getBookDetails :: erro ao conectar-se ao banco de dados',
            ...error,
        }
    })
}

export const editBook = async (book) => {
    const { sbn, name, description, author, stock } = book

    return await openDb()
    .then((db) => {
        return db.run(
            `UPDATE Books 
            SET name=?, description=?, author=?, stock=? 
            WHERE sbn=? AND EXISTS (SELECT 1 FROM Books WHERE sbn=?)`,
            [name.trim(), description.trim(), author.trim(), stock, sbn, sbn]
        )
        .catch((error) => {
            throw {
                message: 'model :: editBook :: erro ao editar o livro cadastrado',
                ...error,
            }
        })
    })
    .catch((error) => {
        throw {
            message: 'model :: editBook :: erro ao conectar-se ao banco de dados',
            ...error,
        }
    })
}

export const deleteBook = async (sbn) => {
    return await openDb()
    .then((db) => {
        return db.run(
            `DELETE FROM Books  
            WHERE sbn=?`,
            [sbn]
        )
        .catch((error) => {
            throw {
                message: 'model :: deleteBook :: erro ao deletar o livro cadastrado',
                ...error,
            }
        })
    })
    .catch((error) => {
        throw {
            message: 'model :: deleteBook :: erro ao conectar-se ao banco de dados',
            ...error,
        }
    })
}