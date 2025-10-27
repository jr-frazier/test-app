// app/api/proxy/[...path]/route.js
export async function GET(req, {params}) {
    const path = params.path.join("/");
    const targetUrl = `https://accounts.stage.az.digicert.net/${path}`;

    const res = await fetch(targetUrl, {
        headers: {
            // Forward original headers if needed
            ...(req.headers.get("authorization") && {
                Authorization: req.headers.get("authorization"),
            }),
        },
    });

    const data = await res.arrayBuffer();
    return new Response(data, {
        status: res.status,
        headers: {
            "Content-Type": res.headers.get("content-type") || "application/json",
            // This *is* your local domain now — so no CORS issue
        },
    });
}
