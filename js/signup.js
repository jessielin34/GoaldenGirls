var check = function () {
    if (document.getElementById('inputpassword').value ==
        document.getElementById('reenterpassword').value) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerHTML = 'Passwords are matching.';
    } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'Passwords are not matching!';
    }
}

// Try using setCustomValidity https://stackoverflow.com/questions/21727317/how-to-check-confirm-password-field-in-form-without-reloading-page
// add eye icon https://mralgo.medium.com/login-page-with-password-eye-icon-html-css-javascript-13b6e643d5e7
