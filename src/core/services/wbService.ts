import { Logger } from 'log4js';
import { WbAPi } from '../api/wb.js';
import { ICommissionsRepository, IDbСommission, IWbApiСommission } from '#core/types/commission.js';
import { convertWbCommisionToDbCommision } from '#utils/convector.js';
import { getHourTimestamp } from '#utils/utils.js';


export const startWbReportsCron = (commissionsRepository: ICommissionsRepository ,logger: Logger) => {
    return async () => {
        try {
            logger.info('Start cron task wb reports');
            const token: string = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQxMDE2djEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTc0NjA2ODAxNywiaWQiOiIwMTkyZGRlYS1mOWU2LTcxNzItODk0Ny1iMjE1Y2I5MmU5NDgiLCJpaWQiOjQ1OTExNjA5LCJvaWQiOjExMzA0NiwicyI6MTA3Mzc0MTgzMiwic2lkIjoiOTMyYzE3NmEtNTA4NS01YzZmLWJjMzMtNGU4NGNkZjU4ZDdlIiwidCI6ZmFsc2UsInVpZCI6NDU5MTE2MDl9.l2C-kGr-1YptJ5iyp_q1RYSxDOgENHXfGepnmo709g2UsGDnT90NnBt5K-nVLVH14XaEFi81dcmeZvF6qz-oxQ';
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
