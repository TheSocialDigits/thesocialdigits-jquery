(function( $ ) {
  
  language_mapping = {
    'da': 'danish', 
    'nl': 'dutch', 
    'en': 'english', 
    'fi': 'finnish', 
    'fr': 'french', 
    'de': 'german', 
    'it': 'italian', 
    'no': 'norwegian', 
    'nb': 'norwegian',
    'pt': 'portuguese', 
    'ru': 'russian', 
    'es': 'spanish',
    'sv': 'swedish',
    'us': 'english'
  }

  // Global settings
  var settings = {
    key: '',
    ga_tracking: 'The Social Digits'
  }
  
  /**
   * Initial setup of the plugin.
   */
  $.thesocialdigits = function(newSettings) {
    $.extend(settings, newSettings);

    // auto detect language
    if(!('language' in settings)) {
      var language_code = $('html').attr('lang');

      if(language_code in language_mapping) {
        settings.language = language_mapping[language_code];
      }
    }

    // set default data source function
    if(!('datasource' in settings)) {
      settings.datasource = function(products, callback) {
        var args = {'products': products};

        // send language if specified
        if('language' in settings) {
          args.language = settings.language;
        }

        callAPI('attributes', args, callback);
      }
    }

    // set default error function
    if(!('error' in settings)) {
      settings.error = function(state) {
        if (typeof console != 'undefined') {
          if(state.response != null && state.response.status == 'error') {
            console.error(state.response.type + ": " + state.response.message);
          } else if('timeout' in settings) {
            console.error("Request timed out.");
          } else {
            console.error("Unknown error.");
          }
        }
      }
    }
  }

  /**
   * Main invocation method for The Social Digits plugin.
   * 
   * @param api The name of the API.
   * @param args The arguments for the API except 'key' and 'visitor' argument
   *             which are handled automatically.
   * @param template A jQuery selector for the template to be used.
   * @param callback A optional callback function to work on the raw API response.
   * @param done A optional callback function which is triggered after all has been rendered.
   */
  $.fn.thesocialdigits = function(api, args, template, callback, done) {
    var elm = this;
    var callState = {
          'api': api,
          'args': args,
          'template': template,
          'element': elm,
          'response': null
        };

    if('timeout' in settings) {
      var timeout = window.setTimeout(function () { 
          settings.error(callState); 
        },
        settings.timeout);
    }
    
    callAPI(api, args, function(data) {
      callState.response = data;

      if(typeof timeout != 'undefined') {
        window.clearTimeout(timeout);
      }

      if('result' in data) { 
        settings.datasource(data.result, function(products) {
          buildHTML(elm, data.result, template, products, callState);

          if(typeof done === 'function') {
            done(callState);
          }
        });

      } else if ('status' in data && data.status != 'ok') {
        settings.error(callState);
      }

      if(typeof callback === 'function') {
        callback(callState);
      }
    });
  };

  /*
   * Build HTML from template.
   */
  function buildHTML(elm, ids, template, _products, callState) { 
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
                 
    // generate the HTML from the template
    elm.append(renderTemplate($(template).html(), products));
    
    // add click logging
    for (var i = 0; i < products.length; i++) {
      var product = products[i];

      $('a[tsd="id-' + product.id + '"]').each(function(i, link) {
        var onclick = $(link).attr('onclick');

        // remove attributes
        $(link).removeAttr('tsd');
        $(link).removeAttr('onclick');

        // function to continue after logging
        function do_continue(timeout) {
          if(typeof timeout != 'undefined') {
            window.clearTimeout(timeout);
          }

          if(typeof onclick != 'undefined') {
            link.__tsd_onclick = function() {
              eval(onclick);
            }
            link.__tsd_onclick();
          }

          var href = $(link).attr('href');

          if(typeof href != 'undefined') {
            window.location.href = href;
          }
        }

        // the click logging event
        $(link).click(product, function(event) {
          // prevent default behavior
          event.preventDefault();

          // Google Analytics tracking
          if(settings.ga_tracking != null && typeof _gaq != 'undefined') {
            _gaq.push(['_trackEvent', 
                       settings.ga_tracking, 
                       callState.api, 
                       event.data.id + ': ' + event.data.name]);
          }
        
          // use timeouts to always continue
          var timeout = window.setTimeout(do_continue, 500);
        
          // send the click request
          callAPI('log_click', 
                  {'product': event.data.id,
                   'api': callState.api},
                  function() { do_continue(timeout); });
        
          return false;
        });
      });
    }
  }

  /*
   * Primitive template rendering.
   */
  function renderTemplate(template, products) {
    template = Handlebars.compile(template);
    var output = '';

    for (var i = 0; i < products.length; i++) {
      output += template(products[i]).replace(new RegExp('<a ', 'g'), '<a tsd="id-' + products[i].id + '"');
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
            'payload': toJSON(args)
          };
  
    $.getJSON(url, data, callback);
  }

  /*
   * Special method to handle JSON encoding in presence of other noisy frameworks.
   */
  function toJSON(data) {
    if(window.Prototype) {
      return Object.toJSON(data);
    } else {
      return JSON.stringify(data);
    }
  }

})( jQuery );
