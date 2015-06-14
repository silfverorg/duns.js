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
    this.failure     = null;
    this.props = {
      disallow: null,
      allow: null,
      oneOf: null,
      custom: [],
    };
    return this;
  }

  fail(err) {
    this.failure = err;
    return false;
  }

  custom(cb) {
    if (_(cb).isFunction()) {
      this.props.custom.push(cb);
    }

    return this;
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

  validate(arg) {
    const param = (arg === undefined) ? this.value : arg;
    const props = this.props;

    //Always allow whitelist values
    if (props.allow && _(props.allow).contains(param)) return true;

    if (param === null || param === undefined) return false;

    if (props.disallow && _(props.disallow).contains(param)) {
      return this.fail('Value is blacklisted');
    }

    if (props.custom && props.custom.length > 0) {
      for (let i = 0; i < props.custom.length; i++) {
        const cb = props.custom[i];
        const res = cb(param);
        if (!res) return this.fail('cb not validated');
      }
    }

    if (props.oneOf && _(props.oneOf).isArray()) {
      try {
        let ok = false;
        for (let x = 0; x < props.oneOf.length; x++) {
          let schema = props.oneOf[x];
          ok = schema.validate(param);
          if (ok) break;
        }

        if (ok === false) {
          return this.fail('Not one of schemas');
        }
      } catch (err) {
        return this.fail('Not one of schemas');
      }
    }

    return true;
  }

  /**
  * Asserts that object is valid according to schema, throws otherwise.
  *
  * Exactly like validate, but instead of returning false throws an exception.
  *
  * @param param optional - parameter to validate.
  * @author Niklas Silfverström<niklas@silfverstrom.com>
  * @since 1.0.0
  * @version 1.0.0
  */
  assert(param) {
    if (!this.validate()) {
      throw new Error('Did not validate');
    }

    return true;
  }
}

export default AnyValidator;
