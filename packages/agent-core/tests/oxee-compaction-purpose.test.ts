// OxeeOffice: the chat-summary request is tagged so the main process can run it
// on the worker model (Oxee-instant); ordinary turns carry no tag.
import { describe, expect, it, vi } from 'vitest'
import {
  AgentLoop,
  createIpcTransport,
  type AgentSkill,
  type AgentStreamCallbacks,
  type AgentStreamRequest,
  type AgentTransport,
  type IpcStreamStart,
} from '../src'

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

describe('compaction request purpose', () => {
  it('tags only the summary request', async () => {
    const calls: Array<{ request: AgentStreamRequest; callbacks: AgentStreamCallbacks }> = []
    const transport: AgentTransport = {
      stream(request, callbacks) {
        calls.push({ request, callbacks })
        return { cancel: vi.fn() }
      },
    }
    const skill: AgentSkill = {
      id: 'test',
      systemPrompt: 'Test system prompt',
      tools: [],
      executeTool: () => ({ output: 'ok', summary: 'ok' }),
    }
    const loop = new AgentLoop({
      transport,
      skill,
      events: {},
      compaction: { maxBytes: 500, keepRecentBytes: 100 },
    })

    loop.run('Old conversation instruction')
    await flush()
    calls[0]!.callbacks.onDelta('Old answer '.repeat(80))
    calls[0]!.callbacks.onDone()
    loop.run('Recent question')
    await flush()
    calls[1]!.callbacks.onDelta('Recent answer')
    calls[1]!.callbacks.onDone()
    loop.run('Continue the old conversation')
    await flush()

    expect(calls).toHaveLength(3)
    expect(calls[0]!.request.purpose).toBeUndefined()
    expect(calls[1]!.request.purpose).toBeUndefined()
    expect(calls[2]!.request.purpose).toBe('compaction')
  })

  it('the IPC transport forwards the purpose, and omits it when absent', () => {
    const started: IpcStreamStart<{ provider: string }>[] = []
    const transport = createIpcTransport<{ provider: string }>({
      onStream: () => () => {},
      start: (request) => {
        started.push(request)
      },
      cancel: () => {},
      getSettings: () => ({ provider: 'oxeegen' }),
      unknownErrorText: () => 'unknown error',
    })
    const cb = { onDelta() {}, onToolCall() {}, onDone() {}, onError() {} }
    transport.stream({ system: 's', messages: [], tools: [], purpose: 'compaction' }, cb)
    transport.stream({ system: 's', messages: [], tools: [] }, cb)
    expect(started[0]!.purpose).toBe('compaction')
    expect('purpose' in started[1]!).toBe(false)
  })
})
