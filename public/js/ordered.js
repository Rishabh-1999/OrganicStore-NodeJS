var table = document.getElementById('table');
var total = 0;

function tableHTML(data) {
    console.log(data)
    return `
                <tr>
                    <th scope="row">${data._id}</th>
                    <th><img style="width:90px;" src=".${data.imgloc}"></th>
                    <td>${data.name}</td>
                    <td>1</td>
                    <td>${data.price}</td>
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
            for (var index = 0; index < data.length; index++) {
                table.innerHTML += tableHTML(data[index].productdata);
                total = total + parseFloat(data[index].productdata.price);
            }
            document.getElementById('carttotal').innerHTML = "Total: Rs. " + total;
        });
}

(() => {
    initfirst();
})();