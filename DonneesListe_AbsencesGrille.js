exports.DonneesListe_AbsencesGrille = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Media_1 = require("Enumere_Media");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeHttpSaisieAbsencesGrille_1 = require("TypeHttpSaisieAbsencesGrille");
const TypeRessourceAbsence_1 = require("TypeRessourceAbsence");
const AccessApp_1 = require("AccessApp");
const GlossaireAbsencesGrille_1 = require("GlossaireAbsencesGrille");
class DonneesListe_AbsencesGrille extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.appSco = (0, AccessApp_1.getApp)();
		this.setOptions({
			estSurDomaine: false,
			saisie: null,
			avecEtatSaisie: false,
			avecMultiSelection: true,
			avecTri: false,
			avecInterruptionSuppression: true,
		});
	}
	avecMenuContextuel(aParams) {
		return !aParams.surFondListe && this.options.estSurDomaine;
	}
	avecSuppression(aParams) {
		if (!this.options.estSurDomaine) {
			return false;
		}
		if (this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)) {
			return false;
		}
		if (
			aParams.article.getGenre() ===
			TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Exclusion
		) {
			return true;
		}
		if (
			aParams.article.getGenre() ===
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_ExclusionInternat ||
			aParams.article.getGenre() ===
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_ExclusionDP
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
		return this._getLibelleDate(aParams.article);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AbsencesGrille.colonnes.date: {
				let lIcon = "";
				switch (aParams.article.getGenre()) {
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence:
						lIcon = fonts_css_1.StylesFonts.icon_absences;
						break;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Retard:
						lIcon = fonts_css_1.StylesFonts.icon_retard;
						break;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_AbsenceRepas:
						lIcon = fonts_css_1.StylesFonts.icon_food;
						break;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Exclusion:
						lIcon = fonts_css_1.StylesFonts.icon_punition_exclusion;
						break;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Infirmerie:
						lIcon = fonts_css_1.StylesFonts.icon_f0fe;
						break;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_AbsenceInternat:
						lIcon = fonts_css_1.StylesFonts.icon_internat;
						break;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_ExclusionInternat:
						lIcon = fonts_css_1.StylesFonts.icon_internat;
						break;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_ExclusionDP:
						lIcon = fonts_css_1.StylesFonts.icon_food;
						break;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Sanction:
						lIcon = fonts_css_1.StylesFonts.icon_legal;
						break;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_ConvocationVS:
						lIcon = fonts_css_1.StylesFonts.icon_convocation;
						break;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Incident:
						lIcon = fonts_css_1.StylesFonts.icon_bolt;
						break;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Punition:
						lIcon = fonts_css_1.StylesFonts.icon_punition;
						break;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_RetardInternat:
						lIcon = `${fonts_css_1.StylesFonts.icon_internat} ${Image_css_1.StylesImage.mixIcon_time} ${Image_css_1.StylesImage.mixIcon_time} i-bottom`;
						break;
				}
				if (!lIcon) {
					return this._getLibelleDate(aParams.article);
				}
				const lTooltip =
					GlossaireAbsencesGrille_1.TradGlossaireAbsencesGrille.tabStrAbsence[
						aParams.article.getGenre()
					];
				return IE.jsx.str(
					"div",
					{
						class: [
							"AlignementGauche NoWrap",
							Divers_css_1.StylesDivers.fullWidth,
						],
					},
					IE.jsx.str("i", {
						class: ["InlineBlock AlignementMilieuVertical", lIcon],
						role: lTooltip ? "img" : "presentation",
						"ie-tooltiplabel": lTooltip || false,
						style: { lineHeight: "1.1rem" },
					}),
					IE.jsx.str(
						"div",
						{
							class:
								"PetitEspaceGauche InlineBlock AlignementMilieuVertical NoWrap",
						},
						this._getLibelleDate(aParams.article),
					),
				);
			}
			case DonneesListe_AbsencesGrille.colonnes.motif: {
				const lDetailMotif = _getDetailsMotifs(aParams.article);
				if (!lDetailMotif.couleur) {
					return lDetailMotif.libelle;
				}
				return IE.jsx.str(
					"div",
					{ class: "full-width flex-contain flex-center " },
					IE.jsx.str(
						"div",
						{
							class: "fluid-bloc p-x ie-line-color static var-height",
							"ie-ellipsis": true,
							style: {
								"--color-line": lDetailMotif.couleur,
								"--var-height": "1.2rem",
							},
						},
						lDetailMotif.libelle,
					),
				);
			}
			case DonneesListe_AbsencesGrille.colonnes.absenceOuverte:
				return aParams.article.absenceOuverte
					? ObjetTraduction_1.GTraductions.getValeur(
							"grilleAbsence.liste.titre.AbsenceOuverte",
						)
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
					? ObjetChaine_1.GChaine.doubleToStr(aParams.article.DJBrutes)
					: "-";
			case DonneesListe_AbsencesGrille.colonnes.DJCalc:
				return aParams.article.DJCalc
					? ObjetChaine_1.GChaine.doubleToStr(aParams.article.DJCalc.toFixed(2))
					: "-";
			case DonneesListe_AbsencesGrille.colonnes.DJBulletin: {
				if (aParams.surEdition) {
					return ObjetChaine_1.GChaine.doubleToStr(
						(aParams.article.DJBulletin || 0).toFixed(2),
					);
				}
				let lAffichageDJBulletin = aParams.article.strDJBulletin;
				if (!lAffichageDJBulletin) {
					lAffichageDJBulletin = aParams.article.DJBulletin
						? ObjetChaine_1.GChaine.doubleToStr(
								aParams.article.DJBulletin.toFixed(2),
							)
						: "-";
				}
				return lAffichageDJBulletin;
			}
			case DonneesListe_AbsencesGrille.colonnes.justifie:
				if (
					aParams.article.getGenre() ===
						TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence ||
					aParams.article.getGenre() ===
						TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Retard
				) {
					return _strOuiNon(aParams.article.justifie);
				}
				return "";
			case DonneesListe_AbsencesGrille.colonnes.horsEtab:
				return aParams.article.getGenre() ===
					TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence
					? _strOuiNon(aParams.article.horsEtab)
					: "";
			case DonneesListe_AbsencesGrille.colonnes.sante:
				return aParams.article.getGenre() ===
					TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence
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
			case DonneesListe_AbsencesGrille.colonnes.suivi: {
				const lHtmlSuivi = [];
				lHtmlSuivi.push('<div class="flex-contain flex-center">');
				if (aParams.article.nbSuivi > 0) {
					lHtmlSuivi.push(
						IE.jsx.str(
							"span",
							{ class: "InlineBlock PetitEspaceDroit" },
							aParams.article.nbSuivi,
						),
					);
				}
				let lNomClasseIcone = "";
				if (aParams.article.dernierSuiviEstJustificationParent) {
					lNomClasseIcone = "icon_parents mix-icon_ok i-green";
				} else if (aParams.article.dernierSuiviEstConvocation) {
					lNomClasseIcone = "icon_convocation mix-icon_vs i-red";
				} else if (aParams.article.genreMedia >= 0) {
					lNomClasseIcone =
						Enumere_Media_1.EGenreMediaUtil.getClassesIconeMedia(
							aParams.article.genreMedia,
							!aParams.article.envoiMedia,
						);
				}
				if (lNomClasseIcone) {
					lHtmlSuivi.push(
						IE.jsx.str("i", {
							class: "MargeGauche " + lNomClasseIcone,
							role: "presentation",
						}),
					);
				}
				if (aParams.article.libelleSuivi) {
					lHtmlSuivi.push(
						IE.jsx.str(
							"span",
							{ class: "InlineBlock PetitEspaceGauche" },
							aParams.article.libelleSuivi,
						),
					);
				}
				lHtmlSuivi.push("</div>");
				return lHtmlSuivi.join("");
			}
			case DonneesListe_AbsencesGrille.colonnes.certificat: {
				if (
					!aParams.article.listeCertificats ||
					aParams.article.listeCertificats.count() === 0
				) {
					return "";
				}
				if (aParams.article.listeCertificats.count() === 1) {
					return ObjetChaine_1.GChaine.composerUrlLienExterne({
						libelleEcran: IE.jsx.str("i", {
							class: fonts_css_1.StylesFonts.icon_piece_jointe,
							"ie-tooltiplabel": this.getTooltip(aParams),
							role: "img",
						}),
						documentJoint: aParams.article.listeCertificats.get(0),
						genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
						afficherIconeDocument: false,
					});
				}
				const lnodeCertificat = (aNode) => {
					$(aNode).eventValidation(() => {
						ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
							pere: this.paramsListe.liste,
							initCommandes: function (aMenu) {
								aParams.article.listeCertificats.parcourir((aCertificat) => {
									aMenu.add(aCertificat.getLibelle(), true, () => {
										_openCertificatDArticle(aCertificat);
									});
								});
							},
						});
					});
				};
				return IE.jsx.str("div", {
					class: "Image_Trombone AvecMain",
					style: "margin-left:auto; margin-right:auto;",
					"ie-node": lnodeCertificat,
				});
			}
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
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AbsencesGrille.colonnes.date: {
				const lTooltip =
					GlossaireAbsencesGrille_1.TradGlossaireAbsencesGrille.tabStrAbsence[
						aParams.article.getGenre()
					];
				return (lTooltip ? lTooltip + " " : "") + aParams.article.getLibelle();
			}
			case DonneesListe_AbsencesGrille.colonnes.motif:
				return aParams.article.listeMotifs
					? aParams.article.listeMotifs.getTableauLibelles().sort().join(",\n")
					: "";
			case DonneesListe_AbsencesGrille.colonnes.absenceOuverte:
				return aParams.article.absenceOuverte
					? ObjetTraduction_1.GTraductions.getValeur(
							"grilleAbsence.liste.hint.AbsenceOuverte",
						)
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
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		if (aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.certificat) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	avecSelecFile(aParams) {
		return (
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.certificat &&
			aParams.article &&
			aParams.article.getGenre() ===
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence &&
			!aParams.article.listeCertificats &&
			!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
		);
	}
	getOptionsSelecFile() {
		return {
			maxSize: this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		};
	}
	evenementSurSelecFile(aParams, aParamsInput) {
		this.options.saisie(
			{
				genreSaisie:
					TypeHttpSaisieAbsencesGrille_1.TypeHttpSaisieAbsencesGrille
						.sag_AjouterCertificat,
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
			return ObjetStyle_1.GStyle.composeCouleurTexte("red");
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
				!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
			);
		}
		if (this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)) {
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
				return (
					lGenre === TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence
				);
			case DonneesListe_AbsencesGrille.colonnes.justifie:
				return (
					lGenre === TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence ||
					lGenre === TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Retard
				);
			case DonneesListe_AbsencesGrille.colonnes.publieWeb:
				if (
					lGenre === TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Infirmerie
				) {
					return !aParams.article.estConfidentiel;
				}
				if (
					lGenre === TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Exclusion &&
					this.appSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.punition.avecPublicationPunitions,
					)
				) {
					return true;
				}
				return false;
			case DonneesListe_AbsencesGrille.colonnes.motif:
				switch (lGenre) {
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Exclusion:
						return true;
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_ExclusionInternat:
					case TypeRessourceAbsence_1.TypeRessourceAbsence.TR_ExclusionDP:
						return false;
				}
				return true;
			case DonneesListe_AbsencesGrille.colonnes.duree:
				return [
					TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Retard,
					TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Infirmerie,
					TypeRessourceAbsence_1.TypeRessourceAbsence.TR_RetardInternat,
				].includes(lGenre);
			case DonneesListe_AbsencesGrille.colonnes.accompagnateur:
			case DonneesListe_AbsencesGrille.colonnes.commentaire:
				return (
					lGenre === TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Infirmerie
				);
			case DonneesListe_AbsencesGrille.colonnes.suivi:
				return (
					lGenre !==
					TypeRessourceAbsence_1.TypeRessourceAbsence.TR_RetardInternat
				);
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
		if (
			aParams.article.getGenre() ===
			TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Infirmerie
		) {
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
		switch (aParams.idColonne) {
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
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.DJBulletin
		);
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_AbsencesGrille.colonnes.duree:
				aParams.article.editDureeModifie =
					V === "" ? 0 : ObjetChaine_1.GChaine.strToDouble(V);
				break;
			case DonneesListe_AbsencesGrille.colonnes.DJBulletin: {
				const lVal = V.replace(",", ".");
				aParams.article.DJBulletin_modifie =
					lVal === "" ? 0 : ObjetChaine_1.GChaine.strToDouble(V);
				break;
			}
			default:
		}
	}
	getCouleurCellule(aParams) {
		if (
			aParams.idColonne === DonneesListe_AbsencesGrille.colonnes.certificat &&
			!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation) &&
			aParams.article.getGenre() ===
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
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
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Edition,
			ObjetTraduction_1.GTraductions.getValeur("liste.modifier"),
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
			this.options.choixAbsence ===
				Enumere_Ressource_1.EGenreRessource.Absence &&
			aParametres.article &&
			aParametres.listeSelection &&
			aParametres.listeSelection.count() === 1
		) {
			const lAvecCertificats =
					aParametres.article.listeCertificats &&
					aParametres.article.listeCertificats.count() > 0,
				lEstConsultation = this.appSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				);
			if (lAvecCertificats) {
				aParametres.menuContextuel.addSousMenu(
					ObjetTraduction_1.GTraductions.getValeur(
						"grilleAbsence.menu.certificat",
					),
					(aSousMenu) => {
						_addSousMenuListe(
							aSousMenu,
							ObjetTraduction_1.GTraductions.getValeur(
								"grilleAbsence.menu.consulter",
							),
							aParametres.article.listeCertificats,
							(aCertificat) => {
								_openCertificatDArticle(aCertificat);
							},
						);
						if (!lEstConsultation && !aParametres.nonEditable) {
							_addSousMenuListe(
								aSousMenu,
								ObjetTraduction_1.GTraductions.getValeur(
									"grilleAbsence.menu.supprimer",
								),
								aParametres.article.listeCertificats,
								(aCertificat) => {
									this.appSco
										.getMessage()
										.afficher({
											type: Enumere_BoiteMessage_1.EGenreBoiteMessage
												.Confirmation,
											message: ObjetChaine_1.GChaine.format(
												ObjetTraduction_1.GTraductions.getValeur(
													"selecteurPJ.msgConfirmPJ",
												),
												[aCertificat.getLibelle()],
											),
										})
										.then((aGenreAction) => {
											if (
												aGenreAction === Enumere_Action_1.EGenreAction.Valider
											) {
												this.options.saisie({
													genreSaisie:
														TypeHttpSaisieAbsencesGrille_1
															.TypeHttpSaisieAbsencesGrille
															.sag_SupprimerCertificat,
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
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
			ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
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
	_getLibelleDate(D) {
		let lLibelle = "";
		if (this.options.estSurDomaine) {
			lLibelle = D.libelleLong;
		}
		return lLibelle || D.getLibelle();
	}
}
exports.DonneesListe_AbsencesGrille = DonneesListe_AbsencesGrille;
(function (DonneesListe_AbsencesGrille) {
	let colonnes;
	(function (colonnes) {
		colonnes["date"] = "date";
		colonnes["duree"] = "duree";
		colonnes["motif"] = "motif";
		colonnes["heuresCours"] = "heuresCours";
		colonnes["absenceOuverte"] = "absenceOuverte";
		colonnes["DJBrutes"] = "DJBrutes";
		colonnes["DJCalc"] = "DJCalc";
		colonnes["DJBulletin"] = "DJBulletin";
		colonnes["justifie"] = "justifie";
		colonnes["horsEtab"] = "horsEtab";
		colonnes["sante"] = "sante";
		colonnes["regle"] = "regle";
		colonnes["matiere"] = "matiere";
		colonnes["accompagnateur"] = "accompagnateur";
		colonnes["commentaire"] = "commentaire";
		colonnes["publieWeb"] = "publieWeb";
		colonnes["suivi"] = "suivi";
		colonnes["certificat"] = "certificat";
	})(
		(colonnes =
			DonneesListe_AbsencesGrille.colonnes ||
			(DonneesListe_AbsencesGrille.colonnes = {})),
	);
})(
	DonneesListe_AbsencesGrille ||
		(exports.DonneesListe_AbsencesGrille = DonneesListe_AbsencesGrille = {}),
);
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
		? ObjetTraduction_1.GTraductions.getValeur("grilleAbsence.liste.Oui")
		: ObjetTraduction_1.GTraductions.getValeur("grilleAbsence.liste.Non");
}
function _openCertificatDArticle(aCertificat) {
	window.open(ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aCertificat));
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
