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
    if (document.getElementById("checkbox").checked == true) {
        if (document.getElementById("name").value != "" &&
            document.getElementById("email").value != "" &&
            document.getElementById("phoneno").value != "" &&
            document.getElementById("gender").value != "" &&
            document.getElementById("DOB").value != "" &&
            document.getElementById("password").value != "" &&
            document.getElementById("address1").value != "" &&
            document.getElementById("address2").value != "" &&
            document.getElementById("city").value != "" &&
            document.getElementById("state").value != "" &&
            document.getElementById("zipcode").value != "" &&
            document.getElementById("password").value != ""
        ) {
            $.ajax({
                    type: 'POST',
                    url: "/user/register",
                    dataType: "json",
                    async: true,
                    data: {
                        name: document.getElementById("name").value,
                        email: document.getElementById("email").value,
                        phoneno: document.getElementById("phoneno").value,
                        gender: document.getElementById("gender").value,
                        DOB: document.getElementById("DOB").value,
                        password: document.getElementById("password").value,
                        address1: document.getElementById("address1").value,
                        address2: document.getElementById("address2").value,
                        city: document.getElementById("city").value,
                        state: document.getElementById("state").value,
                        zipcode: document.getElementById("zipcode").value
                    },
                })
                .done(function (data) {
                    alert("Register Successfully");
                    window.location = '/';
                });
        } else
            alert("Enter All field")
    } else
        alert("Accept Terms And Condition to Register")
})