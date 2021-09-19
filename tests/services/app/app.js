/* eslint-disable @typescript-eslint/no-var-requires */
const http = require("http");

let health_check_flag = true;

setTimeout( () => {
    console.log("health_check_flag = false");
    health_check_flag = false;
}, 15000);

const server = http.createServer((req, res) => {

    if (health_check_flag === true) {
        res.writeHead(200);
        res.end("Healthy");
    } else {
        res.writeHead(404);
        res.end("Unhealthy");
    }

    console.log("request");
});

server.listen(8080);

console.log("app start on 8080 port");

process.on("SIGTERM", async () => {
    process.exit();
});

process.on("SIGINT", async () => {
    process.exit();
});