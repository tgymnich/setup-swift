import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as path from 'path'

export async function getSwift(
  version: string,
  platform: string
): Promise<void> {
  const swiftBranch = `swift-${version}-release`
  const swiftVersion = `swift-${version}-RELEASE`
  let toolPath = tc.find('Swift', version, platform)

  if (toolPath) {
    core.debug(`Tool found in cache ${toolPath}`)
  } else {
    core.debug('Downloading Swift')
    const re = /\./gi
    const swiftUrl = `https://swift.org/builds/${swiftBranch}/${platform.replace(
      re,
      ''
    )}/${swiftVersion}/${swiftVersion}-${platform}.tar.gz`
    const swiftArchive: string = await tc.downloadTool(swiftUrl)
    let swiftDirectory = await tc.extractTar(swiftArchive, undefined, 'xpz')
    const folderName = `${swiftVersion}-${platform}`
    swiftDirectory = path.join(swiftDirectory, folderName)

    core.debug(`Swift extracted to ${swiftDirectory}`)
    toolPath = await tc.cacheDir(swiftDirectory, 'Swift', version, platform)
  }

  const swiftBin = path.join(toolPath, 'usr', 'bin')

  core.addPath(swiftBin)
}
