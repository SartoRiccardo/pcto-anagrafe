import React, {Component} from "react";
import {connect} from "react-redux";
import {setPage, increasePage, decreasePage} from "../../redux/actions/searchPageAction";
import {resultAction} from "../../redux/actions/resultAction";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

/**
 * A component to change the result page
 *
 * @author Riccardo Sartori
 *
 * @param {int}      props.page           The current page.
 * @param {int}      props.totalResults   The results of the search.
 * @param {boolean}  props.multiplePages  If there are multiple result pages.
 * @param {String}   props.reducer        The reducer that must handler the page change events.
 * @param {function} props.updatePage     Jumps to the given page.
 * @param {function} props.decreasePage   Decreases the page by 1.
 * @param {function} props.increasePage   Increases the page by 1.
 * @param {function} props.updateResults  Updates the current search results.
 */
class ChangePage extends Component {
  jumpToPage = evt => {
    const {reducer} = this.props;
    this.props.updatePage(reducer, parseInt(evt.target.value));
    this.props.updateResults();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  changePage = evt => {
    const {reducer} = this.props;
    if (evt.target.name === "increase") {
      this.props.increasePage(reducer);
    }
    else if (evt.target.name === "decrease") {
      this.props.decreasePage(reducer);
    }
    this.props.updateResults();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  render() {
    const {page, totalResults, resultsPerPage} = this.props;
    const multiplePages = totalResults > resultsPerPage;

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

function mapDispatchToProps(dispatch) {
  return {
    updatePage: (reducer, page) => {
      dispatch(setPage(reducer, page));
    },
    decreasePage: reducer => {
      dispatch(decreasePage(reducer));
    },
    increasePage: reducer => {
      dispatch(increasePage(reducer));
    },
    updateResults: () => {
      dispatch(resultAction());
    }
  };
}

export default connect(null, mapDispatchToProps)(ChangePage);
