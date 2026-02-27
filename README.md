# Transfer API

REST API для перевода детей между спортивными центрами.  
Стек: **NestJS · TypeScript · Prisma · PostgreSQL · @nestjs/cqrs**

---

```bash
# 1. Установить зависимости
npm install
cp .env .env
npx prisma migrate dev --name init
npx prisma generate
npx ts-node prisma/seed.ts
npm run start:dev

curl -X POST http://localhost:3000/api/appeals/<APPEAL_ID>/transfer

```


Ожидаемый ответ:

```json
{
  "success": true,
  "allTransferred": true,
  "results": [
    { "childIin": "010101000001", "childName": "Алибек Сейткали", "success": true },
    { "childIin": "020202000002", "childName": "Дана Ахметова", "success": true }
  ]
}
```

---

## Архитектура

```
src/
├── domain/              # Бизнес-ядро: сущности, интерфейсы репозиториев
│   ├── appeal/          # Appeal — parseTransferBlock(), resolve()
│   ├── enrollment/      # Enrollment — transferTo() меняет статус и центр
│   ├── sports-center/   # SportsCenterProgram — hasAvailableSlot()
│   └── athlete-profile/ # Интерфейс поиска по ИИН
│
├── application/         # Use-cases через CQRS
│   └── commands/transfer-child/
│       ├── transfer-child.command.ts
│       ├── transfer-child.handler.ts   # Вся оркестрация
│       └── transfer-child.result.ts
│
├── infrastructure/      # Prisma-реализации репозиториев
│
└── presentation/        # Контроллер — только dispatch команды
```

### Ключевые решения

| Решение | Причина |
|---|---|
| Богатые доменные модели | `Enrollment.transferTo()` инкапсулирует переход; `Appeal.parseTransferBlock()` — парсинг |
| Symbol-токены для репозиториев | domain не зависит от Prisma |
| Per-child try/catch | Один ребёнок упал — остальные продолжают |
| @nestjs/cqrs CommandBus | Контроллер без логики |
| Appeal.resolve() только при allTransferred | Бизнес-правило в сущности |
# test-transfer
