import React, {Component, Fragment} from "react";
import StructureEnumField from "./StructureEnumField";
import FieldTypeSelect from "../forms/inline/FieldTypeSelect";
import RegExpModifier from "../forms/inline/RegExpModifier";
import GenericModifier from "../forms/inline/GenericModifier";
import {ReactComponent as Pencil} from "../../img/pencil.svg";
import {ReactComponent as Trash} from "../../img/trash.svg";
import {ReactComponent as Restore} from "../../img/restore.svg";

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

    const {field} = this.props;
    this.choices = [
      {name: "REGEX", default:".+"},
      {name:"ENUM", default:"()"},
    ];
    this.defaultType = 0;
    this.state = {
      fieldType: 0,
      changingName: false,
      name: field.name,
      deleted: false,
    };

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
      const {fieldType, name} = this.state;
      const selected = this.choices[fieldType].name;
      this.props.onChange({
        ...this.state[selected],
        name: this.state.name
      });
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

  changeName = (evt) => {
    const name = evt.value;
    this.setState({
      name,
      changingName: false,
    }, this.notifyChange);
  }

  startChangingName = (evt) => {
    this.setState({
      changingName: true,
    });
  }

  deleteSelf = (evt) => {
    this.setState({
      deleted: true,
    }, () => {
      const {fieldType} = this.state;
      const selected = this.choices[fieldType].name;
      if(this.props.onDelete) {
        this.props.onDelete(this.state[selected]);
      }
    });
  }

  restoreSelf = (evt) => {
    this.setState({
      deleted: false,
    }, () => {
      const {fieldType} = this.state;
      const selected = this.choices[fieldType].name;
      if(this.props.onRestore) {
        this.props.onRestore(this.state[selected]);
      }
    });
  }

  render() {
    const {fieldType, changingName, name, deleted} = this.state;
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
      || !(this.state.name === field.name
      && this.state[selected].regex === field.regex)
    );

    let body = (
      <Card.Body>
        <FieldTypeSelect onChange={this.updateFieldType} default={fieldType} options={choiceNames} />
        <hr />

        {cardBody}
      </Card.Body>
    );

    let header;
    if(changingName) {
      header = (
        <GenericModifier value={name} validator={str => str.length > 0} onFinish={this.changeName} />
      );
    }
    else if(deleted) {
      header = (
        <Fragment>
          {name + " "}
          <Restore className="icon-button" onClick={this.restoreSelf} />
        </Fragment>
      );
      body = null;
    }
    else {
      header = (
        <Fragment>
          {name + " "}
          <Pencil className="icon-button" onClick={this.startChangingName} />{" "}
          <Trash className="icon-button" onClick={this.deleteSelf} />
        </Fragment>
      );
    }

    let headerClass = null;
    if(hasBeenModified) {headerClass = "field-modified";}
    if(deleted) {headerClass = "field-deleted";}
    return (
      <Card className="my-3">
        <Card.Header className={headerClass}>
          {header}
        </Card.Header>

        {body}
      </Card>
    );
  }
}

export default FieldCard;
