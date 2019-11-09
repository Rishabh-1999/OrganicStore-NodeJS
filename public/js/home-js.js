var friutDIV = document.getElementById("fruitDIV");
var juiceDIV = document.getElementById("juiceDIV");
var vegetableDIV = document.getElementById("vegetableDIV");

function HTMLfruitProduct(con) {
    let URL = '.' + con.imgloc;
    return `
        <div class="col-md-4">
        <div class="card mb-4 shadow-sm">
        <img class="card-img-top" style="height:16rem;" src="${URL}" alt="Card image cap">
            <div class="card-body">
                <p class="card-text font-weight-bold text-capitalize">${con.name}</p>
                <p class="card-text">Price: <i class="fa fa-inr"></i> ${con.price}.00</p>
                <div class="d-flex jusity-content-between align-items-center">
                    <div class="btn-group">
                        <button type="button" onclick="addTocart('${con._id}')" class="btn btn-sm btn-outline-secondary" >
                        Add to cart</button>
                        <input class="form-control col-sm-3" type="number" value="1" id="no${con._id}">
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function HTMLjuiceProduct(con) {
    let URL = '.' + con.imgloc;
    return `
        <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
            <img class="card-img-top" style="height:16rem;" src="${URL}" alt="Card image cap">
                <div class="card-body">
                    <p class="card-text font-weight-bold text-capitalize">${con.name}</p>
                    <p class="card-text">Price: <i class="fa fa-inr"></i> ${con.price}.00</p>
                    <div class="d-flex jusity-content-between align-items-center">
                        <div class="btn-group">
                            <button type="button" onclick="addTocart('${con._id}')" class="btn btn-sm btn-outline-secondary" >
                            Add to cart</button>
                            <input class="form-control col-sm-3" type="number" value="1" id="no${con._id}">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function HTMLvegetableProduct(con) {
    let URL = '.' + con.imgloc;
    return `
        <div class="col-md-4">
        <div class="card mb-4 shadow-sm">
        <img class="card-img-top" style="height:16rem;" src="${URL}" alt="Card image cap">
            <div class="card-body">
                <p class="card-text font-weight-bold text-capitalize">${con.name}</p>
                <p class="card-text">Price: <i class="fa fa-inr"></i> ${con.price}.00</p>
                <div class="d-flex jusity-content-between align-items-center">
                    <div class="btn-group">
                        <button type="button" onclick="addTocart('${con._id}')" class="btn btn-sm btn-outline-secondary" >
                        Add to cart</button>
                        <input class="form-control col-sm-3" type="number" value="1" id="no${con._id}">
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function addTocart(id) {
    var xml = new XMLHttpRequest();
    xml.open("POST", "/user/addToCart");
    xml.addEventListener('load', function () {
        var data = xml.responseText;
        if (data == "1") {
            $("#orderedModal-content").text("Added To Cart");
            $("#orderedModal-header").css("background-color", "forestgreen");
        } else {
            $("#orderedModal-content").text("Failed To Add in Cart");
            $("#orderedModal-header").css("background-color", "red");
        }
        $("#orderedModal").modal();
    })
    xml.setRequestHeader("Content-Type", "application/json");
    xml.send(JSON.stringify({
        _id: id,
        quantity: document.getElementById("no" + id).value
    }));
}

(() => {
    $.ajax({
            url: "/products/getFruits",
            dataType: "json",
            async: true
        })
        .done(function (data) {
            for (var index = 0; index < data.length; index++) {
                friutDIV.innerHTML += `${HTMLfruitProduct(data[index])}`;
            }
        });

    $.ajax({
            url: "/products/getJuice",
            dataType: "json"
        })
        .done(function (data) {
            for (var index = 0; index < data.length; index++) {
                juiceDIV.innerHTML += `${HTMLjuiceProduct(data[index])}`;
            }
        });

    $.ajax({
            url: "/products/getVegetable",
            dataType: "json"
        })
        .done(function (data) {
            for (var index = 0; index < data.length; index++) {
                vegetableDIV.innerHTML += `${HTMLvegetableProduct(data[index])}`;
            }
        });
})()