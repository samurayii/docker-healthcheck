const child_process = require("child_process");
const pkg = require("./package.json");

const command = `docker tag ${pkg.docker_image}:${pkg.version} ${pkg.docker_image}:latest`;

console.log(`cwd:  ${__dirname}`);
console.log(`exec:  ${command}`);

child_process.spawn(command, [], {
    cwd: __dirname,
    shell: true,
    stdio: ["inherit", "inherit", "inherit"]
});