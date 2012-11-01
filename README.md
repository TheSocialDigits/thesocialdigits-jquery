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
$.thesocialdigits({
  key: 'your_api_key' // TODO insert your API key here. 
});
```

Note that the plugin must be configured before it can be used but the 
configuration can be in an external minified .js file.


Configuration options
---------------------

The plugin can be configured with the following options:

 * __key__: Your API key.
 * __timeout__: Timeout for the request in milliseconds. Timeouts are disabled by default.
 * __error__: Function to be called when an error or timeout occurs. It takes the [call state](#the-call-state-object) as its only argument. The default function logs the error to the browsers console.
 * __datasource__: The function to [fetch product meta data](#fetch-template-metadata-from-own-server) from. As default it is a function that fetches data from The Social Digits service.
 * __language__: The language used when fetching meta data from The Social Digits service. As default the plugin will try to automatically detect it.
 * __ga_tracking__: The tracking category for [Google Analytics event tracking](#google-analytics-tracking). Use null to disable. The default value is 'The Social Digits'.


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
For a full list of available APIs and their argument visit the API documentation
[2].


Templating
----------

In order to display the products you must specify a template. The template 
describes how each product is to be styled and what attributes to be shown.

[Handlebars.js](http://handlebarsjs.com/) is used as templating engine. Any 
attribute specified in the data feed [1] can be used as a variable in the template. 
Here is a small example of an template:

```html
<script id="productsTemplate" type="text/html"> 
  <li>
    <a href="/product/{{id}}">
      <img src="/images/product/{{id}}.jpg" />
      {{name}} - {{price}},-
    </a>
  </li>
</script>
```

Callbacks
---------

The plugin can take a callback function as an optional fourth argument. This function takes
the [call state](#the-call-state-object) as its only argument. This can be used for either 
debugging or chaining results eg. if you make use of the result of one API call when making 
another.

Here is a small example of a callback function that displays the response status as an alert.

```javascript
$('#products').thesocialdigits('popular', 
                               {'limit': 3,
                                'filter': 'price < 50'},
                               '#productsTemplate',
                               function(callState) {
                                 alert(callState.response.status);
                               });
```

Further more a similar function can be given as a optional fifth argument. This function also
takes the [call state](#the-call-state-object) as its only argument. This function is called
upon a successful after rendering the template.

```javascript
$('#products').thesocialdigits('popular', 
                               {'limit': 3,
                                'filter': 'price < 50'},
                               '#productsTemplate',
                               function(callState) {
                                 alert('call done with status' + callState.response.status);
                               },
                               function(callState) {
                                 alert('rendering done with status' + callState.response.status);
                               });
```


Fetch template metadata from own server
---------------------------------------

By default the product metadata used to render the template is fetched from 
The Social Digits API and only data provided in the datafeed is accessible. In 
order to provide more flexibility you can fetch this data from your own 
servers by implementing the datasource function in the configuration as
demonstrated below:

```javascript
$.thesocialdigits({
  key: 'your_api_key' // TODO insert your API key here.  
  datasource: function (products, callback) {
    var url = 'http://example.com/product_metadata';
    var data = {
      'products': JSON.stringify(products)
    };
    $.getJSON(url, data, callback);
  }
});
```

The function takes two arguments:
 * products: The list of products id's contained in the result.
 * callback: A callback function to perform the rendering. It takes a single
 argument which is a list of dictionaries. Each dictionary represents the data
 associated with each product. Each key in the dictionary corresponds to a 
 template variable but each dictionary must have an entry named 'id' with the
 product id.


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

The call state object
=====================

The call state object is a JavaScript object containing all information for a API call.
The object has the following entries:

    var callState = {
          'api': api,
          'args': args,
          'template': template,
          'element': elm,
          'response': null
        };

 * __api__: The name of the API called.
 * __args__: The argument dictionary for the API.
 * __template__: The reference for the template to be used.
 * __element__: The element the plugin was invoked on.
 * __response__: The response object from The Social Digits (see the APIs documentation for its content). If the response has not been completed (eg. if the call timed out) it has the value null.


[1] http://developers.thesocialdigits.com/docs/export-data/data-feed

[2] http://developers.thesocialdigits.com/docs/api/methods
