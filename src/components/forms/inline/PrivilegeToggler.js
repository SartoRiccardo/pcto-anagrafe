import React, {Component} from "react";
// Bootstrap
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

class PrivilegeToggler extends Component {
  constructor(props) {
    super(props);

    const {selected} = this.props;
    this.state = {
      selected: selected ? selected : [],
    };
  }

  changeHandler = (evt) => {
    const {onChange, onSelect, onBlur} = this.props;
    const {selected} = this.state;

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
      return <ToggleButton key={o} variant="secondary" value={o}>{o.replace("_", " ")}</ToggleButton>
    });

    return (
      <ToggleButtonGroup type="checkbox" defaultValue={selected} onChange={this.changeHandler}>
        {buttons}
      </ToggleButtonGroup>
    );
  }
}

export default PrivilegeToggler;
