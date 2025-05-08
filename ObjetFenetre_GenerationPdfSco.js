exports.ObjetFenetre_GenerationPdfSco = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const ObjetFenetre_GenerationPdf_1 = require("ObjetFenetre_GenerationPdf");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const TypeNote_1 = require("TypeNote");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const OptionsPDFSco_1 = require("OptionsPDFSco");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
class ObjetFenetre_GenerationPdfSco extends ObjetFenetre_GenerationPdf_1.ObjetFenetre_GenerationPdf {
	creerInstanceFenetrePDF(aParametres, aId) {
		const lGenreGenerationPDF = aParametres
			? aParametres.genreGenerationPDF
			: TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.EDT;
		const lEtatUtilisateur = GApplication.getEtatUtilisateur();
		if (!lEtatUtilisateur.parametresGenerationPDF) {
			lEtatUtilisateur.parametresGenerationPDF = [];
		}
		if (!lEtatUtilisateur.parametresGenerationPDF[lGenreGenerationPDF]) {
			lEtatUtilisateur.parametresGenerationPDF[lGenreGenerationPDF] = {};
		}
		let lInstance = null;
		switch (lGenreGenerationPDF) {
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.EDT:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetParametrageGenerationPdf_EDTSco,
					{ pere: this },
				);
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.ReleveDeNotes:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf_ReleveDeNotes,
					{ pere: this },
				);
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.Bulletin:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetParametrageGenerationPdf_BulletinSco,
					{ pere: this },
				);
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.LivretScolaire:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetParametrageGenerationPdf_LivretScolaire,
					{ pere: this },
				);
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
				.BulletinDeCompetences:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetParametrageGenerationPdf_BulletinDeCompetences,
					{ pere: this },
				);
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.ResultatsQCM:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf,
					{ pere: this },
				).setOptions({
					avecPolices: false,
					titreFenetre: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.TitrePDF_ResultatsQCM",
					),
				});
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.RecapAbsences:
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
				.RecapPunitionSanction:
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
				.RecapFeuilleAppel:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf,
					{ pere: this },
				).setOptions({ avecPolices: false, avecPolice: true });
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.BilanFinDeCycle:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf,
					{ pere: this },
				).setOptions({ avecOrientation: false, avecPolices: false });
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
				.RecapMensuelAbsences:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetParametrageGenerationPdf_RecapitulatifMensuelAbsences,
					{ pere: this },
				).setOptions({ avecPolices: false });
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.Etiquettes:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetParametrageGenerationPdf_Etiquettes,
					{ pere: this },
				);
				lInstance.setOptions({
					titreFenetre: ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.Etiquettes.ImpressionDEtiquettes",
					),
				});
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
				.ReleveDeCompetences:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetParametrageGenerationPdf_ReleveDeCompetences,
					{ pere: this },
				);
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
				.AppreciationsProf:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetParametrageGenerationPdf_AppreciationsProf,
					{ pere: this },
				);
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
				.AppreciationsGenerales:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetParametrageGenerationPdf_AppreciationsGenerales,
					{ pere: this },
				);
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
				.RecapCahierJournal:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetParametrageGenerationPdf_RecapCahierJournal,
					{ pere: this },
				);
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
				.AppelPeriscolaire:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetParametrageGenerationPdf_AppelPeriscolaire,
					{ pere: this },
				);
				break;
			case TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.Evaluation:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetParametrageGenerationPdf_Evaluation,
					{ pere: this },
				);
				break;
			default:
				lInstance = ObjetIdentite_1.Identite.creerInstance(
					ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf_SansPolice,
					{ pere: this },
				);
				break;
		}
		lInstance.setParametres(
			aParametres,
			lEtatUtilisateur.parametresGenerationPDF[lGenreGenerationPDF],
		);
		lInstance.initialiser(aId);
		return lInstance;
	}
}
exports.ObjetFenetre_GenerationPdfSco = ObjetFenetre_GenerationPdfSco;
class ObjetParametrageGenerationPdf_LivretScolaire extends ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf {
	constructor(...aParams) {
		super(...aParams);
		this._optionsPDF = OptionsPDFSco_1.OptionsPDFSco.LivretScolaire;
		this.setOptions({ avecPolices: false });
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, { avecGraphe: this._optionsPDF.avecGraphe });
	}
	composePage(aHtml) {
		super.composePage(aHtml);
		aHtml.push(
			'<ie-checkbox ie-model="_optionsPDF.avecGraphe" class="NoWrap PetitEspaceHaut PetiEspaceGauche Insecable Texte10" style="margin:2px;">',
			ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.optionPDFGraphe"),
			"</ie-checkbox>",
		);
	}
}
class ObjetParametrageGenerationPdf_BulletinDeCompetences extends ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf_BulletinReleve {
	constructor(...aParams) {
		super(...aParams);
		this._optionsPDF = OptionsPDFSco_1.OptionsPDFSco.BulletinDeCompetences;
		this.setOptions({
			avecPolices: true,
			libelleGroupePolices: ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.BulletinDeCompetences.TaillePoliceCorps",
			),
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			rbChoixBulletinCompetences: {
				getValue: function (aDesEleves) {
					return aInstance._optionsPDF.desEleves === aDesEleves;
				},
				setValue: function (aDesEleves) {
					aInstance._optionsPDF.desEleves = aDesEleves;
				},
			},
			cbGererRectoVerso: {
				getValue: function () {
					return aInstance._optionsPDF.gererRectoVerso;
				},
				setValue: function (aGererRectoVerso) {
					aInstance._optionsPDF.gererRectoVerso = aGererRectoVerso;
				},
				getDisabled: function () {
					return false;
				},
			},
		});
	}
	afficherGroupeHauteurService() {
		return false;
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, {
			gererRectoVerso: this._optionsPDF.gererRectoVerso,
			adapterHauteur: this._optionsPDF.adapterHauteur,
			avecGraphe:
				this._parametres.avecChoixGraphe && this._optionsPDF.avecGraphe,
			desEleves: this._optionsPDF.desEleves,
		});
	}
	composePage(aHtml) {
		const lAvecChoixBulletin = !!this._parametres.eleve;
		const lPourClasse =
			this._parametres.eleve && !this._parametres.eleve.existeNumero();
		if (lAvecChoixBulletin) {
			let lLibelleChoixImpressionUnique;
			if (lPourClasse) {
				lLibelleChoixImpressionUnique =
					ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.BulletinDeCompetences.choixBulletin_DeLaClasse",
					);
			} else {
				lLibelleChoixImpressionUnique =
					ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.BulletinDeCompetences.choixBulletin_DeLEleve",
					);
			}
			const lLibelleImpressionMultiple =
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.BulletinDeCompetences.choixBulletin_Eleves",
				);
			aHtml.push(
				'<div style="padding:5px;',
				ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.themeNeutre.claire),
				'">',
				'<div class="Gras PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.BulletinDeCompetences.choixBulletin",
				),
				"</div>",
				'<ie-radio ie-model="rbChoixBulletinCompetences(false)" style="padding: 3px;">',
				ObjetChaine_1.GChaine.insecable(lLibelleChoixImpressionUnique),
				"</ie-radio>",
				'<ie-radio ie-model="rbChoixBulletinCompetences(true)" style="padding: 3px;">',
				ObjetChaine_1.GChaine.insecable(lLibelleImpressionMultiple),
				"</ie-radio>",
				"</div>",
			);
		}
		super.composePage(aHtml);
		aHtml.push(
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.ReleveNotes.HauteurService",
				),
				'<ie-checkbox ie-model="_optionsPDF.adapterHauteur" class="MargeHaut">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.BulletinDeCompetences.AdapterHauteur",
					) +
					"</ie-checkbox>",
			),
		);
		const T = [];
		if (lAvecChoixBulletin) {
			T.push(
				'<ie-checkbox ie-model="cbGererRectoVerso" class="PetitEspaceHaut Insecable">',
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Bulletin.GererRectoVerso",
				),
				"</ie-checkbox>",
			);
		}
		if (this._parametres.avecChoixGraphe) {
			T.push(
				'<ie-checkbox ie-model="_optionsPDF.avecGraphe" class="PetitEspaceHaut Insecable">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.GrapheAraignee",
					),
				"</ie-checkbox>",
			);
		}
		if (T.length > 0) {
			aHtml.push(
				this.composeGroupe(
					ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Options"),
					T.join(""),
				),
			);
		}
	}
}
class ObjetParametrageGenerationPdf_BulletinSco extends ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf_Bulletin {
	constructor(...aParams) {
		super(...aParams);
		this._optionsPDF = OptionsPDFSco_1.OptionsPDFSco.Bulletin;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			rbChoixBulletinNotes: {
				getValue: function (aDesEleves) {
					return aInstance._optionsPDF.desEleves === aDesEleves;
				},
				setValue: function (aDesEleves) {
					aInstance._optionsPDF.desEleves = aDesEleves;
				},
			},
			cbGererRectoVerso: {
				getValue: function () {
					return aInstance._optionsPDF.gererRectoVerso;
				},
				setValue: function (aGererRectoVerso) {
					aInstance._optionsPDF.gererRectoVerso = aGererRectoVerso;
				},
				getDisabled: function () {
					return false;
				},
			},
		});
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, {
			piedMonobloc: this._optionsPDF.piedMonobloc,
			gererRectoVerso: this._optionsPDF.gererRectoVerso,
			desEleves: this._optionsPDF.desEleves,
		});
	}
	composePage(aHtml) {
		const lAvecChoixBulletin = !!this._parametres.eleve;
		const lPourClasse =
			this._parametres.eleve && !this._parametres.eleve.existeNumero();
		if (lAvecChoixBulletin) {
			let lLibelleChoixImpressionUnique;
			if (lPourClasse) {
				lLibelleChoixImpressionUnique =
					ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.Bulletin.choixBulletin_DeLaClasse",
					);
			} else {
				lLibelleChoixImpressionUnique =
					ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.Bulletin.choixBulletin_DeLEleve",
					);
			}
			const lLibelleImpressionMultiple =
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Bulletin.choixBulletin_Eleves",
				);
			aHtml.push(
				'<div style="padding:5px;',
				ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.themeNeutre.claire),
				'">',
				'<div class="Gras PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Bulletin.choixBulletin",
				),
				"</div>",
				'<ie-radio ie-model="rbChoixBulletinNotes(false)" style="padding: 3px;">',
				ObjetChaine_1.GChaine.insecable(lLibelleChoixImpressionUnique),
				"</ie-radio>",
				'<ie-radio ie-model="rbChoixBulletinNotes(true)" style="padding: 3px;">',
				ObjetChaine_1.GChaine.insecable(lLibelleImpressionMultiple),
				"</ie-radio>",
				"</div>",
			);
		}
		super.composePageProtected(aHtml);
		aHtml.push(
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.ReleveNotes.TaillePolicePied",
				),
				this._composeChoixPolicePied(),
			),
		);
		aHtml.push(
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.ReleveNotes.HauteurService",
				),
				this.composeChoixHauteurService(),
			),
		);
		const T = [];
		T.push(
			'<ie-checkbox ie-model="_optionsPDF.piedMonobloc" class="PetitEspaceHaut PetiEspaceGauche Insecable Texte10" style="margin:2px;">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Bulletin.PiedMonoBloc",
				) +
				"</ie-checkbox>",
		);
		if (lAvecChoixBulletin) {
			T.push(
				'<ie-checkbox ie-model="cbGererRectoVerso" class="PetitEspaceHaut PetiEspaceGauche Insecable Texte10" style="margin:2px;">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.Bulletin.GererRectoVerso",
					) +
					"</ie-checkbox>",
			);
		}
		aHtml.push(
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Options"),
				T.join(""),
			),
		);
	}
	_getTradAdapterHauteur() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"GenerationPDF.Bulletin.HauteurAppEtElementProg",
		);
	}
}
class ObjetParametrageGenerationPdf_EDTSco extends ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf_EDT {
	constructor(...aParams) {
		super(...aParams);
		this._optionsPDF = OptionsPDFSco_1.OptionsPDFSco.EDT;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			rbChoixAnnuel: {
				getValue: function (aEstEDTAnnuel) {
					return aInstance._optionsPDF.estEDTAnnuel === aEstEDTAnnuel;
				},
				setValue: function (aEstEDTAnnuel) {
					aInstance._optionsPDF.estEDTAnnuel = aEstEDTAnnuel;
				},
			},
		});
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, { estEDTAnnuel: this._optionsPDF.estEDTAnnuel });
	}
	composePage(aHtml) {
		if (
			!!this._parametres &&
			!!this._parametres.PARAMETRE_FENETRE &&
			this._parametres.PARAMETRE_FENETRE.avecChoixEDTAnnuel
		) {
			aHtml.push(
				'<div style="padding:5px;',
				ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.themeNeutre.claire),
				'">',
				'<div class="Gras PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.EDT.ChoixEDT"),
				"</div>",
				'<div style="padding-top:5px; display:flex; align-items:center; justify-content:space-between;">',
				'<ie-radio ie-model="rbChoixAnnuel(true)" style="margin-right:20px;">' +
					ObjetChaine_1.GChaine.insecable(
						ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.EDT.ChoixEDT_AnneeScolaire",
						),
					) +
					"</ie-radio>",
				'<ie-radio ie-model="rbChoixAnnuel(false)">' +
					ObjetChaine_1.GChaine.insecable(
						ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.EDT.ChoixEDT_Semaine",
						),
					) +
					"</ie-radio>",
				"</div>",
				"</div>",
			);
		}
		super.composePage(aHtml);
	}
}
class ObjetParametrageGenerationPdf_RecapitulatifMensuelAbsences extends ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf {
	constructor(...aParams) {
		super(...aParams);
		this._optionsPDF =
			OptionsPDFSco_1.OptionsPDFSco.RecapitulatifMensuelAbsences;
		this.listeMoisAnnees = ObjetDate_1.GDate.getListeMoisAPartirDeDate();
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, {
			avecDetailMotifs: this._optionsPDF.avecDetailMotifs,
			mois: this._optionsPDF.moisRecapitulatif,
			annee: this._optionsPDF.anneeRecapitulatif,
		});
	}
	setParametres(aParametres) {
		super.serialiserParametres(aParametres);
		let lDateRecapitulatif = aParametres.date;
		if (!lDateRecapitulatif) {
			lDateRecapitulatif = ObjetDate_1.GDate.getDateCourante();
		}
		this._optionsPDF.moisRecapitulatif = lDateRecapitulatif.getMonth();
		this._optionsPDF.anneeRecapitulatif = lDateRecapitulatif.getFullYear();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			comboSelecteurMois: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({ longueur: 120 });
				},
				getDonnees: function (aDonnees) {
					if (aDonnees) {
						return;
					}
					return aInstance.listeMoisAnnees;
				},
				getIndiceSelection: function () {
					let result = 0;
					if (!!aInstance.listeMoisAnnees) {
						const lMoisRecherche = aInstance._optionsPDF.moisRecapitulatif;
						const lAnneeRecherchee = aInstance._optionsPDF.anneeRecapitulatif;
						aInstance.listeMoisAnnees.parcourir((D, aIndex) => {
							if (lMoisRecherche === D.mois && lAnneeRecherchee === D.annee) {
								result = aIndex;
								return false;
							}
						});
					}
					return result;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element
					) {
						aInstance._optionsPDF.moisRecapitulatif = aParametres.element.mois;
						aInstance._optionsPDF.anneeRecapitulatif =
							aParametres.element.annee;
					}
				},
			},
		});
	}
	composePage(aHtml) {
		aHtml.push(
			'<div class="Espace MargeBas" style="',
			ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.themeNeutre.claire),
			'">',
			'<div class="Gras EspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur(
				"tableauDeBord.optionsImpression.RegistreDAppel",
			),
			"</div>",
			"<div>",
			'<ie-combo ie-model="comboSelecteurMois"></ie-combo>',
			"</div>",
			"</div>",
		);
		super.composePage(aHtml);
		aHtml.push(
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Options"),
				'<ie-checkbox ie-model="_optionsPDF.avecDetailMotifs" style="margin:2px;">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"tableauDeBord.optionsImpression.AvecDetailMotifsDAbsences",
					) +
					"</ie-checkbox>",
			),
		);
	}
}
class ObjetParametrageGenerationPdf_Etiquettes extends ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf {
	constructor(...aParams) {
		super(...aParams);
		this.genreDonnees = { prenom: 0, nomPrenom: 1, prenomNom: 2 };
		this.largeurFenetre = 320;
		this.listeTypeDonnees = new ObjetListeElements_1.ObjetListeElements();
		this.listeTypeDonnees.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Etiquettes.Prenom",
				),
				0,
				this.genreDonnees.prenom,
			),
		);
		this.listeTypeDonnees.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Etiquettes.NomPrenom",
				),
				0,
				this.genreDonnees.nomPrenom,
			),
		);
		this.listeTypeDonnees.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Etiquettes.PrenomNom",
				),
				0,
				this.genreDonnees.prenomNom,
			),
		);
		this.listePolices =
			GApplication.getObjetParametres().listePolices ||
			new ObjetListeElements_1.ObjetListeElements();
		const lTableauTaillePolice = [
			8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
		];
		this.listeTaillePolice = new ObjetListeElements_1.ObjetListeElements();
		for (let i = 0; i < lTableauTaillePolice.length; i++) {
			this.listeTaillePolice.addElement(
				new ObjetElement_1.ObjetElement(
					"" + lTableauTaillePolice[i],
					0,
					lTableauTaillePolice[i],
				),
			);
		}
		$.extend(this._optionsPDF, {
			typeDonnees: this.listeTypeDonnees.getPremierElement(),
			avecClasse: false,
			nbParLigne: new TypeNote_1.TypeNote(2),
			nbParColonne: new TypeNote_1.TypeNote(8),
			modeCavalier: false,
			police:
				this.listePolices.getElementParLibelle("Arial") ||
				this.listePolices.getPremierElement(),
			taillePolice: 20,
			avecReperes: false,
			initialeHomonymes: true,
		});
	}
	serialiserParametres(aParametres) {
		$.extend(aParametres, {
			genreTypeDonnees: this._optionsPDF.typeDonnees.getGenre(),
			avecClasse: this._optionsPDF.avecClasse,
			nbParLigne: this._optionsPDF.nbParLigne.getValeur(),
			nbParColonne: this._optionsPDF.nbParColonne.getValeur(),
			modeCavalier: this._optionsPDF.modeCavalier,
			nomPolice: this._optionsPDF.police.getLibelle(),
			taillePolice: this._optionsPDF.taillePolice,
			avecReperes: this._optionsPDF.avecReperes,
			initialeHomonymes: this._optionsPDF.initialeHomonymes,
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			radioTypeDonnees: {
				getValue: function (aGenreTypeDonnees) {
					const lTypeDonnees = aInstance._optionsPDF.typeDonnees;
					return (
						!!lTypeDonnees && lTypeDonnees.getGenre() === aGenreTypeDonnees
					);
				},
				setValue: function (aGenreTypeDonnees) {
					aInstance._optionsPDF.typeDonnees =
						aInstance.listeTypeDonnees.getElementParGenre(aGenreTypeDonnees);
				},
			},
			cbAvecClasse: {
				getValue: function () {
					return aInstance._optionsPDF.avecClasse;
				},
				setValue: function (aValue) {
					aInstance._optionsPDF.avecClasse = aValue;
				},
			},
			cbInitialeHomonymes: {
				getValue: function () {
					return aInstance._optionsPDF.initialeHomonymes;
				},
				setValue: function (aValue) {
					aInstance._optionsPDF.initialeHomonymes = aValue;
				},
				getDisabled: function () {
					return (
						aInstance._optionsPDF.typeDonnees.getGenre() !==
						aInstance.genreDonnees.prenom
					);
				},
			},
			cbModeCavalier: {
				getValue: function () {
					return aInstance._optionsPDF.modeCavalier;
				},
				setValue: function (aValue) {
					aInstance._optionsPDF.modeCavalier = aValue;
				},
			},
			cbAvecReperes: {
				getValue: function () {
					return aInstance._optionsPDF.avecReperes;
				},
				setValue: function (aValue) {
					aInstance._optionsPDF.avecReperes = aValue;
				},
			},
			inputDisposition: {
				getNote: function (aDispositionLigne) {
					return aDispositionLigne
						? aInstance._optionsPDF.nbParLigne
						: aInstance._optionsPDF.nbParColonne;
				},
				setNote: function (aDispositionLigne, aValue) {
					if (!aValue.estUneNoteVide()) {
						if (aDispositionLigne) {
							aInstance._optionsPDF.nbParLigne = aValue;
						} else {
							aInstance._optionsPDF.nbParColonne = aValue;
						}
					}
				},
				getOptionsNote: function () {
					return {
						avecVirgule: false,
						afficherAvecVirgule: false,
						hintSurErreur: true,
						avecAnnotation: false,
						sansNotePossible: false,
						min: 1,
						max: 99,
					};
				},
			},
			displayTotalEtiquettes: function () {
				const lNbParLigne = aInstance._optionsPDF.nbParLigne.getValeur();
				const lNbParColonne = aInstance._optionsPDF.nbParColonne.getValeur();
				let lNbTotal = lNbParLigne * lNbParColonne;
				if (aInstance._optionsPDF.modeCavalier) {
					lNbTotal = Math.floor(lNbTotal / 2);
				}
				if (lNbTotal === 1) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.Etiquettes.TotalUneEtiquette",
					);
				} else {
					return ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.Etiquettes.TotalXEtiquettes",
						[lNbTotal],
					);
				}
			},
			comboNomPolice: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						libelleHaut: ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.Etiquettes.NomPolice",
						),
						longueur: 150,
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return aInstance.listePolices;
					}
				},
				getIndiceSelection: function () {
					let lIndice = 0;
					if (
						!!aInstance._optionsPDF.police &&
						!!aInstance.listePolices &&
						aInstance.listePolices.count() > 0
					) {
						lIndice = aInstance.listePolices.getIndiceParLibelle(
							aInstance._optionsPDF.police.getLibelle(),
						);
					}
					return Math.max(lIndice, 0);
				},
				event: function (aParametres, aInstanceCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						!!aParametres.element &&
						aInstanceCombo.estUneInteractionUtilisateur()
					) {
						aInstance._optionsPDF.police = aParametres.element;
					}
				},
			},
			comboTaillePolice: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						libelleHaut: ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.Etiquettes.TaillePolice",
						),
						longueur: 30,
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return aInstance.listeTaillePolice;
					}
				},
				getIndiceSelection: function () {
					let lIndice = 0;
					if (
						!!aInstance._optionsPDF.taillePolice &&
						!!aInstance.listeTaillePolice &&
						aInstance.listeTaillePolice.count() > 0
					) {
						lIndice = aInstance.listeTaillePolice.getIndiceElementParFiltre(
							(D) => {
								return D.getGenre() === aInstance._optionsPDF.taillePolice;
							},
						);
					}
					return Math.max(lIndice, 0);
				},
				event: function (aParametres, aInstanceCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						!!aParametres.element &&
						aInstanceCombo.estUneInteractionUtilisateur()
					) {
						aInstance._optionsPDF.taillePolice = aParametres.element.getGenre();
					}
				},
			},
		});
	}
	composePage(aHtml) {
		aHtml.push(
			'<div style="',
			ObjetStyle_1.GStyle.composeWidth(this.largeurFenetre),
			'">',
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Etiquettes.DonneesAImprimer",
				),
				this._composeBlocDonneesAImprimer(),
			),
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Etiquettes.Disposition",
				),
				this._composeBlocDisposition(),
			),
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Etiquettes.Police",
				),
				this._composeBlocPolice(),
			),
			"</div>",
		);
	}
	_composeBlocDonneesAImprimer() {
		const H = [];
		H.push("<div>");
		this.listeTypeDonnees.parcourir((D) => {
			H.push(
				'<div class="MargeHaut">',
				'<ie-radio ie-model="radioTypeDonnees(',
				D.getGenre(),
				')">',
				D.getLibelle(),
				"</ie-radio>",
				D.getGenre() === this.genreDonnees.prenom
					? '<div><ie-checkbox style="margin-left: 20px;" ie-model="cbInitialeHomonymes">' +
							ObjetTraduction_1.GTraductions.getValeur(
								"GenerationPDF.Etiquettes.initialeHomonymes",
							) +
							"</ie-checkbox></div>"
					: "",
				"</div>",
			);
		});
		H.push("</div>");
		H.push(
			'<div class="EspaceHaut10 EspaceBas">',
			'<ie-checkbox ie-model="cbAvecClasse">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Etiquettes.Classe",
				) +
				"</ie-checkbox>",
			"</div>",
		);
		return H.join("");
	}
	_composeBlocDisposition() {
		const lStyleLibelles = "display: inline-block; width: 125px;";
		const H = [];
		H.push(
			'<div class="EspaceHaut MargeBas">',
			'<label style="',
			lStyleLibelles,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.Etiquettes.NombreEtiquetteParLigne",
			),
			"</label>",
			'<ie-inputnote ie-model="inputDisposition(true)" style="width:30px;" class="MargeGauche round-style"></ie-inputnote>',
			"</div>",
		);
		H.push(
			'<div class="MargeBas">',
			'<label style="',
			lStyleLibelles,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.Etiquettes.NombreEtiquetteParColonne",
			),
			"</label>",
			'<ie-inputnote ie-model="inputDisposition(false)" style="width:30px;" class="MargeGauche round-style"></ie-inputnote>',
			"</div>",
		);
		H.push(
			'<div class="MargeBas">',
			'<ie-checkbox ie-model="cbModeCavalier">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Etiquettes.modeCavalier",
				) +
				"</ie-checkbox>",
			"</div>",
		);
		H.push(
			'<div class="EspaceHaut GrandEspaceGauche">',
			'<span ie-html="displayTotalEtiquettes"></span>',
			"</div>",
		);
		H.push(
			'<div class="EspaceHaut10 EspaceBas">',
			'<ie-checkbox ie-model="cbAvecReperes">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Etiquettes.AvecReperes",
				) +
				"</ie-checkbox>",
			"</div>",
		);
		return H.join("");
	}
	_composeBlocPolice() {
		const H = [];
		H.push(
			'<div class="EspaceHaut MargeBas">',
			'<div class="InlineBlock AlignementMilieuVertical MargeGauche"><ie-combo ie-model="comboNomPolice"></ie-combo></div>',
			'<div class="InlineBlock AlignementMilieuVertical MargeGauche"><ie-combo ie-model="comboTaillePolice"></ie-combo></div>',
			"</div>",
		);
		return H.join("");
	}
}
class ObjetParametrageGenerationPdf_ReleveDeCompetences extends ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({ avecPolices: false, avecPolice: true });
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			rbChoixReleveCompetences: {
				getValue: function (aDesEleves) {
					return aInstance._optionsPDF.desEleves === aDesEleves;
				},
				setValue: function (aDesEleves) {
					aInstance._optionsPDF.desEleves = aDesEleves;
				},
			},
		});
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, { desEleves: this._optionsPDF.desEleves });
	}
	composePage(aHtml) {
		const lAvecChoixReleve = !!this._parametres.eleve;
		if (lAvecChoixReleve) {
			const lLibelleChoixImpressionUnique =
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.ReleveDeCompetences.choixReleve_DeLEleve",
				);
			const lLibelleImpressionMultiple =
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.ReleveDeCompetences.choixReleve_Eleves",
				);
			aHtml.push(
				'<div style="padding:5px;',
				ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.themeNeutre.claire),
				'">',
				'<div class="Gras PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.ReleveDeCompetences.choixReleve",
				),
				"</div>",
				'<ie-radio ie-model="rbChoixReleveCompetences(false)" style="padding: 3px;">',
				ObjetChaine_1.GChaine.insecable(lLibelleChoixImpressionUnique),
				"</ie-radio>",
				'<ie-radio ie-model="rbChoixReleveCompetences(true)" style="padding: 3px;">',
				ObjetChaine_1.GChaine.insecable(lLibelleImpressionMultiple),
				"</ie-radio>",
				"</div>",
			);
		}
		super.composePage(aHtml);
	}
}
class ObjetParametrageGenerationPdf_AppreciationsProf extends ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({ avecPolices: false });
		this.setOptionsPdf({
			avecPhotoEleves: false,
			adapterHauteurService: false,
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbAvecPhotosEleves: {
				getValue: function () {
					return aInstance._optionsPDF.avecPhotoEleves;
				},
				setValue: function (aValue) {
					aInstance._optionsPDF.avecPhotoEleves = aValue;
				},
			},
		});
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, {
			adapterHauteurService: this._optionsPDF.adapterHauteurService,
			avecPhotoEleves: this._optionsPDF.avecPhotoEleves,
		});
	}
	composePage(aHtml) {
		super.composePage(aHtml);
		aHtml.push(
			'<ie-checkbox ie-model="_optionsPDF.adapterHauteurService" style="padding-top:1em;">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.ReleveNotes.AdapterHauteurApp",
				) +
				"</ie-checkbox>",
		);
		aHtml.push(
			'<ie-checkbox ie-model="cbAvecPhotosEleves" style="padding-top:1em; padding-bottom : 1em;">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.AvecPhotosEleves",
				) +
				"</ie-checkbox>",
		);
	}
}
class ObjetParametrageGenerationPdf_AppreciationsGenerales extends ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({ avecPolices: false });
		this.setOptionsPdf({ avecPhotoEleves: false });
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbAvecPhotosEleves: {
				getValue: function () {
					return aInstance._optionsPDF.avecPhotoEleves;
				},
				setValue: function (aValue) {
					aInstance._optionsPDF.avecPhotoEleves = aValue;
				},
			},
		});
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, {
			avecPhotoEleves: this._optionsPDF.avecPhotoEleves,
		});
	}
	composePage(aHtml) {
		super.composePage(aHtml);
		aHtml.push(
			'<ie-checkbox ie-model="cbAvecPhotosEleves" style="padding-top:1em; padding-bottom : 1em;">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.AvecPhotosEleves",
				) +
				"</ie-checkbox>",
		);
	}
}
class ObjetParametrageGenerationPdf_RecapCahierJournal extends ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({ avecPolices: false });
		this.listeMatieres = new ObjetListeElements_1.ObjetListeElements();
		this.nbrMaxFiltre = 0;
		this.selecDateDebut = ObjetIdentite_1.Identite.creerInstance(
			ObjetCelluleDate_1.ObjetCelluleDate,
			{
				pere: this,
				evenement: function (aDate) {
					if (
						this._optionsPDF.dateDebut &&
						!ObjetDate_1.GDate.estDateEgale(this._optionsPDF.dateDebut, aDate)
					) {
						this._optionsPDF.dateDebut = aDate;
						if (this._optionsPDF && this._optionsPDF.dateFin) {
							this.selecDateFin.setPremiereDateSaisissable(
								this._optionsPDF.dateDebut,
								true,
							);
						}
					}
				},
			},
		);
		this.selecDateDebut.setOptionsObjetCelluleDate({
			formatDate: "%JJJ %JJ/%MM/%AAAA",
			largeurComposant: 100,
			labelWAI: ObjetTraduction_1.GTraductions.getValeur("Du"),
		});
		this.selecDateFin = ObjetIdentite_1.Identite.creerInstance(
			ObjetCelluleDate_1.ObjetCelluleDate,
			{
				pere: this,
				evenement: function (aDate) {
					if (
						this._optionsPDF.dateFin &&
						!ObjetDate_1.GDate.estDateEgale(this._optionsPDF.dateFin, aDate)
					) {
						this._optionsPDF.dateFin = aDate;
						if (this._optionsPDF && this._optionsPDF.dateDebut) {
							this.selecDateDebut.setOptionsObjetCelluleDate({
								derniereDate: this._optionsPDF.dateFin,
							});
						}
					}
				},
			},
		);
		this.selecDateFin.setOptionsObjetCelluleDate({
			formatDate: "%JJJ %JJ/%MM/%AAAA",
			largeurComposant: 100,
			labelWAI: ObjetTraduction_1.GTraductions.getValeur("Au"),
		});
		this.setOptionsPdf({
			dateDebut: null,
			dateFin: null,
			filtreMatieres: new ObjetListeElements_1.ObjetListeElements(),
			avecDuree: true,
			avecDescription: true,
			avecLibelles: true,
			avecObjectifs: true,
			avecElementsDeProgramme: true,
		});
	}
	setParametres(aParametres, aOptionsPDF) {
		aOptionsPDF.dateDebut = aParametres.dateDebut;
		aParametres.dateDebut = undefined;
		aOptionsPDF.dateFin = aParametres.dateFin;
		aParametres.dateFin = undefined;
		aOptionsPDF.filtreMatieres = aParametres.filtreMatieres;
		aParametres.filtreMatieres = undefined;
		if (!!aOptionsPDF.filtreMatieres) {
			aOptionsPDF.filtreMatieres.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
			let lToutesMatieres = false;
			if (
				aOptionsPDF.filtreMatieres.count() === this.nbrMaxFiltre ||
				aOptionsPDF.filtreMatieres.count() === 0
			) {
				lToutesMatieres = true;
			}
			$.extend(aOptionsPDF, {
				toutesLesMatieres: lToutesMatieres,
				filtreMatieres: aOptionsPDF.filtreMatieres,
			});
		}
		this.listeMatieres = aParametres.listeMatieres;
		this.nbrMaxFiltre = aParametres.nbrMaxFiltre;
		aParametres.listeMatieres = undefined;
		aParametres.nbrMaxFiltre = undefined;
		super.setParametres(aParametres, aOptionsPDF);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			comboFiltre: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie(
						Object.assign(
							{
								longueur: 280,
								multiSelection: true,
								avecElementObligatoire: true,
								largeurListe: 300,
								estLargeurAuto: false,
								labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
									"CahierJournal.PourLesMatieres",
								),
							},
							aInstance._getOptionsComboMatiere(aInstanceCombo),
						),
					);
				},
				getDonnees: function (aDonnees, aObjsaisie) {
					if (!aDonnees && aInstance && !!aInstance.listeMatieres) {
						aObjsaisie.nbrMax = aInstance.nbrMaxFiltre;
						return aInstance.listeMatieres;
					}
				},
				getIndiceSelection: function () {
					const lResult = aInstance._optionsPDF.filtreMatieres;
					return lResult;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.listeSelections &&
						!aParametres.listeSelections.preventionBoucle
					) {
						aInstance._optionsPDF.filtreMatieres = aParametres.listeSelections;
					}
				},
				getDisabled: function () {
					return false;
				},
			},
			cbDuree: {
				getValue: function () {
					return aInstance._optionsPDF.avecDuree;
				},
				setValue: function (aValue) {
					aInstance._optionsPDF.avecDuree = aValue;
				},
			},
			cbDescription: {
				getValue: function () {
					return aInstance._optionsPDF.avecDescription;
				},
				setValue: function (aValue) {
					aInstance._optionsPDF.avecDescription = aValue;
				},
			},
			cbLibelles: {
				getValue: function () {
					return aInstance._optionsPDF.avecLibelles;
				},
				setValue: function (aValue) {
					aInstance._optionsPDF.avecLibelles = aValue;
				},
			},
			cbObjectifs: {
				getValue: function () {
					return aInstance._optionsPDF.avecObjectifs;
				},
				setValue: function (aValue) {
					aInstance._optionsPDF.avecObjectifs = aValue;
				},
			},
			cbElementsdeProgramme: {
				getValue: function () {
					return aInstance._optionsPDF.avecElementsDeProgramme;
				},
				setValue: function (aValue) {
					aInstance._optionsPDF.avecElementsDeProgramme = aValue;
				},
			},
			getNodeSelecDateDebut: function () {
				const lDate =
					aInstance._optionsPDF && aInstance._optionsPDF.dateDebut
						? aInstance._optionsPDF.dateDebut
						: ObjetDate_1.GDate.aujourdhui;
				aInstance.selecDateDebut.initialiser();
				aInstance.selecDateDebut.setParametresFenetre(
					GParametres.PremierLundi,
					GParametres.PremiereDate,
					GParametres.DerniereDate,
					GParametres.JoursOuvres,
					null,
					GParametres.JoursFeries,
					null,
					null,
				);
				if (aInstance._optionsPDF && aInstance._optionsPDF.dateFin) {
					aInstance.selecDateDebut.setOptionsObjetCelluleDate({
						derniereDate: aInstance._optionsPDF.dateFin,
					});
				}
				aInstance.selecDateDebut.setDonnees(lDate);
			},
			getNodeSelecDateFin: function () {
				const lDate =
					aInstance._optionsPDF && aInstance._optionsPDF.dateFin
						? aInstance._optionsPDF.dateFin
						: GParametres.DerniereDate;
				aInstance.selecDateFin.initialiser();
				aInstance.selecDateDebut.setParametresFenetre(
					GParametres.PremierLundi,
					GParametres.PremiereDate,
					GParametres.DerniereDate,
					GParametres.JoursOuvres,
					null,
					GParametres.JoursFeries,
					null,
					null,
				);
				if (aInstance._optionsPDF && aInstance._optionsPDF.dateDebut) {
					aInstance.selecDateFin.setPremiereDateSaisissable(
						aInstance._optionsPDF.dateDebut,
						true,
					);
				}
				aInstance.selecDateFin.setDonnees(lDate);
			},
		});
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		this._optionsPDF.filtreMatieres.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		let lToutesMatieres = false;
		if (
			this._optionsPDF.filtreMatieres.count() === this.nbrMaxFiltre ||
			this._optionsPDF.filtreMatieres.count() === 0
		) {
			lToutesMatieres = true;
		}
		$.extend(aParametres, {
			dateDebut: this._optionsPDF.dateDebut,
			dateFin: this._optionsPDF.dateFin,
			toutesLesMatieres: lToutesMatieres,
			filtreMatieres: this._optionsPDF.filtreMatieres,
			avecDuree: this._optionsPDF.avecDuree,
			avecDescription: this._optionsPDF.avecDescription,
			avecLibelles: this._optionsPDF.avecLibelles,
			avecObjectifs: this._optionsPDF.avecObjectifs,
			avecElementsDeProgramme: this._optionsPDF.avecElementsDeProgramme,
		});
	}
	composePage(aHtml) {
		aHtml.push(_composePeriode(this.selecDateDebut, this.selecDateFin));
		aHtml.push(
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Orientation"),
				_composeChoixOrientation(),
				false,
			),
		);
		aHtml.push(
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.ContenuOptionnel",
				),
				this._composeOptionnel(),
				false,
			),
		);
	}
	_getOptionsComboMatiere(aInstanceCombo) {
		return {
			getContenuElement: function (aParams) {
				const T = [
					'<div style="display:flex; align-items:center; height:20px; padding:1px 0;">',
				];
				let lLeft = 0;
				if (aParams.element.autreMatiere) {
					lLeft += 36;
				}
				if (aParams.element.cumul > 1) {
					lLeft += 6;
				}
				T.push(
					'<div style="height:',
					aParams.element.cumul > 1 ? "6px;" : "100%;",
					"min-width:6px; margin-right: 3px; ",
					lLeft > 0 ? "margin-left:" + lLeft + "px; " : "",
					aParams.element.couleur
						? ObjetStyle_1.GStyle.composeCouleurFond(aParams.element.couleur)
						: "",
					aParams.element.cumul > 1
						? "border-radius:6px;"
						: "border-radius:6px 0 0 6px;",
					'"></div>',
					"<div ie-ellipsis-fixe>",
					aParams.element.getLibelle(),
					"</div>",
				);
				T.push("</div>");
				return T.join("");
			},
			getLibelleCelluleMultiSelection: (aListeSelections) => {
				if (
					!aListeSelections ||
					aListeSelections.count() === 0 ||
					aListeSelections.count() === aInstanceCombo.nbrMax
				) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierJournal.ToutesMatieres",
					);
				}
				return aListeSelections
					? aListeSelections.getTableauLibelles().join(", ")
					: "";
			},
			getClassElement: function (aParams) {
				return aParams.element && aParams.element.cumul > 0
					? "element-indentation"
					: "";
			},
			getEstElementNonSelectionnable: function (aElement) {
				return !!aElement.autreMatiere;
			},
			getInfosElementCB: function (aElement) {
				const lEstCumul = aElement.estCumul;
				return {
					estCumul: lEstCumul,
					estFilsCumul: function (aFils) {
						return (
							!aFils.autreMatiere &&
							aElement.getGenre() === aFils.pere.getGenre() &&
							aElement.getNumero() === aFils.pere.getNumero()
						);
					},
				};
			},
		};
	}
	_composeOptionnel() {
		const T = [];
		T.push('<div style="padding: .4rem; margin-top: .4rem;">');
		T.push(
			'<div><ie-combo ie-model="comboFiltre" style="padding-top: .4rem; padding-bottom: .8rem;"></ie-combo></div>',
		);
		T.push(
			'<div><ie-checkbox ie-model="cbDuree" style="padding-top: .8rem; padding-bottom: .8rem;">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.CahierJournal.Duree",
				) +
				"</ie-checkbox></div>",
		);
		T.push(
			'<div><ie-checkbox ie-model="cbDescription" style="padding-top: .8rem; padding-bottom: .8rem;">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.CahierJournal.Description",
				) +
				"</ie-checkbox></div>",
		);
		T.push(
			'<div><ie-checkbox ie-model="cbLibelles" style="padding-top: .8rem; padding-bottom: .8rem;">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.CahierJournal.LibelleRessources",
				) +
				"</ie-checkbox></div>",
		);
		T.push(
			'<div><ie-checkbox ie-model="cbObjectifs" style="padding-top: .8rem; padding-bottom: .8rem;">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.CahierJournal.Objectifs",
				) +
				"</ie-checkbox></div>",
		);
		T.push(
			'<div><ie-checkbox ie-model="cbElementsdeProgramme" style="padding-top: .8rem; padding-bottom: .4rem;">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.CahierJournal.ElementsdeProgramme",
				) +
				"</ie-checkbox></div>",
		);
		T.push("</div>");
		return T.join("");
	}
}
class ObjetParametrageGenerationPdf_AppelPeriscolaire extends ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({ avecPolices: false });
		this.selecDateDebut = ObjetIdentite_1.Identite.creerInstance(
			ObjetCelluleDate_1.ObjetCelluleDate,
			{
				pere: this,
				evenement: function (aDate) {
					if (
						this._optionsPDF.dateDebut &&
						!ObjetDate_1.GDate.estDateEgale(this._optionsPDF.dateDebut, aDate)
					) {
						this._optionsPDF.dateDebut = aDate;
						if (this._optionsPDF && this._optionsPDF.dateFin) {
							this.selecDateFin.setPremiereDateSaisissable(
								this._optionsPDF.dateDebut,
								true,
							);
						}
					}
				},
			},
		);
		this.selecDateDebut.setOptionsObjetCelluleDate({
			formatDate: "%JJJ %JJ/%MM/%AAAA",
			largeurComposant: 100,
		});
		this.selecDateFin = ObjetIdentite_1.Identite.creerInstance(
			ObjetCelluleDate_1.ObjetCelluleDate,
			{
				pere: this,
				evenement: function (aDate) {
					if (
						this._optionsPDF.dateFin &&
						!ObjetDate_1.GDate.estDateEgale(this._optionsPDF.dateFin, aDate)
					) {
						this._optionsPDF.dateFin = aDate;
						if (this._optionsPDF && this._optionsPDF.dateDebut) {
							this.selecDateDebut.setOptionsObjetCelluleDate({
								derniereDate: this._optionsPDF.dateFin,
							});
						}
					}
				},
			},
		);
		this.selecDateFin.setOptionsObjetCelluleDate({
			formatDate: "%JJJ %JJ/%MM/%AAAA",
			largeurComposant: 100,
		});
		this.setOptionsPdf({
			dateDebut: null,
			dateFin: null,
			avecSignature: false,
		});
	}
	setParametres(aParametres, aOptionsPDF) {
		if (!aOptionsPDF.dateDebut && aParametres.date) {
			aOptionsPDF.dateDebut = aParametres.date;
			aOptionsPDF.dateFin = aParametres.date;
		}
		aParametres.date = undefined;
		super.setParametres(aParametres, aOptionsPDF);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbSignature: {
				getValue: function () {
					return aInstance._optionsPDF.avecSignature;
				},
				setValue: function (aValue) {
					aInstance._optionsPDF.avecSignature = aValue;
				},
			},
			getNodeSelecDateDebut: function () {
				const lDate =
					aInstance._optionsPDF && aInstance._optionsPDF.dateDebut
						? aInstance._optionsPDF.dateDebut
						: ObjetDate_1.GDate.aujourdhui;
				aInstance.selecDateDebut.initialiser();
				aInstance.selecDateDebut.setParametresFenetre(
					GParametres.PremierLundi,
					GParametres.PremiereDate,
					GParametres.DerniereDate,
					GParametres.JoursOuvres,
					null,
					GParametres.JoursFeries,
					null,
					null,
				);
				if (aInstance._optionsPDF && aInstance._optionsPDF.dateFin) {
					aInstance.selecDateDebut.setOptionsObjetCelluleDate({
						derniereDate: aInstance._optionsPDF.dateFin,
					});
				}
				aInstance.selecDateDebut.setDonnees(lDate);
			},
			getNodeSelecDateFin: function () {
				const lDate =
					aInstance._optionsPDF && aInstance._optionsPDF.dateFin
						? aInstance._optionsPDF.dateFin
						: GParametres.DerniereDate;
				aInstance.selecDateFin.initialiser();
				aInstance.selecDateDebut.setParametresFenetre(
					GParametres.PremierLundi,
					GParametres.PremiereDate,
					GParametres.DerniereDate,
					GParametres.JoursOuvres,
					null,
					GParametres.JoursFeries,
					null,
					null,
				);
				if (aInstance._optionsPDF && aInstance._optionsPDF.dateDebut) {
					aInstance.selecDateFin.setPremiereDateSaisissable(
						aInstance._optionsPDF.dateDebut,
						true,
					);
				}
				aInstance.selecDateFin.setDonnees(lDate);
			},
		});
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, {
			dateDebut: this._optionsPDF.dateDebut,
			dateFin: this._optionsPDF.dateFin,
			avecSignature: this._optionsPDF.avecSignature,
		});
	}
	composePage(aHtml) {
		aHtml.push(_composePeriode(this.selecDateDebut, this.selecDateFin));
		aHtml.push(
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Orientation"),
				_composeChoixOrientation(),
				false,
			),
		);
		aHtml.push(
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.ContenuOptionnel",
				),
				this.composeOptionnel(),
				false,
			),
		);
	}
	composeOptionnel() {
		const T = [];
		T.push('<div style="padding: .4rem; margin-top: .4rem;">');
		T.push(
			'<div><ie-checkbox ie-model="cbSignature" style="padding-top: .8rem; padding-bottom: .8rem;">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.AppelPeriscolaire.Signature",
				) +
				"</ie-checkbox></div>",
		);
		T.push("</div>");
		return T.join("");
	}
}
class ObjetParametrageGenerationPdf_Evaluation extends ObjetFenetre_GenerationPdf_1.ObjetParametrageGenerationPdf {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({ avecPolices: false });
		this.setOptionsPdf({ tableauGeneral: true });
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			rbTableauGeneral: {
				getValue: function (aTableauGeneral) {
					return aInstance._optionsPDF.tableauGeneral === aTableauGeneral;
				},
				setValue: function (aTableauGeneral) {
					aInstance._optionsPDF.tableauGeneral = aTableauGeneral;
				},
			},
		});
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, { tableauGeneral: this._optionsPDF.tableauGeneral });
	}
	composePage(aHtml) {
		aHtml.push(
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.ChoixImpression",
				),
				this.composeOptionnel(),
				false,
			),
		);
		aHtml.push(
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Orientation"),
				_composeChoixOrientation(),
				false,
			),
		);
	}
	composeOptionnel() {
		const T = [];
		T.push('<fieldset style="padding: .4rem; margin-top: .4rem;">');
		T.push(
			'<ie-radio ie-model="rbTableauGeneral(true)" class="p-all">',
			ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.Evaluation.tableauGeneral",
			),
			"</ie-radio>",
		);
		T.push(
			'<ie-radio ie-model="rbTableauGeneral(false)" class="p-all">',
			ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.Evaluation.cartouches",
			),
			"</ie-radio>",
		);
		T.push("</fieldset>");
		return T.join("");
	}
}
function _composeChoixOrientation() {
	const T = [];
	T.push('<div style="padding: .4rem; margin-top: .4rem;">');
	T.push(
		'<ie-radio ie-model="rbPortrait(true)" style="margin:.2rem; vertical-align: middle;">',
		ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Portrait"),
		"</ie-radio>",
	);
	T.push(
		'<ie-radio ie-model="rbPortrait(false)" style="margin: .2rem .2rem .2rem 1rem; vertical-align: middle;">',
		ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Paysage"),
		"</ie-radio>",
	);
	T.push("</div>");
	return T.join("");
}
function _composePeriode(aCelluleDateDebut, aCelluleDateFin) {
	const T = [];
	T.push(
		'<div style="padding: .8rem; margin-bottom: .4rem; ',
		ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.themeNeutre.legere),
		'">',
	);
	T.push(
		'<div class="Gras" style="padding: .4rem;">',
		ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.PeriodeAGenerer"),
		"</div>",
	);
	T.push(
		'<div style="padding: .4rem; display: flex; align-items: center;"><span>',
		ObjetTraduction_1.GTraductions.getValeur("Du").ucfirst(),
		'</span> <div id="',
		aCelluleDateDebut.getNom(),
		'" ie-node="getNodeSelecDateDebut" style="margin: 0 .4rem;">',
		"</div> <span>",
		ObjetTraduction_1.GTraductions.getValeur("Au"),
		'</span> <div id="',
		aCelluleDateFin.getNom(),
		'" ie-node="getNodeSelecDateFin" style="margin: 0 .4rem;">',
		"</div></div>",
	);
	T.push("</div>");
	return T.join("");
}
