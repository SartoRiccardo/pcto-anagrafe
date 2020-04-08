import React, {Component, Fragment} from "react";
// Custom Components
import StructureEnumField from "./StructureEnumField";
import FieldTypeSelect from "../forms/inline/FieldTypeSelect";
import GenericModifier from "../forms/inline/GenericModifier";
import {
  StructureEmailField,
  StructureAllField,
  StructureNumberField,
  StructureWebsiteField,
  StructureDateField,
  StructureNumericField,
  StructureAtecoField,
} from "./StructureSpecificField";
import StructureCustomField from "./StructureCustomField";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrashAlt, faUndo, faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";

/**
 * A section where you can edit a column of the table.
 *
 * @param {Field}    props.field      The field's current state.
 * @param {Field}    props.original   The field's initial state.
 * @param {Function} props.onChange   A callback for when the field is modified.
 * @param {Function} props.onDelete   A callback for when the field is deleted.
 * @param {Function} props.onRestore  A callback for when the field is un-deleted.
 */
class FieldCard extends Component {
  constructor(props) {
    super(props);

    const {field, original} = this.props;
    const currentField = field ? field : original;
    this.choices = [
      StructureNumericField,
      StructureDateField,
      StructureWebsiteField,
      StructureNumberField,
      StructureEmailField,
      StructureEnumField,
      StructureAtecoField,
      StructureCustomField,
      StructureAllField,
    ];
    this.defaultType = this.choices.length-1;
    this.state = {
      fieldType: this.defaultType,
      showing: false,
      field: currentField,
      changingName: false,
      name: currentField.name,
    };

    for(let i = 0; i < this.choices.length; i++) {
      const c = this.choices[i];
      if(c.regex.exec(currentField.regex)) {
        this.state.fieldType = i;
        this.defaultType = i;
        break;
      }
    }

    for (let i = 0; i < this.choices.length; i++) {
      if(this.state.fieldType === i) {
        this.state[this.choices[i]] = {...field};
      }
      else {
        this.state[this.choices[i]] = {
          ...field,
          regex: this.choices[i].default,
        };
      }
    }
  }

  notifyChange = () => {
    if(this.props.onChange) {
      const {fieldType} = this.state;
      const selected = this.choices[fieldType];
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

  /**
   * An event handler passed down to the card bodies.
   *
   * @param {Field} evt.field  The updated field.
   */
  handleChange = (evt) => {
    const {fieldType} = this.state;
    const selected = this.choices[fieldType];
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
    const {fieldType} = this.state;
    const selected = this.choices[fieldType];
    if(this.props.onDelete) {
      this.props.onDelete(this.state[selected]);
    }
  }

  restoreSelf = (evt) => {
    const {fieldType} = this.state;
    const selected = this.choices[fieldType];
    if(this.props.onRestore) {
      this.props.onRestore(this.state[selected]);
    }
  }

  undoChanges = (evt) => {
    const {original} = this.props;
    if(!original) {
      return;
    }

    this.setState({
      fieldType: this.defaultType,
      field: original,
      name: original.name,
    }, () => {
      this.notifyChange();
    });
  }

  expandField = () => {
    this.setState({
      showing: true,
    });
  }

  collapseField = () => {
    this.setState({
      showing: false,
    });
  }

  render() {
    const {fieldType, showing, field, changingName, name} = this.state;
    const deleted = this.props.field === null && this.props.original;

    const StructureField = this.choices[fieldType];
    const cardBody = <StructureField field={this.state[StructureField]} onChange={this.handleChange} />;

    const choiceNames = this.choices.map((o) => {
      return o.fieldTypeName;
    });

    const isNew = this.props.field && this.props.original === null;
    const hasBeenModified = (
      isNew
      || this.defaultType !== this.state.fieldType
      || !(this.state.name === field.name
      && this.state[StructureField].regex === field.regex)
    );

    let body = (
      <Collapse in={showing} mountOnEnter={true} unmountOnExit={true}>
        <div>
          <Card.Body>
            <FieldTypeSelect onChange={this.updateFieldType} value={fieldType} options={choiceNames} />
            <hr />

            {cardBody}
          </Card.Body>
        </div>
      </Collapse>
    );

    let header;
    if(changingName) {
      header = (
        <GenericModifier value={name} validator={(str) => str.length > 0} onFinish={this.changeName} />
      );
    }
    else if(deleted) {
      header = (
        <Fragment>
          <FontAwesomeIcon icon={faUndo} className="icon-button mr-2" onClick={this.restoreSelf} />
          {name}
        </Fragment>
      );
      body = null;
    }
    else {
      const caret = showing ? (
        <FontAwesomeIcon icon={faCaretUp} className="icon-button mr-2" onClick={this.collapseField} />
      ) : (
        <FontAwesomeIcon icon={faCaretDown} className="icon-button mr-2" onClick={this.expandField} />
      );
      header = (
        <Fragment>
          {caret}
          {name}
          <FontAwesomeIcon icon={faPen} className="icon-button mx-2" onClick={this.startChangingName} />
          <FontAwesomeIcon icon={faTrashAlt} className="icon-button mr-2" onClick={this.deleteSelf} />
          {!isNew && hasBeenModified
            ? <FontAwesomeIcon icon={faUndo} className="icon-button" onClick={this.undoChanges} />
            : null}
        </Fragment>
      );
    }

    let headerClass = "";
    if(hasBeenModified) {headerClass = " field-modified";}
    if(deleted) {headerClass = " field-deleted";}

    const hasContent = showing ? "" : " no-content";

    return (
      <Card className="my-3">
        <Card.Header className={`field-header${headerClass}${hasContent}`}>
          {header}
        </Card.Header>

        {body}
      </Card>
    );
  }
}

export default FieldCard;
