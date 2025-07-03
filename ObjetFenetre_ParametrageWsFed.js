exports.ObjetFenetre_ParametrageWsFed = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const WSGestionWsFed_1 = require("WSGestionWsFed");
const WSGestionWsFed_2 = require("WSGestionWsFed");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_ParametrageWsFed extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"pageParametrageCAS.titreFenetreParametresCAS",
			),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.optionsFenetreParametrageWSFed = {
			largeurLibelle: 120,
			largeurInput: 500,
			heightZone: 20,
			groupesUtilisateur: [],
		};
	}
	setOptionsFenetresParametrageWSFed(aOptions) {
		Object.assign(this.optionsFenetreParametrageWSFed, aOptions);
	}
	jsxModelInputGenre(aGenre) {
		return {
			getValue: () => {
				return this.getInfosParGenre(aGenre).libelle;
			},
			setValue: () => {},
			getDisabled: () => {
				if (
					aGenre !==
						WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW
							.Auwf_IdentifiantUnique &&
					this.parametresWsFed
				) {
					return !this.parametresWsFed.rechercheParIdentite;
				}
				return false;
			},
		};
	}
	jsxGetTitleInputGenre(aGenre) {
		return this.getInfosParGenre(aGenre).uri;
	}
	jsxModelBoutonGenre(aGenre) {
		return {
			event: () => {
				this.ouvrirFenetreRevendications(aGenre);
			},
			getDisabled: () => {
				if (
					aGenre !==
						WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW
							.Auwf_IdentifiantUnique &&
					this.parametresWsFed
				) {
					return !this.parametresWsFed.rechercheParIdentite;
				}
				return false;
			},
		};
	}
	jsxModelCheckboxRechercheParIdentite() {
		return {
			getValue: () => {
				return this.parametresWsFed
					? this.parametresWsFed.rechercheParIdentite
					: false;
			},
			setValue: (aValue) => {
				if (this.parametresWsFed) {
					this.parametresWsFed.rechercheParIdentite = aValue;
				}
			},
		};
	}
	jsxModelInputGroupe(aGenreProfil) {
		return {
			getValue: () => {
				return this.getValueGroupe(aGenreProfil);
			},
			setValue: (aValue) => {
				this.setValueGroupe(aGenreProfil, aValue);
			},
			getDisabled: () => {
				if (
					this.parametresWsFed &&
					this.parametresWsFed.rechercheParIdentite &&
					this.getInfosParGenre(
						WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW.Auwf_Groupe,
					).uri !== ""
				) {
					return false;
				}
				return true;
			},
		};
	}
	composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "Espace" },
				this.composeRevendication(
					WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW
						.Auwf_IdentifiantUnique,
				),
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModelCheckboxRechercheParIdentite.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"wsfed.RechercheParIdentite",
						),
					),
				),
				this.composeRevendication(
					WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW.Auwf_Nom,
				),
				this.composeRevendication(
					WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW.Auwf_Prenom,
				),
				this.composeRevendication(
					WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW.Auwf_DateNaissance,
				),
				this.composeRevendication(
					WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW.Auwf_CodePostal,
				),
				this.composeRevendication(
					WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW.Auwf_Groupe,
				),
				this.composeGroupeUtilisateur(),
			),
		);
		return H.join("");
	}
	setDonnees(aParametresWsFed) {
		this.parametresWsFed =
			MethodesObjet_1.MethodesObjet.dupliquer(aParametresWsFed);
		this.listeRevendications = new ObjetListeElements_1.ObjetListeElements();
		if (
			this.parametresWsFed &&
			this.parametresWsFed.revendicationsDisponibles
		) {
			this.parametresWsFed.revendicationsDisponibles.forEach(
				(aElement, aIndex) => {
					if (aElement) {
						const lElement = new ObjetElement_1.ObjetElement(
							aElement.description,
							aIndex,
						);
						lElement.uri = aElement.uri;
						this.listeRevendications.addElement(lElement);
					}
				},
			);
		}
		this.$refreshSelf();
		this.afficher();
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(
			aNumeroBouton,
			aNumeroBouton === 1 ? this.parametresWsFed : null,
		);
	}
	getValueGroupe(aGenreProfil) {
		let lLibelle = "";
		if (
			this.parametresWsFed &&
			this.parametresWsFed.correspondancesProfilsUtilisateurGroupes
		) {
			this.parametresWsFed.correspondancesProfilsUtilisateurGroupes.every(
				(aElement) => {
					if (aElement && aElement.profilUtilisateur === aGenreProfil) {
						lLibelle = aElement.groupes;
						return false;
					}
					return true;
				},
			);
		}
		return lLibelle;
	}
	setValueGroupe(aGenreProfil, aValue) {
		const lNonTrouve =
			this.parametresWsFed.correspondancesProfilsUtilisateurGroupes.every(
				(aElement) => {
					if (aElement.profilUtilisateur === aGenreProfil) {
						aElement.groupes = aValue;
						return false;
					}
					return true;
				},
			);
		if (lNonTrouve && aValue) {
			this.parametresWsFed.correspondancesProfilsUtilisateurGroupes.push(
				new WSGestionWsFed_1.TCorrespProfilsUtilisateurGroupes(
					aGenreProfil,
					aValue,
				),
			);
		}
	}
	modifierRevendication(aGenre, aRevendication) {
		const lNonTrouve = this.parametresWsFed.correspondancesRevendications.every(
			(aElement) => {
				if (aElement.attribut === aGenre) {
					if (aRevendication.aucun) {
						aElement.namespace = "";
					} else {
						aElement.namespace = aRevendication.uri;
					}
					return false;
				}
				return true;
			},
		);
		if (lNonTrouve && !aRevendication.aucun) {
			this.parametresWsFed.correspondancesRevendications.push(
				new WSGestionWsFed_1.TCorrespondanceAttributNamespce(
					aGenre,
					aRevendication.uri,
				),
			);
		}
	}
	ouvrirFenetreRevendications(aGenre) {
		let lListeReference = this.listeRevendications;
		if (
			aGenre !==
			WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW.Auwf_IdentifiantUnique
		) {
			lListeReference = new ObjetListeElements_1.ObjetListeElements().add(
				this.listeRevendications,
			);
			const lAucun = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("wsfed.NePasLireCetAttribut"),
				-1,
			);
			lAucun.uri = "";
			lAucun.aucun = true;
			lListeReference.insererElement(lAucun, 0);
		}
		const lThis = this;
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				evenement(aNumeroBouton, aIndiceSelection) {
					if (aNumeroBouton === 1) {
						lThis.modifierRevendication(
							aGenre,
							lListeReference.get(aIndiceSelection),
						);
					}
				},
				initialiser(aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur(
								"wsfed.ChoixRevedication_S",
							),
							[lThis.getLibelleRevendicationDeGenre(aGenre)],
						),
						largeur: 500,
						hauteur: 600,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
						modeActivationBtnValider:
							aInstance.modeActivationBtnValider.toujoursActifs,
					});
					aInstance.paramsListe = {
						optionsListe: { colonnes: [{ taille: "100%" }], nonEditable: true },
					};
				},
			},
		);
		const lDonneesListe = new ObjetDonneesListe_1.ObjetDonneesListe(
			lListeReference,
		);
		lDonneesListe.getTooltip = function (aParams) {
			return aParams.article.uri;
		};
		lDonneesListe.setOptions({
			avecTri: false,
			avecEvnt_Selection: true,
			avecEvnt_SelectionDblClick: true,
		});
		let lInfo = this.getInfosParGenre(aGenre);
		let lIndiceSelection = null;
		if (lInfo.trouve) {
			lListeReference.parcourir((D, aIndex) => {
				if (lInfo.uri === D.uri) {
					lIndiceSelection = aIndex;
					return false;
				}
			});
		} else if (
			aGenre !==
			WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW.Auwf_IdentifiantUnique
		) {
			lIndiceSelection = 0;
		}
		lFenetre.setDonnees(lDonneesListe, false, lIndiceSelection);
	}
	getDescriptionDUri(aUri) {
		let lDescription = "";
		if (
			this.parametresWsFed &&
			this.parametresWsFed.revendicationsDisponibles
		) {
			this.parametresWsFed.revendicationsDisponibles.every((aElement) => {
				if (aElement && aElement.uri === aUri) {
					lDescription = aElement.description;
					return false;
				}
				return true;
			});
		}
		return lDescription;
	}
	getInfosParGenre(aGenre) {
		const lResult = {
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"wsfed.NePasLireCetAttribut",
			),
			uri: "",
			trouve: false,
		};
		if (
			this.parametresWsFed &&
			this.parametresWsFed.correspondancesRevendications
		) {
			this.parametresWsFed.correspondancesRevendications.every((aElement) => {
				if (aElement && aElement.attribut === aGenre) {
					if (aElement.namespace) {
						lResult.libelle = this.getDescriptionDUri(aElement.namespace);
						lResult.uri = aElement.namespace;
						lResult.trouve = true;
					}
					return false;
				}
				return true;
			});
		}
		return lResult;
	}
	getLibelleRevendicationDeGenre(aGenre) {
		switch (aGenre) {
			case WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW
				.Auwf_IdentifiantUnique:
				return ObjetTraduction_1.GTraductions.getValeur(
					"wsfed.IdentifiantUnique",
				);
			case WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW.Auwf_Nom:
				return ObjetTraduction_1.GTraductions.getValeur("wsfed.Nom");
			case WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW.Auwf_Prenom:
				return ObjetTraduction_1.GTraductions.getValeur("wsfed.Prenom");
			case WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW
				.Auwf_DateNaissance:
				return ObjetTraduction_1.GTraductions.getValeur(
					"wsfed.DateDeNaissance",
				);
			case WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW.Auwf_CodePostal:
				return ObjetTraduction_1.GTraductions.getValeur("wsfed.CodePostal");
			case WSGestionWsFed_1.ETypeAttributUtilisateurWsFedSvcW.Auwf_Groupe:
				return ObjetTraduction_1.GTraductions.getValeur("wsfed.Groupe");
			default:
				return "";
		}
	}
	getLibelleGroupe(aGenreProfil) {
		switch (aGenreProfil) {
			case WSGestionWsFed_2.ETypeProfilUtilisateurSvcW.Pu_Professeurs:
				return ObjetTraduction_1.GTraductions.getValeur(
					"wsfed.GroupeProfesseurs",
				);
			case WSGestionWsFed_2.ETypeProfilUtilisateurSvcW.Pu_Eleves:
				return ObjetTraduction_1.GTraductions.getValeur("wsfed.GroupeEleves");
			case WSGestionWsFed_2.ETypeProfilUtilisateurSvcW.Pu_Parents:
				return ObjetTraduction_1.GTraductions.getValeur("wsfed.GroupeParents");
			case WSGestionWsFed_2.ETypeProfilUtilisateurSvcW.Pu_MaitresDeStage:
				return ObjetTraduction_1.GTraductions.getValeur(
					"wsfed.GroupeEntreprises",
				);
			case WSGestionWsFed_2.ETypeProfilUtilisateurSvcW.Pu_Inspecteurs:
				return ObjetTraduction_1.GTraductions.getValeur(
					"wsfed.GroupeInspecteurs",
				);
			case WSGestionWsFed_2.ETypeProfilUtilisateurSvcW
				.Pu_PersonnelsAdministratifs:
				return ObjetTraduction_1.GTraductions.getValeur(
					"wsfed.GroupeSecretariats",
				);
			case WSGestionWsFed_2.ETypeProfilUtilisateurSvcW.Pu_PersonnelsTechniques:
				return ObjetTraduction_1.GTraductions.getValeur(
					"wsfed.GroupeAppariteurs",
				);
			default:
				return "";
		}
	}
	composeValeurGoupe(aGenreProfil) {
		const H = [];
		const lEcart = 8;
		H.push(
			IE.jsx.str(
				"div",
				{ class: "NoWrap" },
				IE.jsx.str(
					"div",
					{
						class:
							"InlineBlock AlignementMilieuVertical AlignementDroit PetitEspaceDroit",
						style: ObjetStyle_1.GStyle.composeWidth(
							this.optionsFenetreParametrageWSFed.largeurLibelle - lEcart - 3,
						),
					},
					this.getLibelleGroupe(aGenreProfil),
					" :",
				),
				IE.jsx.str(
					"div",
					{ class: "InlineBlock AlignementMilieuVertical EspaceGauche" },
					IE.jsx.str("input", {
						type: "text",
						"ie-model": this.jsxModelInputGroupe.bind(this, aGenreProfil),
						style:
							ObjetStyle_1.GStyle.composeHeight(
								this.optionsFenetreParametrageWSFed.heightZone,
							) +
							ObjetStyle_1.GStyle.composeWidth(
								this.optionsFenetreParametrageWSFed.largeurInput,
							) +
							ObjetStyle_1.GStyle.composeCouleurBordure(
								(0, AccessApp_1.getApp)().getCouleur().noir,
							),
					}),
				),
			),
		);
		return H.join("");
	}
	composeGroupeUtilisateur() {
		const H = [];
		H.push('<div class="PetitEspaceHaut">');
		H.push(
			'<fieldset style="',
			ObjetStyle_1.GStyle.composeCouleurBordure("black"),
			' padding:5px; margin:2px; width:1px;">',
		);
		H.push(
			IE.jsx.str(
				"legend",
				{ class: "Legende" },
				ObjetChaine_1.GChaine.format(
					ObjetTraduction_1.GTraductions.getValeur("wsfed.Groupes_S"),
					[ObjetTraduction_1.GTraductions.getValeur("wsfed.Groupe")],
				),
			),
		);
		this.optionsFenetreParametrageWSFed.groupesUtilisateur.forEach((aGenre) => {
			H.push(this.composeValeurGoupe(aGenre));
		});
		H.push("</fieldset>");
		H.push("</div>");
		return H.join("");
	}
	composeRevendication(aGenre) {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "NoWrap" },
				IE.jsx.str(
					"div",
					{
						class: "InlineBlock AlignementMilieuVertical",
						style: ObjetStyle_1.GStyle.composeWidth(
							this.optionsFenetreParametrageWSFed.largeurLibelle,
						),
					},
					this.getLibelleRevendicationDeGenre(aGenre),
				),
				IE.jsx.str(
					"div",
					{ class: "InlineBlock AlignementMilieuVertical EspaceGauche" },
					IE.jsx.str("input", {
						type: "text",
						"ie-model": this.jsxModelInputGenre.bind(this, aGenre),
						readonly: true,
						"ie-title": this.jsxGetTitleInputGenre.bind(this, aGenre),
						style:
							ObjetStyle_1.GStyle.composeHeight(
								this.optionsFenetreParametrageWSFed.heightZone,
							) +
							ObjetStyle_1.GStyle.composeWidth(
								this.optionsFenetreParametrageWSFed.largeurInput,
							) +
							ObjetStyle_1.GStyle.composeCouleurBordure(
								(0, AccessApp_1.getApp)().getCouleur().noir,
							),
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "InlineBlock AlignementMilieuVertical EspaceGauche" },
					IE.jsx.str(
						"ie-bouton",
						{ "ie-model": this.jsxModelBoutonGenre.bind(this, aGenre) },
						"...",
					),
				),
			),
		);
		return H.join("");
	}
}
exports.ObjetFenetre_ParametrageWsFed = ObjetFenetre_ParametrageWsFed;
