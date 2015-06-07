import _ from 'underscore';

import DunsSchema from '../duns_schema';

let NumberExtension = {};

class NumberValidator {

  constructor() {
    this.type = 'Duns-object-validator';
    this._clear();
    this.extension = NumberExtension;
  }

  _clear() {
    this.props = {
      extension : {},
      max       : null,
      min       : null,
      greater   : null,
      less      : null,
      positive  : null,
      negative  : null,
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

  // FIXME
  extend(extension) {
    console.error("EXTEND", NumberValidator.prototype);
    _.each(_(extension).keys(), (key) => {
        let func = extension[key];
        NumberValidator.prototype[key] = (...args) => {
          this.props.extension[key] = { args : args, func : func }; 
          return this;
        }
    });
  }

  validate(param) {
      if ( _(param).isNumber() == false) throw new Error('Not number');

      if (this.props.max && param > this.props.max) throw new Error('Invalid length');

      if (this.props.min && param < this.props.min) throw new Error('Invalid length');

      if (this.props.less && param > this.props.less) throw new Error('Invalid length');

      if (this.props.greater && param < this.props.greater)throw new Error('Invalid length');

      if (this.props.negative && param >= 0 ) throw new Error('Not negative');
      
      if (this.props.positive && param < 0 ) throw new Error('Not positive');

      //Loop through added custom vals
      _.each(_(this.props.extension).keys(), (key) => {
          let method = this.props.extension[key];
          let res = method.func.apply(this, [param].concat(method.args));
          if(!res) { 
              throw new Error('Custom failed')
          }
      });

      return true;
  }

}

export default NumberValidator;
