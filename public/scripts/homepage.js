const input = document.querySelector('#searchText');
console.log(input);
const button = document.querySelector('#searchSubmit');
console.log(button);
const link = document.querySelector('#link');
console.log(link);

button.addEventListener('mouseover', () => {
    link.href = `/users?search=${input.value}`;
    console.log(link);
})

document.querySelector('body').addEventListener('keydown', (event) => {
    console.log(event);
    if (event.key === "Enter") {
        location.replace(`/users?search=${input.value}`);
    }
})