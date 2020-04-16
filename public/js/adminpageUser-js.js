var theader = document.getElementById("theader");
var table = document.getElementById("table");

function getuserheader() {
    return `
    <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phoneno</th>
        <th>State</th>
        <th></th>
    </tr>
    `;
}

function usertable() {
    theader.innerHTML = getuserheader();
    inituserstable();
}

function inituserstable() {
    table = $('#table').DataTable({
        "processing": true,
        "serverSide": true,
        "dataSrc": "",
        "ajax": {
            "url": "/user/getUserTable",
            "type": "POST",
            "data": function (d) {
                d.type = $('#CommunityRuleFilter').val();
                d.customsearch = $('div.dataTables_filter input').val();
            },
        },
        "columns": [{
                "data": "email"
            },
            {
                "data": "name"
            },
            {
                "data": "phoneno"
            },
            {
                "data": "state"
            },
            {
                "data": null,
                "orderable": "false"
            }
        ],
        "columnDefs": [{
            "targets": -1,
            "render": function (data, type, row, meta) {
                data = '<button class="btn" onclick=deleteuser("' + data._id + '")><i class="fa fa-trash" style="font-size:175%"></i></button>';
                return data;
            }
        }],
    });

    $('#refreshbtn').on('click', function () {
        table.ajax.reload(null, false);
    });
    $('#CommunityRuleFilter').on('click', function () {
        table.ajax.reload(null, false);
    });
}

function deleteuser(id) {
    $.ajax({
            type: "POST",
            url: "/user/deleteuser",
            data: {
                _id: id
            },
            dataType: "json",
            async: true
        })
        .done(function (data) {
            if (data == "1")
                $('#deletedmodal').modal('show');
            table.ajax.reload(null, false);
        });
}

usertable();