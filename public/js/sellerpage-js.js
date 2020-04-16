function deleteItem(id) {
    $(document).on("click", "#deleteItem", function () {
        d = $(this).parent().parent()[0].children;
        $.confirm({
            title: 'Delete Item!',
            content: 'Are you Sure you want to Delete this Item ',
            theme: 'supervan',
            buttons: {
                'Yes': {
                    btnClass: 'btn-success',
                    action: function () {
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", "/products/deleteproduct");
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.send(JSON.stringify({
                            _id: id
                        }));
                        xhr.onload = function () {
                            if (xhr.responseText == '1') {
                                window.location.reload();
                            } else
                                alert("Failed");
                        }
                    }
                },
                'No': {
                    btnClass: 'btn-danger',
                }
            }
        })
    });
}