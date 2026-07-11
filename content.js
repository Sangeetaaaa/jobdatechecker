console.log("Content script loaded!");

function findJobPosting(obj) {
    if (!obj) return null;

    // Single object
    if (obj["@type"] === "JobPosting") {
        return obj;
    }

    // Array of objects
    if (Array.isArray(obj)) {
        for (const item of obj) {
            const result = findJobPosting(item);
            if (result) return result;
        }
    }

    // @graph
    if (obj["@graph"]) {
        for (const item of obj["@graph"]) {
            const result = findJobPosting(item);
            if (result) return result;
        }
    }

    return null;
}

const scripts = document.querySelectorAll('script[type="application/ld+json"]');

if (scripts.length === 0) {
    console.log("No JSON-LD scripts found.");
} else {
    let jobPosting = null;

    for (const script of scripts) {
        try {
            const json = JSON.parse(script.textContent);
            jobPosting = findJobPosting(json);

            if (jobPosting) {
                break;
            }
        } catch (err) {
            console.warn("Failed to parse one JSON-LD script:", err);
        }
    }

    if (!jobPosting) {
        console.log("No JobPosting schema found.");
    } else {
        console.log("Found JobPosting:", jobPosting);

        if (!jobPosting.datePosted) {
            console.log("No datePosted found.");
        } else {
            const postedDate = new Date(jobPosting.datePosted);

            if (isNaN(postedDate.getTime())) {
                console.log("Invalid date:", jobPosting.datePosted);
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

                Object.assign(card.style, {
                    position: "fixed",
                    top: "20px",
                    right: "20px",
                    width: "220px",
                    padding: "16px",
                    background: "#fff",
                    borderRadius: "14px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    borderLeft: "5px solid #2563eb",
                    fontFamily: "Inter, Arial, sans-serif",
                    zIndex: "999999"
                });

                document.body.appendChild(card);
            }
        }
    }
}