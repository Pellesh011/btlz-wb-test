import { CronJob } from "cron";

export default class CronTasks{
    tasks: CronJob[];
    constructor(tasks: CronJob[]) {
        this.tasks = tasks
    }
    start() {
        this.tasks.forEach(task => task.start());
    }
    stop() {
        this.tasks.forEach(task => task.stop());
    }
}