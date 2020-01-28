import React from "react";
import {connect} from "react-redux";

function CompanyDetails(props) {
  const {company, fields} = props;
  const data = fields.map(f => {
    if(f.id == 0) return null;  // Name field
    let match = null;
    for (let i = 0; i < company.fields.length; i++) {
      if(company.fields[i].id == f.id) {
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
    <div>
      <h1>{company.name}</h1>
      <table>
        <tbody>
          {data}
        </tbody>
      </table>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    company: state.company.match,
    fields: state.structure.fields,
  };
}

export default connect(mapStateToProps)(CompanyDetails);
