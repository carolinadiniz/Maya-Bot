require('dotenv').config()

const App = require('./app')

const maya = new App({token: process.env.TOKEN1})
const deusa = new App({token: process.env.TOKEN2})

setTimeout(() => {
  //maya.deployCommands()
  //deusa.deployCommands()
}, 2000);