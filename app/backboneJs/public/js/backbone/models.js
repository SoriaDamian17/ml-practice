var categories = Backbone.Model.extend({
    initialize: function(){
        this.bind('change',function(){
        })
    },
    defaults: {
        "id": "",
        "name": "",
    }
});
var products = Backbone.Model.extend({
    initialize: function(){
        this.bind('change',function(){
        })
    },
    defaults: {
        "autor":{
            "firstname":"",
            "lastname":""
        },
        "items":{
            "id": "",
            "title": "",
            "price": {
                "currency": "",
                "amount": "",
                "decimal":""    
            },
            "permalink": "",
            "pictures": [
                {
                    "source": ""
                }
            ],
            "condition": "",
            "free_shipping": "",
            "description": "",
            "state": ""
        }
    }
});