import React, {Fragment} from "react";
import CompanySummary from "./CompanySummary";
import {connect} from "react-redux";

import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * A table of CompanySummary.
 *
 * @author Riccardo Sartori
 * @see CompanySummary
 *
 * @param {{id:int, name:String, fields:{id:int, name:String, regex:String, value:String}[]}[]} props.results A list of companies.
 * @param {{id:int, value:String, field:{id:int, name:String, regex:String}}[]}                 props.search  The parameters in the search.
 */
function CompanyResults(props) {
  const {results, search} = props;

  let table;
  if(results.length > 0) {
    const summaries = results.map(res => {
      return <CompanySummary key={res.id} data={res} search={search} />
    });

    let uniqueFields = [];
    for (let i = 0; i < search.length; i++) {
      if(!uniqueFields.includes(search[i].field.id) && search[i].field.id !== 0) {
        uniqueFields.push(search[i].field.id);
      }
    }

    const header = uniqueFields.map(id => {
      let value = null;
      for (let i = 0; i < search.length; i++) {
        if(search[i].field.id === id) value = search[i].field.name;
      }
      return <th key={id}>{value ? value : "N/A"}</th>;
    });

    table = (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            {header}
          </tr>
        </thead>
        <tbody>
          {summaries}
        </tbody>
      </Table>
    );
  }
  else {
    table = search.length == 0 ? (
      <Fragment>
        <h1 className="text-center">Inizia a cercare aziende</h1>
      </Fragment>
    ) : (
      <Fragment>
        <h1 className="text-center">Nessun risultato</h1>
        <p className="lead text-center">Prova a restringere i campi di ricerca</p>
      </Fragment>
    );
  }

  return (
    <Row>
      <Col>
        {table}
      </Col>
    </Row>
  );
}

function mapStateToProps(state) {
  return {
    search: state.search.search,
    results: state.search.results,
  };
}

export default connect(mapStateToProps)(CompanyResults);
