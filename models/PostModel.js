const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  user_id: { type: mongoose.SchemaTypes.ObjectId, required: [true, "Invalid user object"] },
  user_name: { type: String, required: [true, "user_name required"] },
  title: { type: String, required: [true, "title required"] },
  text: { type: String },
  image: { type: String },
  link: { type: String },
  likes: { type: Array, default: []},
  dislikes: { type: Array, default: []},
}, { 
  timestamps: true 
});
const PostModel = mongoose.model('post', PostSchema);

module.exports = PostModel