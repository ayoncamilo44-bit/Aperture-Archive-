document.getElementById('scanBtn').addEventListener('click', async () => {
    // --- HARDCODED API KEY ---
    const apiKey = "3853d9f5fb034cdfb5faa5f430743f00";
    // -------------------------

    const fileInput = document.getElementById('cardImageInput');
    const resultsContainer = document.getElementById('cardsList');

    if (!apiKey || apiKey === "YOUR_ACTUAL_CARDSIGHT_API_KEY_HERE") {
        alert("Please insert your valid API key into app.js!");
        return;
    }

    if (fileInput.files.length === 0) {
        alert("Please select or capture an image first.");
        return;
    }

    const file = fileInput.files[0];
    resultsContainer.innerHTML = "<p>Scanning multi-card layout... please wait...</p>";

    const formData = new FormData();
    formData.append("image", file);

    try {
        // Calling the CardSight REST API endpoint
        const response = await fetch("https://api.cardsight.ai/v1/identify", {
            method: "POST",
            headers: {
                "X-API-Key": apiKey
            },
            body: formData
        });

        const data = await response.json();

        // Clear loading text
        resultsContainer.innerHTML = "";

        // Check if cards were detected in batch
        if (data && data.cards && data.cards.length > 0) {
            data.cards.forEach((card, index) => {
                const cardCard = document.createElement('div');
                cardCard.className = 'card-item';
                cardCard.innerHTML = `
                    <h3>Card #${index + 1}: ${card.player_name || 'Unknown Player'}</h3>
                    <p><strong>Year/Set:</strong> ${card.year || ''} ${card.set_name || ''}</p>
                    <p><strong>Card #:</strong> ${card.card_number || 'N/A'}</p>
                    <p><strong>Team:</strong> ${card.team || 'N/A'}</p>
                `;
                resultsContainer.appendChild(cardCard);
            });
        } else if (data.player_name) {
            // Single card fall-back response
            resultsContainer.innerHTML = `
                <div class="card-item">
                    <h3>${data.player_name}</h3>
                    <p><strong>Year/Set:</strong> ${data.year || ''} ${card.set_name || ''}</p>
                    <p><strong>Card #:</strong> ${data.card_number || 'N/A'}</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = "<p>No cards recognized. Check lighting/glare and try again!</p>";
        }

    } catch (error) {
        console.error("Error scanning card:", error);
        resultsContainer.innerHTML = `<p style="color:red;">Scan failed: ${error.message}</p>`;
    }
});
