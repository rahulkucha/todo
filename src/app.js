var express_1 = require("express");
var app = express_1["default"]();
var port = 3000;
var todo_router_1 = require("./module/todo/todo.router");
var user_router_1 = require("./module/users/user.router");
app.use("/", todo_router_1["default"]);
app.use("/user", user_router_1["default"]);
app.listen(port, function (err) {
    if (err) {
        return console.error(err);
    }
    return console.log("server is listening on " + port);
});
