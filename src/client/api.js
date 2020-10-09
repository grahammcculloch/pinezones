import axios from 'axios';
import get from 'lodash/get';

export const getDefaultDaySlots = () => [{}, {}, {}, {}, {}];

const getPeople = async () => {
  let people = [];
  try {
    const response = await axios.default.get(
      `${process.env.REACT_APP_API_URL}/person?$orderby=name asc&$select=name,username,id,works_in__timezone`,
    );

    people = get(response, ['data', 'd'], []);
  } catch (err) {
    console.error('Failed to fetch all people', err);
  }
  return people;
};

const getTimeSlotsByDay = async (personId) => {
  let daySlots = getDefaultDaySlots();
  try {
    const response = await axios.default.get(
      `${process.env.REACT_APP_API_URL}/person__is_available_for__slot_index__on__day_of_the_week?$filter=person eq ${personId}&$select=on__day_of_the_week,is_available_for__slot_index,score`,
    );
    const timeSlots = get(response, ['data', 'd']);
    daySlots = timeSlots.reduce((byDay, slot) => {
      byDay[slot.on__day_of_the_week - 1][
        slot.is_available_for__slot_index
      ] = slot.score;
      return byDay;
    }, getDefaultDaySlots());
  } catch (err) {
    console.error('Failed to fetch time slots', err);
  }
  return daySlots;
};

export default {
  getPeople,
  getTimeSlotsByDay,
};
