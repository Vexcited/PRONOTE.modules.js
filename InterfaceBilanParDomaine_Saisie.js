exports.InterfaceBilanParDomaine_Saisie = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Date_1 = require("ObjetFenetre_Date");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const _InterfaceBilanParDomaine_1 = require("_InterfaceBilanParDomaine");
const DonneesListe_BilanParDomaine_1 = require("DonneesListe_BilanParDomaine");
const DonneesListe_BilanParDomaineLVE_1 = require("DonneesListe_BilanParDomaineLVE");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetRequeteSaisieBilanParDomaine_1 = require("ObjetRequeteSaisieBilanParDomaine");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetFenetre_SaisieMessage_1 = require("ObjetFenetre_SaisieMessage");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const TypeNiveauEquivalenceCE_1 = require("TypeNiveauEquivalenceCE");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const GlossaireCompetences_1 = require("GlossaireCompetences");
class InterfaceBilanParDomaine_Saisie extends _InterfaceBilanParDomaine_1._InterfaceBilanParDomaine {
	constructor(...aParams) {
		super(...aParams);
		this.observationsModifiee = false;
	}
	construireInstances() {
		super.construireInstances();
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evenementSurTripleCombo.bind(this),
			this._initialiseTripleCombo,
		);
		this.identComboValidation = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this._evenementSurComboValidation.bind(this),
			this._initialiseComboValidation,
		);
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evenementDateValidation.bind(this),
		);
		this.IdPremierElement = this.getInstance(
			this.identTripleCombo,
		).getPremierElement();
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		this.AddSurZone = [];
		this.AddSurZone.push(this.identTripleCombo);
		this.AddSurZone.push({ blocGauche: true });
		this.AddSurZone = this.AddSurZone.concat(this._construitAddSurZoneCommun());
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
				this.jsxModeleBoutonMrFiche.bind(this),
			),
		});
		this.AddSurZone.push({ blocDroit: true });
	}
	jsxModeleBoutonMrFiche() {
		return {
			event: () => {
				UtilitaireCompetences_1.TUtilitaireCompetences.afficherAideSaisieNiveauMaitrise(
					{
						genreChoixValidationCompetence:
							TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
								.tGVC_EvaluationEtItem,
					},
				);
			},
			getTitle: () => {
				return ObjetTraduction_1.GTraductions.getValeur(
					"competences.TitreAideSaisieNivMaitrise",
				);
			},
		};
	}
	jsxGetHtmlPied() {
		const H = [];
		if (this.donnees.estDansLEtablissement) {
			let lHauteurTxtArea = this.parametres.heightPied - 22;
			lHauteurTxtArea = 30;
			const lId = `${this.Nom}_pied_ta_obs`;
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"label",
						{ class: "PetitEspaceBas", for: lId },
						ObjetTraduction_1.GTraductions.getValeur(
							"competences.bilanpardomaine.Observations",
						),
						" :",
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str("ie-textareamax", {
							"ie-model": this.jsxModeleTextareaObservationPied.bind(this),
							id: lId,
							maxlength: this.parametresSco.getTailleMaxAppreciationParEnumere(
								TypeGenreAppreciation_1.TypeGenreAppreciation
									.GA_Observations_Competences,
							),
							style: "width:100%; height:" + lHauteurTxtArea + "px",
						}),
					),
				),
			);
		} else {
			H.push(this._composePiedNonEditable());
		}
		return H.join("");
	}
	jsxModeleTextareaObservationPied() {
		return {
			getValue: () => {
				return this.donnees.relationElevePilier.observations || "";
			},
			setValue: (aValue) => {
				this.donnees.relationElevePilier.observations = aValue;
				this.observationsModifiee = true;
				this.setEtatSaisie(true);
			},
			getDisabled: () => {
				return !this.donnees.droitSaisie;
			},
		};
	}
	getParamsSupplementairesRequeteSelonContexte() {
		return {
			ressource: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
		};
	}
	getListeEleves() {
		return this.etatUtilisateurSco.Navigation.getRessources(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
	}
	getServiceConcerne() {
		return this.etatUtilisateurSco.getServiceDePilier();
	}
	_avecAffichageCoefficient() {
		return !this.etatUtilisateurSco.pourPrimaire();
	}
	_avecAffichageLegendeListe() {
		return this.estAffichageListeLVE();
	}
	_surEvenementListeBilanDomaineStandard(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_BilanParDomaine_1.DonneesListe_BilanParDomaine
						.colonnes.niveau:
						aParametres.ouvrirMenuContextuel();
						break;
					case DonneesListe_BilanParDomaine_1.DonneesListe_BilanParDomaine
						.colonnes.valider:
						this._modifierDateDeSelectionCourante();
						break;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.KeyUpListe: {
				const lNiveau = this._getNiveauAcquisitionSurKeyUp(aParametres.event);
				if (!!lNiveau) {
					this._modifierNiveauDeSelectionCourante(lNiveau);
				}
				break;
			}
		}
	}
	_getMethodeInitialisationMenuContextuelListeStandard() {
		const lThis = this;
		return function (aParametres) {
			const lListeSelections = lThis
				.getInstance(lThis.identListeBilanDomaine)
				.getListeElementsSelection();
			let lNiveauAcquiEditable = false;
			let lObservationEditable = false;
			let lDateEditable = false;
			let lGenreChoixValidationCompetence = -1;
			if (!lListeSelections || lListeSelections.count() === 0) {
				return;
			}
			lListeSelections.parcourir((aSelection) => {
				if (aSelection.niveauEstEditable) {
					lNiveauAcquiEditable = true;
					if (
						!!aSelection.niveauDAcquisition &&
						aSelection.niveauDAcquisition.existeNumero() &&
						aSelection.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Evaluation
					) {
						lObservationEditable = true;
					}
				}
				if (
					aSelection.dateEstEditable &&
					!!aSelection.niveauDAcquisition &&
					UtilitaireCompetences_1.TUtilitaireCompetences.estNiveauAcqui(
						aSelection.niveauDAcquisition,
					) &&
					aSelection.getGenre() !==
						Enumere_Ressource_1.EGenreRessource.Evaluation
				) {
					lDateEditable = true;
				}
				lGenreChoixValidationCompetence =
					TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
						.tGVC_EvaluationEtItem;
			});
			UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
				{
					instance: lThis,
					menuContextuel: aParametres.menuContextuel,
					avecLibelleRaccourci: true,
					avecSousMenu: true,
					genreChoixValidationCompetence: lGenreChoixValidationCompetence,
					evaluationsEditables: lNiveauAcquiEditable,
					estDateEditable: lDateEditable,
					callbackNiveau: lThis._modifierNiveauDeSelectionCourante.bind(lThis),
					callbackDate: lThis._avecAffichageDateValidation()
						? lThis._modifierDateDeSelectionCourante.bind(lThis)
						: null,
					estObservationEditable: lObservationEditable,
					callbackCommentaire:
						lThis._editionCommentaireAcquisitions.bind(lThis),
				},
			);
		};
	}
	_afficherValidationDomaine() {
		let lAfficherValidation;
		if (this.estAffichageListeLVE()) {
			lAfficherValidation = true;
		} else {
			lAfficherValidation = this.etatUtilisateurSco.getServiceDePilier()
				? !this.etatUtilisateurSco.getServiceDePilier().existeNumero()
				: true;
		}
		return lAfficherValidation;
	}
	_afficherBtnValidationAutoDomaine() {
		if (this.estAffichageListeLVE()) {
			return (
				!this.etatUtilisateurSco.getServiceDePilier() ||
				!this.etatUtilisateurSco.getServiceDePilier().existeNumero()
			);
		}
		return false;
	}
	jsxModeleBoutonValidationAutoDomaine() {
		return {
			event: () => {
				const lParamsValidationAuto = {
					estValidationCECRLDomaine: !!this.estAffichageListeLVE(),
					instance: this,
					listeEleves: this.getListeEleves(),
					mrFiche: null,
				};
				if (!!this.estAffichageListeLVE()) {
					const lServiceConcerne = this.getServiceConcerne();
					lParamsValidationAuto.mrFiche =
						this.getMrFichePourCalculAuto(lServiceConcerne);
				}
				UtilitaireCompetences_1.TUtilitaireCompetences.surBoutonValidationAuto(
					lParamsValidationAuto,
				);
			},
			getTitle: () => {
				return GlossaireCompetences_1.TradGlossaireCompetences.validationAuto
					.hintBouton;
			},
		};
	}
	_construireEntete() {
		const H = [];
		const lCombo = this.getInstance(this.identComboValidation);
		const lCelluleDate = this.getInstance(this.identDate);
		if (this.donnees.estDansLEtablissement) {
			if (this.donnees.droitSaisie) {
				H.push(
					'<span class="Gras PetitEspaceDroit AlignementMilieuVertical" id="',
					this.Nom,
					'_libe_entete">',
					this.getLibelleEntete(),
					" :</span>",
				);
				if (this._afficherValidationDomaine()) {
					H.push(
						'<div class="InlineBlock AlignementMilieuVertical" id="',
						lCombo.getNom() + '"></div>',
						'<div class="EspaceGauche InlineBlock AlignementMilieuVertical" id="',
						lCelluleDate.getNom(),
						'"></div>',
					);
					if (this._afficherBtnValidationAutoDomaine()) {
						H.push(
							IE.jsx.str(
								"div",
								{ class: "EspaceGauche InlineBlock AlignementMilieuVertical" },
								IE.jsx.str("ie-btnicon", {
									"ie-model":
										this.jsxModeleBoutonValidationAutoDomaine.bind(this),
									class: "bt-activable icon_sigma",
								}),
							),
						);
					}
				} else {
					H.push(
						"<span>",
						ObjetTraduction_1.GTraductions.getValeur(
							"competences.DomaineLVENon",
							[
								ObjetTraduction_1.GTraductions.getValeur(
									"competences.ToutesLesLVE",
								),
							],
						),
						"</span>",
					);
				}
			} else {
				H.push(this._composerEntete());
			}
		}
		ObjetHtml_1.GHtml.setHtml(this.ids.entete, H.join(""), { instance: this });
		lCombo.initialiser();
		lCombo.setDonnees(
			UtilitaireCompetences_1.TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourCombo(
				{
					genreChoixValidationCompetence:
						TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
							.tGVC_Competence,
					sansLibelleAucun: true,
					avecDispense: this.estPilierLVESelectionne(),
				},
			),
		);
		lCombo.setActif(true);
		const lNiveauActuel = this.donnees.relationElevePilier.niveauDAcquisition;
		if (
			!!lNiveauActuel &&
			lNiveauActuel.getGenre() !==
				Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Multiple
		) {
			lCombo.setSelectionParNumeroEtGenre(lNiveauActuel.getNumero());
		}
		lCelluleDate.initialiser();
		this._actualiserDateValidation();
	}
	_surEvenementListeBilanDomaineLVE(aParametres) {
		super._surEvenementListeBilanDomaineLVE(aParametres);
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				aParametres.ouvrirMenuContextuel();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.KeyUpListe: {
				const lNiveauAcquisition = this._getNiveauAcquisitionSurKeyUp(
					aParametres.event,
				);
				if (!!lNiveauAcquisition) {
					this.modifierNiveauAcquisitionLVE(
						this._getListeInfosServicesSelectionnes(aParametres.instance),
						lNiveauAcquisition,
					);
				}
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClickTotal: {
				const lServiceLVE = aParametres.declarationColonne.serviceLVE;
				if (!!lServiceLVE) {
					this._ouvrirFenetreChoixNiveauDomaine(lServiceLVE);
				}
				break;
			}
		}
	}
	_getMethodeInitialisationMenuContextuelListeLVE() {
		const lThis = this;
		return function (aParametres) {
			const lListeInfosServicesConcernes =
				lThis._getListeInfosServicesSelectionnes(aParametres.liste);
			let lNeContientQueDesArticlesAvecNivEquiv;
			let lAuMoinsUnNiveauEditable = false;
			if (
				!!lListeInfosServicesConcernes &&
				lListeInfosServicesConcernes.count() > 0
			) {
				lListeInfosServicesConcernes.parcourir((aInfoService) => {
					if (!lAuMoinsUnNiveauEditable) {
						lAuMoinsUnNiveauEditable = aInfoService.estNiveauEditable;
					}
					if (
						lNeContientQueDesArticlesAvecNivEquiv === undefined ||
						lNeContientQueDesArticlesAvecNivEquiv === true
					) {
						lNeContientQueDesArticlesAvecNivEquiv =
							DonneesListe_BilanParDomaineLVE_1.DonneesListe_BilanParDomaineLVE.unNiveauEquivalenceCEPeutEtreDefini(
								aInfoService.article,
							);
					}
				});
				if (lNeContientQueDesArticlesAvecNivEquiv) {
					UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauEquivalenceLVE(
						{
							instance: lThis,
							menuContextuel: aParametres.menuContextuel,
							evaluationsEditables: lAuMoinsUnNiveauEditable,
							callbackNiveau: function (aNiveauEquivalenceCE) {
								lThis.modificationNiveauEquivalenceLVE(
									lListeInfosServicesConcernes,
									aNiveauEquivalenceCE,
								);
							},
						},
					);
				} else {
					UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
						{
							instance: lThis,
							menuContextuel: aParametres.menuContextuel,
							genreChoixValidationCompetence:
								TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
									.tGVC_EvaluationEtItem,
							evaluationsEditables: lAuMoinsUnNiveauEditable,
							callbackNiveau: function (aNiveauAcquisition) {
								lThis.modifierNiveauAcquisitionLVE(
									lListeInfosServicesConcernes,
									aNiveauAcquisition,
								);
							},
						},
					);
				}
			}
		};
	}
	valider() {
		const lParams = {
			Pilier: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Pilier,
			),
			Palier: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Palier,
			),
			Service: this.etatUtilisateurSco.getServiceDePilier(),
			ListeEleves: this.getListeEleves(),
			observation: null,
			niveauDAcquisition: null,
			date: null,
			listeElementsCompetences: null,
			listeServicesLVE: null,
		};
		if (this.observationsModifiee) {
			lParams.observation = this.donnees.relationElevePilier.observations;
			this.observationsModifiee = false;
		}
		lParams.niveauDAcquisition =
			this.donnees.relationElevePilier.niveauDAcquisition;
		lParams.date = this.donnees.relationElevePilier.dateAcquisition;
		lParams.listeElementsCompetences = this.donnees.listeCompetences;
		if (!!this.donnees.listeServicesLVE) {
			lParams.listeServicesLVE = this.donnees.listeServicesLVE;
		}
		new ObjetRequeteSaisieBilanParDomaine_1.ObjetRequeteSaisieBilanParDomaine(
			this,
			this.actionSurValidation,
		).lancerRequete(lParams);
	}
	_getNiveauAcquisitionSurKeyUp(aEvent) {
		let lNiveauAcquisition = null;
		if (this.parametresSco.listeNiveauxDAcquisitions) {
			const lNiveauxConcernes =
				this.parametresSco.listeNiveauxDAcquisitions.getListeElements((D) => {
					return D.actifPour.contains(
						TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
							.tGVC_EvaluationEtItem,
					);
				});
			lNiveauAcquisition =
				UtilitaireCompetences_1.TUtilitaireCompetences.getNiveauAcqusitionDEventClavier(
					aEvent,
					lNiveauxConcernes,
				);
		}
		return lNiveauAcquisition;
	}
	_editionListeSelectionListe(aListeSelections, aMethodeEdition) {
		if (!aListeSelections || aListeSelections.count() === 0) {
			return;
		}
		let lAvecModif = false;
		aListeSelections.parcourir((aSelection) => {
			if (aMethodeEdition.call(this, aSelection)) {
				aSelection.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lAvecModif = true;
			}
		});
		if (lAvecModif) {
			this.setEtatSaisie(true);
			this.getInstance(this.identListeBilanDomaine).focusSurPremierElement();
			this.getInstance(this.identListeBilanDomaine).actualiser({
				conserverSelection: true,
			});
		}
	}
	_modifierNiveauDeSelectionCourante(aNiveau) {
		if (!aNiveau) {
			return;
		}
		const lListe = this.getInstance(this.identListeBilanDomaine);
		const lSelections = lListe.getListeElementsSelection();
		if (lSelections.count() === 0) {
			return;
		}
		this._editionListeSelectionListe(lSelections, (aSelection) => {
			if (
				aSelection.niveauEstEditable &&
				!!aNiveau &&
				(!aSelection.niveauDAcquisition ||
					aSelection.niveauDAcquisition.getGenre() !== aNiveau.getGenre())
			) {
				aSelection.niveauDAcquisition = aNiveau;
				aSelection.dateValidation = ObjetDate_1.GDate.getDateCourante();
				return true;
			}
		});
	}
	_editionCommentaireAcquisitions() {
		const lListe = this.getInstance(this.identListeBilanDomaine);
		const lSelections = lListe.getListeElementsSelection();
		const lCommentaire = lSelections.get(0).observation;
		const lCommentairePubliee = lSelections.get(0).observationPubliee;
		const lFenetreEditionObservation =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SaisieMessage_1.ObjetFenetre_SaisieMessage,
				{
					pere: this,
					evenement: function (aNumeroBouton, aDonnees) {
						if (aNumeroBouton === 1) {
							const lObservationSaisie = aDonnees.message;
							const lEstPublieeSaisie = aDonnees.estPublie;
							if (
								lObservationSaisie !== undefined ||
								lEstPublieeSaisie !== undefined
							) {
								this._editionListeSelectionListe(lSelections, (aSelection) => {
									if (lObservationSaisie !== undefined) {
										aSelection.observation = lObservationSaisie;
									}
									if (lEstPublieeSaisie !== undefined) {
										aSelection.observationPubliee = lEstPublieeSaisie;
									}
									return true;
								});
							}
						}
					},
					initialiser: function (aInstance) {
						aInstance.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"competences.AjouterCommentaire",
							),
						});
						aInstance.setParametresFenetreSaisieMessage({
							maxLengthSaisie: 1000,
							avecControlePublication: true,
						});
					},
				},
			);
		lFenetreEditionObservation.setDonnees(lCommentaire, lCommentairePubliee);
	}
	_modifierDateDeSelectionCourante() {
		const lListe = this.getInstance(this.identListeBilanDomaine);
		const lSelections = lListe.getListeElementsSelection();
		if (lSelections.count() === 0) {
			return;
		}
		const lDateInitiale = lSelections.get(0).dateValidation;
		const lFenetreDate = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Date_1.ObjetFenetre_Date,
			{
				pere: this,
				evenement: function (aNumeroBouton, aDate) {
					if (aNumeroBouton === 1) {
						this._editionListeSelectionListe(lSelections, (aSelection) => {
							if (aSelection.dateEstEditable && !!aDate) {
								aSelection.dateValidation = aDate;
								aSelection.estUneDateValidationMultiple = false;
								return true;
							}
						});
					}
				},
				initialiser: function (aInstance) {
					aInstance.setParametres(
						ObjetDate_1.GDate.PremierLundi,
						ObjetDate_1.GDate.premiereDate,
						ObjetDate_1.GDate.derniereDate,
					);
				},
			},
		);
		lFenetreDate.setDonnees(lDateInitiale);
	}
	_initialiseTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Eleve,
			Enumere_Ressource_1.EGenreRessource.Palier,
			Enumere_Ressource_1.EGenreRessource.Pilier,
			Enumere_Ressource_1.EGenreRessource.Service,
		]);
	}
	_evenementSurTripleCombo() {
		this.afficherBandeau(true);
		this.afficherPage();
	}
	_initialiseComboValidation(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 170,
			hauteur: 17,
			celluleAvecTexteHtml: true,
			ariaLabelledBy: this.Nom + "_libe_entete",
		});
	}
	_evenementSurComboValidation(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			aParams.element
		) {
			const lNiveauActuel = this.donnees.relationElevePilier.niveauDAcquisition;
			if (
				!lNiveauActuel ||
				lNiveauActuel.getNumero() !== aParams.element.getNumero()
			) {
				this.donnees.relationElevePilier.niveauDAcquisition =
					MethodesObjet_1.MethodesObjet.dupliquer(aParams.element);
				if (
					UtilitaireCompetences_1.TUtilitaireCompetences.estNiveauAcqui(
						this.donnees.relationElevePilier.niveauDAcquisition,
					)
				) {
					this.donnees.relationElevePilier.dateAcquisition =
						ObjetDate_1.GDate.getDateCourante();
				}
				this.setEtatSaisie(true);
				this.donnees.relationElevePilier.niveauDAcquisition.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this._actualiserDateValidation();
			}
		}
	}
	_evenementDateValidation(aDate) {
		this.donnees.relationElevePilier.dateAcquisition = aDate;
		this.setEtatSaisie(true);
	}
	_actualiserDateValidation() {
		const lNiveauActuel = this.donnees.relationElevePilier.niveauDAcquisition;
		const lEstAcquis = !!lNiveauActuel
			? UtilitaireCompetences_1.TUtilitaireCompetences.estNiveauAcqui(
					lNiveauActuel,
				)
			: false;
		const lCelluleDate = this.getInstance(this.identDate);
		lCelluleDate.setVisible(lEstAcquis);
		lCelluleDate.setDonnees(
			lEstAcquis ? this.donnees.relationElevePilier.dateAcquisition : undefined,
		);
		lCelluleDate.setActif(true);
	}
	_ouvrirFenetreChoixNiveauDomaine(aServiceLVE) {
		const lThis = this;
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			initCommandes: function (aInstance) {
				UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
					{
						instance: this,
						menuContextuel: aInstance,
						genreChoixValidationCompetence:
							TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
								.tGVC_EvaluationEtItem,
						evaluationsEditables: true,
						callbackNiveau: function (aNiveauAcquisition) {
							aServiceLVE.niveauAcquiDomaine = aNiveauAcquisition;
							if (!!aServiceLVE.estNiveauxMultiples) {
								aServiceLVE.estNiveauxMultiples = false;
							}
							aServiceLVE.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							lThis.setEtatSaisie(true);
							lThis.getInstance(lThis.identListeBilanDomaine).actualiser();
						},
					},
				);
			},
		});
	}
	_getListeInfosServicesSelectionnes(aListe) {
		let lListeInfosServices = null;
		if (!!aListe) {
			const lCellulesSelections = aListe.getTableauCellulesSelection();
			if (lCellulesSelections.length > 0) {
				lListeInfosServices = new ObjetListeElements_1.ObjetListeElements();
				const lDonneesListeLVE = aListe.getDonneesListe();
				for (let i = 0; i < lCellulesSelections.length; i++) {
					const lCelluleSelection = lCellulesSelections[i];
					const lInfosService = lDonneesListeLVE.getInfosService(
						lCelluleSelection.declarationColonne,
						lCelluleSelection.article,
					);
					if (!!lInfosService) {
						let lInfosServiceDejaAjoute = false;
						lListeInfosServices.parcourir((aInfosServiceDeListe) => {
							if (
								aInfosServiceDeListe.getNumero() ===
									lInfosService.getNumero() &&
								aInfosServiceDeListe.article.getNumero() ===
									lCelluleSelection.article.getNumero()
							) {
								lInfosServiceDejaAjoute = true;
								return true;
							}
						});
						if (!lInfosServiceDejaAjoute) {
							lInfosService.article = lCelluleSelection.article;
							lListeInfosServices.addElement(lInfosService);
						}
					}
				}
			}
		}
		return lListeInfosServices;
	}
	modificationNiveauEquivalenceLVE(aListeInfosServices, aNiveauEquivalenceCE) {
		if (!!aListeInfosServices) {
			this._editionListeSelectionListe(aListeInfosServices, (aInfosService) => {
				if (!!aInfosService && aInfosService.estNiveauEditable) {
					if (
						DonneesListe_BilanParDomaineLVE_1.DonneesListe_BilanParDomaineLVE.unNiveauEquivalenceCEPeutEtreDefini(
							aInfosService.article,
						)
					) {
						aInfosService.niveauEquivCE =
							aNiveauEquivalenceCE.getGenre() ===
							TypeNiveauEquivalenceCE_1.TypeNiveauEquivalenceCE.TNECE_Aucun
								? null
								: aNiveauEquivalenceCE;
						aInfosService.article.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						if (!!aInfosService.estNiveauxMultiples) {
							aInfosService.estNiveauxMultiples = false;
						}
						return true;
					}
				}
			});
		}
	}
	modifierNiveauAcquisitionLVE(aListeInfosServices, aNiveauAcquisition) {
		if (!!aListeInfosServices) {
			this._editionListeSelectionListe(aListeInfosServices, (aInfosService) => {
				if (!!aInfosService && aInfosService.estNiveauEditable) {
					if (
						!DonneesListe_BilanParDomaineLVE_1.DonneesListe_BilanParDomaineLVE.unNiveauEquivalenceCEPeutEtreDefini(
							aInfosService.article,
						)
					) {
						aInfosService.niveauAcquisition = aNiveauAcquisition;
						aInfosService.article.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						if (!!aInfosService.estNiveauxMultiples) {
							aInfosService.estNiveauxMultiples = false;
						}
						return true;
					}
				}
			});
		}
	}
}
exports.InterfaceBilanParDomaine_Saisie = InterfaceBilanParDomaine_Saisie;
