import React, {Component} from "react";
import {connect} from "react-redux";
import update from "immutability-helper";
import FieldCard from "./FieldCard";
import AddField from "../forms/inline/AddField";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import CardColumns from "react-bootstrap/CardColumns";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

/**
 * A form to edit the virtual table storing the companies' data.
 *
 * @author Riccardo Sartori
 *
 * @param {Field[]}  props.fields           The current table structure.
 * @param {function} props.updateStructure  Updates the current table structure.
 */
class EditStructure extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: [...this.props.fields],
      lastTempId: -1,
    };
  }

  handleChange = (field) => {
    const {fields} = this.state;
    let updatedFields = null;
    for(let i = 0; i < fields.length; i++) {
      if(field.id === fields[i].id) {
        updatedFields = update(fields, {[i]: {$set: {...field}}});
        fields[i] = field;
        break;
      }
    }
    if(updatedFields !== null) {
      this.setState({
        fields: updatedFields,
      });
    }
  }

  handleDelete = (field) => {
    const {fields} = this.state;
    this.setState({
      fields: fields.filter((f) => {
        return f.id !== field.id;
      }),
    });
  }

  handleRestore = (field) => {
    const {fields} = this.state;
    let newFields = [...fields, field];

    // Sorts by ID.
    for (let i = 0; i < newFields.length; i++) {
      for (let j = 0; j < newFields.length; j++) {
        if(newFields[i].id > newFields[j].id) {
          const tmp = newFields[i];
          newFields[i] = newFields[j];
          newFields[j] = tmp;
        }
      }
    }

    this.setState({
      fields: newFields.reverse(),
    });
  }

  addTempField = (field) => {
    const {fields, lastTempId} = this.state;
    this.setState({
      fields: [...fields, field],
      lastTempId: lastTempId-1,
    });
  }

  groupFields(arr1, arr2) {
    let ret = [];

    for(let i = 0; i < arr1.length; i++) {
      let found = false;
      for(let j = 0; j < arr2.length; j++) {
        if(arr1[i].id === arr2[j].id) {
          ret.push([arr1[i], arr2[j]]);
          found = true;
          continue;
        }
      }
      if(!found) {
        ret.push([arr1[i], null]);
      }
    }

    let idsFound = arr1.map((f) => {
      return f.id;
    });
    for(let i = 0; i < arr2.length; i++) {
      let found = idsFound.includes(arr2[i].id);
      for(let j = 0; j < arr1.length; j++) {
        if(arr1[j].id === arr2[i].id && !found) {
          ret.push([arr1[j], arr2[i]]);
          found = true;
          continue;
        }
      }
      if(!found) {
        ret.push([null, arr2[i]]);
      }
    }

    return ret;
  }

  render() {
    const {fields, lastTempId} = this.state;
    const original = this.props.fields;

    // Matches the state fields with the props fields.
    // If a match isn't found, it's set to null.
    let matches = this.groupFields(fields, original);

    const list = matches.map((m) => {
      const id = m[0] ? m[0].id : m[1].id;
      if(id === 0) {
        return null;
      }
      return (
        <FieldCard
          key={id}
          field={m[0]}
          original={m[1]}
          onChange={this.handleChange}
          onDelete={this.handleDelete}
          onRestore={this.handleRestore}
        />);
    });

    return (
      <Container>
        <CardColumns>
          {list}
        </CardColumns>

        <AddField id={lastTempId} onSubmit={this.addTempField} />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    fields: state.structure.fields,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateStructure: fields => {
      dispatch({type:"STRUCTURER_UPDATE", fields});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditStructure);
