import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Calendar from './components/Calendar';
import CalendarName from './components/CalendarName';
import CourseSelection from './components/CourseSelection';
import './App.css';

const API_URL = 'http://localhost:3000/catalog.json';

class App extends Component {
  constructor(...args) {
    super(...args);
    this.updateWidth = this.updateWidth.bind(this);
    this.handleConflictChange = this.handleConflictChange.bind(this);
    this.handleCourseSelection = this.handleCourseSelection.bind(this);
    this.handleCalendarNameChange = this.handleCalendarNameChange.bind(this);
    this.state = {
      courses: [],
      hasConflict: false,
      selectedCourses: [],
      calendarName: localStorage.getItem('calendarName')
    };
  }

  async componentDidMount() {
    const res = await fetch(API_URL);
    const {courses} = await res.json();
    this.setState({courses});
    window.addEventListener('resize', this.updateWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth);
  }

  updateWidth() {
    this.forceUpdate();
  }

  handleCalendarNameChange(event) {
    const calendarName = event.target.value;
    this.setState({calendarName});
    localStorage.setItem('calendarName', calendarName);
  }

  handleCourseSelection(selectedCourses) {
    this.setState({selectedCourses, hasConflict: false});
  }

  handleConflictChange(hasConflict) {
    if (this.state.hasConflict !== hasConflict) {
      this.setState({hasConflict})
    }
  }

  render() {
    const calendarWidth = window.innerWidth * 0.8;

    return (
      <div>
        <div className='header'>
          <CalendarName
            value={this.state.calendarName}
            onChange={this.handleCalendarNameChange} />
        </div>

        <div className='main'>
          {this.state.hasConflict && <div className='main__error'>
            There is one or more schedule conflicts among selected courses.
            Conflicted courses are highlighted with red border.
          </div>}

          <CourseSelection
            courses={this.state.courses}
            selectedCourses={this.state.selectedCourses}
            onSelect={this.handleCourseSelection} />

          <Calendar
            width={calendarWidth}
            courses={this.state.selectedCourses}
            onConflictChange={this.handleConflictChange} />
        </div>
      </div>
    );
  }
}

export default App;
