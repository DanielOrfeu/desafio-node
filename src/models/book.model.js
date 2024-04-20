import { openDb } from "../db.config.js"

export const createBookTable = async () => {
    openDb()
    .then((db) => {
        db.exec(
            `CREATE TABLE IF NOT EXISTS Books (
                isbn INTEGER PRIMARY KEY NOT NULL,
                description TEXT NOT NULL, 
                author TEXT NOT NULL, 
                stock INTEGER NOT NULL,
                name TEXT NOT NULL UNIQUE
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

    const { isbn, name, description, author, stock } = book
    /*TODO: 
        props faltando, 
        props extras,
        nome duplicado
    */
    return await openDb()
    .then((db) => {
        return db.run(
            `INSERT INTO Books (isbn, name, description, author, stock)
            VALUES (?, ?, ?, ?, ?)`,
            [isbn, name.trim(), description.trim(), author.trim(), stock]
        )
        .catch((error) => {
            if (error.code && error.code == 'SQLITE_CONSTRAINT'){
                throw {
                    message: 'model :: addBook :: Já existe um livro com a mesma isbn e/ou nome cadastrados',
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

export const listBooks = async (page, size) => {
    
    page = Number(page)
    size = Number(size)


    return await openDb()
    .then((db) => {
        return db.all(
            `SELECT COUNT(*) as total FROM Books
            WHERE stock > 0`
        )
        .then((result) => {
            if(result[0]?.total > 0){
                const totalResults = result[0].total
                const offset = (page - 1) * size;
                const totalPages = Math.ceil(totalResults / size);
                const previousPage = page > 1 ? page <= totalPages ? page - 1 : totalPages : null;
                const nextPage = page < totalPages ? page + 1 : null;

                return db.all(
                    `SELECT name FROM Books
                    WHERE stock > 0
                    LIMIT ? OFFSET ?`,
                    [size, offset]
                )
                .then((result) => {
                    return {
                        previousPage,
                        page,
                        nextPage,
                        totalPages,
                        totalResults,
                        'result' : result
                    }
                })
                .catch((error) => {
                    throw {
                        message: 'model :: listBooks :: erro ao listar paginação dos livros cadastrados',
                        ...error,
                    }
                })
            } else {
                return []
            }
        })
        .catch((error) => {
            throw {
                message: 'model :: listBooks :: erro ao consultar quantidade de livros com estoque cadastrados',
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

export const getBookByISBN = async (isbn) => {
    return await openDb()
    .then((db) => {
        return db.get(
            `SELECT * FROM Books
            WHERE isbn=?`,
            [isbn]
        )
        .then((result) => {
            return result
        })
        .catch((error) => {
            throw {
                message: 'model :: getBookByISBN :: erro ao listar detalhes do livro',
                ...error,
            }
        })
    })
    .catch((error) => {
        throw {
            message: 'model :: getBookByISBN :: erro ao conectar-se ao banco de dados',
            ...error,
        }
    })
}

export const editBook = async (book) => {
    const { isbn, name, description, author, stock } = book

    return await openDb()
    .then((db) => {
        return db.run(
            `UPDATE Books 
            SET name=?, description=?, author=?, stock=? 
            WHERE isbn=? AND EXISTS (SELECT 1 FROM Books WHERE isbn=?)`,
            [name.trim(), description.trim(), author.trim(), stock, isbn, isbn]
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

export const deleteBook = async (isbn) => {
    return await openDb()
    .then((db) => {
        return db.run(
            `DELETE FROM Books  
            WHERE isbn=?`,
            [isbn]
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