import React, {Component} from "react";
// HOCs and actions
import {connect} from "react-redux";
import {resultAction} from "../../redux/actions/resultAction";
import {activityField} from "../../redux/reducers/structureReducer";
// Custom components
import SearchField from "./SearchField";
// Bootstrap
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

/**
 * A list of SearchField.
 *
 * This component coordinates its children and sends all their data to their respective reducers.
 * Fetches data from and interacts with the search state.
 */
class SearchBar extends Component {
  constructor(props) {
    super(props);

    const fields = this.props.search;
    let biggestId = 0;
    for (let i = 0; i < fields.length; i++) {
      if(fields[i].id > biggestId) {
        biggestId = fields[i].id;
      }
    }

    this.state = {
      fields,
      lastId: biggestId + 1,
    };
  }

  handleChange = (evt) => {
    let fields = [...this.state.fields];
    let changedField = null;
    for (let i = 0; i < fields.length; i++) {
      if(fields[i].id === evt.id) {
        fields[i] = {...evt.target.state};
        changedField = fields[i];
        break;
      }
    }

    this.setState({
      fields
    }, () => {
      this.notifyChange();
      this.props.updateSearchField(changedField);
      this.props.updateResults(this.state.fields);
    });
  }

  addSearchField = (evt) => {
    const {fields, lastId} = this.state;
    this.setState({
      fields: [
        ...fields,
        {
          id: lastId,
          value: "",
          field: this.props.options[0],
        },
      ],
      lastId: lastId+1,
    }, () => {
      this.notifyChange();

      const {fields} = this.state;
      this.props.addSearchField(fields[fields.length-1]);
      this.props.updateResults(fields);
    });
  }

  handleDelete = (evt) => {
    const {id} = evt.target.state;
    const {fields} = this.state;
    this.setState({
      fields: fields.filter((f) => f.id !== id),
    }, () => {
      this.notifyChange();
      this.props.deleteSearchField(id);
      this.props.updateResults(this.state.fields);
    });
  }

  notifyChange = () => {
    if(this.props.onChange) {
      this.props.onChange({
        target: this,
      });
    }
  }

  render() {
    let {fields} = this.state;
    let {options, search} = this.props;
    options = [...options, activityField];
    const sFields = fields.map((f) => {
      return (
        <Form.Row key={f.id} className="justify-content-center my-3 my-sm-2">
          <SearchField
            options={options}
            initState={f}
            onChange={this.handleChange}
            onDelete={this.handleDelete}
          />
        </Form.Row>
      );
    });
    const buttonText = search.length === 0 ? "Cerca" : "Aggiungi";

    return (
      <form onSubmit={(evt) => evt.preventDefault()} className="my-3">
        {sFields}

        <Row className="justify-content-center">
          <Col xs="auto">
            <Button onClick={this.addSearchField}>{buttonText}</Button>
          </Col>
        </Row>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    options: state.structure.fields,
    search: state.search.search,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addSearchField: (search) => {
      dispatch({type: "SEARCHR_RESET_PAGE"});
      dispatch({type: "SEARCHR_ADD_FIELD", search});
    },
    deleteSearchField: (id) => {
      dispatch({type: "SEARCHR_RESET_PAGE"});
      dispatch({type: "SEARCHR_DELETE_FIELD", id});
    },
    updateSearchField: (search) => {
      dispatch({type: "SEARCHR_RESET_PAGE"});
      dispatch({type: "SEARCHR_UPDATE_FIELD", search});
    },
    updateResults: (searches) => {
      dispatch(resultAction(searches));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
