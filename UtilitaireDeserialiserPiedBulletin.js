exports.UtilitaireDeserialiserPiedBulletin = void 0;
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
class UtilitaireDeserialiserPiedBulletin {
	creerAbsences(aJSON) {
		return {
			strAbsences: !!aJSON.ListeAbsences
				? aJSON.ListeAbsences.strAbsences || ""
				: "",
			strRetards: !!aJSON.ListeAbsences
				? aJSON.ListeAbsences.strRetards || ""
				: "",
			strPunitions: !!aJSON.ListeAbsences
				? aJSON.ListeAbsences.strPunitions || ""
				: "",
			strSanctions: !!aJSON.ListeAbsences
				? aJSON.ListeAbsences.strSanctions || ""
				: "",
		};
	}
	creerPiedDePage(aJSON) {
		const lResult = {};
		if (aJSON && !!aJSON.ListeProjets) {
			lResult.ListeProjets = aJSON.ListeProjets;
		}
		if (aJSON && !!aJSON.Orientation) {
			lResult.Orientation = aJSON.Orientation;
		}
		if (aJSON && !!aJSON.ListeAttestations) {
			lResult.ListeAttestations = aJSON.ListeAttestations;
		}
		if (aJSON && !!aJSON.listeAttestationsEleve) {
			lResult.ListeAttestationsEleve = aJSON.listeAttestationsEleve;
			lResult.eleve = aJSON.eleve;
		}
		if (aJSON && !!aJSON.ObjetListeAppreciations) {
			lResult.ListeAppreciations = {
				general: new ObjetListeElements_1.ObjetListeElements(),
				conseilDeClasse: new ObjetListeElements_1.ObjetListeElements(),
				commentaires: new ObjetListeElements_1.ObjetListeElements(),
				cpe: new ObjetListeElements_1.ObjetListeElements(),
				appreciationAnnuelle: new ObjetListeElements_1.ObjetListeElements(),
				generalAnnuelle: new ObjetListeElements_1.ObjetListeElements(),
				periodes: new ObjetListeElements_1.ObjetListeElements(),
			};
			lResult.avecSaisieAG = aJSON.ObjetListeAppreciations.Editable;
			lResult.periodeCloture = aJSON.ObjetListeAppreciations.Cloture;
			if (!!aJSON.ObjetListeAppreciations.ListeAppreciations) {
				aJSON.ObjetListeAppreciations.ListeAppreciations.parcourir((D) => {
					const lElement = new ObjetElement_1.ObjetElement();
					lElement.Intitule = D.Intitule;
					lElement.Editable = aJSON.ObjetListeAppreciations.Editable;
					lElement.Cloture = aJSON.ObjetListeAppreciations.Cloture;
					lElement.Genre = D.getGenre();
					lElement.ListeAppreciations =
						new ObjetListeElements_1.ObjetListeElements();
					lElement.ListeAppreciations.addElement(D);
					if (lElement.Genre === 0) {
						lResult.ListeAppreciations.general.addElement(lElement);
					} else if (
						lElement.Genre === 1 ||
						lElement.Genre === 2 ||
						lElement.Genre === 3 ||
						lElement.Genre === 8
					) {
						lResult.ListeAppreciations.conseilDeClasse.addElement(lElement);
					} else if (
						lElement.Genre === 4 ||
						lElement.Genre === 5 ||
						lElement.Genre === 6
					) {
						lResult.ListeAppreciations.commentaires.addElement(lElement);
					} else if (lElement.Genre === 7) {
						lResult.ListeAppreciations.cpe.addElement(lElement);
					}
				});
			}
			if (!!aJSON.ObjetListeAppreciations.listePeriodes) {
				aJSON.ObjetListeAppreciations.listePeriodes.parcourir((D) => {
					lResult.ListeAppreciations.periodes.addElement(D);
				});
				lResult.ListeAppreciations.appreciationAnnuelle =
					_formatListeAppreciationAnnuelle(
						aJSON.ObjetListeAppreciations.listePeriodes,
						false,
					);
				lResult.ListeAppreciations.generalAnnuelle =
					_formatListeAppreciationAnnuelle(
						aJSON.ObjetListeAppreciations.listePeriodes,
						true,
					);
			}
		}
		if (aJSON && aJSON.listePiliers) {
			lResult.listePiliers = aJSON.listePiliers;
			lResult.avecValidationAuto = aJSON.avecValidationAuto;
		}
		if (aJSON) {
			lResult.listeMentions = aJSON.listeMentions;
		}
		if (aJSON && !!aJSON.ListeStages) {
			lResult.listeStages = aJSON.ListeStages;
		}
		if (aJSON && !!aJSON.ListeMentionsClasse) {
			lResult.ListeMentionsClasse = aJSON.ListeMentionsClasse;
		}
		if (aJSON && !!aJSON.ParcoursEducatif) {
			lResult.libelleUtilisateur = aJSON.ParcoursEducatif.libelleUtilisateur;
			lResult.listeEvntsParcoursPeda = aJSON.ParcoursEducatif.listeParcours;
			lResult.listeGenreParcours = aJSON.ParcoursEducatif.listeGenreParcours;
		}
		lResult.legende = aJSON.Legende;
		lResult.listeCredits = aJSON.listeCredits;
		lResult.listeEngagements = aJSON.listeEngagements;
		return lResult;
	}
}
exports.UtilitaireDeserialiserPiedBulletin = UtilitaireDeserialiserPiedBulletin;
function _formatListeAppreciationAnnuelle(aListePeriode, aGlobal) {
	const lAppreciations = new ObjetListeElements_1.ObjetListeElements();
	const lGenreAppreciation = [];
	aListePeriode.parcourir((periode) => {
		const lListeAppreciation = aGlobal
			? periode.listeAppreciationsGenerales
			: periode.listeAppreciations;
		if (lListeAppreciation) {
			lListeAppreciation.parcourir((D) => {
				if (lGenreAppreciation.includes(D.getGenre())) {
					const lListeIntitule = lAppreciations.getElementParGenre(
						D.getGenre(),
					).Intitule;
					if (!lListeIntitule.includes(D.Intitule)) {
						lAppreciations
							.getElementParGenre(D.getGenre())
							.Intitule.push(D.Intitule);
					}
				} else {
					lGenreAppreciation.push(D.getGenre());
					const lElement = new ObjetElement_1.ObjetElement();
					lElement.Intitule = [D.Intitule];
					lElement.Editable = D.Editable;
					lElement.Cloture = D.cloture;
					lElement.Genre = D.getGenre();
					lElement.global = aGlobal;
					lAppreciations.addElement(lElement);
				}
			});
		}
	});
	return lAppreciations;
}
