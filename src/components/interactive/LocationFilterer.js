import React from "react";
// HOCs and actions
import {connect} from "react-redux";
import {addCompanyMapFilter, removeCompanyMapFilter} from "../../redux/actions/mapAction";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";

class LocationFilterer extends React.Component {
  isFiltered = () => {
    const { company, filteredCoords } = this.props;
    return filteredCoords.some(
      (companyId) => companyId === company.id
    );
  }

  clickHandler = (evt) => {
    const { company } = this.props;
    evt.stopPropagation();

    this.isFiltered() ?
        this.props.removeCompanyMapFilter(company.id) :
        this.props.addCompanyMapFilter(company.id);

    this.props.onClick && this.props.onClick();
  }

  render() {
    const { className } = this.props;

    return (
      <FontAwesomeIcon
        className={`location-filterer ${this.isFiltered() && "active"} ${className}`}
        icon={faMapMarkerAlt}
        onClick={this.clickHandler}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    filteredCoords: state.search.filteredCoords,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addCompanyMapFilter: (companyId) => dispatch(addCompanyMapFilter(companyId)),
    removeCompanyMapFilter: (companyId) => dispatch(removeCompanyMapFilter(companyId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationFilterer);
