document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("rpForm");
    const display = document.getElementById("rpDisplay");
    const formContainer = document.getElementById("formContainer");

    // Gestion du menu Greek House
    const greekOptions = document.getElementById("greekOptions");
    const greekSelected = document.getElementById("greekSelected");
    const greekInput = document.getElementById("greek");

    greekOptions.addEventListener("click", e => {
        const li = e.target.closest("li");
        if (!li) return;
        greekSelected.innerHTML = li.innerHTML;
        greekInput.value = li.dataset.value;
    });

    // Chargement initial : profil ou formulaire
    const uuid = localStorage.getItem("rp_uuid");
    if (uuid) {
        fetch("https://wgprofil.wintersgatesl.workers.dev/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uuid })
        })
        .then(res => res.json())
        .then(profile => {
            displayProfile(profile);
            showUpdateButton();
        })
        .catch(err => {
            console.error("Erreur chargement profil :", err);
            formContainer.style.display = "block";
        });
    } else {
        formContainer.style.display = "block";
    }

    // Soumission du formulaire
    form.addEventListener("submit", async e => {
        e.preventDefault();

        const newUuid = crypto.randomUUID();
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

            if (!response.ok) throw new Error("Erreur réseau");

            const profile = await response.json();
            localStorage.setItem("rp_uuid", newUuid);
            formContainer.style.display = "none";
            displayProfile(profile);
            showUpdateButton();

        } catch (err) {
            console.error("Erreur enregistrement :", err);
            alert("Échec de l’enregistrement du profil.");
        }
    });
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

    container.className = "rpCard " + house;
    container.style.display = "block";

    container.innerHTML = `
        <h2>${profile.name}</h2>
        <img src="${profile.image}" alt="Portrait RP">
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
    btn.onclick = () => {
        document.getElementById("formContainer").style.display = "block";
        document.getElementById("rpDisplay").style.display = "none";
    };
    document.getElementById("rpDisplay").appendChild(btn);
}
