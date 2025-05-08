const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const {
	EModeValidation,
	ETypeValidation,
	EEtape,
} = require("Enumere_Inscriptions.js");
function UtilitaireInscriptions() {}
function _verifierDateSession(aElement) {
	const lDateCourante = GDate.getDateCourante(true);
	if (GDate.estDateJourAvant(lDateCourante, aElement.dateDebut)) {
		return -1;
	} else if (GDate.estDateJourAvant(aElement.dateFin, lDateCourante)) {
		return -2;
	}
	return 1;
}
UtilitaireInscriptions.getMessageSessionValide = function (
	aElement,
	aTesterLimite,
) {
	let lMessage = "";
	let lEstValide = true;
	const lDateValide = _verifierDateSession(aElement);
	if (lDateValide < 0) {
		lEstValide = false;
		lMessage =
			lDateValide === -1
				? GTraductions.getValeur(
						"inscriptionsEtablissement.inscriptionPossible",
						GDate.formatDate(aElement.dateDebut, "%JJ/%MM/%AAAA"),
					)
				: GTraductions.getValeur(
						"inscriptionsEtablissement.inscriptionTerminee",
						GDate.formatDate(aElement.dateFin, "%JJ/%MM/%AAAA"),
					);
	} else if (aTesterLimite && !!aElement.limiteAtteinte) {
		lEstValide = false;
		lMessage = GTraductions.getValeur(
			"inscriptionsEtablissement.limiteAtteinte",
		);
	} else {
		lMessage = GTraductions.getValeur(
			"inscriptionsEtablissement.inscriptionDisponible",
			GDate.formatDate(aElement.dateFin, "%JJ/%MM/%AAAA"),
		);
	}
	return { estValide: lEstValide, message: lMessage };
};
UtilitaireInscriptions.getHtmlSousTitre = function (aElement, aTesterLimite) {
	const lHtml = [];
	const lMessageSession = UtilitaireInscriptions.getMessageSessionValide(
		aElement,
		aTesterLimite,
	);
	lHtml.push(
		'<span class="PetitEspaceHaut ',
		lMessageSession.estValide ? "TexteVert" : "TexteRougeClair",
		'">',
		lMessageSession.message,
		"</span>",
	);
	return lHtml.join("");
};
UtilitaireInscriptions.getListeEtape = function (
	aDonnees,
	aEnCreation = false,
) {
	const lListeEtape = new ObjetListeElements();
	let lIndice = 0;
	lListeEtape.add(
		new ObjetElement(
			GTraductions.getValeur("inscriptionsEtablissement.consigne"),
			lIndice++,
			EEtape.consigne,
			0,
			aEnCreation,
		),
	);
	let lPosition = 1;
	lListeEtape.add(
		new ObjetElement(
			GTraductions.getValeur("inscriptionsEtablissement.identiteEnfant"),
			lIndice++,
			EEtape.identite,
			lPosition++,
			aEnCreation,
		),
	);
	lListeEtape.add(
		new ObjetElement(
			GTraductions.getValeur("inscriptionsEtablissement.scolarite"),
			lIndice++,
			EEtape.scolarite,
			lPosition++,
			false,
		),
	);
	lListeEtape.add(
		new ObjetElement(
			GTraductions.getValeur("inscriptionsEtablissement.responsables"),
			lIndice++,
			EEtape.responsables,
			lPosition++,
			false,
		),
	);
	if (
		[EGenreEspace.Parent, EGenreEspace.Mobile_Parent].includes(
			GEtatUtilisateur.GenreEspace,
		)
	) {
		lListeEtape.add(
			new ObjetElement(
				GTraductions.getValeur("inscriptionsEtablissement.fratrieTitre"),
				lIndice++,
				EEtape.fratrie,
				lPosition++,
				false,
			),
		);
	}
	if (
		aDonnees.session &&
		aDonnees.session.avecCommentaire &&
		aDonnees.session.libelleCommentaire
	) {
		lListeEtape.add(
			new ObjetElement(
				aDonnees.session.libelleCommentaire,
				lIndice++,
				EEtape.champsLibre,
				lPosition++,
				false,
			),
		);
	}
	if (
		aDonnees.session &&
		aDonnees.session.listeDocumentsAFournir &&
		aDonnees.session.listeDocumentsAFournir.count() > 0
	) {
		lListeEtape.add(
			new ObjetElement(
				GTraductions.getValeur("inscriptionsEtablissement.documentAJoindre"),
				lIndice++,
				EEtape.documents,
				lPosition++,
				false,
			),
		);
	}
	lListeEtape.getDernierElement().estDerniereEtape = true;
	return lListeEtape;
};
UtilitaireInscriptions.getMethodeValidation = function (aType) {
	switch (aType) {
		case EModeValidation.MV_LettresUniquement:
			return {
				type: ETypeValidation.TV_Regex,
				regex: /^[a-zA-Z'àáâãäåçèéêëìíîïðòóôõöùúûüýÿ -]+$/,
			};
		case EModeValidation.MV_ChiffreUniquement:
			return { type: ETypeValidation.TV_Regex, regex: /^[0-9]+$/ };
		case EModeValidation.MV_Telephone:
			return {
				type: ETypeValidation.TV_Regex,
				regex: /^(0?[1-9])(?:[ _.-]?(\d{2})){4,5}$/,
			};
		case EModeValidation.MV_AlphaNumerique:
			return { type: ETypeValidation.TV_Regex, regex: /^[0-9a-zA-Z ]+$/ };
		case EModeValidation.MV_CodePostal:
			return {
				type: ETypeValidation.TV_Regex,
				regex: /^(([0-8][0-9])|(9[0-5]))[0-9]{3}$/,
			};
		case EModeValidation.MV_Date:
			return { type: ETypeValidation.TV_Date };
		case EModeValidation.MV_All:
			return { type: ETypeValidation.TV_Aucun };
		default:
			return "";
	}
};
UtilitaireInscriptions.getMessageErreur = function (aType) {
	switch (aType) {
		case EModeValidation.MV_LettresUniquement:
			return GTraductions.getValeur("inscriptionsEtablissement.lettres");
		case EModeValidation.MV_ChiffreUniquement:
			return GTraductions.getValeur("inscriptionsEtablissement.chiffres");
		case EModeValidation.MV_Telephone:
			return GTraductions.getValeur(
				"inscriptionsEtablissement.telephoneNonValide",
			);
		case EModeValidation.MV_AlphaNumerique:
			return GTraductions.getValeur("inscriptionsEtablissement.alphanumerique");
		case EModeValidation.MV_CodePostal:
			return GTraductions.getValeur("inscriptionsEtablissement.CPNonValide");
		case EModeValidation.MV_Date:
			return GTraductions.getValeur("inscriptionsEtablissement.dateNonValide");
		case EModeValidation.MV_Obligatoire:
			return GTraductions.getValeur(
				"inscriptionsEtablissement.champsObligatoires",
			);
		case EModeValidation.MV_PresenceValeurCombo:
			return "nope";
	}
};
module.exports = { UtilitaireInscriptions };
