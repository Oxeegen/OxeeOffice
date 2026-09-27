import { randomBytes } from 'node:crypto'
import { rename, unlink, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'

const RETRYABLE_RENAME_CODES = new Set(['EPERM', 'EACCES', 'EBUSY'])
const RENAME_RETRIES = 4
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function atomicWriteFile(filePath: string, data: Uint8Array): Promise<void> {
  const tmp = join(
    dirname(filePath),
    `.${basename(filePath)}.${randomBytes(6).toString('hex')}.tmp`,
  )
  try {
    await writeFile(tmp, data)
    for (let attempt = 0; ; attempt += 1) {
      try {
        await rename(tmp, filePath)
        return
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code ?? ''
        if (!RETRYABLE_RENAME_CODES.has(code) || attempt >= RENAME_RETRIES) throw error
        await sleep(50 * 2 ** attempt)
      }
    }
  } catch (error) {
    await unlink(tmp).catch(() => {})
    throw error
  }
}
