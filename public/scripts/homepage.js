const input = document.querySelector('#searchText');
const button = document.querySelector('#searchSubmit');
const link = document.querySelector('#link');

button.addEventListener('mouseover', () => {
    link.href = `/users?search=${input.value}`;
})

document.querySelector('body').addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        location.replace(`/users?search=${input.value}`);
    }
})