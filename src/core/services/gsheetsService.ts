// sheetsService.ts
import { GoogleSheetsAPI } from '#core/api/gsheets.js';
import { Logger } from 'log4js';
import { IDbСommission } from '#core/types/commission.js';

export class SheetsService {
    private googleSheetsAPI: GoogleSheetsAPI;

    constructor(credentials: Record<string, any>, sheetName: string, logger: Logger) {
        this.googleSheetsAPI = new GoogleSheetsAPI(credentials, sheetName, logger);
    }

    public async init(): Promise<void> {
        await this.googleSheetsAPI.init();
    }

    public async updateCommissions(spreadsheetId: string, commissionsData: IDbСommission[]): Promise<void> {
        await this.googleSheetsAPI.updateSheetWithCommissions(spreadsheetId, commissionsData);
    }
}
