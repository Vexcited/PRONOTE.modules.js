exports.ObjetFenetre_EditionQCM_PN = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_EditionQCM_1 = require("ObjetFenetre_EditionQCM");
const ObjetFenetre_SelectionNiveauProgression_1 = require("ObjetFenetre_SelectionNiveauProgression");
const ObjetCelluleMultiSelectionThemes_1 = require("ObjetCelluleMultiSelectionThemes");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_EditionQCM_PN extends ObjetFenetre_EditionQCM_1.ObjetFenetre_EditionQCM {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		const lEstPourPrimaire = this.etatUtilisateurSco.pourPrimaire();
		Object.assign(this.optionsAffichage, {
			avecSaisieMatiereParFenetre: !lEstPourPrimaire,
			avecSaisieMatiereParCombo: lEstPourPrimaire,
			avecSaisieNiveau: !lEstPourPrimaire,
			avecSaisieEtiquette: true,
		});
		this.estSaisieMatiereObligatoire = lEstPourPrimaire;
		this.avecThemes = lApplicationSco.parametresUtilisateur.get(
			"avecGestionDesThemes",
		);
	}
	surBoutonChoixNiveau() {
		const lThis = this;
		const lFenetreChoixNiveau =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionNiveauProgression_1.ObjetFenetre_SelectionNiveauProgression,
				{
					pere: lThis,
					evenement: (aNumeroBouton, aNumeroSelection) => {
						if (aNumeroBouton === 1) {
							if (aNumeroSelection !== 0) {
								lThis.donnees.QCM.niveau =
									this.etatUtilisateurSco.listeNiveaux.getElementParNumero(
										aNumeroSelection,
									);
							} else {
								lThis.donnees.QCM.niveau = new ObjetElement_1.ObjetElement();
							}
							lThis.donnees.QCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							lThis.verifierCoherencePourValider();
						}
					},
					initialiser: function (aInstanceFenetre) {
						aInstanceFenetre.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.SelectionnerNiveau",
							),
							largeur: 300,
							hauteur: 400,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Fermer"),
							],
						});
					},
				},
			);
		const lInfosListeNiveaux = {
			avecSelectionAucune: true,
			liste: this.etatUtilisateurSco.listeNiveaux,
		};
		lFenetreChoixNiveau.setDonnees(
			lInfosListeNiveaux.liste,
			false,
			lInfosListeNiveaux.avecSelectionAucune,
		);
	}
	addInstanceThemes() {
		if (this.avecThemes) {
			this.identMultiSelectionTheme = this.add(
				ObjetCelluleMultiSelectionThemes_1.ObjetCelluleMultiSelectionThemes,
				this.surEvenementCelluleMultiSelectionThemes,
				this.initialiserCelluleMultiSelectionThemes,
			);
		}
	}
	initialiserCelluleMultiSelectionThemes(aInstance) {
		aInstance.setOptions({ fullWidth: true });
	}
	surEvenementCelluleMultiSelectionThemes(aGenreBouton, aListeSelections) {
		if (aGenreBouton === 1) {
			this.donnees.QCM.ListeThemes = aListeSelections;
			this.donnees.QCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.verifierCoherencePourValider();
		}
	}
}
exports.ObjetFenetre_EditionQCM_PN = ObjetFenetre_EditionQCM_PN;
