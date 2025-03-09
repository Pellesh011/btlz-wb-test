
import { CronJob } from 'cron';
import { startWbReportsCron } from './wbCron.js';
import { Logger } from 'log4js';
import { ICommissionsRepository } from '#core/types/commission.js';
import { ISpreadsheetsRepository } from '#core/types/spreadsheets.js';
import { SheetsService } from '#core/services/gsheetsService.js';
import { startGSheetsCron } from './gsheetsCron.js';

const getCronTasks = (commissionsRepository: ICommissionsRepository,
     spreadsheetsRepository: ISpreadsheetsRepository ,
     sheetsService: SheetsService,
     logger: Logger) => [
    new CronJob('0 * * * *', startWbReportsCron(commissionsRepository, logger)),
    new CronJob('0 * * * *', startGSheetsCron(sheetsService, commissionsRepository, spreadsheetsRepository, logger)),
];

export default getCronTasks
