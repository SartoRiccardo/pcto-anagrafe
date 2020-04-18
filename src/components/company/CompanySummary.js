import React, {Component} from "react";
// HOCs and actions
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {setMatchCompany} from "../../redux/actions/resultAction";
// Custom components
import SaveStar from "../interactive/SaveStar";
import LocationFilterer from "../interactive/LocationFilterer";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * A short table row describing certain company attributes.
 *
 * The attributes shown are chosen with the current search terms.
 * Inteacts with the search state.
 *
 * @param {Company}  props.data            A single company object.
 * @param {Search[]} props.search          The parameters in the search.
 * @param {boolean}  props.hasCoordinates  Whether the company has coordinates in a map.
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

  filterLocations = (evt) => {
    evt.stopPropagation();
  }

  render() {
    let {data, search, structure, className, hasCoordinates} = this.props;

    let uniqueFields = [];
    if(search) {
      search = search.sort((a, b) => a.field.id - b.field.id);
      for (let i = 0; i < search.length; i++) {
        if(!uniqueFields.includes(search[i].field.id) && search[i].field.id > 0) {
          uniqueFields.push(search[i].field.id);
        }
      }
    }

    const information = uniqueFields.map((id) => {
      let currentField = null;

      const matchingFields = data.fields.filter(
        ({ field }) => field.id === id
      );

      if(matchingFields.length === 0) {
        for(const structureField of structure.fields) {
          if(structureField.id === id) {
            currentField = structureField;
            break;
          }
        }
      }
      else {
        currentField = matchingFields[0].field;
      }

      return (
        <div key={id} className={`company-summary-field
              ${matchingFields.length > 1 && "multiple-values"}`}>
            <p>
              <b>{currentField.name}: </b>
              {
                matchingFields.length === 1 ? (matchingFields[0].value
                || <FontAwesomeIcon icon={faTimes} className="icon-transparent ml-2" />)
                : null
              }
            </p>
            {
              matchingFields.length > 1 &&
              <ul>
                {
                  matchingFields.map(
                    matchingField => <li key={matchingField.id}>{matchingField.value}</li>
                  )
                }
              </ul>
            }
        </div>
      );
    });

    return (
      <Container onClick={this.handleClick} className={`my-3 company-summary pt-3 ${className}`}>
        <Row>
          <Col>
            <h4>
              <SaveStar onClick={this.handleSave} className="mr-2" company={data} status={data.saved} />
              {data.name}
              {hasCoordinates && <LocationFilterer company={data} className="float-right" />}
            </h4>
          </Col>
        </Row>

        <Row>
          <Col className="pl-5">
            {information}
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    structure: state.structure,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setMatch: (company) => {
      dispatch(setMatchCompany(company));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CompanySummary));
