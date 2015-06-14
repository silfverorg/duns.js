import _ from 'underscore';
import AnyValidator from './any_validator';
import isEmail from '../is_email';

class StringValidator extends AnyValidator {
  constructor(value) {
    super(value);
    this.type = 'Duns-string-validator';
    this._clear();
  }

  _clear() {
    this.props = {
      max: null,
      min: null,
      useEmail: null,
      disallowed: [
        '',
      ],
      allowed: [],
      exactLength: null,
      oneOf: null,
    };
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
    if (_(val).isArray()) {
      this.props.allowed = this.props.allowed.concat(val);
    } else {
      this.props.allowed.push(val);
    }

    return this;
  }

  deny(val) {
    if (_(val).isArray()) {
      this.props.disallowed = this.disallowed.concat(val);
    } else {
      this.props.disallowed.push(val);
    }

    return this;
  }

  /**
  * Validates param.
  *
  * @author Niklas Silfverström<niklas@silfverstrom.com>
  * @since 1.0.0
  * @version 1.0.0
  */
  validate(arg) {
    const param = arg || this.value;
    const props = this.props;

    if (_(param).isString() === false) {
      return this.fail('Value is not string');
    }

    if (_(props.allowed).contains(param)) {
      return true;
    }

    if (_(props.disallowed).contains(param) && _(props.allowed).contains(param) === false) {
      return this.fail('Value is blacklisted');
    }

    if (props.max && param.length > props.max) {
      return this.fail('Argument length is larger than allowed');
    }

    if (props.min && param.length < props.min) {
      return this.fail('Argument length is less than allowed');
    }

    if (props.exactLength && param.length !== props.exactLength) {
      return this.fail('Argument has invalid length');
    }

    if (props.oneOf && !_(props.oneOf).contains(param)) {
      return this.fail('Misses value');
    }

    if (props.useEmail && isEmail(param) === false) {
      return this.fail('Argument is not valid RFC822 email');
    }

    return true;
  }

}

export default StringValidator;
