import React,  { Component, PropTypes } from 'react';

export default class CalendarName extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  };

  render() {
    return (
      <input
        type='text'
        name='calendarName'
        value={this.props.value}
        className='header__name'
        onChange={this.props.onChange}
        placeholder='Enter calendar name'
      />
    );
  }
}
