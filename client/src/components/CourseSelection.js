import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class CourseSelection extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    courses: PropTypes.array.isRequired,
    selectedCourses: PropTypes.array.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = {
      selectedCourses: this.props.selectedCourses
    };
    this.handleCourseSelectionChanged = this.handleCourseSelectionChanged.bind(this);
    this.optionRenderer = (course) => `${course.name} (Prof. ${course.author})`
  }

  handleCourseSelectionChanged(selectedCourses) {
    this.setState({selectedCourses});
    this.props.onSelect(selectedCourses);
  }

  render() {
    return (
      <Select
        multi
        valueKey='id'
        name='courses'
        labelKey='name'
        className='courses'
        options={this.props.courses}
        value={this.props.selectedCourses}
        placeholder='Select your course(s)'
        onChange={this.handleCourseSelectionChanged}
        optionRenderer={this.optionRenderer}
      />
    );
  }
}
