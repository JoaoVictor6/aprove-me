## Frontend
### Stacks
  - NextJS: Optei pelo framework pois faz árte da stack da empresa. Ele irá facilitar nosso controle de rotas.
  - React Hook Form: Usaremos esa lib para criar nossos formularios
  - Zod: Usaremos essa biblioteca de "schemas" para integrarmos com nossos formularios. A idéia é criar a tipagem do nosso código com o zod e integrarmos a mesma com nossos formulários.
  - Tailwind: Um framework css que usaremos para estilizar as pagina
  - Shadcn: usaremos essa "coleção de componentes" para estilização. O interessante desta lib é a leveza. No projeto teremos somente os componentes que iremos usar e 100% customizavel.


Nesse projeto, teremos as seguintes paginas:

- [ ] `/payable/register`: Pagina para cadastrar pagaveis;
- [ ] `/payable`: Pagina de listagem
- [ ] `/payable/$id`: Pagina com os detalhes do pagavel
- [ ] `/assignor/$id`: Pagina para exibir os detalhes do cedente
- [ ] `/login`: Pagina de cadastro

### Tasks
  - [ ] Interface para cadastrar pagaveis.
  - [ ] Conectando com a API
  - [ ] Pagina de listagem que mostre somente os campos(id, value, emissionDate)
    - [ ] Cada item deve conter um link para mostrar os detalhes do pagavel
      - [ ] Link para exibir dados do cedente
    - [ ] Cada item deve conter opçoes de editar e excluir.
  #### Auth
  - [ ] Crie uma página de login com os campos login e senha
  - [ ] Salve o token no localStorage
  - [ ] Caso o token expire, redireciona para a pagian de login
