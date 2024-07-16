const http = require("node:http");
const fs = require("node:fs/promises");

class Butter {
  constructor() {
    this.server = http.createServer();

    this.routes = {};

    this.server.on("request", (req, res) => {
      //Send file to client
      res.sendFile = async (path, mime) => {
        const fileHandle = await fs.open(path, "r");
        const fileStream = fileHandle.createReadStream();

        res.setHeader("Content-Type", mime);
        fileStream.pipe(res);
      };

      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

      res.json = (data) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
      };

      // if the routes object does not have a key of req.method, return 404
      if (!this.routes[req.method.toLowerCase() + req.url]) {
        return res
          .status(404)
          .json({ error: `Cannot ${req.method} ${req.url}` });
      }
      this.routes[req.method.toLowerCase() + req.url](req, res);
    });
  }

  route(method, path, cb) {
    this.routes[method + path] = cb;
  }

  listen = (port, cb) => {
    this.server.listen(port, () => {
      cb();
    });
  };
}

module.exports = Butter;
