var productDIV = document.getElementById("productDIV");

function HTMLproduct(con) {
    return `
        <div class="col-md-4">
        <div class="card mb-4 shadow-sm">
        <img class="card-img-top" style="height:16rem;" src="${con.imgloc}" alt="Card image cap">
            <div class="card-body">
                <p class="card-text font-weight-bold text-capitalize">${con.name}</p>
                <p class="card-text">Price: <i class="fa fa-inr"></i> ${con.price}.00</p>
                <div class="d-flex jusity-content-between align-items-center">
                </div>
            </div>
        </div>
    </div>
    `;
}

(() => {
    $.ajax({
            url: "/products/getSellerProduct",
            dataType: "json",
            async: true
        })
        .done(function (data) {
            for (var index = 0; index < data.length; index++) {
                productDIV.innerHTML += `${HTMLproduct(data[index])}`;
            }
        });
})()