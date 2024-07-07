import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
    {
        title: {type:String, required:true}
    },
    {collection: "Todo"}
)

const Todo = mongoose.model("Todo", TodoSchema);

export default Todo;