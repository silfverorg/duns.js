# Duns.js

[![Join the chat at https://gitter.im/silfverstrom/duns.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/silfverstrom/duns.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Duns - schema validator for javascript. 
version - 0.0.2

[![npm version](https://badge.fury.io/js/duns.svg)](http://badge.fury.io/js/duns) [![Build Status](https://travis-ci.org/silfverstrom/duns.js.svg?branch=master)](https://travis-ci.org/silfverstrom/duns.js)


## Methods

Currently supports four validations, 

* Duns.object()
* Duns.number()
* Duns.string()
* Duns.array()

To use, create a schema 
```
var Schema = Duns.object().keys({
    pirate : Duns.object().keys({
        ninja  : Duns.string().minlen(2),
        parrot : Duns.number()
            .max(140).min(90).greater(90)
            .positive()
        })
})
```

Then validate
```
var data = { pirate : { ninja : 'test', parrot : 100 } };
Duns.validate(data, Schema) //true
```
### Duns
* Duns.validate(object,Schema) - validates a object, given a schema. Returns true on success, false otherwise.
* Duns.error() - returns last error message after validation.

### Duns.number
Must be number.
* max(max)    - no more than max.
* min(min)    - no less than min.
* greater(gr) - must be greater than gr.
* less(le)    - must be less than le.
* positive()  - must be positive( > 0).
* negative()  - must be negative( < 0).
* extend(objects) - Extends number with validation methods. Example, 
```
    Duns.number().extend({
        between : function(param,min,max) {
            if(param < min) return false;
            if(param > max) return false;
            return true;
        },
        sqrtIsThree : function(param) {
            if(Math.sqrt(param) !== 3) return false;
            return true;
        }
    });
    //Validate a number between 0 and 100, that has a square root that is == 3.
    var ok = Duns.validate(
        9, 
        Duns.number().between(0,100).sqrtOfThree()
    ); 
    //ok === true
```


### Duns.string
Must be string.
* maxlen(max)  - length can be no more than max.
* minlen(min)  - length can be no less than min.
* length(le)   - lenght must be exactly === le.
* email(email) - must be RFC822 valid email.
* allow(val)   - whitelist val.
* deny(val)    - blacklist val.
* oneOf()      - Must match one of arguments. For instance, Duns.string().oneOf('test1','test2') creates a schema that must match either 'test1' or 'test2'.

### Duns.array
Must be array
* items([])      - an array of schemas, one of these must be valid for all items in data.
* min(min)       - minimum length of array
* max(max)       - max length of array
* length(length) - length of array

### Duns.object
Must be object.
* keys() - creates a nested schema.

