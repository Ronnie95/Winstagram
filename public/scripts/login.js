// const passwordCheckbox = document.querySelector('#password');
// if (passwordCheckbox.type === "password") {
//     passwordCheckbox.type = "text";
// } else {
//     passwordCheckbox.type = "password";
// }

// function togglePassword() {
//     let x = document.getElementById("myInput");
//     if (x.type === "password") {
//         x.type = "text";
//     } else {
//         x.type = "password";
//     }
// }

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

