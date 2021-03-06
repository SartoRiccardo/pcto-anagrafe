import React, {Component} from "react";
// HOCs and Actions
import {connect} from "react-redux";
import {updateField, createField, deleteField, reloadStructure} from "../../redux/actions/structureAction";
import update from "immutability-helper";
// Custom Components
import FieldCard from "./FieldCard";
import AddField from "../forms/inline/AddField";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Fade from "react-bootstrap/Fade";

/**
 * A form to edit the virtual table storing the companies' data.
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

    document.title = "PCTOkay! Struttura";
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

    // Sorts the array
    for (let i = 0; i < ret.length; i++) {
      for (let j = i+1; j < ret.length; j++) {
        const idI = ret[i][0] !== null ? ret[i][0].id : ret[i][1].id;
        const idJ = ret[j][0] !== null ? ret[j][0].id : ret[j][1].id;
        if(idI > idJ) {
          const tmp = ret[i];
          ret[i] = ret[j];
          ret[j] = tmp;
        }
      }
    }

    // Puts the negative IDs last in ascending order.
    let idIsNegative = true;
    while(ret.length > 0 && idIsNegative) {
      const id = ret[0][0] !== null ? ret[0][0].id : ret[0][1].id;
      if(id >= 0) {
        idIsNegative = false;
        continue;
      }
      ret.push(ret[0]);
      ret.splice(0, 1);
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
          this.props.updateField(c[0]);
        }
      }
      this.props.finishChange();
    })
  }

  render() {
    const {fields, lastTempId, initialized, dumping} = this.state;
    const {actions} = this.props;
    if(!initialized || dumping || actions.length > 0) {
      return (
        <Container className="d-flex justify-content-center">
          <FontAwesomeIcon icon={faSpinner} size="10x" className="align-self-center" pulse />
        </Container>
      );
    }

    const original = this.props.fields;

    // Matches the state fields with the props fields.
    // If a match isn't found, it's set to null.
    let matches = this.groupFields(fields, original);
    const changeHasBeenMade = !matches.every(([ curr, orig ]) =>
      curr && orig && curr.name === orig.name && curr.regex === orig.regex
    );

    const list = matches.map((m) => {
      const id = m[0] ? m[0].id : m[1].id;
      if(id === 0) {
        return null;
      }
      return (
        <Col key={id} xs={12} md={12/2} lg={12/3}>
          <FieldCard
            field={m[0]}
            original={m[1]}
            onChange={this.handleChange}
            onDelete={this.handleDelete}
            onRestore={this.handleRestore}
          />
        </Col>
      );
    });

    return (
      <Container>
        <Row>
          <Col className="text-center mt-3">
            <h1>Struttura dei dati</h1>
            <p className="lead">Qui puoi modificare o vedere come i dati sono salvati.</p>
          </Col>
        </Row>

        <Row>
          {list}
          <Col xs={12} md={12/2} lg={12/3}>
            <AddField id={lastTempId} onSubmit={this.addTempField} />
          </Col>
        </Row>

        <Fade in={changeHasBeenMade} mountOnEnter={true} unmountOnExit={true}>
          <div>
            <hr />
            <Row>
              <Col className="d-flex justify-content-center">
                <Button onClick={this.saveChanges}>Salva</Button>
              </Col>
            </Row>
          </div>
        </Fade>
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
