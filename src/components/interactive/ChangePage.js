import React, {Component} from "react";
import {connect} from "react-redux";
import {setPage, increasePage, decreasePage} from "../../redux/actions/searchPageAction";
import {resultAction} from "../../redux/actions/resultAction";
// Bootstrap
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

/**
 * A component to change the result page
 *
 * Fetches data from and interacts with the search and searchPage states.
 *
 * @param {int}      props.page           The current page.
 * @param {int}      props.totalResults   The results of the search.
 * @param {boolean}  props.multiplePages  If there are multiple result pages.
 * @param {String}   props.reducer        The reducer that must handler the page change events.
 */
class ChangePage extends Component {
  jumpToPage = (evt) => {
    const {reducer} = this.props;
    this.props.updatePage(reducer, parseInt(evt.target.value));
    this.props.updateResults();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  changePage = (name) => {
    const {reducer} = this.props;
    if (name === "increase") {
      this.props.increasePage(reducer);
    }
    else if (name === "decrease") {
      this.props.decreasePage(reducer);
    }
    this.props.updateResults();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  changePageBuilder = (action) => {
    return () => {
      this.changePage(action);
    }
  }

  renderRange = (i, range, max) => {
    const renderedForward = range + (i-range < 0 ? -(i - range) : 0);
    const renderedBackward = range + (i+range >= max ? (i+1 +range) - max : 0);
    let ret = [];
    let rendered = i-renderedBackward >= 0 ? i-renderedBackward : 0;
    while(rendered <= i+renderedForward && rendered < max) {
      ret.push(rendered);
      rendered++;
    }
    return ret;
  }

  render() {
    const {page, totalResults, resultsPerPage} = this.props;
    const multiplePages = totalResults > resultsPerPage;

    const pageNum = Math.ceil(totalResults/resultsPerPage);
    const renderMd = this.renderRange(page, 2, pageNum);
    const renderXs = this.renderRange(page, 1, pageNum);

    let buttons = [];
    for (let i = 0; i < pageNum; i++) {
      if(i === 0 || i === pageNum-1 || renderMd.includes(i)) {
        let className = "page-selector";
        if(i === page) {
          className += " page-selected";
        }
        if(!renderXs.includes(i) && renderMd.includes(i) && i !== 0 && i !== pageNum-1) {
          className += " d-none d-md-block";
        }
        if(!renderMd.includes(i)) {
          className += i === 0 ? " first-page" : " last-page";
        }

        buttons.push(
          <Button
            key={i}
            onClick={this.jumpToPage}
            className={className}
            value={i}
            variant="secondary"
          >
            {i+1}
          </Button>
        );
      }
    }

    const leftButton = (
      <Button
        onClick={this.changePageBuilder("decrease")}
        className="mx-2 page-selector page-selector-arrow"
        variant="secondary"
      >
        &laquo;
      </Button>
    );
    const rightButton = (
      <Button
        onClick={this.changePageBuilder("increase")}
        className="mx-2 page-selector page-selector-arrow"
        variant="secondary"
      >
        &raquo;
      </Button>
    );

    return (
      <Row className="justify-content-center my-3">
        {multiplePages && page > 0 ? leftButton : null}
          {buttons}
        {multiplePages && page < pageNum-1 ? rightButton : null}
      </Row>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updatePage: (reducer, page) => {
      dispatch(setPage(reducer, page));
    },
    decreasePage: (reducer) => {
      dispatch(decreasePage(reducer));
    },
    increasePage: (reducer) => {
      dispatch(increasePage(reducer));
    },
    updateResults: () => {
      dispatch(resultAction());
    }
  };
}

export default connect(null, mapDispatchToProps)(ChangePage);
