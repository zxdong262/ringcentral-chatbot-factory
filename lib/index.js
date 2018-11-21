const prompts = require('prompts')
const {echo, mv, rm} = require('shelljs')
const {resolve} = require('path')
const {readFileSync, writeFileSync} = require('fs')
const download = require('download')
const os = require('os')
const {log} = console
const tempDir = os.tmpdir()

const supportedLanguage = {
  python: {
    zip: 'https://github.com/zxdong262/ringcentral-chatbot-python/archive/master.zip',
    folderName: 'ringcentral-chatbot-python-master'
  }
}

const questions = [
  {
    name: 'name',
    type: 'text',
    message: 'Project name, how about: my-great-app',
    validate: input => {
      if (!input) {
        return 'project name is required'
      } else if (input.length > 50) {
        return 'project name max length: 50'
      }
      return true
    }
  },
  {
    name: 'description',
    type: 'text',
    message: 'Project description',
    validate: input => {
      if (!input) {
        return 'project description is required'
      } else if (input.length > 1000) {
        return 'project description max length: 1000'
      }
      return true
    }
  },
  {
    name: 'version',
    type: 'text',
    message: 'Project version',
    initial: '0.0.1'
  },
  {
    name: 'language',
    type: 'text',
    message: 'What programming language do you use? Currently only support python',
    initial: 'python',
    validate: input => {
      if (!Object.keys(supportedLanguage).includes(input)) {
        return 'Currently only support python'
      }
      return true
    }
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Can you confirm?',
    initial: true
  }
]

function verifyResult(res) {
  return Object.keys(res).length === questions.length
}

function fetchZip(url, folderPath) {
  log('fetching', url, '-->', tempDir)
  rm('-rf', folderPath, folderPath + '.zip')
  return download(url, tempDir, {
    extract: true
  })
    .then(() => true)
    .catch(e => {
      throw e
    })
}

async function editFiles(from, res) {

  // package.json
  let pkg = resolve(from, 'package.json')
  let pkgInfo = require(pkg)
  let pkgObj = {
    name: res.name,
    description: res.description,
    keywords: pkgInfo.keywords,
    version: res.version,
    devDependencies: pkgInfo.devDependencies,
    dependencies: pkgInfo.dependencies
  }
  writeFileSync(
    pkg,
    JSON.stringify(pkgObj, null, 2)
  )

  // README
  let readme = resolve(from, 'README.md')
  let readmeStr = readFileSync(readme).toString()
  let arr = readmeStr.split('## Prerequisites')
  let final = `
# ${res.name}

${res.description}

## Prerequisites${arr[1]}
  `
  writeFileSync(readme, final)

  // remove files
  rm(
    '-rf',
    resolve(from, '.travis.yml'),
    resolve(from, 'test'),
    resolve(from, 'bin/test'),
    resolve(from, 'bin/ci'),
    resolve(from, 'docs'),
  )
}

module.exports = async function ask({path: targetPath}) {
  let res = await prompts(questions)
  if (!verifyResult(res)) {
    return process.exit(0)
  }
  delete res.confirm
  console.log(res)
  res.npmName = res.name.replace(/\s+/g, '-')
  echo('building')
  let {language} = res
  let obj = supportedLanguage[language]
  let {zip, folderName} = obj
  let from = resolve(tempDir, folderName)
  await fetchZip(zip, from)
  await editFiles(from, res)
  mv(from, targetPath)
}
