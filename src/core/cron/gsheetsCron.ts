import { SheetsService } from "#core/services/gsheetsService.js";
import { ICommissionsRepository, IDbСommission } from "#core/types/commission.js";
import { ISpreadsheetsRepository } from "#core/types/spreadsheets.js";
import { getHourTimestamp } from "#utils/utils.js";
import { Logger } from "log4js";

export const startGSheetsCron = (
    gsService: SheetsService,
    commissionsRepository: ICommissionsRepository ,
    spreadsheetsRepository: ISpreadsheetsRepository,
    logger: Logger) => {
    return async () => {
        try {
            const spreadsheets = await spreadsheetsRepository.getAll();
            if (spreadsheets.length === 0) {
                logger.info('No spreadsheets found.');
                return;
            }
            const commissions: IDbСommission[] = await commissionsRepository.getByTimestamp(getHourTimestamp());
            if (commissions.length === 0) {
                logger.info('No commissions found.');
                return;
            }
            for (const spreadsheet of spreadsheets) {
                await gsService.updateCommissions(spreadsheet.spreadsheet_id, commissions);
            }
        }
        catch (error) {
            logger.error('Error in wbReportsCron:', error);
        }
    }
}