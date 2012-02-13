(function( $ ) {
  
  /*
   * Configuration.
   */
  var key = ''; // TODO add your API key
  var datasource = function (products, callback) {
    // TODO add your data call
    // $.getJSON(your_url, url_params, callback);
  };


  
  /**************************************************************************/
  

  
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
        datasource(data.result, function(products) {
          buildHTML(elm, data.result, template, products);
        });
      }
    });
  };

  /*
   * Build HTML from template.
   */
  function buildHTML(elm, ids, template, _products) { 
    // ensure the correct sorting of product data
    products = [];
    
    for (var i in ids) {
      var id = ids[i];
      
      for(var j in _products) {
        if(_products[j]['id'] == id) {
          products[i] = _products[j];
          break;
        }
      }
    }
                 
    // generate the html from the template
    elm.append(renderTemplate($(template).html(), products));
    
    // add click logging
    for (var i in ids) {
      var id = ids[i];
      
      $('a[rel="__tsd-' + id + '"]').click({'id': id}, function(event) {
        var href = $(this).attr('href');
        setTimeout('window.location.href = "' + href + '";', 1000); // always go
        
        callAPI('__log_click', {'product': event.data.id}, function() {
          window.location.href = href; // go on success
        });
        
        return false; // don't go yet
      });
    }
  }

  /*
   * Primitive template rendering.
   */
  function renderTemplate(template, products) {
    var output = '';
    
    for (var i in products) {
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
    args.key = key;
    var url = 'http://api.thesocialdigits.com/v1/' + api + '?callback=?';
    var data = {
            'payload': JSON.stringify(args)
          };
  
    $.getJSON(url, data, callback);
  }

})( jQuery );
