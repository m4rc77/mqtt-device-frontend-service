<!--This clock is based on https://vuejsexamples.com/a-text-based-and-analog-clock-with-vue-js/-->
<template v-if="tick">
  <figure class="analog-clock">
    <figcaption class="analog-clock__face">
      <span v-for="n in 60"
            class="analog-clock__notch"
            :key="n"
            :class="{ '-long': !(n % 5) }"
            :style="{ transform: `rotate(${n * 6}deg)` }">
      </span>
    </figcaption>
    <span class="analog-clock__hand -seconds" :style="seconds"></span>
    <span class="analog-clock__hand -minutes" :style="minutes"></span>
    <span class="analog-clock__hand -hours" :style="hours"></span>
    <p class="date-text">{{date}}</p>
  </figure>
</template>

<script>
export default {
  name: 'Clock',
  data () {
    return {
      tick: 0,
      rotation: { hours: 0, minutes: 0, seconds: 0 },
      date: '-'
    }
  },
  computed: {
    hours () {
      return { transform: `translate3d(-50%, 0, 0) rotate(${this.rotation.hours}deg)` }
    },
    minutes () {
      return { transform: `translate3d(-50%, 0, 0) rotate(${this.rotation.minutes}deg)` }
    },
    seconds () {
      return { transform: `translate3d(-50%, 0, 0) rotate(${this.rotation.seconds}deg)` }
    }
  },
  methods: {
    updateTime () {
      // sync clock every 5 minutes ...
      if (this.tick % 300 === 0) {
        let date = new Date()
        let [h, m, s] = [date.getHours(), date.getMinutes(), date.getSeconds()]
        h = h % 12
        this.rotation = {
          hours: (h * 30) + (m * 0.5),
          minutes: (m * 6) + (s * 0.1),
          seconds: s * 6
        }
        // adjust tick to seconds ...
        this.tick = s

        // set date info
        this.date = date.toDateString()
        let dateOptions = {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
        this.date = date.toLocaleDateString('de-CH', dateOptions)
      } else {
        this.rotation.seconds += 6 // --> 360 / 60
        if (this.tick % 60 === 0) {
          this.rotation.minutes += 6 // --> 360 / 60
          this.rotation.hours += 0.5 // 360 / 12 / 60
        }
      }

      this.tick++
      setTimeout(() => this.updateTime(), 1000 - new Date().getMilliseconds())
    }
  },
  mounted () {
    this.updateTime()
  }
}
</script>

<style>
  .analog-clock {
    top: 60px;
    right: 25px;
    width: 140px;
    height: 140px;
    position: absolute;
    border-radius: 100%;
    background-color: whitesmoke;
    -webkit-transform: translate3d(-1.5rem, -50%, 0);
    transform: translate3d(-1.5rem, -50%, 0);
    -webkit-filter: drop-shadow(0 0.125rem 0.5rem rgba(0, 0, 0, 0.1));
    filter: drop-shadow(0 0.125rem 0.5rem rgba(0, 0, 0, 0.1));
  }
  .analog-clock__notch {
    -webkit-transform-origin: 50% 100%;
    transform-origin: 50% 100%;
    position: absolute;
    width: 1px;
    height: 49%;
    bottom: 50%;
    left: 50%;
  }
  .analog-clock__notch::after {
    content: '';
    width: 100%;
    height: 2.5%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #b6c3c9;
  }
  .analog-clock__notch.-long::after {
    width: 2px;
    height: 7.5%;
  }
  .analog-clock__hand {
    -webkit-transform-origin: 50% 100%;
    transform-origin: 50% 100%;
    background-color: #7392a0;
    position: absolute;
    width: 2px;
    height: 40%;
    bottom: 50%;
    left: 50%;
    border-radius: 2px;
    -webkit-transition: -webkit-transform 1s linear;
    transition: -webkit-transform 1s linear;
    transition: transform 1s linear;
    transition: transform 1s linear, -webkit-transform 1s linear;
  }
  .analog-clock__hand::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 10%;
    background-color: inherit;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .analog-clock__hand.-hours {
    height: calc(100% / 3);
    width: 3px;
    border-radius: 3px;
    -webkit-transition: -webkit-transform 1s linear;
    transition: -webkit-transform 1s linear;
    transition: transform 1s linear;
    transition: transform 1s linear, -webkit-transform 1s linear;
  }
  .analog-clock__hand.-seconds {
    width: 2px;
    height: 45%;
    border-radius: 0;
    /*background-color: #edbec5;*/
    background-color: #ed6062;
    -webkit-transition: -webkit-transform 100ms linear;
    transition: -webkit-transform 100ms linear;
    transition: transform 100ms linear;
    transition: transform 100ms linear, -webkit-transform 100ms linear;
  }
  .analog-clock__hand.-seconds::after {
    height: 12.5%;
  }
  .date-text {
    color: #0009;
    width: 220px;
    position: relative;
    top: 150px;
    font-weight: bold;
    margin: 0 0 0 -40px;
    text-align: center;
  }
</style>
