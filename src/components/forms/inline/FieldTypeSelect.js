import React, {Component} from "react";

import Form from "react-bootstrap/Form";

class FieldTypeSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.default,
    };
  }

  changeHandler = (evt) => {
    let newVal = evt.target.value
    this.setState({
      selected: newVal,
    }, () => {
      if(this.props.onChange) {
        this.props.onChange(parseInt(newVal));
      }
    });
  }

  render() {
    const options = this.props.options.map((o, i) => {
      return <option key={i} value={i}>{o}</option>
    })

    return (
      <Form>
        <Form.Label>Valori del campo</Form.Label>
        <Form.Control as="select" value={this.state.selected} onChange={this.changeHandler}>
          {options}
        </Form.Control>
      </Form>
    );
  }
}

export default FieldTypeSelect;
