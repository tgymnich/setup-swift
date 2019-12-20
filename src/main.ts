import * as core from '@actions/core'
import * as installer from './installer'

async function run(): Promise<void> {
  try {
    const version = core.getInput('version')
    const platform = core.getInput('platform')

    await installer.getSwift(version, platform)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
