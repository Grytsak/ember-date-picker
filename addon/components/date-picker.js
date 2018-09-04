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


    this.testObj.set('firstName', 'Bob');
    this.testObj.set('lastName', 'Test');
  },
  testObj: new EmberObject(),

  testComputed: computed('testObj', function () {
    return `Hello I am ${this.testObj.get('firstName')} ${this.testObj.get('lastName')}`
  }),
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
      oldMonth = +moment2.subtract(1, 'months').format('M'),
      moment3 = this.get('selectedDate').clone(),
      // Get next month (number)
      newMonth = +moment3.add(1, 'months').format('M'),
      //  Get date picker element
      datePicker = $('#ember-date-picker');

    // Fill array dayObjects with objects for each day
    while (firstDay.isBefore(lastDay)) {
      let day = new EmberObject();

      day.set('monthDay', firstDay.date());
      day.set('weekDay', firstDay.format('dddd'));
      day.set('today', firstDay.isSame(today, 'day'));
      day.set('oldDay', +firstDay.format('M') === oldMonth);
      day.set('newDay', +firstDay.format('M') === newMonth);
      day.set('startOfWeek', firstDay.format('dddd') === 'Sunday');
      day.set('momentDateObj', firstDay);

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
    datePicker.removeClass('hidden');
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
    // Pick date when click on day in calendar picker
    pickDate(day) {
      console.table(this.get('dayObjects'));
      console.log(day);
      return day.get('momentDateObj');
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
    }
  }

});
