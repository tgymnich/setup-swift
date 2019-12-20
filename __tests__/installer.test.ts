import io = require('@actions/io')
import fs = require('fs')
import path = require('path')
import child_process = require('child_process')

const toolDir = path.join(__dirname, 'runner', 'tools')
const tempDir = path.join(__dirname, 'runner', 'temp')
const swiftDir = path.join(__dirname, 'runner', 'swift')

process.env['RUNNER_TOOL_CACHE'] = toolDir
process.env['RUNNER_TEMP'] = tempDir
import * as installer from '../src/installer'

let swiftFilePath = path.join(
  swiftDir,
  'swift-5.0.2-RELEASE-ubuntu18.04.tar.gz'
)
let swiftUrl =
  'https://swift.org/builds/swift-5.0.2-release/ubuntu1804/swift-5.0.2-RELEASE/swift-5.0.2-RELEASE-ubuntu18.04.tar.gz'

describe('installer tests', () => {
  beforeAll(async () => {
    await io.rmRF(toolDir)
    await io.rmRF(tempDir)
    if (!fs.existsSync(`${swiftFilePath}.complete`)) {
      // Download swift
      await io.mkdirP(swiftDir)

      console.log('Downloading swift')
      child_process.execSync(`curl "${swiftUrl}" > "${swiftFilePath}"`)
      // Write complete file so we know it was successful
      fs.writeFileSync(`${swiftFilePath}.complete`, 'content')
    }
  }, 10000000)

  afterAll(async () => {
    try {
      //await io.rmRF(toolDir);
      //await io.rmRF(tempDir);
    } catch {
      console.log('Failed to remove test directories')
    }
  }, 100000)

  it("", () => {
    /* this file contains test utilitlies */
    });
})
