import Component from '@ember/component';
import layout from '../templates/components/date-picker';
import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default Component.extend({
  layout,
  moment: service(),
  init() {
    this._super(...arguments);

    let locale = window.navigator.userLanguage || window.navigator.language;
    if (locale) this.set('locale', locale);

    this.set('stateDate', this.get('moment').moment());
    this.renderCalendar();
  },

  // Check if n is number
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  // Render calendar
  renderCalendar() {
    // Clear dayObjects array
    this.set('dayObjects', A());

    let stateDate = this.get('stateDate');
    if (!stateDate) return;
    stateDate.locale(this.get('locale'));

    let
      // Clone moment object all next such variables with numbers are another clones of moment object
      today = this.get('moment').moment(),
      // Get first day of first week
      firstDay = stateDate.clone().startOf('month').startOf('week'),
      // Get last day of last week
      lastDay = stateDate.clone().endOf('month').endOf('week'),
      // Get previous month (number)
      oldMonth = stateDate.clone().subtract(1, 'months').month(),
      // Get next month (number)
      newMonth = stateDate.clone().add(1, 'months').month();


    const defaultWeekdays = Array.apply(null, Array(7)).map(function (_, i) {
      return stateDate.clone().startOf('week').weekday(i).format('dd');
    });
    this.set('weekDays', defaultWeekdays);

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
  },
  // Array of objects for each day
  dayObjects: computed('stateDate', function () {
    return A();
  }),
  weekDays: computed('stateDate', function () {
    return A();
  }),
  currentMonth: computed('stateDate', function () {
    return this.get('stateDate').format('MMMM');
  }),
  currentYear: computed('stateDate', function () {
    return this.get('stateDate').format('YYYY');
  }),
  // Check if date is picked and show time if it is
  dateNotPicked: computed('selectedDate', function () {
    const selectedDate = this.get('selectedDate');

    if (selectedDate) {
      return false;
    } else {
      return true;
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
      this.set('selectedDate', day.momentDateObj);
    },

    changeMonth(direction) {
      this.get('stateDate').add(direction, 'months');
      this.renderCalendar();
    },

    // Change year on buttons click
    changeYear(direction) {
      this.get('stateDate').add(direction, 'years');
      this.renderCalendar();
    },

    // Change year on manual enter in input
    enterYear(value) {
      if (this.isNumeric(value)) {
        if (value.length > 4) {
          alert('Year value should not contain more than 4 numbers');
        }

        if (value.length === 4) {
          this.set('stateDate', this.get('stateDate').clone().years(value));
          this.renderCalendar();
        }
      } else if (value !== '') {
        alert('Please enter a number');
      }
    }
  }

});






