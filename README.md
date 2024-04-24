# Desafio Técnico Backend (NodeJS)

- Criar um microserviço para expor APIs de CRUD de livros

## Requisitos funcionais

- Como usuário gostaria adicionar livros no meu microseviço; Os livros devem conter: ISBN, Nome, Breve Descrição e Autor e Estoque;
- Como usuário gostaria de ver a listagem (apenas os nomes) de livros que eu tenho em estoque de forma paginada;
- Como usuário gostaria de ver todos os detalhes de um livro específico;
- Como usuário gostaria atualizar dados de um livro. ISBN não pode ser alterado;
- Como usuário gostaria de excluir um livro;

## Requisitos não funcionais

- Você deve utilizar o framework Express
- Deve utilzar algum banco de dados (pode ser banco em memória como H2 ou SQLite, porém fique à vontade em utilizar outro banco);
- Para teste utilize o Jest
- Sinta-se livre a utilizar algum outras libs
- Nice to Have: Apresentar o projeto rodando em docker.
- Realize commits (git) constantes de acordo coma progressão das atividades.


## Entrega

- Entrega deve ser feito em um repositório no github.

## Critérios de avaliação

- Entendimento dos requisitos
- Afinidade com a ferramenta utilizada
- Testes unitários
- Estrutura de arquivos
- Padrão de escrita do código
- Utilização de boas práticas
## Documentação da API

#### Retorna mensagem "OK" informando que o backend está  rodando corretamente.

```http
  GET /
```

#### Cadastra um novo livro
- A api não permite o cadastro duplicado da propriedade isbn.
```http
  POST /book
```
| Body   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `isbn`      | `number` | **Obrigatório**. O código ISBN do livro|
| `name`      | `string` | **Obrigatório**. O nome/título do livro|
| `description`      | `string` | **Obrigatório**. Uma breve descrição do livro|
| `author`      | `string` | **Obrigatório**. O autor/escritor do livro |
| `stock`      | `number` | **Obrigatório**. A quantidade em estoque |

#### Edita um novo livro

- A propriedade isbn é usada como busca do item a ser modificado. Sendo assim, não é editável.

```http
  PUT /book
```
| Body   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `isbn`      | `number` | **Obrigatório**. O código ISBN do livro|
| `name`      | `string` | **Obrigatório**. O nome/título do livro|
| `description`      | `string` | **Obrigatório**. Uma breve descrição do livro|
| `author`      | `string` | **Obrigatório**. O autor/escritor do livro |
| `stock`      | `number` | **Obrigatório**. A quantidade em estoque |

#### Obtém os livros com estoque disponível cadastrados

- Caso algum item da query não seja informado, o sistema irá definir por padrão: página 1 e tamanho 5.
```http
  GET /books?size={size}&page={page}
```
| Query   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `size`      | `number` | Quantidade de itens por página|
| `page`      | `number` | A página com a lista de livros a ser exibida|

#### Obtém os livros sem estoque disponível cadastrados

- Caso algum item da query não seja informado, o sistema irá definir por padrão: página 1 e tamanho 5.
```http
  GET /books/out-of-stock?size={size}&page={page}
```
| Query   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `size`      | `number` | Quantidade de itens por página|
| `page`      | `number` | A página com a lista de livros a ser exibida|

#### Obtém o(s) livro(s) baseado no nome

- A busca leva em conta que o termo esteja contido no nome, não o nome exato
```http
  GET /book/name/{name}
```
| Param   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `name`      | `string` | **Obrigatório**. O nome/título do livro|

#### Obtém o livro baseado no isbn

```http
  GET /book/isbn/{isbn}
```
| Param   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `isbn`      | `number` | **Obrigatório**. O código ISBN do livro|


#### Deleta o livro baseado no isbn

```http
  DELETE /book/{isbn}
```
| Param   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `isbn`      | `number` | **Obrigatório**. O código ISBN do livro|


## Excecução  local do projeto

Clone o projeto

```bash
  git clone https://github.com/DanielOrfeu/desafio-node.git
```

Entre no diretório do projeto

```bash
  cd desafio-node
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm run start
```

- OBS: Desenvolvido com node v20.11.1. Versões anteriores podem causar erros ou instabilidades
## Execução local via container (Docker)

```bash
  cd desafio-node
  docker build -t desafio-node .
  docker run -dp 127.0.0.1:3333:3333 desafio-node
```
    
## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm run test
```


## Dependências utilizadas

**Dependências:** Express, CORS, dotenv, sqlite, yup

**Dependências de desenvolvimento:**  Babel, Jest, Supertest, Nodemon


## Autores

- [Daniel Orfeu](https://github.com/DanielOrfeu/)

