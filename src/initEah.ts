import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createRoot, type Root } from 'react-dom/client'
import moment from 'moment'

type EahModule = {
  Editor: React.ComponentType<any>
  injectComp: (...args: any[]) => any
  [key: string]: unknown
}

type ConvertComp = (components: Record<string, unknown>, type: string) => Record<string, unknown>

type EahMhModule = {
  default?: ConvertComp
  [key: string]: unknown
}

type LegacyReactDOM = typeof ReactDOM & {
  render?: (element: React.ReactNode, container: Element | DocumentFragment) => void
  unmountComponentAtNode?: (container: Element | DocumentFragment) => boolean
}

type EahWindow = Window & typeof globalThis & {
  React?: typeof React
  ReactDOM?: LegacyReactDOM
  moment?: typeof moment
  eah?: EahModule
  'eah-mh'?: ConvertComp | EahMhModule
  useMemo?: typeof React.useMemo
  useContext?: typeof React.useContext
}

const roots = new WeakMap<Element | DocumentFragment, Root>()

let readyPromise: Promise<EahModule> | null = null
let injected = false

function ensureReactDom(win: EahWindow) {
  const reactDom = ReactDOM as LegacyReactDOM

  win.ReactDOM = reactDom
}

function prepareGlobals(win: EahWindow) {
  win.React = React
  win.moment = moment
  win.useMemo = React.useMemo
  win.useContext = React.useContext
  ensureReactDom(win)
}

function loadScript<T>(
  win: EahWindow,
  selector: string,
  src: string,
  readValue: () => T | undefined,
  muteAlert = false,
) {
  const currentValue = readValue()

  if (currentValue) {
    return Promise.resolve(currentValue)
  }

  return new Promise<T>((resolve, reject) => {
    const currentAlert = win.alert
    const existingScript = document.querySelector<HTMLScriptElement>(selector)
    const script = existingScript ?? document.createElement('script')

    const restoreAlert = () => {
      if (muteAlert) {
        win.alert = currentAlert
      }
    }

    const resolveValue = () => {
      restoreAlert()
      const nextValue = readValue()

      if (nextValue) {
        resolve(nextValue)
        return
      }

      reject(new Error(`Failed to load ${src}`))
    }

    if (muteAlert) {
      win.alert = () => undefined
    }

    if (existingScript?.dataset.loaded === 'true') {
      resolveValue()
      return
    }

    script.src = src
    script.async = true
    script.dataset.loaded = 'false'

    if (src === '/eah.js') {
      script.dataset.pageRenderEah = 'true'
    } else {
      script.dataset.pageRenderEahMh = 'true'
    }

    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true'
        resolveValue()
      },
      { once: true },
    )
    script.addEventListener(
      'error',
      () => {
        restoreAlert()
        reject(new Error(`Failed to load ${src}`))
      },
      { once: true },
    )

    if (!existingScript) {
      document.body.appendChild(script)
    }
  })
}

function getConvertComp(win: EahWindow) {
  const eahMh = win['eah-mh']

  if (typeof eahMh === 'function') {
    return eahMh
  }

  if (eahMh && typeof eahMh.default === 'function') {
    return eahMh.default
  }

  return undefined
}

export function initEah() {
  if (readyPromise) {
    return readyPromise
  }

  const win = window as EahWindow
  prepareGlobals(win)

  readyPromise = Promise.all([
    loadScript(win, 'script[data-page-render-eah="true"]', '/eah.js', () => win.eah, true),
    loadScript(win, 'script[data-page-render-eah-mh="true"]', '/eah-mh.js', () => getConvertComp(win)),
    import('antd'),
  ])
    .then(([eah, convertComp, AntdComp]) => {
      if (!injected) {
        eah.injectComp(convertComp(AntdComp, 'antd'))
        injected = true
      }

      return eah
    })
    .catch((error) => {
      readyPromise = null
      throw error
    })

  return readyPromise
}
