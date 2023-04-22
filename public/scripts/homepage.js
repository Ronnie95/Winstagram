const input = document.querySelector('#searchText');
const button = document.querySelector('#searchSubmit');
const link = document.querySelector('#link');
//search feature for users obtained from user input 

//on mouseover it updates href with input 
button.addEventListener('mouseover', () => {
    link.href = `/users?search=${input.value}`;
})
//when pressed redirects to user page
document.querySelector('body').addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        location.replace(`/users?search=${input.value}`);
    }
})