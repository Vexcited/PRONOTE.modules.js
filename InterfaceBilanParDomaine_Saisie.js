const { MethodesObjet } = require("MethodesObjet.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Date } = require("ObjetFenetre_Date.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { _InterfaceBilanParDomaine } = require("_InterfaceBilanParDomaine.js");
const {
	DonneesListe_BilanParDomaine,
} = require("DonneesListe_BilanParDomaine.js");
const {
	DonneesListe_BilanParDomaineLVE,
} = require("DonneesListe_BilanParDomaineLVE.js");
const { EGenreNiveauDAcquisition } = require("Enumere_NiveauDAcquisition.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const {
	ObjetRequeteSaisieBilanParDomaine,
} = require("ObjetRequeteSaisieBilanParDomaine.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { TypeGenreAppreciation } = require("TypeGenreAppreciation.js");
const {
	TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { ObjetFenetre_SaisieMessage } = require("ObjetFenetre_SaisieMessage.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { TypeNiveauEquivalenceCE } = require("TypeNiveauEquivalenceCE.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
class InterfaceBilanParDomaine_Saisie extends _InterfaceBilanParDomaine {
	constructor(...aParams) {
		super(...aParams);
		this.observationsModifiee = false;
	}
	construireInstances() {
		super.construireInstances();
		this.identTripleCombo = this.add(
			ObjetAffichagePageAvecMenusDeroulants,
			_evenementSurTripleCombo.bind(this),
			_initialiseTripleCombo,
		);
		this.identComboValidation = this.add(
			ObjetSaisiePN,
			_evenementSurComboValidation.bind(this),
			_initialiseComboValidation,
		);
		this.identDate = this.add(
			ObjetCelluleDate,
			_evenementDateValidation.bind(this),
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
			html: UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche("btnMrFiche"),
		});
		this.AddSurZone.push({ blocDroit: true });
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnMrFiche: {
				event() {
					TUtilitaireCompetences.afficherAideSaisieNiveauMaitrise({
						genreChoixValidationCompetence:
							TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
					});
				},
				getTitle() {
					return GTraductions.getValeur(
						"competences.TitreAideSaisieNivMaitrise",
					);
				},
			},
			getHtmlPied: function () {
				const H = [];
				if (aInstance.donnees.estDansLEtablissement) {
					let lHauteurTxtArea = aInstance.parametres.heightPied - 22;
					lHauteurTxtArea = 30;
					const lId = `${aInstance.Nom}_pied_ta_obs`;
					H.push(
						`<label class="PetitEspaceBas" for="${lId}">`,
						GTraductions.getValeur("competences.bilanpardomaine.Observations"),
						" :",
						"</label>",
						"<div>",
						`<ie-textareamax ie-model="textareaObservation" id="${lId}"`,
						' maxlength="',
						GParametres.getTailleMaxAppreciationParEnumere(
							TypeGenreAppreciation.GA_Observations_Competences,
						),
						'"',
						' style="width:100%; height:',
						lHauteurTxtArea,
						'px">',
						"</ie-textareamax>",
						"</div>",
					);
				} else {
					H.push(aInstance._composePiedNonEditable());
				}
				return H.join("");
			},
			textareaObservation: {
				getValue: function () {
					return aInstance.donnees.relationElevePilier.observations || "";
				},
				setValue: function (aValue) {
					aInstance.donnees.relationElevePilier.observations = aValue;
					aInstance.observationsModifiee = true;
					aInstance.setEtatSaisie(true);
				},
				getDisabled: function () {
					return !aInstance.donnees.droitSaisie;
				},
			},
			boutonValidationAutoDomaine: {
				event() {
					const lParamsValidationAuto = {
						estValidationCECRLDomaine: !!aInstance.estAffichageListeLVE(),
						instance: aInstance,
						listeEleves: aInstance.getListeEleves(),
					};
					if (!!aInstance.estAffichageListeLVE()) {
						const lServiceConcerne = aInstance.getServiceConcerne();
						lParamsValidationAuto.mrFiche =
							aInstance.getMrFichePourCalculAuto(lServiceConcerne);
					}
					TUtilitaireCompetences.surBoutonValidationAuto(lParamsValidationAuto);
				},
				getTitle() {
					return GTraductions.getValeur(
						"competences.validationAuto.hintBouton",
					);
				},
			},
		});
	}
	getParamsSupplementairesRequeteSelonContexte() {
		return {
			ressource: GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Classe,
			),
		};
	}
	getListeEleves() {
		return GEtatUtilisateur.Navigation.getRessources(EGenreRessource.Eleve);
	}
	getServiceConcerne() {
		return GEtatUtilisateur.getServiceDePilier();
	}
	_avecAffichageCoefficient() {
		return !GEtatUtilisateur.pourPrimaire();
	}
	_avecAffichageLegendeListe() {
		return this.estAffichageListeLVE();
	}
	_surEvenementListeBilanDomaineStandard(aParametres) {
		switch (aParametres.genreEvenement) {
			case EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_BilanParDomaine.colonnes.niveau:
						aParametres.ouvrirMenuContextuel();
						break;
					case DonneesListe_BilanParDomaine.colonnes.valider:
						_modifierDateDeSelectionCourante.call(this);
						break;
				}
				break;
			case EGenreEvenementListe.KeyUpListe: {
				const lNiveau = _getNiveauAcquisitionSurKeyUp(aParametres.event);
				if (!!lNiveau) {
					_modifierNiveauDeSelectionCourante.call(this, lNiveau);
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
						aSelection.getGenre() === EGenreRessource.Evaluation
					) {
						lObservationEditable = true;
					}
				}
				if (
					aSelection.dateEstEditable &&
					!!aSelection.niveauDAcquisition &&
					TUtilitaireCompetences.estNiveauAcqui(
						aSelection.niveauDAcquisition,
					) &&
					aSelection.getGenre() !== EGenreRessource.Evaluation
				) {
					lDateEditable = true;
				}
				lGenreChoixValidationCompetence =
					TypeGenreValidationCompetence.tGVC_EvaluationEtItem;
			});
			TUtilitaireCompetences.initMenuContextuelNiveauAcquisition({
				instance: lThis,
				menuContextuel: aParametres.menuContextuel,
				avecLibelleRaccourci: true,
				avecSousMenu: true,
				genreChoixValidationCompetence: lGenreChoixValidationCompetence,
				evaluationsEditables: lNiveauAcquiEditable,
				estDateEditable: lDateEditable,
				callbackNiveau: _modifierNiveauDeSelectionCourante.bind(lThis),
				callbackDate: lThis._avecAffichageDateValidation()
					? _modifierDateDeSelectionCourante.bind(lThis)
					: null,
				estObservationEditable: lObservationEditable,
				callbackCommentaire: _editionCommentaireAcquisitions.bind(lThis),
			});
		};
	}
	_afficherValidationDomaine() {
		let lAfficherValidation;
		if (this.estAffichageListeLVE()) {
			lAfficherValidation = true;
		} else {
			lAfficherValidation = GEtatUtilisateur.getServiceDePilier()
				? !GEtatUtilisateur.getServiceDePilier().existeNumero()
				: true;
		}
		return lAfficherValidation;
	}
	_afficherBtnValidationAutoDomaine() {
		if (this.estAffichageListeLVE()) {
			return (
				!GEtatUtilisateur.getServiceDePilier() ||
				!GEtatUtilisateur.getServiceDePilier().existeNumero()
			);
		}
		return false;
	}
	_construireEntete() {
		const H = [],
			lCombo = this.getInstance(this.identComboValidation),
			lCelluleDate = this.getInstance(this.identDate);
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
							'<div class="EspaceGauche InlineBlock AlignementMilieuVertical">',
							'<ie-btnicon ie-model="boutonValidationAutoDomaine" class="bt-activable icon_sigma"></ie-btnicon>',
							"</div>",
						);
					}
				} else {
					H.push(
						"<span>",
						GTraductions.getValeur("competences.DomaineLVENon", [
							GTraductions.getValeur("competences.ToutesLesLVE"),
						]),
						"</span>",
					);
				}
			} else {
				H.push(this._composerEntete());
			}
		}
		GHtml.setHtml(this.ids.entete, H.join(""), { instance: this });
		lCombo.initialiser();
		lCombo.setDonnees(
			TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourCombo({
				genreChoixValidationCompetence:
					TypeGenreValidationCompetence.tGVC_Competence,
				sansLibelleAucun: true,
				avecDispense: this.estPilierLVESelectionne(),
			}),
		);
		lCombo.setActif(true);
		const lNiveauActuel = this.donnees.relationElevePilier.niveauDAcquisition;
		if (
			!!lNiveauActuel &&
			lNiveauActuel.getGenre() !== EGenreNiveauDAcquisition.Multiple
		) {
			lCombo.setSelectionParNumeroEtGenre(lNiveauActuel.getNumero());
		}
		lCelluleDate.initialiser();
		_actualiserDateValidation.call(this);
	}
	_surEvenementListeBilanDomaineLVE(aParametres) {
		super._surEvenementListeBilanDomaineLVE(aParametres);
		switch (aParametres.genreEvenement) {
			case EGenreEvenementListe.Edition:
				aParametres.ouvrirMenuContextuel();
				break;
			case EGenreEvenementListe.KeyUpListe: {
				const lNiveauAcquisition = _getNiveauAcquisitionSurKeyUp(
					aParametres.event,
				);
				if (!!lNiveauAcquisition) {
					modifierNiveauAcquisitionLVE.call(
						this,
						_getListeInfosServicesSelectionnes(aParametres.instance),
						lNiveauAcquisition,
					);
				}
				break;
			}
			case EGenreEvenementListe.SelectionClickTotal: {
				const lServiceLVE = aParametres.declarationColonne.serviceLVE;
				if (!!lServiceLVE) {
					_ouvrirFenetreChoixNiveauDomaine.call(this, lServiceLVE);
				}
				break;
			}
		}
	}
	_getMethodeInitialisationMenuContextuelListeLVE() {
		const lThis = this;
		return function (aParametres) {
			const lListeInfosServicesConcernes = _getListeInfosServicesSelectionnes(
				aParametres.liste,
			);
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
							DonneesListe_BilanParDomaineLVE.unNiveauEquivalenceCEPeutEtreDefini(
								aInfoService.article,
							);
					}
				});
				if (lNeContientQueDesArticlesAvecNivEquiv) {
					TUtilitaireCompetences.initMenuContextuelNiveauEquivalenceLVE({
						instance: lThis,
						menuContextuel: aParametres.menuContextuel,
						evaluationsEditables: lAuMoinsUnNiveauEditable,
						callbackNiveau: function (aNiveauEquivalenceCE) {
							modificationNiveauEquivalenceLVE.call(
								lThis,
								lListeInfosServicesConcernes,
								aNiveauEquivalenceCE,
							);
						},
					});
				} else {
					TUtilitaireCompetences.initMenuContextuelNiveauAcquisition({
						instance: lThis,
						menuContextuel: aParametres.menuContextuel,
						genreChoixValidationCompetence:
							TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
						evaluationsEditables: lAuMoinsUnNiveauEditable,
						callbackNiveau: function (aNiveauAcquisition) {
							modifierNiveauAcquisitionLVE.call(
								lThis,
								lListeInfosServicesConcernes,
								aNiveauAcquisition,
							);
						},
					});
				}
			}
		};
	}
	valider() {
		const lParams = {
			Pilier: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Pilier),
			Palier: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Palier),
			Service: GEtatUtilisateur.getServiceDePilier(),
			ListeEleves: this.getListeEleves(),
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
		new ObjetRequeteSaisieBilanParDomaine(
			this,
			this.actionSurValidation,
		).lancerRequete(lParams);
	}
}
function _getNiveauAcquisitionSurKeyUp(aEvent) {
	let lNiveauAcquisition = null;
	if (GParametres.listeNiveauxDAcquisitions) {
		const lNiveauxConcernes =
			GParametres.listeNiveauxDAcquisitions.getListeElements((D) => {
				return D.actifPour.contains(
					TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
				);
			});
		lNiveauAcquisition =
			TUtilitaireCompetences.getNiveauAcqusitionDEventClavier(
				aEvent,
				lNiveauxConcernes,
			);
	}
	return lNiveauAcquisition;
}
function _editionListeSelectionListe(aListeSelections, aMethodeEdition) {
	if (!aListeSelections || aListeSelections.count() === 0) {
		return;
	}
	let lAvecModif = false;
	aListeSelections.parcourir((aSelection) => {
		if (aMethodeEdition.call(this, aSelection)) {
			aSelection.setEtat(EGenreEtat.Modification);
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
function _modifierNiveauDeSelectionCourante(aNiveau) {
	if (!aNiveau) {
		return;
	}
	const lListe = this.getInstance(this.identListeBilanDomaine),
		lSelections = lListe.getListeElementsSelection();
	if (lSelections.count() === 0) {
		return;
	}
	_editionListeSelectionListe.call(this, lSelections, (aSelection) => {
		if (
			aSelection.niveauEstEditable &&
			!!aNiveau &&
			(!aSelection.niveauDAcquisition ||
				aSelection.niveauDAcquisition.getGenre() !== aNiveau.getGenre())
		) {
			aSelection.niveauDAcquisition = aNiveau;
			aSelection.dateValidation = GDate.getDateCourante();
			return true;
		}
	});
}
function _editionCommentaireAcquisitions() {
	const lListe = this.getInstance(this.identListeBilanDomaine),
		lSelections = lListe.getListeElementsSelection();
	const lCommentaire = lSelections.get(0).observation;
	const lCommentairePubliee = lSelections.get(0).observationPubliee;
	const lFenetreEditionObservation = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_SaisieMessage,
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
						_editionListeSelectionListe.call(
							this,
							lSelections,
							(aSelection) => {
								if (lObservationSaisie !== undefined) {
									aSelection.observation = lObservationSaisie;
								}
								if (lEstPublieeSaisie !== undefined) {
									aSelection.observationPubliee = lEstPublieeSaisie;
								}
								return true;
							},
						);
					}
				}
			},
			initialiser: function (aInstance) {
				aInstance.setOptionsFenetre({
					titre: GTraductions.getValeur("competences.AjouterCommentaire"),
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
function _modifierDateDeSelectionCourante() {
	const lListe = this.getInstance(this.identListeBilanDomaine),
		lSelections = lListe.getListeElementsSelection();
	if (lSelections.count() === 0) {
		return;
	}
	const lDateInitiale = lSelections.get(0).dateValidation;
	ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Date, {
		pere: this,
		evenement: function (aNumeroBouton, aDate) {
			if (aNumeroBouton === 1) {
				_editionListeSelectionListe.call(this, lSelections, (aSelection) => {
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
				GDate.PremierLundi,
				GDate.premiereDate,
				GDate.derniereDate,
			);
		},
	}).setDonnees(lDateInitiale);
}
function _initialiseTripleCombo(aInstance) {
	aInstance.setParametres([
		EGenreRessource.Classe,
		EGenreRessource.Eleve,
		EGenreRessource.Palier,
		EGenreRessource.Pilier,
		EGenreRessource.Service,
	]);
}
function _evenementSurTripleCombo() {
	this.afficherBandeau(true);
	this.afficherPage();
}
function _initialiseComboValidation(aInstance) {
	aInstance.setOptionsObjetSaisie({
		longueur: 170,
		hauteur: 17,
		celluleAvecTexteHtml: true,
		labelledById: this.Nom + "_libe_entete",
	});
}
function _evenementSurComboValidation(aParams) {
	if (
		aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
		aParams.element
	) {
		const lNiveauActuel = this.donnees.relationElevePilier.niveauDAcquisition;
		if (
			!lNiveauActuel ||
			lNiveauActuel.getNumero() !== aParams.element.getNumero()
		) {
			this.donnees.relationElevePilier.niveauDAcquisition =
				MethodesObjet.dupliquer(aParams.element);
			if (
				TUtilitaireCompetences.estNiveauAcqui(
					this.donnees.relationElevePilier.niveauDAcquisition,
				)
			) {
				this.donnees.relationElevePilier.dateAcquisition =
					GDate.getDateCourante();
			}
			this.setEtatSaisie(true);
			this.donnees.relationElevePilier.niveauDAcquisition.setEtat(
				EGenreEtat.Modification,
			);
			_actualiserDateValidation.call(this);
		}
	}
}
function _evenementDateValidation(aDate) {
	this.donnees.relationElevePilier.dateAcquisition = aDate;
	this.setEtatSaisie(true);
}
function _actualiserDateValidation() {
	const lNiveauActuel = this.donnees.relationElevePilier.niveauDAcquisition;
	const lEstAcquis = !!lNiveauActuel
		? TUtilitaireCompetences.estNiveauAcqui(lNiveauActuel)
		: false;
	const lCelluleDate = this.getInstance(this.identDate);
	lCelluleDate.setVisible(lEstAcquis);
	lCelluleDate.setDonnees(
		lEstAcquis ? this.donnees.relationElevePilier.dateAcquisition : "",
	);
	lCelluleDate.setActif(true);
}
function _ouvrirFenetreChoixNiveauDomaine(aServiceLVE) {
	const lThis = this;
	ObjetMenuContextuel.afficher({
		pere: this,
		initCommandes: function (aInstance) {
			TUtilitaireCompetences.initMenuContextuelNiveauAcquisition({
				instance: this,
				menuContextuel: aInstance,
				genreChoixValidationCompetence:
					TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
				evaluationsEditables: true,
				callbackNiveau: function (aNiveauAcquisition) {
					aServiceLVE.niveauAcquiDomaine = aNiveauAcquisition;
					if (!!aServiceLVE.estNiveauxMultiples) {
						aServiceLVE.estNiveauxMultiples = false;
					}
					aServiceLVE.setEtat(EGenreEtat.Modification);
					lThis.setEtatSaisie(true);
					lThis.getInstance(lThis.identListeBilanDomaine).actualiser();
				},
			});
		},
	});
}
function _getListeInfosServicesSelectionnes(aListe) {
	let lListeInfosServices = null;
	if (!!aListe) {
		const lCellulesSelections = aListe.getTableauCellulesSelection();
		if (lCellulesSelections.length > 0) {
			lListeInfosServices = new ObjetListeElements();
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
							aInfosServiceDeListe.getNumero() === lInfosService.getNumero() &&
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
function modificationNiveauEquivalenceLVE(
	aListeInfosServices,
	aNiveauEquivalenceCE,
) {
	if (!!aListeInfosServices) {
		_editionListeSelectionListe.call(
			this,
			aListeInfosServices,
			(aInfosService) => {
				if (!!aInfosService && aInfosService.estNiveauEditable) {
					if (
						DonneesListe_BilanParDomaineLVE.unNiveauEquivalenceCEPeutEtreDefini(
							aInfosService.article,
						)
					) {
						aInfosService.niveauEquivCE =
							aNiveauEquivalenceCE.getGenre() ===
							TypeNiveauEquivalenceCE.TNECE_Aucun
								? null
								: aNiveauEquivalenceCE;
						aInfosService.article.setEtat(EGenreEtat.Modification);
						if (!!aInfosService.estNiveauxMultiples) {
							aInfosService.estNiveauxMultiples = false;
						}
						return true;
					}
				}
			},
		);
	}
}
function modifierNiveauAcquisitionLVE(aListeInfosServices, aNiveauAcquisition) {
	if (!!aListeInfosServices) {
		_editionListeSelectionListe.call(
			this,
			aListeInfosServices,
			(aInfosService) => {
				if (!!aInfosService && aInfosService.estNiveauEditable) {
					if (
						!DonneesListe_BilanParDomaineLVE.unNiveauEquivalenceCEPeutEtreDefini(
							aInfosService.article,
						)
					) {
						aInfosService.niveauAcquisition = aNiveauAcquisition;
						aInfosService.article.setEtat(EGenreEtat.Modification);
						if (!!aInfosService.estNiveauxMultiples) {
							aInfosService.estNiveauxMultiples = false;
						}
						return true;
					}
				}
			},
		);
	}
}
module.exports = InterfaceBilanParDomaine_Saisie;
