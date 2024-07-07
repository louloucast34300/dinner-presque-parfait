import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  nourriture: { type: Number, required: true }
});

const ConcurrentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  identifiant: { type: String, required: true },
  notes: NoteSchema
});

const UserSessionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  identifiant: { type: String, required: true },
  notes_concurrent: [ConcurrentSchema],
  moyenne: { 
    nourriture:{type:Number,required:true}
   },
  total: { type: Number, required: false }
});

const SessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    participants: [{ type: String, required: true }],
    session: [UserSessionSchema]
  },
  { collection: "Session" }
);

const Session = mongoose.model("Session", SessionSchema);

export default Session;
