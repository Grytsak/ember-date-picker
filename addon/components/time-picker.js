import Component from '@ember/component';
import layout from '../templates/components/time-picker';
import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,
  moment: service(),

  // Check if n is number
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  actions: {
    // Change hours on buttons click
    changeHours(direction) {
      const
        selectedMoment = this.get('selectedDate'),
        currentHours = selectedMoment.hours(),
        newHours = (currentHours + 24 + direction) % 24;

      this.set('selectedDate', this.get('selectedDate').clone().hours(newHours));
      // this.set('hours', newHours);
    },

    // Change minutes on buttons click
    changeMinutes(direction) {
      const
        selectedMoment = this.get('selectedDate'),
        currentMinutes = selectedMoment.minutes(),
        newMinutes = (currentMinutes + 60 + direction) % 60;

      this.set('selectedDate', this.get('selectedDate').clone().minutes(newMinutes));
    },

    // Change hours on manual enter in input
    enterHour(value) {
      const selectedMoment = this.get('selectedDate');

      if (this.isNumeric(value)) {
        if (value.length > 2) {
          alert('Hour value should not contain more than 2 numbers');
        }

        if (value.length === 2) {
          let validValue = value % 24;
          this.set('selectedDate', selectedMoment.clone().hours(validValue));
        }
      } else if (value !== '') {
        alert('Please enter a number');
      }

    },

    // Change minutes on manual enter in input
    enterMinutes(value) {
      const selectedMoment = this.get('selectedDate');

      if (this.isNumeric(value)) {
        if (value.length > 2) {
          alert('Hour value should not contain more than 2 numbers');
        }

        if (value.length === 2) {
          let validValue = value % 60;
          this.set('selectedDate', selectedMoment.clone().minutes(validValue));
        }
      } else if (value !== '') {
        alert('Please enter a number');
      }
    }
  }
});
