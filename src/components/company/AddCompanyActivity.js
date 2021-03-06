import React, {Component} from "react";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

/**
 * A select to add an activity to a company's page.
 *
 * @param {Activity[]} props.activities  The activities the user can choose from.
 * @param {Function}   props.onSubmit    The callback for when the user submits an activity.
 */
class AddCompanyActivity extends Component {
  constructor(props) {
    super(props);

    const {activities} = this.props;
    this.state = {
      selected: activities.length > 0 ? activities[0].id : null,
    };
  }

  componentDidUpdate() {
    const {activities} = this.props;
    const {selected} = this.state;
    if(selected === null && activities.length > 0) {
      this.setState({
        selected: activities[0].id,
      });
    }
  }

  change = (evt) => {
    this.setState({
      selected: parseInt(evt.target.value),
    });
  }

  submit = (evt) => {
    const {onSubmit} = this.props;
    const {selected} = this.state;
    if(onSubmit) {
      onSubmit({
        value: parseInt(selected),
      });
    }
    this.setState({
      selected: null,
    });
  }

  render() {
    const {selected} = this.state;
    const {activities} = this.props;
    if(activities.length === 0) {
      return null;
    }

    const options = activities.map((a) => {
      return (
        <option key={a.id} value={a.id}>{a.name}</option>
      );
    });

    return (
      <Form.Row className="d-flex justify-content-center">
        <Col xs md={6}>
          <Form.Control as="select" value={selected === null ? undefined : selected} onChange={this.change}>
            {options}
          </Form.Control>
        </Col>

        <Col xs="auto">
          <Button onClick={this.submit}><FontAwesomeIcon icon={faPlus} /></Button>
        </Col>
      </Form.Row>
    );
  }
}

export default AddCompanyActivity;
