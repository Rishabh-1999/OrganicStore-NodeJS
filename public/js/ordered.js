var table = document.getElementById('table');
var total = 0;

function tableHTML(data, quantity, ordereddate) {
    return `
        <tr>
            <td scope="row" class="text-center">${data._id}</td>
            <td><img class="text-center" style="width:90px;" src=".${data.imgloc}"></td>
            <td class="text-center">${data.name}</td>
            <td class="text-center">${quantity}</td>
            <td class="text-center">${data.price}</td>
            <td class-"text-center">${ordereddate}</td>
        </tr>
    `;
}

function initfirst() {
    $.ajax({
            url: "/user/getOrderedProduct",
            dataType: "json",
            async: true
        })
        .done(function (data) {
            total.innerHTML = "";
            for (var i = 0; i < data.length; i++) {
                table.innerHTML += tableHTML(data[i].productdata, data[i].quantity, data[i].date);
                total = total + parseFloat(data[i].productdata.price);
            }
        });
}

initfirst();