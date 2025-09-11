exports.UtilitaireTAFEleves = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const TypeEtatExecutionQCMPourRepondant_1 = require("TypeEtatExecutionQCMPourRepondant");
const ObjetChaine_1 = require("ObjetChaine");
const TypeNiveauDifficulte_1 = require("TypeNiveauDifficulte");
const TypeGenreTravailAFaire_1 = require("TypeGenreTravailAFaire");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const GUID_1 = require("GUID");
const TypeGenreTravailAFaire_2 = require("TypeGenreTravailAFaire");
const ObjetUtilitaireCahierDeTexte_1 = require("ObjetUtilitaireCahierDeTexte");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetGalerieCarrousel_1 = require("ObjetGalerieCarrousel");
const ObjetElement_1 = require("ObjetElement");
const TypeGenreMiniature_1 = require("TypeGenreMiniature");
class UtilitaireTAFEleves {
	constructor() {
		this.peutFaireTAF = [
			Enumere_Espace_1.EGenreEspace.Eleve,
			Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
			Enumere_Espace_1.EGenreEspace.PrimEleve,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
			Enumere_Espace_1.EGenreEspace.PrimParent,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
		].includes(GEtatUtilisateur.GenreEspace);
		this.peutFaireActivite = [
			Enumere_Espace_1.EGenreEspace.Eleve,
			Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
			Enumere_Espace_1.EGenreEspace.PrimEleve,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
		].includes(GEtatUtilisateur.GenreEspace);
		this.utilitaireCDT =
			new ObjetUtilitaireCahierDeTexte_1.ObjetUtilitaireCahierDeTexte();
	}
	composePageTravailAFaire(
		aListeTravailAFaire,
		aUtilititaire,
		aControleur,
		aAvecFiltrage,
	) {
		const lHtml = [];
		let lDateCourante = null;
		let lDateDonneLeCourante = null;
		let lEstPremierTafDeLaDate = false;
		lHtml.push('<ul class="liste-date">');
		for (let I = 0; I < aListeTravailAFaire.count(); I++) {
			const lTravailAFaire = aListeTravailAFaire.get(I);
			const lDate = lTravailAFaire.PourLe;
			const lLibelleMatiere = lTravailAFaire.Matiere.Libelle;
			const lDateDonneLe = lTravailAFaire.DonneLe;
			if (
				lDate &&
				(!lDateCourante || !ObjetDate_1.GDate.estJourEgal(lDateCourante, lDate))
			) {
				if (!!lDateCourante) {
					lHtml.push("</ul>");
					lHtml.push("</li>");
				}
				lDateCourante = lDate;
				lDateDonneLeCourante = null;
				lEstPremierTafDeLaDate = true;
				const lId = ObjetDate_1.GDate.formatDate(
					lDateCourante,
					"%JJ%MM%AAAA",
				).toString();
				lHtml.push("<li>");
				lHtml.push(
					'<div id="',
					lId,
					'" data-idDate="',
					lId,
					'" tabindex="-1">',
					'<h2 class="ie-titre-gros souligne"><span>',
					(
						ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.pour") +
						" </span>" +
						ObjetDate_1.GDate.formatDate(
							lDateCourante,
							"[" + "%JJJJ %JJ %MMMM" + "]",
						)
					)
						.toLowerCase()
						.ucfirst(),
					"</h2>",
					"</div>",
				);
				lHtml.push('<ul class="liste-element" aria-labelledby="', lId, '">');
			}
			const lEstQCM = !(
				lTravailAFaire.executionQCM === null ||
				lTravailAFaire.executionQCM === undefined
			);
			let lEstFait = false;
			if (lEstQCM && !!lTravailAFaire.executionQCM.etatCloture) {
				lEstFait = lTravailAFaire.QCMFait;
			} else {
				lEstFait = lTravailAFaire.TAFFait;
			}
			if (!!lLibelleMatiere) {
				lHtml.push("</li>");
			}
			lHtml.push('<li tabindex="0">');
			lDateDonneLeCourante = null;
			lHtml.push(
				'       <div class="conteneur-item',
				!lEstPremierTafDeLaDate ? " ligne-separation" : "",
				'">',
			);
			lEstPremierTafDeLaDate = false;
			lHtml.push('        <div class="entete-element">');
			lHtml.push(
				'         <div class="flex-contain">',
				'          <div style="background-color:',
				lTravailAFaire.CouleurFond,
				';margin-right:0.8rem;padding:0.2rem;border-radius:0.4rem;"></div>',
			);
			lHtml.push("          <div>");
			if (!aAvecFiltrage) {
				lHtml.push(
					'          <div class="titre-matiere ',
					lEstFait ? "est-fait" : "",
					'">' + lLibelleMatiere + "</div>",
				);
			}
			if (
				lDateDonneLe &&
				(!lDateDonneLeCourante ||
					!ObjetDate_1.GDate.estJourEgal(lDateDonneLeCourante, lDateDonneLe))
			) {
				lDateDonneLeCourante = lDateDonneLe;
				lHtml.push(this.composeDonneLe(lTravailAFaire));
			}
			lHtml.push(this.composeThemes(lTravailAFaire));
			lHtml.push("           </div>");
			lHtml.push("          </div>");
			if (
				GEtatUtilisateur.estEspacePourProf() ||
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement
			) {
				lHtml.push(this.composeDetailsClasse(lTravailAFaire));
			} else {
				lHtml.push(
					'          <div><ie-chips tabindex="-1" class="tag-style ',
					lEstFait ? "color-theme" : "",
					'">',
					lEstFait
						? ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.TAFFait")
						: ObjetTraduction_1.GTraductions.getValeur(
								"TAFEtContenu.TAFNonFait",
							),
					"</ie-chips></div>",
				);
			}
			lHtml.push("        </div>");
			lHtml.push(
				this.composeTravailAFaire(lTravailAFaire, {
					utilitaire: aUtilititaire,
					listeTAF: aListeTravailAFaire,
					controleur: aControleur,
				}),
			);
			lHtml.push("      </div>");
		}
		lHtml.push("</li>");
		lHtml.push("</ul>");
		lHtml.push("</li>");
		lHtml.push("</ul>");
		return lHtml.join("");
	}
	composeFicheTAF(
		aListeTAF,
		aUtilititaire,
		aControleur,
		aEstChronologique = false,
	) {
		const lHtml = [];
		lHtml.push(
			'<div class="conteneur-liste-CDT conteneur-fiche-CDT AvecSelectionTexte" tabindex="0">',
		);
		for (let i = 0, lNbr = aListeTAF.count(); i < lNbr; i++) {
			const lTAF = aListeTAF.get(i);
			const lEstQCM = !(
				lTAF.executionQCM === null || lTAF.executionQCM === undefined
			);
			let lEstFait = false;
			if (lEstQCM && !!lTAF.executionQCM.etatCloture) {
				lEstFait = lTAF.QCMFait;
			} else {
				lEstFait = lTAF.TAFFait;
			}
			lHtml.push(
				'<div class="conteneur-item',
				i > 0 ? " ligne-separation" : "",
				'">',
			);
			lHtml.push('<div class="entete-element">');
			lHtml.push(
				'<div class="flex-contain">',
				' <div style="background-color:',
				lTAF.CouleurFond,
				';margin-right:0.8rem;padding:0.2rem;border-radius:0.4rem;"></div>',
			);
			lHtml.push(" <div>");
			lHtml.push(
				'   <div class="titre-matiere ',
				lEstFait ? "est-fait" : "",
				'">' + lTAF.Matiere.Libelle + "</div>",
			);
			if (lTAF.donneLe) {
				lHtml.push(this.composeDonneLe(lTAF));
			}
			if (lTAF.PourLe) {
				lHtml.push(
					' <div class="ie-sous-titre">',
					ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.pourLe"),
					ObjetDate_1.GDate.formatDate(lTAF.PourLe, " %JJJ %JJ %MMM"),
					"</div>",
				);
			}
			lHtml.push("  </div>");
			lHtml.push(" </div>");
			if (
				GEtatUtilisateur.estEspacePourProf() ||
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement
			) {
				lHtml.push(this.composeDetailsClasse(lTAF));
			} else {
				lHtml.push(
					'<div><ie-chips tabindex="-1" class="tag-style ',
					lEstFait ? "color-theme" : "",
					'">',
					lEstFait
						? ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.TAFFait")
						: ObjetTraduction_1.GTraductions.getValeur(
								"TAFEtContenu.TAFNonFait",
							),
					"</ie-chips></div>",
				);
			}
			lHtml.push("</div>");
			lHtml.push(
				this.composeTravailAFaire(
					lTAF,
					{
						utilitaire: aUtilititaire,
						listeTAF: aListeTAF,
						controleur: aControleur,
					},
					true,
					aEstChronologique,
				),
			);
			lHtml.push("</div>");
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeDonneLe(aTravailAFaire, aEstPrimaire = false) {
		const lPourLe = aEstPrimaire
			? aTravailAFaire.DateDebut
			: aTravailAFaire.PourLe;
		const lDonneLe = aEstPrimaire
			? aTravailAFaire.donneLe
			: aTravailAFaire.DonneLe;
		const lNbrJours = ObjetDate_1.GDate.getDifferenceJours(lPourLe, lDonneLe);
		const lHtml = [];
		lHtml.push(
			'<div class="ie-sous-titre">',
			ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.donneLe"),
			" ",
			ObjetDate_1.GDate.formatDate(lDonneLe, "%JJJ %JJ %MMM"),
			" [",
			lNbrJours,
			" ",
			lNbrJours
				? ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.jours")
				: ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.jour"),
			"]",
			"</div>",
		);
		return lHtml.join("");
	}
	composeThemes(aTAF) {
		if (!aTAF.ListeThemes || aTAF.ListeThemes.count() === 0) {
			return "";
		}
		const lHtml = [];
		lHtml.push('<div class="ie-sous-titre">');
		lHtml.push(
			"<span>",
			ObjetTraduction_1.GTraductions.getValeur("Themes"),
			" : ",
			"</span>",
		);
		const H = [];
		for (let i = 0, lNbr = aTAF.ListeThemes.count(); i < lNbr; i++) {
			H.push(aTAF.ListeThemes.get(i).getLibelle());
		}
		lHtml.push(H.join(", "));
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeDetails(aTravailAFaire) {
		if (!(aTravailAFaire.duree || aTravailAFaire.niveauDifficulte)) {
			return '<div class="clear"></div>';
		}
		const H = [];
		H.push('<div class="ie-sous-titre details">');
		if (aTravailAFaire.duree) {
			const lFormatMin = aTravailAFaire.duree > 60 ? "%mm" : "%xm";
			const lStrDuree = ObjetDate_1.GDate.formatDureeEnMillisecondes(
				aTravailAFaire.duree * 60 * 1000,
				aTravailAFaire.duree > 60 ? "%xh%sh" + lFormatMin : lFormatMin + "mn",
			);
			H.push(
				'<span class="duree"><i class="icon_edt_permanence" aria-label="',
				ObjetTraduction_1.GTraductions.getValeur("Duree"),
				'" role="img"></i>',
				lStrDuree,
				"</span>",
			);
		}
		if (
			!!aTravailAFaire.niveauDifficulte &&
			aTravailAFaire.niveauDifficulte !==
				TypeNiveauDifficulte_1.TypeNiveauDifficulte.ND_NonPrecise
		) {
			H.push(
				'<span class="difficulte" title="',
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.NiveauDifficulte",
				),
				'">',
				TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.construireIcon(
					aTravailAFaire.niveauDifficulte,
				),
				TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.typeToStr(
					aTravailAFaire.niveauDifficulte,
				),
				"</span>",
			);
		}
		H.push("</div>");
		return H.join("");
	}
	composeTravailAFaire(
		aTravailAFaire,
		aParams,
		aEstFiche = false,
		aEstChronologique = false,
	) {
		const lEstPrimaire = aParams.estPrimaire,
			lHtml = [],
			lAvecERendu = TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
				aTravailAFaire.genreRendu,
			),
			lEstQCM = !(
				aTravailAFaire.executionQCM === null ||
				aTravailAFaire.executionQCM === undefined
			);
		let lEstFait = false;
		if (lEstQCM && !!aTravailAFaire.executionQCM.etatCloture && !lEstPrimaire) {
			lEstFait = aTravailAFaire.QCMFait;
		} else {
			lEstFait = aTravailAFaire.TAFFait;
		}
		lHtml.push('<div class="entete-element">');
		lHtml.push(this.composeDetails(aTravailAFaire));
		lHtml.push("</div>");
		if (
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduPapier(
				aTravailAFaire.genreRendu,
			)
		) {
			lHtml.push(
				'<div class="ie-sous-titre rendu-papier details">',
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.Eleve.RenduPapier",
				),
				"</div>",
			);
		}
		lHtml.push('<div class="conteneur-descriptif">');
		if (
			aTravailAFaire.executionQCM === null ||
			aTravailAFaire.executionQCM === undefined
		) {
			const lIdPourAria = GUID_1.GUID.getId();
			lHtml.push(
				'<div id="',
				lIdPourAria,
				'" class="description ',
				!lEstQCM ? "tiny-view " : "",
				lEstFait ? "est-fait" : "",
				'">',
				lEstPrimaire ? aTravailAFaire.consigne : aTravailAFaire.descriptif,
				"</div>",
				lEstPrimaire
					? aTravailAFaire.documents.count()
						? this.composePiecesJointes(aTravailAFaire, true, lIdPourAria)
						: ""
					: aTravailAFaire.ListePieceJointe.count()
						? this.composePiecesJointes(aTravailAFaire, false, lIdPourAria)
						: "",
			);
		} else {
			lHtml.push(
				'<div class="description ',
				lEstFait ? "est-fait" : "",
				'"><i role="presentation" class="icon_qcm ThemeCat-pedagogie"></i>',
				lEstPrimaire
					? aTravailAFaire.executionQCM.QCM.getLibelle()
					: aTravailAFaire.descriptif,
				" (",
				UtilitaireQCM_1.UtilitaireQCM.getStrResumeModalites(
					aTravailAFaire.executionQCM,
				),
				") </div>",
			);
		}
		const lOngletPublie = GEtatUtilisateur.listeOnglets.getElementParGenre(
			Enumere_Onglet_1.EGenreOnglet.CDT_Contenu,
		);
		if (
			aTravailAFaire.cours &&
			!(aEstFiche && (IE.estMobile || aEstChronologique)) &&
			!!lOngletPublie &&
			!!lOngletPublie.Actif
		) {
			lHtml.push(
				'<div class="btnCours">',
				"<ie-bouton ie-model=\"appelCours('" +
					aTravailAFaire.getNumero() +
					'\')" class="themeBoutonNeutre small-bt" aria-haspopup="dialog">',
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.VoirContenu",
				),
				"</ie-bouton>",
				"</div>",
			);
		}
		if (!GEtatUtilisateur.estEspacePourProf()) {
			if (!lEstQCM && !lAvecERendu) {
				const lEstActivite =
					aTravailAFaire.getGenre() ===
					TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Activite;
				const lPeutFaire =
					(this.peutFaireTAF && !lEstActivite) ||
					(this.peutFaireActivite && lEstActivite);
				if (lPeutFaire) {
					lHtml.push(
						IE.jsx.str("div", {
							class: "no-fixed fluid-bloc",
							"ie-synthesevocale":
								this.utilitaireCDT.jsxSyntheseVocaleActivite.bind(
									this,
									aTravailAFaire,
								),
						}),
					);
					lHtml.push(
						'<div class="flex-contain conteneur-cb"><ie-checkbox class="cb-termine colored-label" ie-textleft ie-model="evenementTafFait(\'',
						aTravailAFaire.getNumero(),
						"')\">",
						[
							Enumere_Espace_1.EGenreEspace.PrimParent,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
						].includes(GEtatUtilisateur.GenreEspace)
							? ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.TAFARendre.Parent.cbTermine",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TAFEtContenu.cbTermine",
								),
						"</ie-checkbox></div>",
					);
				}
			} else if (lEstQCM) {
				const lAvecAction = UtilitaireQCM_1.UtilitaireQCM.estCliquable(
					aTravailAFaire.executionQCM,
				);
				if (lAvecAction) {
					const lBoutonExecution =
						!lEstFait && aTravailAFaire.executionQCM.estEnPublication;
					lHtml.push(
						'<div class="flex-contain btn-qcm"><ie-bouton ie-model="appelQCM(\'' +
							aTravailAFaire.executionQCM.getNumero() +
							'\')" class="',
						!lBoutonExecution ? "themeBoutonNeutre" : "themeBoutonSecondaire",
						'">',
						!lBoutonExecution &&
							(!GEtatUtilisateur.estEspacePourEleve() ||
								!UtilitaireQCM_1.UtilitaireQCM.estJouable(
									aTravailAFaire.executionQCM,
								))
							? ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.voirQCM")
							: ObjetTraduction_1.GTraductions.getValeur(
									"TAFEtContenu.executerQCM",
								),
						"</ie-bouton></div>",
					);
				}
			} else {
				aTravailAFaire.avecRendu =
					aTravailAFaire.avecRendu === undefined
						? lAvecERendu
						: aTravailAFaire.avecRendu;
				lHtml.push(
					'<div class="taf-a-rendre">',
					'<div class="no-fixed fluid-bloc" ie-synthesevocale ></div>',
					aParams.utilitaire.composeTAFARendrePourWidget(aTravailAFaire, {
						controleur: aParams.controleur,
						listeTAF: aParams.listeTAF,
					}),
					"</div>",
				);
			}
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composePiecesJointes(aElement, aEstPrimaire, aIdPourAria) {
		const lHtml = [],
			lListe = aEstPrimaire ? aElement.documents : aElement.ListePieceJointe;
		lHtml.push('<div class="piece-jointe">');
		let lAvecImage = false;
		for (let I = 0; I < lListe.count(); I++) {
			const lPieceJointe = lListe.get(I);
			if (!lPieceJointe.avecMiniaturePossible) {
				lHtml.push(
					'<div class="chips-pj">',
					ObjetChaine_1.GChaine.composerUrlLienExterne({
						documentJoint: lPieceJointe,
						maxWidth: 300,
						ariaLabelledby: aIdPourAria,
					}),
					"</div>",
				);
			} else {
				lAvecImage = true;
			}
		}
		lHtml.push("</div>");
		if (lAvecImage) {
			lHtml.push(
				IE.jsx.str("div", {
					"ie-identite": this.jsxCarrouselTAF.bind(this, aElement),
				}),
			);
		}
		return lHtml.join("");
	}
	jsxCarrouselTAF(aTAF) {
		return {
			class: ObjetGalerieCarrousel_1.ObjetGalerieCarrousel,
			pere: this,
			init: (aCarrousel) => {
				aCarrousel.setOptions({
					dimensionPhoto: IE.estMobile ? 200 : 250,
					nbMaxDiaposEnZoneVisible: 10,
					justifieAGauche: true,
					sansBlocLibelle: true,
					altImage: ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.altImage.TAF",
					),
				});
				aCarrousel.initialiser();
			},
			start: (aCarrousel) => {
				const lListeDiapos = new ObjetListeElements_1.ObjetListeElements();
				if (aTAF && aTAF.ListePieceJointe) {
					aTAF.ListePieceJointe.parcourir((aPJ) => {
						if (aPJ.avecMiniaturePossible) {
							let lDiapo = new ObjetElement_1.ObjetElement();
							lDiapo.setLibelle(aPJ.getLibelle());
							aPJ.miniature = TypeGenreMiniature_1.TypeGenreMiniature.GM_500;
							lDiapo.documentCasier = aPJ;
							lListeDiapos.add(lDiapo);
						}
					});
				}
				aCarrousel.setDonnees({ listeDiapos: lListeDiapos });
			},
		};
	}
	composeDetailsClasse(aTAF) {
		const lHtml = [];
		const lDonnee = aTAF;
		const lSansRendu = TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estSansRendu(
			lDonnee.genreRendu,
		);
		let lLibelle;
		if (lDonnee.avecRendu) {
			lLibelle =
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.RenduPar",
				) +
				" " +
				lDonnee.nbrRendus +
				"/" +
				lDonnee.nbrEleves;
			if (lDonnee.estProfDuCours) {
				lHtml.push(
					'<div class="detailsRendu">',
					"<ie-bouton ie-model=\"appelDetailTAF('" +
						aTAF.getNumero() +
						'\')" class="themeBoutonSecondaire small-bt">',
					lLibelle,
					"</ie-bouton>",
					"</div>",
				);
			} else {
				lHtml.push('<div class="detailsRendu">', lLibelle, "</div>");
			}
		}
		if (lSansRendu) {
			lLibelle =
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.FaitPar",
				) +
				" " +
				lDonnee.nbrFaitsSelonEleve +
				"/" +
				lDonnee.nbrEleves;
			if (lDonnee.estProfDuCours) {
				lHtml.push(
					'<div class="detailsRendu">',
					"<ie-bouton ie-model=\"appelDetailTAF('" +
						aTAF.getNumero() +
						'\')" class="themeBoutonSecondaire small-bt">',
					lLibelle,
					"</ie-bouton>",
					"</div>",
				);
			} else {
				lHtml.push('<div class="detailsRendu">', lLibelle, "</div>");
			}
		}
		return lHtml.join("");
	}
	composePageTravailAFairePrimaire(
		aListeTravailAFaire,
		aUtilititaire,
		aControleur,
	) {
		const lHtml = [];
		let lDateCourante = null;
		let lDateDonneLeCourante = null;
		let lEstPremierTafDeLaDate = false;
		lHtml.push('<ul class="liste-date">');
		for (let I = 0; I < aListeTravailAFaire.count(); I++) {
			const lTravailAFaire = aListeTravailAFaire.get(I);
			const lDate = lTravailAFaire.DateDebut;
			const lLibelleMatiere =
				lTravailAFaire.titre ||
				(!!lTravailAFaire.matiere && lTravailAFaire.matiere.Libelle);
			const lDateDonneLe = lTravailAFaire.donneLe;
			if (
				lDate &&
				(!lDateCourante || !ObjetDate_1.GDate.estJourEgal(lDateCourante, lDate))
			) {
				if (!!lDateCourante) {
					lHtml.push("</ul>");
					lHtml.push("</li>");
				}
				lDateCourante = lDate;
				lEstPremierTafDeLaDate = true;
				lHtml.push("<li>");
				const lId = ObjetDate_1.GDate.formatDate(
					lDateCourante,
					"%JJ%MM%AAAA",
				).toString();
				lHtml.push(
					'<div id="',
					lId,
					'" data-idDate="',
					lId,
					'" tabindex="-1">',
					'<h2 class="ie-titre-gros conteneur-date"><span>',
					(
						ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.pour") +
						" </span>" +
						ObjetDate_1.GDate.formatDate(
							lDateCourante,
							"[" + "%JJJJ %JJ %MMMM" + "]",
						)
					)
						.toLowerCase()
						.ucfirst(),
					"</h2>",
					"</div>",
				);
				lHtml.push(
					'<div class="ligne-separation-date ',
					lTravailAFaire.estRappel ? "conteneur-rappel" : "",
					'"></div>',
				);
				lHtml.push('<ul class="liste-element" aria-labelledby="', lId, '">');
			}
			const lEstQCM = !(
				lTravailAFaire.executionQCM === null ||
				lTravailAFaire.executionQCM === undefined
			);
			let lEstFait = false;
			if (lEstQCM && !!lTravailAFaire.executionQCM.etatCloture) {
				lEstFait =
					lTravailAFaire.executionQCM.etatCloture ===
					TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant
						.EQR_Termine;
			} else {
				lEstFait = lTravailAFaire.TAFFait;
			}
			if (!!lLibelleMatiere) {
				lHtml.push("</li>");
			}
			lHtml.push('<li tabindex="0">');
			lDateDonneLeCourante = null;
			if (lTravailAFaire.estRappel) {
				lHtml.push(this.composeRappel(lTravailAFaire, !lEstPremierTafDeLaDate));
			} else {
				lHtml.push(
					'       <div class="conteneur-item',
					!lEstPremierTafDeLaDate ? " ligne-separation" : "",
					'">',
				);
				lHtml.push('        <div class="entete-element">');
				lHtml.push('          <div class="flex-contain">');
				let lInfoIcone = {
					nom: TypeGenreTravailAFaire_2.TypeGenreTravailAFaireUtil.getIcone(
						lTravailAFaire.getGenre(),
					),
					hint: TypeGenreTravailAFaire_2.TypeGenreTravailAFaireUtil.getStr(
						lTravailAFaire.getGenre(),
					),
					couleur:
						TypeGenreTravailAFaire_2.TypeGenreTravailAFaireUtil.getCouleur(
							lTravailAFaire.getGenre(),
						),
					fontSize:
						lTravailAFaire.getGenre() ===
						TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Activite
							? "20px"
							: "22px",
				};
				if (!!lInfoIcone) {
					lHtml.push(
						'          <div title="',
						lInfoIcone.hint,
						'" class="conteneur-icon">',
						'<i class=" ',
						lInfoIcone.nom,
						' AlignementMilieuVertical" role="presentation" style="font-size:',
						lInfoIcone.fontSize,
						"; color:",
						lInfoIcone.couleur,
						';"></i>',
						"</div>",
					);
				}
				lHtml.push(
					'           <div class="flex-contain">',
					'            <div style="background-color:',
					lTravailAFaire.couleur,
					';margin-right:0.8rem;padding:0.2rem;border-radius:0.4rem;"></div>',
				);
				lHtml.push("             <div>");
				lHtml.push(
					'              <div class="titre-matiere ',
					lEstFait ? "est-fait" : "",
					'">' + lLibelleMatiere + "</div>",
				);
				if (
					lDateDonneLe &&
					(!lDateDonneLeCourante ||
						!ObjetDate_1.GDate.estJourEgal(lDateDonneLeCourante, lDateDonneLe))
				) {
					lDateDonneLeCourante = lDateDonneLe;
					lHtml.push(this.composeDonneLe(lTravailAFaire, true));
				}
				lHtml.push("             </div>");
				lHtml.push("            </div>");
				lHtml.push("          </div>");
				lHtml.push(
					'          <div><ie-chips tabindex="-1" class="tag-style ',
					lEstFait ? "color-theme" : "",
					'">',
					lEstFait
						? ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.TAFFait")
						: ObjetTraduction_1.GTraductions.getValeur(
								"TAFEtContenu.TAFNonFait",
							),
					"</ie-chips></div>",
				);
				lHtml.push("        </div>");
				lHtml.push(
					this.composeTravailAFaire(lTravailAFaire, {
						utilitaire: aUtilititaire,
						listeTAF: aListeTravailAFaire,
						controleur: aControleur,
						estPrimaire: true,
					}),
				);
				lHtml.push("</div>");
			}
			lEstPremierTafDeLaDate = false;
		}
		lHtml.push("</li>");
		lHtml.push("</ul>");
		lHtml.push("</li>");
		lHtml.push("</ul>");
		return lHtml.join("");
	}
	composeRappel(aRappel, aAvecLigneSeparation) {
		const lHtml = [];
		lHtml.push(
			'<div class="conteneur-rappel',
			aAvecLigneSeparation ? " ligne-separation" : "",
			'">',
		);
		lHtml.push('  <div class="entete-element">');
		lHtml.push('    <div class="flex-contain">');
		lHtml.push(
			'      <div class="conteneur-icon">',
			'<i class="icon_bell ThemeCat-pense-bete" role="presentation"></i>',
			"</div>",
		);
		lHtml.push(
			'      <div class="titre-matiere ',
			aRappel.estAccuse ? "est-vu" : "",
			'">',
			aRappel.titre,
			"</div>",
		);
		lHtml.push("    </div>");
		if (aRappel.estAccuse) {
			lHtml.push(
				'    <div><ie-chips tabindex="-1" class="tag-style ThemeCat-resultat">',
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ChipsVu"),
				"</ie-chips></div>",
			);
		}
		lHtml.push("  </div>");
		lHtml.push('  <div class="conteneur-descriptif">');
		if (aRappel.detail) {
			lHtml.push(
				'    <div class="description ',
				aRappel.estAccuse ? "est-vu" : "",
				'">',
				aRappel.detail,
				"</div>",
			);
		}
		if (!ObjetDate_1.GDate.estAvantJourCourant(aRappel.DateDebut, true)) {
			lHtml.push(
				'      <div class="flex-contain conteneur-cb">',
				'<ie-checkbox ie-textleft class="cb-termine cb-rappel ThemeCat-resultat" ie-model="cbEventRappel(\'',
				aRappel.getNumero(),
				"')\">",
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.CBJeSuisInformee",
				),
				"</ie-checkbox></div>",
			);
		}
		lHtml.push("  </div>");
		lHtml.push("</div>");
		return lHtml.join("");
	}
}
exports.UtilitaireTAFEleves = UtilitaireTAFEleves;
