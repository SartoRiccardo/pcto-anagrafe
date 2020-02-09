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

  render() {
    const {fields} = this.props;
    const list = fields.map((f) => {
      if(f.id === 0) {
        return null;
      }
      return <FieldCard key={f.id} field={f} onChange={this.handleChange} />
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
