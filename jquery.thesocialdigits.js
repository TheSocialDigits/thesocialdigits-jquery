(function( $ ) {
  
  // Global settings
  var settings = {
    key: '',
    datasource: function(products, callback) {}
  }
  
  
  /**
   * Initial setup of the plugin.
   */
  $.thesocialdigits = function(newSettings) {
    $.extend(settings, newSettings);
  }

  /**
   * Main invocation method for The Social Digits plugin.
   * 
   * @param api The name of the API.
   * @param args The arguments for the API except 'key' and 'visitor' argument
   *             which are handled automaticly.
   * @param template A jQuery selector for the template to be used.
   */

  $.fn.thesocialdigits = function(api, args, template) {
    var elm = this;
    
    callAPI(api, args, function(data) {
      if('result' in data) {
        var metadata = {'api': api,
                        'args': args};
      
        settings.datasource(data.result, function(products) {
          buildHTML(elm, data.result, template, products, metadata);
        });
      }
    });
  };

  /*
   * Build HTML from template.
   */
  function buildHTML(elm, ids, template, _products, metadata) { 
    // ensure the correct sorting of product data
    var products = [];
    
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      
      for(var j = 0; j < _products.length; j++) {
        if(_products[j]['id'] == id) {
          products[i] = _products[j];
          break;
        }
      }
    }
                 
    // generate the html from the template
    elm.append(renderTemplate($(template).html(), products));
    
    // add click logging
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      
      $('a[rel="__tsd-' + id + '"]').click({'id': id}, function(event) {
        var href = $(this).attr('href');
        var t = setTimeout('window.location.href = "' + href + '";', 500);
        
        callAPI('log_click', {'product': event.data.id,
                              'api': metadata.api,
                              'metadata': metadata}, function() {
          clearTimeout(t);
          window.location.href = href; // go on success
        });
        
        return false; // don't go yet
      });
    }
    
    // cleanup to leave unmodified HTML
    $('a[rel|="__tsd"]').removeAttr('rel');
  }

  /*
   * Primitive template rendering.
   */
  function renderTemplate(template, products) {
    var output = '';
    
    for (var i = 0; i < products.length; i++) {
      var product = products[i];
      var tmp = template.replace(new RegExp('<a', 'g'), '<a rel="__tsd-' + product['id'] + '"');
      
      for (var key in product) {
        tmp = tmp.replace(new RegExp('{' + key + '}', 'g'), product[key]);
      }
      
      output += tmp;
    }
    
    return output;
  }

  /*
   * Base function to call the API.
   */
  function callAPI(api, args, callback) {
    args.key = settings.key;
    var url = 'http://api.thesocialdigits.com/v1/' + api + '?callback=?';
    var data = {
            'payload': JSON.stringify(args)
          };
  
    $.getJSON(url, data, callback);
  }

})( jQuery );
