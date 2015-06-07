import _ from 'underscore';

class StringValidator {
  constructor() {
    this.type = 'Duns-string-validator';
    this._clear();
  }

  _clear() {
    this.props = {
      max         : null,
      min         : null,
      useEmail    : null,
      disallowed  : [''],
      allowed     : [],
      exactLength : null,
      oneOf       : null
    };
    return this;
  }

  oneOf(...args) {
    this.props.oneOf = [];
    if (args.length) {
      _(args).map( (arg) => {
        if (_(arg).isArray()) {
          this.props.oneOf.concat(arg);
        } else {
          this.props.oneOf.push(arg);
        }
      });
    }

    return this;
  }

  maxlen(max) {
    this.props.max = max;
    return this;
  }

  minlen(min) {
    this.props.min = min;
    return this;
  }

  length(len) {
    this.props.exactLength = len;
    return this;
  }

  email() {
      this.props.useEmail = true;
      return this;
  }

  allow(val) {
      if (_(val).isArray() ) {
          this.props.allowed = this.disallowed.concat(val);
      } else {
          this.props.allowed.push(val);
      }

      return this;
  }

  deny(val) {
      if (_(val).isArray() ) {
          this.props.disallowed = this.disallowed.concat(val);
      } else {
          this.props.disallowed.push(val);
      }

      return this;
  }

  validate(param) {
      let props = this.props;
      if (_(param).isString() === false) throw new Error('Value is not string');

      if (_(props.disallowed).contains(param) && _(props.allowed).contains(param) === false ) {
          throw new Error('Value is blacklisted');
      }

      if (props.max && param.length > props.max) throw new Error('Argument length is larger than allowed');

      if (props.min && param.length < props.min) throw new Error('Argument length is less than allowed');

      if (props.exactLength && param.length !== props.exactLength) throw new Error('Argument has invalid length');

      if (props.oneOf && !_(props.oneOf).contains(param) ) {
          throw new Error('Misses value');
      }

      if (props.useEmail && isEmail(param) === false) {
          throw new Error('Argument is not valid RFC822 email');
      }

      return true;
  }

}

export default StringValidator;
