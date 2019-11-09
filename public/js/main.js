//GOBAL
var products = [];
var cartItems = [];
var cart_n = document.getElementById("cart_n");
//DIVS
var friutDIV = document.getElementById("fruitDIV");
var juiceDIV = document.getElementById("juiceDIV");
var vegetableDIV = document.getElementById("vegetableDIV");
//INFORMATION
var FRUIT = [{
        name: "Apple",
        price: 1
    },
    {
        name: "Orange",
        price: 1
    },
    {
        name: "Cherry",
        price: 1
    },
    {
        name: "Strawberry",
        price: 1
    },
    {
        name: "Kiwi",
        price: 1
    },
    {
        name: "Banana",
        price: 1
    }
];
var JUICE = [{
        name: "Juice #1",
        price: 10
    },
    {
        name: "Juice #2",
        price: 11
    },
    {
        name: "Juice #3",
        price: 12
    }
];

var SALAD = [{
        name: "Salad #1",
        price: 11
    },
    {
        name: "Salad #2",
        price: 12
    },
    {
        name: "Salad #3",
        price: 15
    }
];
//HTML
function HTMLfruitProduct(con) {
    let URL = '.' + con.imgloc;
    let btn = con._id;
    return `
        <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
                <img class="card-img-top" style="height:16rem;" src="${URL}" alt="Card image cap">
                <div class="card-body">
                    <i style="color:orange;" class="fa fa-star" ></i>
                    <i style="color:orange;" class="fa fa-star" ></i>
                    <i style="color:orange;" class="fa fa-star" ></i>
                    <i style="color:orange;" class="fa fa-star" ></i>
                    <i style="color:orange;" class="fa fa-star" ></i>
                    <p class="card-text">${con.name}</p>
                    <p class="card-text">Price: ${con.price}.00</p>
                    <div class="d-flex jusity-content-between align-items-center">
                        <div class="btn-group">
                            <button type="button" onclick="cart2('${con.name}','${con.price}','${URL}','${con}','${btn}')" class="btn btn-sm btn-outline-secondary" >
                                <a style="color:inherit;" href="/cart">Buy</a>
                            </button>
                            <button id="${btn}" type="button" onclick="cart('${con.name}','${con.price}','${URL}','${con}','${btn}')" class="btn btn-sm btn-outline-secondary" >
                            Add to cart</button>
                        </div>
                        <small class="text-muted">Free Shiping</small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function HTMLjuiceProduct(con) {
    let URL = '.' + con.imgloc;
    let btn = con._id;
    return `
        <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
            <img class="card-img-top" style="height:16rem;" src="${URL}" alt="Card image cap">
                <div class="card-body">
                    <i style="color:orange;" class="fa fa-star" ></i>
                    <i style="color:orange;" class="fa fa-star" ></i>
                    <i style="color:orange;" class="fa fa-star" ></i>
                    <i style="color:orange;" class="fa fa-star" ></i>
                    <i style="color:orange;" class="fa fa-star" ></i>
                    <p class="card-text">${con.name}</p>
                    <p class="card-text">Price: ${con.price}.00</p>
                    <div class="d-flex jusity-content-between align-items-center">
                        <div class="btn-group">
                            <button id="${btn}" type="button" onclick="addTocart('${con._id}')" class="btn btn-sm btn-outline-secondary" >
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
    let btn = con._id;
    console.log(con);
    return `
          <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
              <img class="card-img-top" style="height:16rem;" src="${URL}" alt="Card image cap">
                  <div class="card-body">
                      <i style="color:orange;" class="fa fa-star" ></i>
                      <i style="color:orange;" class="fa fa-star" ></i>
                      <i style="color:orange;" class="fa fa-star" ></i>
                      <i style="color:orange;" class="fa fa-star" ></i>
                      <i style="color:orange;" class="fa fa-star" ></i>
                      <p class="card-text">${con.name}</p>
                      <p class="card-text">Price: ${con.price}.00</p>
                      <div class="d-flex jusity-content-between align-items-center">
                          <div class="btn-group">
                              <button type="button" onclick="cart2('${con.name}','${con.price}','${URL}','${con}','${btn}')" class="btn btn-sm btn-outline-secondary" >
                                  <a style="color:inherit;" href="/cart">Buy</a>
                              </button>
                              <button id="${btn}" type="button" onclick="cart('${con.name}','${con.price}','${URL}','${con}','${btn}')" class="btn btn-sm btn-outline-secondary" >
                              Add to cart</button>
                          </div>
                          <small class="text-muted">Free Shiping</small>
                      </div>
                  </div>
              </div>
          </div>
      `;
}
//Animation
function animation() {
    const toast = swal.mixin({
        toast: true,
        position: 'top - end',
        showConfirmButton: false,
        timer: 1000
    });
    // toast({
    //     type = "success",
    //     title: 'Added to shopping cart'
    // });
}
// //Cart Functions
function addTocart(id) {
    //     var item = {
    //         name: name,
    //         price: price,
    //         url: url
    //     }
    //     cartItems.push(item);
    //     let storage = JSON.parse(localStorage.getItem("cart"));
    //     if (storage == null) {
    //         products.push(item);
    //         localStorage.setItem("cart", JSON.stringify(products));
    //     } else {
    //         products = JSON.parse(localStorage.getItem("cart"));
    //         products.push(item);
    //         localStorage.setItem("cart", JSON.stringify(products));
    //     }
    //     products = JSON.parse(localStorage.getItem("cart"));
    //     cart_n.innerHTML = `[${products.length}]`;
    //     document.getElementById(btncart).style.display = "none";
    var xml = new XMLHttpRequest();
    xml.open("POST", "/user/addToCart");
    xml.addEventListener('load', function () {
        var data = xml.responseText;
        window.location = '/home';
    })
    xml.setRequestHeader("Content-Type", "application/json");
    xml.send(JSON.stringify({
        _id: id,
        quantity: document.getElementById("no" + id).value
    }));
    //animation();
}

function cart2(nane, price, url, con, btncart) {
    var item = {
        name: name,
        price: price,
        url: url
    }
    cartItems.push(item);
    let storage = JSON.parse(localStorage.getItem("cart"));
    if (storage == null) {
        products.push(item);
        localStorage.setItem("cart", JSON.stringify(products));
    } else {
        products = JSON.parse(localStorage.getItem("cart"));
        cart_n.innerHTML = `[${products.length}]`;
        document.getElementById(btncart).style.display = "none";
    }
}
(() => {
    // for (let index = 1; index <= 6; index++) {
    //     friutDIV.innerHTML += `${HTMLfruitProduct(index)}`;
    // }
    $.ajax({
            url: "/products/getFruits",
            dataType: "json",
            async: true
        })
        .done(function (data) {
            console.log(data);
            //t = JSON.parse(data);
            for (var index = 0; index < data.length; index++) {
                friutDIV.innerHTML += `${HTMLfruitProduct(data[index])}`;
            }
        });
    $.ajax({
            url: "/products/getJuice",
            dataType: "json",
            async: true
        })
        .done(function (data) {
            console.log(data);
            //t = JSON.parse(data);
            for (var index = 0; index < data.length; index++) {
                juiceDIV.innerHTML += `${HTMLjuiceProduct(data[index])}`;
            }
        });
    $.ajax({
            url: "/products/getVegetable",
            dataType: "json",
            async: true
        })
        .done(function (data) {
            console.log(data);
            //t = JSON.parse(data);
            for (var index = 0; index < data.length; index++) {
                vegetableDIV.innerHTML += `${HTMLvegetableProduct(data[index])}`;
            }
        });
    // for (let index = 1; index <= 3; index++) {
    //     // juiceDIV.innerHTML += `${HTMLjuiceProduct(index)}`;
    //     vegetableDIV.innerHTML += `${HTMLvegetableProduct(index)}`;
    // }
    //if (localStorage.getItem("cart") == null) {

    // } else {
    //     products = JSON.parse(localStorage.getItem("cart"));
    //     cart_n.innerHTML = `[${products.length}]`;
    // }
})()