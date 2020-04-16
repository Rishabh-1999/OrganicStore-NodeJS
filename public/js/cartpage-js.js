var table = document.getElementById('table');
var total = 0;

function tableHTML(data, quantity) {
    return `
        <tr id="${data._id}">
            <td><img style="width:90px;" src="${data.imgloc}" class="text-center"></td>
            <td class="text-center text-capitalize">${data.name}</td>
            <td>${quantity}</td>
            <td class="text-center"><i class="fa fa-inr"></i> <p id="${data._id}price">${data.price}</p></td>
            <td><button class="btn btn-danger" onclick="deletefromcart('` + data._id + `')"><i class="fa fa-trash"></i></button></td>
        </tr>
    `;
}

function updateprice(id) {
    total = total - parseInt(document.getElementById(`${
        id
    }price`).innerHTML)
    document.getElementById('carttotal').innerHTML = "Total: Rs. " + total;
}

function animatecart(id, i) {
    const toast = swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000
    });
    if (i == 1) {
        updateprice(id);
        toast.fire({
            type: 'success',
            icon: 'success',
            title: "Deleted from Cart"
        });
    } else
        toast.fire({
            type: 'warning',
            icon: 'warning',
            title: "Failed to Delete from Cart"
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
            if (data == "1") {
                animatecart(id, 1);
                $("#multiModal-content").text("Item Removed");
                $("#multiModal-header").css("background-color", "forestgreen");
                $("#" + id).hide('slow', function () {
                    $("#" + id).remove();
                });
            } else {
                animatecart(id, 0)
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
            table.innerHTML = "";
            for (var index = 0; index < data.length; index++) {
                table.innerHTML += tableHTML(data[index].productdata, data[index].quantity);
                total = total + parseFloat(data[index].productdata.price);
            }
            document.getElementById('carttotal').innerHTML = "Total: Rs. " + total;
        });
}

function placeorder() {
    $(document).on("click", "#placeorderbtn", function () {
        d = $(this).parent().parent()[0].children;
        $.confirm({
            title: 'Place Order!',
            content: 'Are you Sure you want to place order ',
            theme: 'supervan',
            buttons: {
                'Yes': {
                    btnClass: 'btn-success',
                    action: function () {

                        window.location = "/user/buyfromcart";
                    }
                },
                'No': {
                    btnClass: 'btn-danger',
                }
            }
        })
    });
}

initfirst();