exports.UtilitaireBulletinEtReleve_Mobile = void 0;
exports.UtilitaireBulletinEtReleve_Mobile = {
	composePetitBlocDonnees(aIntitule, aContenu, aMultiLignes) {
		const lHtml = [];
		lHtml.push(
			'<div class="petitBlocDonnees">',
			"<div>",
			aIntitule,
			"</div>",
			'<div class="',
			aMultiLignes === true ? "multiLignes" : "",
			'">',
			aContenu || "&nbsp;",
			"</div>",
			"</div>",
		);
		return lHtml.join("");
	},
	composeAppreciation(aParam) {
		let lHtml = [];
		lHtml.push('<div class="notes-data-conteneur">');
		lHtml.push('<div class="libelle">', aParam.intituleDAppreciation, "</div>");
		lHtml.push('<div class="appreciation">');
		if ($.isArray(aParam.contenuDAppreciation)) {
			lHtml = lHtml.concat(aParam.contenuDAppreciation);
		} else {
			lHtml.push(aParam.contenuDAppreciation);
		}
		lHtml.push("</div>");
		lHtml.push("</div>");
		return lHtml.join("");
	},
	composeVieScolaire(aDonneesAbsences) {
		const lHtml = [];
		for (const lAbs in aDonneesAbsences) {
			const lAbsType = lAbs;
			if (aDonneesAbsences[lAbsType] && aDonneesAbsences[lAbsType] !== "") {
				lHtml.push(
					'<div class="vie-scolaire-conteneur">' +
						aDonneesAbsences[lAbsType] +
						"</div>",
				);
			}
		}
		return lHtml.join("");
	},
};
