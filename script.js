document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("rpForm");
    const display = document.createElement("div");
    display.id = "rpDisplay";
    document.body.appendChild(display);

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const uuid = new URLSearchParams(window.location.search).get("uuid");
        if (!uuid) {
            alert("UUID manquant dans l’URL.");
            return;
        }

        const payload = {
            uuid,
            name: document.getElementById("name").value,
            gender: document.getElementById("gender").value,
            dob: document.getElementById("dob").value,
            height: document.getElementById("height").value,
            weight: document.getElementById("weight").value,
            major: document.getElementById("major").value,
            address: document.getElementById("address").value,
            job: document.getElementById("job").value,
            greek: document.getElementById("greek").value,
			role: getCheckedValues("roleGroup"),
			activities: getCheckedValues("activitiesGroup"),
            storyline: document.getElementById("storyline").value,
            image: document.getElementById("image").value
        };

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbwWLWpo4Gu6jxgsCdLu5FeqDDub5eBaKN-bWNxI-R0V6cwTYQO5dYz5jvWVTdT_jZvX/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Erreur réseau");

            const profile = await response.json();
            displayProfile(profile);

        } catch (err) {
            console.error("❌ Échec :", err);
            alert("Erreur lors de l’enregistrement du profil.");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const greekOptions = document.getElementById("greekOptions");
    const greekSelected = document.getElementById("greekSelected");
    const greekInput = document.getElementById("greek");

    greekOptions.addEventListener("click", e => {
        const li = e.target.closest("li");
        if (!li) return;

        const value = li.dataset.value;
        const label = li.innerHTML;

        greekSelected.innerHTML = label;
        greekInput.value = value;
    });
});

function getCheckedValues(groupId) {
  const checkboxes = document.querySelectorAll(`#${groupId} input[type="checkbox"]:checked`);
  return Array.from(checkboxes).map(cb => cb.value).join(", ");
}

function displayProfile(profile) {
    const container = document.getElementById("rpDisplay");
    const house = (profile["greek house"] || profile.greek || "none").toLowerCase();

    container.className = "rpCard " + house; // applique la classe maison

    container.innerHTML = `
        <h2>${profile.name}</h2>
        <img src="${profile.image}" alt="Portrait RP">
        <p><strong>Genre:</strong> ${profile.gender}</p>
        <p><strong>Date de naissance:</strong> ${profile.dob}</p>
        <p><strong>Taille:</strong> ${profile.height}</p>
        <p><strong>Poids:</strong> ${profile.weight}</p>
        <p><strong>Rôle:</strong> ${profile.role}</p>
        <p><strong>Domaine:</strong> ${profile.major}</p>
        <p><strong>Activités:</strong> ${profile.activities}</p>
        <p><strong>Maison Greek:</strong> ${profile["greek house"] || profile.greek}</p>
        <p><strong>Adresse:</strong> ${profile.address}</p>
        <p><strong>Métier:</strong> ${profile.job}</p>
        <p><strong>Histoire RP:</strong></p>
        <p>${profile.storyline}</p>
    `;
}

