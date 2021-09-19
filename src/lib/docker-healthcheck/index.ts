import { IFastifySmallLogger } from "fastify-small-logger";
import * as chalk from "chalk";
import { IDockerHealthcheck, IDockerHealthcheckConfig } from "./interfaces";
import { DockerConnector } from "../docker-connector";
import { CronJob } from "cron";

export * from "./interfaces";

export class DockerHealthcheck implements IDockerHealthcheck {

    private _running_flag: boolean
    private _healthcheck_running_flag: boolean
    private readonly _job: CronJob

    constructor (
        private readonly _config: IDockerHealthcheckConfig,
        private readonly _docker_connector: DockerConnector,
        private readonly _logger: IFastifySmallLogger
    ) {
        this._running_flag = false;
        this._healthcheck_running_flag = false;

        this._job = new CronJob(this._config.cron.interval, async () => {

            if (this._healthcheck_running_flag === true) {
                return;
            }

            this._healthcheck_running_flag = true;

            await this._healthcheck();

            this._healthcheck_running_flag = false;
        
        }, null, false, this._config.cron.time_zone);

        if (this._config.enable === false) {
            this._logger.info(`Docker healthcheck ${chalk.cyan("disabled")}`);
        }

    }

    private async _healthcheck (): Promise<void> {
        
        const containers_list = await this._docker_connector.list({
            label: [`${this._config.label}=true`]
        });

        for (const container of containers_list) {
            if (container.state === "running") {
                if (/\(unhealthy\)$/.test(container.status) === true) {
                    this._logger.warn(`Container ${chalk.yellow(container.name)} ID: ${chalk.yellow(container.id)} unhealthy. Restart container...`);
                    await this._docker_connector.restart(container.id);
                    this._logger.info(`Container ${chalk.yellow(container.name)} restarted`);
                }
            }
        }

    }

    async init (): Promise<void> {
        try {
            await this._docker_connector.init();
        } catch (error) {
            this._logger.error(`Docker connector error: ${chalk.red(error.message)}`);
            this._logger.trace(error.stack);
        }
    }

    async run (): Promise<void> {

        if (this._running_flag === true || this._config.enable === false) {
            return;
        }

        this._running_flag = true;

        this._logger.debug("Docker healthcheck running");

        this._job.start();

    }

    async close (): Promise<void> {

        if (this._running_flag === false || this._config.enable === false) {
            return;
        }

        this._running_flag = false;

        this._logger.debug("Docker healthcheck stopped");

        this._job.stop();

    }

}