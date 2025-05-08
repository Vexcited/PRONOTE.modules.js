exports.InterfaceRDV = void 0;
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const DonneesListe_RDV_1 = require("DonneesListe_RDV");
const MoteurRDV_1 = require("MoteurRDV");
const InterfaceDetailRDV_1 = require("InterfaceDetailRDV");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetFenetre_1 = require("ObjetFenetre");
const FenetreEditionRDV_1 = require("FenetreEditionRDV");
const TypesRDV_1 = require("TypesRDV");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const MethodesTableau_1 = require("MethodesTableau");
const Enumere_Etat_1 = require("Enumere_Etat");
class InterfaceRDV extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = {};
		this.moteurRDV = new MoteurRDV_1.MoteurRDV();
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
		this.contexte = $.extend(this.contexte, {
			ecran: [
				InterfaceRDV.genreEcran.listeRDV,
				InterfaceRDV.genreEcran.detailRDV,
			],
		});
		this.avecRdvPasses = false;
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "InterfaceRDV" },
				IE.jsx.str(
					"section",
					{ id: this.getIdDeNiveau({ niveauEcran: 0 }), class: ["liste-rdv"] },
					IE.jsx.str("div", {
						id: this.getInstance(this.identListeRDV).getNom(),
						class: ["full-height"],
					}),
				),
				IE.jsx.str(
					"aside",
					{
						id: this.getIdDeNiveau({ niveauEcran: 1 }),
						class: ["detail-rdv"],
						tabindex: "0",
					},
					IE.jsx.str("div", {
						id: this.getInstance(this.identDetailRDV).getNom(),
						class: ["full-height"],
					}),
				),
			),
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnRetourEcranPrec: {
				event: () => {
					this._evntRetourEcranPrec();
				},
			},
		});
	}
	recupererDonnees() {
		this._requeteListeRDV();
	}
	_requeteListeRDV() {
		this.moteurRDV.requeteListeRDV(this.avecRdvPasses).then((aReponseRdv) => {
			this.donnees.listeRDV = aReponseRdv.listeRDV;
			this.donnees.listeSallesLieux = aReponseRdv.lieux;
			this.donnees.telephone = aReponseRdv.telephone;
			this.donnees.indTelephone = aReponseRdv.indTelephone;
			if (this.optionsEcrans.avecBascule) {
				this.basculerEcran(null, {
					niveauEcran: 0,
					genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
				});
			} else {
				this._actualiserListeRDV();
			}
		});
	}
	async construireEcran(aParams) {
		switch (aParams.genreEcran) {
			case InterfaceRDV.genreEcran.listeRDV:
				if (this.optionsEcrans.avecBascule) {
					let lHtmlBandeau = "";
					this.setHtmlStructureAffichageBandeau(lHtmlBandeau);
				}
				this._actualiserListeRDV();
				break;
			case InterfaceRDV.genreEcran.detailRDV: {
				const lRDV = this.getCtxSelection({ niveauEcran: 0 });
				if (this.optionsEcrans.avecBascule) {
					let lHtmlBandeau = this._getHtmlBandeauEcranDetailRDV(lRDV);
					this.setHtmlStructureAffichageBandeau(lHtmlBandeau);
				}
				this.getInstance(this.identDetailRDV).setDonnees(lRDV);
				break;
			}
		}
	}
	_getHtmlBandeauEcranDetailRDV(aRdv) {
		const H = [];
		H.push(this.moteurRDV.getHtmlResumeRDV(aRdv));
		return this.construireBandeauEcran(H.join(""), { bgWhite: true });
	}
	_evntRetourEcranPrec() {
		switch (this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant })) {
			case InterfaceRDV.genreEcran.detailRDV:
				this.revenirSurEcranPrecedent();
				break;
		}
	}
	evntDemandeRdvPasses(aVoirRdvPasses, aMemoFiltres) {
		this.avecRdvPasses = aVoirRdvPasses;
		this.memoFiltres = aMemoFiltres;
		this.recupererDonnees();
	}
	evntSurCmdMenuCtx(aCmd, aRdv) {
		switch (aCmd) {
			case MoteurRDV_1.EGenreCmdCtxRdv.modifierRdv:
				this.editerRDV(aRdv);
				break;
			case MoteurRDV_1.EGenreCmdCtxRdv.modifierRdvCtxNonResp:
				this.editerRdvCtxNonResp(aRdv);
				break;
			case MoteurRDV_1.EGenreCmdCtxRdv.annulerRdv:
				this.moteurRDV.annulerRdv(this, aRdv, () => {
					this.recupererDonnees();
				});
				break;
			case MoteurRDV_1.EGenreCmdCtxRdv.supprimerRdv:
				this.moteurRDV.supprimerRdv(aRdv, () => {
					this.recupererDonnees();
				});
				break;
			case MoteurRDV_1.EGenreCmdCtxRdv.accepterDemandeRdv:
				if (
					aRdv.session.listeCreneauxProposes === null ||
					aRdv.session.listeCreneauxProposes === undefined
				) {
					aRdv.session.listeCreneauxProposes =
						new ObjetListeElements_1.ObjetListeElements();
				}
				aRdv.session.duree = this.moteurRDV.getDureeRdvParDefaut();
				this.editerRDV(aRdv);
				break;
			case MoteurRDV_1.EGenreCmdCtxRdv.refuserDemandeRdv:
				this.moteurRDV.refuserRdv(this, aRdv, () => {
					this.recupererDonnees();
				});
				break;
		}
	}
	_actualiserListeRDV() {
		const lInstanceListe = this.getInstance(this.identListeRDV);
		const lListeElts = this.donnees.listeRDV;
		let lEstCtxResp = this.moteurRDV.estCtxResponsableDeRDV();
		let lCumul;
		let lSession;
		let lTabStrClasses;
		lListeElts.parcourir((D) => {
			if (this.moteurRDV.estUnRdvEnSerie(D)) {
				if (D.estRdvSessionSerie) {
					lCumul = D;
					lSession = D.session;
					D.estUnDeploiement = true;
					D.estDeploye = !lEstCtxResp;
					if (lEstCtxResp) {
						D.nbRdvValidesDeSession = 0;
						D.nbTotalRdvDeSession = 0;
						D.nbRdvAnnulesDeSession = 0;
					}
					D.listeParticipantsAyantCreneau =
						new ObjetListeElements_1.ObjetListeElements();
					D.listeParticipantsSansCreneau =
						new ObjetListeElements_1.ObjetListeElements();
					D.tabFamillesParticipantsAyantCreneau = [];
					D.tabFamillesParticipantsSansCreneau = [];
					lTabStrClasses = [];
					D.strClassesSerie = "";
					let lInfosSessionSerie =
						this.moteurRDV.getInfosSessionSerieDepuisCreneaux(
							D.session.listeCreneauxProposes,
						);
					if (lInfosSessionSerie) {
						D.dateDebSerie = lInfosSessionSerie.dateDebSession;
						D.dateFinSerie = lInfosSessionSerie.dateFinSession;
						D.strLieuxSerie = lInfosSessionSerie.strLieux;
					}
				} else {
					D.pere = lCumul;
					D.session = lSession;
					D.dateDebSerie = lCumul.dateDebSerie;
					D.dateFinSerie = lCumul.dateFinSerie;
					lCumul.nbTotalRdvDeSession++;
					if (D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide) {
						lCumul.nbRdvValidesDeSession++;
					} else if (D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVAnnule) {
						lCumul.nbRdvAnnulesDeSession++;
					}
					if (this.moteurRDV.estRdvImpose(D)) {
						if (this.moteurRDV.existeCreneauPourRdv(D)) {
							lCumul.listeParticipantsAyantCreneau.add(D.listeParticipantRDV);
						} else {
							lCumul.listeParticipantsSansCreneau.add(D.listeParticipantRDV);
						}
					} else {
						if (this.moteurRDV.existeCreneauPourRdv(D)) {
							lCumul.tabFamillesParticipantsAyantCreneau.push({
								listeParticipantRDV: D.listeParticipantRDV,
								eleveConcerne: D.eleveConcerne,
							});
						} else {
							lCumul.tabFamillesParticipantsSansCreneau.push({
								listeParticipantRDV: D.listeParticipantRDV,
								eleveConcerne: D.eleveConcerne,
							});
						}
					}
					if (
						D.eleveConcerne &&
						!MethodesTableau_1.MethodesTableau.inclus(
							[D.eleveConcerne.strClasse],
							lTabStrClasses,
						)
					) {
						lTabStrClasses.push(D.eleveConcerne.strClasse);
						lCumul.strClassesSerie = lTabStrClasses.join(", ");
					}
				}
			}
		});
		lListeElts
			.setTri(
				lEstCtxResp
					? [
							ObjetTri_1.ObjetTri.init((D) => {
								return this.moteurRDV.estDemande(D);
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return (
									!this.moteurRDV.estUnRdvEnSerie(D) &&
									(D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide ||
										D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVAnnule)
								);
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return !this.moteurRDV.estUnRdvEnSerie(D) && D.creneau
									? D.creneau.debut
									: null;
							}, Enumere_TriElement_1.EGenreTriElement.Croissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return (
									!this.moteurRDV.estUnRdvEnSerie(D) &&
									D.etat === TypesRDV_1.TypeEtatRDV.terdv_PropositionEnCours
								);
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return (
									!this.moteurRDV.estUnRdvEnSerie(D) &&
									D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVRefuse
								);
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return this.moteurRDV.estUnRdvEnSerie(D) ? D.dateDebSerie : "";
							}, Enumere_TriElement_1.EGenreTriElement.Croissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return this.moteurRDV.estUnRdvEnSerie(D) ? D.dateFinSerie : "";
							}, Enumere_TriElement_1.EGenreTriElement.Croissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return this.moteurRDV.estUnRdvEnSerie(D)
									? D.session.getNumero()
									: "";
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return (
									this.moteurRDV.estUnRdvEnSerie(D) && D.estRdvSessionSerie
								);
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return (
									this.moteurRDV.estUnRdvEnSerie(D) &&
									(D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide ||
										D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVAnnule)
								);
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return this.moteurRDV.estUnRdvEnSerie(D) && D.creneau
									? D.creneau.debut
									: null;
							}, Enumere_TriElement_1.EGenreTriElement.Croissant),
						]
					: [
							ObjetTri_1.ObjetTri.init((D) => {
								return (
									!this.moteurRDV.estUnRdvEnSerie(D) &&
									D.etat === TypesRDV_1.TypeEtatRDV.terdv_PropositionEnCours
								);
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return (
									!this.moteurRDV.estUnRdvEnSerie(D) &&
									(D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide ||
										D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVAnnule)
								);
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return !this.moteurRDV.estUnRdvEnSerie(D) && D.creneau
									? D.creneau.debut
									: null;
							}, Enumere_TriElement_1.EGenreTriElement.Croissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return (
									!this.moteurRDV.estUnRdvEnSerie(D) &&
									D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVRefuse
								);
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return this.moteurRDV.estDemande(D);
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return this.moteurRDV.estUnRdvEnSerie(D) ? D.dateDebSerie : "";
							}, Enumere_TriElement_1.EGenreTriElement.Croissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return this.moteurRDV.estUnRdvEnSerie(D) ? D.dateFinSerie : "";
							}, Enumere_TriElement_1.EGenreTriElement.Croissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return this.moteurRDV.estUnRdvEnSerie(D)
									? D.session.getNumero()
									: "";
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return (
									this.moteurRDV.estUnRdvEnSerie(D) && D.estRdvSessionSerie
								);
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return (
									this.moteurRDV.estUnRdvEnSerie(D) &&
									(D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide ||
										D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVAnnule)
								);
							}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							ObjetTri_1.ObjetTri.init((D) => {
								return this.moteurRDV.estUnRdvEnSerie(D) && D.creneau
									? D.creneau.debut
									: null;
							}, Enumere_TriElement_1.EGenreTriElement.Croissant),
						],
			)
			.trier();
		lInstanceListe.setDonnees(
			new DonneesListe_RDV_1.DonneesListe_RDV(lListeElts, {
				clbckMenuCtx: this.evntSurCmdMenuCtx.bind(this),
				clbckDemandeRdvPasses: this.evntDemandeRdvPasses.bind(this),
				avecRdvPasses: this.avecRdvPasses,
				memoFiltres: this.memoFiltres,
			}),
		);
		if (!this.optionsEcrans.avecBascule) {
			this._selectionnerRdvCourant();
		}
	}
	_deselectionnerContexte() {
		const lDataSelection = this.getCtxSelection({ niveauEcran: 0 });
		if (lDataSelection !== null && lDataSelection !== undefined) {
			this.setCtxSelection({ niveauEcran: 0, dataEcran: null });
		}
		this.getInstance(this.identDetailRDV).setDonnees(null);
	}
	_selectionnerRdvCourant() {
		const lInstanceListe = this.getInstance(this.identListeRDV);
		const lListeElts = this.donnees.listeRDV;
		const lSelectionCourante = this.getCtxSelection({ niveauEcran: 0 });
		if (lSelectionCourante !== null && lSelectionCourante !== undefined) {
			const lListeResult = lListeElts.getListeElements((D) => {
				return D.getNumero() === lSelectionCourante.getNumero();
			});
			if (lListeResult.count() === 1) {
				let lDataASelectionner = lListeResult.get(0);
				this.setCtxSelection({ niveauEcran: 0, dataEcran: lDataASelectionner });
				const lIndice = lListeElts.getIndiceElementParFiltre((D) => {
					return D.getNumero() === lDataASelectionner.getNumero();
				});
				if (lIndice !== null && lIndice !== undefined) {
					lInstanceListe.selectionnerLigne({
						ligne: lIndice,
						avecScroll: true,
						avecEvenement: false,
					});
				}
				this.getInstance(this.identDetailRDV).setDonnees(lDataASelectionner);
			} else {
				this._deselectionnerContexte();
			}
		} else {
			this._deselectionnerContexte();
		}
	}
	_surBtnNouveauListeRDV(aParametres) {
		const lPosBtn = ObjetPosition_1.GPosition.getClientRect(
			aParametres.nodeBouton,
		);
		let lEstCtxRespDeRDV = this.moteurRDV.estCtxResponsableDeRDV();
		let lEstPourPrimaire = GApplication.getEtatUtilisateur().pourPrimaire();
		let lParamMenuCtx = {
			pere: this,
			initCommandes: (aMenu) => {
				if (lEstCtxRespDeRDV) {
					if (!lEstPourPrimaire) {
						aMenu.add(
							ObjetTraduction_1.GTraductions.getValeur("RDV.fixerRDVEleve"),
							true,
							() => {
								this.ouvrirFenetreCreerRDVFixeAvecEleve();
							},
						);
					}
					aMenu.add(
						ObjetTraduction_1.GTraductions.getValeur("RDV.proposerRDVParent"),
						true,
						() => {
							this.ouvrirFenetreProposerRDVParent();
						},
					);
					aMenu.add(
						ObjetTraduction_1.GTraductions.getValeur("RDV.rdvSerieAvecResp"),
						true,
						() => {
							this.ouvrirFenetreCreerRDVSerieAvecParents();
						},
					);
					if (!lEstPourPrimaire) {
						aMenu.add(
							ObjetTraduction_1.GTraductions.getValeur(
								"RDV.rdvSerieAvecEleves",
							),
							true,
							() => {
								this.ouvrirFenetreCreerRDVSerieAvecEleves();
							},
						);
					}
				} else if (this.moteurRDV.avecDemandeDeRdv()) {
					aMenu.add(
						IE.estMobile
							? ObjetTraduction_1.GTraductions.getValeur(
									"RDV.prendreRDVAvecProf",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"RDV.demanderRDVAvecProf",
								),
						true,
						() => {
							this.ouvrirFenetreDemanderRDV(
								Enumere_Ressource_1.EGenreRessource.Enseignant,
							);
						},
					);
					aMenu.add(
						IE.estMobile
							? ObjetTraduction_1.GTraductions.getValeur(
									"RDV.prendreRDVAvecPerso",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"RDV.demanderRDVAvecPersonnel",
								),
						true,
						() => {
							this.ouvrirFenetreDemanderRDV(
								Enumere_Ressource_1.EGenreRessource.Personnel,
							);
						},
					);
				}
			},
			id: IE.estMobile
				? aParametres.nodeBouton
				: { x: lPosBtn.left, y: lPosBtn.bottom + 10 },
		};
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher(lParamMenuCtx);
	}
	_surSelectionRDV(aRDV) {
		this.setCtxSelection({ niveauEcran: 0, dataEcran: aRDV });
		this.basculerEcran(
			{ niveauEcran: 0, dataEcran: aRDV },
			{ niveauEcran: 1, genreEcran: this.getCtxEcran({ niveauEcran: 1 }) },
		);
	}
	construireInstances() {
		this.identListeRDV = this.add(
			ObjetListe_1.ObjetListe,
			(aParametres) => {
				switch (aParametres.genreEvenement) {
					case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
						this._surBtnNouveauListeRDV(aParametres);
						break;
					case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
						this._surSelectionRDV(aParametres.article);
						break;
					case Enumere_EvenementListe_1.EGenreEvenementListe
						.ModificationSelection: {
						const lSelection = aParametres.instance.getElementSelection();
						if (!lSelection) {
							this._deselectionnerContexte();
						}
						break;
					}
				}
			},
			(aListe) => {
				aListe.setOptionsListe({
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					nonEditableSurModeExclusif: true,
					avecOmbreDroite: true,
					avecLigneCreation: this.moteurRDV.avecBtnCreationRdv(),
					messageContenuVide:
						ObjetTraduction_1.GTraductions.getValeur("RDV.aucunRDV"),
					boutons: [
						{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
						{ genre: ObjetListe_1.ObjetListe.typeBouton.filtrer },
					],
				});
				if (
					!this.moteurRDV.estCtxResponsableDeRDV() &&
					this.moteurRDV.avecDemandeDeRdv()
				) {
					aListe.setOptionsListe({
						titreCreation:
							ObjetTraduction_1.GTraductions.getValeur("RDV.demanderRDV"),
					});
				}
			},
		);
		this.identDetailRDV = this.add(
			InterfaceDetailRDV_1.InterfaceDetailRDV,
			(aRdv, aAvecModifTel) => {
				if (
					this.moteurRDV.estAvecChoixCreneau(aRdv) &&
					aRdv.creneau !== null &&
					aRdv.creneau !== undefined
				) {
					this._saisieRdv(
						{
							type: TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_ValiderCreneauRdv,
							rdv: aRdv,
						},
						aAvecModifTel,
					).then(() => {
						if (aAvecModifTel) {
							this._saisieRdv({
								type: TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_ModifierTelCible,
								rdv: aRdv,
							});
						}
					});
				} else {
					if (aAvecModifTel) {
						this._saisieRdv({
							type: TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_ModifierTelCible,
							rdv: aRdv,
						});
					}
				}
			},
			(aInstance) => {
				aInstance.setParam({ clbckMenuCtx: this.evntSurCmdMenuCtx.bind(this) });
			},
		);
	}
	editerRdvCtxNonResp(aRdv) {
		if (!aRdv || !aRdv.session) {
			return;
		}
		if (aRdv.etat !== TypesRDV_1.TypeEtatRDV.terdv_RDVValide) {
			return;
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			FenetreEditionRDV_1.FenetreEditionRDV,
			{
				pere: this,
				evenement: (aNumeroBouton, aParams) => {
					if (aParams.bouton && aParams.bouton.estValider) {
						this._saisieRdv({
							type: TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_ModifierTelCible,
							rdv: aParams.rdv,
						});
					}
				},
				initialiser: (aInstance) => {
					aInstance.initFenetre();
				},
			},
		);
		lFenetre.setOptionsRDV({
			natureRDV: aRdv.session.natureRDV,
			modeEdition: "edit",
		});
		lFenetre.setDonnees({ rdv: aRdv });
	}
	editerRDV(aRdv) {
		if (!aRdv || !aRdv.session) {
			return;
		}
		let lOuvrirFenetreEdition = false;
		let lCmdSaisie = TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_EditerRdv;
		switch (aRdv.session.natureRDV) {
			case TypesRDV_1.TypeNatureRDV.tNRDV_CreneauImpose: {
				if (
					aRdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVAnnule ||
					aRdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVRefuse
				) {
					return;
				}
				lOuvrirFenetreEdition = true;
				lCmdSaisie = TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_EditerRdv;
				break;
			}
			case TypesRDV_1.TypeNatureRDV.tNRDV_UniqueInitiativePublic: {
				if (aRdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVDemande) {
					lOuvrirFenetreEdition = true;
					lCmdSaisie =
						TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_AccepterDemandeRdv;
				} else if (
					aRdv.etat === TypesRDV_1.TypeEtatRDV.terdv_PropositionEnCours ||
					aRdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide
				) {
					lOuvrirFenetreEdition = true;
					lCmdSaisie = TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_EditerRdv;
				}
				break;
			}
			case TypesRDV_1.TypeNatureRDV.tNRDV_UniqueInitiativeRespRDV: {
				if (aRdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVAnnule) {
					return;
				}
				lOuvrirFenetreEdition = true;
				lCmdSaisie = TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_EditerRdv;
				break;
			}
			case TypesRDV_1.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes:
			case TypesRDV_1.TypeNatureRDV.tNRDV_EnSerie: {
				if (
					!aRdv.estRdvSessionSerie &&
					aRdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVAnnule
				) {
					return;
				}
				lOuvrirFenetreEdition = true;
				lCmdSaisie = aRdv.estRdvSessionSerie
					? TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_EditerSessionRdv
					: TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_EditerRdv;
			}
		}
		if (lOuvrirFenetreEdition) {
			const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				FenetreEditionRDV_1.FenetreEditionRDV,
				{
					pere: this,
					evenement: (aNumeroBouton, aParams) => {
						if (
							aParams.bouton &&
							aParams.bouton.estValider &&
							aParams.rdv &&
							(aParams.rdv.estRdvSessionSerie ||
								aParams.rdv.getEtat() ===
									Enumere_Etat_1.EGenreEtat.Modification)
						) {
							this._saisieRdv({
								type: lCmdSaisie,
								rdv: aParams.rdv,
								listePJs: aParams.listePJs,
							});
						}
					},
					initialiser: (aInstance) => {
						aInstance.initFenetre();
					},
				},
			);
			lFenetre.setOptionsRDV({
				natureRDV: aRdv.session.natureRDV,
				modeEdition: "edit",
			});
			lFenetre.setDonnees({
				rdv: aRdv,
				listeSallesLieux: this.donnees.listeSallesLieux,
			});
		}
	}
	ouvrirFenetreDemanderRDV(aGenreRessource) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			FenetreEditionRDV_1.FenetreEditionRDV,
			{
				pere: this,
				evenement: (aNumeroBouton, aParams) => {
					if (aParams.bouton && aParams.bouton.estValider) {
						this._saisieRdv({
							type: TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_CreerDemandeRdv,
							rdv: aParams.rdv,
						});
					}
				},
				initialiser: (aInstance) => {
					aInstance.initFenetre();
				},
			},
		);
		lFenetre.setOptionsRDV({
			natureRDV: TypesRDV_1.TypeNatureRDV.tNRDV_UniqueInitiativePublic,
			modeEdition: "create",
		});
		lFenetre.setDonnees({
			rdv: null,
			genreRessourceRespRdv: aGenreRessource,
			telDemandeur: this.donnees.telephone,
			indTelDemandeur: this.donnees.indTelephone,
		});
	}
	ouvrirFenetreProposerRDVParent() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			FenetreEditionRDV_1.FenetreEditionRDV,
			{
				pere: this,
				evenement: (aNumeroBouton, aParams) => {
					if (aParams.bouton && aParams.bouton.estValider) {
						this._saisieRdv({
							type: TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_CreerPropositionRdv,
							rdv: aParams.rdv,
							listePJs: aParams.listePJs,
						});
					}
				},
				initialiser: (aInstance) => {
					aInstance.initFenetre();
				},
			},
		);
		lFenetre.setOptionsRDV({
			natureRDV: TypesRDV_1.TypeNatureRDV.tNRDV_UniqueInitiativeRespRDV,
			modeEdition: "create",
		});
		lFenetre.setDonnees({
			rdv: null,
			listeSallesLieux: this.donnees.listeSallesLieux,
		});
	}
	ouvrirFenetreCreerRDVSerieAvecEleves() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			FenetreEditionRDV_1.FenetreEditionRDV,
			{
				pere: this,
				evenement: (aNumeroBouton, aParams) => {
					if (aParams.bouton && aParams.bouton.estValider) {
						this._saisieRdv({
							type: TypesRDV_1.TypeRDVCommandeSaisie
								.rdvcs_CreerRdvSerieAvecEleves,
							rdv: aParams.rdv,
							listePJs: aParams.listePJs,
						});
					}
				},
				initialiser: (aInstance) => {
					aInstance.initFenetre();
				},
			},
		);
		lFenetre.setOptionsRDV({
			natureRDV: TypesRDV_1.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes,
			modeEdition: "create",
		});
		lFenetre.setDonnees({
			rdv: null,
			listeSallesLieux: this.donnees.listeSallesLieux,
		});
	}
	ouvrirFenetreCreerRDVSerieAvecParents() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			FenetreEditionRDV_1.FenetreEditionRDV,
			{
				pere: this,
				evenement: (aNumeroBouton, aParams) => {
					if (aParams.bouton && aParams.bouton.estValider) {
						this._saisieRdv({
							type: TypesRDV_1.TypeRDVCommandeSaisie
								.rdvcs_CreerRdvSerieAvecParents,
							rdv: aParams.rdv,
							listePJs: aParams.listePJs,
						});
					}
				},
				initialiser: (aInstance) => {
					aInstance.initFenetre();
				},
			},
		);
		lFenetre.setOptionsRDV({
			natureRDV: TypesRDV_1.TypeNatureRDV.tNRDV_EnSerie,
			modeEdition: "create",
		});
		lFenetre.setDonnees({
			rdv: null,
			listeSallesLieux: this.donnees.listeSallesLieux,
		});
	}
	_saisieRdv(aParamSaisie, aSansActualisation) {
		if (aParamSaisie && aParamSaisie.rdv) {
			this.setCtxSelection({ niveauEcran: 0, dataEcran: aParamSaisie.rdv });
		}
		if (this.getInstance(this.identListeRDV)) {
			let lDonneesListe = this.getInstance(
				this.identListeRDV,
			).getDonneesListe();
			this.memoFiltres = lDonneesListe.getFiltres();
		}
		return this.moteurRDV.requeteSaisieRDV(aParamSaisie).then((aReponseRdv) => {
			if (
				aReponseRdv.JSONRapportSaisie &&
				aReponseRdv.JSONRapportSaisie.rdvCree
			) {
				let lRdvCree = aReponseRdv.JSONRapportSaisie.rdvCree;
				this.setCtxSelection({ niveauEcran: 0, dataEcran: lRdvCree });
			}
			if (aSansActualisation !== true) {
				this.recupererDonnees();
			}
		});
	}
	ouvrirFenetreCreerRDVFixeAvecEleve() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			FenetreEditionRDV_1.FenetreEditionRDV,
			{
				pere: this,
				evenement: (aNumeroBouton, aParams) => {
					if (aParams.bouton && aParams.bouton.estValider) {
						this._saisieRdv({
							type: TypesRDV_1.TypeRDVCommandeSaisie
								.rdvcs_CreerRdvCreneauImpose,
							rdv: aParams.rdv,
							listePJs: aParams.listePJs,
						});
					}
				},
				initialiser: (aInstance) => {
					aInstance.initFenetre();
				},
			},
		);
		lFenetre.setOptionsRDV({
			natureRDV: TypesRDV_1.TypeNatureRDV.tNRDV_CreneauImpose,
			modeEdition: "create",
		});
		lFenetre.setDonnees({
			rdv: null,
			listeSallesLieux: this.donnees.listeSallesLieux,
		});
	}
}
exports.InterfaceRDV = InterfaceRDV;
(function (InterfaceRDV) {
	let genreEcran;
	(function (genreEcran) {
		genreEcran["listeRDV"] = "InterfaceRDV.listeRDV";
		genreEcran["detailRDV"] = "InterfaceRDV.detailRDV";
	})((genreEcran = InterfaceRDV.genreEcran || (InterfaceRDV.genreEcran = {})));
})(InterfaceRDV || (exports.InterfaceRDV = InterfaceRDV = {}));
