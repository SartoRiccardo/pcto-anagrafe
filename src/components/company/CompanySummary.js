
class CompanySummary extends React.Component {
  handleClick = evt => {
    // Show company details...
  }

  render() {
    const {data, search} = this.props;

    let uniqueFields = [];
    for (let i = 0; i < search.length; i++) {
      if(!uniqueFields.includes(search[i].id)) {
        uniqueFields.push(search[i].id);
      }
    }

    const information = uniqueFields.map(id => {
      let value = null;
      for (let i = 0; i < data.fields.length; i++) {
        if(data.fields[i].id == id) value=data.fields[i].value;
      }
      return <td key={id}>{value}</td>;
    });

    return(
      <tr className="company-summary" onClick={this.handleClick}>
        <td><b>{data.name}</b></td>
        {information}
      </tr>
    );
  }
}
