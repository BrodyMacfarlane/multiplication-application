import React, { Component } from 'react';

export default class Input extends Component {
  render(){
    return (
      <div className="num-display">
        {this.props.num1} <span className="x">x</span> {this.props.num2}
      </div>
    )
  }
}