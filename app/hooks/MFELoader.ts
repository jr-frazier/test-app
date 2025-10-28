'use client'

import {useEffect, useRef} from 'react'

type MicroAppConfig = {
    microapp: string
    microappUrl: string
    containerId?: string
}

declare global {
    interface Window {
        dcMicroFrontendLoader?: {
            init: (config: MicroAppConfig[]) => void
        }
    }
}

function ensureScriptLoaded(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // Already present?
        const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null
        if (existing?.dataset.loaded === 'true') {
            resolve()
            return
        }
        if (existing) {
            // If present but not confirmed loaded, hook to it
            existing.addEventListener('load', () => resolve(), {once: true})
            existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), {once: true})
            return
        }

        const s = document.createElement('script')
        s.src = src
        s.async = true
        s.crossOrigin = 'anonymous'
        s.addEventListener('load', () => {
            s.dataset.loaded = 'true'
            resolve()
        }, {once: true})
        s.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), {once: true})
        document.head.appendChild(s)
    })
}

export function useMicroFrontend(
    config: MicroAppConfig[],
    options?: {
        loaderSrc?: string // defaults to /dc_MFLoader.js
        retryMs?: number // poll for loader readiness
        maxRetries?: number
        autoInit?: boolean // default true
    }
) {
    const {
        loaderSrc = '/dc_MFLoader.js',
        retryMs = 100,
        maxRetries = 50,
        autoInit = true,
    } = options || {}

    const startedRef = useRef(false)

    useEffect(() => {
        if (startedRef.current || !autoInit) return
        startedRef.current = true

        let cancelled = false

        const run = async () => {
            try {
                await ensureScriptLoaded(loaderSrc)

                // wait for window.dcMicroFrontendLoader to be attached
                let tries = 0
                while (!cancelled && !window.dcMicroFrontendLoader && tries < maxRetries) {
                    await new Promise(res => setTimeout(res, retryMs))
                    tries++
                }
                if (cancelled) return
                if (!window.dcMicroFrontendLoader) {
                    console.error('dcMicroFrontendLoader not available after waiting')
                    return
                }

                window.dcMicroFrontendLoader.init(config)
            } catch (e) {
                console.error('Error initializing micro frontend loader:', e)
            }
        }

        run()
        return () => {
            cancelled = true
        }
    }, [autoInit, config, loaderSrc, maxRetries, retryMs])
}