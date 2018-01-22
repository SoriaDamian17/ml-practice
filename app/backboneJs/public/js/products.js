window.main = window.main || {};

window.main.product = Backbone.View.extend({
    el: '#main',
    tmpUrl: '../static/templates/item.ejs',
    apiUrl: '/api/items/:itemId',
    /**
     * Note: Inicializamos nuestra vista.
     */
    initialize: function (query){
        $.get(this.tmpUrl, _.bind(this.readTemplate, this));
        var url = this.apiUrl.replace(':itemId', query);
        $.get(url, _.bind(this.getProduct, this))
        .fail(_.bind(this.getParams, this));
    },
    readTemplate: function (response) {
        this.template = _.template(response);
        this.render();
    },
    getProduct: function (response) {
        console.log(response);
        var item = response.products.items;

        var condition = item.condition === 'new' ? 'Nuevo' : 'Usado';
        var amountSoldString = item.sold_quantity === 1 ? ' vendido' :  ' vendidos';
        var currency = item.price.currency === 'ARS' ? '' : item.price.currency;
        var amountString = item.price.amount.toString();
        var decimalsInt = item.price.decimal;
        var decimalsString = item.price.decimal.toString();
        this.product = {
        conditionAndSoldQuantity: condition + ' - ' + item.sold_quantity.toString() + amountSoldString,
        title: item.title,
        permalink: item.permalink,
        picture: item.pictures[0].source || 'http://static.mlstatic.com/org-img/preview/MLA/artsinfoto.gif',
        description: item.description,
        price: currency + '$ ' + amountString,
        decimals: decimalsInt < 10 ? '0' + decimalsString : decimalsString
        };
        this.categories = item.categories;
        this.render();
    },
    getParams: function () {
        this.categories = null;
        this.product = null;
        this.render();
    },
    render: function () {
        var html;
            html = this.template({categories: this.categories, item: this.product});
        this.$el.html(html);
    }
});

window.main.products = Backbone.View.extend({
    el: '#main',
    tmpUrl: './static/templates/items.ejs',
    apiUrl: '/api/items?search=:query',
    /**
     * Note: Inicializamos nuestra vista.
     */
    initialize: function (query){
        $.get(this.tmpUrl, _.bind(this.readTemplate, this));
        var search = this.apiUrl.replace(':query', query);
        $.get(search, _.bind(this.getProducts, this))
        .fail(_.bind(this.getParams, this));
    },
    readTemplate: function (response) {
        this.template = _.template(response);
        this.render();
    },
    getProducts: function (response) {
        console.log(response);
      this.categories = response.search.categories[0].values;
      this.products = response.search.items.map(function (result) {
          //console.log(result);
        var currency = result.price.currency === 'ARS' ? '' : result.price.currency;
        var decimalsInt = result.price.decimal;
        var decimalsString = result.price.decimal.toString();
        return {
          id: result.id,
          title: result.title,
          condition: result.condition,
          permalink: result.permalink,
          price: currency + '$ ' + result.price.amount.toString(),
          decimals: decimalsInt < 10 ? '0' + decimalsString : decimalsString,
          free_shipping: result.free_shiping,
          state: result.state,
          pictures: result.pictures[0].source,
          description:result.description
        }
      });
      console.log(this.products);
      this.render();
    },
    getParams: function () {
        this.categories = null;
        this.products = [];
        this.render()
    },
    render: function () {
        var html;
            html = this.template({categories: this.categories[0].path_from_root, results: this.products});
        this.$el.html(html);
        /*if (this.template && this.results) {
          html = this.template({categories: this.categories, results: this.results});
          this.$el.html(html);
          this.$el.removeClass('preview');
        } else if (this.template) {
          html = this.template(this.previewResults());
          this.$el.html(html);
          this.$el.addClass('preview');
        }*/
    }
});
