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

    this.set('stateDate', this.get('moment').moment());
    this.set('dateNotPicked', true);
    this.renderCalendar();
  },

  // Render calendar
  renderCalendar() {
    // Clear dayObjects array
    this.set('dayObjects', Ember.A());
    let
      // Clone moment object all next such variables with numbers are another clones of moment object
      moment = this.get('stateDate'),
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
    this.set('currentMonth', this.get('stateDate').format('MMMM'));
    this.set('currentYear', this.get('stateDate').format('YYYY'));

    console.log('stateDate', this.get('stateDate'));
    console.log('selectedDate', this.get('selectedDate'));
  },
  // Array of objects for each day
  dayObjects: computed('stateDate', function () {
    return [];
  }),
  currentMonth: computed('stateDate', function () {
    return this.get('stateDate').format('MMMM');
  }),
  currentYear: computed('stateDate', function () {
    return this.get('stateDate').format('YYYY');
  }),
  hours: computed('selectedDate', {
    get() {
      const selectedDate = this.get('selectedDate');

      if (!selectedDate) return;

      return selectedDate.hours();
    },

    set(propName, value) {
      this.set('selectedDate', this.get('selectedDate').clone().hours(value));
      // return this.get('selectedDate').format('HH');
    }
  }),
  minutes: computed('selectedDate', {
    get() {
      const selectedDate = this.get('selectedDate');

      if (!selectedDate) return;

      return selectedDate.minutes();
    },

    set(propName, value) {
      this.set('selectedDate', this.get('selectedDate').clone().minutes(value));
      // return this.get('selectedDate').format('HH');
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
      this.set('dateNotPicked', false);
      this.set('selectedDate', day.momentDateObj);
    },

    changeMonth(direction) {
      if (direction === 1) {
        this.get('stateDate').add(1, 'months');
      }
      if (direction === -1) {
        this.get('stateDate').subtract(1, 'months');
      }
      this.renderCalendar();
    },

    // Change year on buttons click
    changeYear(direction) {
      if (direction === 1) {
        this.get('stateDate').add(1, 'years');
      }
      if (direction === -1) {
        this.get('stateDate').subtract(1, 'years');
      }
      this.renderCalendar();
    },

    // Change year on manual enter in input
    enterYear(value) {
      if (value.length > 4) {
        value = value.slice(0, 4);
      }

      if (value.length === 4) {
        this.set('stateDate', this.get('stateDate').clone().years(value));
        this.renderCalendar();
      }
    },

    // Change hours on buttons click
    changeHours(direction) {
      const
        selectedMoment = this.get('selectedDate'),
        currentHours = selectedMoment.hours(),
        newHours = (currentHours + 24 + direction) % 24;

      this.set('hours', newHours);
    },

    // Change minutes on buttons click
    changeMinutes(direction) {
      const
        selectedMoment = this.get('selectedDate'),
        currentMinutes = selectedMoment.minutes(),
        newHours = (currentMinutes + 60 + direction) % 60;

      this.set('minutes', newHours);
    },

    enterHour(value) {
      if (value.length >= 3) {
        value = value.slice(0, 3);
      }

      if (value.length <= 2) {
        this.set('selectedDate', this.get('selectedDate').clone().hours(value));
        this.renderCalendar();
      }
    }
  }

});
