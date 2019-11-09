var invalid = 1;
var center = document.getElementById("addInvalid");

function addDom() {
    if (invalid) {
        invalid = 0;
        var center = document.getElementById("addInvalid");
        var div = document.createElement('div');
        div.setAttribute("class", "alert alert-danger text-center");
        div.setAttribute("style", "width:90%");
        div.innerHTML = "Old Password Incorrect.";
        center.appendChild(div);
    }
}

function cpass() {
    $.ajax({
            type: 'POST',
            url: "/user/changepassword",
            dataType: "json",
            data: {
                oldpass: document.getElementById("oldpass").value,
                newpass: document.getElementById("newpass").value
            },
            async: true
        })
        .done(function (data) {
            console.log(data);
            if (data == "1") {
                alert('Password Changed');
                window.location = '/';
            } else
                addDom();
        });
}