exports.ObjetDetailOffreStage = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireStage_1 = require("UtilitaireStage");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_CalendrierStagePeriode_1 = require("ObjetFenetre_CalendrierStagePeriode");
class ObjetDetailOffreStage extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.options = {
			avecPeriode: false,
			avecPeriodeUnique: true,
			avecEdition: false,
			avecGestionPJ: false,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnCalendrier: {
				event: function (aOffreNumero) {
					const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_CalendrierStagePeriode_1.ObjetFenetre_CalendrierStagePeriode,
						{
							pere: aInstance,
							initialiser: function (aInstance) {
								aInstance.setOptionsFenetre({
									titre: ObjetTraduction_1.GTraductions.getValeur(
										"OffreStage.PeriodePossible",
									),
									largeur: 1000,
									hauteurMaxContenu: 650,
									avecScroll: true,
								});
							},
						},
					);
					const lOffre =
						aInstance.entreprise.listeOffresStages.getElementParNumero(
							aOffreNumero,
						);
					if (!!lOffre) {
						lFenetre.setDonnees(lOffre);
						lFenetre.afficher();
					}
				},
			},
		});
	}
	setDonnees(aDonnees, aOnglet) {
		this.entreprise = aDonnees.entreprise;
		if (IE.estMobile) {
			this.genreOnglet = aOnglet;
		}
		this._actualiser();
	}
	actualiserAffichage() {
		this._actualiser();
	}
	construireAffichage() {
		if (!this.entreprise || !this.entreprise.visible) {
			return this.composeMessage(
				ObjetTraduction_1.GTraductions.getValeur("OffreStage.selectEntreprise"),
			);
		}
		const H = [];
		if (IE.estMobile) {
			let lContenuDetailOffreStage;
			if (this.genreOnglet === 0) {
				lContenuDetailOffreStage = IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "conteneur-detailEntreprise" },
						this._composeContenuDetailEntreprise(),
					),
				);
			} else {
				lContenuDetailOffreStage = IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str("div", null, this._composeContenuDetailOffres()),
				);
			}
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "detailoffrestage" },
						lContenuDetailOffreStage,
					),
				),
			);
		} else {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "detailoffrestage" },
						IE.jsx.str(
							"div",
							{ class: "conteneur-detailEntreprise" },
							this._composeContenuDetailEntreprise(),
						),
						IE.jsx.str("div", null, this._composeContenuDetailOffres()),
					),
				),
			);
		}
		return H.join("");
	}
	_actualiser() {
		this.afficher();
	}
	_composeContenuDetailEntreprise() {
		const H = [];
		if (!IE.estMobile) {
			H.push(
				IE.jsx.str(
					"h2",
					{ class: "ie-titre-couleur", tabindex: "0" },
					ObjetTraduction_1.GTraductions.getValeur("OffreStage.details"),
				),
			);
		}
		const lNomEntreprise = this.entreprise.getLibelle();
		const lStrActivite = this.entreprise.activite
			? this.entreprise.activite.getLibelle() || ""
			: "";
		const lAdresseComplete = [];
		if (this.entreprise.adresse1) {
			lAdresseComplete.push(
				IE.jsx.str("div", { tabindex: "0" }, this.entreprise.adresse1),
			);
		}
		if (this.entreprise.adresse2) {
			lAdresseComplete.push(
				IE.jsx.str("div", { tabindex: "0" }, this.entreprise.adresse2),
			);
		}
		if (this.entreprise.adresse3) {
			lAdresseComplete.push(
				IE.jsx.str("div", { tabindex: "0" }, this.entreprise.adresse3),
			);
		}
		if (this.entreprise.adresse4) {
			lAdresseComplete.push(
				IE.jsx.str("div", { tabindex: "0" }, this.entreprise.adresse4),
			);
		}
		if (this.entreprise.codePostal || this.entreprise.ville) {
			lAdresseComplete.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ tabindex: "0" },
						this.entreprise.codePostal ? this.entreprise.codePostal : "",
						" ",
						this.entreprise.ville ? this.entreprise.ville : "",
					),
				),
			);
		}
		const lSiret = [];
		if (this.entreprise.siret) {
			lSiret.push(
				IE.jsx.str(
					"div",
					{ tabindex: "0" },
					ObjetTraduction_1.GTraductions.getValeur(
						"OffreStage.titre.NumeroSiret",
					) +
						" : " +
						this.entreprise.siret,
				),
			);
		}
		const lNomCommercial = [];
		if (this.entreprise.nomCommercial) {
			lNomCommercial.push(
				IE.jsx.str("div", null, this.entreprise.nomCommercial),
			);
		}
		H.push(
			IE.jsx.str(
				"div",
				{ class: "header-detail" },
				IE.jsx.str(
					"div",
					{ class: "conteneur-nom p-top-l", tabindex: "0" },
					IE.jsx.str("i", {
						"aria-hidden": "true",
						class: this.entreprise.estSiegeSocial
							? "icon_building"
							: "icon_entreprise",
					}),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"div",
							{ class: "ie-titre" },
							lNomEntreprise +
								(this.entreprise.estSiegeSocial
									? " (" +
										ObjetTraduction_1.GTraductions.getValeur(
											"FicheStage.siegeSocial",
										) +
										")"
									: ""),
						),
						lNomCommercial.join(""),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "adresse-wrapper" },
					IE.jsx.str(
						"div",
						{ class: "conteneur-adresse" },
						lAdresseComplete.join(""),
					),
					IE.jsx.str("div", { tabindex: "0" }, lStrActivite),
					lSiret.join(""),
				),
			),
		);
		if (
			!!this.entreprise.numeroMobile ||
			!!this.entreprise.numeroFixe ||
			!!this.entreprise.numeroFax ||
			!!this.entreprise.email ||
			!!this.entreprise.siteInternet
		) {
			const lNumeroMobile = [];
			if (this.entreprise.numeroMobile) {
				lNumeroMobile.push(
					IE.jsx.str(
						"div",
						{
							class: "lien-communication tel-mobile",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"FicheStage.TelPortable",
							),
						},
						IE.jsx.str(
							"a",
							{
								href:
									"tel:" +
									ObjetChaine_1.GChaine.formatTelephoneAvecIndicatif(
										this.entreprise.indMobile,
										this.entreprise.numeroMobile,
									),
							},
							ObjetChaine_1.GChaine.formatTelephone(
								this.entreprise.numeroMobile,
							),
						),
					),
				);
			}
			const lNumeroFixe = [];
			if (this.entreprise.numeroFixe) {
				lNumeroFixe.push(
					IE.jsx.str(
						"div",
						{
							class: "lien-communication tel",
							title:
								ObjetTraduction_1.GTraductions.getValeur("FicheStage.TelFixe"),
						},
						IE.jsx.str(
							"a",
							{
								href:
									"tel:" +
									ObjetChaine_1.GChaine.formatTelephoneAvecIndicatif(
										this.entreprise.indFixe,
										this.entreprise.numeroFixe,
									),
							},
							ObjetChaine_1.GChaine.formatTelephone(this.entreprise.numeroFixe),
						),
					),
				);
			}
			const lNumeroFax = [];
			if (this.entreprise.numeroFax) {
				lNumeroFax.push(
					IE.jsx.str(
						"div",
						{
							class: "lien-communication",
							title: ObjetTraduction_1.GTraductions.getValeur("FicheStage.Fax"),
						},
						IE.jsx.str(
							"a",
							{
								href:
									"fax:" +
									ObjetChaine_1.GChaine.formatTelephoneAvecIndicatif(
										this.entreprise.indFax,
										this.entreprise.numeroFax,
									),
							},
							ObjetChaine_1.GChaine.formatTelephone(this.entreprise.numeroFax),
						),
					),
				);
			}
			const lEmail = [];
			if (this.entreprise.email) {
				lEmail.push(
					IE.jsx.str(
						"div",
						{ class: "lien-communication" },
						IE.jsx.str(
							"a",
							{ href: "mailto:" + this.entreprise.email, target: "_blank" },
							this.entreprise.email,
						),
					),
				);
			}
			const lSiteInternet = [];
			if (this.entreprise.siteInternet) {
				lSiteInternet.push(
					IE.jsx.str(
						"div",
						{ class: "lien-communication" },
						IE.jsx.str(
							"a",
							{
								href: ObjetChaine_1.GChaine.encoderUrl(
									ObjetChaine_1.GChaine.verifierURLHttp(
										this.entreprise.siteInternet,
									),
								),
							},
							this.entreprise.siteInternet,
						),
					),
				);
			}
			H.push(
				IE.jsx.str(
					"div",
					{ class: "conteneur-numeros" },
					lNumeroMobile.join(""),
					lNumeroFixe.join(""),
					lNumeroFax.join(""),
					lEmail.join(""),
					lSiteInternet.join(""),
				),
			);
		}
		if (!!this.entreprise.commentairePublie) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "conteneur-bloc" },
					IE.jsx.str(
						"div",
						{ class: "Gras ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.commentairePublieFamille",
						),
					),
					IE.jsx.str(
						"div",
						{ class: "conteneur-texte" },
						this.entreprise.commentairePublie,
					),
				),
			);
		}
		if (!!this.entreprise.commentaireInterne) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "conteneur-bloc" },
					IE.jsx.str(
						"div",
						{ class: "Gras ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.commentaireInterne",
						),
					),
					IE.jsx.str(
						"div",
						{ class: "conteneur-texte" },
						this.entreprise.commentaireInterne,
					),
				),
			);
		}
		if (!!this.entreprise.documents && this.entreprise.documents.count() > 0) {
			H.push('<div class="conteneur-bloc">');
			for (let i = 0, lNbr = this.entreprise.documents.count(); i < lNbr; i++) {
				H.push(
					IE.jsx.str(
						"div",
						{ class: "chips-pj Inline" },
						ObjetChaine_1.GChaine.composerUrlLienExterne({
							documentJoint: this.entreprise.documents.get(i),
							maxWidth: 250,
						}),
					),
				);
			}
			H.push("</div>");
		}
		return H.join("");
	}
	_composeContenuDetailOffres() {
		const H = [];
		const nbOffresStages = this.entreprise.listeOffresStages
			? this.entreprise.listeOffresStages.count()
			: 0;
		if (nbOffresStages) {
			if (!IE.estMobile) {
				H.push(
					IE.jsx.str(
						"h2",
						{ class: "ie-titre-couleur", tabindex: "0" },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.offres",
						).ucfirst(),
						" (",
						nbOffresStages,
						")",
					),
				);
			}
			for (let i = 0; i < nbOffresStages; i++) {
				const lClassDiv = i > 0 ? "conteneur-detailsOffre" : "";
				H.push(
					IE.jsx.str(
						"div",
						{ class: lClassDiv, tabindex: "0" },
						this._composeContenuDetailOffre(
							this.entreprise.listeOffresStages.get(i),
						),
					),
				);
			}
		}
		return H.join("");
	}
	_composeContenuDetailOffre(aOffreStage) {
		var _a;
		const H = [];
		const lPourvue = aOffreStage.nbPourvus === aOffreStage.nbPropose;
		const lClasseChips = ["tag-style"];
		if (!lPourvue) {
			lClasseChips.push("color-theme");
		}
		const lStrEstPourvu = lPourvue
			? ObjetTraduction_1.GTraductions.getValeur("OffreStage.pourvue")
			: ObjetTraduction_1.GTraductions.getValeur("OffreStage.nonPourvue");
		H.push(
			IE.jsx.str(
				"div",
				{ class: "header-conteneur p-y" },
				IE.jsx.str(
					"h2",
					{
						class: lPourvue ? "titre-pourvue" : "ie-titre-couleur no-border",
						tabindex: "0",
					},
					aOffreStage.sujet.getLibelle(),
				),
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"ie-chips",
						{ class: lClasseChips.join(" ") },
						lStrEstPourvu,
					),
				),
			),
		);
		let lStrDivSujetDetaille = "";
		if (aOffreStage.sujetDetaille) {
			lStrDivSujetDetaille = IE.jsx.str(
				"div",
				{ class: "conteneur-texte", tabindex: "0" },
				aOffreStage.sujetDetaille,
			);
		}
		H.push(
			IE.jsx.str(
				"div",
				{ class: "conteneur-bloc" },
				IE.jsx.str(
					"h3",
					{ class: "Gras ie-titre-petit", tabindex: "0" },
					ObjetTraduction_1.GTraductions.getValeur("OffreStage.SujetDetaille"),
					" :",
				),
				lStrDivSujetDetaille,
			),
		);
		if (this.options.avecPeriode) {
			let lLibelle;
			if (
				this.options.avecPeriodeUnique &&
				((_a = aOffreStage.periodes) === null || _a === void 0
					? void 0
					: _a.count()) === 1
			) {
				lLibelle =
					UtilitaireStage_1.UtilitaireStage.composeLibelleDatePeriodeEntreLe(
						aOffreStage.periodes.get(0),
					);
			} else if (!!aOffreStage.periodes && aOffreStage.periodes.count()) {
				lLibelle = IE.jsx.str(
					"ie-bouton",
					{
						class: "small-bt themeBoutonSecondaire m-left",
						"ie-model": "btnCalendrier('" + aOffreStage.getNumero() + "')",
					},
					ObjetTraduction_1.GTraductions.getValeur("OffreStage.voirCalendrier"),
				);
			}
			const lStrLibelleDureeEtPeriode =
				aOffreStage.duree +
				" " +
				(!!lLibelle
					? lLibelle
					: "(" +
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.aucunePeriodeImposee",
						) +
						")");
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "conteneur-bloc" },
						IE.jsx.str(
							"h3",
							{ class: "Gras ie-titre-petit", tabindex: "0" },
							ObjetTraduction_1.GTraductions.getValeur(
								"OffreStage.dureeEtPeriode",
							),
							" :",
						),
						IE.jsx.str(
							"div",
							{ class: "conteneur-texte", tabindex: "0" },
							lStrLibelleDureeEtPeriode,
						),
					),
				),
			);
		}
		if (aOffreStage.commentaire) {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "conteneur-bloc" },
						IE.jsx.str(
							"h3",
							{ class: "Gras ie-titre-petit", tabindex: "0" },
							ObjetTraduction_1.GTraductions.getValeur(
								"OffreStage.Commentaire",
							),
							" :",
						),
						IE.jsx.str(
							"div",
							{ class: "conteneur-texte", tabindex: "0" },
							aOffreStage.commentaire,
						),
					),
				),
			);
		}
		if (
			this.options.avecGestionPJ &&
			aOffreStage.piecesjointes &&
			aOffreStage.piecesjointes.count() > 0
		) {
			H.push('<div class="conteneur-bloc">');
			for (let i = 0, lNbr = aOffreStage.piecesjointes.count(); i < lNbr; i++) {
				H.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"div",
							{ class: "chips-pj Inline" },
							ObjetChaine_1.GChaine.composerUrlLienExterne({
								documentJoint: aOffreStage.piecesjointes.get(i),
								maxWidth: 250,
							}),
						),
					),
				);
			}
			H.push("</div>");
		}
		return H.join("");
	}
}
exports.ObjetDetailOffreStage = ObjetDetailOffreStage;
