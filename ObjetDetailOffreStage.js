exports.ObjetDetailOffreStage = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireStage_1 = require("UtilitaireStage");
const ObjetChaine_1 = require("ObjetChaine");
const tag_1 = require("tag");
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
			H.push('<div class="detailoffrestage">');
			if (this.genreOnglet === 0) {
				H.push(
					(0, tag_1.tag)(
						"div",
						{ class: "conteneur-detailEntreprise" },
						this._composeContenuDetailEntreprise(),
					),
				);
			} else {
				H.push((0, tag_1.tag)("div", this._composeContenuDetailOffres()));
			}
			H.push("</div>");
		} else {
			H.push(
				(0, tag_1.tag)(
					"div",
					{ class: "detailoffrestage" },
					(0, tag_1.tag)(
						"div",
						{ class: "conteneur-detailEntreprise" },
						this._composeContenuDetailEntreprise(),
					),
					(0, tag_1.tag)("div", this._composeContenuDetailOffres()),
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
				(0, tag_1.tag)(
					"h2",
					{ class: "ie-titre-couleur", tabindex: 0 },
					ObjetTraduction_1.GTraductions.getValeur("OffreStage.details"),
				),
			);
		}
		const lNomEntreprise = this.entreprise.getLibelle();
		const lStrActivite = this.entreprise.activite
			? this.entreprise.activite.getLibelle() || ""
			: "";
		const lAdresseComplete = [];
		lAdresseComplete.push(
			this.entreprise.adresse1
				? (0, tag_1.tag)("div", { tabindex: 0 }, this.entreprise.adresse1)
				: "",
		);
		lAdresseComplete.push(
			this.entreprise.adresse2
				? (0, tag_1.tag)("div", { tabindex: 0 }, this.entreprise.adresse2)
				: "",
		);
		lAdresseComplete.push(
			this.entreprise.adresse3
				? (0, tag_1.tag)("div", { tabindex: 0 }, this.entreprise.adresse3)
				: "",
		);
		lAdresseComplete.push(
			this.entreprise.adresse4
				? (0, tag_1.tag)("div", { tabindex: 0 }, this.entreprise.adresse4)
				: "",
		);
		if (this.entreprise.codePostal || this.entreprise.ville) {
			lAdresseComplete.push(
				(0, tag_1.tag)(
					"div",
					{ tabindex: 0 },
					(this.entreprise.codePostal ? this.entreprise.codePostal : "") +
						" " +
						(this.entreprise.ville ? this.entreprise.ville : ""),
				),
			);
		}
		H.push(
			(0, tag_1.tag)(
				"div",
				{ class: "header-detail" },
				(0, tag_1.tag)(
					"div",
					{ class: "conteneur-nom p-top-l", tabindex: 0 },
					(0, tag_1.tag)("i", {
						class: this.entreprise.estSiegeSocial
							? "icon_building"
							: "icon_entreprise",
					}),
					(0, tag_1.tag)(
						"div",
						(0, tag_1.tag)(
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
						!!this.entreprise.nomCommercial
							? (0, tag_1.tag)("div", this.entreprise.nomCommercial)
							: "",
					),
				),
				(0, tag_1.tag)(
					"div",
					{ class: "adresse-wrapper" },
					(0, tag_1.tag)(
						"div",
						{ class: "conteneur-adresse" },
						lAdresseComplete.join(""),
					),
					(0, tag_1.tag)("div", { tabindex: 0 }, lStrActivite),
					!!this.entreprise.siret
						? (0, tag_1.tag)(
								"div",
								{ tabindex: 0 },
								ObjetTraduction_1.GTraductions.getValeur(
									"OffreStage.titre.NumeroSiret",
								) +
									" : " +
									this.entreprise.siret,
							)
						: "",
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
			H.push(
				(0, tag_1.tag)(
					"div",
					{ class: "conteneur-numeros" },
					!!this.entreprise.numeroMobile
						? (0, tag_1.tag)(
								"div",
								{
									class: "lien-communication tel-mobile",
									title: ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.TelPortable",
									),
								},
								(0, tag_1.tag)(
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
							)
						: "",
					!!this.entreprise.numeroFixe
						? (0, tag_1.tag)(
								"div",
								{
									class: "lien-communication tel",
									title:
										ObjetTraduction_1.GTraductions.getValeur(
											"FicheStage.TelFixe",
										),
								},
								(0, tag_1.tag)(
									"a",
									{
										href:
											"tel:" +
											ObjetChaine_1.GChaine.formatTelephoneAvecIndicatif(
												this.entreprise.indFixe,
												this.entreprise.numeroFixe,
											),
									},
									ObjetChaine_1.GChaine.formatTelephone(
										this.entreprise.numeroFixe,
									),
								),
							)
						: "",
					!!this.entreprise.numeroFax
						? (0, tag_1.tag)(
								"div",
								{
									class: "lien-communication",
									title:
										ObjetTraduction_1.GTraductions.getValeur("FicheStage.Fax"),
								},
								(0, tag_1.tag)(
									"a",
									{
										href:
											"fax:" +
											ObjetChaine_1.GChaine.formatTelephoneAvecIndicatif(
												this.entreprise.indFax,
												this.entreprise.numeroFax,
											),
									},
									ObjetChaine_1.GChaine.formatTelephone(
										this.entreprise.numeroFax,
									),
								),
							)
						: "",
					!!this.entreprise.email
						? (0, tag_1.tag)(
								"div",
								{ class: "lien-communication" },
								(0, tag_1.tag)(
									"a",
									{ href: "mailto:" + this.entreprise.email, target: "_blank" },
									this.entreprise.email,
								),
							)
						: "",
					!!this.entreprise.siteInternet
						? (0, tag_1.tag)(
								"div",
								{ class: "lien-communication" },
								(0, tag_1.tag)(
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
							)
						: "",
				),
			);
		}
		if (!!this.entreprise.commentairePublie) {
			H.push(
				(0, tag_1.tag)(
					"div",
					{ class: "conteneur-bloc" },
					(0, tag_1.tag)(
						"div",
						{ class: "Gras ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.commentairePublieFamille",
						),
					),
					(0, tag_1.tag)(
						"div",
						{ class: "conteneur-texte" },
						this.entreprise.commentairePublie,
					),
				),
			);
		}
		if (!!this.entreprise.commentaireInterne) {
			H.push(
				(0, tag_1.tag)(
					"div",
					{ class: "conteneur-bloc" },
					(0, tag_1.tag)(
						"div",
						{ class: "Gras ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.commentaireInterne",
						),
					),
					(0, tag_1.tag)(
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
					(0, tag_1.tag)(
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
					(0, tag_1.tag)(
						"h2",
						{ class: "ie-titre-couleur", tabindex: 0 },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.offres",
						).ucfirst() +
							" (" +
							nbOffresStages +
							")",
					),
				);
			}
			for (let i = 0; i < nbOffresStages; i++) {
				H.push(
					(0, tag_1.tag)(
						"div",
						{ class: i > 0 ? "conteneur-detailsOffre" : "", tabindex: 0 },
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
		const H = [];
		const lPourvue = aOffreStage.nbPourvus === aOffreStage.nbPropose;
		H.push(
			(0, tag_1.tag)(
				"div",
				{ class: "header-conteneur p-y" },
				(0, tag_1.tag)(
					"h2",
					{
						class: lPourvue ? "titre-pourvue" : "ie-titre-couleur",
						tabindex: 0,
					},
					aOffreStage.sujet.getLibelle(),
				),
				(0, tag_1.tag)(
					"div",
					(0, tag_1.tag)(
						"ie-chips",
						{ class: "tag-style" + (!lPourvue ? " color-theme" : "") },
						lPourvue
							? ObjetTraduction_1.GTraductions.getValeur("OffreStage.pourvue")
							: ObjetTraduction_1.GTraductions.getValeur(
									"OffreStage.nonPourvue",
								),
					),
				),
			),
		);
		H.push(
			(0, tag_1.tag)(
				"div",
				{ class: "conteneur-bloc" },
				(0, tag_1.tag)(
					"h3",
					{ class: "Gras ie-titre-petit", tabindex: 0 },
					ObjetTraduction_1.GTraductions.getValeur("OffreStage.SujetDetaille") +
						" :",
				),
				!!aOffreStage.sujetDetaille
					? (0, tag_1.tag)(
							"div",
							{ class: "conteneur-texte", tabindex: 0 },
							aOffreStage.sujetDetaille,
						)
					: "",
			),
		);
		if (this.options.avecPeriode) {
			let lLibelle;
			if (this.options.avecPeriodeUnique) {
				lLibelle =
					UtilitaireStage_1.UtilitaireStage.composeLibelleDatePeriodeEntreLe(
						aOffreStage.periode,
					);
			} else if (!!aOffreStage.periodes && aOffreStage.periodes.count()) {
				lLibelle = (0, tag_1.tag)(
					"ie-bouton",
					{
						class: "small-bt themeBoutonSecondaire m-left",
						"ie-model": "btnCalendrier('" + aOffreStage.getNumero() + "')",
					},
					ObjetTraduction_1.GTraductions.getValeur("OffreStage.voirCalendrier"),
				);
			}
			H.push(
				(0, tag_1.tag)(
					"div",
					{ class: "conteneur-bloc" },
					(0, tag_1.tag)(
						"h3",
						{ class: "Gras ie-titre-petit", tabindex: 0 },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.dureeEtPeriode",
						) + " :",
					),
					(0, tag_1.tag)(
						"div",
						{ class: "conteneur-texte", tabindex: 0 },
						aOffreStage.duree +
							" " +
							(!!lLibelle
								? lLibelle
								: "(" +
									ObjetTraduction_1.GTraductions.getValeur(
										"OffreStage.aucunePeriodeImposee",
									) +
									")"),
					),
				),
			);
		}
		if (aOffreStage.commentaire) {
			H.push(
				(0, tag_1.tag)(
					"div",
					{ class: "conteneur-bloc" },
					(0, tag_1.tag)(
						"h3",
						{ class: "Gras ie-titre-petit", tabindex: 0 },
						ObjetTraduction_1.GTraductions.getValeur("OffreStage.Commentaire") +
							" :",
					),
					(0, tag_1.tag)(
						"div",
						{ class: "conteneur-texte", tabindex: 0 },
						aOffreStage.commentaire,
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
					(0, tag_1.tag)(
						"div",
						{ class: "chips-pj Inline" },
						ObjetChaine_1.GChaine.composerUrlLienExterne({
							documentJoint: aOffreStage.piecesjointes.get(i),
							maxWidth: 250,
						}),
					),
				);
			}
			H.push("</div>");
		}
		return H.join("");
	}
}
exports.ObjetDetailOffreStage = ObjetDetailOffreStage;
