const { TypeDroits } = require("ObjetDroitsPN.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreMediaUtil } = require("Enumere_Media.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	TypeHttpSaisieAbsencesGrille,
} = require("TypeHttpSaisieAbsencesGrille.js");
const { TypeRessourceAbsence } = require("TypeRessourceAbsence.js");
class DonneesListe_AbsencesGrille extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			estSurDomaine: false,
			saisie: null,
			avecEtatSaisie: false,
			avecMultiSelection: true,
			avecTri: false,
			avecInterruptionSuppression: true,
		});
	}
	getControleur(aInstanceDonneesListe, aInstanceListe) {
		return $.extend(
			true,
			super.getControleur(aInstanceDonneesListe, aInstanceListe),
			{
				nodeCertificat: function (aligne) {
					const lArticle = aInstanceDonneesListe.Donnees.get(aligne);
					if (lArticle && lArticle.listeCertificats) {
						$(this.node).on("click", () => {
							ObjetMenuContextuel.afficher({
								pere: aInstanceListe,
								initCommandes: function (aMenu) {
									lArticle.listeCertificats.parcourir((aCertificat) => {
										aMenu.add(aCertificat.getLibelle(), true, () => {
											_openCertificatDArticle(aCertificat);
										});
									});
								},
							});
						});
					}
				},
			},
		);
	}
	avecMenuContextuel(aParams) {
		return !aParams.surFondListe && this.options.estSurDomaine;
	}
	avecSuppression(aParams) {
		if (!this.options.estSurDomaine) {
			return false;
		}
		if (GApplication.droits.get(TypeDroits.estEnConsultation)) {
			return false;
		}
		if (aParams.article.getGenre() === TypeRessourceAbsence.TR_Exclusion) {
			return true;
		}
		if (
			aParams.article.getGenre() ===
				TypeRessourceAbsence.TR_ExclusionInternat ||
			aParams.article.getGenre() === TypeRessourceAbsence.TR_ExclusionDP
		) {
			return false;
		}
		return true;
	}
	avecEvenementSuppression(aParams) {
		return (
			this.options.estSurDomaine &&
			aParams.listeSuppressions &&
			aParams.listeSuppressions.count() > 0
		);
	}
	getLibelleDraggable(aParams) {
		return _getLibelleDate.call(this, aParams.article);
	}
	getValeur(aParams) {
		let H;
		switch (aParams.idColonne) {
			case DonneesListe_AbsencesGrille.colonnes.date: {
				let lImage = "";
				switch (aParams.article.getGenre()) {
					case TypeRessourceAbsence.TR_Absence:
						lImage = "Image_IconeAbsence";
						break;
					case TypeRessourceAbsence.TR_ExclusionDP:
					case TypeRessourceAbsence.TR_AbsenceRepas:
						lImage = "Image_IconeAbsRepas";
						break;
					case TypeRessourceAbsence.TR_Exclusion:
						lImage = "Image_IconeExclusion";
						break;
					case TypeRessourceAbsence.TR_AbsenceInternat:
					case TypeRessourceAbsence.TR_ExclusionInternat:
						lImage = "Image_IconeAbsInternat";
						break;
					case TypeRessourceAbsence.TR_Retard:
					case TypeRessourceAbsence.TR_Infirmerie:
						break;
				}
				if (!lImage) {
					return _getLibelleDate.call(this, aParams.article);
				}
				H = [];
				H.push(
					'<div class="AlignementGauche NoWrap" style="width: 100%; height: 14px; padding:1px 0;">',
					'<div class="InlineBlock AlignementMilieuVertical ',
					lImage,
					'"></div>',
					'<div class="PetitEspaceGauche InlineBlock AlignementMilieuVertical NoWrap" style="line-height: 14px;">',
					_getLibelleDate.call(this, aParams.article),
					"</div>",
					"</div>",
				);
				return H.join("");
			}
			case DonneesListe_AbsencesGrille.colonnes.motif: {
				const lDetailMotif = _getDetailsMotifs(aParams.article);
				if (!lDetailMotif.couleur) {
					return lDetailMotif.libelle;
				}
				H = [];
				H.push(
					'<div class="full-width display-flex flex-center " style="height: 15px;">',
					'<div class="fluid-bloc p-x ie-line-color static var-height " style="--color-line : ',
					lDetailMotif.couleur,
					';--var-height:1.2rem;" >',
					lDetailMotif.libelle,
					"</div>",
					"</div>",
				);
				return H.join("");
			}
			case DonneesListe_AbsencesGrille.colonnes.absenceOuverte:
				return aParams.article.absenceOuverte
					? GTraductions.getValeur("grilleAbsence.liste.titre.AbsenceOuverte")
					: "";
			case DonneesListe_AbsencesGrille.colonnes.regle:
				return !!aParams.article.RA;
			case DonneesListe_AbsencesGrille.colonnes.matiere:
				return aParams.article.matiere || "";
			case DonneesListe_AbsencesGrille.colonnes.duree:
				if (aParams.surEdition) {
					return aParams.article.editDuree;
				}
				return aParams.article.duree || "";
			case DonneesListe_AbsencesGrille.colonnes.heuresCours:
				return aParams.article.heuresCours || "";
			case DonneesListe_AbsencesGrille.colonnes.DJBrutes:
				return aParams.article.DJBrutes
					? GChaine.doubleToStr(aParams.article.DJBrutes)
					: "-";
			case DonneesListe_AbsencesGrille.colonnes.DJCalc:
				return aParams.article.DJCalc
					? GChaine.doubleToStr(aParams.article.DJCalc.toFixed(2))
					: "-";
			case DonneesListe_AbsencesGrille.colonnes.DJBulletin: {
				if (aParams.surEdition) {
					return GChaine.doubleToStr(
						(aParams.article.DJBulletin || 0).toFixed(2),
					);
				}
				let lAffichageDJBulletin = aParams.article.strDJBulletin;
				if (!lAffichageDJBulletin) {
					lAffichageDJBulletin = aParams.article.DJBulletin
						? GChaine.doubleToStr(aParams.article.DJBulletin.toFixed(2))
						: "-";
				}
				return lAffichageDJBulletin;
			}
			case DonneesListe_AbsencesGrille.colonnes.justifie:
				if (
					aParams.article.getGenre() === TypeRessourceAbsence.TR_Absence ||
					aParams.article.getGenre() === TypeRessourceAbsence.TR_Retard
				) {
					return _strOuiNon(aParams.article.justifie);
				}
				return "";
			case DonneesListe_AbsencesGrille.colonnes.horsEtab:
				return aParams.article.getGenre() === TypeRessourceAbsence.TR_Absence
					? _strOuiNon(aParams.article.horsEtab)
					: "";
			case DonneesListe_AbsencesGrille.colonnes.sante:
				return aParams.article.getGenre() === TypeRessourceAbsence.TR_Absence
					? _strOuiNon(aParams.article.sante)
					: "";
			case DonneesListe_AbsencesGrille.colonnes.accompagnateur:
				return aParams.article.accompagnateur
					? aParams.article.accompagnateur.getLibelle()
					: "";
			case DonneesListe_AbsencesGrille.colonnes.commentaire:
				return aParams.article.commentaire || "";
			case DonneesListe_AbsencesGrille.colonnes.publieWeb:
				return !!aParams.article.publicationWeb;
			case DonneesListe_AbsencesGrille.colonnes.suivi:
				H = [];
				if (aParams.article.nbSuivi > 0) {
					H.push(
						'<div class="AlignementMilieuVertical InlineBlock PetitEspaceDroit">',
						aParams.article.nbSuivi,
						"</div>",
					);
				}
				if (aParams.article.genreMedia >= 0) {
					H.push(
						'<div class="AlignementMilieuVertical InlineBlock ',
						EGenreMediaUtil.getNomImage(
							aParams.article.genreMedia,
							!aParams.article.envoiMedia,
						),
						'" style="height:17px;position:relative; top:0px;"></div>',
					);
				}
				if (aParams.article.libelleSuivi) {
					H.push(
						'<div class="AlignementMilieuVertical InlineBlock PetitEspaceGauche">',
						aParams.article.libelleSuivi,
						"</div>",
					);
				}
				return H.join("");
			case DonneesListe_AbsencesGrille.colonnes.certificat:
				if (
					!aParams.article.listeCertificats ||
					aParams.article.listeCertificats.count() === 0
				) {
					return "";
				}
				if (aParams.article.listeCertificats.count() === 1) {
					return GChaine.composerUrlLienExterne({
						libelleEcran:
							'<div class="Image_Trombone AvecMain" style="margin-left:auto; margin-right:auto;"></div>',
						documentJoint: aParams.article.listeCertificats.get(0),
						genreRessource: EGenreRessource.DocJointEleve,
						afficherIconeDocument: false,
					});
				}
				return (
					'<div class="Image_Trombone AvecMain" style="margin-left:auto; margin-right:auto;"' +
					GHtml.composeAttr("ie-node", "nodeCertificat", aParams.ligne) +
					"></div>"
				);
			default:
		}
		return null;
	}
	avecContenuTronque(aParams) {
		if (aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.matiere) {
			return true;
		}
		if (
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.motif &&
			!_getDetailsMotifs(aParams.article).couleur
		) {
			return true;
		}
		return false;
	}
	getHintForce(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AbsencesGrille.colonnes.date:
				return aParams.article.getLibelle();
			case DonneesListe_AbsencesGrille.colonnes.motif:
				return aParams.article.listeMotifs
					? aParams.article.listeMotifs.getTableauLibelles().sort().join(",\n")
					: "";
			case DonneesListe_AbsencesGrille.colonnes.absenceOuverte:
				return aParams.article.absenceOuverte
					? GTraductions.getValeur("grilleAbsence.liste.hint.AbsenceOuverte")
					: "";
			case DonneesListe_AbsencesGrille.colonnes.regle:
				return aParams.article.RA && aParams.article.hintRA
					? aParams.article.hintRA
					: "";
			case DonneesListe_AbsencesGrille.colonnes.certificat:
				return aParams.article.strCertificats
					? aParams.article.strCertificats
					: aParams.article.listeCertificats &&
							aParams.article.listeCertificats.count() > 0
						? aParams.article.listeCertificats
								.trier()
								.getTableauLibelles()
								.join("\n")
						: "";
		}
		return "";
	}
	avecEvenementSelectionDblClick(aParams) {
		return (
			!this.options.estSurDomaine &&
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.date
		);
	}
	getTypeValeur(aParams) {
		if (
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.regle ||
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.publieWeb
		) {
			return ObjetDonneesListe.ETypeCellule.Coche;
		}
		if (aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.certificat) {
			return ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	avecSelecFile(aParams) {
		return (
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.certificat &&
			aParams.article &&
			aParams.article.getGenre() === TypeRessourceAbsence.TR_Absence &&
			!aParams.article.listeCertificats &&
			!GApplication.droits.get(TypeDroits.estEnConsultation)
		);
	}
	getOptionsSelecFile() {
		return {
			maxSize: GApplication.droits.get(
				TypeDroits.tailleMaxDocJointEtablissement,
			),
		};
	}
	evenementSurSelecFile(aParams, aParamsInput) {
		this.options.saisie(
			{
				genreSaisie: TypeHttpSaisieAbsencesGrille.sag_AjouterCertificat,
				article: aParams.article,
				Libelle: aParamsInput.eltFichier.getLibelle(),
				idFichier: aParamsInput.eltFichier.idFichier,
			},
			null,
			null,
			aParamsInput.listeFichiers,
		);
	}
	getClass(aParams) {
		const lClasses = [];
		if (
			[
				DonneesListe_AbsencesGrille.colonnes.heuresCours,
				DonneesListe_AbsencesGrille.colonnes.DJBrutes,
				DonneesListe_AbsencesGrille.colonnes.DJCalc,
				DonneesListe_AbsencesGrille.colonnes.DJBulletin,
				DonneesListe_AbsencesGrille.colonnes.duree,
			].includes(aParams.idColonne)
		) {
			lClasses.push("AlignementDroit");
		}
		if (
			aParams.idColonne ===
				DonneesListe_AbsencesGrille.colonnes.absenceOuverte ||
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.certificat
		) {
			lClasses.push("AlignementMilieu");
		}
		if (
			!this.options.estSurDomaine &&
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.date
		) {
			lClasses.push("Curseur_DoubleClick");
		}
		return lClasses.join(" ");
	}
	getStyle(aParams) {
		if (
			aParams.idColonne ===
				DonneesListe_AbsencesGrille.colonnes.absenceOuverte &&
			aParams.article.absenceOuverte
		) {
			return GStyle.composeCouleurTexte("red");
		}
		return "";
	}
	getVisible(D) {
		return !this.options.estSurDomaine || D.dansDomaine;
	}
	avecEdition(aParams) {
		if (!this.options.estSurDomaine) {
			return (
				aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.regle &&
				!GApplication.droits.get(TypeDroits.estEnConsultation)
			);
		}
		if (GApplication.droits.get(TypeDroits.estEnConsultation)) {
			return false;
		}
		const lGenre = aParams.article.getGenre();
		switch (aParams.idColonne) {
			case DonneesListe_AbsencesGrille.colonnes.regle:
				return true;
			case DonneesListe_AbsencesGrille.colonnes.absenceOuverte:
			case DonneesListe_AbsencesGrille.colonnes.DJBulletin:
			case DonneesListe_AbsencesGrille.colonnes.horsEtab:
			case DonneesListe_AbsencesGrille.colonnes.sante:
				return lGenre === TypeRessourceAbsence.TR_Absence;
			case DonneesListe_AbsencesGrille.colonnes.justifie:
				return (
					lGenre === TypeRessourceAbsence.TR_Absence ||
					lGenre === TypeRessourceAbsence.TR_Retard
				);
			case DonneesListe_AbsencesGrille.colonnes.publieWeb:
				if (lGenre === TypeRessourceAbsence.TR_Infirmerie) {
					return !aParams.article.estConfidentiel;
				}
				if (
					lGenre === TypeRessourceAbsence.TR_Exclusion &&
					GApplication.droits.get(TypeDroits.punition.avecPublicationPunitions)
				) {
					return true;
				}
				return false;
			case DonneesListe_AbsencesGrille.colonnes.motif:
				switch (lGenre) {
					case TypeRessourceAbsence.TR_Exclusion:
						return true;
					case TypeRessourceAbsence.TR_ExclusionInternat:
					case TypeRessourceAbsence.TR_ExclusionDP:
						return false;
				}
				return true;
			case DonneesListe_AbsencesGrille.colonnes.duree:
				return (
					lGenre === TypeRessourceAbsence.TR_Retard ||
					lGenre === TypeRessourceAbsence.TR_Infirmerie
				);
			case DonneesListe_AbsencesGrille.colonnes.accompagnateur:
			case DonneesListe_AbsencesGrille.colonnes.commentaire:
				return lGenre === TypeRessourceAbsence.TR_Infirmerie;
			case DonneesListe_AbsencesGrille.colonnes.suivi:
				return true;
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		if (!this.options.estSurDomaine) {
			return aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.regle;
		}
		if (!this.avecEdition(aParams)) {
			return false;
		}
		if (
			[
				DonneesListe_AbsencesGrille.colonnes.absenceOuverte,
				DonneesListe_AbsencesGrille.colonnes.regle,
				DonneesListe_AbsencesGrille.colonnes.horsEtab,
				DonneesListe_AbsencesGrille.colonnes.justifie,
				DonneesListe_AbsencesGrille.colonnes.sante,
				DonneesListe_AbsencesGrille.colonnes.publieWeb,
				DonneesListe_AbsencesGrille.colonnes.motif,
				DonneesListe_AbsencesGrille.colonnes.suivi,
			].includes(aParams.idColonne)
		) {
			return true;
		}
		if (aParams.article.getGenre() === TypeRessourceAbsence.TR_Infirmerie) {
			return [
				DonneesListe_AbsencesGrille.colonnes.duree,
				DonneesListe_AbsencesGrille.colonnes.accompagnateur,
				DonneesListe_AbsencesGrille.colonnes.commentaire,
			].includes(aParams.idColonne);
		}
		return false;
	}
	avecEvenementApresEdition(aParams) {
		return (
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.duree ||
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.DJBulletin
		);
	}
	avecEditionApresSelection() {
		return true;
	}
	getControleCaracteresInput(aParams) {
		switch (aParams.colonne) {
			case DonneesListe_AbsencesGrille.colonnes.duree:
				return { mask: "0-9", tailleMax: 2 };
			case DonneesListe_AbsencesGrille.colonnes.DJBulletin:
				return { mask: "0-9,.", tailleMax: 5 };
		}
		return null;
	}
	autoriserChaineVideSurEdition(aParams) {
		return (
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.duree ||
			DonneesListe_AbsencesGrille.colonnes.DJBulletin
		);
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_AbsencesGrille.colonnes.duree:
				aParams.article.editDureeModifie =
					V === "" ? 0 : GChaine.strToDouble(V);
				break;
			case DonneesListe_AbsencesGrille.colonnes.DJBulletin: {
				const lVal = V.replace(",", ".");
				aParams.article.DJBulletin_modifie =
					lVal === "" ? 0 : GChaine.strToDouble(V);
				break;
			}
			default:
		}
	}
	getCouleurCellule(aParams) {
		if (
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.certificat &&
			!GApplication.droits.get(TypeDroits.estEnConsultation) &&
			aParams.article.getGenre() === TypeRessourceAbsence.TR_Absence
		) {
			return ObjetDonneesListe.ECouleurCellule.Blanc;
		}
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (aParametres.surFondListe) {
			return;
		}
		let lAvecCommandeActive = false;
		let lCommande = aParametres.menuContextuel.addCommande(
			EGenreCommandeMenu.Edition,
			GTraductions.getValeur("liste.modifier"),
			!aParametres.nonEditable &&
				(!aParametres.listeSelection ||
					aParametres.listeSelection.count() <= 1) &&
				this.avecEdition(aParametres),
		);
		if (lCommande.actif) {
			lAvecCommandeActive = true;
		}
		if (
			this.options.estSurDomaine &&
			this.options.choixAbsence === EGenreRessource.Absence &&
			aParametres.article &&
			aParametres.listeSelection &&
			aParametres.listeSelection.count() === 1
		) {
			const lAvecCertificats =
					aParametres.article.listeCertificats &&
					aParametres.article.listeCertificats.count() > 0,
				lEstConsultation = GApplication.droits.get(
					TypeDroits.estEnConsultation,
				);
			if (lAvecCertificats) {
				aParametres.menuContextuel.addSousMenu(
					GTraductions.getValeur("grilleAbsence.menu.certificat"),
					(aSousMenu) => {
						_addSousMenuListe(
							aSousMenu,
							GTraductions.getValeur("grilleAbsence.menu.consulter"),
							aParametres.article.listeCertificats,
							(aCertificat) => {
								_openCertificatDArticle(aCertificat);
							},
						);
						if (!lEstConsultation && !aParametres.nonEditable) {
							_addSousMenuListe(
								aSousMenu,
								GTraductions.getValeur("grilleAbsence.menu.supprimer"),
								aParametres.article.listeCertificats,
								(aCertificat) => {
									GApplication.getMessage()
										.afficher({
											type: EGenreBoiteMessage.Confirmation,
											message: GChaine.format(
												GTraductions.getValeur("selecteurPJ.msgConfirmPJ"),
												[aCertificat.getLibelle()],
											),
										})
										.then((aGenreAction) => {
											if (aGenreAction === EGenreAction.Valider) {
												this.options.saisie({
													genreSaisie:
														TypeHttpSaisieAbsencesGrille.sag_SupprimerCertificat,
													article: aParametres.article,
													certificat: aCertificat,
												});
											}
										});
								},
							);
						}
					},
				);
				lAvecCommandeActive = true;
			}
		}
		lCommande = aParametres.menuContextuel.addCommande(
			EGenreCommandeMenu.Suppression,
			GTraductions.getValeur("liste.supprimer"),
			!aParametres.nonEditable &&
				aParametres &&
				aParametres.avecSuppression &&
				this._avecSuppression(aParametres),
		);
		if (lCommande.actif) {
			lAvecCommandeActive = true;
		}
		return lAvecCommandeActive;
	}
}
DonneesListe_AbsencesGrille.colonnes = {
	date: "date",
	duree: "duree",
	motif: "motif",
	heuresCours: "heuresCours",
	absenceOuverte: "absenceOuverte",
	DJBrutes: "DJBrutes",
	DJCalc: "DJCalc",
	DJBulletin: "DJBulletin",
	justifie: "justifie",
	horsEtab: "horsEtab",
	sante: "sante",
	regle: "regle",
	matiere: "matiere",
	accompagnateur: "accompagnateur",
	commentaire: "commentaire",
	publieWeb: "publieWeb",
	suivi: "suivi",
	certificat: "certificat",
};
function _getLibelleDate(D) {
	let lLibelle = "";
	if (this.options.estSurDomaine) {
		lLibelle = D.libelleLong;
	}
	return lLibelle || D.getLibelle();
}
function _getDetailsMotifs(aElement) {
	const lDetail = { libelle: "", couleur: null };
	if (aElement.listeMotifs) {
		lDetail.libelle = aElement.listeMotifs
			.getTableauLibelles()
			.sort()
			.join(", ");
		if (aElement.listeMotifs.count() === 1) {
			lDetail.couleur = aElement.listeMotifs.get(0).couleur;
		}
	}
	return lDetail;
}
function _strOuiNon(aOui) {
	return aOui
		? GTraductions.getValeur("grilleAbsence.liste.Oui")
		: GTraductions.getValeur("grilleAbsence.liste.Non");
}
function _openCertificatDArticle(aCertificat) {
	window.open(GChaine.creerUrlBruteLienExterne(aCertificat));
}
function _addSousMenuListe(aMenu, aLibelle, aListe, aCallback) {
	if (!aListe || !aListe.count || aListe.count() === 0) {
		return false;
	}
	if (aListe.count() === 1) {
		aMenu.add(aLibelle, true, () => {
			aCallback(aListe.get(0));
		});
	} else {
		aMenu.addSousMenu(aLibelle, (aSousMenu) => {
			aListe.parcourir((aElement) => {
				aSousMenu.add(aElement.getLibelle(), true, () => {
					aCallback(aElement);
				});
			});
		});
	}
	return true;
}
module.exports = { DonneesListe_AbsencesGrille };
