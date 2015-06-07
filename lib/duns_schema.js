"use strict";

var DunsSchema = {
    type: "duns-schema",
    init: function init() {
        this.val = {};
    },
    build: function build(key, type) {
        this.val[key] = type;
    },
    get: function get(key) {
        var ob = this.val[key];
        if (ob === undefined) {
            throw "Not allowed";
        }
        return ob;
    }
};

module.exports = DunsSchema;