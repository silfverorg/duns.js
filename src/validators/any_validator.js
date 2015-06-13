import _ from 'underscore';

class AnyValidator {
  constructor() {
    this.type = 'Duns-any-validator';
    this._clear();
  }

  _clear() {
    this.value       = null;
    this.formattFunc = null;
    this.props = {
      disallow: null,
    };
    return this;
  }

  disallow(dis) {
    if (this.props.disallow === null) {
      this.props.disallow = [];
    }

    this.props.disallow = this.props.disallow.concat(dis);
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
    if (param === null || param === undefined) return false;
    if (props.disallow && _(props.disallow).contains(param))
      throw new Error('Value is blacklisted');

    return true;
  }
}

export default AnyValidator;
