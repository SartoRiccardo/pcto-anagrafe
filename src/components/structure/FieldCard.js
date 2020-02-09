import React, {Component} from "react";
import StructureEnumField from "./StructureEnumField";
import FieldTypeSelect from "../forms/inline/FieldTypeSelect";
import RegExpModifier from "../forms/inline/RegExpModifier";
import {ReactComponent as Pencil} from "../../img/pencil.svg";
import {ReactComponent as Trash} from "../../img/trash.svg";

import Card from "react-bootstrap/Card";

/**
 * A section where you can edit a column.
 *
 * @author Riccardo Sartori
 *
 * @param {Field} props.field  The field's initial state.
 */
class FieldCard extends Component {
  constructor(props) {
    super(props);

    this.choices = [
      {name: "REGEX", default:".+"},
      {name:"ENUM", default:"()"},
    ];
    this.defaultType = 0;
    this.state = {
      fieldType: 0,
    };

    const {field} = this.props;
    const multipleValueRegex = /^\([^?].*\)$/;
    if(multipleValueRegex.exec(field.regex)) {
      this.state.fieldType = 1;
      this.defaultType = 1;
    }

    for (let i = 0; i < this.choices.length; i++) {
      if(this.state.fieldType === i) {
        this.state[this.choices[i].name] = {...field};
      }
      else {
        this.state[this.choices[i].name] = {
          ...field,
          regex: this.choices[i].default,
        };
      }
    }
  }

  notifyChange = () => {
    if(this.props.onChange) {
      const {fieldType} = this.state;
      const selected = this.choices[fieldType].name;
      this.props.onChange(this.state[selected]);
    }
  }

  updateFieldType = (i) => {
    if(i >= 0 && i < this.choices.length) {
      this.setState({
        fieldType: i,
      }, this.notifyChange);
    }
  }

  handleChange = (evt) => {
    const {fieldType} = this.state;
    const selected = this.choices[fieldType].name;
    this.setState({
      [selected]: evt.field,
    }, this.notifyChange);
  }

  render() {
    const {fieldType} = this.state;
    const {field} = this.props;

    let cardBody;
    const selected = this.choices[fieldType].name;
    switch(selected) {
      case "ENUM":
        cardBody = <StructureEnumField field={this.state[selected]} onChange={this.handleChange} />;
        break;

      case "REGEX":
      default:
        cardBody = <RegExpModifier field={this.state[selected]} onChange={this.handleChange} />;
        break;
    }

    const choiceNames = this.choices.map((o) => {
      return o.name;
    });
    const hasBeenModified = (
      this.defaultType !== this.state.fieldType
      || !(this.state[selected].name === field.name
      && this.state[selected].regex === field.regex)
    );
    return (
      <Card className="my-3">
        <Card.Header className={hasBeenModified ? "field-modified" : null}>
          {field.name + " "}
          <Pencil className="icon-button" />{" "}
          <Trash className="icon-button" />
        </Card.Header>

        <Card.Body>
          <FieldTypeSelect onChange={this.updateFieldType} default={fieldType} options={choiceNames} />
          <hr />

          {cardBody}
        </Card.Body>
      </Card>
    );
  }
}

export default FieldCard;
