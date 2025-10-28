// 'use client'
//
// import Script from "next/script";
// import {useEffect} from "react";
//
// export default function AppSwitcher() {
//     useEffect(() => {
//         const tryMount = () => {
//             if (window.appswitcher && typeof window.appswitcher.mount === "function") {
//                 console.log("✅ Found appswitcher, mounting...");
//                 try {
//                     window.appswitcher.mount("appswitcher-container", {
//                         configUrl: "/mfe",
//                     });
//                 } catch (error) {
//                     console.error("❌ Error mounting app switcher:", error);
//                 }
//             } else {
//                 console.warn("⚠️ Appswitcher not loaded yet");
//             }
//         };
//
//
//         // Try mounting after a short delay (some MFE loaders are async)
//         const timer = setTimeout(tryMount, 2000);
//         const button = document.getElementById("productSwitcher");
//         console.log("BBBBBBBBBBBBB", button);
//         return () => clearTimeout(timer);
//     }, []);
//
//
//     return (
//         <>
//             {/* Load remote script through the rewrite proxy */}
//             {/*<Script*/}
//             {/*    src="/mfe/appswitcher/app/assets/appswitcher.js"*/}
//             {/*    strategy="afterInteractive"*/}
//             {/*    onLoad={() => console.log("✅ appswitcher script loaded")}*/}
//             {/*    onError={(e) => console.error("❌ Failed to load appswitcher script", e)}*/}
//             {/*/>*/}
//
//             <div id="appswitcher-container"/>
//         </>
//     );
// }

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