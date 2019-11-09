var table = document.getElementById("table");
var theader = document.getElementById("theader");

function getproductheader() {
    return `
    <tr>
        <th>#</th>
        <th>Name</th>
        <th>Photo</th>
        <th>Price</th>
        <th>Company Name</th>
        <th></th>
    </tr>
    `;
}

function producttable() {
    theader.innerHTML = getproductheader();
    initproducttable();
}

function deleteproduct(id) {
    $.ajax({
            type: "POST",
            url: "/products/deleteproduct",
            data: {
                _id: id
            },
            dataType: "json"
        })
        .done(function (data) {
            $('#deletedmodal').modal('show');
        });
}

function initproducttable() {
    table = $('#table').DataTable({
        "processing": true,
        "serverSide": true,
        "dataSrc": "",
        "ajax": {
            "url": "/products/getProductTable",
            "type": "POST",
            "data": function (d) {
                d.customsearch = $('div.dataTables_filter input').val();
            },
        },
        "columns": [{
                "data": "_id"
            },
            {
                "data": "name"
            },
            {
                "data": null,
                "orderable": "false"
            },
            {
                "data": "price"
            },
            {
                "data": "sellercompany"
            },
            {
                "data": null,
                "orderable": "false"
            }
        ],
        "columnDefs": [{
                "targets": -1,
                "render": function (data, type, row, meta) {
                    data = '<button class="btn" onclick=deleteproduct("' + data._id + '")><i class="fa fa-trash" style="font-size:175%;"></i></button>';
                    return data;
                }
            },
            {
                "targets": -4,
                "render": function (data, type, row, meta) {
                    data = `<img src="${data.imgloc}" style="width: 80px;height: 80px;">`;
                    return data;
                }
            }
        ],
    });

    $('#refreshbtn').on('click', function () {
        table.ajax.reload(null, false);
    });
}

producttable();