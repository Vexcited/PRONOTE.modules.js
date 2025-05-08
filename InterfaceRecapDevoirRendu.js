exports.InterfaceRecapDevoirRendu = void 0;
const ObjetListe_1 = require("ObjetListe");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetRequeteRecapDevoirRendu_1 = require("ObjetRequeteRecapDevoirRendu");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetElement_1 = require("ObjetElement");
const ObjetChaine_1 = require("ObjetChaine");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const ObjetFenetre_ParamRecapDevoirRendu_1 = require("ObjetFenetre_ParamRecapDevoirRendu");
const ObjetTri_1 = require("ObjetTri");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
class InterfaceRecapDevoirRendu extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = GApplication;
		this.parametresSco = lApplicationSco.getObjetParametres();
		this.etatUtilisateurScoEspace = lApplicationSco.getEtatUtilisateur();
		this._optionsAffichage = {
			aucunRendu: true,
			avecRendu: true,
			avecDepot: true,
			qcm: true,
		};
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evenementTripleCombo,
			this._initialiserTripleCombo,
		);
		if (
			this.identTripleCombo !== null &&
			this.identTripleCombo !== undefined &&
			this.getInstance(this.identTripleCombo) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		}
		this.identCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			this.evenementSurCalendrier,
			(aObjet) => {
				UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(aObjet, {
					avecMultiSelection: true,
				});
				aObjet.setFrequences(this.parametresSco.frequences, true);
			},
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListe,
		);
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
		);
		this.identFenetreParametresAffichage = this.add(
			ObjetFenetre_ParamRecapDevoirRendu_1.ObjetFenetre_ParamRecapDevoirRendu,
			this._evenementSurFenetreParametresAffichage,
			this._initialiserFenetreParametresAffichage,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identTripleCombo);
		this.AddSurZone.push({ separateur: true });
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnParametrer(
				"btnOptionsAffichage",
			),
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnOptionsAffichage: {
				event() {
					const lFenetreOptionsAffichage = aInstance.getInstance(
						aInstance.identFenetreParametresAffichage,
					);
					lFenetreOptionsAffichage.setDonnees(aInstance._optionsAffichage);
					lFenetreOptionsAffichage.afficher();
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"Notes.parametresAffichage",
					);
				},
				getSelection() {
					return aInstance
						.getInstance(aInstance.identFenetreParametresAffichage)
						.estAffiche();
				},
			},
		});
	}
	_initialiserTripleCombo(aInstance) {
		aInstance.setParametres(
			[
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Eleve,
			],
			true,
		);
	}
	_evenementTripleCombo() {
		$("#" + this.getNomInstance(this.identCalendrier).escapeJQ()).show();
		this.getInstance(this.identCalendrier).setDomaine(
			this.etatUtilisateurScoEspace.getDomaineSelectionne(),
		);
		this.afficherBandeau(true);
	}
	evenementSurCalendrier(aSelection, aDomaine) {
		this.etatUtilisateurScoEspace.setDomaineSelectionne(aDomaine);
		this.afficherPage();
	}
	afficherPage() {
		this.eleve = this.etatUtilisateurScoEspace.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		const lParam = {
			eleve: this.eleve,
			domaine: this.etatUtilisateurScoEspace.getDomaineSelectionne(),
			optionsAffichage: this._optionsAffichage,
		};
		new ObjetRequeteRecapDevoirRendu_1.ObjetRequeteRecapDevoirRendu(
			this,
			this._actionSurRecupererDonnees.bind(this),
		).lancerRequete(lParam);
	}
	evenementAfficherMessage(aGenreMessage) {
		ObjetHtml_1.GHtml.setDisplay(
			this.getInstance(this.identCalendrier).getNom(),
			false,
		);
		this._evenementAfficherMessage(aGenreMessage);
	}
	recupererDonnees() {}
	_actionSurRecupererDonnees(aParams) {
		if (!!aParams.Message) {
			this.evenementAfficherMessage(aParams.Message);
			return;
		}
		const lListe = aParams.listeDonnees;
		const lListeMiseEnForme = new ObjetListeElements_1.ObjetListeElements();
		const lListeCumuls = new ObjetListeElements_1.ObjetListeElements();
		lListe.parcourir((aElt) => {
			if (aElt.estCumul) {
				const lCumul = new ObjetElement_1.ObjetElement(aElt.getLibelle());
				lCumul.estDeploye = false;
				lCumul.estUnDeploiement = true;
				lCumul.setActif(true);
				lCumul.numeroMatiere = aElt.numeroMatiere;
				lCumul.libelleMatiere = aElt.getLibelle();
				lCumul.setNumero(aElt.getNumero());
				lListeCumuls.addElement(lCumul);
				lCumul.Position = aElt.Position;
				lListeMiseEnForme.addElement(lCumul);
			} else {
				const lIndicePere = lListeCumuls.getIndiceElementParFiltre(
					(aFiltre) => {
						return aFiltre.numeroMatiere === aElt.numeroMatiere;
					},
				);
				const lPere = lListeCumuls.get(lIndicePere);
				aElt.pere = lPere;
				aElt.libelleMatiere = !!lPere ? lPere.getLibelle() : "";
				aElt.estUnDeploiement = false;
				lListeMiseEnForme.addElement(aElt);
			}
		});
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_RecapDevoirRendu(lListeMiseEnForme, {
				callbackSurNodeQCM: this._afficherExecutionQCM.bind(this),
			}),
		);
		$("#" + this.getNomInstance(this.identListe).escapeJQ()).show();
	}
	_initialiserListe(aInstance) {
		const lColonnes = [
			{
				id: DonneesListe_RecapDevoirRendu.colonnes.pourLe,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"RecapDevoirRendu.colonnes.pourLe",
				),
				taille: 60,
			},
			{
				id: DonneesListe_RecapDevoirRendu.colonnes.description,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"RecapDevoirRendu.colonnes.description",
				),
				taille: "100%",
			},
			{
				id: DonneesListe_RecapDevoirRendu.colonnes.type,
				titre: {
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"RecapDevoirRendu.colonnes.type",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"RecapDevoirRendu.colonnes.hintType",
					),
				},
				taille: 80,
			},
			{
				id: DonneesListe_RecapDevoirRendu.colonnes.fait,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"RecapDevoirRendu.colonnes.estFait",
				),
				taille: 60,
			},
			{
				id: DonneesListe_RecapDevoirRendu.colonnes.pieceJointe,
				titre: {
					classeCssImage: "Image_Trombone",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"RecapDevoirRendu.colonnes.copie",
					),
				},
				taille: 30,
			},
			{
				id: DonneesListe_RecapDevoirRendu.colonnes.total,
				titre: {
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"RecapDevoirRendu.colonnes.total",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"RecapDevoirRendu.colonnes.hintTotal",
					),
				},
				taille: 60,
			},
		];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
		});
		GEtatUtilisateur.setTriListe({ liste: aInstance });
	}
	_initialiserFenetreParametresAffichage(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"RecapDevoirRendu.fenetreOptions.titreFenetre",
			),
			largeur: 400,
			hauteur: 80,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	_evenementSurFenetreParametresAffichage(aNumeroBouton, aParametres) {
		if (aNumeroBouton === 1) {
			this._optionsAffichage = aParametres;
			this.afficherPage();
		}
	}
	_afficherExecutionQCM(aExecutionQCM) {
		if (aExecutionQCM) {
			this.getInstance(this.identFenetreVisuQCM).setParametres(
				aExecutionQCM.getNumero(),
				GApplication.getDemo() ||
					[Enumere_Espace_1.EGenreEspace.Professeur].includes(
						GEtatUtilisateur.GenreEspace,
					),
				this.eleve,
			);
			this.getInstance(this.identFenetreVisuQCM).setDonnees(aExecutionQCM);
		}
	}
}
exports.InterfaceRecapDevoirRendu = InterfaceRecapDevoirRendu;
class DonneesListe_RecapDevoirRendu extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.callbackSurNodeQCM = aParam.callbackSurNodeQCM;
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecEtatSaisie: false,
			avecDeploiement: true,
			avecTri: true,
			avecImageSurColonneDeploiement: true,
		});
	}
	getControleur(aInstanceDonneesListe, aInstanceListe) {
		return $.extend(
			true,
			super.getControleur(aInstanceDonneesListe, aInstanceListe),
			{
				surQCM(aNumeroExecutionQCM) {
					$(this.node).eventValidation(() => {
						let lExecQCM = null;
						for (const lLigne of aInstanceDonneesListe.Donnees) {
							if (
								lLigne.QCM &&
								lLigne.QCM.getNumero() === aNumeroExecutionQCM
							) {
								lExecQCM = lLigne.QCM;
								break;
							}
						}
						if (lExecQCM) {
							aInstanceDonneesListe.callbackSurNodeQCM(lExecQCM);
						}
					});
				},
			},
		);
	}
	getClass(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_RecapDevoirRendu.colonnes.description:
			case DonneesListe_RecapDevoirRendu.colonnes.type:
				return "EspaceGauche";
			case DonneesListe_RecapDevoirRendu.colonnes.total:
				return "AlignementDroit EspaceDroit";
			case DonneesListe_RecapDevoirRendu.colonnes.pieceJointe:
				return (
					"AlignementMilieu" +
					(aParams.article.QCM || aParams.article.documentDepose
						? " AvecMain"
						: "")
				);
			default:
				return "AlignementMilieu";
		}
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne === DonneesListe_RecapDevoirRendu.colonnes.description
		);
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_RecapDevoirRendu.colonnes.pourLe:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
					.DateCalendrier;
			case DonneesListe_RecapDevoirRendu.colonnes.fait:
			case DonneesListe_RecapDevoirRendu.colonnes.pieceJointe:
			case DonneesListe_RecapDevoirRendu.colonnes.description:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getColonneDeFusion(aParams) {
		if (aParams.article.estUnDeploiement) {
			return DonneesListe_RecapDevoirRendu.colonnes.description;
		}
		return null;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_RecapDevoirRendu.colonnes.pourLe:
				return aParams.article.pourLe;
			case DonneesListe_RecapDevoirRendu.colonnes.description:
				return aParams.article.estUnDeploiement
					? aParams.article.getLibelle()
					: aParams.article.description;
			case DonneesListe_RecapDevoirRendu.colonnes.type:
				switch (aParams.article.getGenre()) {
					case DonneesListe_RecapDevoirRendu.GenreTypeRenduDevoir.aucunRendu:
						return ObjetTraduction_1.GTraductions.getValeur(
							"RecapDevoirRendu.typeRendu.sansRendu",
						);
					case DonneesListe_RecapDevoirRendu.GenreTypeRenduDevoir.avecRendu:
						return ObjetTraduction_1.GTraductions.getValeur(
							"RecapDevoirRendu.typeRendu.aRendre",
						);
					case DonneesListe_RecapDevoirRendu.GenreTypeRenduDevoir.avecDepot:
						return ObjetTraduction_1.GTraductions.getValeur(
							"RecapDevoirRendu.typeRendu.aDeposer",
						);
					case DonneesListe_RecapDevoirRendu.GenreTypeRenduDevoir.qcm:
						return ObjetTraduction_1.GTraductions.getValeur(
							"RecapDevoirRendu.typeRendu.QCM",
						);
					default:
						return "";
				}
			case DonneesListe_RecapDevoirRendu.colonnes.fait: {
				const lHtml = [];
				if (aParams.article.estFait) {
					lHtml.push(
						IE.jsx.str("i", {
							class: "icon_check_fin ico-green taille-m",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"RecapDevoirRendu.colonnes.estFait",
							),
							role: "img",
						}),
					);
				}
				if (aParams.article.strDateRealisation) {
					lHtml.push(
						IE.jsx.str(
							"span",
							{ class: "p-left" },
							aParams.article.strDateRealisation,
						),
					);
				}
				return lHtml.join("");
			}
			case DonneesListe_RecapDevoirRendu.colonnes.pieceJointe:
				if (aParams.article.QCM) {
					return (
						"<div ie-node=\"surQCM('" +
						aParams.article.QCM.getNumero() +
						'\')"><i class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i></div>'
					);
				} else if (aParams.article.documentDepose) {
					const lFichier = new ObjetElement_1.ObjetElement(
						aParams.article.documentDepose.getLibelle(),
						aParams.article.documentDepose.getNumero(),
						Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
					);
					return ObjetChaine_1.GChaine.composerUrlLienExterne({
						documentJoint: lFichier,
						libelleEcran: "",
						genreRessource:
							TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
								.TAFRenduEleve,
						afficherIconeDocument: true,
						iconeOverride: "icon_doc_telech",
					});
				} else {
					return "";
				}
			case DonneesListe_RecapDevoirRendu.colonnes.total:
				return aParams.article.nbrFait + "/" + aParams.article.nbrTotal;
			default:
				return "";
		}
	}
	getHintForce(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_RecapDevoirRendu.colonnes.fait:
				if (aParams.article.estFait) {
					if (aParams.article.QCM) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"RecapDevoirRendu.hintFait.QCMExecute",
						);
					} else if (
						aParams.article.getGenre() ===
						DonneesListe_RecapDevoirRendu.GenreTypeRenduDevoir.avecRendu
					) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"RecapDevoirRendu.hintFait.devoirRendu",
						);
					} else if (aParams.article.documentDepose) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"RecapDevoirRendu.hintFait.devoirDepose",
						);
					} else {
						return ObjetTraduction_1.GTraductions.getValeur(
							"RecapDevoirRendu.hintFait.devoirFait",
						);
					}
				} else {
					return "";
				}
			case DonneesListe_RecapDevoirRendu.colonnes.pieceJointe:
				if (aParams.article.QCM) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"RecapDevoirRendu.hintCopie.consulterQCM",
					);
				} else if (aParams.article.documentDepose) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"RecapDevoirRendu.hintCopie.telechargerCopie",
					);
				} else {
					return "";
				}
			default:
				return;
		}
	}
	getTri(aColonneDeTri, aGenreTri) {
		if (aColonneDeTri !== null && aColonneDeTri !== undefined) {
			const lTris = [];
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return D.libelleMatiere;
				}),
			);
			const lId = this.getId(aColonneDeTri);
			switch (lId) {
				case DonneesListe_RecapDevoirRendu.colonnes.pourLe:
					lTris.push(
						ObjetTri_1.ObjetTri.initRecursif("pere", [
							ObjetTri_1.ObjetTri.init("pourLe", aGenreTri),
						]),
					);
					break;
				case DonneesListe_RecapDevoirRendu.colonnes.description:
					lTris.push(
						ObjetTri_1.ObjetTri.initRecursif("pere", [
							ObjetTri_1.ObjetTri.init("description", aGenreTri),
						]),
					);
					break;
				case DonneesListe_RecapDevoirRendu.colonnes.type:
					lTris.push(
						ObjetTri_1.ObjetTri.initRecursif("pere", [
							ObjetTri_1.ObjetTri.init("Genre", aGenreTri),
						]),
					);
					break;
				case DonneesListe_RecapDevoirRendu.colonnes.fait:
					lTris.push(
						ObjetTri_1.ObjetTri.initRecursif("pere", [
							ObjetTri_1.ObjetTri.init("estFait", aGenreTri),
						]),
					);
					break;
				case DonneesListe_RecapDevoirRendu.colonnes.pieceJointe:
					lTris.push(
						ObjetTri_1.ObjetTri.initRecursif("pere", [
							ObjetTri_1.ObjetTri.init("QCM", aGenreTri),
						]),
					);
					break;
				case DonneesListe_RecapDevoirRendu.colonnes.total:
					lTris.push(
						ObjetTri_1.ObjetTri.initRecursif("pere", [
							ObjetTri_1.ObjetTri.init("nbrFait", aGenreTri),
							ObjetTri_1.ObjetTri.init("nbrTotal", aGenreTri),
						]),
					);
					break;
				default:
					break;
			}
			return lTris;
		}
	}
}
DonneesListe_RecapDevoirRendu.GenreTypeRenduDevoir = {
	aucunRendu: 0,
	avecRendu: 1,
	avecDepot: 2,
	qcm: 3,
};
DonneesListe_RecapDevoirRendu.colonnes = {
	pourLe: "pourLe",
	description: "description",
	type: "type",
	fait: "fait",
	pieceJointe: "pieceJointe",
	total: "total",
};
