import React, {Component, Fragment} from "react";
import Table from "react-bootstrap/Table";
import SaveStar from "./SaveStar";

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
 * @param {{id:int, name:String, regex:String, value:String}[]}                               props.fields  The table structure's fields.
 */
class CompanyDetails extends Component {
  render() {
    const {company, fields} = this.props;
    const data = fields.map(f => {
      if(f.id === 0) return null;  // Name field
      let match = null;
      for (let i = 0; i < company.fields.length; i++) {
        if(company.fields[i].id === f.id) {
          match = company.fields[i];
          break;
        }
      }
      return (
        <tr key={f.id}>
          <td><b>{f.name}</b></td>
          <td>{match ? match.value : null}</td>
        </tr>
      );
    });

    return(
      <Fragment>
          <Container className="text-center my-3">
            <Row className="d-flex justify-content-center">
              <Col className="pr-0">
                <SaveStar className="float-right" company={company} status={company.saved} />
              </Col>
              <Col xs="auto" className="pl-0">
                <h1 className="text-center" xs="auto">{company.name}</h1>
              </Col>
              <Col>
              </Col>
            </Row>
          </Container>
        <Table responsive striped bordered size="sm">
          <tbody>
            {data}
          </tbody>
        </Table>
      </Fragment>
    );
  }
}

export default CompanyDetails;
