const likeButton = document.querySelector("#likeButton");
let numberOfLikes = 0;

likeButton.addEventListener('click', addLike);

function addLike() {
    numberOfLikes++;
    console.log(numberOfLikes);
    
}