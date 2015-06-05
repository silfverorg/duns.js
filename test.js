var Duns = require('./src/index');



var test = { deal : { ninja : 100 } };
var test2 = {
    deal : {
        ninja : {
            pirate : '100',
            num    :  100
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
        })
    })
});

console.log(Duns.validate(test2, f) );
