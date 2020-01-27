
class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: [],
      lastId: 0,
    };
  }

  addSearchField = evt => {
    const {fields, lastId} = this.state;
    this.setState({
      fields: [
        ...fields,
        {
          id: lastId,
          value: "",
          field: this.props.options[0],
        },
      ],
      lastId: lastId+1,
    });
  }

  handleDelete = evt => {
    const {id} = evt.target.props;
    const {fields} = this.state;
    this.setState({
      fields: fields.filter(f => f.id !== id),
    });
  }

  render() {
    const {fields} = this.state;
    const sFields = fields.map(f => {
      return (
        <SearchField key={f.id} id={f.id} options={this.props.options} onDelete={this.handleDelete} />
      );
    })
    return (
      <form>
        {sFields}
        <input type="button" value="Aggiungi campo" onClick={this.addSearchField} />
      </form>
    );
  }
}

class SearchField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      field: "0",
      value: "",
    };
  }

  changeHandler = evt => {
    this.setState({
      [evt.target.name]: evt.target.value,
    })
  }

  deleteSearchField = evt => {
    if(this.props.onDelete) {
      this.props.onDelete({
        target: this,
      });
    }
  }

  render() {
    const {field, value} = this.state;
    const {options} = this.props;
    const optionsUi = options.map(o => {
      return <option key={o.id} value={o.id}>{o.name}</option>;
    })
    return (
      <div>
        <select name="field" onChange={this.changeHandler} value={field}>
          {optionsUi}
        </select>
        <input type="text" name="value" value={value} onChange={this.changeHandler} />
        <input type="button" value="-" onClick={this.deleteSearchField} />
      </div>
    );
  }
}
