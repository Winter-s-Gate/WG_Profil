function getUuidFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("uuid");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function fillProfile(profile) {
  const house = (profile["greek house"] || profile.greek || "none").toLowerCase();
  const imageUrl = profile.image || "";
  const validImage = imageUrl.startsWith("http");

  document.body.classList.add(house);
  document.getElementById("rpName").textContent = profile.name || "";
  document.getElementById("rpGender").textContent = profile.gender || "";
  document.getElementById("rpDob").textContent = formatDate(profile.dob || "");
  document.getElementById("rpHeight").textContent = profile.height || "";
  document.getElementById("rpWeight").textContent = profile.weight || "";
  document.getElementById("rpRole").textContent = profile.role || "";
  document.getElementById("rpMajor").textContent = profile.major || "";
  document.getElementById("rpGreek").textContent = profile["greek house"] || profile.greek || "";
  document.getElementById("rpActivities").textContent = profile.activities || "";
  document.getElementById("rpAddress").textContent = profile.address || "";
  document.getElementById("rpJob").textContent = profile.job || "";
  document.getElementById("rpStoryline").textContent = profile.storyline || "";

  const img = document.getElementById("rpImage");
  if (validImage) {
    img.src = imageUrl;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  document.getElementById("editBtn").onclick = () => {
    window.location.href = "form.html?uuid=" + profile.uuid;
  };
}

function showPage(pageId) {
  const pages = ["intro", "rpDisplay"];
  pages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === pageId) ? "block" : "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const uuid = getUuidFromUrl();
  if (!uuid) {
    showPage("intro");
    return;
  }

  fetch("https://wgprofil.wintersgatesl.workers.dev/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uuid, action: "get" })
  })
  .then(res => res.json())
  .then(profile => {
    console.log("Profil reçu :", profile);

    if (profile.error) {
      console.warn("Erreur côté serveur :", profile.error);
      showPage("intro");
      return;
    }

    if (profile && profile.uuid && typeof profile.name === "string" && profile.name.trim().length > 0) {
      fillProfile(profile);
      showPage("rpDisplay");
    } else {
        console.warn("Profil incomplet ou invalide, redirection vers formulaire.");
        window.location.href = "form.html?uuid=" + uuid;
    }
  })
  .catch(err => {
    console.error("Erreur chargement profil :", err);
    showPage("intro");
  });
});

function enterRP() {
  const uuid = getUuidFromUrl();
  if (!uuid) {
    alert("UUID manquant. Impossible d’entrer.");
    return;
  }

  window.location.href = "index.html?uuid=" + uuid;
}
