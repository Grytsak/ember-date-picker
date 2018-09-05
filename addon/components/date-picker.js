import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import layout from '../templates/components/date-picker';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,
  moment: service(),
  init() {
    this._super(...arguments);

    this.set('selectedDate', this.get('moment').moment());
    // this.renderCalendar();

  },

  // Render calendar
  renderCalendar() {
    // Clear dayObjects array
    this.set('dayObjects', []);
    let
      // Clone moment object all next such variables with numbers are another clones of moment object
      moment = this.get('selectedDate').clone(),
      today = this.get('moment').moment(),
      // Get first day of first week
      firstDay = moment.startOf('month').startOf('week'),
      moment1 = this.get('selectedDate').clone(),
      // Get last day of last week
      lastDay = moment1.endOf('month').endOf('week'),
      moment2 = this.get('selectedDate').clone(),
      // Get previous month (number)
      oldMonth = +moment2.subtract(1, 'months').month(),
      moment3 = this.get('selectedDate').clone(),
      // Get next month (number)
      newMonth = +moment3.add(1, 'months').month(),
      //  Get date picker element
      datePicker = document.getElementById('ember-date-picker');

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
      day.set('momentDateObj', firstDayClone);

      this.dayObjects.push(day);
      firstDay.add(1, 'days');

      // let day = {
      //   monthDay: firstDay.date(),
      //   weekDay: firstDay.format('dddd'),
      //   today: firstDay.isSame(today, 'day'),
      //   oldDay: +firstDay.format('M') === oldMonth,
      //   newDay: +firstDay.format('M') === newMonth,
      //   startOfWeek: firstDay.format('dddd') === 'Sunday'
      // };
      // this.dayObjects.push(day);
      // firstDay.add(1, 'days');


    }
    // Change month name when toggle prev/next on month
    this.set('currentMonth', this.get('selectedDate').format('MMMM'));
    this.set('currentYear', this.get('selectedDate').format('YYYY'));
    // Show date picker
    datePicker.classList.remove('hidden');
  },
  numOfTimes: computed('times', function () {
    const times = parseInt(this.get('times'));
    return new Array(times);
  }),
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
  actions: {
    // Show date picker
    toggleCalendar() {
      this.renderCalendar();
    },
    // Hide date picker
    hideCalendar() {
      const datePicker = document.getElementById('ember-date-picker');
      datePicker.classList.add('hidden');
    },
    // Pick date when click on day in calendar picker
    pickDate(day) {
      const datePicker = document.getElementById('date-picker-main-input');
      datePicker.value = '';
      datePicker.value = day.momentDateObj.format('YYYY-MM-DD');
      // console.log('day.momentDateObj:', day.momentDateObj);
    },
    // Toggle previous month
    togglePrev() {
      this.get('selectedDate').subtract(1, 'months');
      this.renderCalendar();
    },
    // Toggle next month
    toggleNext() {
      this.get('selectedDate').add(1, 'months');
      this.renderCalendar();
    },
    // Toggle next year
    toggleYearUp() {
      this.get('selectedDate').add(1, 'years');
      this.renderCalendar();
    },
    // Toggle previous year
    toggleYearDown() {
      this.get('selectedDate').subtract(1, 'years');
      this.renderCalendar();
    },
    // Toggle year on manual enter in input
    toggleYear() {
      const datePicker = document.getElementById('date-picker-year-input');
      let selectedDate = this.get('selectedDate');

      if (datePicker.value.length === 4) {

        if (datePicker.value.length > 4) {
          datePicker.value = datePicker.value.slice(0, 4);
        }

        this.set('selectedDate', this.get('moment').moment(`${datePicker.value}-${selectedDate.format('MM')}-${selectedDate.format('DD')}`));
        this.renderCalendar();
      }
    }
  }

});
