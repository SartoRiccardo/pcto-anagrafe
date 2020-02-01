import React, {Component} from "react";
import {connect} from "react-redux";
import {increasePage, decreasePage} from "../../redux/actions/searchPageAction";
import {resultAction} from "../../redux/actions/resultAction";

class ChangePage extends Component {
  handleClick = evt => {
    if(evt.target.name == "increase") {
      this.props.increasePage();
    }
    else {
      this.props.decreasePage();
    }
    this.props.updateResults();
  }

  render() {
    const {page} = this.props;
    return (
      <div>
        <input type="button" onClick={this.handleClick} name="decrease" value="<" disabled={page === 0} />
        Pagina {page}
        <input type="button" onClick={this.handleClick} name="increase" value=">" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    page: state.search.page,
  };
}

function mapDispatchToProps(dispatch) {
  return {
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
