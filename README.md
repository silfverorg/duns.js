# Duns.js
Duns - schema validator for javascript. 
version - 0.0.1

## Methods

Currently supports three validations, 

* Duns.object()
* Duns.number()
* Duns.string()

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
Duns.validate({ { pirate : { ninja : 'test', parrot : 100 } }) //true
```

### Duns.number
Must be number.
* max(max)    - no more than max.
* min(min)    - no less than min.
* greater(gr) - must be greater than gr.
* less(le)    - must be less than le.
* positive()  - must be positive( > 0).
* negative()  - must be negative( > 0).

### Duns.string
Must be string.
* maxlen(max)  - length can be no more than max.
* minlen(min)  - length can be no less than min.
* length(le)   - lenght must be exactly === le.
* email(email) - must be RFC822 valid email.
* allow(val)   - whitelist val.
* deny(val)    - blacklist val.

### Duns.object
Must be object.
* keys() - creates a nested schema.

