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

function showPage(pageId) {
	const pages = ["formContainer", "rpDisplay"];
	pages.forEach(id => {
		const el = document.getElementById(id);
		if (el) el.style.display = (id === pageId) ? "block" : "none";
	});
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

document.addEventListener("DOMContentLoaded", () => {
	const uuid = getUuidFromUrl();
	if (!uuid) {
		window.location.href = "form.html";
		return;
	}

  // Masquer l’intro si UUID présent
	const intro = document.getElementById("intro");
	if (intro) intro.style.display = "none";

	fetch("https://wgprofil.wintersgatesl.workers.dev/", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ uuid, action: "get" })
	})
	.then(res => res.json())
	.then(profile => {
		console.log("Profil reçu :", profile); // ← ajoute ça
		if (profile && profile.uuid && typeof profile.name === "string" && profile.name.trim().length > 0) {
			fillProfile(profile);
			showPage("rpDisplay");
		} else {
			window.location.href = "form.html?uuid=" + uuid;
		}
	})

	.catch(() => {
		window.location.href = "form.html?uuid=" + uuid;
	});
});

