import React, {Component} from "react";

class EditStructure extends React.Component {
  constructor(props) {
    super(props);

    const {fields} = this.props;
    this.state = {
      fields: [...fields],
      lastTempId: -1,
    };
  }

  handleSubmit = evt => {
    evt.preventDefault();
    // Commit fields to database
  }

  changeHandler = (evt, id) => {
    let fields = [...this.state.fields];
    for (let i = 0; i < fields.length; i++) {
      if(fields[i].id == id) {
        fields[i][evt.target.name] = evt.target.value;
        break;
      }
    }
    this.setState({
      fields,
    });
  }

  deleteField = (evt, id) => {
    this.setState({
      fields: this.state.fields.filter(f => f.id !== id),
    });
  }

  addField = evt => {
    const {fields, lastTempId} = this.state;
    this.setState({
      fields: [
        ...fields,
        {
          id: lastTempId,
          name: "",
          regex: "",
        }
      ],
      lastTempId: lastTempId-1,
    });
  }

  render() {
    const {fields} = this.state;
    const fieldForm = fields.map(f => {
      return (
        <tr key={f.id}>
          <td><input name="name" value={f.name} onChange={evt => {this.changeHandler(evt, f.id)}} /></td>
          <td><input name="regex" value={f.regex} onChange={evt => {this.changeHandler(evt, f.id)}} /></td>
          <td><input type="button" value="-" onClick={evt => {this.deleteField(evt, f.id)}} /></td>
        </tr>
      );
    });

    return (
      <div>
        <h1>Struttura della Tabella</h1>
        <form onSubmit={this.handleSubmit}>
          <table>
            <thead>
              <tr>
                <th>Campo</th>
                <th>Regex</th>
              </tr>
            </thead>
            <tbody>
              {fieldForm}
            </tbody>
          </table>
          <input type="button" value="Aggiungi" onClick={this.addField}/>
          <input type="submit" value="Salva" />
        </form>
      </div>
    );
  }
}

export default EditStructure;
