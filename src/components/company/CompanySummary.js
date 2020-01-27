
class CompanySummary extends React.Component {
  handleClick = evt => {
    // Show company details...
  }

  render() {
    const {data, search} = this.props;

    let uniqueFields = [];
    for (let i = 0; i < search.length; i++) {
      if(!uniqueFields.includes(search[i].name)) {
        uniqueFields.push(search[i].name);
      }
    }

    const information = uniqueFields.map(f => {
      return <td key={f}>{data[f]}</td>;
    });

    return(
      <tr className="company-summary" onClick={this.handleClick}>
        <td><b>{data.name}</b></td>
        {information}
      </tr>
    );
  }
}
