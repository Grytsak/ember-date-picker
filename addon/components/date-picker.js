import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import layout from '../templates/components/date-picker';
import { inject as service } from '@ember/service';
import { compare } from '@ember/utils';

export default Component.extend({
  layout,
  moment: service(),
  init() {
    this._super(...arguments);

    this.set('selectedDate', this.get('moment').moment());
    this.renderCalendar();
  },

  // Render calendar
  renderCalendar() {
    // Clear dayObjects array
    this.set('dayObjects', Ember.A());
    let
      // Clone moment object all next such variables with numbers are another clones of moment object
      moment = this.get('selectedDate'),
      today = this.get('moment').moment(),
      // Get first day of first week
      firstDay = moment.clone().startOf('month').startOf('week'),
      // Get last day of last week
      lastDay = moment.clone().endOf('month').endOf('week'),
      // Get previous month (number)
      oldMonth = +moment.clone().subtract(1, 'months').month(),
      // Get next month (number)
      newMonth = +moment.clone().add(1, 'months').month();

    if (!moment) return;

    // Fill array dayObjects with objects for each day
    while (firstDay.isBefore(lastDay)) {
      let day = new EmberObject();
      let firstDayClone = firstDay.clone();

      day.set('monthDay', firstDay.date());
      day.set('weekDay', firstDay.format('dddd'));
      day.set('today', firstDay.isSame(today, 'day'));
      day.set('oldDay', +firstDay.month() === oldMonth);
      day.set('newDay', +firstDay.month() === newMonth);
      day.set('startOfWeek', firstDay.format('dddd') === 'Sunday');
      if (firstDay.isSame(this.get('selectedDate'))) {
        day.set('active', true);
      } else {
        day.set('active', false);
      }
      day.set('momentDateObj', firstDayClone);

      this.dayObjects.push(day);
      firstDay.add(1, 'days');
    }
    // Change month and year when click prev/next
    this.set('currentMonth', this.get('selectedDate').format('MMMM'));
    this.set('currentYear', this.get('selectedDate').format('YYYY'));

    console.log('selectedDate', this.get('selectedDate'));
    console.log('pickedDate', this.get('pickedDate'));
  },
  // Array of objects for each day
  dayObjects: computed('selectedDate', function () {
    return [];
  }),
  currentMonth: computed('selectedDate', function () {
    return this.get('selectedDate').format('MMMM');
  }),
  currentYear: computed('selectedDate', function () {
    return this.get('selectedDate').format('YYYY');
  }),
  hours: computed('selectedDate', {
    get() {
      const selectedDate = this.get('selectedDate');

      if (!selectedDate) return;

      return selectedDate.hours();
    },

    set(propName, value) {
      this.set('selectedDate', this.get('selectedDate').clone().hours(value));
    }
  }),
  actions: {

    // Pick date when click on day in calendar picker
    pickDate(day) {
      // Check if there is already active day and clear if there is
      this.dayObjects.any(function (item) {
        if (item.active) {
          item.set('active', false);
        }
      });

      day.set('active', true);
      // this.set('pickedDate', day.momentDateObj);
      this.set('selectedDate', day.momentDateObj);
    },

    changeMonth(direction) {
      if (direction === 1) {
        this.get('selectedDate').add(1, 'months');
      }
      if (direction === -1) {
        this.get('selectedDate').subtract(1, 'months');
      }
      this.renderCalendar();
    },

    // Change year on buttons click
    changeYear(direction) {
      if (direction === 1) {
        this.get('selectedDate').add(1, 'years');
      }
      if (direction === -1) {
        this.get('selectedDate').subtract(1, 'years');
      }
      this.renderCalendar();
    },

    // Change year on manual enter in input
    toggleYear() {
      const datePicker = document.getElementById('date-picker-year-input');
      let selectedDate = this.get('selectedDate');

      if (datePicker.value.length > 4) {
        datePicker.value = datePicker.value.slice(0, 4);
      }

      if (datePicker.value.length === 4) {
        this.set('selectedDate', this.get('moment').moment(`${datePicker.value}-${selectedDate.format('MM')}-${selectedDate.format('DD')}`));
        this.renderCalendar();
      }
    },

    changeHours(direction) {
      const
        selectedMoment = this.get('selectedDate'),
        currentHours = selectedMoment.hours(),
        newHours = (currentHours + 24 + direction) % 24;

      this.set('hours', newHours);
    }
  }

});
