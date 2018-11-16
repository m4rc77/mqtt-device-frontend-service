# mqtt-device-frontend-service

Simple web-application that shows configured web pages in a `<iframe>`, if messages do arrive on a given MQTT topic.

Hint: Be aware that pages may send http header `X-Frame-Options` if so they can not be included in a `iframe`!

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```
