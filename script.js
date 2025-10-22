function getUuidFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("uuid");
}

function showPage(pageId) {
    const pages = ["formContainer", "rpDisplay"];
    pages.forEach(id => {
        const el = document.getElementById(id);
        el.style.display = (id === pageId) ? "block" : "none";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("rpForm");
    const formContainer = document.getElementById("formContainer");
    const display = document.getElementById("rpDisplay");
    let profileLoaded = false;

    // Gestion du menu Greek House
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

    // Chargement initial : profil ou formulaire
    const uuid = getUuidFromUrl();
    if (!uuid) {
        showPage("formContainer");
        return;
    }

    fetch("https://wgprofil.wintersgatesl.workers.dev/?uuid=" + uuid)
    .then(res => res.text())
    .then(text => {
        try {
            const profile = JSON.parse(text);
            console.log("Profil reçu :", profile);
            if (profile && profile.uuid && profile.name && profile.name.trim() !== "") {
                profileLoaded = true;
                displayProfile(profile);
                showUpdateButton();
                showPage("rpDisplay");
            } else {
                showPage("formContainer");
            }
        } catch (err) {
            console.error("Réponse non JSON :", text);
            showPage("formContainer");
        }
    })
    .catch(err => {
        console.error("Erreur chargement profil :", err);
        showPage("formContainer");
    });

    // Soumission du formulaire
    form.addEventListener("submit", async e => {
        e.preventDefault();

        if (profileLoaded) {
            alert("Profil déjà existant. Utilise ✏️ pour modifier.");
            return;
        }

        const newUuid = getUuidFromUrl();
        const payload = {
            uuid: newUuid,
            name: document.getElementById("name").value,
            gender: document.getElementById("gender").value,
            dob: document.getElementById("dob").value,
            height: document.getElementById("height").value,
            weight: document.getElementById("weight").value,
            role: getCheckedValues("roleGroup"),
            major: document.getElementById("major").value,
            activities: getCheckedValues("activitiesGroup"),
            greek: document.getElementById("greek").value,
            address: document.getElementById("address").value,
            job: document.getElementById("job").value,
            storyline: document.getElementById("storyline").value,
            image: document.getElementById("image").value
        };

        try {
            const response = await fetch("https://wgprofil.wintersgatesl.workers.dev/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const text = await response.text();
            const profile = JSON.parse(text);

            displayProfile(profile);
            showUpdateButton();
            showPage("rpDisplay");
        } catch (err) {
            console.error("Erreur enregistrement :", err);
            alert("Échec de l’enregistrement du profil.");
        }
    });

    // Bouton d’entrée RP (sécurisé)
    const enterBtn = document.getElementById("enterBtn");
    if (enterBtn) {
        enterBtn.onclick = () => {
            const uuid = getUuidFromUrl();
            if (!uuid) {
                alert("UUID manquant. Impossible d’entrer.");
                return;
            }
            window.location.href = "index.html?uuid=" + uuid;
        };
    }
});

// Fonction utilitaire pour cases à cocher
function getCheckedValues(groupId) {
    const checkboxes = document.querySelectorAll(`#${groupId} input[type="checkbox"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value).join(", ");
}

// Affichage du profil RP
function displayProfile(profile) {
    const container = document.getElementById("rpDisplay");
    const house = (profile["greek house"] || profile.greek || "none").toLowerCase();
    const imageUrl = profile.image || "";
    const validImage = imageUrl.startsWith("http");

    container.className = "rpCard " + house;
    container.innerHTML = `
        <h2>${profile.name}</h2>
        ${validImage ? `<img src="${imageUrl}" alt="Portrait RP" style="max-width:75px;height:auto;">` : `<div class="brokenImage">Image manquante</div>`}
        <div class="rpInfo">
            <label>💳​ Identity:</label>
            <p><strong>Gender:</strong> ${profile.gender}</p>
            <p><strong>DoB:</strong> ${profile.dob}</p>
            <p><strong>Height:</strong> ${profile.height}</p>
            <p><strong>Weight:</strong> ${profile.weight}</p>
            <p><strong>Role:</strong> ${profile.role}</p>
            <p><strong>Major:</strong> ${profile.major}</p>
            <label>🏛️ Greek House:</label>
            <p><strong>Maison Greek:</strong> ${profile["greek house"] || profile.greek}</p>
            <label>🎨 Activities:</label>
            <p><strong>Activities:</strong> ${profile.activities}</p>
            <p><strong>Address:</strong> ${profile.address}</p>
            <p><strong>Job:</strong> ${profile.job}</p>
        </div>
        <div class="rpStory">
            <h3>📔 Backstory</h3>
            <p>${profile.storyline}</p>
        </div>
    `;
}

// Bouton pour modifier le profil
function showUpdateButton() {
    const btn = document.createElement("button");
    btn.textContent = "✏️ Edit";
    btn.onclick = () => showPage("formContainer");
    document.getElementById("rpDisplay").appendChild(btn);
}
