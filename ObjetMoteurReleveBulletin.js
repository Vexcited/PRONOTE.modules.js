const { GTraductions } = require("ObjetTraduction.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GChaine } = require("ObjetChaine.js");
const {
	EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { TypeGenreAppreciation } = require("TypeGenreAppreciation.js");
const { ObjetElement } = require("ObjetElement.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { ObjetMoteurPiedDeBulletin } = require("ObjetMoteurPiedDeBulletin.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { GDate } = require("ObjetDate.js");
const { Requetes } = require("CollectionRequetes.js");
const {
	ObjetRequeteSaisie,
	EGenreReponseSaisie,
} = require("ObjetRequeteJSON.js");
const { ObjetMoteurGrilleSaisie } = require("ObjetMoteurGrilleSaisie.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const {
	DonneesListe_BarreNiveauxDAcquisitionsDePilier,
} = require("DonneesListe_BarreNiveauxDAcquisitionsDePilier.js");
const { TypeModeValidationAuto } = require("TypeModeValidationAuto.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { EGenreEvolutionUtil } = require("Enumere_Evolution.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { DonneesListe_Simple } = require("DonneesListe_Simple.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { tag } = require("tag.js");
const { TypePositionnementUtil } = require("TypePositionnement.js");
const ObjetRequeteSaisieAccuseReceptionDocument = require("ObjetRequeteSaisieAccuseReceptionDocument.js");
Requetes.inscrire("SaisieAppreciation", ObjetRequeteSaisie);
Requetes.inscrire("SaisieNoteLSU", ObjetRequeteSaisie);
Requetes.inscrire("SaisieECTS", ObjetRequeteSaisie);
Requetes.inscrire("SaisiePositionnement", ObjetRequeteSaisie);
Requetes.inscrire("SaisieEvolution", ObjetRequeteSaisie);
Requetes.inscrire("SaisieNotePropDelib", ObjetRequeteSaisie);
Requetes.inscrire("SaisieEltsPgme", ObjetRequeteSaisie);
Requetes.inscrire("SaisieAvisProfesseur", ObjetRequeteSaisie);
Requetes.inscrire("SaisieAvisProfesseurParcoursup", ObjetRequeteSaisie);
Requetes.inscrire("SaisieParamSynchroAppClasse", ObjetRequeteSaisie);
Requetes.inscrire("SaisieMoyNR", ObjetRequeteSaisie);
class ObjetMoteurReleveBulletin {
	constructor() {
		this.moteurPdB = new ObjetMoteurPiedDeBulletin();
		this.moteurGrille = new ObjetMoteurGrilleSaisie();
	}
	getGenreImpression(aParam) {
		if (
			!GApplication.droits.get(
				TypeDroits.autoriserImpressionBulletinReleveBrevet,
			)
		) {
			return EGenreImpression.Aucune;
		}
		if (aParam.estCtxApprGenerale === true) {
			return EGenreImpression.GenerationPDF;
		} else {
			switch (aParam.typeReleveBulletin) {
				case TypeReleveBulletin.ReleveDeNotes:
				case TypeReleveBulletin.BulletinNotes:
				case TypeReleveBulletin.AppreciationsBulletinProfesseur:
				case TypeReleveBulletin.AppreciationsReleveProfesseur:
				case TypeReleveBulletin.AvisProfesseur:
					return EGenreImpression.GenerationPDF;
				case TypeReleveBulletin.AvisParcoursup:
					return EGenreImpression.Aucune;
				default:
					return EGenreImpression.Format;
			}
		}
	}
	getGenreGenerationPdf(aParam) {
		if (aParam.estCtxApprGenerale === true) {
			return TypeHttpGenerationPDFSco.AppreciationsGenerales;
		} else {
			switch (aParam.typeReleveBulletin) {
				case TypeReleveBulletin.BulletinNotes:
					return TypeHttpGenerationPDFSco.Bulletin;
				case TypeReleveBulletin.AppreciationsBulletinProfesseur:
				case TypeReleveBulletin.AppreciationsReleveProfesseur:
				case TypeReleveBulletin.AvisProfesseur:
					return TypeHttpGenerationPDFSco.AppreciationsProf;
				default:
			}
		}
	}
	_getListeDonneesLineaire(aListeElements, aParam) {
		let lService,
			lSousService,
			lCmpActifs,
			lIndicePremier,
			lIndiceDernier,
			lIndicePremierActif,
			lIndiceDernierActif,
			J,
			I,
			lNbr;
		const lListe = new ObjetListeElements();
		let lNbrMaxTotDevoirs = 0;
		for (I = 0, lNbr = aListeElements.count(); I < lNbr; I++) {
			lService = aListeElements.get(I);
			lService.estService = !(
				lService.estSousService || lService.estSurMatiere
			);
			lService.nbSousServicesTotal = !!lService.ListeElements
				? lService.ListeElements.count()
				: 0;
			lService.regroupement =
				lService.regroupement === 0 ? 0 : lService.SurMatiere.getNumero();
			lService.avecAppreciationParSousService =
				aParam.typeReleveBulletin === TypeReleveBulletin.ReleveDeNotes
					? aParam.affichage.AvecAppreciationParSousService
					: lService.AvecAppreciationParSousService;
			if (
				lService.nbSousServicesTotal > 0 ||
				aParam.typeReleveBulletin === TypeReleveBulletin.BulletinNotes
			) {
				lCmpActifs = 0;
				lIndicePremier = null;
				lIndiceDernier = 0;
				lIndicePremierActif = null;
				lIndiceDernierActif = 0;
				for (J = 0; J < lService.nbSousServicesTotal; J++) {
					if (lIndicePremier === null || lIndicePremier === undefined) {
						lIndicePremier = J;
					}
					if (lService.ListeElements.get(J).Actif) {
						if (
							lIndicePremierActif === null ||
							lIndicePremierActif === undefined
						) {
							lIndicePremierActif = J;
						}
						lCmpActifs++;
						lIndiceDernierActif = J;
					}
					lIndiceDernier = J;
				}
				lService.nbSousServicesActifs = lCmpActifs;
				if (aParam.typeReleveBulletin === TypeReleveBulletin.BulletinNotes) {
					lListe.addElement(lService);
				}
				for (J = 0; J < lService.nbSousServicesTotal; J++) {
					lSousService = lService.ListeElements.get(J);
					if (
						lSousService.ListeDevoirs &&
						lSousService.ListeDevoirs.count() > lNbrMaxTotDevoirs
					) {
						lNbrMaxTotDevoirs = lSousService.ListeDevoirs
							? lSousService.ListeDevoirs.count()
							: 0;
					}
					lSousService.estService = false;
					lSousService.estPremier = J === lIndicePremier;
					lSousService.estDernier = J === lIndiceDernier;
					lSousService.estPremierActif = J === lIndicePremierActif;
					lSousService.estDernierActif = J === lIndiceDernierActif;
					lSousService.regroupement = lService.regroupement;
					lSousService.avecAppreciationParSousService =
						lService.avecAppreciationParSousService;
					lSousService.service = lService;
					lListe.addElement(lSousService);
				}
			} else {
				if (
					lService.ListeDevoirs &&
					lService.ListeDevoirs.count() > lNbrMaxTotDevoirs
				) {
					lNbrMaxTotDevoirs = lService.ListeDevoirs
						? lService.ListeDevoirs.count()
						: 0;
				}
				lListe.addElement(lService);
			}
		}
		lListe.nbrMaxTotDevoirs = lNbrMaxTotDevoirs;
		return lListe;
	}
	getApprDeService(aParam) {
		switch (aParam.typeReleveBulletin) {
			case TypeReleveBulletin.ReleveDeNotes: {
				const lArticle = aParam.article;
				const lService =
					lArticle.estService || lArticle.avecAppreciationParSousService
						? lArticle
						: lArticle.service;
				if (lService) {
					const lAppr = lService.ListeAppreciations
						? lService.ListeAppreciations.get(0)
						: null;
					return { service: lService, appreciation: lAppr };
				}
			}
		}
		return { service: aParam.article, appreciation: null };
	}
	_formatterDonneesPourRegroupements(aDonnees, aTableauSurMatieres, aParam) {
		const lDonneesAcRegroup = new ObjetListeElements();
		lDonneesAcRegroup.nbrMaxTotDevoirs = aDonnees.nbrMaxTotDevoirs;
		let lRegroup = null;
		let lMatiereRegroup = null;
		aDonnees.parcourir((aService) => {
			if (
				aService.estSurMatiere ||
				(aService.estDebutRegroupement &&
					(aService.estService ||
						(aParam.typeReleveBulletin === TypeReleveBulletin.ReleveDeNotes &&
							aService.estPremier)))
			) {
				lMatiereRegroup = aService.SurMatiere;
				lRegroup = new ObjetElement(
					lMatiereRegroup.getLibelle(),
					lMatiereRegroup.getNumero(),
					lMatiereRegroup.getGenre(),
				);
				lRegroup.surMatiere = aTableauSurMatieres[aService.regroupement];
				lRegroup.estUnDeploiement = true;
				lRegroup.estDeploye = true;
				lDonneesAcRegroup.addElement(lRegroup);
				aService.estUnDeploiement = false;
				aService.pere = lRegroup;
				lDonneesAcRegroup.addElement(aService);
			} else {
				aService.estUnDeploiement = false;
				const lServicePere = aService.estService ? aService : aService.service;
				if (
					!!lServicePere &&
					(lServicePere.estDebutRegroupement || lServicePere.regroupement)
				) {
					aService.pere = lRegroup;
				} else {
					lRegroup = null;
				}
				lDonneesAcRegroup.addElement(aService);
			}
		});
		return lDonneesAcRegroup;
	}
	_getHintListeProfsDeServices(aParam) {
		let lEstChaineTropLongue = false;
		let lListeProfesseurs = [],
			lLibelle;
		const N =
			aParam.service && aParam.service.ListeProfesseurs
				? aParam.service.ListeProfesseurs.count()
				: 0;
		for (let I = 0; I < N; I++) {
			lLibelle = aParam.service.ListeProfesseurs.getLibelle(I);
			if (GChaine.estChaineTropLongue(lLibelle, 10, false, aParam.largeur)) {
				lEstChaineTropLongue = true;
			}
			lListeProfesseurs.push(lLibelle);
		}
		return N > aParam.nbMaxProfs || lEstChaineTropLongue
			? lListeProfesseurs.join("\n")
			: "";
	}
	composeHtmlService(aParam) {
		const H = [];
		const lService = aParam.service;
		const lHauteur =
			aParam.hauteur !== null && aParam.hauteur !== undefined
				? "height:" + aParam.hauteur + "px"
				: "";
		H.push('<div style="', lHauteur, '">');
		if (lService) {
			const lLibelleMatiere =
				!lService.Matiere || lService.Matiere.getLibelle() === ""
					? "&nbsp;"
					: lService.Matiere.getLibelle();
			H.push("<div ie-ellipsis>" + lLibelleMatiere + "</div>");
			if (lService.AvecLibelleEnseignantMatiereSurMemeLigne) {
				const lLibelles = !!lService.ListeProfesseurs
					? lService.ListeProfesseurs.getTableauLibelles().join(", ")
					: "";
				H.push(
					'<div ie-ellipsis title="' + lLibelles + '">' + lLibelles + "</div>",
				);
			} else {
				const N =
					lService && lService.ListeProfesseurs
						? lService.ListeProfesseurs.count()
						: 0;
				let i, lNbr;
				for (
					i = 0, lNbr = Math.min(N, aParam.nbrMaxProfesseurs);
					i < lNbr;
					i++
				) {
					const lProfesseur = !!lService.ListeProfesseurs
						? lService.ListeProfesseurs.get(i)
						: "";
					H.push("<div ie-ellipsis>" + lProfesseur.getLibelle() + "</div>");
				}
			}
		}
		H.push("</div>");
		return H.join("");
	}
	composeHtmlServiceAccessible(aParam) {
		const H = [];
		const lService = aParam.service;
		if (lService) {
			const lLibelleMatiere =
				!lService.Matiere || lService.Matiere.getLibelle() === ""
					? "&nbsp;"
					: "<strong>" + lService.Matiere.getLibelle() + "</strong>";
			const lLibelles = !!lService.ListeProfesseurs
				? lService.ListeProfesseurs.getTableauLibelles().join(", ")
				: "";
			H.push(lLibelleMatiere + (lLibelles !== "" ? " " + lLibelles : ""));
		}
		return H.join("");
	}
	composeHtmlEleve(aParam) {
		const lHeight = aParam.hauteur ? "height:" + aParam.hauteur + "px;" : "";
		return tag("div", { style: ["display:flex", lHeight] }, function () {
			const H = [];
			if (aParam.avecPhoto === true) {
				H.push(
					_composePhoto.call(this, {
						eleve: aParam.eleve,
						largeurPhoto: aParam.largeurPhoto,
					}),
				);
			}
			H.push(
				tag(
					"div",
					{
						class: [
							"InlineBlock",
							"AlignementHaut",
							"EspaceGauche",
							"EspaceHaut",
						],
					},
					aParam.eleve.getLibelle(),
				),
			);
			const lHintProjetAcc = !!aParam.strProjetAcc
				? aParam.strProjetAcc.replace(/\n/g, "<br/>")
				: "";
			const lAvecPiecesJointes = !!aParam.avecDocsProjetAcc;
			if (lHintProjetAcc.length > 0 || lAvecPiecesJointes) {
				const lParam = {
					style: ["margin-left:auto"],
					"ie-hint": lHintProjetAcc,
				};
				const lClass = ["AlignementMilieuVertical", "InlineBlock"];
				if (lAvecPiecesJointes) {
					lClass.push("AvecMain");
					$.extend(lParam, {
						"ie-node": tag.funcAttr("surClicPiecesJointesProjAcc", [
							aParam.eleve.getNumero(),
						]),
						tabindex: 0,
						role: "button",
						"aria-label": GTraductions.getValeur("FenetreDocumentsEleve.titre"),
					});
				}
				let lEstPAmedical =
					aParam.eleve.nbProjetsMedicaux !== null &&
					aParam.eleve.nbProjetsMedicaux !== undefined &&
					aParam.eleve.nbProjetsMedicaux > 0;
				let lEstMultiPA =
					aParam.eleve.nbProjet !== null &&
					aParam.eleve.nbProjet !== undefined &&
					aParam.eleve.nbProjet > 1;
				H.push(
					tag(
						"div",
						$.extend(lParam, { class: lClass }),
						tag("i", {
							class: [
								"icon_projet_accompagnement",
								lEstPAmedical
									? "mix-icon_rond i-green"
									: lEstMultiPA
										? "mix-icon_plus"
										: "",
								"Texte12",
							],
						}),
					),
				);
			}
			return H.join("");
		});
	}
	composeHtmlEvolution(aParam) {
		return EGenreEvolutionUtil.getImage(
			aParam.genreEvol ? aParam.genreEvol : 0,
		);
	}
	composeHtmlTitreCol(aParam) {
		const lHtml = [];
		lHtml.push(
			'<div class="flex-contain flex-center justify-center full-width">',
		);
		if (aParam.avecBtnImg === true) {
			lHtml.push(
				"<ie-btnimage ",
				aParam.titleBtnImg !== null && aParam.titleBtnImg !== undefined
					? 'title="' + aParam.titleBtnImg + '"'
					: "",
				' ie-model="',
				aParam.modelBtnImg,
				'"',
				' class="',
				aParam.classImg,
				'" style="width: 18px;"></ie-btnimage>',
			);
		} else if (aParam.avecBtnIcon === true) {
			lHtml.push(
				'<ie-btnicon ie-model="',
				aParam.modelBtnImg,
				'" class="',
				aParam.classImg,
				'"',
			);
			if (aParam.titleBtnImg) {
				lHtml.push(' title="', aParam.titleBtnImg, '"');
			}
			lHtml.push("></ie-btnicon>");
		} else if (aParam.avecIcon) {
			lHtml.push('<i class="', aParam.classImg, '"></i>');
		}
		lHtml.push(
			"<div ",
			aParam.ieTexteCol !== null && aParam.ieTexteCol !== undefined
				? 'ie-texte="' + aParam.ieTexteCol + '"'
				: "",
			' class="EspaceGauche">',
			aParam.titreCol,
			"</div>",
		);
		if (aParam.avecCombo === true) {
			lHtml.push('<ie-combo ie-model="', aParam.modelCombo, '"></ie-combo>');
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeBaretteEvaluations(aParam) {
		const H = [];
		if (aParam.modeChronologique) {
			H.push(
				TUtilitaireCompetences.composeJaugeChronologique({
					listeNiveaux: aParam.listeNiveauxChronologiques,
					hint: TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
						aParam.listeNiveauxChronologiques,
					),
				}),
			);
		} else {
			H.push(
				TUtilitaireCompetences.composeJaugeParNiveaux({
					listeNiveaux: aParam.listeNiveaux,
					hint: TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
						aParam.listeNiveaux,
					),
				}),
			);
		}
		return H.join("");
	}
	ouvrirFenetreDetailBarreNiveauxDAcquisition(aParam) {
		const lInstance = aParam.instance;
		GEtatUtilisateur.Navigation.fenetre_BarreNiveauxDAcquisitions_estAffiche =
			TUtilitaireCompetences.existeBarreNiveauxDAcquisitionsDePiliers(
				aParam.listePiliers,
			);
		if (
			GEtatUtilisateur.Navigation.fenetre_BarreNiveauxDAcquisitions_estAffiche
		) {
			lInstance.setOptionsFenetre({
				titre: getTitreFenetreBarreNiveauxDacquisitions(aParam),
			});
			lInstance.setDonnees(
				new DonneesListe_BarreNiveauxDAcquisitionsDePilier(
					aParam.listePiliers,
					{ afficheJaugesChronologiques: aParam.modeChronologique },
				),
			);
		} else {
			lInstance.fermer();
		}
	}
	composeHtmlPeriodePrec(aParam) {
		const H = [];
		if (aParam !== null && aParam !== undefined) {
			const lAvecMoy =
				aParam.moyEleve !== null &&
				aParam.moyEleve !== undefined &&
				aParam.moyEleve !== "";
			const lAvecNivAcq =
				aParam.niveauAcqu !== null &&
				aParam.niveauAcqu !== undefined &&
				aParam.niveauAcqu !== "";
			const lAvecMoyNR = aParam.estMoyNR === true;
			const lClassLigne = 'class="flex-contain flex-center m-bottom"';
			H.push("<div>");
			if (lAvecMoy || lAvecNivAcq || lAvecMoyNR) {
				H.push("<div ", lClassLigne, ">");
				if (lAvecMoyNR) {
					H.push('<div class="m-right-l">');
					H.push(this.composeHtmlMoyNR());
					H.push("</div>");
				}
				if (lAvecMoy) {
					H.push("<div>", aParam.moyEleve, "</div>");
				}
				if (lAvecNivAcq) {
					H.push(
						'<div class="m-left-auto">',
						this.composeHtmlNote({
							note: null,
							niveauDAcquisition: aParam.niveauAcqu,
							genrePositionnement:
								TypePositionnementUtil.getGenrePositionnementParDefaut(
									aParam.typePositionnementClasse,
								),
						}),
						"</div>",
					);
				}
				H.push("</div>");
			}
			const lAvecNbHeuresAbs =
				aParam.strHAbs !== null &&
				aParam.strHAbs !== undefined &&
				aParam.strHAbs !== "";
			const lAvecNbRetards =
				aParam.strNbRetards !== null &&
				aParam.strNbRetards !== undefined &&
				aParam.strNbRetards !== "";
			if (lAvecNbHeuresAbs || lAvecNbRetards) {
				H.push("<div ", lClassLigne, ">");
				if (lAvecNbHeuresAbs) {
					H.push("<div>", aParam.strHAbs, "</div>");
				}
				if (lAvecNbRetards) {
					H.push('<div class="m-left-auto">', aParam.strNbRetards, "</div>");
				}
				H.push("</div>");
			}
			const lAvecAppA =
				aParam.appA !== null &&
				aParam.appA !== undefined &&
				aParam.appA.getLibelle() !== "";
			const lAvecAppB =
				aParam.appB !== null &&
				aParam.appB !== undefined &&
				aParam.appB.getLibelle() !== "";
			const lAvecAppC =
				aParam.appC !== null &&
				aParam.appC !== undefined &&
				aParam.appC.getLibelle() !== "";
			const lAvecAppReleve =
				aParam.appReleve !== null &&
				aParam.appReleve !== undefined &&
				aParam.appReleve.getLibelle() !== "";
			const lAvecAvisProf =
				aParam.appAvisProfesseur !== null &&
				aParam.appAvisProfesseur !== undefined &&
				aParam.appAvisProfesseur.getLibelle() !== "";
			const lAvecMoyGle =
				aParam.appGle !== null &&
				aParam.appGle !== undefined &&
				aParam.appGle.getLibelle() !== "";
			if (lAvecAppA) {
				H.push("<div ", lClassLigne, ">", aParam.appA.getLibelle(), "</div>");
			}
			if (lAvecAppB) {
				H.push("<div ", lClassLigne, ">", aParam.appB.getLibelle(), "</div>");
			}
			if (lAvecAppC) {
				H.push("<div ", lClassLigne, ">", aParam.appC.getLibelle(), "</div>");
			}
			if (lAvecAppReleve) {
				H.push(
					"<div ",
					lClassLigne,
					">",
					aParam.appReleve.getLibelle(),
					"</div>",
				);
			}
			if (lAvecAvisProf) {
				H.push(
					"<div ",
					lClassLigne,
					">",
					aParam.appAvisProfesseur.getLibelle(),
					"</div>",
				);
			}
			if (lAvecMoyGle) {
				H.push("<div ", lClassLigne, ">", aParam.appGle.getLibelle(), "</div>");
			}
			H.push("</div>");
		}
		return H.join("");
	}
	composeStrPeriodePrec(aParam) {
		const H = [];
		if (aParam !== null && aParam !== undefined) {
			const lAvecMoy =
				aParam.moyEleve !== null &&
				aParam.moyEleve !== undefined &&
				aParam.moyEleve !== "";
			const lAvecNivAcq =
				aParam.niveauAcqu !== null &&
				aParam.niveauAcqu !== undefined &&
				aParam.niveauAcqu !== "";
			const lAvecMoyNR = aParam.estMoyNR === true;
			if (lAvecMoy || lAvecNivAcq || lAvecMoyNR) {
				if (lAvecMoyNR) {
					H.push(GTraductions.getValeur("Notes.Colonne.TitreMoyNR"));
				}
				if (lAvecMoy) {
					H.push(aParam.moyEleve);
				}
				if (lAvecNivAcq) {
					this.composeStrNote({
						note: null,
						niveauDAcquisition: aParam.niveauAcqu,
						genrePositionnement:
							TypePositionnementUtil.getGenrePositionnementParDefaut(
								aParam.typePositionnementClasse,
							),
					});
				}
			}
			const lAvecNbHeuresAbs =
				aParam.strHAbs !== null &&
				aParam.strHAbs !== undefined &&
				aParam.strHAbs !== "";
			const lAvecNbRetards =
				aParam.strNbRetards !== null &&
				aParam.strNbRetards !== undefined &&
				aParam.strNbRetards !== "";
			if (lAvecNbHeuresAbs || lAvecNbRetards) {
				if (lAvecNbHeuresAbs) {
					H.push(aParam.strHAbs);
				}
				if (lAvecNbRetards) {
					H.push(aParam.strNbRetards);
				}
			}
			const lAvecAppA =
				aParam.appA !== null &&
				aParam.appA !== undefined &&
				aParam.appA.getLibelle() !== "";
			const lAvecAppB =
				aParam.appB !== null &&
				aParam.appB !== undefined &&
				aParam.appB.getLibelle() !== "";
			const lAvecAppC =
				aParam.appC !== null &&
				aParam.appC !== undefined &&
				aParam.appC.getLibelle() !== "";
			const lAvecAppReleve =
				aParam.appReleve !== null &&
				aParam.appReleve !== undefined &&
				aParam.appReleve.getLibelle() !== "";
			const lAvecAvisProf =
				aParam.appAvisProfesseur !== null &&
				aParam.appAvisProfesseur !== undefined &&
				aParam.appAvisProfesseur.getLibelle() !== "";
			if (lAvecAppA) {
				H.push(aParam.appA.getLibelle());
			}
			if (lAvecAppB) {
				H.push(aParam.appB.getLibelle());
			}
			if (lAvecAppC) {
				H.push(aParam.appC.getLibelle());
			}
			if (lAvecAppReleve) {
				H.push(aParam.appReleve.getLibelle());
			}
			if (lAvecAvisProf) {
				H.push(aParam.appAvisProfesseur.getLibelle());
			}
		}
		return H.join(" - ");
	}
	getStrNote(aNote) {
		return aNote !== null && aNote !== false && aNote !== undefined
			? aNote.getNote !== null && aNote.getNote !== undefined
				? aNote.getNote()
				: aNote + ""
			: "";
	}
	composeHtmlNote(aParam) {
		let lValeur;
		const lStyles = [];
		const H = [];
		const lAvecPrefixe =
			aParam.avecPrefixe === undefined ? true : aParam.avecPrefixe;
		if (aParam.niveauDAcquisition && aParam.niveauDAcquisition.existeNumero()) {
			lStyles.push("text-align: center;");
			const lNiveauDAcquisition =
				GParametres.listeNiveauxDAcquisitions.getElementParNumero(
					aParam.niveauDAcquisition.getNumero(),
				);
			lValeur = EGenreNiveauDAcquisitionUtil.getImagePositionnement({
				niveauDAcquisition: lNiveauDAcquisition,
				genrePositionnement: aParam.genrePositionnement,
				avecPrefixe: lAvecPrefixe,
			});
		} else {
			lValeur = this.getStrNote(aParam.note);
		}
		if (aParam.estMoyNR === true) {
			H.push(this.composeHtmlMoyNR());
		}
		if (!(aParam.estMoyNR === true && aParam.avecMoyNRUniquement === true)) {
			H.push(
				'<div style="' +
					lStyles.join("") +
					'">' +
					GChaine.avecEspaceSiVide(lValeur) +
					"</div>",
			);
		}
		return H.join("");
	}
	composeStrNote(aParam) {
		let lValeur;
		const H = [];
		if (aParam.niveauDAcquisition && aParam.niveauDAcquisition.existeNumero()) {
			const lNiveauDAcquisition =
				GParametres.listeNiveauxDAcquisitions.getElementParNumero(
					aParam.niveauDAcquisition.getNumero(),
				);
			lValeur = EGenreNiveauDAcquisitionUtil.getImagePositionnement({
				niveauDAcquisition: lNiveauDAcquisition,
				genrePositionnement: aParam.genrePositionnement,
				avecPrefixe: true,
			});
		} else {
			lValeur = this.getStrNote(aParam.note);
		}
		if (aParam.estMoyNR === true) {
			H.push(GTraductions.getValeur("Notes.Colonne.TitreMoyNR"));
		}
		if (!(aParam.estMoyNR === true && aParam.avecMoyNRUniquement === true)) {
			H.push(GChaine.avecEspaceSiVide(lValeur));
		}
		return H.join("");
	}
	composeContenuListeElementProgramme(aListe, aAvecDetail) {
		const T = [],
			lNb = aListe.getNbrElementsExistes();
		if (aListe && lNb) {
			aListe.trier();
			if (lNb <= 10 || aAvecDetail) {
				T.push("<ul>");
				aListe.parcourir((aElement) => {
					if (aElement.existe()) {
						T.push("<li>", aElement.getLibelle(), "</li>");
					}
				});
				T.push("</ul>");
			} else if (lNb > 2) {
				T.push(
					GTraductions.getValeur("BulletinEtReleve.ElementsProgramme", [lNb]),
				);
			}
		}
		return T.join("");
	}
	composeHtmlElementProgramme(aParam) {
		const H = [];
		H.push(this.composeContenuListeElementProgramme(aParam.elements));
		return H.join("");
	}
	getHintElementProgramme(aParam) {
		const T = [];
		if (aParam.service) {
			T.push(
				this.composeContenuListeElementProgramme(
					aParam.service.ElementsProgrammeBulletin,
					true,
				),
			);
		}
		return T.join("");
	}
	getTypeGenreAppreciation(aParam) {
		let lTypeGenreAppreciation;
		if (aParam.estCtxApprGenerale === true) {
			lTypeGenreAppreciation =
				this.moteurPdB.getTypeGenreAppreciationPdB(aParam);
		} else {
			if (aParam.estCtxPied === true && aParam.estCtxApprGenerale !== false) {
				if (aParam.genreAppr === null || aParam.genreAppr === undefined) {
					$.extend(aParam, { genreAppr: aParam.appreciation.Genre });
				}
				lTypeGenreAppreciation =
					this.moteurPdB.getTypeGenreAppreciationPdB(aParam);
			} else {
				switch (aParam.typeReleveBulletin) {
					case TypeReleveBulletin.BulletinNotes:
					case TypeReleveBulletin.BulletinCompetences:
						lTypeGenreAppreciation =
							TypeGenreAppreciation.GA_Bulletin_Professeur;
						break;
					case TypeReleveBulletin.LivretScolaire:
						lTypeGenreAppreciation =
							TypeGenreAppreciation.GA_BilanAnnuel_Professeur;
						break;
					case TypeReleveBulletin.AppreciationsBulletinProfesseur:
						return TypeGenreAppreciation.GA_Bulletin_Professeur;
					case TypeReleveBulletin.AppreciationsBulletinParEleve:
						return TypeGenreAppreciation.GA_Bulletin_Professeur;
					case TypeReleveBulletin.AppreciationsReleveProfesseur:
					case TypeReleveBulletin.ReleveDeNotes:
						lTypeGenreAppreciation = TypeGenreAppreciation.GA_Releve_Professeur;
						break;
					case TypeReleveBulletin.AvisProfesseur:
						return TypeGenreAppreciation.GA_Bulletin_Professeur;
					case TypeReleveBulletin.AvisParcoursup:
						return TypeGenreAppreciation.GA_Bulletin_Professeur;
					default:
						lTypeGenreAppreciation =
							TypeGenreAppreciation.GA_Bulletin_Professeur;
						break;
				}
			}
		}
		return lTypeGenreAppreciation;
	}
	getTailleMaxAppreciation(aParam) {
		if (aParam.tailleMaxDonneesAffichage) {
			return aParam.tailleMaxDonneesAffichage;
		}
		if (
			aParam.estCtxPied &&
			aParam.appreciation !== null &&
			aParam.appreciation !== undefined
		) {
			$.extend(aParam, { genreAppr: aParam.appreciation.Genre });
		}
		const lTypeGenreAppreciation = this.getTypeGenreAppreciation(aParam);
		return GParametres.getTailleMaxAppreciationParEnumere(
			lTypeGenreAppreciation,
		);
	}
	initFenetreAvisReligion(aInstance) {
		const lParamsListe = { tailles: ["100%"], editable: false };
		aInstance.setOptionsFenetre({
			titre: GTraductions.getValeur("AvisReligion.titreSelection"),
			largeur: 300,
			hauteur: 350,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
			modeActivationBtnValider:
				aInstance.modeActivationBtnValider.toujoursActifs,
		});
		aInstance.paramsListe = lParamsListe;
	}
	composeHtmlDevoir(aParam) {
		const H = [];
		const lDevoir = aParam.devoir;
		if (lDevoir && lDevoir.Note) {
			const lBareme = _composeHtmlBareme.call(this, aParam);
			const lNote = _composeHtmlNote.call(this, aParam);
			const lNoteAuDessusBareme = () => {
				if (lDevoir.Note.getValeur() > lDevoir.Bareme.getValeur()) {
					return (
						'<i class="icon icon_star m-right"  aria-label="' +
						GTraductions.getValeur("accueil.noteAuDessusBareme") +
						'" title="' +
						GTraductions.getValeur("accueil.noteAuDessusBareme") +
						'"></i>'
					);
				}
				return "";
			};
			H.push('<div class="flex-contain cols m-all flex-end">');
			H.push(
				'<div class="flex-contain flex-center p-bottom">',
				lNoteAuDessusBareme(),
				lNote,
				lBareme,
				"</div>",
			);
			if (aParam.avecDevoirsCoefficient) {
				H.push(_composeHtmlCoeff.call(this, aParam));
			}
			if (aParam.avecDevoirsDate && lDevoir.Date) {
				H.push(_composeHtmlDate.call(this, aParam));
			}
			H.push("</div>");
		}
		return H.join("");
	}
	composeHtmlLienNoteCalculMoyenne(aParam) {
		const H = [];
		const lNote = aParam.note;
		const lAvecNote =
			lNote &&
			lNote.estUneNoteVide &&
			!lNote.estUneNoteVide() &&
			lNote.estUneValeur();
		H.push(
			'<span class="',
			lAvecNote
				? aParam.estUnDeploiement
					? "LienMoyenneRegroupement"
					: "LienMoyenne"
				: "",
			'" ',
			lAvecNote
				? GHtml.composeAttr("ie-node", "getNodeCalculMoy", [
						aParam.ligne,
						aParam.colonne,
						aParam.idColonne,
					])
				: "",
			">" + lNote.getNote() + "</span>",
		);
		return H.join("");
	}
	saisieParamSynchroAppClasse(aParam) {
		return Requetes("SaisieParamSynchroAppClasse", this)
			.lancerRequete(aParam.paramRequete)
			.then(
				(aParams) => {
					if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
						if (
							aParams.JSONRapportSaisie &&
							aParams.JSONRapportSaisie.appreciationClasse &&
							aParams.JSONRapportSaisie.service &&
							aParams.JSONRapportSaisie.periode
						) {
							const lParamClbck = {
								numeroPeriode: aParams.JSONRapportSaisie.periode.getNumero(),
								numeroService: aParams.JSONRapportSaisie.service.getNumero(),
								apprSaisie: aParams.JSONRapportSaisie.appreciationClasse,
							};
							aParam.clbckSucces(lParamClbck);
						}
					}
					return aParams;
				},
				(aParams) => {
					return aParams;
				},
			);
	}
	controleCtxAppSaisie(aParam, aParamSucces) {
		if (
			aParam.service.getNumero() !== aParamSucces.numeroService ||
			aParam.periode.getNumero() !== aParamSucces.numeroPeriode
		) {
			return false;
		}
		return true;
	}
	updateAppClasseSurRetourSaisie(aAppClasse, aParamSucces) {
		const lApprSaisie = aParamSucces.apprSaisie;
		aAppClasse.setNumero(lApprSaisie.getNumero());
		aAppClasse.appreciation = lApprSaisie.appreciation
			? lApprSaisie.appreciation
			: lApprSaisie.getLibelle();
		if (lApprSaisie.editable !== null && lApprSaisie.editable !== undefined) {
			aAppClasse.editable = lApprSaisie.editable;
		}
		aAppClasse.setLibelle(lApprSaisie.getLibelle());
		aAppClasse.setEtat(EGenreEtat.Aucun);
		const lEstSynchro = lApprSaisie.estSynchronisee;
		aAppClasse.estSynchronisee = lEstSynchro;
		if (!lEstSynchro) {
			aAppClasse.apprsIdentiques = lApprSaisie.apprsIdentiques;
		}
	}
	saisieAppreciation(aParam) {
		const lListe = aParam.instanceListe;
		return Requetes("SaisieAppreciation", this)
			.lancerRequete(aParam.paramRequete)
			.then(
				(aParams) => {
					if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
						if (
							aParams.JSONRapportSaisie &&
							aParams.JSONRapportSaisie.appreciation &&
							aParams.JSONRapportSaisie.service &&
							aParams.JSONRapportSaisie.periode
						) {
							const lParamClbck = {
								numeroPeriode: aParams.JSONRapportSaisie.periode.getNumero(),
								numeroService: aParams.JSONRapportSaisie.service.getNumero(),
								numeroEleve: aParams.JSONRapportSaisie.eleve
									? aParams.JSONRapportSaisie.eleve.getNumero()
									: 0,
								rangAppr: aParams.JSONRapportSaisie.appreciation.getGenre(),
								apprSaisie: aParams.JSONRapportSaisie.appreciation,
							};
							aParam.clbckSucces(lParamClbck);
						}
					}
					return aParams;
				},
				(aParams) => {
					return aParams;
				},
			)
			.then((aParams) => {
				if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
					if (lListe !== null && lListe !== undefined) {
						lListe.actualiser(true);
						if (aParam.paramCellSuivante) {
							this.moteurGrille.selectionCelluleSuivante({
								instanceListe: lListe,
								suivante: aParam.paramCellSuivante,
							});
						}
					}
				} else {
					aParam.clbckEchec(aParams.promiseMessage);
				}
			});
	}
	saisieAR(aParam) {
		new ObjetRequeteSaisieAccuseReceptionDocument(this).lancerRequete({
			periode: aParam.periode,
		});
	}
	majAppreciationService(aParam) {
		const lService = aParam.service;
		if (lService !== null) {
			const lIndiceCol = lService.ListeAppreciations.getIndiceElementParFiltre(
				(aElt) => {
					return aElt.getGenre() === aParam.rangAppr;
				},
			);
			lService.ListeAppreciations.addElement(aParam.apprSaisie, lIndiceCol);
		} else {
		}
	}
	saisieMoyPropDelib(aParam) {
		const lListe = aParam.instanceListe;
		return Requetes("SaisieNotePropDelib", this)
			.lancerRequete(aParam.paramRequete)
			.then(
				(aParams) => {
					if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
						if (
							aParams.JSONRapportSaisie &&
							aParams.JSONRapportSaisie.estProposee !== null &&
							aParams.JSONRapportSaisie.estProposee !== undefined &&
							aParams.JSONRapportSaisie.estAvisReligion !== null &&
							aParams.JSONRapportSaisie.estAvisReligion !== undefined &&
							aParams.JSONRapportSaisie.service &&
							aParams.JSONRapportSaisie.eleve
						) {
							const lParamClbck = {
								numeroService: aParams.JSONRapportSaisie.service.getNumero(),
								numeroEleve: aParams.JSONRapportSaisie.eleve.getNumero(),
								estProposee: aParams.JSONRapportSaisie.estProposee,
								estAvisReligion: aParams.JSONRapportSaisie.estAvisReligion,
							};
							if (aParams.JSONRapportSaisie.estProposee === true) {
								if (aParams.JSONRapportSaisie.estAvisReligion === true) {
									$.extend(lParamClbck, {
										avisReligionPropose:
											aParams.JSONRapportSaisie.avisReligionPropose,
									});
								} else {
									$.extend(lParamClbck, {
										moyenneProposee: aParams.JSONRapportSaisie.moyenneProposee,
									});
								}
							} else {
								if (aParams.JSONRapportSaisie.estAvisReligion === true) {
									$.extend(lParamClbck, {
										avisReligionDelibere:
											aParams.JSONRapportSaisie.avisReligionDelibere,
									});
								} else {
									$.extend(lParamClbck, {
										moyenneDeliberee:
											aParams.JSONRapportSaisie.moyenneDeliberee,
									});
								}
							}
							aParam.clbckSucces(lParamClbck);
						}
					}
					return aParams;
				},
				(aParams) => {
					return aParams;
				},
			)
			.then((aParams) => {
				if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
					lListe.actualiser(true);
					this.moteurGrille.selectionCelluleSuivante({
						instanceListe: lListe,
						suivante: aParam.paramCellSuivante,
					});
				} else {
					aParam.clbckEchec(aParams.promiseMessage);
				}
			});
	}
	saisieEltsPgme(aParam) {
		const lListe = aParam.instanceListe;
		return Requetes("SaisieEltsPgme", this)
			.lancerRequete(aParam.paramRequete)
			.then(
				(aParams) => {
					if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
						if (
							aParams.JSONRapportSaisie &&
							aParams.JSONRapportSaisie.service &&
							aParams.JSONRapportSaisie.listeEltsPgme
						) {
							aParams.JSONRapportSaisie.listeEltsPgme.trier();
							const lParamClbck = {
								numeroService: aParams.JSONRapportSaisie.service.getNumero(),
								listeEltsPgme: aParams.JSONRapportSaisie.listeEltsPgme,
							};
							aParam.clbckSucces(lParamClbck);
						}
					}
					return aParams;
				},
				(aParams) => {
					return aParams;
				},
			)
			.then((aParams) => {
				if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
					if (lListe !== null && lListe !== undefined) {
						lListe.actualiser(true);
						this.moteurGrille.selectionCelluleSuivante({
							instanceListe: lListe,
							suivante: aParam.paramCellSuivante,
						});
					}
				} else {
					aParam.clbckEchec(aParams.promiseMessage);
				}
			});
	}
	saisieNoteLSU(aParam) {
		const lListe = aParam.instanceListe;
		return Requetes("SaisieNoteLSU", this)
			.lancerRequete(aParam.paramRequete)
			.then(
				(aParams) => {
					if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
						if (
							aParams.JSONRapportSaisie &&
							aParams.JSONRapportSaisie.posLSUNote &&
							aParams.JSONRapportSaisie.service &&
							aParams.JSONRapportSaisie.eleve
						) {
							const lParamClbck = {
								numeroService: aParams.JSONRapportSaisie.service.getNumero(),
								numeroEleve: aParams.JSONRapportSaisie.eleve.getNumero(),
								noteLSUSaisie: aParams.JSONRapportSaisie.posLSUNote,
							};
							aParam.clbckSucces(lParamClbck);
						}
					}
					return aParams;
				},
				(aParams) => {
					return aParams;
				},
			)
			.then((aParams) => {
				if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
					lListe.actualiser(true);
					this.moteurGrille.selectionCelluleSuivante({
						instanceListe: lListe,
						suivante: aParam.paramCellSuivante,
					});
				} else {
					aParam.clbckEchec(aParams.promiseMessage);
				}
			});
	}
	saisieAvisProfesseur(aParam) {
		const lListe = aParam.instanceListe;
		return Requetes("SaisieAvisProfesseur", this)
			.lancerRequete(aParam.paramRequete)
			.then(
				(aParams) => {
					if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
						if (
							aParams.JSONRapportSaisie &&
							aParams.JSONRapportSaisie.appAvisProfesseur &&
							aParams.JSONRapportSaisie.service &&
							aParams.JSONRapportSaisie.eleve
						) {
							const lParamClbck = {
								numeroService: aParams.JSONRapportSaisie.service.getNumero(),
								numeroEleve: aParams.JSONRapportSaisie.eleve.getNumero(),
								appAvisProfesseur: aParams.JSONRapportSaisie.appAvisProfesseur,
							};
							aParam.clbckSucces(lParamClbck);
						}
					}
					return aParams;
				},
				(aParams) => {
					return aParams;
				},
			)
			.then((aParams) => {
				if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
					lListe.actualiser(true);
					this.moteurGrille.selectionCelluleSuivante({
						instanceListe: lListe,
						suivante: aParam.paramCellSuivante,
					});
				} else {
					aParam.clbckEchec(aParams.promiseMessage);
				}
			});
	}
	saisieAvisProfesseurParcoursup(aParam) {
		const lListe = aParam.instanceListe;
		return Requetes("SaisieAvisProfesseurParcoursup", this)
			.lancerRequete(aParam.paramRequete)
			.then(
				(aParams) => {
					if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
						if (
							aParams.JSONRapportSaisie &&
							aParams.JSONRapportSaisie.appAvisProfParcoursup &&
							aParams.JSONRapportSaisie.service &&
							aParams.JSONRapportSaisie.eleve
						) {
							const lParamClbck = {
								numeroService: aParams.JSONRapportSaisie.service.getNumero(),
								numeroEleve: aParams.JSONRapportSaisie.eleve.getNumero(),
								appAvisProfParcoursup:
									aParams.JSONRapportSaisie.appAvisProfParcoursup,
							};
							aParam.clbckSucces(lParamClbck);
						}
					}
					return aParams;
				},
				(aParams) => {
					return aParams;
				},
			)
			.then((aParams) => {
				if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
					lListe.actualiser(true);
					this.moteurGrille.selectionCelluleSuivante({
						instanceListe: lListe,
						suivante: aParam.paramCellSuivante,
					});
				} else {
					aParam.clbckEchec(aParams.promiseMessage);
				}
			});
	}
	saisieECTS(aParam) {
		const lListe = aParam.instanceListe;
		const lEstCalculAuto = aParam.paramRequete.estCalculAuto === true;
		if (lEstCalculAuto) {
			const lParamRequete = aParam.paramRequete;
			lParamRequete.listeEleves =
				lParamRequete.listeEleves.setSerialisateurJSON({
					ignorerEtatsElements: true,
					methodeSerialisation: function (aEleve, AJSON) {
						AJSON.classe = aEleve.classe;
						AJSON.service = aEleve.service;
					},
				});
			return Requetes("SaisieECTS", this)
				.lancerRequete(lParamRequete)
				.then((aParams) => {
					if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
						aParam.clbckSucces();
					}
				});
		} else {
			return Requetes("SaisieECTS", this)
				.lancerRequete(aParam.paramRequete)
				.then(
					(aParams) => {
						if (
							aParams &&
							aParams.genreReponse === EGenreReponseSaisie.succes
						) {
							if (
								aParams.JSONRapportSaisie &&
								aParams.JSONRapportSaisie.ECTS !== null &&
								aParams.JSONRapportSaisie.ECTS !== undefined &&
								aParams.JSONRapportSaisie.service &&
								aParams.JSONRapportSaisie.eleve
							) {
								const lParamClbck = {
									numeroService: aParams.JSONRapportSaisie.service.getNumero(),
									numeroEleve: aParams.JSONRapportSaisie.eleve.getNumero(),
									ECTSSaisie: aParams.JSONRapportSaisie.ECTS,
								};
								aParam.clbckSucces(lParamClbck);
							}
						}
						return aParams;
					},
					(aParams) => {
						return aParams;
					},
				)
				.then((aParams) => {
					if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
						lListe.actualiser(true);
						this.moteurGrille.selectionCelluleSuivante({
							instanceListe: lListe,
							suivante: aParam.paramCellSuivante,
						});
					} else {
						aParam.clbckEchec(aParams.promiseMessage);
					}
				});
		}
	}
	surBoutonCalculAuto(aParam) {
		const lListeEleves = aParam.listeEleves;
		if (lListeEleves.count() > 0) {
			let lTitreFenetre = "";
			if (
				aParam.modeCalculAuto ===
				TypeModeValidationAuto.tmva_PosAvecNoteSelonEvaluation
			) {
				lTitreFenetre = GTraductions.getValeur(
					"competences.fenetreValidationAutoPositionnement.titreNoteLSUSelonEvaluations",
				);
			}
			let lMessageFenetre = "";
			if (
				aParam.modeCalculAuto ===
				TypeModeValidationAuto.tmva_PosSansNoteSelonDevoir
			) {
				lMessageFenetre = aParam.messageValidationAutoPositionnementSelonDevoir;
			} else if (
				aParam.modeCalculAuto ===
				TypeModeValidationAuto.tmva_PosAvecNoteSelonEvaluation
			) {
				lMessageFenetre = GTraductions.getValeur(
					"competences.fenetreValidationAutoPositionnement.messageNoteLSUSelonEvaluations",
				);
			}
			let lMrFiche;
			if (
				aParam.modeCalculAuto ===
				TypeModeValidationAuto.tmva_PosAvecNoteSelonEvaluation
			) {
				lMrFiche = GTraductions.getValeur(
					"BulletinEtReleve.MFichePostionnementCalculeNoteLSU",
				);
			}
			const lParamValidationAutoPositionnement = {
				instance: aParam.instance,
				listeEleves: lListeEleves,
				modeValidationAuto: aParam.modeCalculAuto,
				titre: lTitreFenetre,
				message: lMessageFenetre,
				mrFiche: lMrFiche,
				callback: function () {
					aParam.clbckCalculAuto.call(aParam.instance);
				},
			};
			TUtilitaireCompetences.surBoutonValidationAutoPositionnement(
				lParamValidationAutoPositionnement,
			);
		}
	}
	surBoutonCalculAutoECTS(aParam) {
		const lModeCalculECTS =
			aParam.seuilECTS !== null &&
			aParam.seuilECTS !== undefined &&
			aParam.seuilECTS.getValeur() > 0
				? GTraductions.getValeur("BulletinEtReleve.ECTSParSeuil")
				: GTraductions.getValeur("BulletinEtReleve.ECTSParRatio");
		GApplication.getMessage()
			.afficher({
				type: EGenreBoiteMessage.Confirmation,
				titre: GTraductions.getValeur("BulletinEtReleve.affectationECTS"),
				message: GChaine.format(
					GTraductions.getValeur("BulletinEtReleve.msgAffectationECTS"),
					[GChaine.doubleToStr(aParam.nbrECTSService), lModeCalculECTS],
				),
			})
			.then((aGenreAction) => {
				if (aGenreAction === EGenreAction.Valider) {
					this.saisieECTS({
						paramRequete: {
							estCalculAuto: true,
							periode: aParam.periode,
							listeEleves: aParam.listeEleves,
						},
						instanceListe: aParam.instanceListe,
						clbckSucces: function () {
							aParam.clbckCalculAuto.call(aParam.instance);
						}.bind(this),
						clbckEchec: function () {}.bind(this),
					});
				}
			});
	}
	remplirMenuContextuelPositionnement(aInstanceMenuContextuel, aParam) {
		TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourMenu({
			genreChoixValidationCompetence: aParam.genreChoixValidationCompetence,
			genrePositionnement: aParam.genrePositionnement,
			avecSelecteurNiveauCalcule: aParam.avecSelecteurNiveauCalcule,
			avecDispense: true,
			avecLibelleRaccourci: !!aParam.avecLibelleRaccourci,
		}).parcourir((aElement) => {
			aInstanceMenuContextuel.add(
				aElement.tableauLibelles || aElement.getLibelle(),
				aElement.actif,
				() => {
					aParam.clbackMenuPositionnement(aElement);
				},
				{
					image: aElement.image,
					imageFormate: true,
					largeurImage: aElement.largeurImage,
				},
			);
		});
	}
	ouvrirMenuPositionnement(aParam) {
		const lThis = this;
		ObjetMenuContextuel.afficher({
			id: aParam.id,
			pere: aParam.instance,
			initCommandes(aInstance) {
				lThis.remplirMenuContextuelPositionnement(aInstance, aParam);
			},
		});
	}
	saisiePositionnement(aParam) {
		const lListe = aParam.instanceListe;
		return Requetes("SaisiePositionnement", this)
			.lancerRequete(aParam.paramRequete)
			.then(
				(aParams) => {
					if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
						if (aParams.JSONRapportSaisie) {
							const lParamClbck = {};
							if (aParams.JSONRapportSaisie.service) {
								lParamClbck.numeroService =
									aParams.JSONRapportSaisie.service.getNumero();
							}
							if (aParams.JSONRapportSaisie.eleve) {
								lParamClbck.numeroEleve =
									aParams.JSONRapportSaisie.eleve.getNumero();
							}
							lParamClbck.niveauAcquSaisi =
								aParams.JSONRapportSaisie.niveauAcqu !== null &&
								aParams.JSONRapportSaisie.niveauAcqu !== undefined
									? aParams.JSONRapportSaisie.niveauAcqu
									: null;
							lParamClbck.numeroEltCompetence =
								aParams.JSONRapportSaisie.eltCompetence !== null &&
								aParams.JSONRapportSaisie.eltCompetence !== undefined
									? aParams.JSONRapportSaisie.eltCompetence.getNumero()
									: null;
							lParamClbck.numeroPilier =
								aParams.JSONRapportSaisie.pilier !== null &&
								aParams.JSONRapportSaisie.pilier !== undefined
									? aParams.JSONRapportSaisie.pilier.getNumero()
									: null;
							lParamClbck.numeroPalier =
								aParams.JSONRapportSaisie.palier !== null &&
								aParams.JSONRapportSaisie.palier !== undefined
									? aParams.JSONRapportSaisie.palier.getNumero()
									: null;
							aParam.clbckSucces(lParamClbck);
						}
					}
					return aParams;
				},
				(aParams) => {
					return aParams;
				},
			)
			.then((aParams) => {
				if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
					lListe.actualiser(true);
					if (
						aParam.paramCellSuivante !== null &&
						aParam.paramCellSuivante !== undefined
					) {
						this.moteurGrille.selectionCelluleSuivante({
							instanceListe: lListe,
							suivante: aParam.paramCellSuivante,
						});
					}
				} else {
					aParam.clbckEchec(aParams.promiseMessage);
				}
			});
	}
	ouvrirMenuEvolution(aParam) {
		ObjetMenuContextuel.afficher({
			id: aParam.id,
			pere: aParam.instance,
			initCommandes: function (aInstance) {
				EGenreEvolutionUtil.getListePourMenu().parcourir((aElement) => {
					aInstance.add(
						aElement.tableauLibelles || aElement.getLibelle(),
						aElement.actif,
						() => {
							aParam.clbackMenuEvolution(aElement);
						},
						{
							image: aElement.image,
							imageFormate: true,
							largeurImage: aElement.largeurImage,
						},
					);
				});
			},
		});
	}
	composeHtmlMoyNR() {
		const H = [];
		H.push(
			tag(
				"div",
				{
					class: "notation_pastille_moy_NR",
					"ie-hint": GTraductions.getValeur("Notes.Colonne.HintMoyenneNR"),
				},
				GTraductions.getValeur("Notes.Colonne.TitreMoyNR"),
			),
		);
		return H.join("");
	}
	saisieMoyNR(aParam) {
		const lListe = aParam.instanceListe;
		return Requetes("SaisieMoyNR", this)
			.lancerRequete(aParam.paramRequete)
			.then(
				(aParams) => {
					if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
						if (aParams.JSONRapportSaisie && aParams.JSONRapportSaisie.eleve) {
							const lParamClbck = {
								numeroEleve: aParams.JSONRapportSaisie.eleve.getNumero(),
								estMoyNRSaisie:
									aParams.JSONRapportSaisie.estMoyNR !== null &&
									aParams.JSONRapportSaisie.estMoyNR !== undefined
										? aParams.JSONRapportSaisie.estMoyNR
										: null,
								estMoyAnnuelleNR:
									aParams.JSONRapportSaisie.estMoyAnnuelleNR !== null &&
									aParams.JSONRapportSaisie.estMoyAnnuelleNR !== undefined
										? aParams.JSONRapportSaisie.estMoyAnnuelleNR
										: null,
							};
							aParam.clbckSucces(lParamClbck);
						}
					}
					return aParams;
				},
				(aParams) => {
					return aParams;
				},
			)
			.then((aParams) => {
				if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
					lListe.actualiser(true);
				} else {
					aParam.clbckEchec(aParams.promiseMessage);
				}
			});
	}
	saisieEvolution(aParam) {
		const lListe = aParam.instanceListe;
		return Requetes("SaisieEvolution", this)
			.lancerRequete(aParam.paramRequete)
			.then(
				(aParams) => {
					if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
						if (
							aParams.JSONRapportSaisie &&
							aParams.JSONRapportSaisie.service &&
							aParams.JSONRapportSaisie.eleve
						) {
							const lParamClbck = {
								numeroService: aParams.JSONRapportSaisie.service.getNumero(),
								numeroEleve: aParams.JSONRapportSaisie.eleve.getNumero(),
								evolutionSaisie:
									aParams.JSONRapportSaisie.evolution !== null &&
									aParams.JSONRapportSaisie.evolution !== undefined
										? aParams.JSONRapportSaisie.evolution
										: null,
							};
							aParam.clbckSucces(lParamClbck);
						}
					}
					return aParams;
				},
				(aParams) => {
					return aParams;
				},
			)
			.then((aParams) => {
				if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
					lListe.actualiser(true);
					this.moteurGrille.selectionCelluleSuivante({
						instanceListe: lListe,
						suivante: aParam.paramCellSuivante,
					});
				} else {
					aParam.clbckEchec(aParams.promiseMessage);
				}
			});
	}
	surEditionAvisReligion(aContexte) {
		const lDonneesListe = new DonneesListe_Simple(aContexte.listeAvis, {
			avecTri: false,
		}).setOptions({ avecEvnt_SelectionClick: true, avecEvnt_Selection: false });
		lDonneesListe.getValeur = function (aParams) {
			if (aParams.colonne === 0) {
				return aParams.article.description !== null &&
					aParams.article.description !== undefined
					? aParams.article.getLibelle() !== ""
						? aParams.article.getLibelle() +
							" (" +
							aParams.article.description +
							")"
						: aParams.article.description
					: aParams.article.getLibelle();
			}
			return aParams.article.getLibelle();
		};
		ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Liste, {
			pere: this,
			evenement: function (aContexte, aNumeroBouton, aIndiceSelection) {
				switch (aNumeroBouton) {
					case 1: {
						const lEltSelection = aContexte.listeAvis.get(aIndiceSelection);
						if (
							lEltSelection &&
							lEltSelection.getNumero() !== aContexte.avisReligion.getNumero()
						) {
							aContexte.surValiderEditionDonnee({
								article: aContexte.article,
								idColonne: aContexte.idColonne,
								selection: lEltSelection,
								ctxAvisReligion: true,
								navigation: { suivante: { orientationVerticale: true } },
							});
						}
						break;
					}
				}
			}.bind(this, aContexte),
			initialiser: this.initFenetreAvisReligion,
		}).setDonnees(lDonneesListe, true);
	}
	strClassement(aClassement) {
		if (aClassement !== null && aClassement !== undefined) {
			if (aClassement.toString() === "1") {
				return GTraductions.getValeur("BulletinEtReleve.classementEr", [
					aClassement,
				]);
			} else {
				return GTraductions.getValeur("BulletinEtReleve.classementEme", [
					aClassement,
				]);
			}
		}
		return "";
	}
	composeHtmlMoyAnnuelle(aMoy, aEstNR) {
		const H = [];
		if (aEstNR === true) {
			H.push(this.composeHtmlMoyNR());
		}
		H.push(aMoy);
		return H.join("");
	}
	composePieceJointeDevoir(aDevoir, aEstEval) {
		let lDocumentJointSujet, lDocumentJointCorrige, lLienSujet, lLienCorrige;
		if (!!aDevoir.libelleSujet) {
			lDocumentJointSujet = new ObjetElement(
				aDevoir.libelleSujet,
				aDevoir.getNumero(),
				EGenreDocumentJoint.Fichier,
			);
			lLienSujet = GChaine.composerUrlLienExterne({
				documentJoint: lDocumentJointSujet,
				genreRessource: aEstEval
					? TypeFichierExterneHttpSco.EvaluationSujet
					: TypeFichierExterneHttpSco.DevoirSujet,
				libelleEcran: GTraductions.getValeur("AfficherSujet"),
			});
		}
		if (!!aDevoir.libelleCorrige) {
			lDocumentJointCorrige = new ObjetElement(
				aDevoir.libelleCorrige,
				aDevoir.getNumero(),
				EGenreDocumentJoint.Fichier,
			);
			lLienCorrige = GChaine.composerUrlLienExterne({
				documentJoint: lDocumentJointCorrige,
				genreRessource: aEstEval
					? TypeFichierExterneHttpSco.EvaluationCorrige
					: TypeFichierExterneHttpSco.DevoirCorrige,
				libelleEcran: GTraductions.getValeur("AfficherCorrige"),
			});
		}
		let lBtnExecQCM;
		if (
			!!aDevoir.executionQCM &&
			!!aDevoir.executionQCM.fichierDispo &&
			!!aDevoir.executionQCM.publierCorrige
		) {
			lBtnExecQCM = `<ie-bouton class="themeBoutonNeutre small-bt bg-white" ie-model="afficherCorrigerQCM ()">${GTraductions.getValeur("ExecutionQCM.presentationCorrige.VisualiserCorrige")}</ie-bouton>`;
		}
		return {
			sujet: lLienSujet,
			corrige: lLienCorrige,
			qcm: lBtnExecQCM,
			estQCMBtn: true,
		};
	}
	getDataPeriodePrecCourante(aParam) {
		let lData = null;
		if (
			aParam.listePeriodesPrec !== null &&
			aParam.listePeriodesPrec !== undefined
		) {
			if (aParam.avecSelectionPeriodePrec) {
				const lResult = aParam.listePeriodesPrec.getListeElements((aData) => {
					return (
						aData.periode.getNumero() === aParam.periodePrecCourante.getNumero()
					);
				});
				lData = lResult.get(0);
			} else {
				lData = aParam.listePeriodesPrec.get(0);
			}
		}
		return lData;
	}
	getInfosCol(aListeCols, aCol) {
		const lListe =
			aListeCols &&
			aListeCols.getListeElements((D) => {
				return D.typeCol.toString() === aCol;
			});
		if (lListe !== null && lListe !== undefined && lListe.count() === 1) {
			return lListe.get(0);
		} else {
			return null;
		}
	}
	estColEditable(aListeCols, aCol) {
		const lInfosCol = this.getInfosCol(aListeCols, aCol);
		if (lInfosCol !== null && lInfosCol !== undefined) {
			return lInfosCol.estColEditable;
		} else {
			return false;
		}
	}
	getTitreCol(aListeCols, aCol) {
		const lInfosCol = this.getInfosCol(aListeCols, aCol);
		if (lInfosCol !== null && lInfosCol !== undefined) {
			return lInfosCol.titreCol;
		} else {
			return "";
		}
	}
}
function _composePhoto(aParam) {
	const H = [];
	if (aParam.eleve) {
		let lSrcPhoto = "";
		if (aParam.eleve.avecPhoto !== false) {
			lSrcPhoto = GChaine.creerUrlBruteLienExterne(aParam.eleve, {
				libelle: "photo.jpg",
			});
		}
		H.push(
			tag(
				"div",
				{
					class: ["InlineBlock", "AlignementHaut"],
					style: [
						"display:flex",
						"align-items:center",
						"height: 100%",
						"width:" + aParam.largeurPhoto + "px",
						"min-width:" + aParam.largeurPhoto + "px",
					],
				},
				tag("img", {
					alt: true,
					"ie-load-src": lSrcPhoto,
					"ie-node": tag.funcAttr("nodePhoto", [aParam.eleve.getNumero()]),
					class: ["img-portrait"],
					style: [
						"height: auto",
						"width: auto",
						"max-height: 100%",
						"max-width: 100%",
					],
					"ie-imgviewer": true,
					"aria-hidden": "true",
				}),
			),
		);
	}
	return H.join("");
}
function getTitreFenetreBarreNiveauxDacquisitions(aParam) {
	const lEleve = aParam.eleve;
	const lNombre = aParam.nbEvals;
	const lResult = [lEleve.getLibelle()];
	if (lNombre > 0) {
		lResult.push(
			GTraductions.getValeur("Fenetre_BarreNiveauxDacquisitions.TitreFenetre", [
				lNombre,
			]),
		);
	}
	lResult.push(
		GEtatUtilisateur.Navigation.getLibelleRessource(EGenreRessource.Matiere),
	);
	return lResult.join(" - ");
}
function _composeHtmlBareme(aParam) {
	const H = [];
	const lDevoir = aParam.devoir;
	const lEstBaremeParDefaut =
		!lDevoir.Bareme ||
		!lDevoir.BaremeParDefaut ||
		lDevoir.Bareme.getValeur() === lDevoir.BaremeParDefaut.getValeur();
	const lNoteAuDessusBareme =
		lDevoir.Note.getValeur() > lDevoir.Bareme.getValeur();
	if (!lEstBaremeParDefaut || lNoteAuDessusBareme) {
		H.push(
			'<div class="Texte9" style="margin-left:3px;"',
			'title="',
			GTraductions.getValeur("ReleveDeNotes.BaremeDevoir"),
			'"',
			" >",
		);
		H.push(lDevoir.Bareme.getBaremeEntier());
		H.push("</div>");
	}
	return H.join("");
}
function _composeHtmlNote(aParam) {
	const H = [];
	const lDevoir = aParam.devoir;
	let lNote = lDevoir.Note.getNote();
	if (lDevoir.estFacultatif) {
		lNote = "(" + lNote + ")";
	}
	if (aParam.avecCorrige && lDevoir.libelleCorrige) {
		const lDocJoint = new ObjetElement(
			lDevoir.libelleCorrige,
			lDevoir.getNumero(),
			EGenreDocumentJoint.Fichier,
		);
		const lUrl = GChaine.creerUrlBruteLienExterne(lDocJoint, {
			genreRessource: TypeFichierExterneHttpSco.DevoirCorrige,
		});
		H.push(
			'<a class="LienAccueil Gras" title="',
			GTraductions.getValeur("AfficherCorrige"),
			'" href="' + lUrl + '" target="_blank">',
		);
		H.push(lNote);
		H.push("</a>");
	} else if (
		aParam.avecCorrige &&
		lDevoir.executionQCM &&
		lDevoir.executionQCM.publierCorrige
	) {
		H.push(
			"<div ",
			GHtml.composeAttr("ie-node", "getNodeCorrigeQCM", [
				aParam.ligne,
				aParam.indiceDevoir,
			]),
			' class="LienAccueil Gras" title="',
			GTraductions.getValeur("AfficherCorrige"),
			'">',
		);
		H.push(lNote);
		H.push("</div>");
	} else {
		H.push('<div class="Gras">' + lNote + "</div>");
	}
	return H.join("");
}
function _composeHtmlCoeff(aParam) {
	const H = [];
	const lDevoir = aParam.devoir;
	const lAvecCoeff =
		lDevoir.Coefficient && !lDevoir.Coefficient.estCoefficientParDefaut();
	H.push(
		'<div class="Texte9"',
		lAvecCoeff
			? 'title="' +
					GTraductions.getValeur("ReleveDeNotes.CoefficientDevoir") +
					'"'
			: "",
		" >",
	);
	if (lAvecCoeff) {
		H.push(
			GTraductions.getValeur("ReleveDeNotes.AbreviationCoef"),
			"&nbsp;",
			aParam.devoir.Coefficient.getNote(),
		);
	} else {
		H.push("&nbsp;");
	}
	H.push("</div>");
	return H.join("");
}
function _composeHtmlDate(aParam) {
	const H = [];
	const lDevoir = aParam.devoir;
	H.push(
		'<div class="Texte9">' +
			GDate.formatDate(lDevoir.Date, "%JJ %MMM") +
			"</div>",
	);
	return H.join("");
}
module.exports = { ObjetMoteurReleveBulletin };
