import React, {Component} from "react";
// HOCs and Actions
import {connect} from "react-redux";
import {updateField, createField, deleteField, reloadStructure} from "../../redux/actions/structureAction";
import update from "immutability-helper";
// Custom Components
import FieldCard from "./FieldCard";
import AddField from "../forms/inline/AddField";
// Icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardColumns from "react-bootstrap/CardColumns";
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

    const {fields, initialized, dumping} = this.props;
    this.state = {
      fields: [...fields],
      lastTempId: -1,
      initialized,
      dumping,
    };
  }

  componentDidUpdate() {
    if(!this.state.initialized && this.props.initialized) {
      this.setState({
        fields: [...this.props.fields],
        initialized: true,
      });
    }

    if(!this.props.dumping && this.state.dumping && this.props.actions.length === 0) {
      this.props.reload();
      this.setState({
        dumping: false,
        initialized: false,
      });
    }
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

  saveChanges = (evt) => {
    let matches = this.groupFields(this.state.fields, this.props.fields);
    const changes = matches.filter((m) => {
      return m[0] === null
        || m[1] === null
        || m[0].name !== m[1].name
        || m[0].regex !== m[1].regex;
    });

    this.props.startChange();
    this.setState({
      dumping: true,
    }, () => {
      for (let i = 0; i < changes.length; i++) {
        const c = changes[i];
        if(c[1] === null) {
          this.props.createField(c[0]);
        }
        else if(c[0] === null) {
          this.props.deleteField(c[1].id);
        }
        else {
          this.props.updateField(c[1]);
        }
      }
      this.props.finishChange();
    })
  }

  render() {
    const {fields, lastTempId, initialized, dumping} = this.state;
    if(!initialized || dumping) {
      console.log("LOADING ICON");
      return (
        <Container className="d-flex justify-content-center">
          <FontAwesomeIcon icon={faSpinner} size="10x" className="align-self-center" />
        </Container>
      );
    }

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
        <Row>
          <CardColumns>
            {list}
            <AddField id={lastTempId} onSubmit={this.addTempField} />
          </CardColumns>
        </Row>

        <hr />
        <Row>
          <Col className="d-flex justify-content-center">
            <Button onClick={this.saveChanges}>Salva</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.structure,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startChange: () => {
      dispatch({type:"STRUCTURER_START_DUMP"});
    },
    finishChange: () => {
      dispatch({type:"STRUCTURER_FINISH_DUMP"});
    },
    deleteField: (id) => {
      dispatch(deleteField(id));
    },
    createField: (field) => {
      dispatch(createField(field));
    },
    updateField: (field) => {
      dispatch(updateField(field));
    },
    reload: () => {
      dispatch(reloadStructure());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditStructure);
