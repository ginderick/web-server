const http = require("http");
const fs = require("node:fs/promises");

const server = http.createServer();
const port = 9000;

server.on("request", async (request, response) => {
  if (request.url === "/" && request.method === "GET") {
    response.setHeader("Content-Type", "text/html");

    const fileHandle = await fs.open("./public/index.html");
    const fileStream = fileHandle.createReadStream();

    fileStream.pipe(response);
  }

  if (request.url === "/styles.css" && request.method === "GET") {
    response.setHeader("Content-Type", "text/css");

    const fileHandle = await fs.open("./public/styles.css", "r");
    const fileStream = fileHandle.createReadStream();

    fileStream.pipe(response);
  }
  if (request.url === "/script.js" && request.method === "GET") {
    response.setHeader("Content-Type", "text/javascript");

    const fileHandle = await fs.open("./public/script.js", "r");
    const fileStream = fileHandle.createReadStream();

    fileStream.pipe(response);
  }

  response.setHeader("Content-Type", "application/json");
  if (request.url === "/login" && request.method === "POST") {
    response.statusCode = 200;

    const body = {
      message: "Logging you in",
    };

    response.end(JSON.stringify(body));
  }
  if (request.url === "/user" && request.method === "PUT") {
    response.setHeader("Content-Type", "application/json");

    response.statusCode = 401;

    const body = {
      message: "You have to login first",
    };

    response.end(JSON.stringify(body));
  }

  if (request.url === "/upload" && request.method === "POST") {
    const fileHandle = await fs.open("./storage/image.jpeg", "w");

    const fileStream = fileHandle.createWriteStream();

    request.pipe(fileStream);

    request.on("end", () => {
      response.end(
        JSON.stringify({ message: "File was uploaded successfully" }),
      );
    });
  }
});

server.listen(port, () => {
  console.log(`Web server live at http://localhost:${port}`);
});
