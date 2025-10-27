import type {NextConfig} from "next";

const nextConfig = {
    async rewrites() {
        return [
            // 🔁 Proxy the microfrontend assets
            {
                source: "/mfe/:path*",
                destination: "https://accounts.stage.az.digicert.net/:path*",
            },
            // // // 🔁 Proxy API calls that start with /app/...
            {
                source: "/app/:path*",
                destination: "https://accounts.stage.az.digicert.net/app/:path*",
            },
        ];
    }
};

export default nextConfig;
