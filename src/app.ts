import fs from 'fs';
import log4js from 'log4js';
import * as path from 'path';

import knex, { migrate, seed } from "#postgres/knex.js";
import CronTasks from '#core/common/cronTasks.js';
import getCronTasks from "#core/cron/index.js";

import { CommissionsRepository } from '#core/repositories/commissionsRepository.js';
import { SheetsService } from '#core/services/gsheetsService.js';
import { SpreadsheetsRepository } from '#core/repositories/spreadsheetsRepository.js';

const configPath = path.join(process.cwd(), 'log4js.json');
log4js.configure(configPath);
const logger = log4js.getLogger();

logger.info("Starting migrations and seeds");
await migrate.latest();
//await seed.run();

logger.info("All migrations and seeds have been run");


logger.info("Starting Google Sheets API");
const credentialsFile = path.join(process.cwd(), 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsFile, 'utf-8'));
const sheetName = 'stocks_coefs';
const sheetsService = new SheetsService(credentials, sheetName, logger);
await sheetsService.init();
logger.info("Google Sheets API started");

logger.info("Starting cron tasks");
const commissionsRepository = new CommissionsRepository(knex);
const spreadsheetsRepository = new SpreadsheetsRepository(knex);
const cron = new CronTasks(getCronTasks(commissionsRepository, spreadsheetsRepository, sheetsService, logger));
cron.start();
logger.info("Cron tasks started");



