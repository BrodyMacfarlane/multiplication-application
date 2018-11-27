import React, { Component } from 'react';
import axios from 'axios';
import Input from './Components/Input';
import Timer from './Components/Timer';
import Numbers from './Components/Numbers';
import Loading from './Components/Loading';
import './App.css';

export default class App extends Component {
  constructor(){
    super()
    this.state = {
      num1: 0,
      num2: 0,
      answer: '',
      time: "0.0",
      timerrolling: true,
      correct: false,
      apiCall: false,
      simpleApiCall: false,
      avgTime: null
    }
    this.timerFunc = this.timerFunc.bind(this)
    this.newMulti = this.newMulti.bind(this)
    this.intervalHandle
  }

  componentDidUpdate(){
    if(this.state.timerrolling === true && (this.state.num1 * this.state.num2 === parseInt(this.state.answer))){
      clearInterval(this.intervalHandle)
      this.setState({
        correct: true,
        timerrolling: false,
        apiCall: true
      }, () => {
        if(parseFloat(this.state.time) > 0){
          axios.post('/api/checkNums', {num1: (this.state.num1 <= this.state.num2) ? this.state.num1 : this.state.num2, num2: (this.state.num1 <= this.state.num2) ? this.state.num2 : this.state.num1})
            .then(response => {
              if(response.data.timesencountered > 0){
                axios.post('/api/updateAverage', {num1: (this.state.num1 <= this.state.num2) ? this.state.num1 : this.state.num2, num2: (this.state.num1 <= this.state.num2) ? this.state.num2 : this.state.num1, avgTime: ((parseFloat(this.state.time) + parseFloat(response.data.avgtime))/2).toFixed(1), timesencountered: response.data.timesencountered + 1})
                  .then(response => {
                    console.log(`Average updated for ${this.state.num1} and ${this.state.num2} to ${((parseFloat(this.state.time) + parseFloat(response.data.avgtime))/2).toFixed(1)}!`)
                    this.setState({apiCall: false})
                  })
              }
              else {
                axios.post('/api/addNewNum', {num1: (this.state.num1 <= this.state.num2) ? this.state.num1 : this.state.num2, num2: (this.state.num1 <= this.state.num2) ? this.state.num2 : this.state.num1, avgTime: (parseFloat(this.state.time)).toFixed(1)})
                  .then(response => {
                    console.log(`Average added for ${this.state.num1} and ${this.state.num2} to ${this.state.time}!`)
                    this.setState({apiCall: false})
                  })
              }
          
          })
        }
      })
    }
  }

  newMulti(){
    this.setState({
      num1: Math.ceil(Math.random() * 50),
      num2: Math.ceil(Math.random() * 50),
      answer: '',
      timerrolling: true,
      correct: false, 
      time: (0.0).toFixed(1),
      simpleApiCall: true,
      avgTime: null
    }, () => {
      this.timerFunc()
      axios.post('/api/checkNums', {num1: (this.state.num1 <= this.state.num2) ? this.state.num1 : this.state.num2, num2: (this.state.num1 <= this.state.num2) ? this.state.num2 : this.state.num1})
        .then(response => {
          this.setState({simpleApiCall: false, avgTime: response.data.avgtime > 0 ? response.data.avgtime : null})
        })
    })
  }

  timerFunc(){
    this.intervalHandle = setInterval(() => {
      this.setState({time: (parseFloat(this.state.time) + 0.1).toFixed(1)})
      // this.setState({time: newTime.toString()})
    }, 100)
  }

  updateAnswer(e){
    const reg = /^\d+$/;
    if(reg.test(e.target.value) || e.target.value === ""){
      this.setState({
        answer: e.target.value
      })
    }
  }

  checkEnter(e){
    console.log("Hello")
    if((e.key === "Enter" && !this.state.timerrolling && !this.state.apiCall && !this.state.simpleApiCall) || (e.key === "Enter" && this.state.num1 === 0 && this.state.correct)){
      this.newMulti()
    }
  }

  render() {
    return (
      <div className="App">
        <Timer time={this.state.time} avgTime={this.state.avgTime}/>
        {this.state.apiCall && parseInt(this.state.time) > 0 ? <Loading/> : null}
        <div className="correct">{this.state.correct ? "Correct!" : null}</div>
        <Numbers num1={this.state.num1} num2={this.state.num2}/>
        <Input checkEnter={this.checkEnter.bind(this)} answer={this.state.answer} updateAnswer={this.updateAnswer.bind(this)}/>
        {(!this.state.timerrolling && !this.state.apiCall && !this.state.simpleApiCall) || (this.state.num1 === 0 && this.state.correct) ? <div onClick={this.newMulti} className="next-multi">Next ></div> : null}
      </div>
    );
  }
}