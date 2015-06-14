import _ from 'underscore';

class AnyValidator {
  constructor(val) {
    this.type = 'Duns-any-validator';
    this._clear();

    this.value = val;
  }

  _clear() {
    this.value       = null;
    this.formattFunc = null;
    this.fail        = null;
    this.props = {
      disallow: null,
      allow: null,
      oneOf: null,
    };
    return this;
  }

  fail(err) {
    this.fail = err;
    return false;
  }

  oneOf(...args) {
    this.props.oneOf = [];
    if (args.length) {
      _(args).map((arg) => {
        if (_(arg).isArray()) {
          this.props.oneOf.concat(arg);
        } else {
          this.props.oneOf.push(arg);
        }
      });

    }

    return this;
  }

  disallow(dis) {
    if (this.props.disallow === null) {
      this.props.disallow = [];
    }

    this.props.disallow = this.props.disallow.concat(dis);
    return this;
  }

  allow(allow) {
    if (this.props.allow === null) {
      this.props.allow = [];
    }

    this.props.allow = this.props.allow.concat(allow);
    return this;
  }

  returns(param) {
    if (_(param).isFunction()) {
      this.formattFunc = param;
    }

    return this;
  }

  init(param) {
    this.value = param;
    return this;
  }

  format() {
    if (_(this.formattFunc).isFunction()) {
      return this.formattFunc(this.value);
    }

    return this.value;
  }

  validate(param) {
    const props = this.props;

    //Always allow whitelist values
    if (props.allow && _(props.allow).contains(param)) return true;

    if (param === null || param === undefined) return false;
    if (props.disallow && _(props.disallow).contains(param))
      throw new Error('Value is blacklisted');
    if (props.oneOf && _(props.oneOf).isArray()) {
      let ok = false;
      for (let x = 0; x < props.oneOf.length; x++) {
        let schema = props.oneOf[x];
        ok = schema.validate(param);
        if (ok) break;
      }

      if (ok === false) {
        throw new Error('Not one of schemas');
      }
    }

    return true;
  }
}

export default AnyValidator;
