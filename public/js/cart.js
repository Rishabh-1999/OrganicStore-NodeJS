var table = document.getElementById('table');
var total = 0;

//HTML
function tableHTML(data) {
    console.log(data)
    return `
                <tr>
                    <th scope="row">${data._id}</th>
                    <th><img style="width:90px;" src=".${data.imgloc}"></th>
                    <td>${data.name}</td>
                    <td>1</td>
                    <td>${data.price}</td>
                    <td><button class="btn btn-danger" onclick="deletefromcart('` + data._id + `')"><i class="fa fa-trash"></i></button></td>
                </tr>
    `;
}

function clean() {
    $.ajax({
            type: 'POST',
            url: "/user/cleancart",
            dataType: "json",
            async: true
        })
        .done(function (data) {
            table.innerHTML = "";
        });
}

function buyfromcart() {
    $.ajax({
            type: 'POST',
            url: "/user/buyfromcart",
            dataType: "json",
            async: true
        })
        .done(function (data) {
            window.location = "/user/ordered";
        });
}

function deletefromcart(id) {
    $.ajax({
            type: 'POST',
            url: "/user/deletefromcart",
            dataType: "json",
            data: {
                _id: id
            },
            async: true
        })
        .done(function (data) {
            initfirst();
        });
}

function initfirst() {
    $.ajax({
            url: "/user/getCartProduct",
            dataType: "json",
            async: true
        })
        .done(function (data) {
            total.innerHTML = "";
            for (var index = 0; index < data.length; index++) {
                table.innerHTML += tableHTML(data[index].productdata);
                total = total + parseFloat(data[index].productdata.price);
            }
            console.log(total);
            document.getElementById('carttotal').innerHTML = "Total: Rs. " + total;
        });
}

(() => {
    initfirst();
})();