const { GTraductions } = require("ObjetTraduction.js");
const { GDate } = require("ObjetDate.js");
const { GChaine } = require("ObjetChaine.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	EGenreRessourcePedagogique,
	EGenreRessourcePedagogiqueUtil,
} = require("Enumere_RessourcePedagogique.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_CorrectionTaf } = require("ObjetFenetre_CorrectionTaf.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { tag } = require("tag.js");
class UtilitaireContenuDeCours {
	constructor() {
		this.idDate = "TAF_BlocDate_";
	}
	composePageContenu(aListeCahierDeTextes, aAvecFiltrage) {
		const lHtml = [];
		let lDateCourante = null;
		let lEstPremierCDCDeLaDate = false;
		lHtml.push('<ul class="liste-date">');
		if (!IE.estMobile) {
			lHtml.push('<li aria-hidden="true">');
			lHtml.push(
				'<div class="conteneur-titre-liste titre-espaceBas-xxl">',
				'<i class="icon_th_large"></i>',
				'<span class="ie-titre">',
				GTraductions.getValeur("CahierDeTexte.contenu"),
				"</span>",
				"</div>",
			);
			lHtml.push("</li>");
		}
		const lListeProfesseursMatiere = new ObjetListeElements();
		if (aAvecFiltrage) {
			aListeCahierDeTextes.parcourir((aCDT) => {
				aCDT.listeProfesseurs.parcourir((aProf) => {
					if (!lListeProfesseursMatiere.getElementParElement(aProf)) {
						lListeProfesseursMatiere.add(aProf);
					}
				});
			});
		}
		for (let I = 0; I < aListeCahierDeTextes.count(); I++) {
			const lCahierDeTextes = aListeCahierDeTextes.get(I);
			if (
				(lCahierDeTextes.listeContenus &&
					lCahierDeTextes.listeContenus.count() > 0) ||
				(lCahierDeTextes.listeElementsProgrammeCDT &&
					lCahierDeTextes.listeElementsProgrammeCDT.count() > 0)
			) {
				const lDate = GDate.getJour(lCahierDeTextes.Date);
				if (!lDateCourante || !GDate.estJourEgal(lDateCourante, lDate)) {
					if (!!lDateCourante) {
						lHtml.push("</ul>");
						lHtml.push("</li>");
					}
					lDateCourante = lDate;
					lEstPremierCDCDeLaDate = true;
					lHtml.push("<li>");
					const lId =
						this.idDate +
						GDate.formatDate(lDateCourante, "%JJ%MM%AAAA").toString();
					if (!aAvecFiltrage || IE.estMobile) {
						lHtml.push(
							'<div id="',
							lId,
							'" tabindex="-1">',
							'<h2 class="ie-titre-gros souligne">',
							GDate.formatDate(
								lDateCourante,
								"[" + "%JJJJ %JJ %MMMM" + "]",
							).ucfirst(),
							"</h2>",
							"</div>",
						);
					}
					lHtml.push('<ul class="liste-element" aria-labelledby="', lId, '">');
				}
				lHtml.push('<li tabindex="0">');
				lHtml.push(
					'       <div class="conteneur-item',
					(aAvecFiltrage && !IE.estMobile && I > 0) || !lEstPremierCDCDeLaDate
						? " ligne-separation"
						: "",
					'">',
				);
				lEstPremierCDCDeLaDate = false;
				if (!aAvecFiltrage) {
					lHtml.push('<div class="entete-element">');
					lHtml.push(
						'<div class="couleur-matiere ie-line-color static" style="--color-line:',
						lCahierDeTextes.Matiere.CouleurFond,
						';"><div>',
					);
					lHtml.push(
						'<div class="titre-matiere">',
						lCahierDeTextes.Matiere.Libelle,
						"</div>",
					);
					lHtml.push(this.composeProfesseurs(lCahierDeTextes));
					lHtml.push("</div>");
					lHtml.push("</div>");
					lHtml.push(
						'<div class="ie-titre-petit">',
						GDate.formatDate(lCahierDeTextes.Date, "%hh%sh%mm"),
						lCahierDeTextes.DateFin
							? GDate.formatDate(
									lCahierDeTextes.DateFin,
									" " + GTraductions.getValeur("A") + " %hh%sh%mm",
								)
							: "",
						"</div>",
					);
					lHtml.push("</div>");
				} else if (lListeProfesseursMatiere.count() > 1) {
					lHtml.push(this.composeProfesseurs(lCahierDeTextes));
				}
				lHtml.push(this.composeContenu(lCahierDeTextes, aAvecFiltrage));
				const lOngletPublie = GEtatUtilisateur.listeOnglets.getElementParGenre(
					EGenreOnglet.CDT_TAF,
				);
				if (
					lCahierDeTextes.dateTAF &&
					!!lOngletPublie &&
					!!lOngletPublie.Actif
				) {
					lHtml.push(
						'<div class="btnCours">',
						"<ie-bouton ie-model=\"appelTAF('" +
							lCahierDeTextes.getNumero() +
							'\')" class="themeBoutonNeutre small-bt">',
						GTraductions.getValeur("CahierDeTexte.voirTAF"),
						"</ie-bouton>",
						"</div>",
					);
				}
				lHtml.push("       </div>");
				lHtml.push(this.composeElementsProgramme(lCahierDeTextes));
				lHtml.push("</li>");
			}
		}
		lHtml.push("</ul>");
		lHtml.push("</li>");
		lHtml.push("</ul>");
		return lHtml.join("");
	}
	composeFicheCours(aCDT, aEstChronologique = false) {
		const lHtml = [];
		lHtml.push(
			'<div class="conteneur-liste-CDT conteneur-fiche-CDT AvecSelectionTexte" tabindex="0">',
		);
		lHtml.push('<div class="conteneur-item">');
		lHtml.push(
			'<div class="flex-contain">',
			'<div style="background-color:',
			aCDT.CouleurFond,
			';margin-right:0.8rem;padding:0.2rem;border-radius:0.4rem;"></div>',
		);
		lHtml.push("<div>");
		lHtml.push(
			' <div class="titre-matiere">' + aCDT.Matiere.getLibelle() + "</div>",
		);
		lHtml.push(this.composeProfesseurs(aCDT));
		lHtml.push("</div>");
		lHtml.push("</div>");
		lHtml.push(
			'<div class="ie-titre-petit details">',
			GDate.formatDate(aCDT.Date, "%JJJ %JJ %MMM"),
			GDate.formatDate(
				aCDT.Date,
				" " + GTraductions.getValeur("De") + " %hh%sh%mm",
			),
			aCDT.DateFin
				? GDate.formatDate(
						aCDT.DateFin,
						" " + GTraductions.getValeur("A") + " %hh%sh%mm",
					)
				: "",
			"</div>",
		);
		lHtml.push(this.composeContenu(aCDT));
		const lOngletPublie = GEtatUtilisateur.listeOnglets.getElementParGenre(
			EGenreOnglet.CDT_TAF,
		);
		if (
			aCDT.dateTAF &&
			!IE.estMobile &&
			!aEstChronologique &&
			!!lOngletPublie &&
			!!lOngletPublie.Actif
		) {
			lHtml.push(
				'<div class="btnCours">',
				"<ie-bouton ie-model=\"appelTAF('" +
					aCDT.getNumero() +
					'\')" class="themeBoutonNeutre small-bt">',
				GTraductions.getValeur("CahierDeTexte.voirTAF"),
				"</ie-bouton>",
				"</div>",
			);
		}
		lHtml.push("</div>");
		lHtml.push(this.composeElementsProgramme(aCDT));
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeProfesseurs(aCDT) {
		if (!aCDT.listeProfesseurs || aCDT.listeProfesseurs.count() === 0) {
			return "";
		}
		const lHtml = [];
		lHtml.push('<div class="ie-sous-titre">');
		for (let i = 0, lNbr = aCDT.listeProfesseurs.count(); i < lNbr; i++) {
			lHtml.push("<div>", aCDT.listeProfesseurs.get(i).getLibelle(), "</div>");
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeThemes(aCDT) {
		if (!aCDT.ListeThemes || aCDT.ListeThemes.count() === 0) {
			return "";
		}
		const lHtml = [];
		lHtml.push("<div>");
		lHtml.push("<span>", GTraductions.getValeur("Themes"), " : ", "</span>");
		const H = [];
		for (let i = 0, lNbr = aCDT.ListeThemes.count(); i < lNbr; i++) {
			H.push(aCDT.ListeThemes.get(i).getLibelle());
		}
		lHtml.push(H.join(", "));
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeContenu(aCDT, aAvecFiltrage) {
		if (!aCDT.listeContenus || aCDT.listeContenus.count() === 0) {
			return "";
		}
		const lHtml = [];
		lHtml.push(
			'<div class="',
			!aAvecFiltrage ? "conteneur-descriptif" : "",
			'">',
		);
		for (let i = 0, lNbr = aCDT.listeContenus.count(); i < lNbr; i++) {
			const lContenu = aCDT.listeContenus.get(i);
			lHtml.push(
				'<div class="m-bottom-l ',
				i > 0 ? " ligne-separation" : "",
				'">',
			);
			lHtml.push(
				'<div class="entete-element ',
				!aAvecFiltrage ? "titre-contenu" : "",
				'">',
			);
			lHtml.push("<div>");
			if (lContenu.Libelle) {
				lHtml.push(
					'<div class="titre-matiere">',
					lContenu.getLibelle(),
					"</div>",
				);
			}
			if (aAvecFiltrage || (aCDT.ListeThemes && aCDT.ListeThemes.count())) {
				lHtml.push('<div class="ie-titre-petit titre-date">');
				if (aAvecFiltrage) {
					if (IE.estMobile) {
						lHtml.push(
							GDate.formatDate(aCDT.Date, "%hh%sh%mm"),
							aCDT.DateFin
								? GDate.formatDate(
										aCDT.DateFin,
										" " + GTraductions.getValeur("A") + " %hh%sh%mm",
									)
								: "",
						);
					} else {
						lHtml.push(
							GDate.formatDate(aCDT.Date, "[" + "%JJJ %JJ %MMM" + "]"),
						);
					}
				}
				lHtml.push(this.composeThemes(lContenu));
				lHtml.push(" </div>");
			}
			lHtml.push("</div>");
			if (lContenu.categorie && lContenu.categorie.Libelle) {
				lHtml.push(
					'<div><ie-chips tabindex="-1" class="tag-style">',
					lContenu.categorie.getLibelle(),
					"</ie-chips></div>",
				);
			}
			lHtml.push("</div>");
			lHtml.push(
				'<div class="descriptif tiny-view">',
				lContenu.descriptif,
				"</div>",
				lContenu.ListePieceJointe.count()
					? this.composePiecesJointes(lContenu)
					: "",
			);
			for (
				let j = 0, lNbr2 = lContenu.listeExecutionQCM.count();
				lContenu.listeExecutionQCM && j < lNbr2;
				j++
			) {
				const lExecutionQCM = lContenu.listeExecutionQCM.get(j);
				lHtml.push(
					'<div class="revision">',
					GTraductions.getValeur("ExecutionQCM.RepondreQCMContenu"),
					' : <i class="icon_qcm ThemeCat-pedagogie"></i>',
					lExecutionQCM.QCM.getLibelle(),
					" (",
					UtilitaireQCM.getStrResumeModalites(lExecutionQCM),
					") </div>",
				);
				const lAvecAction = UtilitaireQCM.estCliquable(lExecutionQCM);
				if (lAvecAction) {
					lHtml.push(
						'<div class="flex-contain qcm-revision">',
						"<ie-bouton ie-model=\"appelQCM('" +
							lExecutionQCM.getNumero() +
							'\')" class="themeBoutonSecondaire">',
						GTraductions.getValeur("TAFEtContenu.executerQCM"),
						"</ie-bouton>",
						"</div>",
					);
				}
			}
			lHtml.push("</div>");
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeElementsProgramme(aCDT) {
		const lHtml = [];
		let lElementProgrammeCDT;
		if (
			aCDT.listeElementsProgrammeCDT &&
			aCDT.listeElementsProgrammeCDT.count()
		) {
			lHtml.push('<div class="programme ligne-separation">');
			lHtml.push(
				'  <div class="Gras">',
				GTraductions.getValeur("CahierDeTexte.ElementsProgramme"),
				" :",
				"</div>",
			);
			for (
				let i = 0, lNbr = aCDT.listeElementsProgrammeCDT.count();
				i < lNbr;
				i++
			) {
				lElementProgrammeCDT = aCDT.listeElementsProgrammeCDT.get(i);
				lHtml.push("<div>-&nbsp;", lElementProgrammeCDT.getLibelle(), "</div>");
			}
			lHtml.push("</div>");
		}
		return lHtml.join("");
	}
	composePiecesJointes(aElement) {
		const lHtml = [],
			lListe = aElement.ListePieceJointe;
		lHtml.push('<div class="piece-jointe">');
		let lAvecImage = false;
		for (let I = 0; I < lListe.count(); I++) {
			const lPieceJointe = lListe.get(I);
			if (!lPieceJointe.avecMiniaturePossible) {
				lHtml.push(
					'<div class="chips-pj">',
					GChaine.composerUrlLienExterne({
						documentJoint: lPieceJointe,
						maxWidth: 300,
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
				"<div ie-identite=\"getCarrouselCDC('",
				aElement.getNumero(),
				"')\"></div>",
			);
		}
		return lHtml.join("");
	}
	composeTitreRessourcesPeda() {
		return (
			'<div class="conteneur-titre-liste titre-espaceBas-l"><i class="icon_folder_close"></i><span class="ie-titre">' +
			GTraductions.getValeur("CahierDeTexte.RessourcesPedagogiques") +
			"</span></div>"
		);
	}
	composeRPSujetOuCorrige(aListeRessPeda, estDeploye) {
		const lHtml = [];
		if (aListeRessPeda && aListeRessPeda.count()) {
			const lHtmlListe = [];
			aListeRessPeda.setTri([ObjetTri.init("Genre")]).trier();
			const lCacheDevoirsEvaluations = {};
			aListeRessPeda.parcourir((D) => {
				if (!!D.ressource) {
					if (!lCacheDevoirsEvaluations[D.ressource.getNumero()]) {
						const lStrDevoirEvaluation = [];
						if (D.ressource.getGenre() === EGenreRessource.Devoir) {
							lStrDevoirEvaluation.push(
								GTraductions.getValeur(
									"CahierDeTexte.ContenuCours.RessourcesPedagogiques.DevoirDu",
									[GDate.formatDate(D.date, "%JJJ %JJ %MMM")],
								),
							);
						} else {
							lStrDevoirEvaluation.push(
								GTraductions.getValeur(
									"CahierDeTexte.ContenuCours.RessourcesPedagogiques.EvaluationDu",
									[GDate.formatDate(D.date, "%JJJ %JJ %MMM")],
								),
							);
						}
						if (!!D.ressource.commentaire) {
							lStrDevoirEvaluation.push(" - ", D.ressource.commentaire);
						}
						lCacheDevoirsEvaluations[D.ressource.getNumero()] = {
							strDevoirEvaluation: lStrDevoirEvaluation.join(""),
							genreDevoirEvaluation: D.ressource.getGenre(),
							listeDonnees: [],
						};
					}
					lCacheDevoirsEvaluations[D.ressource.getNumero()].listeDonnees.push(
						D,
					);
				}
			});
			let lDonnee;
			let lDocumentJointLien;
			for (const lNumeroDevoirEvaluation in lCacheDevoirsEvaluations) {
				const lDevoirEvaluation =
					lCacheDevoirsEvaluations[lNumeroDevoirEvaluation];
				const lHtmlListeRessources = [];
				const lThemes = new ObjetListeElements();
				for (let i = 0; i < lDevoirEvaluation.listeDonnees.length; i++) {
					lDonnee = lDevoirEvaluation.listeDonnees[i];
					let lGenreRessourceLien;
					if (
						lDevoirEvaluation.genreDevoirEvaluation === EGenreRessource.Devoir
					) {
						if (lDonnee.getGenre() === EGenreRessourcePedagogique.sujet) {
							lGenreRessourceLien = TypeFichierExterneHttpSco.DevoirSujet;
						} else {
							lGenreRessourceLien = TypeFichierExterneHttpSco.DevoirCorrige;
						}
					} else {
						if (lDonnee.getGenre() === EGenreRessourcePedagogique.sujet) {
							lGenreRessourceLien = TypeFichierExterneHttpSco.EvaluationSujet;
						} else {
							lGenreRessourceLien = TypeFichierExterneHttpSco.EvaluationCorrige;
						}
					}
					if (lDonnee.ListeThemes && lDonnee.ListeThemes.count()) {
						lDonnee.ListeThemes.parcourir((aTheme) => {
							if (!lThemes.getElementParNumero(aTheme.getNumero())) {
								lThemes.add(aTheme);
							}
						});
					}
					lDocumentJointLien = new ObjetElement(
						lDonnee.ressource.getLibelle(),
						lDonnee.ressource.getNumero(),
						EGenreDocumentJoint.Fichier,
					);
					lHtmlListeRessources.push(
						'<div class="chips-pj">',
						GChaine.composerUrlLienExterne({
							documentJoint: lDocumentJointLien,
							genreRessource: lGenreRessourceLien,
							libelleEcran:
								EGenreRessourcePedagogiqueUtil.getLibelleDeGenreEtNombre(
									lDonnee.getGenre(),
								),
							title: lDocumentJointLien.getLibelle(),
							maxWidth: IE.estMobile ? 200 : 300,
						}),
						"</div>",
					);
				}
				lHtmlListe.push(
					'<div class="ie-titre-petit titre-date">',
					lDevoirEvaluation.strDevoirEvaluation,
					"</div>",
				);
				lHtmlListe.push(
					'<div class="piece-jointe-ressource">',
					'<div class="conteneur-chips-relies">',
					lHtmlListeRessources.join(""),
					"</div>",
					lThemes.count()
						? '<div class="pj-theme">' +
								GTraductions.getValeur("Themes") +
								" : " +
								lThemes.getTableauLibelles().join(", ") +
								"</div>"
						: "",
					"</div>",
				);
			}
			if (lHtmlListe.length) {
				lHtml.push(
					"<div ",
					IE.estMobile ? "" : 'ie-node="nodeDeploiement" ',
					'class="titre-matiere titre-ressource">',
					IE.estMobile
						? ""
						: '<div class="conteneur-chevron"><i class="' +
								(!estDeploye ? "icon_chevron_right" : "icon_chevron_down") +
								'"></i></div>',
					"<div>",
					GTraductions.getValeur(
						GEtatUtilisateur.pourPrimaire()
							? "CahierDeTexte.ContenuCours.RessourcesPedagogiques.SujetsEtCorrigePP"
							: "CahierDeTexte.ContenuCours.RessourcesPedagogiques.SujetsEtCorrige",
					),
					IE.estMobile ? "" : " (" + aListeRessPeda.count() + ")",
					"</div></div>",
				);
				lHtml.push(
					"<div ",
					!estDeploye ? 'style="display:none"' : "",
					">",
					lHtmlListe.join(""),
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
	composeRPTravailRendu(aListeRessPeda, estDeploye, aControleur) {
		const lHtml = [];
		if (aListeRessPeda && aListeRessPeda.count()) {
			const lHtmlListe = [];
			aListeRessPeda.parcourir(function (D) {
				let lStrTravailARendre = "";
				if (!!D.ressource && !!D.ressource.pourLe) {
					lStrTravailARendre = GDate.formatDate(D.date, "[%JJJ %JJ %MMM]");
				}
				const lHtmlListeRessources = [];
				lHtmlListeRessources.push(
					'<div class="ie-titre-petit titre-date">',
					lStrTravailARendre,
					"</div>",
				);
				if (
					!!D.ressource &&
					(!!D.ressource.documentCorrige || !!D.ressource.commentaireCorrige)
				) {
					lHtmlListeRessources.push('<div class="conteneur-chips-relies">');
				}
				lHtmlListeRessources.push(
					'<div class="chips-pj">',
					GChaine.composerUrlLienExterne({
						documentJoint: D.ressource,
						genreRessource: TypeFichierExterneHttpSco.TAFRenduEleve,
						libelleEcran: GTraductions.getValeur(
							"CahierDeTexte.TAFARendre.Eleve.CopieDeposee",
						),
						title: D.ressource.getLibelle(),
						maxWidth: IE.estMobile ? 200 : 300,
					}),
					"</div>",
				);
				if (
					!!D.ressource &&
					(!!D.ressource.documentCorrige || !!D.ressource.commentaireCorrige)
				) {
					lHtmlListeRessources.push('<div class="chips-pj">');
					if (!D.ressource.commentaireCorrige) {
						lHtmlListeRessources.push(
							GChaine.composerUrlLienExterne({
								documentJoint: D.ressource.documentCorrige,
								genreRessource: TypeFichierExterneHttpSco.TAFCorrigeRenduEleve,
								libelleEcran: GTraductions.getValeur(
									"CahierDeTexte.TAFARendre.Eleve.CopieCorrigeeParEnseignant",
								),
								afficherIconeDocument: false,
								maxWidth: IE.estMobile ? 200 : 300,
							}),
						);
					} else {
						lHtmlListeRessources.push(
							"<ie-chips ",
							_composeIEModelChipsOuvrirFenetreCorrectionTAF.call(
								this,
								{
									documentCorrige: D.ressource.documentCorrige,
									commentaireCorrige: D.ressource.commentaireCorrige,
								},
								aControleur,
							),
							">",
							GTraductions.getValeur(
								"CahierDeTexte.TAFARendre.Eleve.CorrectionDeLEnseignant",
							),
							"</ie-chips>",
						);
					}
					lHtmlListeRessources.push("</div>", "</div>");
				}
				lHtmlListe.push(
					'<div class="piece-jointe-ressource">',
					lHtmlListeRessources.join(""),
					D.ListeThemes && D.ListeThemes.count()
						? '<div class="pj-theme">' +
								GTraductions.getValeur("Themes") +
								" : " +
								D.ListeThemes.getTableauLibelles().join(", ") +
								"</div>"
						: "",
					"</div>",
				);
			});
			if (lHtmlListe.length) {
				lHtml.push(
					"<div ",
					IE.estMobile ? "" : 'ie-node="nodeDeploiement" ',
					'class="titre-matiere titre-ressource">',
					IE.estMobile
						? ""
						: '<div class="conteneur-chevron"><i class="' +
								(!estDeploye ? "icon_chevron_right" : "icon_chevron_down") +
								'"></i></div>',
					"<div>",
					GTraductions.getValeur(
						"CahierDeTexte.ContenuCours.RessourcesPedagogiques.TravauxRendus",
					),
					IE.estMobile ? "" : " (" + aListeRessPeda.count() + ")",
					"</div></div>",
				);
				lHtml.push(
					"<div ",
					!estDeploye ? 'style="display:none"' : "",
					">",
					lHtmlListe.join(""),
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
	composeRPQCM(aListeRessPeda, estDeploye) {
		const lHtml = [];
		if (aListeRessPeda && aListeRessPeda.count()) {
			const lHtmlListe = [],
				lHtmlQCMCorrige = [],
				lHtmlQCMRevisionEtTAF = [];
			let lCptRevision = 0,
				lCptCorrige = 0;
			aListeRessPeda.parcourir((D) => {
				const lStrQCM = GDate.formatDate(D.date, "[%JJJ %JJ %MMM]");
				const lHintQCM = GTraductions.getValeur(
					"CahierDeTexte.ContenuCours.RessourcesPedagogiques.QCMDu",
					[GDate.formatDate(D.date, "%JJJ %JJ %MMM")],
				);
				const lHtmlListeRessources = [];
				lHtmlListeRessources.push(
					'<div class="chips-pj">',
					'<ie-chips style="max-width:',
					IE.estMobile ? "200" : "300",
					'px;" ie-model="appelQCMRessource(\'',
					D.ressource.getNumero(),
					'\')"><i class="icon_qcm EspaceDroit AlignementMilieuVertical"></i>',
					D.ressource.QCM.getLibelle(),
					"</ie-chips>",
					'<span title="',
					lHintQCM,
					'" class="ie-titre-petit titre-date">',
					lStrQCM,
					"</span>",
					"</div>",
				);
				const lQCM = [
					'<div class="piece-jointe-ressource pj-qcm">',
					lHtmlListeRessources.join(""),
					D.ressource.ListeThemes && D.ressource.ListeThemes.count()
						? '<div class="pj-theme">' +
							GTraductions.getValeur("Themes") +
							" : " +
							D.ressource.ListeThemes.getTableauLibelles().join(", ") +
							"</div>"
						: "",
					"</div>",
				];
				const lEstQCMRevision =
					!D.ressource.estLieADevoir &&
					!D.ressource.estLieAEvaluation &&
					!D.ressource.estUnTAF;
				if (
					lEstQCMRevision ||
					(D.ressource.estUnTAF && !D.ressource.publierCorrige)
				) {
					lHtmlQCMRevisionEtTAF.push(lQCM.join(""));
					lCptRevision++;
				} else if (
					D.ressource.estLieADevoir ||
					D.ressource.estLieAEvaluation ||
					D.ressource.publierCorrige
				) {
					lHtmlQCMCorrige.push(lQCM.join(""));
					lCptCorrige++;
				} else {
				}
			});
			if (lHtmlQCMRevisionEtTAF.length) {
				lHtmlListe.push(
					'<div class="titre-matiere sousCategorie titre-qcm">',
					GTraductions.getValeur(
						"CahierDeTexte.ContenuCours.RessourcesPedagogiques.QCMRevisionEtTAF",
					),
					IE.estMobile ? "" : " (" + lCptRevision + ")",
					"</div>",
				);
				lHtmlListe.push(lHtmlQCMRevisionEtTAF.join(""));
			}
			if (lHtmlQCMCorrige.length) {
				lHtmlListe.push(
					'<div class="titre-matiere sousCategorie titre-qcm">',
					GTraductions.getValeur(
						"CahierDeTexte.ContenuCours.RessourcesPedagogiques.QCMCorriges",
					),
					IE.estMobile ? "" : " (" + lCptCorrige + ")",
					"</div>",
				);
				lHtmlListe.push(lHtmlQCMCorrige.join(""));
			}
			if (lHtmlListe.length) {
				lHtml.push(
					"<div ",
					IE.estMobile ? "" : 'ie-node="nodeDeploiement" ',
					'class="titre-matiere titre-ressource">',
					IE.estMobile
						? ""
						: '<div class="conteneur-chevron"><i class="' +
								(!estDeploye ? "icon_chevron_right" : "icon_chevron_down") +
								'"></i></div>',
					"<div>",
					GTraductions.getValeur(
						"CahierDeTexte.ContenuCours.RessourcesPedagogiques.QCMDEntrainement",
					),
					IE.estMobile ? "" : " (" + aListeRessPeda.count() + ")",
					"</div></div>",
				);
				lHtml.push(
					'<div class="conteneur-qcm" ',
					!estDeploye ? 'style="display:none"' : "",
					">",
					lHtmlListe.join(""),
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
	composeRPForumPedagogique(aListeRessPeda, estDeploye) {
		const lHtml = [];
		if (aListeRessPeda && aListeRessPeda.count()) {
			const lHtmlListe = [];
			aListeRessPeda.parcourir((D) => {
				lHtmlListe.push(
					tag(
						"div",
						{ class: "piece-jointe-ressource" },
						tag(
							"div",
							{ class: "chips-pj" },
							tag(
								"ie-chips",
								{
									style: `max-width:${IE.estMobile ? 200 : 300}px;`,
									"ie-model": tag.funcAttr("appelForumRessource", [
										D.ressource.getNumero(),
									]),
								},
								tag("i", {
									class: "icon_forum EspaceDroit AlignementMilieuVertical",
								}),
								D.ressource.getLibelle() ||
									GTraductions.getValeur("ForumPeda.SansTitre"),
							),
							D.date
								? tag(
										"span",
										{ class: "ie-titre-petit titre-date" },
										GTraductions.getValeur("ForumPeda.DernierPost") +
											" : " +
											GDate.formatDate(D.date, "[%JJJ %JJ %MMM]"),
									)
								: "",
						),
						D.ListeThemes && D.ListeThemes.count()
							? tag(
									"div",
									{ class: "pj-theme" },
									GTraductions.getValeur("Themes") +
										" : " +
										D.ListeThemes.getTableauLibelles().join(", "),
								)
							: "",
					),
				);
			});
			if (lHtmlListe.length) {
				lHtml.push(
					"<div ",
					IE.estMobile ? "" : 'ie-node="nodeDeploiement" ',
					'class="titre-matiere titre-ressource">',
					IE.estMobile
						? ""
						: '<div class="conteneur-chevron"><i class="' +
								(!estDeploye ? "icon_chevron_right" : "icon_chevron_down") +
								'"></i></div>',
					"<div>",
					GTraductions.getValeur(
						"CahierDeTexte.ContenuCours.RessourcesPedagogiques.MesForumsPedagogiques",
					),
					IE.estMobile ? "" : " (" + aListeRessPeda.count() + ")",
					"</div></div>",
				);
				lHtml.push(
					"<div ",
					!estDeploye ? 'style="display:none"' : "",
					">",
					lHtmlListe.join(""),
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
	composeRPRessourcesGranulaires(aListeRessPeda, estDeploye) {
		const lHtml = [];
		if (aListeRessPeda && aListeRessPeda.count()) {
			const lHtmlListe = [];
			aListeRessPeda.parcourir((D) => {
				let lStrDocumentDeposeLe = "",
					lHintDocumentDeposeLe = "";
				if (!!D.ressource && !!D.date) {
					lStrDocumentDeposeLe = GDate.formatDate(D.date, "[%JJJ %JJ %MMM]");
					lHintDocumentDeposeLe = GTraductions.getValeur(
						"CahierDeTexte.ContenuCours.RessourcesPedagogiques.DocumentDeposeLe",
						[GDate.formatDate(D.date, "%JJJ %JJ %MMM")],
					);
				}
				const lHtmlListeRessources = [];
				lHtmlListeRessources.push(
					'<div class="chips-pj">',
					EGenreRessourcePedagogiqueUtil.composerURL(
						D.getGenre(),
						D.ressource,
						D.ressource.getLibelle ? D.ressource.getLibelle() : D.ressource,
						false,
						IE.estMobile ? 200 : 300,
					),
					'<span title="',
					lHintDocumentDeposeLe,
					'" class="ie-titre-petit titre-date">',
					lStrDocumentDeposeLe,
					"</span>",
					"</div>",
				);
				lHtmlListe.push(
					'<div class="piece-jointe-ressource">',
					lHtmlListeRessources.join(""),
					"</div>",
				);
			});
			if (lHtmlListe.length) {
				lHtml.push(
					"<div ",
					IE.estMobile ? "" : 'ie-node="nodeDeploiement" ',
					'class="titre-matiere titre-ressource">',
					IE.estMobile
						? ""
						: '<div class="conteneur-chevron"><i class="' +
								(!estDeploye ? "icon_chevron_right" : "icon_chevron_down") +
								'"></i></div>',
					"<div>",
					GTraductions.getValeur(
						"CahierDeTexte.ContenuCours.RessourcesPedagogiques.RessourcesGranulaires",
					),
					IE.estMobile ? "" : " (" + aListeRessPeda.count() + ")",
					"</div></div>",
				);
				lHtml.push(
					"<div ",
					!estDeploye ? 'style="display:none"' : "",
					">",
					lHtmlListe.join(""),
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
	composeRPAutre(aListeRessPeda, estDeploye) {
		const lHtml = [];
		if (aListeRessPeda && aListeRessPeda.count()) {
			const lHtmlListe = [];
			aListeRessPeda.parcourir((D) => {
				let lStrDocumentDeposeLe = "",
					lHintDocumentDeposeLe = "";
				if (!!D.ressource && !!D.date) {
					lStrDocumentDeposeLe = GDate.formatDate(D.date, "[%JJJ %JJ %MMM]");
					lHintDocumentDeposeLe = GTraductions.getValeur(
						"CahierDeTexte.ContenuCours.RessourcesPedagogiques.DocumentDeposeLe",
						[GDate.formatDate(D.date, "%JJJ %JJ %MMM")],
					);
				}
				const lHtmlListeRessources = [];
				lHtmlListeRessources.push(
					'<div class="chips-pj">',
					EGenreRessourcePedagogiqueUtil.composerURL(
						D.getGenre(),
						D.ressource,
						D.ressource.getLibelle ? D.ressource.getLibelle() : D.ressource,
						false,
						IE.estMobile ? 200 : 300,
					),
					'<span title="',
					lHintDocumentDeposeLe,
					'" class="ie-titre-petit titre-date">',
					lStrDocumentDeposeLe,
					"</span>",
					"</div>",
				);
				lHtmlListe.push(
					'<div class="piece-jointe-ressource">',
					lHtmlListeRessources.join(""),
					D.ListeThemes && D.ListeThemes.count()
						? '<div class="pj-theme">' +
								GTraductions.getValeur("Themes") +
								" : " +
								D.ListeThemes.getTableauLibelles().join(", ") +
								"</div>"
						: "",
					"</div>",
				);
			});
			if (lHtmlListe.length) {
				lHtml.push(
					"<div ",
					IE.estMobile ? "" : 'ie-node="nodeDeploiement" ',
					'class="titre-matiere titre-ressource">',
					IE.estMobile
						? ""
						: '<div class="conteneur-chevron"><i class="' +
								(!estDeploye ? "icon_chevron_right" : "icon_chevron_down") +
								'"></i></div>',
					"<div>",
					GTraductions.getValeur(
						"CahierDeTexte.ContenuCours.RessourcesPedagogiques.AutresDocuments",
					),
					IE.estMobile ? "" : " (" + aListeRessPeda.count() + ")",
					"</div></div>",
				);
				lHtml.push(
					"<div ",
					!estDeploye ? 'style="display:none"' : "",
					">",
					lHtmlListe.join(""),
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
	composeMN(aListeManuelsNumeriques, aFiltreMatiere, estDeploye) {
		const lHtml = [];
		if (aListeManuelsNumeriques && aListeManuelsNumeriques.count()) {
			const lHtmlListe = [];
			let lCptManuels = 0;
			aListeManuelsNumeriques.parcourir((D) => {
				const lHtmlListeRessources = [];
				let lAccepteRessNum = false;
				if (
					!aFiltreMatiere &&
					(!D.listeMatieres || D.listeMatieres.count() === 0)
				) {
					lAccepteRessNum = true;
				} else if (
					!!aFiltreMatiere &&
					!!D.listeMatieres.getElementParNumero(aFiltreMatiere.getNumero())
				) {
					lAccepteRessNum = true;
				}
				if (lAccepteRessNum) {
					lHtmlListeRessources.push(
						'<div class="chips-pj">',
						GChaine.composerUrlLienExterne({
							documentJoint: D,
							title: D.description,
							libelleEcran: D.titre,
							libelle: "",
							maxWidth: IE.estMobile ? 200 : 300,
						}),
						"</div>",
					);
					lHtmlListe.push(
						'<div class="piece-jointe-ressource">',
						lHtmlListeRessources.join(""),
						"</div>",
					);
					lCptManuels++;
				}
			});
			if (lHtmlListe.length) {
				lHtml.push(
					"<div ",
					IE.estMobile ? "" : 'ie-node="nodeDeploiement" ',
					'class="titre-matiere titre-manuel">',
					IE.estMobile
						? ""
						: '<div class="conteneur-chevron"><i class="' +
								(!estDeploye ? "icon_chevron_right" : "icon_chevron_down") +
								'"></i></div>',
					"<div>",
					GTraductions.getValeur("CahierDeTexte.ConsulterLesManuelsNumeriques"),
					IE.estMobile ? "" : " (" + lCptManuels + ")",
					"</div></div>",
				);
				lHtml.push(
					"<div ",
					!estDeploye ? 'style="display:none"' : "",
					">",
					lHtmlListe.join(""),
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
}
function _composeIEModelChipsOuvrirFenetreCorrectionTAF(aTaf, aControleur) {
	const H = [];
	if (!!aTaf && (!!aTaf.documentCorrige || !!aTaf.commentaireCorrige)) {
		if (!aControleur) {
			return "";
		}
		if (!aControleur.chipsOuvrirFenetreCorrectionTAF) {
			aControleur.chipsOuvrirFenetreCorrectionTAF = {
				event: function () {
					if (!!aTaf) {
						const lFenetreCorrectionTaf = ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_CorrectionTaf,
							{ pere: this },
						);
						lFenetreCorrectionTaf.setTAF(aTaf);
						lFenetreCorrectionTaf.afficher();
					}
				},
			};
		}
		H.push(GHtml.composeAttr("ie-model", "chipsOuvrirFenetreCorrectionTAF"));
	}
	return H.join("");
}
module.exports = { UtilitaireContenuDeCours };
