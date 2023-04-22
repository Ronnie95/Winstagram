const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');
//toggle password as an event listener 
togglePassword.addEventListener('click', toggleClicked);

function toggleClicked() {
    if (this.checked) {
        password.type  = "text";
    } else {
        password.type = "password";
    }
}