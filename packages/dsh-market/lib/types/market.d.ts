import type { MarketCatalog, MarketPlugin, MarketResult } from './shared.ts';
/** DSH home (env override, then the default under the user profile). */
export declare function dshHome(): string;
/** The web profile directory. */
export declare function profileDir(): string;
/** The manual-install package seat. */
export declare function localPackagesDir(): string;
/** The profile's own patch layer (the user-editable insert list). */
export declare function profilePatchPath(): string;
/** Resolve the local plugin repository: DSH_MARKET_REPO, then common defaults. */
export declare function resolveRepo(): string | null;
/** The unscoped name of an @local/<pkg> package. */
export declare function unscoped(id: string): string;
/** Names of installed packages (the @local directory contents). */
export declare function installedPackages(): string[];
/** Whether one package is installed (directory present AND patch lists it). */
export declare function isInstalled(packageName: string): boolean;
/** Scan the local plugin repository's packages/ directory. */
export declare function scanRepo(repo: string): MarketPlugin[];
/** Build the full catalog response. */
export declare function catalog(): MarketCatalog;
/** Copy a built plugin package directory into @local/<pkg>. */
export declare function installFromDir(packageDir: string, packageName: string): MarketResult;
/** Install one package from the local plugin repository. */
export declare function installFromRepo(repo: string, id: string): MarketResult;
/** Shallow-clone a git URL into a temp dir and install its built package. */
export declare function installFromGit(url: string): MarketResult;
/** Uninstall one installed package. */
export declare function uninstall(packageName: string): MarketResult;
