"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = require("./routes");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("../swagger.json"));
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
        this.app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, credentials, withCredentials");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            next();
        });
    }
    setupRoutes() {
        routes_1.registerRoutes(this.app);
    }
}
new App();
//# sourceMappingURL=app.js.map