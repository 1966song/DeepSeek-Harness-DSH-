/**
 * Host entry for dsh-market: three HTTP routes powering the plugin
 * marketplace — catalog scan, install (repo or git), uninstall. All
 * file/patch mutations happen here, never in the browser.
 */
import type { ServerResponse } from 'node:http'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type { Context } from '@deepseek-ai/cordis'
import { catalog, installFromGit, installFromRepo, installFromDir, resolveRepo, uninstall } from './market.ts'
import type { MarketInstallRequest, MarketResult, MarketUninstallRequest } from './shared.ts'

/** Cordis function-plugin name. */
export const name = 'dsh-market'
/** Host services needed by the market routes. */
export const inject = ['webServer']

/** Write one JSON response with no-store caching. */
function writeJson(res: ServerResponse, status: number, payload: unknown): void {
  const body = JSON.stringify(payload)
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(body)
}

/** Read and parse a JSON request body (small payloads only). */
async function readJson<T>(req: import('node:http').IncomingMessage): Promise<T | null> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > 64 * 1024) return null
    chunks.push(buffer)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as T
  } catch {
    return null
  }
}

/**
 * Register the Host half: the market routes.
 * @param ctx - Host context for the installed plugin.
 */
export function apply(ctx: Context): void {
  ctx.webServer.register({
    kind: 'exact',
    path: '/api/dsh-market/catalog',
    handler: (_req, res) => {
      try {
        writeJson(res, 200, catalog())
      } catch (error) {
        writeJson(res, 500, { error: error instanceof Error ? error.message : String(error) })
      }
    },
  })

  ctx.webServer.register({
    kind: 'exact',
    path: '/api/dsh-market/install',
    handler: async (req, res) => {
      let result: MarketResult
      try {
        const request = await readJson<MarketInstallRequest>(req)
        if (request === null) {
          result = { ok: false, message: '请求格式错误' }
        } else if (request.kind === 'repo') {
          const repo = resolveRepo()
          if (repo === null) result = { ok: false, message: '未配置插件仓库（设置环境变量 DSH_MARKET_REPO）' }
          else result = installFromRepo(repo, request.id)
        } else {
          result = installFromGit(request.url)
        }
      } catch (error) {
        result = { ok: false, message: error instanceof Error ? error.message : String(error) }
      }
      writeJson(res, result.ok ? 200 : 400, result)
    },
  })

  ctx.webServer.register({
    kind: 'exact',
    path: '/api/dsh-market/uninstall',
    handler: async (req, res) => {
      let result: MarketResult
      try {
        const request = await readJson<MarketUninstallRequest>(req)
        result = request === null || typeof request.id !== 'string'
          ? { ok: false, message: '请求格式错误' }
          : uninstall(request.id)
      } catch (error) {
        result = { ok: false, message: error instanceof Error ? error.message : String(error) }
      }
      writeJson(res, result.ok ? 200 : 400, result)
    },
  })
}

// Re-exported for the browser-side catalog shape (type-only).
export type { MarketCatalog, MarketPlugin, MarketResult } from './shared.ts'
