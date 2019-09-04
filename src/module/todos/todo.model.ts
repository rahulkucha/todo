import mongoose from "mongoose";
mongoose.connect('mongodb://localhost/todos', {useNewUrlParser: true});

    const TodoSchema = new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String, required: true },
      is_active: { type: Boolean, default: true },
      is_deleted: { type: Boolean, default: false },
      status: { type: Boolean, default: false },
      task_id: { type: String },
      created_at: { type: Date, default: Date.now },
      created_by: { type: String},
      updated_at: { type: Date, default: Date.now },
      updated_by: { type: String}
    });

var todos = mongoose.model('todos', TodoSchema);

export { todos };