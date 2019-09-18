// export default index;
var TodoController = (function () {
    function TodoController() {
    }
    TodoController.prototype.index = function (req, res) {
        //res.render("home", {title: "Home"});
        res.send("Home page !!!");
    };
    
    return TodoController;
})();
exports["default"] = TodoController;
