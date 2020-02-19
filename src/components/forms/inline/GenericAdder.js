// Custom components
import GenericModifier from "./GenericModifier";

class GenericAdder extends GenericModifier {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      value: "",
    };
  }

  finish = (evt) => {
    evt.preventDefault();

    const value = this.state.value;
    if(this.props.onFinish) {
      this.props.onFinish({value});
    }
    this.setState({
      value: "",
    });
  }

  cancel = (evt) => {}
}

export default GenericAdder;
