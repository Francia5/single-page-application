$('.carousel').carousel()

var form = $('#search-form'); 

var search = $('#searchProducts'); //Button 
var searchedForText;




form.submit(function (ev) { 
    ev.preventDefault();
    searchedForText = search.val();
    $('#searchProducts').val("");
    if (searchedForText.length !== 0) {
        $('#pantalla').empty();
    }
    getData();
});


function getData() { // Función para obtener el producto que busque el usuario
    $.ajax({
        url: `https://api.mercadolibre.com/sites/MLM/search?q=${searchedForText}`,
        contentType: 'application/json',
        method: 'GET',
        crossDomain: true,
        success: function (response) {
            for(var i = 0; i < response.results.length; i++) {
                var photo = response.results[i].thumbnail; 
                var titleProduct = response.results[i].title;
                var priceProduct = response.results[i].price;
                var citySales = response.results[i].seller_address.state.name;
                var template = `<div class="card" style="width: 18rem;">
                                    <div class="card-body text-center">
                                        <img class="card-img-top" src="${photo}" alt="Card image cap">
                                        <h5 class="card-title" >${titleProduct}</h5>
                                        <p class="card-text" >${priceProduct}</p>
                                        <hr>
                                        <p>Ciudad del vendedor: ${citySales}</p>
                                        <hr>
                                         <button class="btn btn-primary car" data-product="${titleProduct}" data-price="${priceProduct}" type="button">Comprar</button>
                                    </div>
                                </div>`;

                $('#pantalla').append(template);
                
            };

            $('.car').click(getElementsCart);

        }
  
    });

};


function getAll() {  // Función para obtener las categorías
    $.ajax({
        url: `https://api.mercadolibre.com/sites/MLM/categories`,
        type: 'GET',
        datatype: 'json',
        crossDomain: true
    }).done(
        function(response){
            for (var i = 0; i < response.length; i++) {
                var nameCategories = response[i].name;
                var idCategories = response[i].id;
                var templateCategories = `<div class="card" style="width: 18rem;" >
                                    <div class="card-body text-center">
                                        <p data-categorie="${idCategories}" class="card-title template">${nameCategories} </p>
                                    </div>
                                </div>`;
                $('#pantalla').append(templateCategories);

            }

            $('.template').click(function (e) {

                var element = e.target;
                var cateData = $(element).attr('data-categorie');
                $('#pantalla').empty();
                productCategories(cateData);

            });
        }
    ).fail(error);

}

$('#home').click(function () { //Limpiar pantalla
    $('#pantalla').empty();

    getAll();

});

function error() {
    alert("No se pueden cargar los datos");
}

function productCategories(cateData) { //Función para obtener cada artículo por categorias

    $.ajax({
        url: `https://api.mercadolibre.com/sites/MLM/search?category=${cateData}`,
        type: 'GET',
        datatype: 'json',
        crossDomain: true
    }).done(getOne).fail(error);

    function getOne(response) { 

       for (var i = 0; i < response.results.length; i++) {
           var photoProduct = response.results[i].thumbnail;
           var nameProduct = response.results[i].title;
           var costProduct = response.results[i].price;
           var shipping = response.results[i].address.state_name + ',' +response.results[i].address.city_name;
           var template = `<div class="card" style="width: 18rem;">
                                    <div class="card-body text-center">
                                        <img class="card-img-top" src="${photoProduct}" alt="Card image cap">
                                        <h5 class="card-title">${nameProduct}</h5>
                                        <p class="card-text">${costProduct}</p>
                                        <hr>
                                        <p>Ciudad del vendedor: ${shipping}</p>
                                        <hr>
                                         <button class="btn btn-primary car" data-product="${nameProduct}" data-price="${costProduct}" type="button">comprar</button>
                                    </div>
                                </div>`;

           $('#pantalla').append(template);

        }


        $('.car').click(getElementsCart);

       
    }
   


};


function error() {
    alert("No se pueden cargar los datos");
};



var count = 0;
var array = [];
var larray =[];

function deleteCart(e) {
     larray = array;
    $(e).closest('tr').remove();
    count--;
    var targe = e.target;
    console.log(targe);
    
    // console.log(count)
    $('#count').text(` ${count}`);

    // var rest = $(e).attr('data-rest');
    // console.log(rest);
    // larray.push(rest);
    var cout = $(e).attr('data-delete');
    // console.log(cout);
    
    
    var position = larray.indexOf(cout);
    console.log(position);
    
    
    //  var indexDelete= ($(e).data("delete"));
    // console.log(indexDelete);
    //larray.splice(indexDelete, 1);
   // console.log(larray);


    

    
   // $('#total').html(`<strong>TOTAL: $${sumarArray(larray)-rest}</strong>`)

    // $('#total').html(`<strong>TOTAL: $${sumarArray(array)}</strong>`); 



};


function getElementsCart(e, nameProductCar, priceProductCar){
  
    var elem = e.target;
    var nameProductCar = $(elem).attr('data-product');
    var priceProductCar = $(elem).attr('data-price');
    var templateModal =
                            `<tr>
                                <td>$ ${priceProductCar}</td> 
                                <td id="product-modal">${nameProductCar}</td>
                                <td><i class="fas fa-trash-alt delete" onclick="deleteCart(this)" data-delete="${count}" data-rest="${priceProductCar}"></i></td>
                            </tr>`;
    $('#tbody').append(templateModal);
    
    count += 1;

    $('#count').text(`${count}`);


    array.push(parseFloat(priceProductCar));

    
   
    $('#total').html(`<strong>TOTAL: $${sumarArray(array)}</strong>`);    

    

};


function sumarArray(array) {
    var suma = 0;
    array.forEach(function (numero) {
        suma += numero;
    });

    return suma;
};




$(document).ready(function () {
    getAll();

    $('#myModal').modal();

 
});


