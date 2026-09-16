/**
 * OxeeOffice electron-builder configuration.
 *
 * Wraps upstream's electron-builder.cjs instead of editing it, so upstream
 * packaging changes (new extraResources, sidecars, signing) arrive on merge
 * untouched. Only identity, the update feed and artifact names are replaced.
 * Values come from brand/config/brand.config.json.
 *
 * Use through brand/scripts/dist.mjs (which applies brand assets and builds
 * first), or directly after a full build:
 *   npx electron-builder --config electron-builder.brand.cjs --win
 *
 * It sits next to upstream's file (not in brand/) because electron-builder
 * resolves relative resource paths against the app directory.
 */

const { execFileSync } = require('node:child_process')
const { join } = require('node:path')

const upstream = require('./electron-builder.cjs')
const brand = require('../../brand/config/brand.config.json')

const ROOT = join(__dirname, '..', '..')
const brandStep = (script, ...args) =>
  execFileSync(process.execPath, [join(ROOT, 'brand', 'scripts', script), ...args], { stdio: 'inherit' })

/** @type {import('electron-builder').Configuration} */
const config = {
  ...upstream,
  appId: brand.appId,
  productName: brand.productName,
  copyright: brand.copyright,

  // Written into the packaged app's package.json. `productName` is what
  // app.getName() returns, which names the window class, the userData folder
  // (%APPDATA%\OxeeOffice, ~/.config/OxeeOffice) and the Windows taskbar entry.
  // Without it the renamed installer still runs as "GenOffice" underneath.
  extraMetadata: {
    ...upstream.extraMetadata,
    productName: brand.productName,
    author: brand.company,
    homepage: brand.homepage,
  },

  // Auto-update from GitHub Releases on Oxeegen/OxeeOffice. Releases are
  // created as drafts (both platform jobs upload into the same one) and
  // published by the workflow once every artifact is in. electron-updater
  // resolves /releases/latest, so the tag prefix never has to parse as semver.
  publish: [
    {
      provider: brand.publish.provider,
      owner: brand.publish.owner,
      repo: brand.publish.repo,
      releaseType: 'draft',
      tagNamePrefix: brand.releaseTagPrefix,
    },
  ],

  nsis: {
    ...upstream.nsis,
    // name used by every OxeeOffice release so far
    artifactName: 'OxeeOffice-${version}-setup.${ext}',
    shortcutName: brand.productName,
    uninstallDisplayName: brand.productName,
  },

  linux: {
    ...upstream.linux,
    maintainer: brand.maintainer,
    vendor: brand.company,
    executableName: brand.linux.executableName,
    desktop: {
      entry: { Name: brand.productName, Comment: 'AI office suite' },
    },
  },
  appImage: {
    ...upstream.appImage,
    artifactName: 'OxeeOffice-${version}.${ext}',
  },
  // Package names are permanent: apt/dnf treat a later rename as an unrelated
  // app, which breaks upgrades. They are oxeeoffice from the first release.
  deb: {
    ...upstream.deb,
    artifactName: 'oxeeoffice_${version}_${arch}.deb',
    packageName: brand.linux.packageName,
    afterInstall: '../../brand/linux/after-install.sh',
    afterRemove: '../../brand/linux/after-remove.sh',
  },
  rpm: {
    ...upstream.rpm,
    artifactName: 'oxeeoffice-${version}.${arch}.rpm',
    packageName: brand.linux.packageName,
    afterInstall: '../../brand/linux/after-install.sh',
    afterRemove: '../../brand/linux/after-remove.sh',
  },

  beforePack: async (context) => {
    // licence gate first: nothing enterprise-licensed may be packed
    brandStep('check-ee.mjs')
    // user-visible names in the built bundles, then prove none survived
    brandStep('rename-built-output.mjs')
    brandStep('scan-visible-names.mjs', '--fail')
    await upstream.beforePack(context)
  },
}

module.exports = config
