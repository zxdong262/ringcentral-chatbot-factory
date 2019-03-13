#!/usr/bin/env node

const reef = require('../lib')
const resolve = require('path').resolve
const program = require('commander')

program
  .version(require('../package.json').version)
  .description('Cli tool to create a RingCentral chatbot code')
  .usage('[appName]')
  .option('-A, --no-promots', 'use default options without promots')
  .parse(process.argv)
console.log(program)
let name = program.args.shift()
if (!name) {
  return program.outputHelp()
}

let path = resolve(name)

reef({
  name,
  path,
  auto: program.rawArgs.includes('-A') || program.rawArgs.includes('--no-promots')
})
