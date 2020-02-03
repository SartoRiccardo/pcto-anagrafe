import React, {Fragment} from "react";
import Table from "react-bootstrap/Table";

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
function CompanyDetails(props) {
  const {company, fields} = props;
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
      <h1 className="text-center my-3">{company.name}</h1>
      <Table striped bordered size="sm">
        <tbody>
          {data}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default CompanyDetails;
