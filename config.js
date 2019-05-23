var IP = require('ip')

_CONFIG = {
  port: 5001,

  //Don't change
  ip: IP.address(),
  logLevel: process.argv[2] || 0
}

module.exports = _CONFIG