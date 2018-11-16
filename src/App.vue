<template>
  <div id="app">
    <h1>{{title}}</h1>
    <div class="error" v-if="applicationError">
      <h2>ERROR</h2>
      <p >{{applicationError}}</p>
    </div>
    <iframe class="main" v-if="currentUrl" :src="currentUrl"></iframe>
    <iframe class="info1" :src="infoUrls.info1"></iframe>
    <iframe class="info2" :src="infoUrls.info2"></iframe>
    <div class="main" v-if="!currentUrl">
      <h2>{{inputConfig.noUrlSelectedMsg}}</h2>
    </div>
  </div>
</template>

<script>
import mqtt from 'mqtt'
export default {
  name: 'App',
  components: {},
  props: {
    mqttConfig: {
      required: true,
      type: Object
    },
    inputConfig: {
      required: true,
      type: Object
    },
    infoUrls: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      DEFAULT_TITLE: 'mqtt-device-frontent-service',
      title: 'mqtt-device-frontent-service',
      currentUrl: '',
      startTime: new Date().getTime(),
      client: null,
      applicationError: null
    }
  },
  computed: {
    uptime () {
      return new Date().getTime() - this.startTime
    }
  },
  created () {
    let qos = 1 // at least once ... we do not care about double delivery
    let self = this

    console.log('connecting to ' + this.mqttConfig.broker + ' ...')
    this.client = mqtt.connect(this.mqttConfig.broker, {
      will: {
        topic: self.mqttConfig.statusTopic,
        payload: '0',
        qos: qos,
        retain: true
      },
      keepalive: 10
    })

    this.client.on('connect', function () {
      try {
        console.log('connected to ' + self.mqttConfig.broker)

        self.client.subscribe(self.mqttConfig.inputTopic, qos)
        console.log('Subscribed to ' + self.mqttConfig.inputTopic + ' with QoS=' + qos)

        self.client.publish(self.mqttConfig.statusTopic, '1', {retain: true, qos: qos})
        console.log('Published 1 to ' + self.mqttConfig.statusTopic + ' with retain=true, QoS=' + qos)
      } catch (err) {
        self.applicationError = 'error in onConnect. Error: ' + err
        console.log('%c [ERROR]: ' + self.applicationError, 'background: yellow; color: red')
      }
    })

    this.client.on('message', function (topic, message) {
      try {
        let inputValue = parseInt(message)
        console.log("Got message '" + inputValue + "' on " + topic)
        self.changeUrl(inputValue)
      } catch (err) {
        self.applicationError = 'error in onMessage. Error: ' + err
        console.log('%c [ERROR]: ' + self.applicationError, 'background: yellow; color: red')
      }
    })
  },
  methods: {
    changeUrl (inputValue) {
      if (this.inputConfig.inputValueMapping.hasOwnProperty(inputValue) && this.inputConfig.inputValueMapping[inputValue] !== null) {
        // inputValue config exists and is configured ...
        let inputValueConfig = this.inputConfig.inputValueMapping[inputValue]
        let url = this.getUrl(inputValueConfig)
        let name = this.getName(inputValueConfig)

        this.currentUrl = url
        this.title = name === '' ? this.DEFAULT_TITLE : name
        console.log('Changed radio to ' + name + ' / ' + url)
      } else {
        // Missing inputValue config
        this.currentUrl = ''
        this.title = 'NO ACTION for ' + inputValue
      }
    },
    getUrl (inputValueConfig) {
      if (inputValueConfig.hasOwnProperty('url') && inputValueConfig.url !== null) {
        return inputValueConfig.url
      } else {
        return ''
      }
    },
    getName (inputValueConfig) {
      if (inputValueConfig.hasOwnProperty('title') && inputValueConfig.title !== null) {
        return inputValueConfig.title
      } else {
        return ''
      }
    }
  }
}
</script>

<style>
  body {
    background: rgb(238, 238, 238);
  }
  h1 {
    color: #0009;
    font-size: 90px;
    font-weight: bold;
    letter-spacing: -1px;
    line-height: 1;
    margin-top: 40px;
    text-align: center;
  }
  h2 {
    text-align: center;
  }
  p {
    margin: 10px;
  }
  #app {
    font-family: 'Helvetica Neue', 'Open Sans', Arial, sans-serif;
    font-size: 18px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-top: 5px;
  }
  .main {
    position: absolute;
    height: 80%;
    border: none;
    width: 45%;
    top: 200px;
    left: 10px;
  }
  .info1 {
    position: absolute;
    height: 340px;
    border: none;
    width: 750px;
    top: 200px;
    right: 10px;
  }
  .info2 {
    position: absolute;
    height: 340px;
    border: none;
    width: 750px;
    top: 560px;
    right: 10px;
  }
  .error {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 500px;
    height: 150px;
    background: lightgoldenrodyellow;
    color: red
  }
</style>
