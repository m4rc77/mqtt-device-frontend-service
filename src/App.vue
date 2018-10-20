<template>
  <div id="app">
    <h2>{{title}}</h2>
    <iframe v-if="currentRadio" :src="currentRadio">

    </iframe>
    <p v-if="!currentRadio">No Radio station selected!</p>
  </div>
</template>

<script>
import mqtt from 'mqtt'
export default {
  name: 'App',
  components: {},
  props: {
    topics: {
      required: true,
      type: Object
    },
    broker: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      DEFAULT_TITLE: 'mqtt-device-frontent-service',
      title: 'mqtt-device-frontent-service',
      currentRadio: '',
      startTime: new Date().getTime(),
      client: null
    }
  },
  computed: {
    uptime () {
      return new Date().getTime() - this.startTime
    }
  },
  beforeMount () {
  // created () {
    let qos = 1 // at least once ... we do not care about double delivery

    console.log('connecting to ' + this.broker + ' ...')

    this.client = mqtt.connect(this.broker)

    let self = this
    this.client.on('connect', function () {
      console.log('connected to ' + self.broker)

      Object.entries(self.topics).forEach(
        ([topic, value]) => {
          self.client.subscribe(topic, qos)
          console.log('Subscribed to ' + topic + ' with QOS=' + qos)
        }
      )

      // for (let i = 1; i <= 6; i++) {
      //   self.client.subscribe(TOPIC + i + '/PRESS_SHORT', 0)
      //   console.log('Subscribed to ' + TOPIC + i + '/PRESS_SHORT')
      //   self.client.subscribe(TOPIC + i + '/PRESS_LONG', 0)
      //   console.log('Subscribed to ' + TOPIC + i + '/PRESS_LONG')
      // }
    })

    this.client.on('message', function (topic, message) {
      var msg = "'" + message.toString() + "' on " + topic
      console.log(msg)
      self.changeRadio(topic)
    })
  },
  methods: {
    changeRadio (topic) {
      if (this.topics.hasOwnProperty(topic) && this.topics[topic] !== null) {
        // topic exists and is configured ...
        let url = this.getUrl(topic)
        let name = this.getName(topic)

        this.currentRadio = url
        this.title = name === '' ? this.DEFAULT_TITLE : name
        console.log('Changed radio to ' + name + ' / ' + url)
      } else if (this.topics.hasOwnProperty(topic) && this.topics[topic] == null) {
        // topic exists but is null ... ignore command
      } else {
        // Missing topic definition
        this.currentRadio = ''
        this.title = 'NO ACTION for ' + topic
      }
    },
    getUrl (topic) {
      if (this.topics.hasOwnProperty(topic) && this.topics[topic] !== null) {
        return this.topics[topic].url
      } else {
        return ''
      }
    },
    getName (topic) {
      // if (names.hasOwnProperty(topic)) {
      if (this.topics.hasOwnProperty(topic) && this.topics[topic] !== null) {
        // return names[topic]
        return this.topics[topic].title
      } else {
        return ''
      }
    }
    /*,
    async fetchCocktail() {
      let response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
      let json = await response.json()
      this.addTodo(json.drinks[0].strDrink)
      this.cocktail = json.drinks[0]
      this.cocktails.push(json.drinks[0])
    }
*/
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 5px;
  }
  iframe {
    position: absolute;
    height: 80%;
    border: none;
    width: 100%;
    top: 60px;
    left: 0px;
  }
</style>
