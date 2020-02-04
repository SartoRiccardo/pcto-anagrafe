import React, {Component} from "react";
import {connect} from "react-redux";
import {increasePage, decreasePage} from "../../redux/actions/searchPageAction";
import {resultAction} from "../../redux/actions/resultAction";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

/**
 * A component to change the result page
 *
 * @author Riccardo Sartori
 *
 * @param {int} page              The current page.
 * @param {int} totalResults      The results of the search.
 * @param {boolean} multiplePages If there are multiple result pages.
 */
class ChangePage extends Component {
  jumpToPage = evt => {
    this.props.updatePage(parseInt(evt.target.value));
    this.props.updateResults();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  changePage = evt => {
    if (evt.target.name === "increase") {
      this.props.increasePage();
    }
    else if (evt.target.name === "decrease") {
      this.props.decreasePage();
    }
    this.props.updateResults();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  render() {
    const {page, totalResults, multiplePages, resultsPerPage} = this.props;

    const pageNum = Math.ceil(totalResults/resultsPerPage);
    const renderRangeMd = 2;
    const renderRangeXs = 1;
    let buttons = [];
    for (let i = 0; i < pageNum; i++) {
      if(i === 0 || i === pageNum-1 || (i >= page-renderRangeMd && i <= page+renderRangeMd)) {
        let className = "page-selector";
        if(i === page) {
          className += "-selected";
        }
        if((i >= page-renderRangeMd && i < page-renderRangeXs)
        || (i <= page+renderRangeMd && i > page+renderRangeXs)) {
          className += " d-none d-md-block";
        }

        buttons.push(
          <Button key={i} onClick={this.jumpToPage} className={className} value={i} variant="secondary">{i+1}</Button>
        );
      }
    }

    const leftButton = (
      <Button onClick={this.changePage} name="decrease" variant="secondary" disabled={page <= 0}>
        &lt;
      </Button>
    );
    const rightButton = (
      <Button onClick={this.changePage} name="increase" variant="secondary" disabled={page >= pageNum-1}>
        &gt;
      </Button>
    );

    return (
      <Row className="justify-content-center my-3">
        <ButtonGroup>
          {multiplePages ? leftButton : null}
          {buttons}
          {multiplePages ? rightButton : null}
        </ButtonGroup>
      </Row>
    )
  }
}

function mapStateToProps(state) {
  return {
    page: state.search.page,
    totalResults: state.search.totalResults,
    resultsPerPage: state.search.resultsPerPage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePage: (page) => {
      dispatch({type:"SEARCHR_SET_PAGE", page});
    },
    decreasePage: () => {
      dispatch(decreasePage());
    },
    increasePage: () => {
      dispatch(increasePage());
    },
    updateResults: () => {
      dispatch(resultAction());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePage);
