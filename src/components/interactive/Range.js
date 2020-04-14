import React from "react";

class Range extends React.Component {
  constructor(props) {
    super(props);

    const { defaultValue, value } = this.props;
    this.state = {
      value: defaultValue || value || 0,
    }
  }

  onChange = (evt) => {
    const value = parseInt(evt.target.value);
    if(value !== this.state.value) {
      this.setState(
        { value },
        () => this.props.onChange && this.props.onChange(this.state.value)
      );
    }
  }

  render() {
    const { value, className, min, max } = this.props;

    return (
      <div className={`slider ${className}`}>
        <input type="range" value={value || this.state.value}
            min={min || 0} max={max || 100}
            onChange={this.onChange} />
      </div>
    );
  }
}

export default Range;
