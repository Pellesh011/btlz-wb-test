# Настройка окружения
## Аутентификация Google Sheets
Поместите файл credentials.json в корневую папку проекта:

{
  "type": "service_account",
  "project_id": "airy-strength-443815-a5", 
  "private_key_id": "****************************************",
  "private_key": "******************",
  "client_email": "google-sheets-test@airy-strength-443815-a5.iam.gserviceaccount.com",
  "client_id": "105970790153724059945",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/google-sheets-test%40airy-strength-443815-a5.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

## Переменные окружения
Добавьте рабочий токен Wildberries в файл .env

## ID Google Sheets
Укажите либо в файле /src/posgres/seeds/spreadsheets.js
И раскомментируйте строку в app.ts:
//await seed.run();

Или вставьте напрямую в таблицу spreadsheets в базе данных

## Запуск
docker compose up