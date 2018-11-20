const reef = require('../lib')
const assert = require('assert')
const fs = require('fs')
const {rm} = require('shelljs')
const {resolve} = require('path')
const prompts = require('prompts')
const testConfig = {
  name: 'my app',
  npmName: 'my-app',
  description: 'ma-app',
  version: '0.0.1',
  language: 'python',
  confirm: true
}

describe('version fixer', function() {
  this.timeout(100000)
  it('default', function(done) {
    prompts.inject(testConfig)
    let p = resolve(__dirname, './my-app')
    reef({
      path: p
    })
    done()
  })

})
