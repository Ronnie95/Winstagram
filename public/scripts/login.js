
 

const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');

togglePassword.addEventListener('click', toggleClicked);

function toggleClicked() {
    if (this.checked) {
        password.type  = "text";
    } else {
        password.type = "password";
    }
}