var email = document.getElementById("email");
var password = document.getElementById("password");
var submit = document.getElementById("submit");
var invalid = 1;

function addInvalidDOM() {
    if (invalid) {
        invalid = 0;
        var center = document.getElementById("addInvalid");
        var div = document.createElement('div');
        div.setAttribute("class", "alert alert-danger text-center");
        div.setAttribute("style", "width:90%");
        div.innerHTML = "Username/Password Incorrect.";
        center.appendChild(div);
    }
}

submit.addEventListener("click", function () {
    if (!email.value == "" && !password.value == "") {
        var xml = new XMLHttpRequest();
        xml.open("POST", "/user/checklogin");
        xml.addEventListener('load', function () {
            var data = xml.responseText;
            if (data == "Customer")
                window.location = '/home';
            else if (data == "Seller")
                window.location = '/products/sellerpage';
            else if (data == "Admin")
                window.location = '/adminpage';
            else
                addInvalidDOM();
        })
        xml.setRequestHeader("Content-Type", "application/json");
        xml.send(JSON.stringify({
            email: email.value,
            password: password.value
        }));
    } else
        alert('Enter Value on field first');
})