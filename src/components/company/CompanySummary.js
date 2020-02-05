import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {saveCompany, deleteSave} from "../../redux/actions/saveAction";
import star from "../../img/star.svg";
import starEmpty from "../../img/starEmpty.svg";

/**
 * A short table row describing certain company attributes.
 *
 * The attributes shown are chosen with the current search terms.
 *
 * @author Riccardo Sartori
 *
 * @param {{id:int, saved:boolean, name:String, fields:{id:int, name:String, regex:String, value:String}[]}} props.data   A single company object.
 * @param {{id:int, value:String, field:{id:int, name:String, regex:String}}[]}                              props.search The parameters in the search.
 */
class CompanySummary extends Component {
  constructor(props) {
    super(props);

    this.redirect = true;
  }

  handleClick = evt => {
    if(this.redirect){
      this.props.history.push("/company/" + this.props.data.id);
    }

    this.redirect = true;
  }

  saveCompany = evt => {
    this.redirect = false;

    const {saveCompany, deleteSave} = this.props;
    const {saved, id} = this.props.data;
    if(saved) {
      deleteSave(id);
    }
    else {
      saveCompany(id);
    }
  }

  render() {
    const {data, search} = this.props;

    let uniqueFields = [];
    for (let i = 0; i < search.length; i++) {
      if(!uniqueFields.includes(search[i].field.id) && search[i].field.id !== 0) {
        uniqueFields.push(search[i].field.id);
      }
    }

    const information = uniqueFields.map(id => {
      let value = null;
      for (let i = 0; i < data.fields.length; i++) {
        if(data.fields[i].id === id) value=data.fields[i].value;
      }
      return <td key={id}>{value ? value : "N/A"}</td>;
    });

    const starType = data.saved ? star : starEmpty;

    return(
      <tr className="company-summary" onClick={this.handleClick}>
        <td><img alt="star" onClick={this.saveCompany} className="fav-star" src={starType} /> <b>{data.name}</b></td>
        {information}
      </tr>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveCompany: (id) => {
      dispatch(saveCompany(id));
    },
    deleteSave: (id) => {
      dispatch(deleteSave(id));
    }
  }
}

export default connect(null, mapDispatchToProps)(withRouter(CompanySummary));
