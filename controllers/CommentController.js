const CommentModel = require("../models/CommentModel")

async function createComment (req, res){
  try {
    const comment_data = {
      user_id: req.body.user_id,
      user_name: req.body.user_name,
      post_id: req.body.post_id,
      text: req.body.text,
    }
    const comment = await new CommentModel(comment_data).save();
    res.status(200).send(
      {success: true, 
      message: "Comment created successfully",
      data: comment
    }) 
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occured",
      errMsg: error
    })
  }
}

function getAllComments(req, res) {
  CommentModel.find({}, { __v: 0}).then((resp) => {
    res.status(200).send({
      success: true,
      message: "All coments",
      data: resp
    })
  }).catch((error) => {
    res.status(404).send({
      success: false,
      message: "Cannot get comments",
      errorMsg: error,
    })
  });
}

async function getAllCommentsForPost (req, res){
  try {
    const id = req.params.id
    CommentModel.find({ post_id: id }, { __v: 0 }).sort({ createdAt: -1 }).then((resp) => 
      res.status(200).json({
        success: true,
        message: "All post comments",
        data: resp
      })
    )
  } catch (error) {
    res.status(404).send({success: false, message: "Could not get all comments", errMsg: error})
  }
}

async function getAllCommentsForUser (req, res){
  try {
    const id = req.params.id
    CommentModel.find({ user_id: id }, { __v: 0 }).sort({ createdAt: -1 }).then((resp) => 
      res.status(200).json({
        success: true,
        message: "All user comments",
        data: resp
      })
    )
  } catch (error) {
    res.status(404).send({success: false, message: "Could not get all comments", errMsg: error})
  }
}

async function updateComment (req, res){
  try {
    const newCommentData = {text: req.body.text}
    CommentModel.findByIdAndUpdate(req.params.id, newCommentData, { new: true }).then((priority) => {
      res.status(200).send({success: true, message: "Comment updated successfully", data: priority}) 
    })
  } catch (error) {
    res.status(500).send({success: false, message: "An error occured", errMsg: error})
  }
}


async function deleteComment (req, res){
  try {
    CommentModel.findByIdAndDelete(req.params.id).then((resp) => {
      res.status(200).send({success: true, message: "Comment deleted successfully", data: resp}) 
    })
  } catch (error) {
    res.status(500).send({success: false, message: "An error occured", errMsg: error})
  }
}



module.exports = { createComment, updateComment, deleteComment, getAllCommentsForPost, getAllCommentsForUser, getAllComments }