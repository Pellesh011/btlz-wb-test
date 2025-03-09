
import { CronJob } from 'cron';
import { startWbReportsCron } from '../services/wbService.js';
import { Logger } from 'log4js';
import { ICommissionsRepository } from '#core/types/commission.js';

const getCronTasks = (commissionsRepository: ICommissionsRepository, logger: Logger) => [
    new CronJob('* * * * *', startWbReportsCron(commissionsRepository, logger)),
];

export default getCronTasks
