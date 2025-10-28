'use client'

import {useEffect} from 'react'

export default function DcAppSwitcher() {

    // Mount after assets expose window.appswitcher
    useEffect(() => {
        const tryMount = () => {
            if (window.appswitcher && typeof window.appswitcher.mount === 'function') {
                try {
                    window.appswitcher.mount('appswitcher-container', {configUrl: '/mfe'})
                } catch (e) {
                    console.error('Error mounting app switcher:', e)
                }
            } else {
                setTimeout(tryMount, 100)
            }
        }
        tryMount()
    }, [])

    return <div id="appswitcher-container"/>
}