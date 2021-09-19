import { IFastifySmallLogger } from "fastify-small-logger";
import * as Docker from "dockerode";
import * as path from "path";
import * as fs from "fs";
import * as chalk from "chalk";
import { IDockerConnector, IDockerConnectorConfig, IDockerConnectorContainerInfo, IDockerConnectorListFilter } from "./interfaces";

export * from "./interfaces";

export class DockerConnector implements IDockerConnector {

    private readonly _docker: Docker

    constructor (
        private readonly _config: IDockerConnectorConfig,
        private readonly _logger: IFastifySmallLogger
    ) {

        const options: Docker.DockerOptions = {
            version: this._config.version
        };

        if (this._config.ca !== "") {
            const ca_full_path = path.resolve(process.cwd(), this._config.ca);
            if (!fs.existsSync(ca_full_path)) {
                this._logger.fatal(`CA file ${chalk.red(ca_full_path)} not found`);
                process.exit(1);
            }
            options.ca = fs.readFileSync(ca_full_path).toString();
        }
        
        if (this._config.cert !== "") {
            const cert_full_path = path.resolve(process.cwd(), this._config.cert);
            if (!fs.existsSync(cert_full_path)) {
                this._logger.fatal(`CERT file ${chalk.red(cert_full_path)} not found`);
                process.exit(1);
            }
            options.cert = fs.readFileSync(cert_full_path).toString();
        }
        
        if (this._config.key !== "") {
            const key_full_path = path.resolve(process.cwd(), this._config.key);
            if (!fs.existsSync(key_full_path)) {
                this._logger.fatal(`KEY file ${chalk.red(key_full_path)} not found`);
                process.exit(1);
            }
            options.key = fs.readFileSync(key_full_path).toString();
        }

        if (this._config.socket !== undefined) {
            options.socketPath = this._config.socket;
        } else {
            options.host = this._config.host;
            options.port = this._config.port;
            options.protocol = this._config.protocol;
        }

        this._docker = new Docker(options);
    }

    async init (): Promise<void> {
        const ping_result = await this._docker.ping();

        if (ping_result.toString() !== "OK") {
            throw new Error("Docker is unavailable");
        }
    }

    async list (filter: IDockerConnectorListFilter = {}, all_flag: boolean = false): Promise<IDockerConnectorContainerInfo[]> {

        const ping_result = await this._docker.ping();

        if (ping_result.toString() !== "OK") {
            throw new Error("Docker is unavailable");
        }

        const list_result = await this._docker.listContainers({
            all: all_flag,
            filters: {
                ...filter
            }
        });

        const result: IDockerConnectorContainerInfo[] = [];

        for (const item of list_result) {
            result.push({
                id: item.Id,
                images: item.Image,
                name: item.Names[0].replace(/^\//,""),
                state: item.State,
                status: item.Status
            });
        }

        return result;

    }

    async restart (id: string): Promise<void> {

        const ping_result = await this._docker.ping();

        if (ping_result.toString() !== "OK") {
            throw new Error("Docker is unavailable");
        }

        const container = this._docker.getContainer(id);

        await container.restart();

    }

}