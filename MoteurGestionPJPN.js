exports.MoteurGestionPJPN = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequeteDonneesEditionInformation_1 = require("ObjetRequeteDonneesEditionInformation");
const MethodesObjet_1 = require("MethodesObjet");
const TypeHttpNotificationDonnes_1 = require("TypeHttpNotificationDonnes");
const ObjetFenetre_PieceJointe_1 = require("ObjetFenetre_PieceJointe");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const AccessApp_1 = require("AccessApp");
class MoteurGestionPJPN {
	ouvrirModaleSelectionPJ(aParam) {
		let lAvecSaisie = false;
		$.extend(aParam, {
			genreRessourceDocJoint:
				Enumere_Ressource_1.EGenreRessource.DocJointEtablissement,
		});
		const lModaleSelect = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_PieceJointe_1.ObjetFenetre_PieceJointe,
			{
				pere: aParam.instance,
				evenement: function (aNumeroBouton, aParamsFenetre) {
					const lListeFichiers = aParamsFenetre.instance.ListeFichiers;
					aParam.listePiecesJointes.parcourir((aDocument) => {
						if (aDocument.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun) {
							lAvecSaisie = true;
						}
						let lDocumentJoint = aParam.listePJContexte.getElementParNumero(
							aDocument.getNumero(),
						);
						const lActif = aDocument.Actif && aDocument.existe();
						if (lDocumentJoint) {
							if (
								aDocument.existe() &&
								aDocument.getEtat() === Enumere_Etat_1.EGenreEtat.Modification
							) {
								lDocumentJoint.setLibelle(aDocument.getLibelle());
							}
							if (!lActif) {
								lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								aParam.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								lAvecSaisie = true;
							}
						} else {
							if (lActif) {
								lDocumentJoint = new ObjetElement_1.ObjetElement(
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
								lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
								aParam.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
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
			avecFiltre: undefined,
			optionsSelecFile: { maxSize: aParam.maxSize },
			modeLien: false,
			surValiderAvantFermer: null,
			validationAuto: null,
		});
	}
	ouvrirFenetreChoixListeCloud(aParam) {
		UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.ouvrirFenetreCloud(
			{ instance: this },
		).then((aListeDocuments) => {
			if (aListeDocuments.count() > 0) {
				aParam.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				aListeDocuments.parcourir((aDocument) => {
					aParam.listePJContexte.addElement(aDocument);
					aParam.listePiecesJointes.addElement(aDocument);
				});
				aParam.validation(null, null, true);
			}
		});
	}
	async ouvrirFenetreChoixFichierCloud(aParam) {
		var _a;
		const lListeDocuments =
			await UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.ouvrirFenetreChoixFichierCloud(
				{
					instance: (_a = aParam.instance) !== null && _a !== void 0 ? _a : {},
					service: aParam.service,
				},
			);
		if (lListeDocuments.count() > 0) {
			aParam.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lListeDocuments.parcourir((aDocument) => {
				aParam.listePJContexte.addElement(aDocument);
				aParam.listePiecesJointes.addElement(aDocument);
			});
			aParam.validation(null, null, true);
		}
	}
	getDonneesEditionInformation() {
		return new ObjetRequeteDonneesEditionInformation_1.ObjetRequeteDonneesEditionInformation(
			this,
		).lancerRequete({ init: true });
	}
	getListePJEtablissement() {
		const lEtatutil = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		return lEtatutil.listeDonnees !== null &&
			lEtatutil.listeDonnees !== undefined
			? MethodesObjet_1.MethodesObjet.dupliquer(
					lEtatutil.listeDonnees[
						TypeHttpNotificationDonnes_1.TypeHttpNotificationDonnes
							.THND_ListeDocJointEtablissement
					],
				)
			: null;
	}
}
exports.MoteurGestionPJPN = MoteurGestionPJPN;
