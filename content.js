console.log("Content script loaded!");

const script = document.querySelector('script[type="application/ld+json"]');

if (!script) {
    console.log("No JSON-LD script found.");
} else {
    try {
        const data = JSON.parse(script.textContent);

        if (!data.datePosted) {
            console.log("No datePosted found.");
        } else {
            const postedDate = new Date(data.datePosted);

            if (isNaN(postedDate.getTime())) {
                console.log("Invalid date.");
            } else {
                const formattedDate = postedDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                });

                const card = document.createElement("div");

                card.innerHTML = `
                    <div style="font-size:13px;color:#6b7280;font-weight:600;margin-bottom:6px;">
                        📅 Job Posted
                    </div>

                    <div style="font-size:22px;font-weight:700;color:#111827;">
                        ${formattedDate}
                    </div>
                `;

                card.style.position = "fixed";
                card.style.top = "20px";
                card.style.right = "20px";
                card.style.width = "220px";
                card.style.padding = "16px";
                card.style.background = "#ffffff";
                card.style.borderRadius = "14px";
                card.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
                card.style.borderLeft = "5px solid #2563eb";
                card.style.fontFamily = "Inter, Arial, sans-serif";
                card.style.zIndex = "999999";

                document.body.appendChild(card);
            }
        }

    } catch (err) {
        console.log("Failed to parse JSON-LD:", err);
    }
}