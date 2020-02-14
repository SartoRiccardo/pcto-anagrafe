import React, {Component} from "react";
// HOCs and actions
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {createCompany} from "../../redux/actions/companyAction";
// Icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

/**
 * A form to add a company.
 *
 * @author Riccardo Sartori
 *
 * @param {state.changeCompany} props                The state of the add action.
 * @param {function}            props.createCompany  Creates a company with the given name.
 * @param {function}            props.acknowledge    Notifies the reducer that the addition has been carried out.
 */
class AddCompany extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      error: null,
      loading: false,
    };
  }

  changeHandler = (evt) => {
    this.setState({
      name: evt.target.value,
    });
  }

  submitHandler = (evt) => {
    evt.preventDefault();

    const {name} = this.state;
    const {submitted} = this.props;
    if(!submitted && name.length > 0) {
      this.setState({
        loading: true,
      });
      this.props.createCompany(name);
    }
  }

  componentDidUpdate() {
    if(this.props.finished) {
      this.props.acknowledge();
      if(this.props.error === "") {
        this.setState({
          loading: false,
        });
        this.props.history.push("/company/" + this.props.payload.id);
      }
      else {
        this.setState({
          error: this.props.error,
          loading: false,
        });
      }
    }
  }

  render() {
    const errorMessage = this.state.error ? (
      <h5>{this.state.error}</h5>
    ) : null;

    const loadingIcon = this.state.loading ? (
      <FontAwesomeIcon icon={faSpinner} pulse />
    ) : null;

    return (
      <div className="vertical-center d-flex align-items-center">
        <Container>
          <Row>
            <Col className="text-center">
              <h1>Crea un'azienda</h1>
              {errorMessage}
            </Col>
          </Row>

          <Form onSubmit={this.submitHandler}>
            <Form.Row className="d-flex justify-content-center my-3">
              <Col xs md={6}>
                <Form.Control
                  type="text"
                  placeholder="Nome dell'azienda..."
                  value={this.state.name}
                  onChange={this.changeHandler}
                />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col xs={12} className="d-flex justify-content-center">
                <Button type="submit" disabled={this.state.loading}>Crea {loadingIcon}</Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.changeCompany.add,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createCompany: (name) => {
      dispatch(createCompany(name));
    },
    acknowledge: () => {
      dispatch({type: "CHANGECOMPANYR_ACK", request:"add"});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddCompany));
