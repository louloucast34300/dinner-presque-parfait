import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {type:String, required:true},
        password: {type:String, required:true},
        identifiant:{type:String, required:true},
    },
    {collection: "User"}
)

const User = mongoose.model("User", UserSchema);

export default User;