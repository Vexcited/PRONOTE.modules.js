exports.InterfacePageCahierDeTexte_Mobile = void 0;
const PageCahierDeTexte_Mobile_1 = require("PageCahierDeTexte_Mobile");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const MethodesObjet_1 = require("MethodesObjet");
const TypeDomaine_1 = require("TypeDomaine");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetRequetePageCahierDeTexte_1 = require("ObjetRequetePageCahierDeTexte");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetDate_1 = require("ObjetDate");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetRequeteSaisieTAFFaitEleve_1 = require("ObjetRequeteSaisieTAFFaitEleve");
const ObjetUtilitaireCahierDeTexte_1 = require("ObjetUtilitaireCahierDeTexte");
const ObjetHtml_1 = require("ObjetHtml");
const tag_1 = require("tag");
const InterfacePageCahierDeTexte_MobileCP_1 = require("InterfacePageCahierDeTexte_MobileCP");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const ObjetRequeteDonneesContenusCDT_1 = require("ObjetRequeteDonneesContenusCDT");
const AccessApp_1 = require("AccessApp");
class InterfacePageCahierDeTexte_Mobile extends InterfacePageCahierDeTexte_MobileCP_1.ObjetCahierDeTexte_MobileCP {
	constructor() {
		super(...arguments);
		this.appScoMobile = (0, AccessApp_1.getApp)();
		this.etatUtilScoMobile = this.appScoMobile.getEtatUtilisateur();
		this.utilitaireCDT =
			new ObjetUtilitaireCahierDeTexte_1.ObjetUtilitaireCahierDeTexte(
				this.Nom + ".utilitaireCDT",
				this,
				this.surUtilitaireCDT,
			);
		this.domaineCourant = null;
		this.cycleCourant = null;
		this.genreModeAffCDC = { contenu: 0, ressource: 1 };
		this.listeTabsCDC = new ObjetListeElements_1.ObjetListeElements();
	}
	creerInstanceCalendrier() {
		return this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementSurCalendrier,
			this.initialiserCalendrier,
		);
	}
	creerInstancePage() {
		return this.add(
			PageCahierDeTexte_Mobile_1.PageCahierDeTexte_Mobile,
			this.evenementSurPage,
		);
	}
	construireInstances() {
		this.instanceFiltreTheme = ObjetIdentite_1.Identite.creerInstance(
			ObjetSelection_1.ObjetSelection,
			{
				pere: this,
				evenement: this._evntFiltreThemes.bind(this),
				options: {
					avecBoutonsPrecedentSuivant: false,
					labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
						"WAI.ListeSelectionTheme",
					),
				},
			},
		);
		super.construireInstances();
		this.estAffichageTAF =
			this.etatUtilScoMobile.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.CDT_TAF;
		this.estAffichageContenu =
			this.etatUtilScoMobile.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.CDT_Contenu;
		if (this.estAffichageContenu) {
			this.identTabs = this.add(
				ObjetTabOnglets_1.ObjetTabOnglets,
				this.eventModeAffCDC,
				(aInstance) => {
					aInstance.setOptions({ avecSwipe: false });
				},
			);
			const lElementCDCContenu = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.contenu"),
				null,
				this.genreModeAffCDC.contenu,
				null,
				true,
			);
			this.listeTabsCDC.addElement(lElementCDCContenu);
			const lElementCDCRessource = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ressources"),
				null,
				this.genreModeAffCDC.ressource,
				null,
				true,
			);
			this.listeTabsCDC.addElement(lElementCDCRessource);
			this.AddSurZone = [];
			this.AddSurZone.push(this.identTabs);
			this.AddSurZone.push({ html: this._composeFiltresContenu() });
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
					this.listeMatieres = this._getListeMatieres();
					this.listeThemes = this._getListeThemes();
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
					new ObjetRequetePageCahierDeTexte_1.ObjetRequetePageCahierDeTexte(
						this,
						this.actionSurRessourcePeda,
					).lancerRequete({
						domaine: new TypeDomaine_1.TypeDomaine(this.cycleCourant),
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
				case InterfacePageCahierDeTexte_MobileCP_1.GenreModeAffichageTAFMobile
					.AVenir:
					this.selectModeAffTAF =
						InterfacePageCahierDeTexte_MobileCP_1.GenreModeAffichageTAFMobile.AVenir;
					$(
						"#" + this.getInstance(this.identCalendrier).getNom().escapeJQ(),
					).hide();
					new ObjetRequetePageCahierDeTexte_1.ObjetRequetePageCahierDeTexte(
						this,
						this.actionSurCalendrier,
					).lancerRequete({ date: ObjetDate_1.GDate.aujourdhui });
					break;
				case InterfacePageCahierDeTexte_MobileCP_1.GenreModeAffichageTAFMobile
					.hebdomadaire:
					this.selectModeAffTAF =
						InterfacePageCahierDeTexte_MobileCP_1.GenreModeAffichageTAFMobile.hebdomadaire;
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
		let lListeTAF = new ObjetListeElements_1.ObjetListeElements();
		let lListeCDC = new ObjetListeElements_1.ObjetListeElements();
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
					lListeCDC.add(Object.assign(new ObjetElement_1.ObjetElement(), aEl));
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
			const lListeThemes =
				MethodesObjet_1.MethodesObjet.dupliquer(aListeThemes);
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
			this.dateCourant = !!this.etatUtilScoMobile.getDerniereDate()
				? this.etatUtilScoMobile.getDerniereDate()
				: this.etatUtilScoMobile.getNavigationDate()
					? this.etatUtilScoMobile.getNavigationDate()
					: ObjetDate_1.GDate.aujourdhui;
		}
		if (this.estAffichageTAF) {
			if (this.selectModeAffTAF === undefined) {
				let lContexteTAF = this.etatUtilScoMobile.getContexteTAF();
				if (lContexteTAF) {
					this.inclureTAFFait = lContexteTAF.inclureTAFFait;
					this.inclureTAFAFaire = lContexteTAF.inclureTAFAFaire;
					this.filtreMatiere = lContexteTAF.filtreMatiere;
					this.filtreThemes = lContexteTAF.filtreThemes;
					this.etatUtilScoMobile.setContexteTAF();
				}
				this.selectModeAffTAF =
					!!lContexteTAF && lContexteTAF.modeAffTAF
						? lContexteTAF.modeAffTAF
						: InterfacePageCahierDeTexte_MobileCP_1.GenreModeAffichageTAFMobile
								.AVenir;
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
		this.etatUtilScoMobile.setDerniereDate(lDate);
		new ObjetRequetePageCahierDeTexte_1.ObjetRequetePageCahierDeTexte(
			this,
			this.actionSurCalendrier,
		).lancerRequete({
			domaine: new TypeDomaine_1.TypeDomaine(this.cycleCourant),
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
				new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
					this,
					this._actionApresRequeteDonneesTAFCDT.bind(this),
				).lancerRequete({
					cahierDeTextes: new ObjetElement_1.ObjetElement(
						"",
						this.donnee.getNumero(),
					),
					pourTAF: true,
				});
			} else {
				this.recupererDonnees();
			}
		}
		if (aObjet && aObjet.taf) {
			new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
				this,
				this._actionApresRequeteDonneesContenusCDT,
			).lancerRequete({ cahierDeTextes: aObjet.taf.cahierDeTextes });
			return;
		}
		if (aObjet && aObjet.cours) {
			new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
				this,
				this._actionApresRequeteDonneesTAFCDT.bind(this),
			).lancerRequete({
				cahierDeTextes: new ObjetElement_1.ObjetElement(
					"",
					aObjet.cours.getNumero(),
				),
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
			this.etatUtilScoMobile.setContexteTAF({
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
			this.etatUtilScoMobile.setContexteCDT({
				modeAffCDC: this.selectModeAffCDC,
				filtreMatiere: this.filtreMatiere,
				filtreThemes: this.filtreThemes,
			});
		}
		if (lExecutionQCM) {
			this.callback.appel({
				genreOnglet: this.etatUtilScoMobile.genreOnglet,
				executionQCM: lExecutionQCM,
			});
		}
	}
	surUtilitaireCDT() {
		if (this.fenetre) {
			this.fenetre.fermer();
		}
		new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
			this,
			this._actionApresRequeteDonneesTAFCDT.bind(this),
		).lancerRequete({
			cahierDeTextes: new ObjetElement_1.ObjetElement(
				"",
				this.donnee.getNumero(),
			),
			pourTAF: true,
		});
	}
	actionSurCalendrier(aParametres) {
		this.ListeTravailAFaire = aParametres.listeTAF;
		this.ListeCahierDeTextes = aParametres.listeCDT;
		this.listeRessourcesPedagogiques = aParametres.listeRessourcesPedagogiques;
		if (this.estAffichageContenu) {
			if (this.selectModeAffCDC === undefined) {
				let lContexteCDT = this.etatUtilScoMobile.getContexteCDT();
				if (lContexteCDT) {
					this.filtreMatiere = lContexteCDT.filtreMatiere;
					this.filtreThemes = lContexteCDT.filtreThemes;
					this.etatUtilScoMobile.setContexteCDT();
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
			this.listeMatieres = this._getListeMatieres();
			this.listeThemes = this._getListeThemes();
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
				const lZoneSelectionJQ = $("#" + this.appScoMobile.idLigneBandeau);
				const lElementJQ = $(
					"#" + this.getInstance(this.identPage).getNom().escapeJQ(),
				).find(
					'div[data-idDate="' +
						ObjetDate_1.GDate.formatDate(
							this.dateCourant,
							"%JJ%MM%AAAA",
						).toString() +
						'"]',
				);
				if (
					this.selectModeAffTAF ===
						InterfacePageCahierDeTexte_MobileCP_1.GenreModeAffichageTAFMobile
							.AVenir &&
					!!lElementJQ &&
					!!lElementJQ.get(0) &&
					lElementJQ.get(0).scrollIntoView
				) {
					const lPositionDate = lElementJQ.offset().top;
					lElementJQ.get(0).scrollIntoView();
					$("#" + this.appScoMobile.getIdConteneur()).scrollTop(
						lPositionDate -
							(lZoneSelectionJQ.offset().top +
								lZoneSelectionJQ.outerHeight(true)) -
							(lPageJQ.outerHeight(true) - lIdentPageJQ.outerHeight(true)),
					);
					this.dateCourant = ObjetDate_1.GDate.aujourdhui;
				} else {
					$("#" + this.appScoMobile.getIdConteneur()).scrollTop(0);
				}
			} else {
				this.apresModificationTAF = false;
			}
		}
	}
	actionSurRessourcePeda(aParams) {
		this.listeRessourcesPedagogiques = aParams.listeRessourcesPedagogiques;
		this.listeMatieres = this._getListeMatieres();
		this.listeThemes = this._getListeThemes();
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
	_actionApresRequeteDonneesContenusCDT(aJSON) {
		let lDonnee =
			aJSON.ListeCahierDeTextes && aJSON.ListeCahierDeTextes.count() === 1
				? aJSON.ListeCahierDeTextes.getPremierElement()
				: null;
		if (lDonnee) {
			new ObjetDeserialiser_1.ObjetDeserialiser().deserialiserCahierDeTexte(
				lDonnee,
			);
			this._afficheFenetreDetail(lDonnee, false);
		} else {
		}
	}
	_actionApresRequeteDonneesTAFCDT(aJSON) {
		let lDonnee =
			aJSON.ListeCahierDeTextes && aJSON.ListeCahierDeTextes.count() === 1
				? aJSON.ListeCahierDeTextes.getPremierElement()
				: null;
		if (lDonnee) {
			this._afficheFenetreDetail(lDonnee, true);
		} else {
		}
	}
	_afficheFenetreDetail(aDonnee, aEstTAF) {
		this.donnee = aDonnee;
		this.fenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				evenement: function (aGenreBouton) {
					if (aGenreBouton !== 1) {
						this.donnee = null;
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: aEstTAF
							? ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.TravailAFaire",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.ContenuDuCours",
								),
						avecCroixFermeture: false,
					});
				},
			},
		);
		const lThis = this;
		$.extend(this.fenetre.controleur, {
			appelQCM: {
				event: function (aNumeroQCM) {
					lThis.evenementSurPage({ CDT: aDonnee, executionQCM: aNumeroQCM });
				},
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
					lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					new ObjetRequeteSaisieTAFFaitEleve_1.ObjetRequeteSaisieTAFFaitEleve(
						this,
					)
						.lancerRequete({ listeTAF: aDonnee.ListeTravailAFaire })
						.then(() => {
							const lHtml = lThis
								.getInstance(lThis.identPage)
								.composeTAF(aDonnee, lThis.fenetre.controleur);
							ObjetHtml_1.GHtml.setHtml(lThis.Nom + "_cont", lHtml, {
								controleur: lThis.fenetre.controleur,
							});
						});
				},
			},
		});
		this.fenetre.afficher();
		if (aEstTAF) {
			this.fenetre.afficher(
				(0, tag_1.tag)(
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
				(0, tag_1.tag)(
					"div",
					{ id: this.Nom + "_cont" },
					this.getInstance(this.identPage).composeCours(aDonnee),
				),
			);
		}
	}
	_composeFiltresContenu() {
		const H = [];
		H.push(
			'<div class="conteneur-entete">',
			(0, tag_1.tag)("div", {
				class: "conteneur-calendrier",
				id: this.getInstance(this.identCalendrier).getNom(),
			}),
			(0, tag_1.tag)("div", { id: this.instanceFiltreMatieres.getNom() }),
			(0, tag_1.tag)("div", { id: this.instanceFiltreTheme.getNom() }),
			"</div>",
		);
		return H.join("");
	}
	_getListeMatieres() {
		let lResult = new ObjetListeElements_1.ObjetListeElements();
		let lMatiereDeLaListe;
		if (this.estAffichageTAF) {
			this.ListeTravailAFaire.parcourir((aElement) => {
				lMatiereDeLaListe = lResult.getElementParNumero(
					aElement.Matiere.getNumero(),
				);
				if (!lMatiereDeLaListe) {
					lMatiereDeLaListe = MethodesObjet_1.MethodesObjet.dupliquer(
						aElement.Matiere,
					);
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
							lMatiereDeLaListe = MethodesObjet_1.MethodesObjet.dupliquer(
								aElement.Matiere,
							);
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
								lMatiereDeLaListe = MethodesObjet_1.MethodesObjet.dupliquer(
									aRessource.matiere,
								);
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
		lResult.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lResult.trier();
		lResult.insererElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"TAFEtContenu.toutesLesMatieres",
				),
				null,
				-1,
			),
			0,
		);
		return lResult;
	}
	_evntFiltreThemes(aParam) {
		this.filtreThemes =
			aParam.element && aParam.element.getNumero() !== null
				? aParam.element
				: null;
		this.actualiser();
	}
	_getListeThemes() {
		let lResult = new ObjetListeElements_1.ObjetListeElements();
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
							lThemeDeLaListe = MethodesObjet_1.MethodesObjet.dupliquer(aTheme);
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
										lThemeDeLaListe =
											MethodesObjet_1.MethodesObjet.dupliquer(aTheme);
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
								lThemeDeLaListe = lResult.getElementParNumero(
									aTheme.getNumero(),
								);
								if (!lThemeDeLaListe) {
									lThemeDeLaListe =
										MethodesObjet_1.MethodesObjet.dupliquer(aTheme);
									lResult.addElement(lThemeDeLaListe);
								}
							});
						}
					});
				}
			}
		}
		lResult.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lResult.trier();
		lResult.insererElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.tousLesThemes"),
				null,
				-1,
			),
			0,
		);
		return lResult;
	}
}
exports.InterfacePageCahierDeTexte_Mobile = InterfacePageCahierDeTexte_Mobile;
