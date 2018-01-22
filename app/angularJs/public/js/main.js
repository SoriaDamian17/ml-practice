var app = angular.module('app', []);
app.controller('mainController', function($scope, $http){
    $http.get('/api/items')
    .success(function(data) {
        console.log(data.search);
            $scope.products = data.search.items;
            angular.forEach(data.search.items, function(value, key) {
                var thumb_ssl = value.pictures[0].source.replace('http','https');
                value.pictures[0].source = thumb_ssl;
                console.log(value.pictures[0].source);
            });
            //console.log($scope.products);
    })
    .error(function(data) {
            console.log('Error: ' + data);
    });
    $scope.view = function(id_product){
        console.log('Redirecciono');
        var path = 'https://' + location.host + '/items/' + id_product;
        //console.log(path);
        $(location).attr('href', path);
    };
	$scope.getCat = function(id){
        
        $http.get('/api/categories/' + id)
        .success(function(data) {
            //console.log(data.category.name);
            $scope.category = data.category.name;
            //console.log(data.category.name);
            /*$(document).ready(function(){
                
            });*/
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    }
});
 
 app.controller('loginController', function($scope, $http){
	$scope.data = {};
    $scope.init = function(){
		$(document).ready(function(){
            
		 });
	}
    $scope.login = function() {
        $(document).ready(function(){
        //console.log($scope.data);
        console.log('Login Auth Mercadolibre');
            var https = true;
            var path = 'https://' + location.host;
            console.log(path);
		    var authCallback = path + '/api/auth/mercadolibre/callback';
            var redirectUrl = 'https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=152158119883526&redirect_uri='+authCallback;
            console.log(redirectUrl);
            $(location).attr('href', redirectUrl);
        });
    }
	$scope.init();
 });

 app.controller('acountController', function($scope, $http){
    $http.get('/api/user')
    .success(function(data) {
            $scope.nickname = data.user.nickname;
            //angular.forEach($scope.products, function(value, key) {
                //$scope.getCat(value.category_id);
            //});
            
            console.log(data);
    })
    .error(function(data) {
            console.log('Error: ' + data);
    });
 });

 app.controller('formController', function($window, $scope, $http, $location){
    $scope.data = {};
    $scope.init = function(){
		$(document).ready(function(){
            var search = getParameterByName('id');
            $scope.search = search;
            //console.log(id);
		});
    };
	$scope.init();
 });

 app.controller('searchController', function($scope, $http, $location){
    $scope.data = {};
    $scope.init = function(){
		$(document).ready(function(){
            var search = getParameterByName('search');
            //$scope.query = search;
            //console.log(id);
            $('input[name="search"]').val(search);
            $scope.search(search);
		});
    };
    $scope.view = function(id_product){
        console.log('Redirecciono');
        var https = true;
        var path = (https ? 'https:' : location.protocol) + '//' + location.host;
        //console.log(path);
        $(location).attr('href', path);
    };
    $scope.search = function(search){
        $scope.query = search;
        $http.get('/api/items?search="' + search + '"')
        .success(function(data) {
            //console.log(data);
            $scope.products = data.search.items;
            //console.log($scope.products);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
	$scope.init();
 });

 app.controller('viewController', function($scope, $http, $location){
    $scope.data = {};
    $scope.init = function(){
		$(document).ready(function(){
            var id_product = location.pathname.split('/')[2];
            console.log(id_product);
            $scope.edit(id_product);
            //$scope.edit('MLA681597400');
		 });
    }
    $scope.edit = function(id) {
        $scope.title = 'Auricular Test';
		$http.get('/api/items/' + id)
        .success(function(data) {
            console.log(data);
            var permalink_ssl = data.products.items.permalink.replace('http','https');
            console.log(permalink_ssl);
            $scope.id = data.products.items.id;
            $scope.condition = data.products.items.condition;
            $scope.sold_quantity = data.products.items.sold_quantity;
            $scope.title = data.products.items.title;
            $scope.permalink = permalink_ssl;
            $scope.price = data.products.items.price;
            $scope.cantidad = data.products.items.available_quantity;
            $scope.pictures = data.products.items.pictures[0].source;
            $scope.description = data.products.items.description;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
	$scope.init();
 });
 
 function getCategory(id){
    var https = true;
    var path = (https ? 'https:' : location.protocol) + '//' + location.host;
    console.log(path + '/api/categories/' + id);
    $.ajax({
        dataType: "json",
        url: path + '/api/categories/' + id,
        data: {},
        success: function( data ) {
            return data.category.name;
        }
    });
 }

 function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}