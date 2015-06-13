import _ from 'underscore';
import moment from 'moment';


/**
 * Validator for dates.
 *
 * @version 1.0.0
 * @since 0.0.3
 */
class DateValidator {

  constructor() {
    this.type = 'Duns-date-validator';
    this._clear();
  }

  _clear() {
    this.props = {
      max: null,
      min: null,
      format: null,
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
   * The format of the date provided.
   *
   * @name format
   * @function
   * @version 1.0.0
   * @since 1.0.0
   * @access public
   * @example Duns.date().format('YYYYMMDD')
   * @param {string} format
   * @return {DateValidator}
   */
  format(format) {
    this.props.format = format;
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
    //Validate base value. See if it's a valid date or not. If format is defined, we need to consider this.
    if (this.props.format && moment(param, this.props.format).isValid() === false || !this.props.format && moment(new Date(param)).isValid() === false) {
      throw new Error('Not a valid date');
    }

    var date = moment(param, this.props.format);

    if (this.props.max && date.isAfter(this.props.max)) throw new Error('Larger than allowed');

    if (this.props.min && date.isBefore(this.props.min)) throw new Error('Smaller than allowed');

    if (this.props.partials.length) {
      _(this.props.partials).each((partial) => {
        if (date.get(partial.type) !== partial.value) throw new Error('Invalid partial');
      });
    }

    return true;
  }
}

export default DateValidator;
