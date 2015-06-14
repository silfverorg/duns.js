import _ from 'underscore';
import AnyValidator from './any_validator';

class ArrayValidator extends AnyValidator {
  constructor(param) {
    super(param);
    this.type = 'Duns-array-validator';
    this._clear();
  }

  _clear() {
    this.props = {
      min: 0,
      max: null,
      le: null,
      items: null,
    };
    return this;
  }

  min(val) {
    this.props.min = val;
    return this;
  }

  max(val) {
    this.props.max = val;
    return this;
  }

  length(len) {
    this.props.len = len;
    return this;
  }

  items(items) {
    this.props.items = items;
    return this;
  }

  validate(arg) {
    let param = arg || this.value;
    const props = this.props;
    if (_(param).isArray() == false) {
      return this.fail('Not array');
    }

    if (props.min && param.length < props.min) {
      return this.fail('Length not large enough');
    }

    if (props.max && param.length > props.max) {
      return this.fail('Length larger than max');
    }

    if (props.len && param.length !== props.len) {
      return this.fail('Length does not equal schema length');
    }

    if (props.items) {
      try {
        _(param).each((item) => {
          let oneOf = _(props.items).some((schema) => {
            try {
              return !!schema.validate(item);
            } catch (err) {
              return false;
            }
          });

          if (oneOf === false) {
            throw 'Did not match ';
          }
        });
      } catch (err) {
        return this.fail(err);
      }
    }

    return true;
  }

  format() {
    if (_(this.formattFunc).isFunction()) {
      return _(this.value).map((item) => this.formattFunc(item));
    }

    return this.value;
  }

}

export default ArrayValidator;
