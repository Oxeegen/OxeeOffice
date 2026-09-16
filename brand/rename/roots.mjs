// What gets renamed and scanned. Paths are relative to the repo root.

/** Build outputs that ship inside the packaged app. */
export const BUILT_ROOTS = [
  'apps/shell/out',
  'apps/docs/out',
  'apps/sheets/out',
  'apps/slides/out',
  'apps/pdf/out',
  'apps/markdown/out',
  'apps/html/out',
  'packages/cli/dist/genoffice.cjs',
]

/**
 * Files that legitimately keep upstream names. Every entry needs a reason.
 * Matched against the forward-slash relative path.
 */
export const ALLOWLIST = [
  // third-party runtime deps collected by the CLI build — not our copy
  /^packages\/cli\/dist\/node_modules\//,
  // source maps mirror original source; the builds emit none today, and if
  // one appears it is not user-visible copy
  /\.map$/,
]
