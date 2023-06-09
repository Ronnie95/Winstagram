//imports mongoode model
const mongoose = require('mongoose');
//new schema for Posts
const postsSchema = new mongoose.Schema({
  //property for user that created post 
  user: {
    //user is object ID type 
    type: mongoose.Schema.Types.ObjectId,
    //ref documents in users database 
    ref: 'User',
    //user property required when making a new post 
    required: true,
  },
  //image associated with post 
  image: {
    type: String,
    required: true,
  },
  //field for caption 
  caption: {
    type: String,
    //trim white space
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  //not implemented yet 
  likes: [
    {
        //store by ibjectID
      type: mongoose.Schema.Types.ObjectId,
      //refer to User model, shows what users liked the post
      ref: 'User',
    },
  ],
  //sets up comments as arr with 2 properties
  comments: [
    {
      //store Id's generated by MongoDB
      type: mongoose.Schema.Types.ObjectId,
      //ref objectId in Comments model
      ref: 'Comment',
    },
  ],
},{
  timestamps: true,
}
);

const Posts = mongoose.model('Post', postsSchema);
module.exports = Posts;