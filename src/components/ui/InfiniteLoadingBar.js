import React from "react";

class InfiniteLoadingBar extends React.Component {
  constructor(props) {
    super(props);

    this.defaultSpeed = 500;
    this.animationProperties = [
      {left: -10, right: 100},
      {left: 50, right: -10},
      {left: 110, right: -10},
      null,
      {left: 0, right: 100},
      {left: 0, right: 50},
      {left: 100, right: -10},
      null,
    ];
    this.state = {
      animation: 0,
    };
  }

  update = (state) => {
    const { animation } = state;

    return {
      animation: (animation+1 < this.animationProperties.length) ? animation+1 : 0,
    }
  }

  componentDidMount() {
    const { speed } = this.props;

    this.animationUpdater = setInterval(
      () => this.setState((state) => this.update(state)),
      speed || this.defaultSpeed,
    );
  }

  componentWillUnmount() {
    clearInterval(this.animationUpdater);
  }

  render() {
    const { speed, className } = this.props;
    const { animation } = this.state;

    let progressCoords;
    if(this.animationProperties[animation]) {
      const { left, right } = this.animationProperties[animation];
      progressCoords = {
        left: `${left}%`,
        right: `${right}%`,
      };
    }
    else {
      progressCoords = {
        left: "0",
        right: "100%",
        visibility: "hidden",
      };
    }

    let styleSpeed = {};
    if(speed && speed !== this.defaultSpeed) {
      const speedSeconds = speed/1000;
      styleSpeed.transitionDuration = `${speedSeconds}s, ${speedSeconds}s`;
    }

    return (
      <div className={`infinite-loader-container pt-1 lighten-3 ${className}`}>
        <div className="infinite-loader" style={{...progressCoords, ...styleSpeed}} />
      </div>
    );
  }
}

export default InfiniteLoadingBar;
