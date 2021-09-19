# Docker-healthcheck

## Информация

Перезагрузка нездоровых docker контейнеров.

## Оглавление

- [Использование](#install)
- [Ключи запуска](#launch)
- [Конфигурация](#configuration)
- [HTTP API](#api)

## <a name="install"></a> Использование

пример строки запуска: `node /docker-healthcheck/app.js -c config.toml`

## <a name="launch"></a> Таблица ключей запуска

Ключ | Описание
------------ | -------------
--version, -v | вывести номер версии приложения
--help, -h | вызвать справку по ключам запуска
--config, -c | путь к файлу конфигурации в формате toml или json, (переменная среды: DOCKER_HEALTHCHECK_CONFIG_PATH)

## <a name="configuration"></a> Конфигурация

Программа настраивается через файл конфигурации в формате TOML, YAML или JSON. Так же можно настраивать через переменные среды, которые будут считаться первичными.

### Секции файла конфигурации

- **logger** - настройка логгера (переменная среды: DOCKER_HEALTHCHECK_LOGGER)
- **logger.output** - (переменная среды: DOCKER_HEALTHCHECK_LOGGER_OUTPUT)
- **api** - настройка API (переменная среды: DOCKER_HEALTHCHECK_API)
- **healthcheck** - настройки проверки здоровья (переменная среды: DOCKER_HEALTHCHECK_HEALTHCHECK)
- **healthcheck.cron** - настройка cron (переменная среды: DOCKER_HEALTHCHECK_HEALTHCHECK_CRON)
- **docker** - настройки докера (переменная среды: DOCKER_HEALTHCHECK_DOCKER)

### Пример файла конфигурации config.toml

```toml
[logger]
    name = ""                                                           # имя логгера
    levels = ["fatal","info","error","warn","debug","trace"]            # уровни логирования
    [logger.bindings]                                                   # дополнительные ключи
        key1 = "key1-val"
        key2 = "key2-val"
    [logger.output]                                                     # настройка отображения
        timestamp = "full"                                              # вывод времени full, short, unix и none
        levels = ["fatal","info","error","warn","debug","trace"]        # вывод типов
        bindings = "bracket"                                            # отображение ключей square, bracket, none, no-wrapper

[api]
    enable = false              # активация API сервера
    hostname = "0.0.0.0"        # хост          
    port = 3001                 # порт
    backlog = 511               # очередь баклога
    prefix = "/api"             # префикс
    connection_timeout = 0      # таймаут сервера в миллисекундах
    keep_alive_timeout = 5000   # таймаут keep-alive сервера в миллисекундах
    body_limit = 1048576        # максимальный размер тела запроса в байтах
    trust_proxy = false         # доверие proxy заголовку

[healthcheck]                       # настройки проверки здоровья
    enable = false                  # активация
    label = "docker.healthcheck"    # метка поиска
    [healthcheck.cron]              # настройка cron
        interval = "*/10 * * * * *" # интервал
        time_zone = "Europe/Moscow" # временная зона
    
[docker]                                # настройки докера
    host = "localhost"                  # хост подключения, игнорируется если указан socket.
    port = 2375                         # порт подключения, игнорируется если указан socket.
    protocol = "http"                   # протокол http, https и ssh
    ca = ""                             # путь файла до файла CA, игнорируется если указан socket.
    cert = ""                           # путь до файла сертификата, игнорируется если указан socket.
    key = ""                            # путь до файла ключа, игнорируется если указан socket.
    version = "v1.38"                   # версия api docker
    #socket = "/var/run/docker.sock"    # путь к сокету docker (если указан, то ключи host, port и protocol игнорируются)

```

### Таблица параметров конфигурации

| Параметр | Тип | Значение | Описание |
| ----- | ----- | ----- | ----- |
| logger.levels | строка[] | "fatal","info","error","warn","debug","trace" | уровни логирования |
| logger.bindings | объект | {} | дополнительные ключи |
| logger.output.timestamp | строка | full | вывод времени full, short, unix и none |
| logger.output.levels | строка[] | "fatal","info","error","warn","debug","trace" | вывод типов |
| logger.output.bindings | строка | no-wrapper | отображение ключей square, bracket, none, no-wrapper |
| api.enable | логический | false | активация API сервера |
| api.hostname | строка | 0.0.0.0 | хост |
| api.port | число | 3001 | порт |
| api.backlog | число | 511 | очередь баклога |
| api.prefix | строка | /api | префикс |
| api.connection_timeout | число | 0 | таймаут сервера в миллисекундах |
| api.keep_alive_timeout | число | 5000 | таймаут keep-alive сервера в миллисекундах |
| api.body_limit | число | 1048576 | максимальный размер тела запроса в байтах |
| api.trust_proxy | логический | false | доверие proxy заголовку |
| healthcheck.enable | логический | false | настройки проверки здоровья |
| healthcheck.label | строка | docker.healthcheck | активация |
| healthcheck.cron.interval | строка | */10 * * * * * | интервал |
| healthcheck.cron.time_zone | строка | Europe/Moscow | временная зона |
| docker.host | строка | localhost | хост подключения, игнорируется если указан socket |
| docker.port | число | 2375 | порт подключения, игнорируется если указан socket |
| docker.protocol | строка | http | протокол http, https и ssh |
| docker.ca | строка | | путь файла до файла CA, игнорируется если указан socket |
| docker.cert | строка | | путь до файла сертификата, игнорируется если указан socket |
| docker.key | строка | | путь до файла ключа, игнорируется если указан socket |
| docker.version | строка | v1.38 | версия api docker |
| docker.socket | строка | | путь к сокету docker (если указан, то ключи host, port и protocol игнорируются) |

### Настройка через переменные среды

Ключи конфигурации можно задать через переменные среды ОС. Имя переменной среды формируется из двух частей, префикса `DOCKER_HEALTHCHECK_` и имени переменной в верхнем реестре. Если переменная вложена, то это обозначается символом `_`. Переменные среды имеют высший приоритет.

пример для переменной **logger.mode**: `DOCKER_HEALTHCHECK_LOGGER_MODE`

пример для переменной **api.ips_count**: `DOCKER_HEALTHCHECK_API_IPS_COUNT`

## <a name="api"></a> API

Сервис предоставляет API, который настраивается в секции файла настройки **api**. API доступно по протоколу HTTP.

### Примеры применения

проверить доступность сервера: `curl -i http://localhost:3001/api/healthcheck`

### API информации сервиса

| URL | Метод | Код | Описание | Пример ответа/запроса |
| ----- | ----- | ----- | ----- | ----- |
| /_ping | GET | 200 | проверить здоровье сервиса | OK |
| /healthcheck | GET | 200 | проверить здоровье сервиса | OK |
