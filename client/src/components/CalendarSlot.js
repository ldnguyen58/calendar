import React, { Component, PropTypes } from 'react';

export default class CalendarSlot extends Component {
  static propTypes = {
    slot: PropTypes.object.isRequired
  };

  render() {
    const slot = this.props.slot;
    const slotColor = slot.color.join(',');
    const conflictColor = '231, 76, 60';
    const borderLeftColor = slot.overlap ? conflictColor : slotColor;

    return (
      <div
        className='calendar__slot'
        style={{
          top: slot.top,
          left: slot.left,
          width: slot.width,
          height: slot.height,
          backgroundColor: `rgba(${slotColor}, 0.7)`,
          borderLeftColor: `rgb(${borderLeftColor})`}}>
        {slot.courseName}
      </div>
    );
  }
}
