# Sistema de Agendamentos

Aplicação WEB para gerenciar agendamentos de atendimentos e disponibilidade de agenda. 

## Tecnologias Utilizadas
- **Backend:** .NET 8 (C#), Entity Framework Core, PostgreSQL, JWT Authentication.
- **Frontend:** React (Vite), Tailwind CSS v4, Zustand (Estado), Recharts (Gráficos).
- **Arquitetura:** Clean Architecture (Domain, Application, Infrastructure, API), Testes Unitários (xUnit/Moq).
- **DevOps:** Docker & Docker Compose.

## Como Executar

Faça o clone do projeto:

```bash
https://github.com/jonjgc/sistema-agendamentos.git
```

1. Certifique-se de ter o Docker instalado.
2. Na raiz do projeto, execute:

   ```bash
   docker-compose up --build
   ```
3. Acesse ao Frontend em http://localhost:5173 e a API em http://localhost:5067/swagger.

### Backend
Os testes do backend cobrem os casos de uso, validações de domínio e rotas da API. Para executá-los:

1. Abra o terminal e navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Execute o comando nativo do .NET para rodar a suíte de testes:

   ```bash
   dotnet test
   ```

## Testar da aplicação

Para testar a aplicação como um Admin, no swagger(http://localhost:5067/swagger) procure o endpoint vermelho POST /api/Usuarios, clique em Try it out e cole este JSON: 

```bash
{
  "nome": "Admin",
  "perfil": 1,
  "email": "adminteste@gmail.com",
  "senhaHash": "suAsenh4!",
  "cpf": "023.027.000-03",
  "ativo": true
}
```

Clique em Execute. Se retornar o código 201, seu usuário foi criado e a senha criptografada no banco, faça o login com o email e senha que você acabou de criar.

## Decisões de Arquitetura

- **Separação em Camadas**: Garante que a regra de negócio (Domain) seja independente de tecnologias externas.

- **Segurança:** Implementação de JWT com Roles (Admin, Atendente, Cliente) e Hashes de senha via BCrypt.

- **Performance:** Consultas otimizadas com Projeções e Gráficos processados via agregação no banco.

- **UI Moderno:** Uso de Tailwind v4 e Lucide Icons para uma interface limpa e responsiva.