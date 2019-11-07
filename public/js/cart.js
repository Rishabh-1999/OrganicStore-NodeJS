//GLOBAL
var products = JSON.parse(localStorage.getItem('cart'));
var cartitems = [];
var cart_n = document.getElementById('cart_n');
var table = document.getElementById('table');
var total = 0;

//HTML
function tableHTML(i) {
    return `
                <tr>
                    <th scope="row">${i+1}</th>
                    <th><img style="width:90px;" src="${products[i].url}"></th>
                    <td>${products[i].name}</td>
                    <td>1</td>
                    <td${products[i].price}</td>
                </tr>
    `;
}
//CLEAN 
function clean() {
    localStorage.clear();
    for (let index = 0; index < products.length; index++) {
        table.innerHTML += tableHTML(index);
        taotal = total + parseInt(products[index].price);
    }
    total = 0;
    table.innerHTML = `
        <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
    `;
    cart_n.innerHTML = '';
    document.getElementById("btnBuy").style.display = "none";
    document.getElementById("btnClean").style.display = "none";
}

(() => {
    if (products.length != null)
        for (let index = 0; index < products.length; index++) {
            table.innerHTML += tableHTML(index);
            total = total + parseInt(products[index].price);
        }
    table.innerHTML += `
        <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">Total: $${total}.00</th>
        </tr>
        <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">
                <button id="btnClean onclick="clean()" class="btn text-white btn-warning">
                    Clean Shopping Cart
                </button>
            </th>
            <th scope="col">
                <form id="form1" action="/cart" method="POST" autocomplete="off">
                    <input type="hidden" name="total" value="${total}">
                    <input type="hidden" name="_id" val="">
                    <button id="submitbtn" class="btn btn-success">Buy</button>
                </form>
            </th>
        </tr>
    `;
    products = JSON.parse(localStorage.getItem('cart'));
    cart_n.innerHTML = `[${products.length}]`;
})();
var forms = document.getElementById('form1');
document.getElementById('submitbtn').addEventListener('click', () => {
    localStorage.clear;
    setTimeout(() => {
        sub();
    }, 5000);
})

function sub() {
    setTimeout(() => {
        form.submit();
    }, 5000);
}