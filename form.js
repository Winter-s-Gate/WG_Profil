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
