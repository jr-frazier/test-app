'use client'

// import {useEffect} from "react";
// import Script from "next/script";
//
// export default function AppSwitcher() {
//     useEffect(() => {
//         if (window.appswitcher && typeof window.appswitcher.mount === "function") {
//             try {
//                 // ✅ Use absolute path (starts with /)
//                 window.appswitcher.mount("appswitcher-container", {
//                     configUrl: "/mfe/appswitcher/app",
//                 });
//             } catch (error) {
//                 console.error("Error mounting app switcher:", error);
//             }
//         } else {
//             console.warn("Appswitcher not loaded or missing mount method.");
//         }
//     }, []);
//
//     return (
//         <>
//             {/*<Script*/}
//             {/*    src="/mfe/appswitcher/app/index.js"*/}
//             {/*    strategy="beforeInteractive"*/}
//             {/*    onError={(e) => console.error("Failed to load app switcher script", e)}*/}
//             {/*/>*/}
//             <div id="appswitcher-container"/>
//         </>
//     );
// }

import Script from "next/script";
import {useEffect} from "react";

export default function AppSwitcher() {
    useEffect(() => {
        const tryMount = () => {
            if (window.appswitcher && typeof window.appswitcher.mount === "function") {
                console.log("✅ Found appswitcher, mounting...");
                try {
                    window.appswitcher.mount("appswitcher-container", {
                        configUrl: "/mfe/",
                    });
                } catch (error) {
                    console.error("❌ Error mounting app switcher:", error);
                }
            } else {
                console.warn("⚠️ Appswitcher not loaded yet");
            }
        };

        // Try mounting after a short delay (some MFE loaders are async)
        const timer = setTimeout(tryMount, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Load remote script through the rewrite proxy */}
            {/*<Script*/}
            {/*    src="/mfe/appswitcher/app/assets/appswitcher.js"*/}
            {/*    strategy="afterInteractive"*/}
            {/*    onLoad={() => console.log("✅ appswitcher script loaded")}*/}
            {/*    onError={(e) => console.error("❌ Failed to load appswitcher script", e)}*/}
            {/*/>*/}

            <div id="appswitcher-container"/>
        </>
    );
}
