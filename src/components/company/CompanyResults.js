import React, {Fragment} from "react";
// Custom Components
import CompanySummary from "./CompanySummary";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * A table of CompanySummary.
 *
 * @param {Company[]} props.results  A list of companies.
 * @param {Search[]}  props.search   The parameters in the search.
 * @param {boolean}   props.loading  Whether the results are still loading.
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

  let content;
  if(results.length > 0) {
    content = results.map((res) => {
      return (
        <CompanySummary key={res.id} data={res} search={search} />
      );
    });
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
    content = null;
  }
  else if(search.length === 0) {
    content = (
      <h1 className="text-center">Inizia a cercare aziende</h1>
    );
  }
  else {
    content = (
      <Fragment>
        <h1 className="text-center">Nessun risultato</h1>
        <p className="lead text-center">Prova a restringere i campi di ricerca</p>
      </Fragment>
    );
  }
  return (
    <Row>
      <Col>
        {content}
        {loading ? loadingComponent : null}
      </Col>
    </Row>
  );
}

export default CompanyResults;
