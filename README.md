# Duns.js
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
});
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

### Duns.string
Must be string.
* maxlen(max)  - length can be no more than max.
* minlen(min)  - length can be no less than min.
* length(le)   - lenght must be exactly === le.
* email(email) - must be RFC822 valid email.
* allow(val)   - whitelist val.
* deny(val)    - blacklist val.

### Duns.array
Must be array
* items([])      - an array of schemas, one of these must be valid for all items in data.
* min(min)       - minimum length of array
* max(max)       - max length of array
* length(length) - length of array

### Duns.object
Must be object.
* keys() - creates a nested schema.

