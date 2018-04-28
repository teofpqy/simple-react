import React from './react';
import ReactDOM from './react-dom';


class Welcome extends React.Component {
  render() {
    return <h1>hello, {this.props.name}</h1>;
  }
}

function tick() {
  const element = (
    <div>
      <Welcome name="world"/>
      <h2> It is {new Date().toLocaleTimeString()}. </h2>
    </div>
  )

  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
