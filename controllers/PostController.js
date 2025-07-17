const PostModel = require("../models/PostModel");

async function createPost(req, res) {
  try {
    const post_data = {
      user_id: req.body.user_id,
      user_name: req.body.user_name,
      title: req.body.title,
      text: req.body.text,
      image: null,
      link: req.body.link,
    };

    if (req.files && req.files.image && req.files.image.length > 0) {
      post_data.image = req.files.image[0].path;
    }

    const resp = await new PostModel(post_data).save();

    res.status(200).send({
      success: true,
      message: "Post Created",
      data: resp,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Cannot create Post",
      errorMsg: error.message || error,
    });
  }
}

function getAllPosts(req, res) {
  try {    
    PostModel.find({}, { __v: 0}).sort({ createdAt: -1 }).then((resp) => {
      res.status(200).send({
        success: true,
        message: "All posts",
        data: resp
      });
    });
  } catch (error) {    
    res.status(404).send({
      success: false,
      message: "Cannot get posts",
      errorMsg: error,
    });
  };
};

async function getPostsByUser(req, res) {
  try {
    const id = req.params.id

    PostModel.find({ user_id: id }, { __v: 0 }).sort({ createdAt: -1 }).then((resp) => 
      res.status(200).json({
        success: true,
        message: "Posts by user",
        data: resp
      })
    )
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching user posts",
      errorMsg: error
    });
  }
}

const getSinglePost = async (req, res) => {
  try{
    const id = req.params.id
    const post = await PostModel.findById(id).then((post) => {
      res.status(200).send({
        success: true,
        message: "post gotten successfully",
        data: post
      })    
    })
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Cannot get post",
      errMsg: error      
    })    
  }
}


async function updatePost(req, res) {
  try {
    const updateData = {
      title: req.body.title,
      text: req.body.text,
      link: req.body.link,
    };

    if (req.files && req.files.image && req.files.image.length > 0) {
      updateData.image = req.files.image[0].path;
    }

    const post = await PostModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Failed to update post",
      error: error.message,
    });
  }
}

function deletePost(req, res) {
  try {
    PostModel.findByIdAndDelete(req.params.id).then((post) => {
      res.status(200).send({
        success: true,
        message: "Post deleted successfully",
        data: post
      })
    })
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Error deleteing post",
      data: error
    })
  }
}

async function votePost (req, res) {
  try {
    const { userId } = req.body;
    const { postId } = req.params;
    const { action } = req.query;

    if (!['like', 'dislike'].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const oppositeArray = action === 'like' ? 'dislikes' : 'likes';
    post[oppositeArray] = post[oppositeArray].filter(id => id.toString() !== userId);

    const targetArray = action === 'like' ? 'likes' : 'dislikes';
    const userIndex = post[targetArray].indexOf(userId);
    
    if (userIndex === -1) {
      post[targetArray].push(userId);
    } else {
      post[targetArray].splice(userIndex, 1);
    }

    await post.save();

    res.status(200).json({
      success: true,
      data: {
        likes: post.likes,
        dislikes: post.dislikes,
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = { createPost, getAllPosts, getSinglePost, getPostsByUser, updatePost, deletePost, votePost  }