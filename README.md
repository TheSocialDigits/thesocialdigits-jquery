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

```javascript
    var api_key = 'your_api_key'; // TODO insert your API key here. 
    
    $.thesocialdigits({
      key: key,  
      datasource: function (products, callback) {
        var url = 'http://api.thesocialdigits.com/v1/attributes?callback=?';
        var data = {
          'payload': JSON.stringify({
            'key': key
            'products': products,
            'language': 'english' // TODO add correct language
          })
        };
        $.getJSON(url, data, callback);
      }
    });
```

Note that the plugin must be configured before it can be used but the 
configuration can be in an external minified .js file.


Usage
=====

After the configuration the plugin is ready for use. The following example loads
3 popular products, which cost less than 50, in to the page element with id 
_products_ using the template _productsTemplate_.

```javascript
    $('#products').thesocialdigits('popular', 
                                   {'limit': 3,
                                    'filter': 'price < 50'},
                                   '#productsTemplate');
```

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

```html
    <script id="productsTemplate" type="text/html"> 
      <li>
        <a href="/product/{id}">
          <img src="/images/product/{id}.jpg" />
          {name} - {price},-
        </a>
      </li>
    </script>
```


Google Analytics tracking
-------------------------

The plugin supports event tracking via Google Analytics which is enabled by 
default if Analytics is used on the site. The event is triggered every time a
cutomer clicks on a product. The event category is by default set to 
_The Social Digits_ but can be specified in the configuration via the 
_ga\_tracking_ parameter:

```javascript
    $.thesocialdigits({
      key: ... ,
      datasource: ... ,
      ga_tracking: 'Tracking category name'
    });
```

The event action is the name of the API and the event label is the product id and
name as a string _id: name_.

To disable event tracking just set the parameter to _null_:

```javascript
    $.thesocialdigits({
      key: ... ,
      datasource: ... ,
      ga_tracking: null
    });
```


[1] http://developers.thesocialdigits.com/docs/export-data/data-feed

[2] http://developers.thesocialdigits.com/docs/api/methods
