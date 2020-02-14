import React, {Component} from "react";
// HOCs and actions
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {setMatchCompany} from "../../redux/actions/resultAction";
// Custom components
import SaveStar from "../interactive/SaveStar";
// Icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

/**
 * A short table row describing certain company attributes.
 *
 * The attributes shown are chosen with the current search terms.
 *
 * @author Riccardo Sartori
 *
 * @param {Company}  props.data      A single company object.
 * @param {Search[]} props.search    The parameters in the search.
 * @param {function} props.setMatch  Sets the currently active company.
 */
class CompanySummary extends Component {
  constructor(props) {
    super(props);

    this.redirect = true;
  }

  handleClick = (evt) => {
    if(this.redirect) {
      this.props.setMatch(this.props.data);
      this.props.history.push("/company/" + this.props.data.id);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

    this.redirect = true;
  }

  handleSave = (evt) => {
    this.redirect = false;
  }

  render() {
    const {data, search} = this.props;

    let uniqueFields = [];
    if(search) {
      for (let i = 0; i < search.length; i++) {
        if(!uniqueFields.includes(search[i].field.id) && search[i].field.id !== 0) {
          uniqueFields.push(search[i].field.id);
        }
      }
    }

    const information = uniqueFields.map((id) => {
      let value = null;
      for (let i = 0; i < data.fields.length; i++) {
        if(data.fields[i].id === id) {
          value = data.fields[i].value;
        }
      }
      return (
        <td key={id} className={value ? "" : "text-center"}>
          {value
            ? value
            : <FontAwesomeIcon icon={faTimes} className="icon-transparent" />}
        </td>
      );
    });

    return(
      <tr className="company-summary" onClick={this.handleClick}>
        <td>
          <SaveStar onClick={this.handleSave} className="mr-2" company={data} status={data.saved} />
          <b>{data.name}</b>
        </td>
        {information}
      </tr>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setMatch: (company) => {
      dispatch(setMatchCompany(company));
    },
  };
}

export default connect(null, mapDispatchToProps)(withRouter(CompanySummary));
