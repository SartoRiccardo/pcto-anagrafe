import React, {Component} from "react";
import {connect} from "react-redux";
import update from "immutability-helper";
import FieldCard from "./FieldCard";

import Container from "react-bootstrap/Container";
import CardColumns from "react-bootstrap/CardColumns";

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

  render() {
    const {fields} = this.props;
    const list = fields.map((f) => {
      if(f.id === 0) {
        return null;
      }
      return (
        <FieldCard
          key={f.id}
          field={f}
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
