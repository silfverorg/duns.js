var DunsSchema = {
    type : 'duns-schema',
    init : function() {
        this.val = {};
    },
    build : function(key,type) {
        this.val[key] = type;
    },
    get : function(key) {
        var ob = this.val[key];
        if(ob === undefined) {
            throw "Not allowed";
        }
        return ob;
    }
};

module.exports = DunsSchema;
