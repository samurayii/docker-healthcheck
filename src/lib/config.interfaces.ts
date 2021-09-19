import { IFastifySmallLoggerConfig } from "fastify-small-logger";
import { IDockerConnectorConfig } from "./docker-connector";
import { IDockerHealthcheckConfig } from "./docker-healthcheck";

export type IApiServerConfig = {
    enable: boolean
    port: number
    hostname: string
    backlog: number
    prefix: string
    connection_timeout: number
    keep_alive_timeout: number
    body_limit: number
    trust_proxy: boolean
}

export interface IAppConfig {
    logger: IFastifySmallLoggerConfig
    api: IApiServerConfig
    docker: IDockerConnectorConfig
    healthcheck: IDockerHealthcheckConfig
}