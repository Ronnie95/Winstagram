// const mongoose = require('mongoose');

// const postsSchema = new mongoose.Schema(
//     {
//         // Creates a title that is a string, it is required and I can't create two items that have the same title 
//         title: {
//             type: String,
//             required: [true, "It must have a title!"],
//             unique: true
//         },
//         // I am making sure author is a string and that if the user doesn't provide any author, the author will be "Anonymous" by default
//         author: {
//             type: String,
//             default: "Anonymous"
//         },
//         // This is making sure that the price is required. I could add a min and/or a max if I think it's appropriate too.
//         price: {
//             type: Number,
//             required: true
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// // mongoose.model(<mongodb collection name>, our schema) is the general default and it creates a collection inside of MongoDB that is named from the first argument, posts here. And it applies the schema above to that collection.
// const posts = mongoose.model('post', postsSchema);

// module.exports = posts;