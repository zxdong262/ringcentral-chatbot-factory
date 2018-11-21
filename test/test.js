const rcf = require('../lib')
const assert = require('assert')
const {rm} = require('shelljs')
const {resolve} = require('path')
const prompts = require('prompts')
const pack = require('../package.json')
const testConfig = {
  name: 'my-app',
  npmName: 'my-app',
  description: 'ma-app',
  version: '0.0.1',
  language: 'python',
  confirm: true
}

describe(pack.name, function() {
  this.timeout(100000)
  it('default', function(done) {
    prompts.inject(testConfig)
    let p = resolve(__dirname, './my-app')
    rcf({
      path: p
    })
    setTimeout(() => {
      let pkg = resolve(p, 'package.json')
      let pkgObj = require(pkg)
      assert(pkgObj.version === testConfig.version)
      assert(pkgObj.name === testConfig.name)
      assert(pkgObj.description === testConfig.description)
      let em = resolve(p, 'README.md')
      let str = require('fs').readFileSync(em).toString()
      assert(
        str.includes(`# ${testConfig.name}`)
      )
      assert(
        str.includes(`${testConfig.description}`)
      )
      rm('-rf', p)
      done()
    }, 5500)
  })

})
