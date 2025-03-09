import { Logger } from "log4js";

export class BadRequestError extends Error {
    constructor(message: string, logger?: Logger) {
        super(message);
        this.name = 'BadRequestError';
        if (logger) {
            logger.error(message);
        }
    }
}
export class UnauthorizedError extends Error {
    constructor(message: string, logger?: Logger) {
        super(message);
        this.name = 'UnauthorizedError';
        if (logger) {
            logger.error(message);
        }
    }
}
export class ForbiddenError extends Error {
    constructor(message: string, logger?: Logger) {
        super(message);
        this.name = 'ForbiddenError';
        if (logger) {
            logger.error(message);
        }
    }
}
export class NotFoundError extends Error {
    constructor(message: string, logger?: Logger) {
        super(message);
        this.name = 'NotFoundError';
        if (logger) {
            logger.error(message);
        }
    }
}
export class TooManyRequestsError extends Error {
    constructor(message: string, logger?: Logger) {
        super(message);
        this.name = 'TooManyRequestsError';
        if (logger) {
            logger.error(message);
        }
    }
}
