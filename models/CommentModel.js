const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user_id: { type: mongoose.SchemaTypes.ObjectId, required: [true, "Invalid user id"] },
  user_name: { type: String, required: [true, "user_name required"] },
  post_id: { type: mongoose.SchemaTypes.ObjectId, required: [true, "Invalid post id"] },
  text: { type: String, required: [true, "text required"] },
}, { 
  timestamps: true 
});

const CommentModel = mongoose.model("comment", CommentSchema);

module.exports = CommentModel;