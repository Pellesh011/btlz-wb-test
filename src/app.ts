import log4js from 'log4js';

log4js.configure('./log4js.json'); // Path to your log4js config file
const logger = log4js.getLogger();

import knex, { migrate, seed } from "#postgres/knex.js";
import CronTasks from '#core/common/cronTasks.js';
import getCronTasks from "#core/cron/index.js";

import { CommissionsRepository } from '#core/repositories/commissionsRepository.js';

logger.info("Starting migrations and seeds");
await migrate.latest();
await seed.run();

logger.info("All migrations and seeds have been run");

logger.info("Starting cron tasks");
const commissionsRepository = new CommissionsRepository(knex);
const cron = new CronTasks(getCronTasks(commissionsRepository, logger));
cron.start();
logger.info("Cron tasks started");

