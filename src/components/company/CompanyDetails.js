import React, {Component, Fragment} from "react";
import Table from "react-bootstrap/Table";
import SaveStar from "./SaveStar";

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
        <Row className="my-3 d-flex justify-content-center">
          <Col className="d-flex justify-content-center justify-content-md-start" xs={12} md>
            <SaveStar className="big-star" company={company} status={company.saved} />
          </Col>
          <Col xs={12} md={10}>
            <h1 className="text-center" xs={12} md="auto">{company.name}</h1>
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
      </Fragment>
    );
  }
}

export default CompanyDetails;
