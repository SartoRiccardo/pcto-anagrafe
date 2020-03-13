import React, {Fragment} from "react";
// Custom Components
import CompanySummary from "./CompanySummary";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * A table of CompanySummary.
 *
 * @author Riccardo Sartori
 *
 * @param {Company[]} props.results A list of companies.
 * @param {Search[]}  props.search  The parameters in the search.
 */
function CompanyResults(props) {
  const {results, loading, search} = props;

  const loadingComponent = results.length > 0 ? (
    <div className="table-overlay d-flex justify-content-center">
      <FontAwesomeIcon icon={faSpinner} pulse className="loading-table-overlay my-2" />
    </div>
  ) : (
    <div className="d-flex justify-content-center">
      <FontAwesomeIcon icon={faSpinner} pulse className="loading-table-overlay my-2" />
    </div>
  );

  let table;
  if(results.length > 0) {
    const summaries = results.map((res) => {
      return <CompanySummary key={res.id} data={res} search={search} />;
    });

    let uniqueFields = [];
    if(search) {
      for (let i = 0; i < search.length; i++) {
        if(!uniqueFields.includes(search[i].field.id) && search[i].field.id > 0) {
          uniqueFields.push(search[i].field.id);
        }
      }
    }

    const header = uniqueFields.map((id) => {
      let value = null;
      for (let i = 0; i < search.length; i++) {
        if(search[i].field.id === id) {
          value = search[i].field.name;
        }
      }
      return <th key={id}>{value ? value : "N/A"}</th>;
    });

    table = (
      <Table responsive striped bordered hover className="results-table">
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
  else if(loading) {
    return (
      <Row>
        <Col>
          {loadingComponent}
        </Col>
      </Row>
    );
  }
  else if(loading) {
    table = null;
  }
  else if(search.length === 0) {
    table = (
      <h1 className="text-center">Inizia a cercare aziende</h1>
    );
  }
  else {
    table = (
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
        {loading ? loadingComponent : null}
      </Col>
    </Row>
  );
}

export default CompanyResults;
