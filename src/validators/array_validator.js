import _ from 'underscore';
import DunsSchema from '../duns_schema';

class ArrayValidator {
  constructor() {
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

  validate(param) {
    var props = this.props;
    if (_(param).isArray() == false) throw new Error('Not array');

    if (props.min && param.length < props.min) throw new Error('Length not large enough');

    if (props.max && param.length > props.max) throw new Error('Length larger than max');

    if (props.len && param.length !== props.len) throw new Error('Length does not equal schema length');

    if (props.items) {
      _(param).each((item) => {
        let oneOf = _(props.items).some((schema) => {
          try {
            return !!schema.validate(item);
          } catch (err) {
            return false;
          }
        });

        if (oneOf === false) {
          throw new Error('Did not match ');
        }
      });
    }

    return true;
  }

}

export default ArrayValidator;
