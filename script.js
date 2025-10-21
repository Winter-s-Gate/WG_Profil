console.log("✅ Script chargé !");

// 🎬 Animation d’intro
document.addEventListener("DOMContentLoaded", () => {
    const blue = document.getElementById("imgBlue");
    const red = document.getElementById("imgRed");
    const fusion = document.getElementById("imgFusion");
    const content = document.getElementById("introContent");
    const sound = document.getElementById("introSound");

    if (blue && red && fusion && content) {
        setTimeout(() => {
            blue.style.transform = "translateX(100%)";
            blue.style.opacity = "1";
            red.style.transform = "translateX(-100%)";
            red.style.opacity = "1";
        }, 500);

        setTimeout(() => {
            blue.style.opacity = "0";
            red.style.opacity = "0";
            fusion.style.opacity = "1";
        }, 2000);

        setTimeout(() => {
            content.style.opacity = "1";
            sound?.play().catch(e => console.log("Audio bloqué :", e));
        }, 3000);
    }
});

function sanitizeName(name) {
    return name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
}

function showSavePrompt() {
  document.getElementById("saveSection").style.display = "block";
  document.getElementById("backButton").style.display = "none";
}

function saveRPName() {
  const name = document.getElementById("rpNameInput").value;
  if (!name) {
    alert("Enter save ID !.");
    return;
  }
  localStorage.setItem("rp_name", name);
  window.location.href = "profile.html";
}

// 🔙 Bouton retour
function goBack() {
    window.history.back();
}

// 📄 Lecture du profil RP depuis la Google Sheet CSV
async function loadRPProfileFromSheet(csvURL, targetName) {
    const response = await fetch(csvURL);
    const text = await response.text();
    const rows = text.split("\n").map(row => row.split(","));
    const headers = rows[0];
    const dataRows = rows.slice(1);

    const match = dataRows.find(row => sanitizeName(row[0]) === sanitizeName(targetName));
    if (!match) {
        alert("Profil RP introuvable !");
        return;
    }

    const profile = {};
    headers.forEach((key, i) => {
        profile[key.trim()] = match[i]?.trim() || "";
    });

    // 🖼️ Affichage dans le MOaP
    document.getElementById("rpName").textContent = profile["Nom RP"];
    document.getElementById("rpGender").textContent = profile["Genre"];
    document.getElementById("rpDOB").textContent = profile["Date de naissance"];
    document.getElementById("rpHeight").textContent = profile["Taille"];
    document.getElementById("rpWeight").textContent = profile["Poids"];
    document.getElementById("rpGreek").textContent = profile["Maison Greek"];
    document.getElementById("rpRole").textContent = profile["Rôle"];
    document.getElementById("rpStory").textContent = profile["Histoire RP"];
    document.getElementById("rpPortrait").src = profile["Lien vers portrait RP"];
}

// 🎯 Envoi du profil RP vers Discord (ancienne méthode HTML)
function sendToDiscord() {
    const fields = {
        name: document.getElementById("name")?.value || "Nom",
        gender: document.getElementById("gender")?.value || "Genre",
        dob: document.getElementById("dob")?.value || "Date",
        height: document.getElementById("height")?.value || "...",
        weight: document.getElementById("weight")?.value || "...",
        major: document.getElementById("major")?.value || "...",
        greek: document.getElementById("greek")?.value || "None",
        role: document.getElementById("role")?.value || "Role",
        address: document.getElementById("address")?.value || "Address",
        job: document.getElementById("job")?.value || "Job",
        story: document.getElementById("story")?.value || "..."
    };

    const activities = Array.from(document.querySelectorAll('input[name="activity"]:checked'))
        .map(el => el.value)
        .join(", ") || "None";

    const portraitName = sanitizeName(document.getElementById("portraitName")?.value || "default");
    const imageURL = `https://melinacrsl.github.io/Winter-sGates-Profil/assets/img/portraits/${portraitName}.png`;
    document.getElementById("portraitDisplay").src = imageURL;

    const greekEmojiMap = {
        abg: "<:abg:1425212800585826324>",
        acd: "<:acd:1425212842839117955>",
        kop: "<:kop:1425212877861556359>",
        osr: "<:osr:1425212906295005228>",
        pes: "<:pes:1425212938473443361>",
        pkv: "<:pkv:1425212984665444425>",
        None: "🏛️"
    };

    const greekEmoji = greekEmojiMap[fields.greek.toLowerCase()] || greekEmojiMap["None"];

    for (const key in fields) {
        localStorage.setItem(`rp_${key}`, fields[key]);
    }

    const webhookURL = "https://discord.com/api/webhooks/1424832477956018247/uMdgmPBJCIBlTxO6lCtAbm2pPemQcDEJstug2Nb77gDT9ZeErah0B1zrCeEOnADU8etp";
    const payload = {
        embeds: [
            {
                title: `📜 RP Profile: ${fields.name}`,
                color: 0x9b1e23,
                thumbnail: {
                    url: "https://melinacrsl.github.io/Winter-sGates-Profil/assets/img/wgcitylogo.png"
                },
                image: { url: imageURL },
                fields: [
                    { name: "⚧️ Gender", value: fields.gender, inline: true },
                    { name: "🎂 DoB", value: fields.dob, inline: true },
                    { name: "📏 Height", value: fields.height, inline: true },
                    { name: "⚖️ Weight", value: fields.weight, inline: true },
                    { name: "**🎓 Academic**", value: "\u200B" },
                    { name: "🎓 Major", value: fields.major, inline: true },
                    { name: "🏅 Activities", value: activities, inline: true },
                    { name: "🏛️ Greek House", value: `${greekEmoji} ${fields.greek}`, inline: true },
                    { name: "🎭 Role", value: fields.role, inline: true },
                    { name: "**🏠 Resident**", value: "\u200B" },
                    { name: "🏠 Address", value: fields.address, inline: true },
                    { name: "💼 Job", value: fields.job, inline: true },
                    { name: "**📖 Backstory**", value: "\u200B" },
                    { name: "\u200B", value: fields.story }
                ],
                footer: {
                    text: "Winter's Gates RP System"
                }
            }
        ]
    };

    fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert("Profile sent to Discord!");
        window.location.href = "profile.html";
    })
    .catch(err => alert("Error sending to Discord: " + err));
}
