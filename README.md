jQuery plugin for The Social Digits
===================================

This is a jQuery plugin for integrating the sevices provided by The Social Digits
(http://thesocialdigits.com) with any website using jQuery.

A quick usage example can be found in the example.html file.


Setup
=====

In order to use the plugin you must first have an account with a valid API key 
and have exported your data [1] to our service.

After that simply include jquery.thesocialdigits.js in your document as any other
plugin. In order to use the plugin you must fist configure it with your API key 
and a function to load template data from. As default you can use our attributes
API. Here is an example of a basic configuration.

    $.thesocialdigits({
        key: 'your_api_key', // TODO insert your API key here.
        
        datasource: function (products, callback) {
          var url = 'http://api.thesocialdigits.com/v1/attributes?callback=?';
          var data = {
            'payload': JSON.stringify({
              'key': 'your_api_key', // TODO insert your API key here.
              'products': products,
              'language': 'english' // TODO add correct language
            })
          };
  
          $.getJSON(url, data, callback);
        }
      });

Note that the plugin must be configured before it can be used but the 
configuration can be in an external minified .js file.


Usage
=====

After the configuration the plugin is ready for use. The following example loads
3 popular products, which cost less than 50, in to the page element with id 
_products_ using the template _productsTemplate_.

    $('#products').thesocialdigits('popular', 
                                   {'limit': 3,
                                    'filter': 'price < 50'},
                                   '#productsTemplate');

Thats all there is to it! The first argument is the API name, the second is the
arguments for the API and the third is the template used to present the products.
For a full list of avaliable APIs and their argument visit the API documentation
[2].


Templating
----------

In order to display the products you must specify a template. The template 
describes how each product is to be styled and what attributes to be shown.
Each attribute is specified as a variable _{var}_. Any attribute specified in 
the data feed [1] can be used as a variable in the template. Here is a small
example of an template:

    <script id="productsTemplate" type="text/html"> 
        <li>
          <a href="/product/{id}">
            <img src="/images/product/{id}.jpg" />
            {name} - {price},-
          </a>
        </li>
    </script>



[1] http://developers.thesocialdigits.com/docs/export-data/data-feed

[2] http://developers.thesocialdigits.com/docs/api/methods
