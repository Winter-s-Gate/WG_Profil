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

// 🔙 Bouton retour
function goBack() {
  window.history.back();
}

// 🎯 Envoi du profil RP vers Discord
function sendToDiscord() {
  // 🔄 Récupération des champs
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

  // 🏅 Activités sélectionnées
  const activities = Array.from(document.querySelectorAll('input[name="activity"]:checked'))
    .map(el => el.value)
    .join(", ") || "None";

  // 🏛️ Emoji Greek House
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

  // 💾 Sauvegarde locale
  for (const key in fields) {
    localStorage.setItem(`rp_${key}`, fields[key]);
  }

  // 📤 Webhook Discord avec embed stylisé
  const webhookURL = "https://discord.com/api/webhooks/1429880113574580374/4N0FiLxEEumr35xwilw6Ct5QKPrOTe6b56OrFDk7qSKrwdVphIOnEWGN7TDJ-_X0ry1I";
  const payload = {
	embeds: [
		{
			title: "📜 RP Profile",
			description: `**Name:** ${fields.name}\n**Gender:** ${fields.gender}\n**DoB:** ${fields.dob}`,
			color: 16711680
		},
		{
			title: "🎓 Academic",
			description: `**Major:** ${fields.major}\n**Activities:** ${activities}\n**Greek House:** ${greekEmoji} ${fields.greek}`,
			color: 16711680
		},
		{
			title: "🏠 Resident",
			description: `**Address:** ${fields.address}\n**Job:** ${fields.job}`,
			color: 16711680
		},
		{
			title: "📖 Story",
			description: fields.story,
			color: 16711680
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

