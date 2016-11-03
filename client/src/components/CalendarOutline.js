import React, { Component, PropTypes } from 'react';

const DAYS = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];
const HOURS = [
  '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', 'Noon', '1 PM', '2 PM',
  '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
];

export default class CalendarOutline extends Component {
  static propTypes = {
    slotWidth: PropTypes.number.isRequired
  };

  render() {
    const slotWidth = this.props.slotWidth;

    return (
      <table className='calendar__outline__table'>
        <thead>
          <tr>
            <th className='calendar__outline__table__cell'></th>
            {
              DAYS.map((day, i) => {
                return (
                  <th key={i}
                    className='calendar__outline__table__cell'
                    style={{width: `${slotWidth}px`}}>
                    {day}
                  </th>
                );
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            HOURS.map((hour, i) => {
              return (
                <tr key={i}>
                  <td className='calendar__outline__table__cell'>
                    <div className='calendar__outline__table__cell__hour'>{hour}</div>
                  </td>
                  {
                    DAYS.map((day, j) => {
                      return (
                        <td key={j} className='calendar__outline__table__cell calendar__outline__table__cell--border'>
                        </td>
                      );
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  }
}
