export interface IDockerHealthcheckConfig {
    enable: boolean
    label: string
    cron: {
        interval: string
        time_zone: string
    }
}

export interface IDockerHealthcheck {
    init: () => Promise<void>
    run: () => Promise<void>
    close: () => Promise<void>
}