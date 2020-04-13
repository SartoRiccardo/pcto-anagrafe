import React, {Component} from "react";
// Bootstrap
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

/**
 * A couple of buttons to toggle privileges for certain users.
 *
 * @param {string[]} props.select    The list of privileges to show.
 * @param {Function} props.onChange  A callback for when the state changes.
 * @param {Function} props.onSelect  A callback for when a privilege is given.
 * @param {Function} props.onBlur    A callback for when a privilege is taken out.
 */
class PrivilegeToggler extends Component {
  changeHandler = (evt) => {
    const {onChange, onSelect, onBlur, selected} = this.props;

    const difference = evt.length > selected.length ? (
      evt.filter(option => !selected.includes(option))
    ) : (
      selected.filter(option => !evt.includes(option))
    );

    let change = null;
    if(difference.length > 0) {
      change = difference[0];
    }

    if(evt.length > selected.length && onSelect) {
      onSelect(change);
    }
    else if (evt.length < selected.length && onBlur) {
      onBlur(change);
    }

    if(onChange) {
      onChange(evt);
    }

    this.setState({
      selected: evt,
    });
  }

  render() {
    const {selected, options} = this.props;

    const buttons = options.map((o) => {
      return (
        <ToggleButton key={o} variant="secondary" value={o} className="privilege-toggler">
          {o.replace("_", " ")}
        </ToggleButton>
      );
    });

    return (
      <ToggleButtonGroup type="checkbox" value={selected} onChange={this.changeHandler}>
        {buttons}
      </ToggleButtonGroup>
    );
  }
}

export default PrivilegeToggler;
