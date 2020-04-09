import React, {Fragment} from "react";
// Custom Components
import CompanySummary from "./CompanySummary";
import InfiniteLoadingBar from "../ui/InfiniteLoadingBar";
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

  const loadingBar = (
    <Row>
      <Col className="mb-3">
        <InfiniteLoadingBar speed={200} />
      </Col>
    </Row>
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
    <Fragment>
      {loading && loadingBar}

      <Row>
        <Col>
          {content}
          {loading && <div className="table-overlay d-flex justify-content-center" />}
        </Col>
      </Row>
    </Fragment>
  );
}

export default CompanyResults;
