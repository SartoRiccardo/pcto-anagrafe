import React, {Component, Fragment} from "react";
// HOCs and actions
import {connect} from "react-redux";
// Custom components
import StructureEnumField from "../structure/StructureEnumField";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

/**
 * A single field to write a query for an attribute.
 *
 * Fetches data from the activity state.
 *
 * @param {int}      props.id         The component ID, redundant if initState is present.
 * @param {Search}   props.initState  The state to initialize the component.
 * @param {Field[]}  props.options    A list of searchable fields.
 * @param {function} props.onDelete   A handler for when the field gets deleted.
 * @param {function} props.onChange   A handler for when the field state changes.
 */
class SearchField extends Component {
  constructor(props) {
    super(props);

    this.state = this.props.initState ? {
      ...this.props.initState
    } : {
      id: this.props.id,
      field: this.props.options[0],
      value: "",
    };
  }

  changeField = (evt) => {
    const {options, activities} = this.props;
    let newField = null;
    for (let i = 0; i < options.length; i++) {
      if (options[i].id === parseInt(evt.target.value)) {
        newField = options[i];
        break;
      }
    }

    let newValue = this.state.value;
    const fixedValues = StructureEnumField.regex.test(newField.regex);
    if(fixedValues) {
      newValue = newField.regex.substring(1, newField.regex.length-1).split("|")[0];
    }
    else if(newField.id === -1) {
      newValue = activities[0].id;
    }

    this.setState({
      field: newField,
      value: newValue,
    }, () => {
      this.notifyChange();
    })
  }

  changeHandler = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    }, () => {
      this.notifyChange();
    });
  }

  deleteSearchField = (evt) => {
    if(this.props.onDelete) {
      this.props.onDelete({
        target: this,
      });
    }
  }

  notifyChange = () => {
    if(this.props.onChange) {
      this.props.onChange({
        id: this.state.id,
        target: this,
      });
    }
  }

  render() {
    const {field, value} = this.state;
    const {options, activities} = this.props;
    const optionsUi = options.map((o) => {
      return <option key={o.id} value={o.id}>{o.name}</option>;
    });

    const fixedValues = StructureEnumField.regex.test(field.regex);
    let input = null;
    if(field.id === -1) {
      const formOptions = activities.map((a) => {
        return <option key={a.id} value={a.id}>{a.name}</option>
      });
      input = (
        <FormControl as="select" name="value" className="my-2 my-md-0" value={value} onChange={this.changeHandler}>
          {formOptions}
        </FormControl>
      );
    }
    else if(fixedValues) {
      const formOptions = field.regex.substring(1, field.regex.length-1).split("|").map((opt) => {
        return <option key={opt} value={opt}>{opt}</option>
      });
      input = (
        <FormControl as="select" name="value" className="my-2 my-md-0" value={value} onChange={this.changeHandler}>
          {formOptions}
        </FormControl>
      );
    }
    else {
      input = (
        <FormControl
          name="value"
          className="my-2 my-md-0"
          placeholder="Cerca..."
          value={value}
          onChange={this.changeHandler}
        />
      );
    }

    return (
      <Fragment>
        <Col xs={{order:1}} md={{order: 1, span:"auto"}}>
          <FormControl as="select" name="field" onChange={this.changeField} value={field ? field.id : 0}>
            {optionsUi}
          </FormControl>
        </Col>

        <Col xs={{order:3, span:12}} md={{order:2, span:5}}>
          {input}
        </Col>

        <Col xs={{order:2, span:"auto"}} md={{order:3, span:"auto"}}>
          <Button onClick={this.deleteSearchField} variant="primary">
            <FontAwesomeIcon icon={faMinus} />
          </Button>
        </Col>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    activities: state.activity.activities.sort((a, b) => {
      return a.name.localeCompare(b.name);
    }),
  };
}

export default connect(mapStateToProps)(SearchField);
