const { PageCahierDeTexte_Mobile } = require("PageCahierDeTexte_Mobile.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { TypeDomaine } = require("TypeDomaine.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const {
	ObjetRequetePageCahierDeTexte,
} = require("ObjetRequetePageCahierDeTexte.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { GDate } = require("ObjetDate.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	ObjetRequeteSaisieTAFFaitEleve,
} = require("ObjetRequeteSaisieTAFFaitEleve.js");
const {
	ObjetUtilitaireCahierDeTexte,
} = require("ObjetUtilitaireCahierDeTexte.js");
const { GHtml } = require("ObjetHtml.js");
const { tag } = require("tag.js");
const {
	ObjetCahierDeTexte_MobileCP,
	GenreModeAffichageTAFMobile,
} = require("InterfacePageCahierDeTexte_MobileCP.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { ObjetDeserialiser } = require("ObjetDeserialiser.js");
const { ObjetGalerieCarrousel } = require("ObjetGalerieCarrousel.js");
const { TypeGenreMiniature } = require("TypeGenreMiniature.js");
Requetes.inscrire("donneesContenusCDT", ObjetRequeteConsultation);
class InterfacePageCahierDeTexte_Mobile extends ObjetCahierDeTexte_MobileCP {
	constructor(...aParams) {
		super(...aParams);
		this.utilitaireCDT = new ObjetUtilitaireCahierDeTexte(
			this.Nom + ".utilitaireCDT",
			this,
			this.surUtilitaireCDT,
		);
		this.domaineCourant = null;
		this.cycleCourant = null;
		this.genreModeAffCDC = { contenu: 0, ressource: 1 };
		this.listeTabsCDC = new ObjetListeElements();
	}
	creerInstanceCalendrier() {
		return this.add(
			ObjetCelluleDate,
			this.evenementSurCalendrier,
			this.initialiserCalendrier,
		);
	}
	creerInstancePage() {
		return this.add(PageCahierDeTexte_Mobile, this.evenementSurPage);
	}
	construireInstances() {
		this.instanceFiltreTheme = Identite.creerInstance(ObjetSelection, {
			pere: this,
			evenement: _evntFiltreThemes.bind(this),
			options: {
				avecBoutonsPrecedentSuivant: false,
				labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionTheme"),
			},
		});
		super.construireInstances();
		this.estAffichageTAF =
			GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.CDT_TAF;
		this.estAffichageContenu =
			GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.CDT_Contenu;
		if (this.estAffichageContenu) {
			this.identTabs = this.add(
				ObjetTabOnglets,
				this.eventModeAffCDC,
				(aInstance) => {
					aInstance.setOptions({ avecSwipe: false });
				},
			);
			const lElementCDCContenu = new ObjetElement(
				GTraductions.getValeur("CahierDeTexte.contenu"),
				null,
				this.genreModeAffCDC.contenu,
				null,
				true,
			);
			this.listeTabsCDC.addElement(lElementCDCContenu);
			const lElementCDCRessource = new ObjetElement(
				GTraductions.getValeur("CahierDeTexte.ressources"),
				null,
				this.genreModeAffCDC.ressource,
				null,
				true,
			);
			this.listeTabsCDC.addElement(lElementCDCRessource);
			this.AddSurZone = [];
			this.AddSurZone.push(this.identTabs);
			this.AddSurZone.push({ html: _composeFiltresContenu.call(this) });
		}
	}
	eventModeAffCDC(aParam) {
		if (aParam) {
			switch (aParam.getGenre()) {
				case this.genreModeAffCDC.contenu:
					this.selectModeAffCDC = this.genreModeAffCDC.contenu;
					$(
						"#" + this.getInstance(this.identCalendrier).getNom().escapeJQ(),
					).show();
					this.listeMatieres = _getListeMatieres.call(this);
					this.listeThemes = _getListeThemes.call(this);
					if (this.instanceFiltreMatieres) {
						this.instanceFiltreMatieres.setDonnees(
							this.listeMatieres,
							this.listeMatieres.getIndiceParElement(
								this.listeMatieres.getElementParNumero(
									this.filtreMatiere ? this.filtreMatiere.getNumero() : null,
								),
							),
						);
					} else {
						this.actualiser();
					}
					break;
				case this.genreModeAffCDC.ressource:
					this.selectModeAffCDC = this.genreModeAffCDC.ressource;
					$(
						"#" + this.getInstance(this.identCalendrier).getNom().escapeJQ(),
					).hide();
					new ObjetRequetePageCahierDeTexte(
						this,
						this.actionSurRessourcePeda,
					).lancerRequete({
						domaine: new TypeDomaine(this.cycleCourant),
						estRequeteRP: true,
					});
					break;
				default:
					break;
			}
		}
	}
	eventModeAffTAF(aParam) {
		if (aParam) {
			switch (aParam.getGenre()) {
				case GenreModeAffichageTAFMobile.AVenir:
					this.selectModeAffTAF = GenreModeAffichageTAFMobile.AVenir;
					$(
						"#" + this.getInstance(this.identCalendrier).getNom().escapeJQ(),
					).hide();
					new ObjetRequetePageCahierDeTexte(
						this,
						this.actionSurCalendrier,
					).lancerRequete({ date: GDate.aujourdhui });
					break;
				case GenreModeAffichageTAFMobile.hebdomadaire:
					this.selectModeAffTAF = GenreModeAffichageTAFMobile.hebdomadaire;
					$(
						"#" + this.getInstance(this.identCalendrier).getNom().escapeJQ(),
					).show();
					this.getInstance(this.identCalendrier).setDonnees(
						this.dateCourant,
						true,
					);
					break;
				default:
					break;
			}
		}
	}
	actualiser() {
		let lDonnees = this.formatDonnees();
		let lAvecFiltrage = this.filtreMatiere !== null;
		this.getInstance(this.identPage).setDonnees(
			this.Pere.GenreOnglet,
			lDonnees,
			this.cycleCourant,
			lAvecFiltrage,
			this.filtreMatiere,
			this.ListeTravailAFaire,
			this.estAffichageContenu &&
				this.selectModeAffCDC === this.genreModeAffCDC.ressource,
		);
	}
	formatDonnees() {
		let lListeTAF = new ObjetListeElements();
		let lListeCDC = new ObjetListeElements();
		let llTestFiltreMatiere;
		if (this.estAffichageTAF) {
			lListeTAF = this.ListeTravailAFaire.getListeElements((aElement) => {
				const lFait = aElement.executionQCM
					? aElement.QCMFait
					: aElement.TAFFait;
				const lTestFiltreTAF =
					(this.inclureTAFFait && lFait) || (this.inclureTAFAFaire && !lFait);
				llTestFiltreMatiere =
					!this.filtreMatiere ||
					this.filtreMatiere.getNumero() === aElement.Matiere.getNumero();
				return lTestFiltreTAF && llTestFiltreMatiere;
			});
			if (this.filtreThemes) {
				lListeTAF = lListeTAF.getListeElements((aElement) => {
					let lTestTheme = false;
					if (aElement.ListeThemes && aElement.ListeThemes.count()) {
						aElement.ListeThemes.parcourir((aTheme) => {
							if (aTheme.getNumero() === this.filtreThemes.getNumero()) {
								lTestTheme = true;
							}
						});
					}
					return lTestTheme;
				});
			}
			return lListeTAF;
		} else {
			if (this.selectModeAffCDC === this.genreModeAffCDC.contenu) {
				this.ListeCahierDeTextes.parcourir((aEl) => {
					lListeCDC.add(Object.assign(new ObjetElement(), aEl));
				});
				lListeCDC = lListeCDC.getListeElements((aElement) => {
					llTestFiltreMatiere =
						!this.filtreMatiere ||
						this.filtreMatiere.getNumero() === aElement.Matiere.getNumero();
					return llTestFiltreMatiere;
				});
				if (this.filtreThemes) {
					lListeCDC.parcourir((aCDT) => {
						aCDT.listeContenus = aCDT.listeContenus.getListeElements(
							(aContenu) => {
								let lTestTheme = false;
								if (aContenu.ListeThemes && aContenu.ListeThemes.count()) {
									aContenu.ListeThemes.parcourir((aTheme) => {
										if (aTheme.getNumero() === this.filtreThemes.getNumero()) {
											lTestTheme = true;
										}
									});
								}
								return lTestTheme;
							},
						);
					});
					lListeCDC = lListeCDC.getListeElements((aElement) => {
						return !!aElement.listeContenus.count();
					});
				}
			} else {
				if (this.listeRessourcesPedagogiques) {
					lListeCDC = this.listeRessourcesPedagogiques.getListeElements(
						(aElement) => {
							llTestFiltreMatiere =
								!this.filtreMatiere ||
								this.filtreMatiere.getNumero() === aElement.matiere.getNumero();
							return llTestFiltreMatiere;
						},
					);
					if (this.filtreThemes) {
						lListeCDC = lListeCDC.getListeElements((aRessource) => {
							let lTestTheme = false;
							if (aRessource.ListeThemes && aRessource.ListeThemes.count()) {
								aRessource.ListeThemes.parcourir((aTheme) => {
									if (aTheme.getNumero() === this.filtreThemes.getNumero()) {
										lTestTheme = true;
									}
								});
							}
							return lTestTheme;
						});
					}
				}
			}
			return lListeCDC;
		}
	}
	actualiserFiltreTheme(aListeThemes) {
		if (aListeThemes) {
			const lListeThemes = MethodesObjet.dupliquer(aListeThemes);
			if (lListeThemes) {
				lListeThemes.parcourir((aTheme) => {
					if (aTheme.Matiere) {
						aTheme.setLibelle(
							aTheme.getLibelle() + "<br>" + aTheme.Matiere.getLibelle(),
						);
					}
				});
			}
			this.instanceFiltreTheme.setDonnees(
				lListeThemes,
				lListeThemes.getIndiceParElement(this.filtreThemes),
			);
		}
	}
	initialiserCalendrier(aInstance) {
		aInstance.setOptionsObjetCelluleDate({
			avecBoutonsPrecedentSuivant: true,
			avecSelectionSemaine: true,
			joursSemaineValide: GParametres.JoursOuvres,
			joursFeries: GParametres.JoursFeries,
		});
	}
	recupererDonnees() {
		$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).css(
			"min-height",
			(parseInt($("#" + this.Nom.escapeJQ()).css("min-height")) -
				$(
					"#" + this.getInstance(this.identCalendrier).getNom().escapeJQ(),
				).height()) *
				0.9 +
				"px",
		);
		this.actionSurRecupererDonnees();
	}
	actionSurRecupererDonnees() {
		if (!this.dateCourant) {
			this.dateCourant = !!GEtatUtilisateur.getDerniereDate()
				? GEtatUtilisateur.getDerniereDate()
				: GEtatUtilisateur.getNavigationDate()
					? GEtatUtilisateur.getNavigationDate()
					: GDate.aujourdhui;
		}
		if (this.estAffichageTAF) {
			if (this.selectModeAffTAF === undefined) {
				let lContexteTAF = GEtatUtilisateur.getContexteTAF();
				if (lContexteTAF) {
					this.inclureTAFFait = lContexteTAF.inclureTAFFait;
					this.inclureTAFAFaire = lContexteTAF.inclureTAFAFaire;
					this.filtreMatiere = lContexteTAF.filtreMatiere;
					this.filtreThemes = lContexteTAF.filtreThemes;
					GEtatUtilisateur.setContexteTAF();
				}
				this.selectModeAffTAF =
					!!lContexteTAF && lContexteTAF.modeAffTAF
						? lContexteTAF.modeAffTAF
						: GenreModeAffichageTAFMobile.AVenir;
				this.getInstance(this.identTabs).setDonnees(this.listeTabs);
			}
			this.getInstance(this.identTabs).selectOnglet(
				this.listeTabs.getIndiceParNumeroEtGenre(null, this.selectModeAffTAF),
			);
		} else {
			this.getInstance(this.identCalendrier).setDonnees(this.dateCourant, true);
		}
		$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).css(
			"min-height",
			(parseInt($("#" + this.Nom.escapeJQ()).css("min-height")) -
				$(
					"#" + this.getInstance(this.identCalendrier).getNom().escapeJQ(),
				).height()) *
				0.9 +
				"px",
		);
	}
	evenementSurCalendrier(aDate) {
		let lDate = aDate;
		this.cycleCourant = IE.Cycles.cycleDeLaDate(lDate);
		this.dateCourant = lDate;
		GEtatUtilisateur.setDerniereDate(lDate);
		new ObjetRequetePageCahierDeTexte(
			this,
			this.actionSurCalendrier,
		).lancerRequete({
			domaine: new TypeDomaine(this.cycleCourant),
			sansRequeteRP: true,
		});
	}
	evenementSurPage(aObjet) {
		if (!aObjet || aObjet.date) {
			this.dateCourant = aObjet ? aObjet.date : this.dateCourant;
			this.apresModificationTAF = true;
			if (this.donnee) {
				if (this.fenetre) {
					this.fenetre.fermer();
				}
				Requetes(
					"donneesContenusCDT",
					this,
					_actionApresRequeteDonneesTAFCDT.bind(this, {
						contexte: this.donnee,
						pourLe: true,
					}),
				).lancerRequete({
					cahierDeTextes: new ObjetElement("", this.donnee.getNumero()),
					pourTAF: true,
				});
			} else {
				this.recupererDonnees();
			}
		}
		if (aObjet && aObjet.taf) {
			Requetes(
				"donneesContenusCDT",
				this,
				_actionApresRequeteDonneesContenusCDT,
			).lancerRequete({ cahierDeTextes: aObjet.taf.cahierDeTextes });
			return;
		}
		if (aObjet && aObjet.cours) {
			Requetes(
				"donneesContenusCDT",
				this,
				_actionApresRequeteDonneesTAFCDT.bind(this, {
					contexte: aObjet.cours,
					pourLe: true,
				}),
			).lancerRequete({
				cahierDeTextes: new ObjetElement("", aObjet.cours.getNumero()),
				pourTAF: true,
			});
			return;
		}
		let lExecutionQCM = null,
			i,
			j,
			k,
			lElement,
			lContenu;
		if (this.estAffichageTAF) {
			if (aObjet && aObjet.CDT) {
				lElement = aObjet.CDT;
				for (
					j = 0;
					lElement.listeContenus && j < lElement.listeContenus.count();
					j++
				) {
					lContenu = lElement.listeContenus.get(j);
					for (
						k = 0;
						lContenu.listeExecutionQCM &&
						k < lContenu.listeExecutionQCM.count();
						k++
					) {
						lExecutionQCM = lContenu.listeExecutionQCM.get(k);
						if (
							lExecutionQCM &&
							lExecutionQCM.getNumero() === aObjet.executionQCM
						) {
							break;
						}
					}
					if (
						lExecutionQCM &&
						lExecutionQCM.getNumero() === aObjet.executionQCM
					) {
						break;
					}
				}
			} else {
				for (i = 0; i < this.ListeTravailAFaire.count(); i++) {
					lElement = this.ListeTravailAFaire.get(i);
					if (
						lElement.executionQCM &&
						!!aObjet &&
						!!aObjet.executionQCM &&
						lElement.executionQCM.getNumero() === aObjet.executionQCM
					) {
						lExecutionQCM = lElement.executionQCM;
						break;
					}
				}
			}
			GEtatUtilisateur.setContexteTAF({
				modeAffTAF: this.selectModeAffTAF,
				inclureTAFFait: this.inclureTAFFait,
				inclureTAFAFaire: this.inclureTAFAFaire,
				filtreMatiere: this.filtreMatiere,
				filtreThemes: this.filtreThemes,
			});
		} else if (this.estAffichageContenu) {
			if (aObjet && aObjet.estRessource) {
				this.listeRessourcesPedagogiques.parcourir((D) => {
					if (D.ressource && D.ressource.getNumero() === aObjet.executionQCM) {
						lExecutionQCM = D.ressource;
						return false;
					}
				});
			} else if (aObjet && aObjet.CDT) {
				lContenu = aObjet.CDT;
				for (i = 0; i < lContenu.ListeTravailAFaire.count(); i++) {
					lElement = lContenu.ListeTravailAFaire.get(i);
					if (
						lElement.executionQCM &&
						!!aObjet &&
						!!aObjet.executionQCM &&
						lElement.executionQCM.getNumero() === aObjet.executionQCM
					) {
						lExecutionQCM = lElement.executionQCM;
						break;
					}
				}
			} else {
				for (i = 0; i < this.ListeCahierDeTextes.count(); i++) {
					lElement = this.ListeCahierDeTextes.get(i);
					for (
						j = 0;
						lElement.listeContenus && j < lElement.listeContenus.count();
						j++
					) {
						lContenu = lElement.listeContenus.get(j);
						for (
							k = 0;
							lContenu.listeExecutionQCM &&
							k < lContenu.listeExecutionQCM.count();
							k++
						) {
							lExecutionQCM = lContenu.listeExecutionQCM.get(k);
							if (
								lExecutionQCM &&
								lExecutionQCM.getNumero() === aObjet.executionQCM
							) {
								break;
							}
						}
						if (
							lExecutionQCM &&
							lExecutionQCM.getNumero() === aObjet.executionQCM
						) {
							break;
						}
					}
					if (
						lExecutionQCM &&
						lExecutionQCM.getNumero() === aObjet.executionQCM
					) {
						break;
					}
				}
			}
			GEtatUtilisateur.setContexteCDT({
				modeAffCDC: this.selectModeAffCDC,
				filtreMatiere: this.filtreMatiere,
				filtreThemes: this.filtreThemes,
			});
		}
		if (lExecutionQCM) {
			this.callback.appel({
				genreOnglet: GEtatUtilisateur.genreOnglet,
				executionQCM: lExecutionQCM,
			});
		}
	}
	surUtilitaireCDT() {
		if (this.fenetre) {
			this.fenetre.fermer();
		}
		Requetes(
			"donneesContenusCDT",
			this,
			_actionApresRequeteDonneesTAFCDT.bind(this, {
				contexte: this.donnee,
				pourLe: true,
			}),
		).lancerRequete({
			cahierDeTextes: new ObjetElement("", this.donnee.getNumero()),
			pourTAF: true,
		});
	}
	actionSurCalendrier(aParametres) {
		this.ListeTravailAFaire = aParametres.listeTAF;
		this.ListeCahierDeTextes = aParametres.listeCDT;
		this.listeRessourcesPedagogiques = aParametres.listeRessourcesPedagogiques;
		if (this.estAffichageContenu) {
			if (this.selectModeAffCDC === undefined) {
				let lContexteCDT = GEtatUtilisateur.getContexteCDT();
				if (lContexteCDT) {
					this.filtreMatiere = lContexteCDT.filtreMatiere;
					this.filtreThemes = lContexteCDT.filtreThemes;
					GEtatUtilisateur.setContexteCDT();
				}
				this.selectModeAffCDC =
					!!lContexteCDT && lContexteCDT.modeAffCDC
						? lContexteCDT.modeAffCDC
						: this.genreModeAffCDC.contenu;
				this.getInstance(this.identTabs).setDonnees(this.listeTabsCDC);
			}
			this.getInstance(this.identTabs).selectOnglet(
				this.listeTabs.getIndiceParNumeroEtGenre(null, this.selectModeAffCDC),
			);
		}
		if (
			!(
				this.estAffichageContenu &&
				this.selectModeAffCDC === this.genreModeAffCDC.ressource
			)
		) {
			this.listeMatieres = _getListeMatieres.call(this);
			this.listeThemes = _getListeThemes.call(this);
			if (this.instanceFiltreMatieres) {
				this.instanceFiltreMatieres.setDonnees(
					this.listeMatieres,
					this.listeMatieres.getIndiceParElement(
						this.listeMatieres.getElementParNumero(
							this.filtreMatiere ? this.filtreMatiere.getNumero() : null,
						),
					),
				);
			} else {
				this.actualiser();
			}
		}
		if (!!this.ListeTravailAFaire && this.ListeTravailAFaire.count()) {
			if (!this.apresModificationTAF) {
				const lIdentPageJQ = $(
					"#" + this.getInstance(this.identPage).getNom().escapeJQ(),
				);
				const lPageJQ = $("#" + this.getNom().escapeJQ());
				const lZoneSelectionJQ = $("#" + GApplication.idLigneBandeau);
				const lElementJQ = $(
					"#" + this.getInstance(this.identPage).getNom().escapeJQ(),
				).find(
					'div[data-idDate="' +
						GDate.formatDate(this.dateCourant, "%JJ%MM%AAAA").toString() +
						'"]',
				);
				if (
					this.selectModeAffTAF === GenreModeAffichageTAFMobile.AVenir &&
					!!lElementJQ &&
					!!lElementJQ.get(0) &&
					lElementJQ.get(0).scrollIntoView
				) {
					const lPositionDate = lElementJQ.offset().top;
					lElementJQ.get(0).scrollIntoView();
					$("#" + GApplication.getIdConteneur()).scrollTop(
						lPositionDate -
							(lZoneSelectionJQ.offset().top +
								lZoneSelectionJQ.outerHeight(true)) -
							(lPageJQ.outerHeight(true) - lIdentPageJQ.outerHeight(true)),
					);
					this.dateCourant = GDate.aujourdhui;
				} else {
					$("#" + GApplication.getIdConteneur()).scrollTop(0);
				}
			} else {
				this.apresModificationTAF = false;
			}
		}
	}
	actionSurRessourcePeda(aParams) {
		this.listeRessourcesPedagogiques = aParams.listeRessourcesPedagogiques;
		this.listeMatieres = _getListeMatieres.call(this);
		this.listeThemes = _getListeThemes.call(this);
		if (this.instanceFiltreMatieres) {
			this.instanceFiltreMatieres.setDonnees(
				this.listeMatieres,
				this.listeMatieres.getIndiceParElement(
					this.listeMatieres.getElementParNumero(
						this.filtreMatiere ? this.filtreMatiere.getNumero() : null,
					),
				),
			);
		} else {
			this.actualiser();
		}
	}
}
function _actionApresRequeteDonneesContenusCDT(aJSON) {
	let lDonnee =
		aJSON.ListeCahierDeTextes && aJSON.ListeCahierDeTextes.count() === 1
			? aJSON.ListeCahierDeTextes.getPremierElement()
			: null;
	if (lDonnee) {
		new ObjetDeserialiser().deserialiserCahierDeTexte(lDonnee);
		_afficheFenetreDetail.call(this, lDonnee, false);
	} else {
	}
}
function _actionApresRequeteDonneesTAFCDT(aParams, aJSON) {
	let lDonnee =
		aJSON.ListeCahierDeTextes && aJSON.ListeCahierDeTextes.count() === 1
			? aJSON.ListeCahierDeTextes.getPremierElement()
			: null;
	if (lDonnee) {
		_afficheFenetreDetail.call(this, lDonnee, true);
	} else {
	}
}
function _afficheFenetreDetail(aDonnee, aEstTAF) {
	this.donnee = aDonnee;
	this.fenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
		pere: this,
		evenement: function (aGenreBouton) {
			if (aGenreBouton !== 1) {
				this.donnee = null;
			}
		},
		initialiser: function (aInstance) {
			aInstance.setOptionsFenetre({
				titre: aEstTAF
					? GTraductions.getValeur("CahierDeTexte.TravailAFaire")
					: GTraductions.getValeur("CahierDeTexte.ContenuDuCours"),
				avecCroixFermeture: false,
			});
		},
	});
	$.extend(this.fenetre.controleur, {
		appelQCM: {
			event: function (aDonnee, aNumeroQCM) {
				this.evenementSurPage({ CDT: aDonnee, executionQCM: aNumeroQCM });
			}.bind(this, aDonnee),
		},
		evenementTafFait: {
			getValue: function (aNumeroTaf) {
				const lElement =
					aDonnee.ListeTravailAFaire.getElementParNumero(aNumeroTaf);
				return lElement.TAFFait;
			},
			setValue: function (aNumeroTaf) {
				const lElement =
					aDonnee.ListeTravailAFaire.getElementParNumero(aNumeroTaf);
				if (!!lElement.TAFFait) {
					lElement.TAFFait = false;
				} else {
					lElement.TAFFait = true;
				}
				lElement.setEtat(EGenreEtat.Modification);
				new ObjetRequeteSaisieTAFFaitEleve(this)
					.lancerRequete({ listeTAF: aDonnee.ListeTravailAFaire })
					.then(() => {
						let lHtml;
						lHtml = this.getInstance(this.identPage).composeTAF(
							aDonnee,
							this.fenetre.controleur,
						);
						GHtml.setHtml(this.Nom + "_cont", lHtml, {
							controleur: this.fenetre.controleur,
						});
					});
			}.bind(this),
		},
		getCarrouselTAF(aNumeroTAF) {
			return {
				class: ObjetGalerieCarrousel,
				pere: this,
				init: (aCarrousel) => {
					aCarrousel.setOptions({
						dimensionPhoto: 200,
						nbMaxDiaposEnZoneVisible: 10,
						justifieAGauche: true,
						sansBlocLibelle: true,
						altImage: GTraductions.getValeur("CahierDeTexte.altImage.TAF"),
					});
					aCarrousel.initialiser();
				},
				start: (aCarrousel) => {
					let lTAF = aDonnee.ListeTravailAFaire
						? aDonnee.ListeTravailAFaire.getElementParNumero(aNumeroTAF)
						: aDonnee;
					const lListeDiapos = new ObjetListeElements();
					if (lTAF && lTAF.ListePieceJointe) {
						lTAF.ListePieceJointe.parcourir((aPJ) => {
							if (aPJ.avecMiniaturePossible) {
								let lDiapo = new ObjetElement();
								lDiapo.setLibelle(aPJ.getLibelle());
								aPJ.miniature = TypeGenreMiniature.GM_400;
								lDiapo.documentCasier = aPJ;
								lListeDiapos.add(lDiapo);
							}
						});
					}
					aCarrousel.setDonnees({ listeDiapos: lListeDiapos });
				},
			};
		},
		getCarrouselCDC(aNumeroContenu) {
			return {
				class: ObjetGalerieCarrousel,
				pere: this,
				init: (aCarrousel) => {
					aCarrousel.setOptions({
						dimensionPhoto: 200,
						nbMaxDiaposEnZoneVisible: 10,
						justifieAGauche: true,
						sansBlocLibelle: true,
						altImage: GTraductions.getValeur("CahierDeTexte.altImage.CDC"),
					});
					aCarrousel.initialiser();
				},
				start: (aCarrousel) => {
					let lContenu;
					if (!!aDonnee.listeContenus) {
						aDonnee.listeContenus.parcourir((aCDC) => {
							if (aCDC.getNumero() === aNumeroContenu) {
								lContenu = aCDC;
							}
						});
					}
					const lListeDiapos = new ObjetListeElements();
					if (lContenu && lContenu.ListePieceJointe) {
						lContenu.ListePieceJointe.parcourir((aPJ) => {
							if (aPJ.avecMiniaturePossible) {
								let lDiapo = new ObjetElement();
								lDiapo.setLibelle(aPJ.getLibelle());
								aPJ.miniature = TypeGenreMiniature.GM_400;
								lDiapo.documentCasier = aPJ;
								lListeDiapos.add(lDiapo);
							}
						});
					}
					aCarrousel.setDonnees({ listeDiapos: lListeDiapos });
				},
			};
		},
	});
	this.fenetre.afficher();
	if (aEstTAF) {
		this.fenetre.afficher(
			tag(
				"div",
				{ id: this.Nom + "_cont" },
				this.getInstance(this.identPage).composeTAF(
					aDonnee,
					this.fenetre.controleur,
				),
			),
		);
	} else {
		this.fenetre.afficher(
			tag(
				"div",
				{ id: this.Nom + "_cont" },
				this.getInstance(this.identPage).composeCours(aDonnee),
			),
		);
	}
}
function _composeFiltresContenu() {
	const H = [];
	H.push(
		'<div class="conteneur-entete">',
		tag("div", {
			class: "conteneur-calendrier",
			id: this.getInstance(this.identCalendrier).getNom(),
		}),
		tag("div", { id: this.instanceFiltreMatieres.getNom() }),
		tag("div", { id: this.instanceFiltreTheme.getNom() }),
		"</div>",
	);
	return H.join("");
}
function _getListeMatieres() {
	let lResult = new ObjetListeElements();
	let lMatiereDeLaListe;
	if (this.estAffichageTAF) {
		this.ListeTravailAFaire.parcourir((aElement) => {
			lMatiereDeLaListe = lResult.getElementParNumero(
				aElement.Matiere.getNumero(),
			);
			if (!lMatiereDeLaListe) {
				lMatiereDeLaListe = MethodesObjet.dupliquer(aElement.Matiere);
				lMatiereDeLaListe.nbElementsConcernes = 0;
				lMatiereDeLaListe.couleurFond = aElement.CouleurFond;
				lResult.addElement(lMatiereDeLaListe);
			}
			lMatiereDeLaListe.nbElementsConcernes++;
		});
	} else {
		if (this.selectModeAffCDC === this.genreModeAffCDC.contenu) {
			this.ListeCahierDeTextes.parcourir((aElement) => {
				if (
					!!aElement &&
					!!aElement.listeContenus &&
					aElement.listeContenus.count() > 0
				) {
					lMatiereDeLaListe = lResult.getElementParNumero(
						aElement.Matiere.getNumero(),
					);
					if (!lMatiereDeLaListe) {
						lMatiereDeLaListe = MethodesObjet.dupliquer(aElement.Matiere);
						lMatiereDeLaListe.nbElementsConcernes = 0;
						lMatiereDeLaListe.couleurFond = aElement.CouleurFond;
						lResult.addElement(lMatiereDeLaListe);
					}
					lMatiereDeLaListe.nbElementsConcernes++;
				}
			});
		} else {
			if (!!this.listeRessourcesPedagogiques) {
				this.listeRessourcesPedagogiques.parcourir((aRessource) => {
					if (!!aRessource && !!aRessource.matiere) {
						lMatiereDeLaListe = lResult.getElementParNumero(
							aRessource.matiere.getNumero(),
						);
						if (!lMatiereDeLaListe) {
							lMatiereDeLaListe = MethodesObjet.dupliquer(aRessource.matiere);
							lMatiereDeLaListe.nbElementsConcernes = 0;
							lMatiereDeLaListe.couleurFond = aRessource.matiere.CouleurFond;
							lResult.addElement(lMatiereDeLaListe);
						}
						lMatiereDeLaListe.nbElementsConcernes++;
					}
				});
			}
		}
	}
	lResult.setTri([ObjetTri.init("Libelle")]);
	lResult.trier();
	lResult.insererElement(
		new ObjetElement(
			GTraductions.getValeur("TAFEtContenu.toutesLesMatieres"),
			null,
			-1,
		),
		0,
	);
	return lResult;
}
function _evntFiltreThemes(aParam) {
	this.filtreThemes =
		aParam.element && aParam.element.getNumero() !== null
			? aParam.element
			: null;
	this.actualiser();
}
function _getListeThemes() {
	let lResult = new ObjetListeElements();
	let lThemeDeLaListe;
	if (this.estAffichageTAF) {
		this.ListeTravailAFaire.parcourir((aElement) => {
			if (
				!!aElement &&
				!!aElement.ListeThemes &&
				aElement.ListeThemes.count()
			) {
				aElement.ListeThemes.parcourir((aTheme) => {
					lThemeDeLaListe = lResult.getElementParNumero(aTheme.getNumero());
					if (!lThemeDeLaListe) {
						lThemeDeLaListe = MethodesObjet.dupliquer(aTheme);
						lResult.addElement(lThemeDeLaListe);
					}
				});
			}
		});
	} else {
		if (this.selectModeAffCDC === this.genreModeAffCDC.contenu) {
			this.ListeCahierDeTextes.parcourir((aElement) => {
				if (
					!!aElement &&
					!!aElement.listeContenus &&
					aElement.listeContenus.count()
				) {
					aElement.listeContenus.parcourir((aContenu) => {
						if (
							!!aContenu &&
							!!aContenu.ListeThemes &&
							aContenu.ListeThemes.count()
						) {
							aContenu.ListeThemes.parcourir((aTheme) => {
								lThemeDeLaListe = lResult.getElementParNumero(
									aTheme.getNumero(),
								);
								if (!lThemeDeLaListe) {
									lThemeDeLaListe = MethodesObjet.dupliquer(aTheme);
									lResult.addElement(lThemeDeLaListe);
								}
							});
						}
					});
				}
			});
		} else {
			if (!!this.listeRessourcesPedagogiques) {
				this.listeRessourcesPedagogiques.parcourir((aRessource) => {
					if (
						!!aRessource &&
						!!aRessource.ListeThemes &&
						aRessource.ListeThemes.count()
					) {
						aRessource.ListeThemes.parcourir((aTheme) => {
							lThemeDeLaListe = lResult.getElementParNumero(aTheme.getNumero());
							if (!lThemeDeLaListe) {
								lThemeDeLaListe = MethodesObjet.dupliquer(aTheme);
								lResult.addElement(lThemeDeLaListe);
							}
						});
					}
				});
			}
		}
	}
	lResult.setTri([ObjetTri.init("Libelle")]);
	lResult.trier();
	lResult.insererElement(
		new ObjetElement(
			GTraductions.getValeur("CahierDeTexte.tousLesThemes"),
			null,
			-1,
		),
		0,
	);
	return lResult;
}
module.exports = { InterfacePageCahierDeTexte_Mobile };
