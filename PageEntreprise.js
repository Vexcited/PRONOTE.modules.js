exports.PageEntreprise = void 0;
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
class PageEntreprise extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.hauteurs = { libelle: 20 };
		this.largeurs = { libelle: 160, combo: 70, field: 375 };
		this.classFloatPere = GUID_1.GUID.getClassCss();
		this.classFloatInfo = GUID_1.GUID.getClassCss();
		this.comboCivilite = new ObjetSaisie_1.ObjetSaisie({
			pere: this,
			evenement: this.evenementSurComboCivilite,
		});
		this.comboContact = new ObjetSaisie_1.ObjetSaisie({
			pere: this,
			evenement: this.evenementSurComboContact,
		});
	}
	initialiserObjetsGraphique() {
		this.comboCivilite.setOptionsObjetSaisie({
			longueur: this.largeurs.combo,
			hauteur: this.hauteurs.libelle - 2,
			controlerNbrElements: null,
			classTexte: "",
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"entreprise.infoCivilite",
			),
			getContenuElement(aParamsLigne) {
				return aParamsLigne.element.getNumero() === 0
					? ObjetTraduction_1.GTraductions.getValeur("Aucune")
					: aParamsLigne.element.getLibelle();
			},
		});
		this.comboCivilite.setOptionsObjetSaisie({
			largeurTexteEdit: this.largeurs.libelle,
		});
		this.comboCivilite.initialiser();
		const lIndice = this.contact
			? this.entrepriseSaisie.civilites.getIndiceParElement(
					this.contact.civilite,
				)
			: 0;
		this.comboCivilite.setDonnees(
			this.entrepriseSaisie.civilites,
			lIndice ? lIndice : 0,
		);
		this.comboContact.setOptionsObjetSaisie({
			longueur: 200,
			hauteur: this.hauteurs.libelle - 2,
			controlerNbrElements: null,
			classTexte: "",
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"entreprise.infoContact",
			),
		});
		this.comboContact.setOptionsObjetSaisie({
			largeurTexteEdit: this.largeurs.libelle,
		});
		this.comboContact.initialiser();
		this.comboContact.setDonnees(
			this.entrepriseSaisie.contacts,
			this.indexContactCourant ? this.indexContactCourant : 0,
		);
	}
	setDonnees(aEntreprise, aAutorisations, aContactSelectionne) {
		this.entreprise = aEntreprise;
		this.autorisations = aAutorisations;
		this.entrepriseSaisie =
			MethodesObjet_1.MethodesObjet.dupliquer(aEntreprise);
		this.indexContactCourant = aContactSelectionne ? aContactSelectionne : 0;
		this.DonneesRecues = true;
		this.actualiserAffichage();
	}
	actualiserAffichage(aSurResize) {
		if (!this.DonneesRecues) {
			return;
		}
		if (aSurResize) {
			$("#" + this.Nom.escapeJQ() + " ." + this.classFloatPere).css({
				width: 375 + "px",
			});
			$("#" + this.Nom.escapeJQ() + " ." + this.classFloatInfo).css({
				width: 375 - this.largeurs.libelle - 7 + "px",
			});
		}
		const lWidth =
			Math.floor(($("#" + this.Nom.escapeJQ()).width() - 10) / 2) - 27;
		this.largeurs.field = Math.max(lWidth, 375);
		if (!aSurResize) {
			ObjetHtml_1.GHtml.setHtml(this.Nom, this.construireAffichage(), {
				controleur: this.controleur,
			});
			this.initialiserObjetsGraphique();
		} else {
			$("#" + this.Nom.escapeJQ() + " ." + this.classFloatPere).css({
				width: this.largeurs.field + "px",
			});
			$("#" + this.Nom.escapeJQ() + " ." + this.classFloatInfo).css({
				width: this.largeurs.field - this.largeurs.libelle - 7 + "px",
			});
		}
		if (
			!this.entrepriseSaisie.contacts ||
			this.entrepriseSaisie.contacts.count() < 2
		) {
			$(`#${this.comboContact.getNom().escapeJQ()}`).hide();
		}
	}
	construireAffichage() {
		if (!this.DonneesRecues) {
			return "";
		}
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"fieldset",
				{ class: "m-bottom-l" },
				IE.jsx.str(
					"legend",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.titreEntreprise",
					),
				),
				this.composeEntreprise(),
			),
			IE.jsx.str(
				"fieldset",
				{
					"ie-if": () =>
						this.entrepriseSaisie.contacts &&
						this.entrepriseSaisie.contacts.count() > 0,
				},
				IE.jsx.str(
					"legend",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.titreResponsable",
					),
				),
				this.composeResponsable(),
			),
		);
	}
	composeEntreprise() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"div",
					null,
					this.entrepriseSaisie.raisonSociale &&
						IE.jsx.str(
							"p",
							{ class: "semi-bold" },
							this.entrepriseSaisie.raisonSociale,
						),
					this.entrepriseSaisie.nomCommercial &&
						IE.jsx.str(
							"p",
							{ class: "semi-bold" },
							this.entrepriseSaisie.nomCommercial,
						),
					this.entrepriseSaisie.secteurActivite &&
						IE.jsx.str(
							"p",
							{ class: "semi-bold" },
							this.entrepriseSaisie.secteurActivite,
						),
				),
				this.composeAdresse(),
			),
			IE.jsx.str(
				"div",
				null,
				this.composeTelephoneFixe(),
				this.composeTelephonePort(),
				this.composeFax(),
			),
			IE.jsx.str(
				"div",
				null,
				this.composeSIRET(),
				this.composeURSSAF(),
				this.composeSiteWeb(),
			),
		);
	}
	composeAdresse() {
		return IE.jsx.str(
			"div",
			{ class: "champ-conteneur" },
			IE.jsx.str(
				"dt",
				{ class: "champ-libelle icon_envelope" },
				ObjetTraduction_1.GTraductions.getValeur("infosperso.libelleAdresse"),
			),
			this.entrepriseSaisie.adresse1 &&
				IE.jsx.str("dd", null, this.entrepriseSaisie.adresse1),
			this.entrepriseSaisie.adresse2 &&
				IE.jsx.str("dd", null, this.entrepriseSaisie.adresse2),
			this.entrepriseSaisie.adresse3 &&
				IE.jsx.str("dd", null, this.entrepriseSaisie.adresse3),
			this.entrepriseSaisie.adresse4 &&
				IE.jsx.str("dd", null, this.entrepriseSaisie.adresse4),
			(this.entrepriseSaisie.codePostal || this.entrepriseSaisie.ville) &&
				IE.jsx.str(
					"dd",
					null,
					this.entrepriseSaisie.codePostal,
					" ",
					this.entrepriseSaisie.ville,
				),
			this.entrepriseSaisie.province &&
				IE.jsx.str("dd", null, this.entrepriseSaisie.province),
		);
	}
	composeResponsable() {
		this.contact = this.entrepriseSaisie.contacts.get(this.indexContactCourant);
		const lHtml = [];
		lHtml.push(
			IE.jsx.str("div", { id: this.comboContact.getNom(), class: "m-bottom" }),
			this.composeNomResponsable(),
			this.composePrenomResponsable(),
			this.composeFonction(),
			this.composeEstResponsableMaitreDeStage(),
			this.composeTelFixeResp(),
			this.composeTelPortResp(),
			this.composeFaxResp(),
			this.composeEmailResp(),
		);
		return lHtml.join("");
	}
	composeNomResponsable() {
		const lId = GUID_1.GUID.getId();
		const lInputNomResponsable = () => {
			return {
				getValue: () => {
					return this.contact.nom || "";
				},
				setValue: (aValue) => {
					this.setEtatSaisie(true);
					this.contact.nom = aValue;
				},
			};
		};
		return this.autorisations.avecSaisie
			? IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"label",
						{ class: "champ-libelle", for: lId },
						ObjetTraduction_1.GTraductions.getValeur("entreprise.nom"),
					),
					IE.jsx.str(
						"div",
						{ class: "champ-valeur" },
						IE.jsx.str("div", {
							class: "m-right",
							id: this.comboCivilite.getNom(),
						}),
						IE.jsx.str("input", {
							id: lId,
							type: "text",
							title:
								ObjetTraduction_1.GTraductions.getValeur("entreprise.infoNom"),
							"ie-model": lInputNomResponsable,
						}),
					),
				)
			: this.contact.nom
				? IE.jsx.str(
						"div",
						{ class: "champ-conteneur" },
						IE.jsx.str(
							"dt",
							null,
							ObjetTraduction_1.GTraductions.getValeur("entreprise.nom"),
						),
						IE.jsx.str("dd", null, this.contact.nom),
					)
				: "";
	}
	composePrenomResponsable() {
		const lId = GUID_1.GUID.getId();
		const lInputPrenomResponsable = () => {
			return {
				getValue: () => {
					return this.contact.prenoms || "";
				},
				setValue: (aValue) => {
					this.setEtatSaisie(true);
					this.contact.prenoms = aValue;
				},
			};
		};
		return this.autorisations.avecSaisie
			? IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"label",
						{ class: "champ-libelle", for: lId },
						ObjetTraduction_1.GTraductions.getValeur("entreprise.prenom"),
					),
					IE.jsx.str("input", {
						class: "champ-valeur",
						id: lId,
						type: "text",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"entreprise.infoPrenom",
						),
						"ie-model": lInputPrenomResponsable,
					}),
				)
			: this.contact.prenoms
				? IE.jsx.str(
						"div",
						{ class: "champ-conteneur" },
						IE.jsx.str(
							"dt",
							null,
							ObjetTraduction_1.GTraductions.getValeur("entreprise.prenom"),
						),
						IE.jsx.str("dd", null, this.contact.prenoms),
					)
				: "";
	}
	composeFonction() {
		return this.contact &&
			this.contact.fonction &&
			this.contact.fonction.existeNumero()
			? IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str("p", {
						class: "champ-libelle",
						"ie-html": () => this.contact.fonction.getLibelle(),
					}),
				)
			: "";
	}
	composeEstResponsableMaitreDeStage() {
		return (
			(this.contact.estResponsable || this.contact.estMaitreDeStage) &&
			IE.jsx.str(
				"div",
				{ class: "champ-conteneur" },
				IE.jsx.str("p", {
					class: "champ-libelle",
					"ie-html": () => {
						let lLibelle = "";
						if (this.contact.estResponsable) {
							lLibelle += ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.responsableEntreprise",
							).toLowerCase();
						}
						if (this.contact.estMaitreDeStage) {
							lLibelle +=
								(lLibelle
									? " " + ObjetTraduction_1.GTraductions.getValeur("Et") + " "
									: "") +
								ObjetTraduction_1.GTraductions.getValeur(
									"entreprise.maitreDeStage",
								).toLowerCase();
						}
						return lLibelle.ucfirst();
					},
				}),
			)
		);
	}
	composeTelFixeResp() {
		const lJsxTelEntrepriseIndicatifFixe = () => {
			return {
				getValue: () => {
					const lContact = this.entrepriseSaisie.contacts.get(
						this.indexContactCourant,
					);
					return lContact ? lContact.indicatifFixe : "";
				},
				setValue: (aValue) => {
					const lContact = this.entrepriseSaisie.contacts.get(
						this.indexContactCourant,
					);
					if (lContact) {
						lContact.indicatifFixe = aValue;
						lContact.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		const lJsxTelEntrepriseTelephoneFixe = () => {
			return {
				getValue: () => {
					const lContact = this.entrepriseSaisie.contacts.get(
						this.indexContactCourant,
					);
					return lContact ? lContact.fixe : "";
				},
				setValue: (aValue) => {
					const lContact = this.entrepriseSaisie.contacts.get(
						this.indexContactCourant,
					);
					if (lContact) {
						lContact.fixe = aValue;
						lContact.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		return IE.jsx.str(
			"div",
			{ class: "champ-conteneur" },
			IE.jsx.str(
				"p",
				{ class: "champ-libelle icon_home" },
				ObjetTraduction_1.GTraductions.getValeur("entreprise.telephoneFixe"),
			),
			IE.jsx.str(
				"div",
				{ class: "champ-valeur" },
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseIndicatifFixe.bind(this),
					"ie-indicatiftel": true,
					"ie-etatsaisie": true,
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.responsable",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoIndTelephoneFixe",
							),
						],
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.responsable",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoIndTelephoneFixe",
							),
						],
					),
				}),
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseTelephoneFixe.bind(this),
					"ie-telephone": true,
					"ie-etatsaisie": true,
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.responsable",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoTelephoneFixe",
							),
						],
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.responsable",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoTelephoneFixe",
							),
						],
					),
				}),
			),
		);
	}
	composeTelPortResp() {
		const lJsxTelEntrepriseIndicatifPortable = () => {
			return {
				getValue: () => {
					const lContact = this.entrepriseSaisie.contacts.get(
						this.indexContactCourant,
					);
					return lContact ? lContact.indicatifPort : "";
				},
				setValue: (aValue) => {
					const lContact = this.entrepriseSaisie.contacts.get(
						this.indexContactCourant,
					);
					if (lContact) {
						lContact.indicatifPort = aValue;
						lContact.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		const lJsxTelEntrepriseTelephonePortable = () => {
			return {
				getValue: () => {
					const lContact = this.entrepriseSaisie.contacts.get(
						this.indexContactCourant,
					);
					return lContact ? lContact.portable : "";
				},
				setValue: (aValue) => {
					const lContact = this.entrepriseSaisie.contacts.get(
						this.indexContactCourant,
					);
					if (lContact) {
						lContact.portable = aValue;
						lContact.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		return IE.jsx.str(
			"div",
			{ class: "champ-conteneur" },
			IE.jsx.str(
				"p",
				{ class: "champ-libelle icon_mobile_phone" },
				ObjetTraduction_1.GTraductions.getValeur(
					"entreprise.telephonePortable",
				),
			),
			IE.jsx.str(
				"div",
				{ class: "champ-valeur" },
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseIndicatifPortable.bind(this),
					"ie-indicatiftel": true,
					"ie-etatsaisie": true,
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.responsable",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoIndPortable",
							),
						],
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.responsable",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoIndPortable",
							),
						],
					),
				}),
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseTelephonePortable.bind(this),
					"ie-telephone": true,
					"ie-etatsaisie": true,
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.responsable",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoPortable",
							),
						],
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.responsable",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoPortable",
							),
						],
					),
				}),
			),
		);
	}
	composeFaxResp() {
		const lJsxTelEntrepriseIndicatifFax = () => {
			return {
				getValue: () => {
					const lContact = this.entrepriseSaisie.contacts.get(
						this.indexContactCourant,
					);
					return lContact ? lContact.indicatifFax : "";
				},
				setValue: (aValue) => {
					const lContact = this.entrepriseSaisie.contacts.get(
						this.indexContactCourant,
					);
					if (lContact) {
						lContact.indicatifFax = aValue;
						lContact.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		const lJsxTelEntrepriseNumeroFax = () => {
			return {
				getValue: () => {
					const lContact = this.entrepriseSaisie.contacts.get(
						this.indexContactCourant,
					);
					return lContact ? lContact.fax : "";
				},
				setValue: (aValue) => {
					const lContact = this.entrepriseSaisie.contacts.get(
						this.indexContactCourant,
					);
					if (lContact) {
						lContact.fax = aValue;
						lContact.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		return IE.jsx.str(
			"div",
			{ class: "champ-conteneur" },
			IE.jsx.str(
				"p",
				{ class: "champ-libelle icon_tel_fax" },
				ObjetTraduction_1.GTraductions.getValeur("entreprise.fax"),
			),
			IE.jsx.str(
				"div",
				{ class: "champ-valeur" },
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseIndicatifFax.bind(this),
					"ie-indicatiftel": true,
					"ie-etatsaisie": true,
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.responsable",
						[ObjetTraduction_1.GTraductions.getValeur("entreprise.infoIndFax")],
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.responsable",
						[ObjetTraduction_1.GTraductions.getValeur("entreprise.infoIndFax")],
					),
				}),
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseNumeroFax.bind(this),
					"ie-telephone": true,
					"ie-etatsaisie": true,
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.responsable",
						[ObjetTraduction_1.GTraductions.getValeur("entreprise.infoFax")],
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.responsable",
						[ObjetTraduction_1.GTraductions.getValeur("entreprise.infoFax")],
					),
				}),
			),
		);
	}
	composeEmailResp() {
		const lId = GUID_1.GUID.getId();
		const lInputEmail = () => {
			return {
				getValue: () => {
					return this.contact.email || "";
				},
				setValue: (aValue) => {
					this.setEtatSaisie(true);
					this.contact.email = aValue;
				},
			};
		};
		return this.autorisations.avecSaisie
			? IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"label",
						{ class: "champ-libelle icon_arobase", for: lId },
						ObjetTraduction_1.GTraductions.getValeur("entreprise.email"),
					),
					IE.jsx.str("input", {
						class: "champ-valeur",
						id: lId,
						type: "text",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"entreprise.infoEmail",
						),
						"ie-model": lInputEmail,
					}),
				)
			: this.contact.email
				? IE.jsx.str(
						"div",
						{ class: "champ-conteneur" },
						IE.jsx.str(
							"dt",
							null,
							ObjetTraduction_1.GTraductions.getValeur("entreprise.email"),
						),
						IE.jsx.str("dd", null, this.contact.email),
					)
				: "";
	}
	composeTelephoneFixe() {
		const lJsxTelEntrepriseIndicatifFixe = () => {
			return {
				getValue: () => {
					return this.entrepriseSaisie.indicatifFixe;
				},
				setValue: (aValue) => {
					this.entrepriseSaisie.indicatifFixe = aValue;
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		const lJsxTelEntrepriseTelephoneFixe = () => {
			return {
				getValue: () => {
					return this.entrepriseSaisie.fixe;
				},
				setValue: (aValue) => {
					this.entrepriseSaisie.fixe = aValue;
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		return IE.jsx.str(
			"div",
			{ class: "champ-conteneur" },
			IE.jsx.str(
				"p",
				{ class: "champ-libelle icon_home" },
				ObjetTraduction_1.GTraductions.getValeur("entreprise.telephoneFixe"),
			),
			IE.jsx.str(
				"div",
				{ class: "champ-valeur" },
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseIndicatifFixe.bind(this),
					"ie-indicatiftel": true,
					"ie-etatsaisie": true,
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.etablissement",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoIndTelephoneFixe",
							),
						],
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.etablissement",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoIndTelephoneFixe",
							),
						],
					),
				}),
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseTelephoneFixe.bind(this),
					"ie-telephone": true,
					"ie-etatsaisie": true,
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.etablissement",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoTelephoneFixe",
							),
						],
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.etablissement",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoTelephoneFixe",
							),
						],
					),
				}),
			),
		);
	}
	composeTelephonePort() {
		const lJsxTelEntrepriseIndicatifPortable = () => {
			return {
				getValue: () => {
					return this.entrepriseSaisie.indicatifPort;
				},
				setValue: (aValue) => {
					this.entrepriseSaisie.indicatifPort = aValue;
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		const lJsxTelEntrepriseTelephonePortable = () => {
			return {
				getValue: () => {
					return this.entrepriseSaisie.portable;
				},
				setValue: (aValue) => {
					this.entrepriseSaisie.portable = aValue;
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		return IE.jsx.str(
			"div",
			{ class: "champ-conteneur" },
			IE.jsx.str(
				"p",
				{ class: "champ-libelle icon_mobile_phone" },
				ObjetTraduction_1.GTraductions.getValeur(
					"entreprise.telephonePortable",
				),
			),
			IE.jsx.str(
				"div",
				{ class: "champ-valeur" },
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseIndicatifPortable.bind(this),
					"ie-indicatiftel": true,
					"ie-etatsaisie": true,
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.etablissement",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoIndPortable",
							),
						],
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.etablissement",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoIndPortable",
							),
						],
					),
				}),
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseTelephonePortable.bind(this),
					"ie-telephone": true,
					"ie-etatsaisie": true,
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.etablissement",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoPortable",
							),
						],
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.etablissement",
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"entreprise.infoPortable",
							),
						],
					),
				}),
			),
		);
	}
	composeFax() {
		const lJsxTelEntrepriseIndicatifFax = () => {
			return {
				getValue: () => {
					return this.entrepriseSaisie.indicatifFax;
				},
				setValue: (aValue) => {
					this.entrepriseSaisie.indicatifFax = aValue;
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		const lJsxTelEntrepriseNumeroFax = () => {
			return {
				getValue: () => {
					return this.entrepriseSaisie.fax;
				},
				setValue: (aValue) => {
					32;
					this.entrepriseSaisie.fax = aValue;
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		return IE.jsx.str(
			"div",
			{ class: "champ-conteneur" },
			IE.jsx.str(
				"p",
				{ class: "champ-libelle icon_tel_fax" },
				ObjetTraduction_1.GTraductions.getValeur("entreprise.fax"),
			),
			IE.jsx.str(
				"div",
				{ class: "champ-valeur" },
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseIndicatifFax.bind(this),
					"ie-indicatiftel": true,
					"ie-etatsaisie": true,
					class: "indicatif-tel",
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.etablissement",
						[ObjetTraduction_1.GTraductions.getValeur("entreprise.infoIndFax")],
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.etablissement",
						[ObjetTraduction_1.GTraductions.getValeur("entreprise.infoIndFax")],
					),
				}),
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseNumeroFax.bind(this),
					"ie-telephone": true,
					"ie-etatsaisie": true,
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.etablissement",
						[ObjetTraduction_1.GTraductions.getValeur("entreprise.infoFax")],
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.etablissement",
						[ObjetTraduction_1.GTraductions.getValeur("entreprise.infoFax")],
					),
				}),
			),
		);
	}
	composeSIRET() {
		const lId = GUID_1.GUID.getId();
		const lInputSiret = () => {
			return {
				getValue: () => {
					return this.entrepriseSaisie.siret || "";
				},
				setValue: (aValue) => {
					this.setEtatSaisie(true);
					this.entrepriseSaisie.siret = aValue;
				},
			};
		};
		return this.autorisations.avecSaisie
			? IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"label",
						{ class: "champ-libelle", for: lId },
						ObjetTraduction_1.GTraductions.getValeur("entreprise.siret"),
					),
					IE.jsx.str("input", {
						class: "champ-valeur",
						id: lId,
						type: "text",
						maxlength: "15",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"entreprise.infoSIRET",
						),
						"ie-model": lInputSiret,
					}),
				)
			: this.entrepriseSaisie.siret
				? IE.jsx.str(
						"div",
						{ class: "champ-conteneur" },
						IE.jsx.str(
							"dt",
							null,
							ObjetTraduction_1.GTraductions.getValeur("entreprise.siret"),
						),
						IE.jsx.str("dd", null, this.entrepriseSaisie.siret),
					)
				: "";
	}
	composeURSSAF() {
		const lInputUrssaf = () => {
			return {
				getValue: () => {
					return this.entrepriseSaisie.urssaf || "";
				},
				setValue: (aValue) => {
					this.setEtatSaisie(true);
					this.entrepriseSaisie.urssaf = aValue;
				},
			};
		};
		const lId = GUID_1.GUID.getId();
		return this.autorisations.avecSaisie
			? IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"label",
						{ class: "champ-libelle", for: lId },
						ObjetTraduction_1.GTraductions.getValeur("entreprise.urssaf"),
					),
					IE.jsx.str("input", {
						class: "champ-valeur",
						id: lId,
						type: "text",
						style: { width: 120 },
						title: ObjetTraduction_1.GTraductions.getValeur(
							"entreprise.infoURSSAF",
						),
						"ie-model": lInputUrssaf,
					}),
				)
			: this.entrepriseSaisie.urssaf
				? IE.jsx.str(
						"div",
						{ class: "champ-conteneur" },
						IE.jsx.str(
							"dt",
							null,
							ObjetTraduction_1.GTraductions.getValeur("entreprise.urssaf"),
						),
						IE.jsx.str("dd", null, this.entrepriseSaisie.urssaf),
					)
				: "";
	}
	composeSiteWeb() {
		const lInputSiteWeb = () => {
			return {
				getValue: () => {
					return this.entrepriseSaisie.siteWeb || "";
				},
				setValue: (aValue) => {
					this.setEtatSaisie(true);
					this.entrepriseSaisie.siteWeb = aValue;
				},
			};
		};
		const lId = GUID_1.GUID.getId();
		return this.autorisations.avecSaisie
			? IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"label",
						{ class: "champ-libelle", for: lId },
						ObjetTraduction_1.GTraductions.getValeur("entreprise.siteWeb"),
					),
					IE.jsx.str("input", {
						class: "champ-valeur",
						id: lId,
						type: "text",
						style: { width: 300 },
						title: ObjetTraduction_1.GTraductions.getValeur(
							"entreprise.infoSiteWeb",
						),
						"ie-model": lInputSiteWeb,
					}),
				)
			: this.entrepriseSaisie.siteWeb
				? IE.jsx.str(
						"div",
						{ class: "champ-conteneur" },
						IE.jsx.str(
							"dt",
							null,
							ObjetTraduction_1.GTraductions.getValeur("entreprise.siteWeb"),
						),
						IE.jsx.str(
							"dd",
							null,
							IE.jsx.str(
								"a",
								{ href: this.entrepriseSaisie.siteWeb },
								" ",
								ObjetChaine_1.GChaine.replaceRCToHTML(
									this.entrepriseSaisie.siteWeb,
								),
							),
						),
					)
				: "";
	}
	_getValeurTelephone(aElement) {
		return ObjetChaine_1.GChaine.supprimerEspaces(
			$(aElement).val().replace(/_/g, ""),
		);
	}
	surValidation() {
		this.callback.appel(0, this.entrepriseSaisie);
		this.setEtatSaisie(false);
	}
	evenementSurComboCivilite(aParams) {
		if (!aParams.element) {
			return;
		}
		if (this.contact.civilite.getNumero() !== aParams.element.getNumero()) {
			this.contact.civilite = aParams.element;
			this.contact.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
	}
	evenementSurComboContact(aParams) {
		if (!aParams.element) {
			return;
		}
		if (this.indexContactCourant !== aParams.indice) {
			this.indexContactCourant = aParams.indice;
			this.contact = this.entrepriseSaisie.contacts.get(
				this.indexContactCourant,
			);
			const lIndice = this.contact
				? this.entrepriseSaisie.civilites.getIndiceParElement(
						this.contact.civilite,
					)
				: 0;
			this.comboCivilite.setSelection(lIndice ? lIndice : 0);
		}
	}
}
exports.PageEntreprise = PageEntreprise;
