import mongoose from "mongoose";
mongoose.connect('mongodb://localhost/todos', {useNewUrlParser: true});

    const TodoSchema = new mongoose.Schema({
      name: String,
      description: String,
      is_active: Boolean,
      is_deleted: Boolean,
      status: { type: String, default: "pending"},
      task_id: Number,
      created_at: { type: Date, default: Date.now },
      created_by: { type: String},
      updated_at: { type: Date, default: Date.now },
      updated_by: { type: String}
    });

var todos = mongoose.model('todos', TodoSchema);

export { todos };