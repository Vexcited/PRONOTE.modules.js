exports.UtilitaireInscriptions = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Inscriptions_1 = require("Enumere_Inscriptions");
const UtilitaireInscriptions = {
	getMessageSessionValide(aElement, aTesterLimite) {
		let lMessage = "";
		let lEstValide = true;
		const lDateValide = _verifierDateSession(aElement);
		if (lDateValide < 0) {
			lEstValide = false;
			lMessage =
				lDateValide === -1
					? ObjetTraduction_1.GTraductions.getValeur(
							"inscriptionsEtablissement.inscriptionPossible",
							ObjetDate_1.GDate.formatDate(aElement.dateDebut, "%JJ/%MM/%AAAA"),
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"inscriptionsEtablissement.inscriptionTerminee",
							ObjetDate_1.GDate.formatDate(aElement.dateFin, "%JJ/%MM/%AAAA"),
						);
		} else if (aTesterLimite && !!aElement.limiteAtteinte) {
			lEstValide = false;
			lMessage = ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.limiteAtteinte",
			);
		} else {
			lMessage = ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.inscriptionDisponible",
				ObjetDate_1.GDate.formatDate(aElement.dateFin, "%JJ/%MM/%AAAA"),
			);
		}
		return { estValide: lEstValide, message: lMessage };
	},
	getListeEtapes(aSessionInscription, aEnCreation = false) {
		const lListeEtape = new ObjetListeElements_1.ObjetListeElements();
		let lIndice = 0;
		lListeEtape.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.consigne",
				),
				lIndice++,
				Enumere_Inscriptions_1.EEtape.consigne,
				0,
				aEnCreation,
			),
		);
		let lPosition = 1;
		lListeEtape.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.identiteEnfant",
				),
				lIndice++,
				Enumere_Inscriptions_1.EEtape.identite,
				lPosition++,
				aEnCreation,
			),
		);
		lListeEtape.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.scolarite",
				),
				lIndice++,
				Enumere_Inscriptions_1.EEtape.scolarite,
				lPosition++,
				false,
			),
		);
		lListeEtape.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.responsables",
				),
				lIndice++,
				Enumere_Inscriptions_1.EEtape.responsables,
				lPosition++,
				false,
			),
		);
		if (
			[
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			lListeEtape.add(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.fratrieTitre",
					),
					lIndice++,
					Enumere_Inscriptions_1.EEtape.fratrie,
					lPosition++,
					false,
				),
			);
		}
		if (aSessionInscription) {
			if (
				aSessionInscription.avecCommentaire &&
				aSessionInscription.libelleCommentaire
			) {
				lListeEtape.add(
					new ObjetElement_1.ObjetElement(
						aSessionInscription.libelleCommentaire,
						lIndice++,
						Enumere_Inscriptions_1.EEtape.champsLibre,
						lPosition++,
						false,
					),
				);
			}
			if (
				aSessionInscription.listeDocumentsAFournir &&
				aSessionInscription.listeDocumentsAFournir.count() > 0
			) {
				lListeEtape.add(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"inscriptionsEtablissement.documentAJoindre",
						),
						lIndice++,
						Enumere_Inscriptions_1.EEtape.documents,
						lPosition++,
						false,
					),
				);
			}
		}
		lListeEtape.getDernierElement().estDerniereEtape = true;
		return lListeEtape;
	},
	getMethodeValidation(aType) {
		switch (aType) {
			case Enumere_Inscriptions_1.EModeValidation.MV_LettresUniquement:
				return {
					type: Enumere_Inscriptions_1.ETypeValidation.TV_Regex,
					regex: /^[a-zA-Z'àáâãäåçèéêëìíîïðòóôõöùúûüýÿ -]+$/,
				};
			case Enumere_Inscriptions_1.EModeValidation.MV_ChiffreUniquement:
				return {
					type: Enumere_Inscriptions_1.ETypeValidation.TV_Regex,
					regex: /^[0-9]+$/,
				};
			case Enumere_Inscriptions_1.EModeValidation.MV_Telephone:
				return {
					type: Enumere_Inscriptions_1.ETypeValidation.TV_Regex,
					regex: /^(0?[1-9])(?:[ _.-]?(\d{2})){4,5}$/,
				};
			case Enumere_Inscriptions_1.EModeValidation.MV_AlphaNumerique:
				return {
					type: Enumere_Inscriptions_1.ETypeValidation.TV_Regex,
					regex: /^[0-9a-zA-Z ]+$/,
				};
			case Enumere_Inscriptions_1.EModeValidation.MV_CodePostal:
				return {
					type: Enumere_Inscriptions_1.ETypeValidation.TV_Regex,
					regex: /^(([0-8][0-9])|(9[0-5]))[0-9]{3}$/,
				};
			case Enumere_Inscriptions_1.EModeValidation.MV_Date:
				return { type: Enumere_Inscriptions_1.ETypeValidation.TV_Date };
			case Enumere_Inscriptions_1.EModeValidation.MV_All:
				return { type: Enumere_Inscriptions_1.ETypeValidation.TV_Aucun };
		}
		return { type: Enumere_Inscriptions_1.ETypeValidation.TV_Aucun };
	},
	getMessageErreur(aType) {
		switch (aType) {
			case Enumere_Inscriptions_1.EModeValidation.MV_LettresUniquement:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.lettres",
				);
			case Enumere_Inscriptions_1.EModeValidation.MV_ChiffreUniquement:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.chiffres",
				);
			case Enumere_Inscriptions_1.EModeValidation.MV_Telephone:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.telephoneNonValide",
				);
			case Enumere_Inscriptions_1.EModeValidation.MV_AlphaNumerique:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.alphanumerique",
				);
			case Enumere_Inscriptions_1.EModeValidation.MV_CodePostal:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.CPNonValide",
				);
			case Enumere_Inscriptions_1.EModeValidation.MV_Date:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.dateNonValide",
				);
			case Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.champsObligatoires",
				);
		}
		return "";
	},
};
exports.UtilitaireInscriptions = UtilitaireInscriptions;
function _verifierDateSession(aElement) {
	const lDateCourante = ObjetDate_1.GDate.getDateCourante(true);
	if (ObjetDate_1.GDate.estDateJourAvant(lDateCourante, aElement.dateDebut)) {
		return -1;
	} else if (
		ObjetDate_1.GDate.estDateJourAvant(aElement.dateFin, lDateCourante)
	) {
		return -2;
	}
	return 1;
}
