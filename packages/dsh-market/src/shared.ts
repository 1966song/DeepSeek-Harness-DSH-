/**
 * Wire types shared by the market routes and the browser panel.
 */

/** One catalog row: a plugin the market knows about. */
export interface MarketPlugin {
  /** Package name, e.g. '@local/dsh-wallpaper'. */
  id: string
  /** Unscoped display name, e.g. 'dsh-wallpaper'. */
  name: string
  /** One-line description from package.json. */
  description: string
  /** package.json version. */
  version: string
  /** Where the plugin source lives: 'repo' (local plugin repository) or 'git' (manual URL install). */
  source: 'repo' | 'git'
  /** Whether the built browser+host bundles exist (installable without a build step). */
  built: boolean
  /** Whether the plugin is currently installed in the web profile. */
  installed: boolean
}

/** GET /api/dsh-market/catalog response. */
export interface MarketCatalog {
  /** Resolved local plugin repository path (null when not configured/found). */
  repo: string | null
  /** Catalog rows sorted by name. */
  plugins: MarketPlugin[]
}

/** POST /api/dsh-market/install request. */
export type MarketInstallRequest = {
  /** Install from the local plugin repository. */
  kind: 'repo'
  /** Unscoped package directory name under the repository's packages/. */
  id: string
} | {
  /** Install from a git URL (shallow clone; the package must ship a built lib/). */
  kind: 'git'
  url: string
}

/** POST /api/dsh-market/uninstall request. */
export interface MarketUninstallRequest {
  /** Package name (e.g. '@local/dsh-wallpaper'). */
  id: string
}

/** Common action result. */
export interface MarketResult {
  ok: boolean
  /** Human-readable message (localized by the client when possible). */
  message?: string
  /** True when the change needs a dsh web restart to take effect. */
  restartRequired?: boolean
}
