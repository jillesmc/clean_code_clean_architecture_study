Este conteúdo é parte do curso Clean Code e Clean Architecture da Branas.io
Para mais informações acesse: https://branas.io

# Início

```BASH
docker compose up -d
psql -h localhost -U postgres -W -d app -f create.sql
cd backend/ride
yarn
```

## Executando testes

```BASH
npx jest
npx jest --coverage
```
