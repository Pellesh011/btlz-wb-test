import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, TooManyRequestsError } from "#core/common/errors.js";
import { IWbApiСommission } from "#core/types/commission.js";
import { Logger } from "log4js";

export class WbAPi{
    private baseUrl: string;
    private token: string;
    private logger: Logger;
    constructor(logger: Logger, token: string) {
        this.logger = logger;
        this.token = token;
        this.baseUrl = 'https://common-api.wildberries.ru/api/v1/';
    }

    getWbСommission = async (): Promise<IWbApiСommission[]> => {
        this.logger.debug('Fetching WB commission data');
        const response = await fetch(this.baseUrl + 'tariffs/commission', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            let message = `HTTP error! status: ${response.status}`;
            switch (response.status) {
                case 400:
                    throw new BadRequestError('Bad Request: The request was malformed or invalid.', this.logger);
                case 401:
                    throw new UnauthorizedError('Unauthorized: Authentication is required.', this.logger);
                case 403:
                    throw new ForbiddenError('Forbidden: Access denied.', this.logger);
                case 404:
                    throw new NotFoundError('Not Found: The requested resource could not be found.', this.logger);
                case 429:
                    throw new TooManyRequestsError('Too Many Requests: Rate limit exceeded.', this.logger);
                default:
                    this.logger.error(`Unexpected error (${response.status}) when fetching commission data`);
                    throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        const data = await response.json();
        this.logger.debug('Successfully fetched WB commission data');
        return data.report;

    }
}