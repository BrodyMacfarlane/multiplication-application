import React, { Component } from 'react';

export default class Input extends Component {
  componentDidUpdate(){
    this.nameInput.focus()
  }

  render(){
    return (
      <div className="input-container">
        <input onKeyPress={(e) => this.props.checkEnter(e)} ref={(input) => { this.nameInput = input; }} type="text" maxLength="4" className="answer-input" value={this.props.answer} onChange={e => this.props.updateAnswer(e)}/>
      </div>
    )
  }
}