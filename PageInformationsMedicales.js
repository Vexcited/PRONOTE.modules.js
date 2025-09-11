exports.PageInformationsMedicales = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_InfoMedicale_1 = require("ObjetFenetre_InfoMedicale");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetRequeteSaisieCompteEnfant_1 = require("ObjetRequeteSaisieCompteEnfant");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
const ObjetStyle_1 = require("ObjetStyle");
class PageInformationsMedicales extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.donnees = {
			infosMedicales: null,
			listeRestrictionsAlimentaires: null,
			listeRestrictionsAlimentairesSauvegarde: null,
			allergies: null,
			allergiesSauvegarde: null,
		};
		this.mangeALaCantine = false;
		this.donneesRecues = false;
		this.idCommentaire = "ZoneEditCommentaire";
		this.IdPremierElement = this.idCommentaire;
	}
	valider() {
		const lInformationsMedicales = this.getDossierMedicalModifie();
		const lInformationsAllergies = this.getAllergiesModifie();
		this.setEtatSaisie(false);
		new ObjetRequeteSaisieCompteEnfant_1.ObjetRequeteSaisieCompteEnfant(
			this,
		).lancerRequete({
			informationsMedicales: lInformationsMedicales,
			allergies: lInformationsAllergies,
			restrictionsAlimentaires: this.donnees.listeRestrictionsAlimentaires,
		});
	}
	setDonnees(aParam) {
		this.donnees.infosMedicales = aParam.infosMedicales;
		this.donnees.listeRestrictionsAlimentaires =
			MethodesObjet_1.MethodesObjet.dupliquer(aParam.restrictionsAlimentaires);
		this.donnees.listeRestrictionsAlimentairesSauvegarde =
			aParam.restrictionsAlimentaires;
		this.mangeALaCantine = aParam.mangeALaCantine;
		this.donnees.allergies = MethodesObjet_1.MethodesObjet.dupliquer(
			aParam.allergies,
		);
		this.donnees.allergiesSauvegarde = aParam.allergies;
		this.allergiesModifiables = aParam.allergiesModifiables;
		this.regimesAlimentairesModifiables = aParam.regimesAlimentairesModifiables;
		this.donneesRecues = true;
		this.afficher(this.construireAffichage());
	}
	getListeAllergies() {
		return !!this.donnees.allergies && !!this.donnees.allergies.listeAllergenes
			? this.donnees.allergies.listeAllergenes
			: null;
	}
	construireAffichage() {
		if (this.donneesRecues) {
			return this.composePage();
		}
		return "";
	}
	jsxIfAffichageZoneAllergies() {
		return this.donnees && !!this.donnees.allergies;
	}
	jsxIfAffichageZoneRestrictionsAlimentaires() {
		return (
			!!this.mangeALaCantine &&
			!!this.donnees.listeRestrictionsAlimentairesSauvegarde
		);
	}
	composePage() {
		const H = [];
		const lEstPrimaire = this.applicationSco.estPrimaire;
		const lDoitEtreAffiche = !!this.donnees.infosMedicales;
		const lAvecAllergies = this.allergiesModifiables;
		const lAvecRegimes = this.regimesAlimentairesModifiables;
		if (lDoitEtreAffiche) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: ["item-conteneur"] },
					IE.jsx.str(
						"h2",
						{ id: "asLabelIdCommentaire" },
						ObjetTraduction_1.GTraductions.getValeur("InfosMedicales.Titre"),
					),
					IE.jsx.str(
						"div",
						{ class: ["valeur-contain", "sansMarges"] },
						this.composeMedecin(),
						lEstPrimaire ? "" : this._composeAutresAllergies(),
						" ",
					),
				),
			);
			if (lEstPrimaire) {
				if (this.donnees.allergies) {
					H.push(
						IE.jsx.str(
							"h3",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.AllergiesAutres",
							),
						),
					);
				}
				H.push(
					IE.jsx.str(
						"div",
						{ class: "item-conteneur" },
						IE.jsx.str(
							"div",
							{ class: ["valeur-contain", "sansMarges"] },
							this._composeAutresAllergies(),
						),
					),
				);
			}
		}
		H.push(
			IE.jsx.str(
				"div",
				{
					class: ["item-conteneur", lEstPrimaire ? "sansMarges" : ""],
					"ie-if": this.jsxIfAffichageZoneAllergies.bind(this),
				},
				IE.jsx.str(
					"h2",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"InfosMedicales.AllergiesRepertoriees",
					),
				),
				IE.jsx.str(
					"div",
					{ class: "valeur-contain" },
					this._composeAllergies(lAvecAllergies),
				),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{
					class: "item-conteneur",
					"ie-if": this.jsxIfAffichageZoneRestrictionsAlimentaires.bind(this),
				},
				IE.jsx.str(
					"h2",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"PageCompte.PratiquesAlimentaires",
					),
				),
				IE.jsx.str(
					"div",
					{ class: "valeur-contain" },
					this._composeRestrictionsAlimentaires(lAvecRegimes),
				),
			),
		);
		return H.join("");
	}
	ouvrirFenetreChoixAllergie() {
		const lFenetreChoixAllergie =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_InfoMedicale_1.ObjetFenetre_InfoMedicale,
				{
					pere: this,
					evenement: (aBouton) => {
						if (aBouton === 1) {
							this.donnees.allergies.listeAllergenes =
								this.copieTravailListeAllergies;
							let lAuMoinsUneAllergie = false;
							this.donnees.allergies.listeAllergenes.parcourir((aAllergene) => {
								if (aAllergene.getActif() === true) {
									lAuMoinsUneAllergie = true;
								}
							});
							if (lAuMoinsUneAllergie) {
								this.donnees.allergies.autoriseConsultationAllergies = true;
							}
							this.callback.appel();
						}
					},
					initialiser: (aInstance) => {
						aInstance.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.SaisieAllergiesRepertoriees",
							),
							largeur: 450,
							hauteur: 600,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Annuler"),
								ObjetTraduction_1.GTraductions.getValeur("Valider"),
							],
						});
					},
				},
			);
		this.copieTravailListeAllergies = MethodesObjet_1.MethodesObjet.dupliquer(
			this.getListeAllergies(),
		);
		lFenetreChoixAllergie.setListeAllergenes(this.copieTravailListeAllergies);
	}
	ouvrirFenetreChoixRestrictionAlimentaire() {
		const lFenetreChoixRestrictionAlimentaire =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_InfoMedicale_1.ObjetFenetre_InfoMedicale,
				{
					pere: this,
					evenement: (aBouton) => {
						if (aBouton === 1) {
							this.donnees.listeRestrictionsAlimentaires =
								this.copieTravailListeRestrictions;
							this.callback.appel();
						}
					},
					initialiser: (aInstance) => {
						aInstance.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.SaisieRestrictions",
							),
							largeur: 300,
							hauteur: 300,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Annuler"),
								ObjetTraduction_1.GTraductions.getValeur("Valider"),
							],
						});
					},
				},
			);
		this.copieTravailListeRestrictions =
			MethodesObjet_1.MethodesObjet.dupliquer(
				this.donnees.listeRestrictionsAlimentaires,
			);
		lFenetreChoixRestrictionAlimentaire.setListeRestrictionsAlimentaires(
			this.copieTravailListeRestrictions,
		);
	}
	getDossierMedicalModifie() {
		return this.donnees.infosMedicales;
	}
	getAllergiesModifie() {
		return this.donnees.allergies;
	}
	getAlimentationModifie() {
		return this.donnees.listeRestrictionsAlimentaires;
	}
	jsxModeleBoutonAjouterAllergie() {
		return {
			event: () => {
				this.ouvrirFenetreChoixAllergie();
			},
		};
	}
	jsxModeleChipsAllergene(aAllergene) {
		return {
			eventBtn: () => {
				if (aAllergene) {
					aAllergene.setActif(false);
					aAllergene.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					let lAuMoinsUnAllergeneActif = false;
					const lListeAllergies = this.getListeAllergies();
					lListeAllergies.parcourir((aTempAllergene) => {
						if (aTempAllergene.getActif() === true) {
							lAuMoinsUnAllergeneActif = true;
						}
					});
					if (lAuMoinsUnAllergeneActif) {
						this.donnees.allergies.autoriseConsultationAllergies = true;
					}
					this.callback.appel();
				}
			},
		};
	}
	jsxGetHtmlListeAllergies() {
		let lListeAllergiesActives = null;
		const lListeAllergies = this.getListeAllergies();
		if (lListeAllergies) {
			lListeAllergiesActives = lListeAllergies.getListeElements((D) => {
				return (
					(D.getActif() === true &&
						D.getEtat() !== Enumere_Etat_1.EGenreEtat.Modification) ||
					(D.getEtat() === Enumere_Etat_1.EGenreEtat.Modification &&
						D.getActif() === false)
				);
			});
		}
		const H = [];
		const lAvecCroix = this.allergiesModifiables;
		if (lListeAllergiesActives) {
			lListeAllergiesActives.parcourir((aAllergie) => {
				H.push(
					IE.jsx.str(
						"ie-chips",
						{
							"ie-model": lAvecCroix
								? this.jsxModeleChipsAllergene.bind(this, aAllergie)
								: false,
							class: "m-all",
						},
						aAllergie.getLibelle(),
					),
				);
			});
		}
		return H.join("");
	}
	jsxModeleAutoriserConsultationAllergies() {
		return {
			getValue: () => {
				return this.donnees.allergies
					? this.donnees.allergies.autoriseConsultationAllergies
					: false;
			},
			setValue: (aValue) => {
				if (this.donnees.allergies) {
					this.donnees.allergies.autoriseConsultationAllergies = aValue;
					this.valider();
				}
			},
		};
	}
	_composeAllergies(aAvecSaisie) {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"p",
					{ class: "a-savoir-conteneur" },
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.infosImperieusesTitre",
					),
				),
				IE.jsx.str(
					"p",
					{ class: "a-savoir-conteneur" },
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.infosImperieusesAllergiesComplement",
					),
				),
			),
		);
		if (aAvecSaisie) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "text-right" },
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": this.jsxModeleBoutonAjouterAllergie.bind(this),
							class: "themeBoutonNeutre",
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.AjouterAllergie",
							),
							"aria-haspopup": "dialog",
						},
						ObjetTraduction_1.GTraductions.getValeur("Ajouter"),
					),
				),
			);
		}
		H.push(
			IE.jsx.str("div", {
				class: "liste-chips",
				"ie-html": this.jsxGetHtmlListeAllergies.bind(this),
			}),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "champ-conteneur" },
				IE.jsx.str(
					"ie-switch",
					{
						class: "long-text",
						"ie-model": this.jsxModeleAutoriserConsultationAllergies.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.infosAllergiesConsultables",
					),
				),
			),
		);
		return H.join("");
	}
	jsxModeleChipsRestrictionAlimentaire(aRestrictionAlim) {
		return {
			eventBtn: () => {
				if (aRestrictionAlim && this.donnees.listeRestrictionsAlimentaires) {
					aRestrictionAlim.setActif(false);
					aRestrictionAlim.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.callback.appel();
				}
			},
		};
	}
	jsxGetHtmlListeRestrictionsAlimentaires() {
		let lListeRestrictionsActives = null;
		if (this.donnees.listeRestrictionsAlimentaires) {
			lListeRestrictionsActives =
				this.donnees.listeRestrictionsAlimentaires.getListeElements((D) => {
					return D.getActif();
				});
		}
		const H = [];
		const lAvecCroix = this.regimesAlimentairesModifiables;
		if (lListeRestrictionsActives) {
			lListeRestrictionsActives.parcourir((aRestrictionAlim) => {
				H.push(
					IE.jsx.str(
						"ie-chips",
						{
							"ie-model": lAvecCroix
								? this.jsxModeleChipsRestrictionAlimentaire.bind(
										this,
										aRestrictionAlim,
									)
								: false,
							class: "m-all",
						},
						aRestrictionAlim.getLibelle(),
					),
				);
			});
		}
		return H.join("");
	}
	jsxModeleBoutonAjouterRestrictionAlimentaire() {
		return {
			event: () => {
				this.ouvrirFenetreChoixRestrictionAlimentaire();
			},
		};
	}
	_composeRestrictionsAlimentaires(aAvecSaisie) {
		const H = [];
		if (aAvecSaisie) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "text-right" },
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model":
								this.jsxModeleBoutonAjouterRestrictionAlimentaire.bind(this),
							class: "themeBoutonNeutre",
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.AjouterRestriction",
							),
							"aria-haspopup": "dialog",
						},
						ObjetTraduction_1.GTraductions.getValeur("Ajouter"),
					),
				),
			);
		}
		H.push(
			IE.jsx.str("div", {
				class: "liste-chips",
				"ie-html": this.jsxGetHtmlListeRestrictionsAlimentaires.bind(this),
			}),
		);
		return H.join("");
	}
	jsxTextareaCommentaire() {
		return {
			getValue: () => {
				return this.donnees.infosMedicales &&
					this.donnees.infosMedicales.avecCommentaireAutorise
					? this.donnees.infosMedicales.commentaire
					: "";
			},
			setValue: (aValue) => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.avecCommentaireAutorise
				) {
					this.donnees.infosMedicales.commentaire = aValue;
				}
			},
		};
	}
	jsxModeleAutoriserConsultationAutresAllergies() {
		return {
			getValue: () => {
				return this.donnees.infosMedicales
					? this.donnees.infosMedicales.estConsultable
					: false;
			},
			setValue: (aValue) => {
				if (this.donnees.infosMedicales) {
					this.donnees.infosMedicales.estConsultable = aValue;
					this.valider();
				}
			},
		};
	}
	_composeAutresAllergies() {
		const H = [];
		const lNbLignesCommentaire = 5;
		const lHauteurInfoRestrictions = 140;
		const lLignes =
			lNbLignesCommentaire +
			(this.mangeALaCantine
				? 0
				: Math.floor(lHauteurInfoRestrictions / (2 * 12)));
		if (this.donnees.infosMedicales.avecCommentaireAutorise) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str("ie-textareamax", {
						maxlength: "1000",
						"aria-labelledby": "asLabelIdCommentaire",
						id: this.idCommentaire,
						name: this.idCommentaire,
						"ie-model": this.jsxTextareaCommentaire.bind(this),
						rows: "" + lLignes,
						style:
							"width:100%;" +
							"height:" +
							(this.mangeALaCantine ? 50 : 120) +
							"px;",
					}),
				),
			);
		} else {
			H.push(
				IE.jsx.str(
					"p",
					{ class: "a-savoir-conteneur" },
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.msgCommentaireMedical",
					),
				),
			);
		}
		H.push(
			IE.jsx.str(
				"p",
				{ class: "a-savoir-conteneur" },
				ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.infosMedicalesTitre",
				),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "champ-conteneur" },
				IE.jsx.str(
					"ie-switch",
					{
						class: "long-text",
						"ie-model":
							this.jsxModeleAutoriserConsultationAutresAllergies.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.infosMedicalesConsultables",
					),
				),
			),
		);
		return H.join("");
	}
	jsxModeleNomMedecin() {
		return {
			getValue: () => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					return this.donnees.infosMedicales.medecin.nomMedecin || "";
				}
				return "";
			},
			setValue: (aValue) => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					this.donnees.infosMedicales.medecin.nomMedecin = aValue;
					this.setEtatSaisie(true);
				}
			},
		};
	}
	jsxModeleAdresseMedecin(aIndice) {
		return {
			getValue: () => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					return this.donnees.infosMedicales.medecin[`adresse${aIndice}`];
				}
				return "";
			},
			setValue: (aValue) => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					this.donnees.infosMedicales.medecin[`adresse${aIndice}`] = aValue;
					this.setEtatSaisie(true);
				}
			},
		};
	}
	jsxModeleCPMedecin() {
		return {
			getValue: () => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					return this.donnees.infosMedicales.medecin.codePostal || "";
				}
				return "";
			},
			setValue: (aValue) => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					this.donnees.infosMedicales.medecin.codePostal = aValue;
					this.setEtatSaisie(true);
				}
			},
		};
	}
	jsxModeleVilleMedecin() {
		return {
			getValue: () => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					return this.donnees.infosMedicales.medecin.libellePostal || "";
				}
				return "";
			},
			setValue: (aValue) => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					this.donnees.infosMedicales.medecin.libellePostal = aValue;
					this.setEtatSaisie(true);
				}
			},
		};
	}
	jsxModeleIndicatifFixeMedecin() {
		return {
			getValue: () => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					return this.donnees.infosMedicales.medecin.indFixe || "";
				}
				return "";
			},
			setValue: (aValue) => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					this.donnees.infosMedicales.medecin.indFixe = aValue;
					this.setEtatSaisie(true);
				}
			},
		};
	}
	jsxModeleNumeroFixeMedecin() {
		return {
			getValue: () => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					return this.donnees.infosMedicales.medecin.telFixe || "";
				}
				return "";
			},
			setValue: (aValue) => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					this.donnees.infosMedicales.medecin.telFixe = aValue;
					this.setEtatSaisie(true);
				}
			},
		};
	}
	jsxModeleIndicatifPortableMedecin() {
		return {
			getValue: () => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					return this.donnees.infosMedicales.medecin.indMobile || "";
				}
				return "";
			},
			setValue: (aValue) => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					this.donnees.infosMedicales.medecin.indMobile = aValue;
					this.setEtatSaisie(true);
				}
			},
		};
	}
	jsxModeleNumeroPortableMedecin() {
		return {
			getValue: () => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					return this.donnees.infosMedicales.medecin.telMobile || "";
				}
				return "";
			},
			setValue: (aValue) => {
				if (
					this.donnees.infosMedicales &&
					this.donnees.infosMedicales.medecin
				) {
					this.donnees.infosMedicales.medecin.telMobile = aValue;
					this.setEtatSaisie(true);
				}
			},
		};
	}
	jsxModeleAutoriserHospitalisation() {
		return {
			getValue: () => {
				return this.donnees.infosMedicales
					? this.donnees.infosMedicales.autoriseHospitalisation
					: false;
			},
			setValue: (aValue) => {
				if (this.donnees.infosMedicales) {
					this.donnees.infosMedicales.autoriseHospitalisation = aValue;
					this.valider();
				}
			},
		};
	}
	composeMedecin() {
		const lLargeurIndicatif = 36;
		const lLargeurTel = 110;
		const lStyle = { width: 380 };
		const lEstPrimaire = this.applicationSco.estPrimaire;
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"h3",
				null,
				ObjetTraduction_1.GTraductions.getValeur(
					"InfosMedicales.MedecinTraitant",
				),
			),
			IE.jsx.str(
				"div",
				{ class: "champ-conteneur" },
				IE.jsx.str(
					"label",
					{ for: "idNom", class: "icon_user" },
					ObjetTraduction_1.GTraductions.getValeur("InfosMedicales.NomMedecin"),
					" ",
				),
				IE.jsx.str(
					"div",
					{ class: "champ-valeur" },
					IE.jsx.str("input", {
						type: "text",
						id: "idNom",
						name: "idNom",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"InfosMedicales.TitreNom",
						),
						placeholder: ObjetTraduction_1.GTraductions.getValeur(
							"InfosMedicales.TitreNom",
						),
						"ie-model": this.jsxModeleNomMedecin.bind(this),
						style: lStyle,
						maxlength: "50",
					}),
				),
			),
			IE.jsx.str(
				"div",
				{ class: "groupe-champs-conteneur" },
				IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"label",
						{ class: "icon_envelope" },
						ObjetTraduction_1.GTraductions.getValeur("InfosMedicales.adresse1"),
					),
					IE.jsx.str(
						"div",
						{ class: "champ-valeur" },
						IE.jsx.str("input", {
							type: "text",
							id: "idAdresse1",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.adresse1",
							),
							style: lStyle,
							maxlength: "50",
							"ie-model": this.jsxModeleAdresseMedecin.bind(this, 1),
						}),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"label",
						{ class: "icon_envelope" },
						ObjetTraduction_1.GTraductions.getValeur("InfosMedicales.adresse2"),
					),
					IE.jsx.str(
						"div",
						{ class: "champ-valeur" },
						IE.jsx.str("input", {
							type: "text",
							id: "idAdresse2",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.adresse2",
							),
							style: lStyle,
							maxlength: "50",
							"ie-model": this.jsxModeleAdresseMedecin.bind(this, 2),
						}),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"label",
						{ class: "icon_envelope" },
						ObjetTraduction_1.GTraductions.getValeur("InfosMedicales.adresse3"),
					),
					IE.jsx.str(
						"div",
						{ class: "champ-valeur" },
						IE.jsx.str("input", {
							type: "text",
							id: "idAdresse3",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.adresse3",
							),
							style: lStyle,
							maxlength: "50",
							"ie-model": this.jsxModeleAdresseMedecin.bind(this, 3),
						}),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"label",
						{ class: "icon_envelope" },
						ObjetTraduction_1.GTraductions.getValeur("InfosMedicales.adresse4"),
					),
					IE.jsx.str(
						"div",
						{ class: "champ-valeur" },
						IE.jsx.str("input", {
							type: "text",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.adresse4",
							),
							style: lStyle,
							maxlength: "50",
							"ie-model": this.jsxModeleAdresseMedecin.bind(this, 4),
						}),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"div",
						{ "aria-hidden": "true", class: "champ-libelle icon_envelope" },
						ObjetTraduction_1.GTraductions.getValeur("InfosMedicales.cpVille"),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"div",
							{ class: "champ-valeur" },
							IE.jsx.str(
								"label",
								{ for: "idCpMedecin", class: "sr-only" },
								ObjetTraduction_1.GTraductions.getValeur(
									"InfosMedicales.CodePostal",
								),
							),
							IE.jsx.str("input", {
								type: "text",
								id: "idCpMedecin",
								maxlength: "8",
								title: ObjetTraduction_1.GTraductions.getValeur(
									"InfosMedicales.CodePostal",
								),
								"ie-model": this.jsxModeleCPMedecin.bind(this),
								style: "width: 6.5rem;margin-right:.4rem;",
							}),
							IE.jsx.str(
								"label",
								{ for: "idVilleMedecin", class: "sr-only" },
								ObjetTraduction_1.GTraductions.getValeur(
									"InfosMedicales.Ville",
								),
							),
							IE.jsx.str("input", {
								id: "idVilleMedecin",
								type: "text",
								title: ObjetTraduction_1.GTraductions.getValeur(
									"InfosMedicales.Ville",
								),
								"ie-model": this.jsxModeleVilleMedecin.bind(this),
								style: ObjetStyle_1.GStyle.composeWidth(lLargeurTel),
							}),
						),
					),
				),
			),
			IE.jsx.str(
				"div",
				{ class: "groupe-champs-conteneur" },
				IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"div",
						{ class: "champ-libelle icon_home" },
						ObjetTraduction_1.GTraductions.getValeur(
							"InfosMedicales.Telephone",
						),
					),
					IE.jsx.str(
						"div",
						{ class: "champ-valeur" },
						IE.jsx.str(
							"label",
							{ for: "idIndFixeMedecin", class: "sr-only" },
							ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.IndicatifTelephone",
							),
						),
						IE.jsx.str("input", {
							id: "idIndFixeMedecin",
							"ie-model": this.jsxModeleIndicatifFixeMedecin.bind(this),
							class: "m-right ",
							"ie-indicatiftel": true,
							style: ObjetStyle_1.GStyle.composeWidth(lLargeurIndicatif) + ";",
							type: "text",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.IndicatifTelephone",
							),
						}),
						IE.jsx.str(
							"label",
							{ for: "idTelFixeMedecin", class: "sr-only" },
							ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.Telephone",
							),
						),
						IE.jsx.str("input", {
							id: "idTelFixeMedecin",
							"ie-model": this.jsxModeleNumeroFixeMedecin.bind(this),
							"ie-telephone": true,
							type: "text",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.TitreTelephone",
							),
						}),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"div",
						{
							class: "champ-libelle icon_mobile_phone",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.MobileTelephone",
							),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.libelleTelPort",
						),
					),
					IE.jsx.str(
						"div",
						{ class: "champ-valeur" },
						IE.jsx.str(
							"label",
							{ for: "idIndPortMedecin", class: "sr-only" },
							ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.IndicatifTelephone",
							),
						),
						IE.jsx.str("input", {
							id: "idIndPortMedecin",
							"ie-model": this.jsxModeleIndicatifPortableMedecin.bind(this),
							class: "m-right",
							"ie-indicatiftel": true,
							style: ObjetStyle_1.GStyle.composeWidth(lLargeurIndicatif) + ";",
							type: "text",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.IndicatifTelephone",
							),
						}),
						IE.jsx.str(
							"label",
							{ for: "idTelPortMedecin", class: "sr-only" },
							ObjetTraduction_1.GTraductions.getValeur("infosperso.SMS"),
						),
						IE.jsx.str("input", {
							id: "idTelPortMedecin",
							"ie-model": this.jsxModeleNumeroPortableMedecin.bind(this),
							"ie-telephone": true,
							type: "text",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.MobileTelephone",
							),
						}),
					),
				),
			),
			!lEstPrimaire
				? IE.jsx.str(
						"h3",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"InfosMedicales.AutresInformations",
						),
					)
				: "",
			IE.jsx.str(
				"div",
				{ class: "groupe-champs-conteneur" },
				IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"ie-switch",
						{
							class: "long-text",
							"ie-model": this.jsxModeleAutoriserHospitalisation.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.autoriserHospitalisation",
						),
					),
				),
			),
		);
	}
}
exports.PageInformationsMedicales = PageInformationsMedicales;
