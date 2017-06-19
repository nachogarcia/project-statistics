var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PROJECT_OWNER: '"grab"',
  PROJECT_REPO: '"front-end-guide"'
})
