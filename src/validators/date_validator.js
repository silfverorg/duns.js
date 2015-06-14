import _ from 'underscore';
import moment from 'moment';


/**
 * Validator for dates.
 *
 * @version 1.0.1 -- added formatting methods.
 * @since 0.0.3
 */
class DateValidator {

  constructor() {
    this.type = 'Duns-date-validator';
    this._clear();
  }

  _clear() {
    this.value       = null;
    this.formattFunc = null;
    this.props = {
      max: null,
      min: null,
      pattern: null,
      partials: [],
    }
  }

  /**
   * The maximum date the provided value can be.
   *
   * @name max
   * @function
   * @version 1.0.0
   * @since 1.0.0
   * @access public
   * @example Duns.date().max('2015-01-01')
   * @param {string} max The maximum date
   * @return {DateValidator}
   */
  max(max) {
    this.props.max = max;
    return this;
  }

  /**
   * The minimum date the provided value can be.
   *
   * @name min
   * @function
   * @version 1.0.0
   * @since 1.0.0
   * @access public
   * @example Duns.date().min('2015-01-01')
   * @param {string} min The minimum date
   * @return {DateValidator}
   */
  min(min) {
    this.props.min = min;
    return this;
  }

  /**
   * The pattern of the date provided.
   *
   * @name pattern
   * @function
   * @version 1.0.0
   * @since 1.0.0
   * @access public
   * @example Duns.date().pattern('YYYYMMDD')
   * @param {string} pattern
   * @return {DateValidator}
   */
  pattern(pattern) {
    this.props.pattern = pattern;
    return this;
  }

  /**
   * Partials use `moment.get` to validate the given type with the given value.
   *
   * @name partial
   * @function
   * @version 1.0.0
   * @since 1.0.0
   * @access public
   * @example Duns.date().partial('year', 2015)
   * @param {string} type This is the type of the date. E.g year, month, day, date. See `moment.get` for more info.
   * @param {number} value The value the type must be.
   * @return {DateValidator}
   */
  partial(type, value) {
    this.props.partials.push({
      type,
      value,
    });
    return this;
  }

  validate(param) {
    //Validate base value. See if it's a valid date or not. If pattern is defined, we need to consider this.
    if (this.props.pattern && moment(param, this.props.pattern).isValid() === false || !this.props.pattern && moment(new Date(param)).isValid() === false) {
      throw new Error('Not a valid date');
    }

    let date = moment(param, this.props.pattern);

    if (this.props.max && date.isAfter(this.props.max)) throw new Error('Larger than allowed');

    if (this.props.min && date.isBefore(this.props.min)) throw new Error('Smaller than allowed');

    if (this.props.partials.length) {
      _(this.props.partials).each((partial) => {
        if (date.get(partial.type) !== partial.value) throw new Error('Invalid partial');
      });
    }

    return true;
  }

  /**
  * Defines a formatting method.
  *
  * @param param - Can be either callback or valid date-format.
  *   - If callback, formats value according to return.
  *   - If string, formats value according to date-format. Can be any valid  *    moment-format.
  * @author Niklas Silfverström
  * @since 1.0.1
  * @version 1.0.0 -- Initial
  */
  returns(param) {
    if (_(param).isFunction()) {
      this.formattFunc = param;
    } else if (_(param).isString()) {
      this.formattFunc = (val) => {
        const props = this.props;
        const date = (props.pattern) ? moment(val, props.pattern) : moment(val);
        return date.format(param);
      }
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
}

export default DateValidator;
