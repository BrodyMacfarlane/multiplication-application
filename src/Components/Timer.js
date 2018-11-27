import React, { Component } from 'react';

export default class Input extends Component {
  render (){
    return (
      <div className="timer-container">
        <div className="timer">{this.props.time}</div>
        <div className="avg-time">{this.props.avgTime ? `The average time is ${this.props.avgTime}s.` : "There is no average time data for this problem."}</div>
      </div>
    )
  }
}