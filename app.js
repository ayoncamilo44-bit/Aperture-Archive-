// Wrapped with a CORS proxy to allow browser-based GitHub Pages to talk to CardSight
        const proxyUrl = "https://corsproxy.io/?";
        const targetUrl = "https://api.cardsight.ai/v1/identify/card";

        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
            method: "POST",
            headers: {
                "X-API-Key": apiKey
            },
            body: formData
        });
