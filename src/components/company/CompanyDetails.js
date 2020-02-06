import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {updateCompany} from "../../redux/actions/companyAction";
import {selectCompany, resetCompany} from "../../redux/actions/resultAction";
import Table from "react-bootstrap/Table";
import SaveStar from "./SaveStar";
import FieldModifier from "../forms/FieldModifier";
import {ReactComponent as Pencil} from "../../img/pencil.svg";
import {ReactComponent as Loading} from "../../img/loading.svg"

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * A table showing all of a company's information.
 *
 * The component shows every possible field type, even if there is nothing to show
 * for it (eg: the value is null).
 *
 * @author Riccardo Sartori
 *
 * @param {{id:int, name:String, fields:{id:int, name:String, regex:String, value:String}[]}} props.company A single company object.
 * @param {{id:int, name:String, regex:String}[]}                                             props.fields  The table structure's fields.
 */
class CompanyDetails extends Component {
  constructor(props) {
    super(props);

    const id = parseInt(this.props.match.params.id);
    const {company} = this.props;
    if(!company || company.id !== id) {
      this.props.resetCompany();
      this.props.selectCompany(id);
    }

    this.state = {
      modifying: null,
    };
  }

  handleModify = fieldID => {
    this.setState({
      modifying: fieldID,
    });
  }

  onClickConstructor = id => {
    return () => {
      this.handleModify(id);
    };
  }

  modifyFinishHandler = evt => {
    this.setState({
      modifying: null,
    });

    const {field, value, valid} = evt
    if(valid) {
      let newCompany;
      if(field.id === 0) {
        const {id, fields} = this.props.company;
        newCompany = {
          id, fields,
          name: value,
        };
      }
      else {
        const {id, name, fields} = this.props.company;
        let newFields = fields.filter(f => {
          return f.id !== field.id;
        });
        newFields.push({...field, value});
        newCompany = {
          id, name,
          fields: newFields,
        };
      }

      this.props.updateCompany(newCompany);
    }
  }

  render() {
    const {company, fields} = this.props;
    const canModify = this.props.privileges.includes("MANAGE_COMPANY");

    if(company == null) {
      return (
        <Loading />
      );
    }

    let nameField = null;
    const data = fields.map(f => {
      if(f.id === 0) {
        nameField = f;
        return null;
      }

      let match = null;
      for (let i = 0; i < company.fields.length; i++) {
        if(company.fields[i].id === f.id) {
          match = company.fields[i];
          break;
        }
      }

      let cellContent = null;
      if(this.state.modifying === f.id && canModify) {
        const value = match ? match.value : "";
        cellContent = <FieldModifier value={value} field={f} onFinish={this.modifyFinishHandler} />;
      }
      else {
        cellContent = (
          <Fragment>
            {(match ? match.value : "") + " "}
            {canModify ? <Pencil className="pencil-icon" onClick={this.onClickConstructor(f.id)} /> : null}
          </Fragment>
        );
      }

      return (
        <tr key={f.id}>
          <td><b>{f.name}</b></td>
          <td>
            {cellContent}
          </td>
        </tr>
      );
    });

    const title = this.state.modifying === 0 && canModify ? (
      <FieldModifier value={company.name} field={nameField} onFinish={this.modifyFinishHandler} />
    ) : (
      <h1 className="text-center" xs={12} md="auto">
        {company.name + " "}
        {canModify ? <Pencil className="pencil-icon" onClick={this.onClickConstructor(0)} /> : null}
      </h1>
    );

    return(
      <Container>
        <Row className="my-3 d-flex justify-content-center">
          <Col className="d-flex justify-content-center justify-content-md-start" xs={12} md>
            <SaveStar className="big-star" company={company} status={company.saved} />
          </Col>

          <Col xs={12} md={10}>
            {title}
          </Col>

          <Col>
          </Col>
        </Row>

        <Row>
          <Col>
            <Table responsive striped bordered size="sm">
              <tbody>
                {data}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    company: state.company.match,
    fields: state.structure.fields,
    privileges: state.auth.privileges,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateCompany: company => {
      dispatch(updateCompany(company));
    },
    selectCompany: id => {
      dispatch(selectCompany(id));
    },
    resetCompany: () => {
      dispatch(resetCompany());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CompanyDetails));
