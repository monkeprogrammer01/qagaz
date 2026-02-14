# Booking System

React-приложение для управления бронированиями.

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Авторизация (демо)

- **Логин:** любой email или телефон
- **Пароль:** `admin`

## Структура проекта

```
booking-system/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # Точка входа
    ├── App.jsx               # Корневой компонент
    ├── index.css             # Глобальные стили
    ├── components/
    │   ├── Header.jsx        # Шапка сайта
    │   ├── SignIn.jsx        # Форма входа
    │   ├── AdminPanel.jsx    # Панель управления бронированиями
    │   └── BookingCard.jsx   # Карточка бронирования
    └── utils/
        └── storage.js        # Утилиты для localStorage
```
