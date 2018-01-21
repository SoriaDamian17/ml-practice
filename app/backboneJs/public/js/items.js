window.meli = window.meli || {};

window.meli.ItemsView = Backbone.View.extend({
  el: '#main',
  templateUrl: './static/templates/items.ejs',
  itemsApiUrl: '/api/items?search=:query',

  initialize: function (query){
    $.get(this.templateUrl, _.bind(this.readTemplate, this));
    var queryUrl = this.itemsApiUrl.replace(':query', query);
    $.get(queryUrl, _.bind(this.readResults, this)).fail(_.bind(this.noResults, this));
    /*$.get(queryUrl, function(response){
        console.log(response);
    }).fail(function(){
        console.log('No se encontraron Productos');
    });*/
  },

  readTemplate: function (response) {
    this.template = _.template(response);
    this.render();
  },

  readResults: function (response) {
      //console.log(response);
    this.categories = response.search.categories;
    
    this.results = response.search.items.map(function (result) {
        console.log(result);
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
    console.log(this.results);
    this.render();
  },

  noResults: function () {
    this.categories = null;
    this.results = [];
    this.render()
  },

  previewResults: function () {
    return {
      categories: ['&nbsp;'],
      results: [{}, {}, {}, {}]
    }
  },

  render: function () {
    var html;
    if (this.template && this.results) {
      html = this.template({categories: this.categories, results: this.results});
      this.$el.html(html);
      this.$el.removeClass('preview');
    } else if (this.template) {
      html = this.template(this.previewResults());
      this.$el.html(html);
      this.$el.addClass('preview');
    }
  }
});