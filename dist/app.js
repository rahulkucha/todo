"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = require("./routes");
const app = express_1.default();
const port = 3000;
class App {
    constructor() {
        this.app = express_1.default();
        this.middleware();
        this.setupRoutes();
        this.app.listen(port, err => {
            if (err) {
                return console.error(err);
            }
            return console.log(`server is listening on ${port}`);
        });
    }
    middleware() {
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
    }
    setupRoutes() {
        routes_1.registerRoutes(this.app);
    }
}
new App();
//# sourceMappingURL=app.js.map