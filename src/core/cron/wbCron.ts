import { Logger } from 'log4js';
import { WbAPi } from '../api/wb.js';
import env from "#config/env/env.js";
import { ICommissionsRepository, IDbСommission, IWbApiСommission } from '#core/types/commission.js';
import { convertWbCommisionToDbCommision } from '#utils/convector.js';
import { getHourTimestamp } from '#utils/utils.js';


export const startWbReportsCron = (commissionsRepository: ICommissionsRepository ,logger: Logger) => {
    return async () => {
        try {

            logger.info('Start cron task wb reports');
            const token: string = env.WB_TOKEN;
            const api = new WbAPi(logger, token);
            const apiCommissions: IWbApiСommission[] = await api.getWbСommission();
            let dbCommissions: IDbСommission[] = convertWbCommisionToDbCommision(apiCommissions);
            dbCommissions = dbCommissions.map(report => {
                report.timestamp = getHourTimestamp();
                return report;
            });
            await commissionsRepository.butchCreateOrUpdate(dbCommissions, 1000);
            logger.info('WB reports updated successfully');        
        } catch (error) {
            logger.error('Error updating WB reports:', error);        }
    }
};
