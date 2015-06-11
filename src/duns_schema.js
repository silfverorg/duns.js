class DunsSchema {
  constructor() {
    this.val = {};
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

}

export default DunsSchema;
