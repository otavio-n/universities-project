# Universities Project

Projeto backend em Node.js e MongoDB. 
O script realiza a leitura de uma API JSON com o nome das universidades e as cadastra em um banco de dados. Também foi implementada uma API REST para listagem, busca, cadastro, atualização e remoção dos dados.

## Como utilizar o projeto

 É esperado que o npm, MongoDB, Node.js, Nodemon e um aplicativo de teste de APIs, Postman por exemplo, já estejam instalados em sua máquina. Seguem instruções de uma das formas de se testar o projeto:
 
- abra uma janela do terminal para executar o servidor `mongod`;
- em outra janela do terminal, é possível verificar seus bancos de dados através do `mongo` shell;
-  em uma terceira janela do terminal, inicie o script (a linha de comando deve estar dentro do arquivo do script): 
``
nodemon app.js
``
- a mensagem `Server is running on port 3000.` deve aparecer.

### Cadastro das universidades no banco de dados

- abra o aplicativo de teste de APIs e envie um 'GET request' no servidor local: ``localhost:3000``
- mensagens com os oito países requisitados com seus respectivos códigos de resposta devem aparecer:
```
argentina 200
brazil 200
chile 200
colombia 200
paraguay 200
peru 200
suriname 200
uruguay 200
Finished!
``` 
- no 'mongo shell' é possível verificar o novo banco de dados ``universitiesDB`` e sua collection ``universities``:
```
## comandos
show dbs
use universitiesDB
show collections
```
Obs.: Repare que os nomes dos países devem estar em inglês. 

API para busca dos dados: http://universities.hipolabs.com/search?country=uruguay

### Requisitos API REST

#### Listagem
- no aplicativo de teste de APIs, envie um 'GET request': ``localhost:3000/universities``
- deverá ser retornado no máximo 20 registros com os campos `_id`, `name`, `country`e `state_province`;
- se desejar, é possível filtrar com o nome do país: `localhost:3000/universities?country=brazil`
- também é possível determinar quantos registros devem ser mostrados, sendo `limit=0` o caso com todas as universidades: `localhost:3000/universities?limit=0`

#### Busca
- no aplicativo de teste de APIs, envie um 'GET request' com a _id do registro: `localhost:3000/universities/:id`
- deverá ser retornado todas as propriedades da universidade com o _id;
- _id's podem ser vistos pelo mongo shell.

#### Cadastro
- no aplicativo de teste de API's, envie um registro 'POST request': `localhost:3000/universities` com os campos:
	- `alpha_two_code` (string - dois caracteres), 
	- `web_pages` (lista com URL's), 
	- `name` (string - nome da universidade), 
	- `country` (string - nome do país), 
	- `domains` (lista de domínios), 
	- `state-province` (string - sigla do estado)
- se não for um registro já existente, a seguinte mensagem será mostrada: `Successfully added new university`
- se for um registro repetido, a seguinte mensagem será mostrada: `This university has already been saved.`

#### Atualização
- no aplicativo de teste de APIs, envie um 'PUT request' com a _id da universidade  `localhost:3000/universities/:id`, e com os campos:
	- `web_pages` (lista com URL's),
	- `name` (string - nome da universidade),
	- `domains` (lista de domínios)
- a seguinte mensagem deverá ser mostrada: `Successfully updated university.`

#### Remoção
- no aplicativo de teste de APIs, envie um 'DELETE request' com a _id da universidade: `localhost:3000/universities/:id`
- a seguinte mensagem deverá ser mostrada: `Successfully deleted the corresponding university.`

## Problemas ao implementar

A seguir estão listados alguns obstáculos encontrados na implementação do projeto:

- body-parser está depreciado a partir da versão 4.16.0 do express. Logo, no código foi feito da seguinte forma 
```
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
```
- a chave de um 'mongoose schema' não permite o uso de hífen, portanto `state-province` foi escrito como `state_province`. O usuário não seria afetado, podendo utilizar hífen normalmente, mas a interpretação do código pode ficar confusa;
- embora a maioria dos valores da `state_province` sejam `null`, o tipo é string;
- nome dos países deve estar em inglês, como brazil e não brasil;
- como haverá hífen na página de requisição, utiliza-se colchetes: 
``state_province: req.body["state-province"]``
