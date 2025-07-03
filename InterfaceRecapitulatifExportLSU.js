exports.InterfaceRecapitulatifExportLSU = void 0;
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_1 = require("ObjetStyle");
const DonneesListe_Simple_1 = require("DonneesListe_Simple");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_RecapitulatifExportLSU_1 = require("DonneesListe_RecapitulatifExportLSU");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetRequeteRecapitulatifExportLSU_1 = require("ObjetRequeteRecapitulatifExportLSU");
const ObjetRequeteExportLSUHtml_1 = require("ObjetRequeteExportLSUHtml");
const MultipleObjetRequeteSaisieRecapitulatifLSU = require("ObjetRequeteSaisieRecapitulatifLSU");
const TypeColonneRecapExportLSU_1 = require("TypeColonneRecapExportLSU");
const TypeEnseignementComplement_1 = require("TypeEnseignementComplement");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const TypePointsEnseignementComplement_1 = require("TypePointsEnseignementComplement");
const TypeOrigineCreationLangueRegionale_1 = require("TypeOrigineCreationLangueRegionale");
const TypeNiveauEquivalenceCE_1 = require("TypeNiveauEquivalenceCE");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetFiche_1 = require("ObjetFiche");
const TypeExportabiliteLSU_1 = require("TypeExportabiliteLSU");
const MultipleObjetRequeteGenerationExportLSU = require("ObjetRequeteGenerationExportLSU");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetDate_1 = require("ObjetDate");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const ObjetTraduction_2 = require("ObjetTraduction");
const TradInterfaceRecapitulatifExportLSU =
	ObjetTraduction_2.TraductionsModule.getModule(
		"InterfaceRecapitulatifExportLSU",
		{
			Afficher_uniquement_eleves_non_exportables: "",
			VoirLivretEleve: "",
			SaisieEnseignementsComplement: "",
			SaisieObjectifs: "",
			SaisieLangueRegionale: "",
			SaisieNiveauLangueRegionale: "",
			ExporterVersLSU: "",
			DescriptifExportLSU: "",
			InclureBilanFinDeCycle: "",
			ClassesFinDeCycleSecondaire: "",
			ClassesFinDeCyclePrimaire: "",
			ExportDonneesDeLaPeriode: "",
			PeriodeDefinieDuAu: "",
			VerificationDatesSurONDE: "",
		},
	);
class InterfaceRecapitulatifExportLSU extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = GApplication;
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.donnees = {
			listePiliers: new ObjetListeElements_1.ObjetListeElements(),
		};
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.AddSurZone = [this.identMenuDeroulants];
		this.AddSurZone.push({
			html: IE.jsx.str(
				"ie-checkbox",
				{
					class: "AlignementMilieuVertical",
					"ie-model": this.jsxModeleCheckboxUniquementNonExportables.bind(this),
				},
				ObjetChaine_1.GChaine.insecable(
					TradInterfaceRecapitulatifExportLSU.Afficher_uniquement_eleves_non_exportables,
				),
			),
		});
	}
	construireInstances() {
		this.identMenuDeroulants = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evntSurDernierMenuDeroulant.bind(this),
			this._initMenuDeroulants,
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evtListe.bind(this),
		);
		this.identFicheExport = this.add(ObjetFicheExportHtml);
	}
	jsxModeleCheckboxUniquementNonExportables() {
		return {
			getValue: () => {
				return this.uniquementNonExportable;
			},
			setValue: (aValue) => {
				this.uniquementNonExportable = aValue;
				const lInstanceListe = this.getInstance(this.identListe);
				if (lInstanceListe) {
					const lDonneesListe = lInstanceListe.getDonneesListe();
					lDonneesListe.setParametres({ uniquementNonExportables: aValue });
					lInstanceListe.actualiser(true);
				}
			},
		};
	}
	jsxModeleBoutonVoirLivretEleve() {
		return {
			event: () => {
				this._evtSurBtnVoirLivretEleve();
			},
			getDisabled: () => {
				const lInstanceListe = this.getInstance(this.identListe);
				if (!!lInstanceListe && !!lInstanceListe.getElementSelection()) {
					return false;
				}
				return true;
			},
		};
	}
	jsxModeleBoutonExportLSU() {
		return {
			event: () => {
				this._evtSurBtnExportLSU();
			},
			getDisabled: () => {
				let lBoutonExportDisabled = true;
				const lInstanceListe = this.getInstance(this.identListe);
				if (lInstanceListe && lInstanceListe.getDonneesListe()) {
					const lListeEleves = lInstanceListe.getListeArticles();
					if (lListeEleves) {
						lListeEleves.parcourir((aEleve) => {
							if (
								aEleve.exportable !==
								TypeExportabiliteLSU_1.TypeExportabiliteLSU.telsu_NonExportable
							) {
								lBoutonExportDisabled = false;
								return false;
							}
						});
					}
				}
				return lBoutonExportDisabled;
			},
		};
	}
	construireStructureAffichageAutre() {
		const lHeightBandeauBouton = 70;
		const H = [];
		H.push(
			'<div class="Espace" style="',
			ObjetStyle_1.GStyle.composeHeightCalc(10),
			'">',
			'<div style="',
			ObjetStyle_1.GStyle.composeHeight(lHeightBandeauBouton),
			'">',
		);
		const lVoirLivretEleve =
			TradInterfaceRecapitulatifExportLSU.VoirLivretEleve;
		H.push(
			IE.jsx.str(
				"ie-bouton",
				{
					class: "bouton-carre",
					"ie-model": this.jsxModeleBoutonVoirLivretEleve.bind(this),
					"ie-icon": "icon_eye_open",
					"ie-iconsize": "2.4rem",
					title: lVoirLivretEleve,
				},
				lVoirLivretEleve,
			),
		);
		if (this.etatUtilisateurSco.pourPrimaire()) {
			const lExporterVersLSU =
				TradInterfaceRecapitulatifExportLSU.ExporterVersLSU;
			H.push(
				IE.jsx.str(
					"ie-bouton",
					{
						class: "MargeGauche bouton-carre",
						"ie-model": this.jsxModeleBoutonExportLSU.bind(this),
						"ie-icon": "icon_lsu",
						"ie-iconsize": "2.4rem",
						title: lExporterVersLSU,
					},
					lExporterVersLSU,
				),
			);
		}
		H.push("</div>");
		H.push(
			IE.jsx.str("div", {
				id: this.getNomInstance(this.identListe),
				style: ObjetStyle_1.GStyle.composeHeightCalc(lHeightBandeauBouton),
			}),
		);
		H.push("</div>");
		return H.join("");
	}
	afficherPage() {
		const lClasse = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		const lPeriode = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
		if (!lClasse || !lPeriode) {
			return;
		}
		new ObjetRequeteRecapitulatifExportLSU_1.ObjetRequeteRecapitulatifExportLSU(
			this,
			this._surReponseRequeteRecapitulatifExportLSU.bind(this),
		).lancerRequete({ classe: lClasse, periode: lPeriode });
	}
	surResizeInterface() {
		if (this.getInstance(this.identFicheExport)) {
			this.getInstance(this.identFicheExport).fermer();
		}
	}
	initMenuContextuelListe(aParametres) {
		const lPilierConcerne = this.donnees.listePiliers.get(this.indexPilier);
		const lAvecDispense = !!lPilierConcerne
			? lPilierConcerne.estLVE === true
			: false;
		UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
			{
				instance: this,
				menuContextuel: aParametres.menuContextuel,
				genreChoixValidationCompetence:
					TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
						.tGVC_Competence,
				callbackNiveau: this._surSelectionNiveau.bind(this),
				avecDispense: lAvecDispense,
			},
		);
	}
	valider() {
		this.setEtatSaisie(false);
		if (MultipleObjetRequeteSaisieRecapitulatifLSU) {
			new MultipleObjetRequeteSaisieRecapitulatifLSU.ObjetRequeteSaisieRecapitulatifLSU(
				this,
				this.actionSurValidation,
			).lancerRequete(
				{
					classe: this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
					),
					periode: this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					),
					listeEleves: this.getInstance(this.identListe).getListeArticles(),
				},
				this.donnees.listePiliers,
			);
		}
	}
	_initMenuDeroulants(aInstance) {
		aInstance.setParametres(
			[
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Periode,
			],
			false,
		);
	}
	_evntSurDernierMenuDeroulant() {
		this.afficherBandeau(true);
		this.afficherPage();
	}
	_evtSurBtnVoirLivretEleve() {
		const lEleve = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		if (
			lEleve &&
			lEleve.exportable !==
				TypeExportabiliteLSU_1.TypeExportabiliteLSU.telsu_NonExportable
		) {
			new ObjetRequeteExportLSUHtml_1.ObjetRequeteExportLSUHtml(
				this,
				this._afficherExportHtml.bind(this),
			).lancerRequete({
				eleve: lEleve,
				periode: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				),
			});
		} else {
			GApplication.getMessage().afficher({
				message: ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.nonExportableLSU",
				),
			});
		}
	}
	_afficherExportHtml(aParam) {
		if (!!aParam && aParam.html) {
			const lLargeurMax = Math.floor(ObjetNavigateur_1.Navigateur.clientL / 2);
			const lHauteurMax = ObjetNavigateur_1.Navigateur.clientH - 200;
			this.getInstance(this.identFicheExport).setDonnees({
				html: aParam.html,
				hauteurMax: lHauteurMax,
				largeurMax: lLargeurMax,
			});
		}
	}
	_evtSurBtnExportLSU() {
		const lClasse = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		const lPeriode = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetreParametrageExportLSU,
			{
				pere: this,
				evenement: (aGenreBouton, aParametresExport) => {
					if (aGenreBouton === 1) {
						if (MultipleObjetRequeteGenerationExportLSU) {
							new MultipleObjetRequeteGenerationExportLSU.ObjetRequeteGenerationExportLSU(
								this,
								this._surExportLSU,
							).lancerRequete({
								classe: lClasse,
								periode: lPeriode,
								avecBilanFinDeCycle: aParametresExport.inclureBilanFinDeCycle,
							});
						}
					}
				},
				initialiser: (aInstance) => {
					const lTraductionTitreFenetre = [];
					lTraductionTitreFenetre.push(
						TradInterfaceRecapitulatifExportLSU.ExporterVersLSU,
					);
					lTraductionTitreFenetre.push(" - ");
					lTraductionTitreFenetre.push(lClasse.getLibelle());
					aInstance.setOptionsFenetre({
						titre: lTraductionTitreFenetre.join(""),
						largeur: 450,
						hauteur: 180,
						listeBoutons: [
							{
								libelle: ObjetTraduction_1.GTraductions.getValeur("Annuler"),
								theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
							},
							{
								libelle: ObjetTraduction_1.GTraductions.getValeur(
									"GenerationPDF.Generer",
								),
								theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
							},
						],
					});
				},
			},
		);
		lFenetre.setDonnees({
			estUneClasseFinDeCycle: lClasse.estFinDeCycle,
			periode: lPeriode,
		});
	}
	_surExportLSU(aUrl) {
		if (!!aUrl) {
			window.open(aUrl);
		}
	}
	_evtListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition: {
				const lIdColonne = parseInt(aParametres.idColonne);
				if (
					lIdColonne ===
					TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
						.tcrl_EnseignementDeComplement
				) {
					this._surEditionEnseignementComplement(aParametres.article);
				} else if (
					lIdColonne ===
					TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Objectifs
				) {
					this._surEditionObjectifs(aParametres.article);
				} else if (
					lIdColonne ===
					TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_LangueRegionale
				) {
					this._surEditionLangueRegionale(aParametres.article);
				} else if (
					lIdColonne ===
					TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
						.tcrl_NiveauLangueRegionale
				) {
					this._surEditionNiveauLangueRegionale(aParametres.article);
				} else if (
					aParametres.instance
						.getDonneesListe()
						.isColonnePilierDeCompetence(aParametres.idColonne)
				) {
					const lIndexPilier = aParametres.instance
						.getDonneesListe()
						.getIndexPilierDeCompetence(aParametres.idColonne);
					this._surEditionPilierDeCompetence(aParametres, lIndexPilier);
				}
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.etatUtilisateurSco.Navigation.setRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
					aParametres.article,
				);
				break;
		}
	}
	_ouvrirFenetreEditionListe(
		aTitreFenetre,
		aListeElements,
		aValeurActuelle,
		aCallbackAffecterNouvelleValeur,
	) {
		const lThis = this;
		const lFenetreListe = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				evenement: function (aNumeroBouton, aElementSelectionne) {
					if (aNumeroBouton === 1) {
						aCallbackAffecterNouvelleValeur(aElementSelectionne, () => {
							lThis.setEtatSaisie(true);
							lThis.getInstance(lThis.identListe).actualiser(true);
						});
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: aTitreFenetre,
						largeur: 350,
						hauteur: 250,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
					aInstance.paramsListe = { tailles: ["100%"] };
				},
			},
		);
		lFenetreListe.setDonnees(
			new DonneesListe_Simple_1.DonneesListe_Simple(aListeElements),
			false,
		);
		let lIndice = 0;
		if (!!aValeurActuelle) {
			lIndice = aListeElements.getIndiceElementParFiltre((D) => {
				return ObjetChaine_1.GChaine.estChaineHTMLEgal(
					D.getLibelle(),
					aValeurActuelle,
				);
			});
			lIndice = Math.max(0, Math.min(aListeElements.count(), lIndice));
		}
		const lListeSelection = new ObjetListeElements_1.ObjetListeElements();
		lListeSelection.addElement(
			MethodesObjet_1.MethodesObjet.dupliquer(aListeElements.get(lIndice)),
		);
		lFenetreListe.setListeElementsSelection(lListeSelection);
	}
	_affecterNouvelleValeur(aArticle, aIdColonne, aNouvelleValeur) {
		let result = false;
		if (!!aArticle && !!aArticle.ListeColonnes) {
			const lObjetElement =
				aArticle.ListeColonnes.getElementParGenre(aIdColonne);
			if (!!lObjetElement) {
				lObjetElement.valeur = aNouvelleValeur;
				lObjetElement.hint = aNouvelleValeur;
				lObjetElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				result = true;
			}
		}
		return result;
	}
	_surEditionEnseignementComplement(aArticle) {
		const lObjetElementActuel = aArticle.ListeColonnes.getElementParGenre(
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_EnseignementDeComplement,
		);
		const lValeurActuelle = !!lObjetElementActuel
			? lObjetElementActuel.valeur
			: "";
		const lListeElements =
			TypeEnseignementComplement_1.TypeEnseignementComplementUtil.toListe();
		this._ouvrirFenetreEditionListe(
			TradInterfaceRecapitulatifExportLSU.SaisieEnseignementsComplement,
			lListeElements,
			lValeurActuelle,
			(aIndexElementSelectionne, aFinalCallback) => {
				const lElementSelectionne = lListeElements.get(
					aIndexElementSelectionne,
				);
				if (lElementSelectionne) {
					const lSaisie = this._affecterNouvelleValeur(
						aArticle,
						TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
							.tcrl_EnseignementDeComplement,
						TypeEnseignementComplement_1.TypeEnseignementComplementUtil.getLibelle(
							lElementSelectionne.getGenre(),
						),
					);
					if (lSaisie === true) {
						this._affecterNouvelleValeur(
							aArticle,
							TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Objectifs,
							TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.getLibelleCourt(
								TypePointsEnseignementComplement_1
									.TypePointsEnseignementComplement.tpec_Aucun,
							),
						);
						if (!!aFinalCallback) {
							aFinalCallback();
						}
					}
				}
			},
		);
	}
	_surEditionObjectifs(aArticle) {
		const lObjetElementActuel = aArticle.ListeColonnes.getElementParGenre(
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Objectifs,
		);
		const lTypeObjectifActuel =
			TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.getType(
				!!lObjetElementActuel ? lObjetElementActuel.valeur : "",
			);
		const lValeurActuelle =
			TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.getLibellePoints(
				lTypeObjectifActuel,
			);
		const lListeElements =
			TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.toListe(
				true,
			);
		this._ouvrirFenetreEditionListe(
			TradInterfaceRecapitulatifExportLSU.SaisieObjectifs,
			lListeElements,
			lValeurActuelle,
			(aIndexElementSelectionne, aFinalCallback) => {
				const lElementSelectionne = lListeElements.get(
					aIndexElementSelectionne,
				);
				if (lElementSelectionne) {
					const lSaisie = this._affecterNouvelleValeur(
						aArticle,
						TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Objectifs,
						TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.getLibelleCourt(
							lElementSelectionne.getGenre(),
						),
					);
					if (lSaisie === true && !!aFinalCallback) {
						aFinalCallback();
					}
				}
			},
		);
	}
	_surEditionLangueRegionale(aArticle) {
		const lObjetElementActuel = aArticle.ListeColonnes.getElementParGenre(
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_LangueRegionale,
		);
		const lValeurActuelle = !!lObjetElementActuel
			? lObjetElementActuel.valeur
			: TypeOrigineCreationLangueRegionale_1.TypeOrigineCreationLangueRegionaleUtil.getLibelle(
					TypeOrigineCreationLangueRegionale_1
						.TypeOrigineCreationLangueRegionale.toclr_Aucune,
				);
		const lListeLanguesRegionales =
			TypeOrigineCreationLangueRegionale_1.TypeOrigineCreationLangueRegionaleUtil.toListe();
		this._ouvrirFenetreEditionListe(
			TradInterfaceRecapitulatifExportLSU.SaisieLangueRegionale,
			lListeLanguesRegionales,
			lValeurActuelle,
			(aIndexElementSelectionne, aFinalCallback) => {
				let lNouvelleValeur = "";
				if (aIndexElementSelectionne > 0) {
					const lElementSelectionne = lListeLanguesRegionales.get(
						aIndexElementSelectionne,
					);
					if (lElementSelectionne) {
						lNouvelleValeur =
							TypeOrigineCreationLangueRegionale_1.TypeOrigineCreationLangueRegionaleUtil.getLibelle(
								lElementSelectionne.getGenre(),
							);
					}
				}
				const lSaisie = this._affecterNouvelleValeur(
					aArticle,
					TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_LangueRegionale,
					lNouvelleValeur,
				);
				if (lSaisie === true) {
					this._affecterNouvelleValeur(
						aArticle,
						TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
							.tcrl_NiveauLangueRegionale,
						"",
					);
					if (!!aFinalCallback) {
						aFinalCallback();
					}
				}
			},
		);
	}
	_surEditionNiveauLangueRegionale(aArticle) {
		const lObjetElementActuel = aArticle.ListeColonnes.getElementParGenre(
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_NiveauLangueRegionale,
		);
		const lValeurActuelle = !!lObjetElementActuel
			? lObjetElementActuel.valeur
			: TypeNiveauEquivalenceCE_1.TypeNiveauEquivalenceCEUtil.getLibelle(
					true,
					false,
					TypeNiveauEquivalenceCE_1.TypeNiveauEquivalenceCE.TNECE_Aucun,
				);
		const lListeElements =
			TypeNiveauEquivalenceCE_1.TypeNiveauEquivalenceCEUtil.getListeNiveauxEquivalenceLVE(
				false,
			);
		this._ouvrirFenetreEditionListe(
			TradInterfaceRecapitulatifExportLSU.SaisieNiveauLangueRegionale,
			lListeElements,
			lValeurActuelle,
			(aIndexElementSelectionne, aFinalCallback) => {
				let lNouvelleValeur = "";
				if (aIndexElementSelectionne > 0) {
					const lElementSelectionne = lListeElements.get(
						aIndexElementSelectionne,
					);
					if (lElementSelectionne) {
						lNouvelleValeur =
							TypeNiveauEquivalenceCE_1.TypeNiveauEquivalenceCEUtil.getLibelle(
								true,
								false,
								lElementSelectionne.getGenre(),
							);
					}
				}
				const lSaisie = this._affecterNouvelleValeur(
					aArticle,
					TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
						.tcrl_NiveauLangueRegionale,
					lNouvelleValeur,
				);
				if (lSaisie === true && !!aFinalCallback) {
					aFinalCallback();
				}
			},
		);
	}
	_surEditionPilierDeCompetence(aParametres, aIndexPilier) {
		this.article = aParametres.article;
		this.indexPilier = aIndexPilier;
		aParametres.ouvrirMenuContextuel();
	}
	_surSelectionNiveau(aNiveau) {
		const lIndiceColonne = this.article.ListeColonnes.getIndiceElementParFiltre(
			(D) => {
				if (
					D.getGenre() ===
						TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_SocleCommun &&
					D.indexPilier === this.indexPilier
				) {
					return true;
				}
			},
		);
		if (
			lIndiceColonne > -1 &&
			lIndiceColonne < this.article.ListeColonnes.count()
		) {
			const lObjElementColonne = this.article.ListeColonnes.get(lIndiceColonne);
			lObjElementColonne.valeur =
				MethodesObjet_1.MethodesObjet.dupliquer(aNiveau);
			lObjElementColonne.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
			this.getInstance(this.identListe).actualiser(true);
		}
	}
	getLargeurColonne(aIdColonne) {
		switch (aIdColonne) {
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Diagnostic:
				return 40;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_ELeve:
				return 140;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Sconet:
				return 90;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_PAIPPS:
				return 120;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Niveau:
				return 60;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Classe:
				return 60;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Onde:
				return 80;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Mef:
				return 60;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Positionnement:
				return 100;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_CodeSiecle:
				return 80;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_ElementsTravailles:
				return 80;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_CompetencesEvaluees:
				return 80;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_DomainesRenseignes:
				return 80;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_AppreciationGenerale:
				return 120;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_DateCC:
				return 80;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_CompetencesNumeriques:
				return 80;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_EPI:
				return 100;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_AccompagnementPerso:
				return 100;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_DevoirsFait:
				return 100;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_ParcoursEducatif:
				return 50;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_LangueRegionale:
				return 80;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_NiveauLangueRegionale:
				return 50;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_EnseignementDeComplement:
				return 130;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Objectifs:
				return 100;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_BilanComplet:
				return 40;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_SocleCommun:
				return 30;
			case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_AppreciationFinDeCycle:
				return 220;
		}
		return 100;
	}
	getTitreRegroupementColonne(aListeGroupesColonnes, aGenreGroupeColonne) {
		let result = "";
		if (!!aListeGroupesColonnes) {
			aListeGroupesColonnes.parcourir((D) => {
				if (D.getGenre() === aGenreGroupeColonne) {
					result = D.getLibelle();
					return false;
				}
			});
		}
		return result;
	}
	getListeColonnes(aListeGroupeColonnes, aListeColonnes) {
		const lResult = [];
		if (!!aListeColonnes) {
			let lTitreRegroupementColonnePrecedent;
			let lTitreRegroupementColonne;
			let lIndiceColonneSocleCommun = 0;
			aListeColonnes.parcourir((D, aIndex) => {
				lTitreRegroupementColonne = this.getTitreRegroupementColonne(
					aListeGroupeColonnes,
					D.groupeColonne,
				);
				if (
					D.getGenre() ===
					TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_SocleCommun
				) {
					lResult.push({
						id: D.getGenre() + "_" + lIndiceColonneSocleCommun,
						taille: this.getLargeurColonne(D.getGenre()),
						titre: [
							{
								libelle:
									lTitreRegroupementColonnePrecedent !==
									lTitreRegroupementColonne
										? lTitreRegroupementColonne
										: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
								title: lTitreRegroupementColonne,
							},
							{ libelle: D.getLibelle(), title: D.hint },
						],
					});
					lIndiceColonneSocleCommun++;
				} else {
					const lTabTitreColonne = [];
					if (aIndex === 0) {
						lTabTitreColonne.push({ libelle: D.getLibelle(), title: D.hint });
					} else {
						lTabTitreColonne.push({
							libelle:
								lTitreRegroupementColonnePrecedent !== lTitreRegroupementColonne
									? lTitreRegroupementColonne
									: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
							title: lTitreRegroupementColonne,
						});
						lTabTitreColonne.push({ libelle: D.getLibelle(), title: D.hint });
					}
					lResult.push({
						id: D.getGenre().toString(),
						taille: this.getLargeurColonne(D.getGenre()),
						titre: lTabTitreColonne,
					});
				}
				lTitreRegroupementColonnePrecedent = lTitreRegroupementColonne;
			});
		}
		return lResult;
	}
	_surReponseRequeteRecapitulatifExportLSU(aParam) {
		const lDonneesListe =
			new DonneesListe_RecapitulatifExportLSU_1.DonneesListe_RecapitulatifExportLSU(
				aParam.ListeEleves,
				{
					uniquementNonExportables: this.uniquementNonExportable,
					initMenuContextuel: this.initMenuContextuelListe.bind(this),
				},
			);
		this.donnees.listePiliers.vider();
		if (!!aParam.listeColonnes) {
			const lThis = this;
			aParam.listeColonnes.parcourir((D) => {
				if (
					D.getGenre() ===
						TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_SocleCommun &&
					!!D.pilier
				) {
					lThis.donnees.listePiliers.addElement(D.pilier);
				}
			});
		}
		const lObjetListe = this.getInstance(this.identListe);
		lObjetListe.setOptionsListe({
			colonnes: this.getListeColonnes(
				aParam.listeGroupesColonnes,
				aParam.listeColonnes,
			),
			scrollHorizontal: true,
		});
		this.etatUtilisateurSco.setTriListe({
			liste: lObjetListe,
			tri: [
				{
					id: TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Diagnostic.toString(),
					genre: Enumere_TriElement_1.EGenreTriElement.Decroissant,
				},
				TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_ELeve.toString(),
			],
		});
		this.getInstance(this.identListe).setDonnees(lDonneesListe);
	}
}
exports.InterfaceRecapitulatifExportLSU = InterfaceRecapitulatifExportLSU;
class ObjetFicheExportHtml extends ObjetFiche_1.ObjetFiche {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({ modale: true, avecTailleSelonContenu: true });
	}
	composeContenu() {
		const H = [];
		H.push(
			'<div style="height:',
			this.donneesFicheExportHtml.hauteurMax,
			"px;width:",
			this.donneesFicheExportHtml.largeurMax,
			'px; overflow: auto;">',
			this.donneesFicheExportHtml.html,
			"</div>",
		);
		return H.join("");
	}
	setDonnees(aDonnees) {
		this.donneesFicheExportHtml = aDonnees;
		this.afficher();
	}
}
class ObjetFenetreParametrageExportLSU extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = GApplication;
		this.parametresSco = lApplicationSco.getObjetParametres();
		this.inclureBilanFinDeCycle = true;
		this.estUneClasseFinDeCycle = false;
		this.periodeConcernee = null;
	}
	jsxModeleCheckboxInclureBilanFinDeCycle() {
		return {
			getValue: () => {
				return this.inclureBilanFinDeCycle;
			},
			setValue: (aValue) => {
				this.inclureBilanFinDeCycle = aValue;
			},
			getDisabled: () => {
				return !this.estUneClasseFinDeCycle;
			},
		};
	}
	jsxGetStrChoixPeriode() {
		const lLibellePeriode = !!this.periodeConcernee
			? this.periodeConcernee.getLibelle()
			: "";
		const lHtmlPeriode = '<span class="Gras">' + lLibellePeriode + "</span>";
		return TradInterfaceRecapitulatifExportLSU.ExportDonneesDeLaPeriode.format(
			lHtmlPeriode,
		);
	}
	jsxGetStrDatesPeriodeChoisie() {
		const lBorneDatesPeriode = this._getBornesPeriodeSelectionnee();
		const lHtmlDateDebut =
			'<span class="Gras">' +
			ObjetDate_1.GDate.formatDate(
				lBorneDatesPeriode.dateDebut,
				"%JJ/%MM/%AAAA",
			) +
			"</span>";
		const lHtmlDateFin =
			'<span class="Gras">' +
			ObjetDate_1.GDate.formatDate(
				lBorneDatesPeriode.dateFin,
				"%JJ/%MM/%AAAA",
			) +
			"</span>";
		return TradInterfaceRecapitulatifExportLSU.PeriodeDefinieDuAu.format([
			lHtmlDateDebut,
			lHtmlDateFin,
		]);
	}
	_getBornesPeriodeSelectionnee() {
		let lDateDebut, lDateFin;
		if (!!this.parametresSco.listePeriodes && !!this.periodeConcernee) {
			const lPeriodeGlobale =
				this.parametresSco.listePeriodes.getElementParNumero(
					this.periodeConcernee.getNumero(),
				);
			if (!!lPeriodeGlobale && !!lPeriodeGlobale.dates) {
				lDateDebut = lPeriodeGlobale.dates.debut;
				lDateFin = lPeriodeGlobale.dates.fin;
			}
		}
		return {
			dateDebut: lDateDebut || ObjetDate_1.GDate.premiereDate,
			dateFin: lDateFin || ObjetDate_1.GDate.derniereDate,
		};
	}
	composeContenu() {
		const lEstPrimaire = true;
		let lClassesFinDeCycle;
		if (lEstPrimaire) {
			lClassesFinDeCycle =
				TradInterfaceRecapitulatifExportLSU.ClassesFinDeCyclePrimaire;
		} else {
			lClassesFinDeCycle =
				TradInterfaceRecapitulatifExportLSU.ClassesFinDeCycleSecondaire;
		}
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"div",
						{
							class: "Espace",
							style: ObjetStyle_1.GStyle.composeCouleurFond(
								GCouleur.themeNeutre.claire,
							),
						},
						TradInterfaceRecapitulatifExportLSU.DescriptifExportLSU,
					),
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut10" },
						IE.jsx.str("div", {
							"ie-html": this.jsxGetStrChoixPeriode.bind(this),
						}),
						IE.jsx.str("div", {
							"ie-html": this.jsxGetStrDatesPeriodeChoisie.bind(this),
						}),
						IE.jsx.str(
							"div",
							{ class: "EspaceHaut10" },
							TradInterfaceRecapitulatifExportLSU.VerificationDatesSurONDE,
						),
					),
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut10" },
						IE.jsx.str(
							"fieldset",
							{
								style: ObjetStyle_1.GStyle.composeCouleurBordure(
									GCouleur.fenetre.bordure,
								),
							},
							IE.jsx.str(
								"legend",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"GenerationPDF.Options",
								),
							),
							IE.jsx.str(
								"ie-checkbox",
								{
									"ie-model":
										this.jsxModeleCheckboxInclureBilanFinDeCycle.bind(this),
									class: "NoWrap",
								},
								TradInterfaceRecapitulatifExportLSU.InclureBilanFinDeCycle.format(
									[lClassesFinDeCycle],
								),
							),
						),
					),
				),
			),
		);
		return T.join("");
	}
	setDonnees(aDonnees) {
		this.estUneClasseFinDeCycle = aDonnees.estUneClasseFinDeCycle;
		this.periodeConcernee = aDonnees.periode;
		this.inclureBilanFinDeCycle = !!this.estUneClasseFinDeCycle;
		this.afficher();
	}
	surValidation(aGenreBouton) {
		this.callback.appel(aGenreBouton, {
			inclureBilanFinDeCycle: this.inclureBilanFinDeCycle,
		});
		this.fermer();
	}
}
