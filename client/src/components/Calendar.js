import React, { Component, PropTypes } from 'react';
import CalendarSlot from './CalendarSlot';
import CalendarOutline from './CalendarOutline';

const HOUR_COL_WIDTH = 45;
const SLOT_HEIGHT = 40;

export default class Calendar extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    courses: PropTypes.array.isRequired,
    onConflictChange: PropTypes.func.isRequired
  };

  // There are 7 columns and their total width should exclude the hour-column
  getSlotWidth() {
    return Math.floor((this.props.width - HOUR_COL_WIDTH) / 7)
  }

  /**
   * Compute all course slots properties to prepare for rendering.
   */
  processSlots() {
    const slotWidth = this.getSlotWidth();
    const groups = this.groupSlots();
    const allSlots = [];
    let hasConflict = false;

    for (const dayGroup of groups) {
      for (const group of dayGroup) {
        group.slots.forEach((slot, slotIndex) => { // eslint-disable-line no-loop-func
          allSlots.push(slot);

          if (group.slots.length > 1) {
            slot.overlap = true;
            hasConflict = true;
          }

          const prevSlots = group.slots.slice(0, slotIndex);
          const availableColumn = getFirstAvailableColumn(group, slot, prevSlots);
          if (availableColumn >= 0) {
            slot.column = availableColumn;
            computeSlotProperties(slot, group);
          }
          else {
            addColumnToGroup(group, slot, prevSlots);
          }
        })
      }
    }

    // Update conflicting status outside render()
    setTimeout(() => this.props.onConflictChange(hasConflict));
    return allSlots;

    function computeSlotProperties(slot, group) {
      slot.width = slotWidth / group.columnCount;
      slot.height = SLOT_HEIGHT * (slot.timeIndex[1] - slot.timeIndex[0]);
      slot.top = SLOT_HEIGHT * (slot.timeIndex[0] - 6);
      slot.left = HOUR_COL_WIDTH +
                  (slotWidth * (slot.dayIndex)) +
                  (slotWidth * (slot.column / group.columnCount));
    }

    function addColumnToGroup(group, slot, prevSlots) {
      const column = group.columnCount || 0;
      group.columnCount = column + 1;
      slot.column = column;
      prevSlots.concat(slot).forEach((slot) => {
        computeSlotProperties(slot, group);
      });
    }

    // Gets the first available column that can fit this slot
    function getFirstAvailableColumn(group, slot, prevSlots) {
      for (let col = 0; col < group.columnCount; col++) {
        const slotsInColumn = prevSlots.filter((prevSlot) => prevSlot.column === col);
        if (slotsInColumn.every((otherSlot) => !isOverlap(slot, otherSlot))) {
          return col;
        }
      }
      return -1;
    }

    function isOverlap(slot1, slot2) {
      if (slot1.dayIndex !== slot2.dayIndex) {
        return false;
      }

      const start1 = slot1.timeIndex[0];
      const start2 = slot2.timeIndex[0];
      const end1 = slot1.timeIndex[1];
      const end2 = slot2.timeIndex[1];

      return (
        end1 === end2 ||
        start1 === start2 ||
        (start1 < start2 && start2 < end1) ||
        (start2 < start1 && start1 < end2)
      );
    }
  }

  /**
   * Groups slots at 2 levels: by day, then by continuous overlapping groups.
   * The result will be an array of arrays (days) of arrays (groups):
   * [
   *  [ // groups for day
   *    [ // overlapping group 1: include one or more slots that overlap one another
   *      slot1, slot2...
   *    ],
   *    ... // next overlapping groups
   *  ],
   *  ... // groups of the next day
   * ]
   */
  groupSlots() {

    // We keep a list of base colors to assign to courses. If there are more
    // courses than colors, we'll start from the beginning but change the color.
    const colors = [
      [241, 196, 15], [26, 188, 156], [52, 152, 219], [155, 89, 182],
      [243, 156, 18], [46, 204, 113], [231, 76, 60], [149, 165, 166],
      [52, 73, 94], [189, 195, 199]
    ];

    // Groups slots by day
    const coursesByDay = [[], [], [], [], [], [], []];
    this.props.courses.forEach((course, courseIndex) => {
      course.dayIndex.forEach((dayIndex) => {
        coursesByDay[dayIndex].push({
          dayIndex,
          courseName: course.name,
          timeIndex: course.timeIndex,
          color: getColorForCourse(courseIndex)
        });
      });
    });

    // Groups if overlapped
    return coursesByDay.map(groupOverlappingCourses)

    function getColorForCourse(courseIdx) {
      const color = colors[courseIdx % colors.length];
      if (courseIdx / colors.length >= 1) {
        color[0] = (color[0] + 43) % 256;
        color[1] = (color[1] + 43) % 256;
        color[2] = (color[2] + 43) % 256;
      }
      return [...color];
    }

    function groupOverlappingCourses(courses) {
      // Sorts courses by start time
      const sortedCourses = courses.sort((course1, course2) => {
        return course1.timeIndex[0] - course2.timeIndex[0];
      });

      // Puts overlapping courses into the same group
      const groups = [];
      let currentGroup = null;
      for (const course of sortedCourses) {
        if (!currentGroup || course.timeIndex[0] >= currentGroup.endTime) {
          currentGroup = {endTime: course.timeIndex[1], slots: [course]};
          groups.push(currentGroup);
        }
        else {
          currentGroup.slots.push(course);
          currentGroup.endTime = Math.max(currentGroup.endTime, course.timeIndex[1]);
        }
      }
      return groups;
    }
  }

  render() {
    return (
      <div className='calendar'>
        <div className='calendar__outline'>
          <CalendarOutline slotWidth={this.getSlotWidth()} />
        </div>
        <div className='calendar__slots'>
          {this.processSlots().map((slot, i) => <CalendarSlot key={i} slot={slot} />)}
        </div>
      </div>
    );
  }
}
