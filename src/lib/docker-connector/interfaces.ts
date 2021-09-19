export interface IDockerConnectorConfig {
    version: string
    host: string
    port: number
    key: string
    cert: string
    ca: string
    socket: string
    protocol: "https" | "http" | "ssh"
}

export interface IDockerConnectorContainerInfo {
    id: string
    images: string
    name: string
    state: string
    status: string
}

export interface IDockerConnectorListFilter {
    label?: string[]
}

export interface IDockerConnector {
    list: (filter?: IDockerConnectorListFilter, all_flag?: boolean) => Promise<IDockerConnectorContainerInfo[]>
    restart: (id: string) => Promise<void>
    init: () => Promise<void>
}