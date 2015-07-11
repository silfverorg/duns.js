import _ from 'underscore';
import AnyValidator from './any_validator';

/**
* Generates a schema that validates on boolean values. false/true.
*
* Note that this schema validates only exact boolean values,
* for instance 0 will not be validates as boolean.
* @class
* @author Niklas Silfverström<niklas@silfverstrom.com>
* @since 0.1.0
* @version 1.0.0 - initial.
*/
class BooleanValidator extends AnyValidator {

  constructor(val) {
    super(val);
    this.type = 'Duns-boolean-validator';
    this._clear();
  }

  clear() {
    this.props = {
      mustdBeTrue: null,
      mustBeFalse: null,
    };
  }

  mustBeTrue() {
    this.props.mustBeTrue  = true;
    this.props.mustBeFalse = false;
    return this;
  }

  mustBeFalse() {
    this.props.mustBeFalse = true;
    this.props.mustBeTrue  = false;
    return this;
  }

  validate(arg) {
    if (!super.validate(arg)) return false;
    var param = (arg !== undefined) ? arg : this.value;

    if (param !== true && param !== false) {
      return this.fail('Not a valid boolean: ', param);
    }

    if (this.props.mustBeTrue === true && param !== true) {
      return this.fail('Value is not true', param);
    }

    if (this.props.mustBeFalse === true && param !== false) {
      return this.fail('Value is not false', param);
    }

    return true;
  }
};

export default BooleanValidator;
