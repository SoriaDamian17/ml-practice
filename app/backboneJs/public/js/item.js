window.meli = window.meli || {};

window.meli.ItemView = Backbone.View.extend({
  el: '#main',
  templateUrl: '../static/templates/item.ejs',
  itemsApiUrl: '/api/items/:itemId',
  title: ':title - :currency $ :price en Mercado Libre',

  initialize: function (itemId) {
    $.get(this.templateUrl, _.bind(this.readTemplate, this));
    var queryUrl = this.itemsApiUrl.replace(':itemId', itemId);
    $.get(queryUrl, _.bind(this.readResults, this)).fail(_.bind(this.noItem, this));
  },

  readTemplate: function (response) {
    this.template = _.template(response);
    this.render();
  },

  readResults: function (response) {
      console.log(response);
    var item = response.products.items;
    //this.updateTitle(item);

    var condition = item.condition === 'new' ? 'Nuevo' : 'Usado';
    var amountSoldString = item.sold_quantity === 1 ? ' vendido' :  ' vendidos';
    var currency = item.price.currency === 'ARS' ? '' : item.price.currency;
    var amountString = item.price.amount.toString();
    var decimalsInt = item.price.decimal;
    var decimalsString = item.price.decimal.toString();
    this.item = {
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

  noItem: function () {
    this.categories = null;
    this.item = null;
    this.render();
  },

  previewItem: function () {
    return {
      categories: ['&nbsp'],
      item: {}
    }
  },

  render: function () {
    var html;
    if (this.template && typeof this.item !== 'undefined') {
      html = this.template({item: this.item, categories: this.categories});
      this.$el.html(html);
      this.$el.removeClass('preview');
      /*if (this.item) {
        $(window).scroll(_.bind(this.followScroll, this))
      }*/
    } else if (this.template) {
      html = this.template(this.previewItem());
      this.$el.html(html);
      this.$el.addClass('preview');
    }
  },

  followScroll: function () {
    var currentScroll = $(document).scrollTop();
    var startingPos = this.$el.find('.item-main-info').offset().top;
    var follower = this.$el.find('#scroll-follower-main-info');
    var translation = currentScroll - startingPos + 32 < 0 ? 0 : currentScroll - startingPos + 32;
    follower.css('transform', 'translateY(' + translation + 'px)')
  },

  updateTitle: function (item) {
    var newTitle = this.title.replace(':title', item.title);
    newTitle = newTitle.replace(':currency ', item.price.currency === 'ARS' ? '' : item.price.currency);
    var amountString = item.price.amount.toString();
    var decimalsString = item.price.decimals < 9 ? '0' + item.price.decimals.toString() : item.price.decimals.toString();
    newTitle = newTitle.replace(':price', amountString + ',' + decimalsString);
    $('title').text(newTitle);
  }

});