const UtilitaireBulletinEtReleve_Mobile = {};
UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees = function (
	aIntitule,
	aContenu,
	aMultiLignes,
) {
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
};
UtilitaireBulletinEtReleve_Mobile.composeAppreciation = function (aParam) {
	let lHtml = [];
	lHtml.push('<div class="notes-data-conteneur">');
	lHtml.push(
		'<div class="libelle" style="',
		!!aParam.styleBlockIntitule ? aParam.styleBlockIntitule : "",
		'">',
		aParam.intituleDAppreciation,
		"</div>",
	);
	lHtml.push('<div class="appreciation">');
	if ($.isArray(aParam.contenuDAppreciation)) {
		lHtml = lHtml.concat(aParam.contenuDAppreciation);
	} else {
		lHtml.push(aParam.contenuDAppreciation);
	}
	lHtml.push("</div>");
	lHtml.push("</div>");
	return lHtml.join("");
};
UtilitaireBulletinEtReleve_Mobile.composeVieScolaire = function (
	aDonneesAbsences,
) {
	const lHtml = [];
	for (const lAbs in aDonneesAbsences) {
		if (aDonneesAbsences[lAbs] && aDonneesAbsences[lAbs] !== "") {
			lHtml.push(
				'<div class="vie-scolaire-conteneur">' +
					aDonneesAbsences[lAbs] +
					"</div>",
			);
		}
	}
	return lHtml.join("");
};
module.exports = { UtilitaireBulletinEtReleve_Mobile };
