export interface ISpreadsheets {
    spreadsheet_id: string;
}


export interface ISpreadsheetsRepository {
    getAll(): Promise<ISpreadsheets[]>;
    create(spreadsheet: ISpreadsheets): Promise<void>;
}