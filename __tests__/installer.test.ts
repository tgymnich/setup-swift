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
  it('', () => {
    /* this file contains test utilitlies */
  })
})
