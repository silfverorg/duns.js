var Duns = require('./index');



var test = { deal : { ninja : 100 } };
var test2 = {
    deal : {
        ninja : {
            pirate : '100',
            num    :  100,
            lol : [10,20,30]
        }
    }
};
var f = Duns.object().keys({
    deal : Duns.object().keys({
        ninja : Duns.object().keys({
            pirate : Duns.string().minlen(2),
            num : Duns.number()
            .max(140).min(90).greater(90)
            .positive(),
            lol : Duns.array().min(3).max(3).length(3)
            .items([Duns.number() ])
        })
    })
});

console.log(Duns.validate(test2, f) );
console.log(Duns.error() );
