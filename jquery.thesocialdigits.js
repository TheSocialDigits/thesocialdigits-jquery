(function( $ ) {
  
  /*
   * Configuration.
   */
  var key = ''; // TODO add your API key
  var datasource = function (products, callback) {
    // TODO add your data call
    // Example: $.getJSON(your_url, url_params, callback);
    /*
     * @param products A list of product to get data for.
     * @param callback The function to call with the product data.
     *
     * The callback method takes a list of dictionaries/objects containing the 
     * data for each product in the products argument. This is used for 
     * rendering templates so if your template uses the variables id, name and
     * price and you are the list [2,42,1337] as the products argument then the
     * argument for callback should be like:
     *
     *     [{'id': 2,
     *       'name': 'The name of 2',
     *       'price' 1.99
     *       }, 
     *      {'id': 42,
     *       'name': 'The name of 42',
     *       'price' 49.0
     *       }, 
     *      {'id': 1337,
     *       'name': 'The name of 1337',
     *       'price' 100.0}]
     *
     * The order dosn't matter but all dictionaries/object MUST have an entry
     * named 'id' with the products ID. Also if the ID is not used in any 
     * template. 
     */
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
