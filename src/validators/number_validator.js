import _ from 'underscore';
import AnyValidator from './any_validator';

let NumberExtension = {};

class NumberValidator extends AnyValidator {

  constructor(val) {
    super(val);
    this.type = 'Duns-object-validator';
    this._clear();
    this.extension = NumberExtension;
  }

  _clear() {
    this.props = {
      extension: {},
      max: null,
      min: null,
      greater: null,
      less: null,
      positive: null,
      negative: null,
      custom: [],
    };
    return this;
  }

  max(val) {
    this.props.max = val;
    return this;
  }

  min(val) {
    this.props.min = val;
    return this;
  }

  //greaterThan? Alias?
  greater(val) {
    this.props.greater = val;
    return this;
  }

  //lessThan? Alias?
  less(val) {
    this.props.less = val;
    return this;
  }

  positive() {
    this.props.positive = true;
    return this;
  }

  negative() {
    this.props.negative = true;
    return this;
  }

  validate(arg) {
    if (!super.validate(arg)) return false;
    var param = arg || this.value;
    if (_(param).isNumber() == false) {
      return this.fail('Not number');
    }

    if (this.props.max && param > this.props.max) {
      return this.fail('Number does not fit max-constraint');
    }

    if (this.props.min && param < this.props.min) {
      return this.fail('Number does not fit min-constraint');
    }

    if (this.props.less && param > this.props.less) {
      return this.fail('Invalid length');
    }

    if (this.props.greater && param < this.props.greater) {
      return this.fail('Invalid length');
    }

    if (this.props.negative && param >= 0) {
      return this.fail('Not negative');
    }

    if (this.props.positive && param < 0) {
      return this.fail('Not positive');
    }

    //Loop through added custom vals
    try {
      _.each(_(this.props.extension).keys(), (key) => {
        let method = this.props.extension[key];
        let res = method.func.apply(this, [].concat(param, method.args));
        if (!res) {
          throw 'Custom failed'
        }
      });
    } catch (err) {
      return this.fail(err);
    }

    return true;
  }

}

export default NumberValidator;
