# Jira-style Tasks Board (Next.js + App Router)

Тестове завдання: список задач у стилі Jira з розбиттям по статусах, CRUD-форми, SSR, TanStack Query, простий бекенд на API-роутах та нотифікації.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- TanStack Query
- Простий toast (власна імплементація)
- Data store: JSON file (`/data/tasks.json`) + in-memory cache

## Run
```bash
npm i
npm run dev
```

Open: http://localhost:3000

## API
- `GET /api/tasks` — повертає 20 задач
- `POST /api/tasks` — створення задачі
- `PUT /api/tasks/:id` — оновлення
- `DELETE /api/tasks/:id`
  - якщо статус `in_progress` → `409 Conflict`
  - інакше → `200 OK`

> Валідація на бекенді не робиться (за ТЗ).  
> Збереження відбувається у JSON-файл (`data/tasks.json`) при кожній CRUD-операції.

## UI / UX
- SSR-початкове завантаження списку (через прямий виклик store у `app/page.tsx`)
- `Create Task` → модалка створення
- Click по картці → модалка редагування + `Delete`
- Тости на успіх/помилки
- Стани кнопок (disabled) при pending запитах

## Architecture (FSD)
Папки:
- `src/entities/task` — типи, маппери, react-query hooks, UI (TaskCard)
- `src/features/task/*` — модалки Create/Update/Delete
- `src/widgets/tasks-board` — дошка/колонки
- `src/pages/tasks` — сторінка
- `src/shared` — UI-kit (button, input, select, modal, toast), api helpers

## Known limitations
- Key uniqueness перевіряється на фронті (як в ТЗ: backend без валідації).
- Store — файл + кеш у памʼяті. Після перезапуску серверу дані беруться з файлу.

