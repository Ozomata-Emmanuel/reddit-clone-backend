const express = require('express')
const app = express();
const PORT = process.env.PORT || 5002
const AllUserRoutes = require("./routes/UserRoutes");
const AllPostRoutes = require("./routes/PostRoutes");
const AllCommentRoutes = require("./routes/CommentRoutes");
const cors = require("cors")
const connect_db = require('./DBConnection')
require('dotenv').config();


//Database connection
connect_db();

//Req.Body
app.use(cors());
app.use(express.json())

// ALL API Endpoints
app.use(AllUserRoutes)
app.use(AllPostRoutes)
app.use(AllCommentRoutes)



app.listen(PORT, () => console.log("Server running successfully"))