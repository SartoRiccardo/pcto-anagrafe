import React, {Component} from "react";
import SearchField from "./SearchField";
import {resultAction} from "../../redux/actions/resultAction";
import {connect} from "react-redux";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * A list of SearchField.
 *
 * This component coordinates its children and sends all their data to their respective reducers.
 *
 * @author Riccardo Sartori
 * @see SearchField
 *
 * @param {{id:int, name:String, regex:String, value:String}[]}                 props.options A list of searchable fields.
 * @param {{id:int, value:String, field:{id:int, name:String, regex:String}}[]} props.search  The current search terms.
 */
class SearchBar extends Component {
  constructor(props) {
    super(props);

    const fields = this.props.search;
    let biggestId = 0;
    for (let i = 0; i < fields.length; i++) {
      if(fields[i].id > biggestId) biggestId = fields[i].id;
    };

    this.state = {
      fields,
      lastId: biggestId + 1,
    };
  }

  handleChange = evt => {
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

  addSearchField = evt => {
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

  handleDelete = evt => {
    const {id} = evt.target.state;
    const {fields} = this.state;
    this.setState({
      fields: fields.filter(f => f.id !== id),
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
    const {fields} = this.state;
    const sFields = fields.map(f => {
      return (
        <Form.Row key={f.id} className="justify-content-sm-center my-2">
          <SearchField
            options={this.props.options}
            initState={f}
            onChange={this.handleChange}
            onDelete={this.handleDelete}
          />
        </Form.Row>
      );
    })
    return (
      <form onSubmit={evt => evt.preventDefault()} className="my-3">
        {sFields}

        <Row className="justify-content-sm-center">
          <Col sm md="auto">
            <FormControl as="button" onClick={this.addSearchField}>Cerca</FormControl>
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
    addSearchField: search => {
      dispatch({type: "RESET_PAGE"});
      dispatch({type: "ADD_SEARCH_FIELD", search});
    },
    deleteSearchField: id => {
      dispatch({type: "RESET_PAGE"});
      dispatch({type: "DELETE_SEARCH_FIELD", id});
    },
    updateSearchField: search => {
      dispatch({type: "RESET_PAGE"});
      dispatch({type: "UPDATE_SEARCH_FIELD", search});
    },
    updateResults: searches => {
      dispatch(resultAction(searches));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
