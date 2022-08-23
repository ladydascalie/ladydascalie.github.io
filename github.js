import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
const octokit = new Octokit();

window.onload = async function () {
	// this is the top level element we want to render into.
	var section = document.getElementById("gh-section");
	// this is the template element waiting to be cloned.
	var tmpl = document.getElementById("gh-template");

	const response = await octokit.request('GET /users/{username}', {
		username: 'ladydascalie'
	})

	if (response.status !== 200) {
		section.appendChild(document.createTextNode("Failed to load GitHub data."));
		return
	}


	var profile = tmpl.content.cloneNode(true);
	profile.querySelector(".gh-login").textContent = response.data.login;
	profile.querySelector(".gh-company").textContent = response.data.company;
	profile.querySelector(".gh-profile-url").href = response.data.html_url;
	profile.querySelector(".gh-avatar").src = response.data.avatar_url;
	profile.querySelector(".gh-bio").textContent = response.data.bio;
	profile.querySelector(".gh-public-repos").textContent = "Public repositories: " + response.data.public_repos;

	section.appendChild(profile);
}
