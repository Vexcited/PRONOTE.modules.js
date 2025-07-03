exports.PageEntreprise = void 0;
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetStyle_1 = require("ObjetStyle");
class PageEntreprise extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.hauteurs = { libelle: 20 };
		this.largeurs = { libelle: 160, combo: 70, field: 375, indicatif: 40 };
		this.id = {
			nomContact: this.Nom + "_nomContact",
			prenomContact: this.Nom + "_prenomContact",
			emailContact: this.Nom + "_emailContact",
			fonctionContact: this.Nom + "_fonctionContact",
			estResponsable: this.Nom + "_estResponsable",
		};
		this.classFloatPere = GUID_1.GUID.getClassCss();
		this.classFloatInfo = GUID_1.GUID.getClassCss();
		this.typeZoneSaisie = {
			fax: 1,
			siret: 2,
			urssaf: 3,
			nomResp: 4,
			prenomResp: 5,
			eMailResp: 8,
			siteWeb: 12,
		};
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
		const lHtml = [];
		lHtml.push('<div class="page-entreprise-conteneur">');
		lHtml.push(
			'<div class="bloc-infos">',
			"  <h4>",
			ObjetTraduction_1.GTraductions.getValeur("entreprise.titreEntreprise"),
			"</h4>",
			"  <fieldset>",
			this.composeEntreprise(),
			"</fieldset>",
			"</div>",
		);
		if (
			this.entrepriseSaisie.contacts &&
			this.entrepriseSaisie.contacts.count() > 0
		) {
			lHtml.push(
				'<div class="bloc-infos">',
				"  <h4>",
				ObjetTraduction_1.GTraductions.getValeur("entreprise.titreResponsable"),
				"</h4>",
				"  <fieldset>",
				this.composeResponsable(),
				"</fieldset>",
				"</div>",
			);
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeEntreprise() {
		const lHtml = [];
		lHtml.push(
			'<div class="rs-contain">',
			this.composeRaisonSociale(),
			this.composeSecteur(),
			this.composeAdresse(),
			"</div>",
			this.composeTelephoneFixe(),
			this.composeTelephonePort(),
			this.composeFax(),
			this.composeSIRET(),
			this.composeURSSAF(),
			this.composeSiteWeb(),
		);
		return lHtml.join("");
	}
	composeResponsable() {
		this.contact = this.entrepriseSaisie.contacts.get(this.indexContactCourant);
		const lHtml = [];
		lHtml.push(
			IE.jsx.str("div", { id: this.comboContact.getNom(), class: "m-bottom" }),
			this.composeNomResponsable(),
			this.composePrenomResponsable(),
			'<div id="',
			this.id.fonctionContact,
			'">',
			this.composeFonction(),
			"</div>",
			'<div id="',
			this.id.estResponsable,
			'">',
			this.composeEstResponsableMaitreDeStage(),
			"</div>",
			this.composeTelFixeResp(),
			this.composeTelPortResp(),
			this.composeFaxResp(),
			this.composeEmailResp(),
		);
		return lHtml.join("");
	}
	composeNomResponsable() {
		const lHtml = [];
		if (this.autorisations.avecSaisie) {
			lHtml.push(
				'<div class="field-contain">',
				'<label class="resp-name">',
				ObjetTraduction_1.GTraductions.getValeur("entreprise.nom"),
				"</label>",
				IE.jsx.str("div", {
					class: "m-right",
					id: this.comboCivilite.getNom(),
				}),
				IE.jsx.str("input", {
					id: this.id.nomContact,
					type: "text",
					value: this.contact.nom,
					title: ObjetTraduction_1.GTraductions.getValeur("entreprise.infoNom"),
					style: { width: 210 },
					onchange: `${this.Nom}.evenementSurZone(${this.typeZoneSaisie.nomResp}, this)`,
				}),
				"</div>",
			);
		} else {
			if (this.contact.nom) {
				lHtml.push(
					'<div class="field-contain">',
					"<label>",
					ObjetTraduction_1.GTraductions.getValeur("entreprise.nom"),
					"</label>",
					"<label>",
					this.contact.nom,
					"</label>",
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
	composePrenomResponsable() {
		const lHtml = [];
		if (this.autorisations.avecSaisie) {
			lHtml.push(
				'<div class="field-contain">',
				"<label>",
				ObjetTraduction_1.GTraductions.getValeur("entreprise.prenom"),
				"</label>",
				IE.jsx.str("input", {
					id: this.id.prenomContact,
					type: "text",
					value: this.contact.prenoms,
					style: { width: 210 },
					title: ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.infoPrenom",
					),
					onchange: `${this.Nom}.evenementSurZone(${this.typeZoneSaisie.prenomResp}, this)`,
				}),
				"</div>",
			);
		} else {
			if (this.contact.prenoms) {
				lHtml.push(
					'<div class="field-contain">',
					"<label>",
					ObjetTraduction_1.GTraductions.getValeur("entreprise.nom"),
					"</label>",
					"<label>",
					this.contact.prenoms,
					"</label>",
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
	composeFonction() {
		const lHtml = [];
		if (
			this.contact &&
			this.contact.fonction &&
			this.contact.fonction.existeNumero()
		) {
			lHtml.push(
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str("label", null),
					IE.jsx.str(
						"label",
						{ class: "description" },
						this.contact.fonction.getLibelle(),
					),
				),
			);
		}
		return lHtml.join("");
	}
	composeEstResponsableMaitreDeStage() {
		const lHtml = [];
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
		if (lLibelle) {
			lHtml.push(
				'<div class="field-contain">',
				"<label></label>",
				'<label class="description">',
				lLibelle.ucfirst(),
				"</label>",
				"</div>",
			);
		}
		return lHtml.join("");
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
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					null,
					ObjetTraduction_1.GTraductions.getValeur("entreprise.telephoneFixe"),
				),
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseIndicatifFixe.bind(this),
					"ie-indicatiftel": true,
					"ie-etatsaisie": true,
					class: "indicatif-tel",
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
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
				}),
			),
		);
		return H.join("");
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
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.telephonePortable",
					),
				),
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseIndicatifPortable.bind(this),
					"ie-indicatiftel": true,
					"ie-etatsaisie": true,
					class: "indicatif-tel",
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
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
				}),
			),
		);
		return H.join("");
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
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					null,
					ObjetTraduction_1.GTraductions.getValeur("entreprise.fax"),
				),
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseIndicatifFax.bind(this),
					"ie-indicatiftel": true,
					"ie-etatsaisie": true,
					class: "indicatif-tel",
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
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
				}),
			),
		);
		return H.join("");
	}
	composeEmailResp() {
		const lHtml = [];
		if (this.autorisations.avecSaisie) {
			lHtml.push(
				'<div class="field-contain">',
				"<label>",
				ObjetTraduction_1.GTraductions.getValeur("entreprise.email"),
				"</label>",
				'<input id="',
				this.id.emailContact,
				'"  type="text" value="',
				this.contact.email,
				'" title="',
				ObjetTraduction_1.GTraductions.getValeur("entreprise.infoEmail"),
				'" ',
				`style="${ObjetStyle_1.GStyle.composeWidth(210)}"`,
				'onchange="',
				this.Nom,
				".evenementSurZone(",
				this.typeZoneSaisie.eMailResp,
				', this)">',
				"</div>",
			);
		} else {
			if (this.contact.email) {
				lHtml.push(
					'<div class="field-contain">',
					"<label>",
					ObjetTraduction_1.GTraductions.getValeur("entreprise.siret"),
					"</label>",
					"<label>",
					this.contact.email,
					"</label>",
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
	composeRaisonSociale() {
		const lHtml = [];
		const lAvecRaisonSocial = !!this.entrepriseSaisie.raisonSociale;
		const lAvecNomCommercial = !!this.entrepriseSaisie.nomCommercial;
		if (lAvecRaisonSocial && lAvecNomCommercial) {
			lHtml.push(
				'<label class="raison-sociale">',
				this.entrepriseSaisie.raisonSociale,
				"</label><label>",
				this.entrepriseSaisie.nomCommercial,
				"</label>",
			);
		} else if (lAvecRaisonSocial) {
			lHtml.push(
				'<label class="raison-sociale">',
				this.entrepriseSaisie.raisonSociale,
				"</label>",
			);
		} else if (lAvecNomCommercial) {
			lHtml.push(
				'<label class="raison-sociale">',
				this.entrepriseSaisie.nomCommercial,
				"</label>",
			);
		} else {
			return "";
		}
		return lHtml.join("");
	}
	composeSecteur() {
		const lHtml = [];
		lHtml.push(
			'<label class="secteur">',
			this.entrepriseSaisie.secteurActivite
				? this.entrepriseSaisie.secteurActivite
				: "",
			"</label>",
		);
		return lHtml.join("");
	}
	composeAdresse() {
		const lHtml = [];
		lHtml.push(
			'<div class="adresses">',
			"<label>",
			this.entrepriseSaisie.adresse1 ? this.entrepriseSaisie.adresse1 : "",
			"</label>",
			"<label>",
			this.entrepriseSaisie.adresse2 ? this.entrepriseSaisie.adresse2 : "",
			"</label>",
			"<label>",
			this.entrepriseSaisie.adresse3 ? this.entrepriseSaisie.adresse3 : "",
			"</label>",
			"<label>",
			this.entrepriseSaisie.adresse4 ? this.entrepriseSaisie.adresse4 : "",
			"</label>",
			'<label class="cp">',
			this.entrepriseSaisie.codePostal || this.entrepriseSaisie.ville
				? this.entrepriseSaisie.codePostal + " " + this.entrepriseSaisie.ville
				: "",
			"</label>",
			"<label>",
			this.entrepriseSaisie.province
				? "<br/>" + this.entrepriseSaisie.province
				: "",
			"<label>",
			"</div>",
		);
		return lHtml.join("");
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
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					null,
					ObjetTraduction_1.GTraductions.getValeur("entreprise.telephoneFixe"),
				),
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseIndicatifFixe.bind(this),
					"ie-indicatiftel": true,
					"ie-etatsaisie": true,
					class: "indicatif-tel",
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
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
				}),
			),
		);
		return H.join("");
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
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"entreprise.telephonePortable",
					),
				),
				IE.jsx.str("input", {
					"ie-model": lJsxTelEntrepriseIndicatifPortable.bind(this),
					"ie-indicatiftel": true,
					"ie-etatsaisie": true,
					class: "indicatif-tel",
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
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
				}),
			),
		);
		return H.join("");
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
					this.entrepriseSaisie.fax = aValue;
				},
				getDisabled: () => {
					return !this.autorisations.avecSaisie;
				},
			};
		};
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					null,
					ObjetTraduction_1.GTraductions.getValeur("entreprise.fax"),
				),
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
				}),
			),
		);
		return H.join("");
	}
	composeSIRET() {
		const lHtml = [];
		if (this.autorisations.avecSaisie) {
			lHtml.push(
				'<div class="field-contain">',
				"<label>",
				ObjetTraduction_1.GTraductions.getValeur("entreprise.siret"),
				"</label>",
				'<input class="social-num" type="text" value="',
				this.entrepriseSaisie.siret,
				'" size="15" title="',
				ObjetTraduction_1.GTraductions.getValeur("entreprise.infoSIRET"),
				'" ',
				'onchange="',
				this.Nom,
				".evenementSurZone(",
				this.typeZoneSaisie.siret,
				', this)">',
				"</div>",
			);
		} else if (this.entrepriseSaisie.siret) {
			lHtml.push(
				'<div class="field-contain">',
				"<label>",
				ObjetTraduction_1.GTraductions.getValeur("entreprise.siret"),
				"</label>",
				"<label>",
				this.entrepriseSaisie.siret,
				"</label>",
				"</div>",
			);
		}
		return lHtml.join("");
	}
	composeURSSAF() {
		const lHtml = [];
		if (this.autorisations.avecSaisie) {
			lHtml.push(
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str(
						"label",
						null,
						ObjetTraduction_1.GTraductions.getValeur("entreprise.urssaf"),
					),
					IE.jsx.str("input", {
						class: "social-num",
						type: "text",
						value: this.entrepriseSaisie.urssaf,
						style: { width: 120 },
						title: ObjetTraduction_1.GTraductions.getValeur(
							"entreprise.infoURSSAF",
						),
						onchange: `${this.Nom}.evenementSurZone(${this.typeZoneSaisie.urssaf}, this)`,
					}),
				),
			);
		} else {
			if (this.entrepriseSaisie.urssaf) {
				lHtml.push(
					'<div class="field-contain">',
					"<label>",
					ObjetTraduction_1.GTraductions.getValeur("entreprise.urssaf"),
					"</label>",
					"<label>",
					this.entrepriseSaisie.urssaf,
					"</label>",
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
	composeSiteWeb() {
		const lHtml = [];
		if (this.autorisations.avecSaisie) {
			lHtml.push(
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str(
						"label",
						null,
						ObjetTraduction_1.GTraductions.getValeur("entreprise.siteWeb"),
					),
					IE.jsx.str("input", {
						type: "text",
						value: this.entrepriseSaisie.siteWeb,
						style: { width: 300 },
						title: ObjetTraduction_1.GTraductions.getValeur(
							"entreprise.infoSiteWeb",
						),
						onchange: `${this.Nom}.evenementSurZone(${this.typeZoneSaisie.siteWeb}, this)`,
					}),
				),
			);
		} else {
			if (this.entrepriseSaisie.siteWeb) {
				lHtml.push(
					'<div class="field-contain">',
					"<label>",
					ObjetTraduction_1.GTraductions.getValeur("entreprise.siteWeb"),
					"</label>",
					'<a href="' +
						this.entrepriseSaisie.siteWeb +
						'">' +
						ObjetChaine_1.GChaine.replaceRCToHTML(
							this.entrepriseSaisie.siteWeb,
						) +
						"</a>",
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
	_getValeurTelephone(aElement) {
		return ObjetChaine_1.GChaine.supprimerEspaces(
			$(aElement).val().replace(/_/g, ""),
		);
	}
	evenementSurZone(aTypeSaisie, aElement) {
		this.setEtatSaisie(true);
		switch (aTypeSaisie) {
			case this.typeZoneSaisie.fax:
				this.entrepriseSaisie.fax = this._getValeurTelephone(aElement);
				break;
			case this.typeZoneSaisie.siret:
				this.entrepriseSaisie.siret = ObjetHtml_1.GHtml.getValue(aElement);
				break;
			case this.typeZoneSaisie.urssaf:
				this.entrepriseSaisie.urssaf = ObjetHtml_1.GHtml.getValue(aElement);
				break;
			case this.typeZoneSaisie.siteWeb:
				this.entrepriseSaisie.siteWeb = ObjetHtml_1.GHtml.getValue(aElement);
				break;
			case this.typeZoneSaisie.nomResp:
				this.contact.nom = ObjetHtml_1.GHtml.getValue(aElement);
				break;
			case this.typeZoneSaisie.prenomResp:
				this.contact.prenoms = ObjetHtml_1.GHtml.getValue(aElement);
				break;
			case this.typeZoneSaisie.eMailResp:
				this.contact.email = ObjetHtml_1.GHtml.getValue(aElement);
				break;
		}
		this.contact.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
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
			ObjetHtml_1.GHtml.setValue(this.id.nomContact, this.contact.nom);
			ObjetHtml_1.GHtml.setValue(this.id.prenomContact, this.contact.prenoms);
			ObjetHtml_1.GHtml.setValue(this.id.emailContact, this.contact.email);
			ObjetHtml_1.GHtml.setHtml(
				this.id.fonctionContact,
				this.composeFonction(),
				{ controleur: this.controleur },
			);
			ObjetHtml_1.GHtml.setHtml(
				this.id.estResponsable,
				this.composeEstResponsableMaitreDeStage(),
				{ controleur: this.controleur },
			);
			const lIndice = this.contact
				? this.entrepriseSaisie.civilites.getIndiceParElement(
						this.contact.civilite,
					)
				: 0;
			this.comboCivilite.setSelection(lIndice ? lIndice : 0);
			this.$refreshSelf();
		}
	}
}
exports.PageEntreprise = PageEntreprise;
