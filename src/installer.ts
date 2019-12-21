import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as path from 'path'

export async function getSwift(version: string): Promise<void> {
  // determine os
  if (process.platform === 'darwin') {
    return getSwiftMacOS(version)
  } else if (process.platform === 'linux') {
    return getSwiftLinux(version)
  } else {
    core.setFailed('Platform not supported')
  }
}

async function getSwiftLinux(version: string): Promise<void> {
  const swiftBranch = `swift-${version}-release`
  const swiftVersion = `swift-${version}-RELEASE`

  // determine os release
  let lsbReleaseStdOut = ''

  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        lsbReleaseStdOut += data.toString()
      }
    }
  }

  await exec.exec('lsb_release', ['-rs'], options)
  const platform = `ubuntu${lsbReleaseStdOut.trim()}`
  // check cache
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
    swiftDirectory = path.join(swiftDirectory, `${swiftVersion}-${platform}`)

    core.debug(`Swift extracted to ${swiftDirectory}`)
    toolPath = await tc.cacheDir(swiftDirectory, 'Swift', version, platform)
  }

  const swiftBin = path.join(toolPath, 'usr', 'bin')

  core.addPath(swiftBin)
}

async function getSwiftMacOS(version: string): Promise<void> {
  const swiftBranch = `swift-${version}-release`
  const swiftVersion = `swift-${version}-RELEASE`
  // check cache
  let toolPath = tc.find('Swift', version, 'osx')

  if (toolPath) {
    core.debug(`Tool found in cache ${toolPath}`)
  } else {
    core.debug('Downloading Swift')

    const swiftURL = `https://swift.org/builds/${swiftBranch}/xcode/${swiftVersion}/${swiftVersion}-osx.pkg`
    const swiftPkg: string = await tc.downloadTool(swiftURL)
    const pkgPath = path.join(
      path.dirname(swiftPkg),
      `${swiftVersion}-extracted-package`
    )
    await io.mkdirP(pkgPath)
    await exec.exec('xar', ['-xf', swiftPkg, '-C', pkgPath])
    const swiftPayload = path.join(
      pkgPath,
      `${swiftVersion}-osx-package.pkg/Payload`
    )
    const toolchain = path.join(
      path.dirname(swiftPkg),
      `${swiftVersion}.xctoolchain`
    )
    await io.mkdirP(toolchain)
    const swiftDirectory = await tc.extractTar(swiftPayload, toolchain)
    toolPath = await tc.cacheDir(swiftDirectory, 'Swift', version, 'osx')
  }

  // install xcode toolchain
  let stdOut = ''

  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        stdOut += data.toString()
      }
    }
  }

  await exec.exec(
    `sudo mkdir -p /Library/Developer/Toolchains/${swiftVersion}.xctoolchain`
  )
  await exec.exec(
    `sudo cp -R ${toolPath}/ /Library/Developer/Toolchains/${swiftVersion}.xctoolchain`
  )
  await exec.exec(
    `/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" /Library/Developer/Toolchains/${swiftVersion}.xctoolchain/Info.plist`,
    [],
    options
  )

  core.exportVariable('TOOLCHAINS', stdOut)
}
