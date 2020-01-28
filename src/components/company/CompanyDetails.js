
function CompanyDetails(props) {
  const {company} = props
  const fields = company.fields.map(f => {
    return (
      <tr key={f.id}>
        <td><b>{f.name}</b></td>
        <td>{f.value}</td>
      </tr>
    );
  });

  return(
    <div>
      <h1>{company.name}</h1>
      <table>
        <tbody>
          {fields}
        </tbody>
      </table>
    </div>
  )
}
