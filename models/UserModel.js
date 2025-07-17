const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcryptjs")

const UserSchema = new schema({
  email: { type: String, unique: true, required: [true, 'Email adress is required'] },
  username: { type: String, required: [true, 'Username is required'] },
  password: { type: String, required: [true, 'Password is reuired'] },
  gender: { type: String, required: [true, 'gender is reuired'], enum: ["male", "female"] },
  avatar: { type: String, default: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_7.png" },
  status: { type: String, enum: ["active", "disabled"], default: "active"},
  role: { type: String, enum: ["user", "admin"], default: "user"},
  date_registered: { type: Date, default: Date.now() },
}, { 
  timestamps: true 
});

UserSchema.pre("save", async function(next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;