# Duns.js
Duns - schema validator for javascript. 

[![npm version](https://badge.fury.io/js/duns.svg)](http://badge.fury.io/js/duns) [![Build Status](https://travis-ci.org/silfverstrom/duns.js.svg?branch=master)](https://travis-ci.org/silfverstrom/duns.js)


## Methods

Currently supports the following validators, 

* Duns.any()
* Duns.bool()
* Duns.object()
* Duns.number()
* Duns.string()
* Duns.array()
* Duns.date()

To use, create a schema and validate.
```
var Schema = Duns.object().keys({
    pirate : Duns.object().keys({
        ninja  : Duns.string().minlen(2),
        parrot : Duns.number()
            .max(140).min(90).greater(90)
            .positive()
        })
})

var data = { pirate : { ninja : 'test', parrot : 100 } };

// Then you can validate the schema like this.
Duns.validate(data, Schema) // Validates as true.

// Or like this.
Schema.init(data).validate() // Valides as true.

// Or even like this.
var schema = Duns.number();
schema.validate(100); // Validates as true.
```

Duns can also assist in formatting values given a schema.

```
    var Schema = Duns.object().keys({
      age: Duns.number().returns(function(age) {
        returns age * 2;
      }),

      name : Duns.string().returns(function(name) {
        returns name + '!';
      }),
    });

    Schema.init({ age:20, name: 'test' }).format();
    //Returns { age:40, name: 'test!' }
```

### Duns
* Duns.validate(object,Schema) - validates a object, given a schema. Returns true on success, false otherwise.
* Duns.assert(object,Schema) - Like validate, but throws if validation fails.
* Duns.error() - returns last error message after validation.

### Duns.any 
- Matches all values except null and undefined, if not otherwise stated.
- All of these methods are shared amongst all validators. 

#### Validation methods
* validate(value) - Validates 'value' against schema. Returns true or false.
* invalid(value) - Validates 'value' against schema but returns true if schema could not be validated.
* assert(value) - Like validate, but throws if validation fails.
* oneOf(schema[]) - Accepts one or more schemas - that must validate.
* disallow(value) - Disallows exact 'value' in schema.
* allow(value) - Makes schema alwasy validate true for 'value'.
* required() - Forces key in schema to be defined(default).
* optional() - Makes key in schema optional.
* forbidden() - Forbidds key to exist in schema.
* custom(callback) - Makes it possible to add a custom validation method. 'Callback' will be called with all schema values. 
    - Must return a boolean. If 'callback' returns false, forces schema validation to fail.
* extend(obj) - Extends schema with obj. Every key in obj will be added as a custom validaiton method, that can be reused.

```
var schema = Duns.any().extend({
  isBetween : function(val, min, max) {
    return val < max && val > min;
  }
});

schema.isBetween(10, 20);
schema.validate(15) // returns true.
```

#### Formatting methods
* returns(callback) - Defines a callback to be executed on 'format()'. Values will be set to what callback returns.
* format() - Formats schema. Runs all given callbacks, defined with 'returns()' on schema values and returns formatted values. 
    - If no given callback exist, just returns original value.

### Duns.bool
Must either be true or false. Extends Duns.any.

#### Validation methods
* mustBeTrue  - forces value to only be === true.
* mustBeFalse - forces value to only be === false.

### Duns.number
Must be number. Extends Duns.any.
* max(max)    - no more than max.
* min(min)    - no less than min.
* greater(gr) - must be greater than gr.
* less(le)    - must be less than le.
* positive()  - must be positive( > 0).
* negative()  - must be negative( < 0).

### Duns.string
Must be string. Extends Duns.any.
* maxlen(max)  - length can be no more than max.
* minlen(min)  - length can be no less than min.
* length(le)   - lenght must be exactly === le.
* email(email) - must be RFC822 valid email.
* oneOf()      - Must match one of arguments. For instance, Duns.string().oneOf('test1','test2') creates a schema that must match either 'test1' or 'test2'.

### Duns.array
Must be array. Extends Duns.any.
* items([])      - an array of schemas, one of these must be valid for all items in data.
* min(min)       - minimum length of array
* max(max)       - max length of array
* length(length) - length of array

### Duns.object
Must be object. Extends Duns.any.
* keys() - creates a nested schema, where each key must be a schema.
* allowAllKeys() - Allows none defined keys to exist in object.
* returns(callback) - Defines a callback to be executed on 'format()'. Values will be set to what callback returns.
    - 'callback' is executed with (val, siblings), where 'siblings' is an object with all siblings.

### Duns.date
Must be valid date. Extends Duns.any. Uses moment.js internally.
* max(max) - Date can't be after max.
* min(min) - Date can't be before min.
* pattern(pattern) - Defines what pattern date is in. Used to handle illegal date formats. e.g 'YYYYMMDD'.
* returns(callback/pattern) - Like any.returns, but if param is a pattern, formats date according to pattern.
