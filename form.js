function getUuidFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("uuid");
}

function showPage(pageId) {
    const pages = ["formContainer", "rpDisplay"];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === pageId) ? "block" : "none";
    });
}

function setCheckedValues(groupId, values) {
    const valueArray = (values || "").split(",").map(v => v.trim());
    const checkboxes = document.querySelectorAll(`#${groupId} input[type="checkbox"]`);
    checkboxes.forEach(cb => {
        cb.checked = valueArray.includes(cb.value);
    });
}

function getCheckedValues(groupId) {
    const checkboxes = document.querySelectorAll(`#${groupId} input[type="checkbox"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value).join(", ");
}

function fillForm(profile) {
    document.getElementById("name").value = profile.name || "";
    document.getElementById("gender").value = profile.gender || "";
    document.getElementById("dob").value = profile.dob ? profile.dob.slice(0, 10) : "";
    document.getElementById("height").value = profile.height || "";
    document.getElementById("weight").value = profile.weight || "";
    document.getElementById("major").value = profile.major || "";
    document.getElementById("greek").value = profile.greek || "";
    document.getElementById("greekrole").value = profile.greekrole || "";
    document.getElementById("address").value = profile.address || "";
    document.getElementById("job").value = profile.job || "";
    document.getElementById("storyline").value = profile.storyline || "";
    document.getElementById("image").value = profile.image || "";
    document.getElementById("uuid").value = profile.uuid || "";

    setCheckedValues("roleGroup", profile.role);
    setCheckedValues("activitiesGroup", profile.activities);
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("rpForm");
    const uuid = getUuidFromUrl();
    if (!uuid) {
        alert("UUID manquant.");
        return;
    }

    // ✅ Affiche l'UUID dans le champ non modifiable
    const uuidField = document.getElementById("uuid");
    if (uuidField) uuidField.value = uuid;

    showPage("formContainer");

    fetch("https://wgprofil.wintersgatesl.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid, action: "get" })
    })
    .then(res => res.json())
    .then(profile => {
        if (profile && profile.uuid && profile.name) {
            fillForm(profile);
        }
    });

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const payload = {
            uuid: document.getElementById("uuid").value,
            name: document.getElementById("name").value,
            gender: document.getElementById("gender").value,
            dob: document.getElementById("dob").value,
            height: document.getElementById("height").value,
            weight: document.getElementById("weight").value,
            role: getCheckedValues("roleGroup"),
            major: document.getElementById("major").value,
            activities: getCheckedValues("activitiesGroup"),
            greek: document.getElementById("greek").value,
            greekrole: document.getElementById("greekrole").value,
            address: document.getElementById("address").value,
            job: document.getElementById("job").value,
            storyline: document.getElementById("storyline").value,
            image: document.getElementById("image").value
        };

        console.log("Payload envoyé :", payload);

        try {
            await fetch("https://wgprofil.wintersgatesl.workers.dev/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
			
			sendWebhook(payload);
            window.location.href = "index.html?uuid=" + payload.uuid;
        } catch (err) {
            alert("Erreur lors de l'enregistrement.");
        }
    });

    const greekOptions = document.getElementById("greekOptions");
    const greekSelected = document.getElementById("greekSelected");
    const greekInput = document.getElementById("greek");

    if (greekOptions) {
        greekOptions.addEventListener("click", e => {
            const li = e.target.closest("li");
            if (!li) return;
            greekSelected.innerHTML = li.innerHTML;
            greekInput.value = li.dataset.value;
        });
    }
});

function sendWebhook(profile) {
  const webhookUrl = "https://discord.com/api/webhooks/1431322505569763470/PJg9Ox3ytBWR2BJaXevmLQWY0iDTnW3aAVzCRsXrE7Sr1TRRYLUElthPQDUXVXLHZPrC";

  const embed = {
    title: `${profile.name}`,
    color: 0xff0000,
	
    image: {
		url: profile.image || "https://example.com/default.png"
    },
    fields: [
      {
        name: "💳 Identity",
        value: `**Gender:** ${profile.gender || "?"}\n**DoB:** ${profile.dob || "?"}\n**Height:** ${profile.height || "?"}\n**Weight:** ${profile.weight || "?"}`,
        inline: true
      },
      {
        name: "🏛️ Greek House",
        value: `${profile.greek || "None"}\n${profile.greekrole || ""}`,
        inline: true
      },
      {
        name: "🎭 Role",
        value: profile.role || "—",
        inline: false
      },
      {
        name: "🎨 Activities",
        value: profile.activities || "—",
        inline: false
      },
      {
        name: "🌎 City Life",
        value: `**Address:** ${profile.address || "?"}\n**Job:** ${profile.job || "?"}`,
        inline: false
      },
      {
        name: "📔 Backstory",
        value: profile.storyline?.slice(0, 1024) || "—",
        inline: false
      }
    ],
    timestamp: new Date().toISOString()
  };

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] })
  }).then(res => {
    if (!res.ok) console.error("Erreur webhook :", res.statusText);
  }).catch(err => {
    console.error("Erreur webhook :", err);
  });
}
