const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetRequeteDonneesEditionInformation,
} = require("ObjetRequeteDonneesEditionInformation.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { TypeHttpNotificationDonnes } = require("TypeHttpNotificationDonnes.js");
const ObjetFenetre_PieceJointe = require("ObjetFenetre_PieceJointe.js");
class MoteurGestionPJPN {
	ouvrirModaleSelectionPJ(aParam) {
		let lAvecSaisie = false;
		$.extend(aParam, {
			genreRessourceDocJoint: EGenreRessource.DocJointEtablissement,
		});
		const lModaleSelect = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_PieceJointe,
			{
				pere: aParam.instance,
				evenement: function (aNumeroBouton, aParamsFenetre) {
					const lListeFichiers = aParamsFenetre.instance.ListeFichiers;
					aParam.listePiecesJointes.parcourir((aDocument) => {
						if (aDocument.getEtat() !== EGenreEtat.Aucun) {
							lAvecSaisie = true;
						}
						let lDocumentJoint = aParam.listePJContexte.getElementParNumero(
							aDocument.getNumero(),
						);
						const lActif = aDocument.Actif && aDocument.existe();
						if (lDocumentJoint) {
							if (
								aDocument.existe() &&
								aDocument.getEtat() === EGenreEtat.Modification
							) {
								lDocumentJoint.setLibelle(aDocument.getLibelle());
							}
							if (!lActif) {
								lDocumentJoint.setEtat(EGenreEtat.Suppression);
								aParam.element.setEtat(EGenreEtat.Modification);
								lAvecSaisie = true;
							}
						} else {
							if (lActif) {
								lDocumentJoint = new ObjetElement(
									aDocument.getLibelle(),
									aDocument.getNumero(),
									aDocument.getGenre(),
								);
								if (aDocument.Fichier) {
									lDocumentJoint.idFichier = aDocument.Fichier.idFichier;
									lDocumentJoint.Libelle = aDocument.Fichier.Libelle;
									lDocumentJoint.nomOriginal = aDocument.Fichier.nomOriginal;
									lDocumentJoint.file = aDocument.Fichier.file;
								}
								lDocumentJoint.setEtat(EGenreEtat.Creation);
								aParam.element.setEtat(EGenreEtat.Modification);
								aParam.listePJContexte.addElement(lDocumentJoint);
								lAvecSaisie = true;
							}
						}
					});
					aParam.listePiecesJointes.trier();
					aParam.validation(aParamsFenetre, lListeFichiers, lAvecSaisie);
				},
				initialiser: function (aInstance) {
					aInstance.setEtatSaisie = function (aEtatSaisie) {
						if (aEtatSaisie) {
							lAvecSaisie = true;
						}
					};
					aInstance.setGenre(aParam.genre);
					aInstance.setOptionsFenetre({
						avecBoutonActualiser: false,
						avecComposeBasInFooter: true,
					});
				},
			},
		);
		lModaleSelect.afficherFenetrePJ({
			listePJTot: aParam.listePiecesJointes,
			listePJContexte: aParam.listePJContexte,
			genrePJ: aParam.genre,
			genreRessourcePJ: aParam.genreRessourceDocJoint,
			avecFiltre: false,
			optionsSelecFile: { maxSize: aParam.maxSize },
			modeLien: false,
			surValiderAvantFermer: null,
			validationAuto: null,
		});
	}
	getDonneesEditionInformation() {
		return new ObjetRequeteDonneesEditionInformation(this).lancerRequete({
			init: true,
		});
	}
	getListePJEtablissement() {
		return GEtatUtilisateur.listeDonnees !== null &&
			GEtatUtilisateur.listeDonnees !== undefined
			? MethodesObjet.dupliquer(
					GEtatUtilisateur.listeDonnees[
						TypeHttpNotificationDonnes.THND_ListeDocJointEtablissement
					],
				)
			: null;
	}
}
module.exports = { MoteurGestionPJPN };
