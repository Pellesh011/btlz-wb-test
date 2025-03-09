import { google, sheets_v4 } from 'googleapis';

import { JWT } from 'google-auth-library/build/src/auth/jwtclient.js';
import { Logger } from 'log4js';
import { IDbСommission } from '#core/types/commission.js';


export class GoogleSheetsAPI {
    private auth: JWT | null = null;
    private logger: Logger;
    private credentials: Record<string, any>;
    private sheets: sheets_v4.Sheets | null = null;
    private sheetName: string;

    constructor(credentials: Record<string, any>, sheetName: string, logger: Logger) {
        this.logger = logger;
        this.sheetName = sheetName;
        this.credentials = credentials;
    }

    // Авторизация в Google API
    private async authorize(): Promise<JWT> {
        return new google.auth.JWT({
            email: this.credentials.client_email,
            key: this.credentials.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
    }

    // Инициализация API Google Sheets
    public async init(): Promise<void> {
        this.auth = await this.authorize();
        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    }

    // Обновление таблицы данными о комиссиях
    public async updateSheetWithCommissions(spreadsheetId: string, commissionsData: IDbСommission[]): Promise<void> {
        try {
            const now = new Date();
            
            if (commissionsData.length === 0) {
                return;
            }
            await this.addHeadersIfNeeded(spreadsheetId);

            const sortedCommisionsData: IDbСommission[] =  commissionsData.sort((a, b) => {
                if (a.kgvp_marketplace !== b.kgvp_marketplace) {
                    return a.kgvp_marketplace - b.kgvp_marketplace;
                }
                if (a.kgvp_supplier !== b.kgvp_supplier) {
                    return a.kgvp_supplier - b.kgvp_supplier;
                }
                if (a.kgvp_supplier_express !== b.kgvp_supplier_express) {
                    return a.kgvp_supplier_express - b.kgvp_supplier_express;
                }
                return a.paid_storage_kgvp - b.paid_storage_kgvp;
            });

            // Форматирование данных для Google Sheets
            const values: (string | number)[][] = sortedCommisionsData.map(commission => [
                commission.kgvp_marketplace,
                commission.kgvp_supplier,
                commission.kgvp_supplier_express,
                commission.paid_storage_kgvp,
                commission.parent_id,
                commission.parent_name,
                commission.subject_name,
                commission.subject_id,
                (new Date(commission.timestamp * 1000)).toISOString(),
            ]);

            // Удаление существующих строк из таблицы для текущего timestamp
            await this.deleteRowsByTimestamp(spreadsheetId, commissionsData[0].timestamp);

            // Добавление новых данных в таблицу
            await this.appendDataToSheet(spreadsheetId, values);

            this.logger.info('Google Sheet updated successfully.');
        } catch (error) {
            this.logger.error('Error updating Google Sheet:', error);
        }
    }

    
    // Метод для добавления заголовков, если первая строка пустая
    private async addHeadersIfNeeded(spreadsheetId: string): Promise<void> {
        try {
            if (!this.sheets) {
                this.logger.error('Google Sheets API not initialized.');
                return;
            }

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: `${this.sheetName}!A1:Z1`, // Проверяем только первую строку
            });

            const values = response.data.values || [];
            
            // Если первая строка пустая, добавляем заголовки
            if (values.length === 0 || values[0].every(cell => !cell)) {
                const headers = [
                    'Marketplace',
                    'Supplier',
                    'Supplier Express',
                    'Paid Storage',
                    'Parent ID',
                    'Parent Name',
                    'Subject Name',
                    'Subject ID',
                    'Timestamp',
                ];

                await this.appendDataToSheet(spreadsheetId, [headers]); // Добавляем заголовки
                this.logger.info('Headers added to the sheet.');
            } else {
                this.logger.info('Headers already exist in the sheet.');
            }
        } catch (error) {
            this.logger.error('Error adding headers to the sheet:', error);
        }
    }

    // Получение ID листа по его имени
    private async getSheetIdByName(spreadsheetId: string, sheetName: string): Promise<number | null> {
        try {
            if (!this.sheets) {
                this.logger.error('Google Sheets API not initialized.');
                return null;
            }
            const response = await this.sheets.spreadsheets.get({
                spreadsheetId: spreadsheetId,
            });
    
            const sheets = response.data.sheets;
            const sheet = sheets?.find(s => s.properties?.title === sheetName);
            return sheet?.properties?.sheetId ?? null;
        } catch (error) {
            this.logger.error('Error retrieving sheet ID:', error);
            return null;
        }
    }

    // Удаление строк по временной метке
    private async deleteRowsByTimestamp(spreadsheetId: string, timestamp: number): Promise<void> {
        try {

            if (!this.sheets) {
                this.logger.error('Google Sheets API not initialized.');
                return;
            }
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: `${this.sheetName}!A:Z`,
            });
    
            const values = response.data.values || [];
            const numRows = values.length;
            if (numRows === 0) {
                this.logger.info('No data found in the sheet.');
                return;
            }
    
            // Поиск строк с совпадающей временной меткой
            const rowsToDelete: number[] = [];
            values.forEach((row, index) => {
                if (row.length > 8 && new Date(row[8]).getTime() === timestamp * 1000) { 
                    rowsToDelete.push(index + 1); 
                }
            });
    
            if (rowsToDelete.length === 0) {
                this.logger.info('No rows found with the specified timestamp.');
                return;
            }
    
            // Удаление строк в обратном порядке во избежание проблем со смещением
            rowsToDelete.sort((a, b) => b - a);
    
            // Получение ID листа по имени
            const sheetId = await this.getSheetIdByName(spreadsheetId, this.sheetName);
            if (sheetId === null) {
                this.logger.error(`Sheet with name "${this.sheetName}" not found.`);
                return;
            }
    
            // Фильтрация индексов строк, которые превышают количество строк в таблице
            const validRowsToDelete = rowsToDelete.filter(rowIndex => rowIndex <= numRows);
    
            if (validRowsToDelete.length === 0) {
                this.logger.info('No valid rows to delete.');
                return;
            }
    
            // Проверка, не останется ли таблица пустой после удаления
            const remainingRows = numRows - validRowsToDelete.length;
            if (remainingRows === 0) {
                this.logger.info('Cannot delete all rows from the sheet.');
                return;
            }
    
            const requests = validRowsToDelete.map(rowIndex => ({
                deleteDimension: {
                    range: {
                        sheetId: sheetId,
                        dimension: 'ROWS',
                        startIndex: rowIndex - 1,
                        endIndex: rowIndex,
                    },
                },
            }));
    
            const batchUpdateRequest: sheets_v4.Schema$BatchUpdateSpreadsheetRequest = {
                requests: requests,
            };
    
            await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId: spreadsheetId,
                requestBody: batchUpdateRequest,
            });
    
            this.logger.info(`Deleted ${validRowsToDelete.length} rows from the sheet.`);
        } catch (error) {
            this.logger.error('Error deleting rows from the sheet:', error);
        }
    }
    
    // Добавление данных в таблицу
    private async appendDataToSheet(spreadsheetId: string, values: (string | number)[][]): Promise<void> {
        try {
            const requestBody: sheets_v4.Schema$ValueRange = {
                values: values,
            };
            if (!this.sheets) {
                this.logger.error('Google Sheets API not initialized.');
                return;
            }
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: spreadsheetId,
                range: 'stocks_coefs', // Замените на имя вашего листа
                valueInputOption: 'USER_ENTERED',
                requestBody: requestBody,
            });

            this.logger.info('Data appended to the sheet successfully.');
        } catch (error) {
            this.logger.error('Error appending data to the sheet:', error);
        }
    }
}

