var table = document.getElementById('table');
var total = 0;

function tableHTML(data, quantity) {
    return `
        <tr id="${data._id}">
            <td scope="row" class="text-center">${data._id}</td>
            <td><img style="width:90px;" src=".${data.imgloc}" class="text-center"></td>
            <td class="text-center text-capitalize">${data.name}</td>
            <td>${quantity}</td>
            <td class="text-center"><i class="fa fa-inr"></i> ${data.price}</td>
            <td><button class="btn btn-danger" onclick="deletefromcart('` + data._id + `')"><i class="fa fa-trash"></i></button></td>
        </tr>
    `;
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
            if (data == "1") {
                $("#multiModal-content").text("Item Removed");
                $("#multiModal-header").css("background-color", "forestgreen");
                $("#" + id).hide('slow', function () {
                    $("#" + id).remove();
                });
            } else {
                $("#multiModal-content").text("Failed to remove item");
                $("#multiModal-header").css("background-color", "red");
            }
            $("#multiModal").modal();
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
                table.innerHTML += tableHTML(data[index].productdata, data[index].quantity);
                total = total + parseFloat(data[index].productdata.price);
            }
            document.getElementById('carttotal').innerHTML = "Total: Rs. " + total;
        });
}

initfirst();