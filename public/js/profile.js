function changeprofile() {
    var obj = new Object;
    obj.name = document.getElementById("name").value;
    obj.gender = document.getElementById("gender").value;
    obj.DOB = document.getElementById("DOB").value;
    obj.phoneno = document.getElementById("phoneno").value;
    obj.address1 = document.getElementById("address1").value;
    obj.address2 = document.getElementById("address2").value;
    obj.city = document.getElementById("city").value;
    obj.state = document.getElementById("state").value;
    obj.zipcode = document.getElementById("zipcode").value;

    var xml = new XMLHttpRequest();
    xml.open("POST", "/user/updateprofile");
    xml.setRequestHeader("Content-Type", "application/json");
    xml.addEventListener("load", function () {
        window.location = '/home';
    })
    xml.send(JSON.stringify(obj));
}