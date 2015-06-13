var _ = require('underscore');

class DunsSchema {
  constructor() {
    this.data = {};
    this.val  = {};
    this.type = 'Duns-schema';
  }

  build(key, type) {
    this.val[key] = type;
  }

  get(key) {
    let ob = this.val[key];
    if (ob === undefined) {
      throw 'Not allowed';
    }

    return ob;
  }

  init(param) {
    this.data = param;

    return this;
  }

  format() {
    return _(this.data).mapObject((val, key) => {
      var Schema = this.get(key);
      return _(Schema.format).isFunction() ? Schema.init(val).format() : val;
    });

  }

}

export default DunsSchema;
