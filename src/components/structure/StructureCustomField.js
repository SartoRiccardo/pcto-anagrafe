import React, {Component, Fragment} from "react";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * A component to build a simple regex.
 *
 * @author Riccardo Sartori
 *
 * @param {Field}    props.field     The field to represent.
 * @param {function} props.onChange  A handler for when the field is changed.
 */
class StructureCustomField extends Component {
  constructor(props) {
    super(props);

    this.options = [
      {
        label: "Numero",
        regex: "\\d",
        color: "#9fa8da",
        display: "123",
        examplePool: "0123456789",
      },
      {
        label: "Lettera",
        regex: "[a-zA-Z]",
        color: "#c5e1a5",
        display: "AbCd",
        examplePool: "qwertyuiopasdfghjklzxcvbnmQWRTYUIOPASDFGHJKLZXCVBNM",
      },
      {
        label: "Maiuscola",
        regex: "[A-Z]",
        color: "#90caf9",
        display: "ABC",
        examplePool: "QWERTYUIOPASDFGHJKLZXCVBNM",
      },
      {
        label: "Minuscola",
        regex: "[a-z]",
        color: "#ffe082",
        display: "abc",
        examplePool: "qwertyuiopasdfghjklzxcvbnm",
      },
    ];

    const divider = /(?:(\[a-zA-Z])|(\\d)|(\[a-z])|(\[A-Z]))/g;
    const parts = this.props.field.regex.match(divider);
    let choices = [];

    if(parts) {
      for(let i = 0; i < parts.length; i++) {
        const p = parts[i];
        for(let j = 0; j < this.options.length; j++) {
          if(p === this.options[j].regex) {
            choices.push(j);
            break;
          }
        }
      }
    }

    this.state = {
      choices,
      example: "",
    };
  }

  componentDidMount() {
    this.setState({
      example: this.generateExample(this.state.choices),
    });
  }

  generateExample = (choices) => {
    return choices.map((c) => {
      const ep = this.options[c].examplePool;
      const index = Math.trunc(Math.random() * ep.length);
      return ep.charAt(index);
    });
  }

  generateRegExp = () => {
    const {choices} = this.state;
    const split = choices.map((c) => {
      return this.options[c].regex;
    });
    return split.join("");
  }

  notifyChange = () => {
    const {onChange, field} = this.props;
    const regex = this.generateRegExp();
    if(onChange) {
      onChange({
        field: {
          ...field,
          regex,
        },
      });
    }
  }

  add = (evt) => {
    const index = parseInt(evt.target.value);
    const newChoices = [...this.state.choices, index];
    this.setState({
      choices: newChoices,
      example: this.generateExample(newChoices),
    }, () => {
      this.notifyChange();
    });
  }

  deleteCreator = (id) => {
    return () => {
      this.delete(id);
    };
  }

  delete = (id) => {
    const newChoices = this.state.choices.filter((o, i) => {
      return i !== id;
    });
    this.setState({
      choices: newChoices,
      example: this.generateExample(newChoices),
    }, () => {
      this.notifyChange();
    });
  }

  render() {
    const {choices, example} = this.state;

    const buttons = this.options.map((o, i) => {
      const {label} = o;
      return (
        <Col key={i} xs={12} sm={6} className="my-1 d-flex justify-content-center">
          <Button value={i} className="w-100" onClick={this.add}>{label}</Button>
        </Col>
      );
    });

    const buttonGui = choices.map((c, i) => {
      const {color, display} = this.options[c];
      const style = {backgroundColor: color};
      return (
        <div key={i} className="simple-regex px-2 py-1 mx-1" style={style}>
          {display + " "}
          <FontAwesomeIcon icon={faTimes} className="icon-button" onClick={this.deleteCreator(i)} />
        </div>
      );
    });

    const body = choices.length > 0 ? (
      <Fragment>
        <Row className="p-2 py-2-5 mx-0 my-3 simple-regex-container">
          {buttonGui}
        </Row>

        <Row>
          <Col>
            <p className="text-muted text-center">Esempio: {example}</p>
          </Col>
        </Row>
      </Fragment>
    ) : null;

    return (
      <Container>
        <Row>
          {buttons}
        </Row>
        {body}
      </Container>
    );
  }
}
StructureCustomField.default = "$.";
StructureCustomField.regex = /^(?:(?:\[a-zA-Z])|\\d|(?:\[a-z])|(?:\[A-Z]))+$/;
StructureCustomField.fieldTypeName = "Personalizzato";

export default StructureCustomField;
