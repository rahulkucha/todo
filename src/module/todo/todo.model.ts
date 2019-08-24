import mongoose from "mongoose";
mongoose.connect('mongodb://localhost/todo', {useNewUrlParser: true});

    const TodoSchema = new mongoose.Schema({
      name: String,
      description: String,
      is_deleted: Boolean,
      user_id: Number,
      created_at: { type: Date, default: Date.now },
      created_by: { type: String, default: name },
      updated_at: { type: Date, default: Date.now },
      updated_by: { type: String, default: name }
    });

    const TaskSchema = new mongoose.Schema({
        // todo_id: Number,
       //  task_id: Number,
         task: String,
         flag: Boolean
     });

var todos = mongoose.model('todos', TodoSchema);
var tasks = mongoose.model('tasks', TaskSchema);

export { todos,tasks };