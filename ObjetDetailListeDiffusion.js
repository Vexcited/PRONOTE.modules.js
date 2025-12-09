exports.ObjetDetailListeDiffusion = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Event_1 = require("Enumere_Event");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetMenuCtxMixte_1 = require("ObjetMenuCtxMixte");
const Enumere_MenuCtxModeMixte_1 = require("Enumere_MenuCtxModeMixte");
const DonneesListe_Diffusion_1 = require("DonneesListe_Diffusion");
const ObjetListe_1 = require("ObjetListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const AccessApp_1 = require("AccessApp");
class ObjetDetailListeDiffusion extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idMessage = this.Nom + "_mess_vide";
		this.initParametres();
		if (this.avecEventResizeNavigateur()) {
			this.ajouterEvenementGlobal(
				Enumere_Event_1.EEvent.SurPostResize,
				this.surPostResize,
			);
		}
	}
	surPreResize() {
		if (!this.diffusion) {
			return;
		}
		this.preActualisation();
	}
	surPostResize() {
		this.actualiserAffichage();
	}
	initParametres() {
		this._parametres = {
			nonEditable: false,
			genresRessources: [
				Enumere_Ressource_1.EGenreRessource.Eleve,
				Enumere_Ressource_1.EGenreRessource.Responsable,
				Enumere_Ressource_1.EGenreRessource.MaitreDeStage,
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
				Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique,
			],
			largeur: 400,
			largeurTitrePlus: 8,
			hauteurLigneTitre: 18,
			hauteurLigneContenu: 15,
			couleurFondListe: GCouleur.blanc,
			couleurFond: null,
			callbackAjoutRessource: null,
			callbackSuppressionRessource: null,
		};
	}
	setParametres(aParametres) {
		$.extend(this._parametres, aParametres);
	}
	setDonnees(aDonnees) {
		this.diffusion = aDonnees;
		this._actualiser(true);
	}
	actualiserAffichage(aAvecActualisationListes) {
		this._actualiser(aAvecActualisationListes);
	}
	preActualisation() {
		ObjetHtml_1.GHtml.setHtml(this.Nom, "&nbsp;", { instance: this });
	}
	construireAffichage() {
		if (!this.diffusion) {
			return IE.jsx.str(
				"div",
				{ id: this.idMessage, class: "message-vide" },
				IE.jsx.str(
					"div",
					{ class: "message" },
					ObjetTraduction_1.GTraductions.getValeur(
						"listeDiffusion.selectionnezListe",
					),
				),
				IE.jsx.str("div", { class: "Image_No_Data", "aria-hidden": "true" }),
			);
		}
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				this.composeDetailListeDiffusion(),
				IE.jsx.str("section", {
					"ie-identite": "getIdentListeIndividus",
					class: "fluid-bloc",
				}),
			),
		);
		return H.join("");
	}
	composeDetailListeDiffusion() {
		const lStrCommande = [];
		if (this.diffusion.estAuteur) {
			lStrCommande.push(
				IE.jsx.str("div", {
					class: "odld_commande",
					"ie-identite": "getCtxMixteBandeauDroite",
				}),
			);
		}
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "odld_sectiondetail" },
				IE.jsx.str(
					"div",
					{ class: "odld_detail" },
					IE.jsx.str(
						"div",
						{ class: "odld_titre" },
						IE.jsx.str(
							"div",
							{ class: "libelle", "ie-ellipsis": true },
							this.diffusion.getLibelle(),
						),
						IE.jsx.str(
							"div",
							{ class: "auteur" },
							this.diffusion.libelleAuteur,
						),
					),
					lStrCommande.join(""),
				),
				IE.jsx.str("div", {
					class: "odld_partage",
					"ie-html": this.jsxGetHtmlInfoPartage.bind(this),
				}),
			),
		);
		return H.join("");
	}
	addCommandesMenuContextuel(aParams) {
		if (aParams.diffusion && aParams.diffusion.estAuteur) {
			if (
				(0, AccessApp_1.getApp)().droits.get(
					ObjetDroitsPN_1.TypeDroits.listeDiffusion.avecPublication,
				)
			) {
				const lTitre = aParams.diffusion.estPublique
					? ObjetTraduction_1.GTraductions.getValeur(
							"listeDiffusion.nepaspartager",
						)
					: ObjetTraduction_1.GTraductions.getValeur("listeDiffusion.partager");
				const lAction = aParams.diffusion.estPublique
					? DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
							.departager
					: DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
							.partager;
				const lIcon = aParams.diffusion.estPublique
					? "icon_retirer_bibliotheque"
					: "icon_sondage_bibliotheque";
				aParams.menu.add(
					lTitre,
					true,
					(aItemMenu) => {
						if (aItemMenu && aItemMenu.data) {
							aItemMenu.data.estPublique = !aItemMenu.data.estPublique;
							aItemMenu.data.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							this.callback.appel(aItemMenu);
						}
					},
					{
						icon: lIcon + " i-small",
						Numero: lAction,
						typeAffEnModeMixte:
							Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
						data: aParams.diffusion,
					},
				);
			}
			aParams.menu.add(
				ObjetTraduction_1.GTraductions.getValeur("listeDiffusion.renommer"),
				true,
				(aItemMenu) => {
					this.callback.appel(aItemMenu);
				},
				{
					icon: "icon_pencil",
					Numero:
						DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
							.renommer,
					typeAffEnModeMixte:
						Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
					data: aParams.diffusion,
				},
			);
			aParams.menu.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"listeDiffusion.ajouterpublic",
				),
				true,
				(aItemMenu) => {
					this.addPublic(aItemMenu);
				},
				{
					icon: "icon_plus_fin",
					Numero:
						DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
							.ajouterpublic,
					typeAffEnModeMixte:
						Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.ellipsis,
					data: aParams.diffusion,
				},
			);
		}
	}
	addPublic(aParams) {
		const lListeRessources = new ObjetListeElements_1.ObjetListeElements();
		let lPos = 0;
		this._parametres.genresRessources.forEach((aGenre) => {
			lPos++;
			const lListeDeGenre = this._getListeParGenre(aGenre);
			const lLibelle = `${this._getLibelleDeGenre(aGenre)} (${lListeDeGenre.getNbrElementsExistes()})`;
			const lElement = new ObjetElement_1.ObjetElement(
				lLibelle,
				null,
				aGenre,
				lPos,
			);
			lListeRessources.addElement(lElement);
		});
		const lDonneesListe = new DonneesListe_RessourcesPourDiffusion(
			lListeRessources,
		);
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				evenement: (aGenreBouton, aSelection) => {
					if (aGenreBouton !== 1) {
						return;
					}
					if (MethodesObjet_1.MethodesObjet.isNumber(aSelection)) {
						const lSelectionRessource = lListeRessources.get(aSelection);
						Object.assign(aParams, {
							genreRessource: lSelectionRessource.getGenre(),
						});
						this.eventAddPublic(aParams);
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						largeur: 340,
						hauteur: null,
						listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
					});
					aInstance.paramsListe = {
						editable: false,
						optionsListe: {
							hauteurAdapteContenu: true,
							hauteurMaxAdapteContenu: Math.min(GNavigateur.ecranH - 200, 600),
							colonnes: [{ taille: "100%" }],
							skin: ObjetListe_1.ObjetListe.skin.flatDesign,
							avecLigneCreation: false,
						},
					};
				},
			},
			{ identConservationCoordonnees: "fenetre_ressource_listediffusion" },
		).setDonnees(lDonneesListe, true);
	}
	eventAddPublic(aParams) {
		this.callback.appel(aParams);
	}
	jsxGetHtmlInfoPartage() {
		if (this && this.diffusion && this.diffusion.estPublique) {
			const lTexte = IE.estMobile
				? ObjetTraduction_1.GTraductions.getValeur(
						"listeDiffusion.hintPartageMobile",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"listeDiffusion.hintpartage",
					);
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("i", {
					class: fonts_css_1.StylesFonts.icon_sondage_bibliotheque,
					role: "presentation",
				}),
				IE.jsx.str("span", { class: "hint_partage" }, lTexte),
			);
		}
		return "";
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getIdentListeIndividus() {
				return {
					class: ObjetListe_1.ObjetListe,
					pere: aInstance,
					init: function (aInstanceListe) {
						aInstanceListe.setOptionsListe({
							colonnes: [{ taille: "100%" }],
							skin: ObjetListe_1.ObjetListe.skin.flatDesign,
							forcerScrollV_mobile: true,
							ariaLabel: () => {
								var _a;
								return (
									((_a = aInstance.diffusion) === null || _a === void 0
										? void 0
										: _a.getLibelle()) || ""
								);
							},
						});
						aInstance.identListeIndividus = aInstanceListe;
					},
					start: function (aInstanceListe) {
						aInstanceListe.setOptionsListe({
							avecLigneCreation:
								aInstance.diffusion && aInstance.diffusion.estAuteur,
							titreCreation: ObjetTraduction_1.GTraductions.getValeur(
								"listeDiffusion.ajouterpublic",
							),
							estBoutonCreationPiedFlottant_mobile: false,
						});
						const lListeIndividusGenre =
							new ObjetListeElements_1.ObjetListeElements();
						let I = 0;
						aInstance._parametres.genresRessources.forEach((aGenre) => {
							const lElement = new ObjetElement_1.ObjetElement(
								aInstance._getLibelleDeGenre(aGenre),
							);
							const lListeIndividus = aInstance._getListeParGenre(aGenre);
							const lElementFils = new ObjetElement_1.ObjetElement();
							lElement.nbrIndividus = lListeIndividus.count();
							lElementFils.listeIndividus = lListeIndividus;
							lElementFils.pere = lElement;
							lElement.estUnDeploiement = lListeIndividus.count() > 0;
							lElement.estDeploye = false;
							lElement.Position = I++;
							lElementFils.Position = I++;
							lListeIndividusGenre.add(lElement);
							lListeIndividusGenre.add(lElementFils);
						});
						aInstanceListe.setDonnees(
							new DonneesListe_ListeIndividusDiffusion(lListeIndividusGenre),
						);
					},
					evenement: function (aParametres) {
						switch (aParametres.genreEvenement) {
							case Enumere_EvenementListe_1.EGenreEvenementListe.Creation: {
								const lItem = new ObjetElement_1.ObjetElement(
									"",
									DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
										.ajouterpublic,
									-1,
								);
								lItem.data = aInstance.diffusion;
								aInstance.addPublic(lItem);
								break;
							}
							default:
								break;
						}
					},
					destroy: function () {
						aInstance.identListeIndividus = null;
					},
				};
			},
			getCtxMixteBandeauDroite: function () {
				return {
					class: ObjetMenuCtxMixte_1.ObjetMenuCtxMixte,
					pere: aInstance,
					init: function (aMenuCtxMixte) {
						aInstance.menuCtxMixteBandeauDroite = aMenuCtxMixte;
						aMenuCtxMixte.setOptions({
							callbackAddCommandes: function (aMenu) {
								aInstance.addCommandesMenuContextuel({
									diffusion: aInstance.diffusion,
									menu: aMenu,
								});
							},
						});
					},
					destroy: function () {
						aInstance.menuCtxMixteBandeauDroite = null;
					},
				};
			},
		});
	}
	_getListes() {
		const lListes = {
			eleve: new ObjetListeElements_1.ObjetListeElements(),
			responsable: new ObjetListeElements_1.ObjetListeElements(),
			maitreDeStage: new ObjetListeElements_1.ObjetListeElements(),
			enseignant: new ObjetListeElements_1.ObjetListeElements(),
			personnel: new ObjetListeElements_1.ObjetListeElements(),
			inspecteur: new ObjetListeElements_1.ObjetListeElements(),
			classe: new ObjetListeElements_1.ObjetListeElements(),
			groupe: new ObjetListeElements_1.ObjetListeElements(),
		};
		if (this.diffusion) {
			this.diffusion.listePublicIndividu.parcourir((aElement) => {
				if (
					aElement.existe() &&
					this._parametres.genresRessources.includes(aElement.getGenre())
				) {
					switch (aElement.getGenre()) {
						case Enumere_Ressource_1.EGenreRessource.Eleve:
							lListes.eleve.addElement(aElement);
							break;
						case Enumere_Ressource_1.EGenreRessource.Responsable:
							lListes.responsable.addElement(aElement);
							break;
						case Enumere_Ressource_1.EGenreRessource.MaitreDeStage:
							lListes.maitreDeStage.addElement(aElement);
							break;
						case Enumere_Ressource_1.EGenreRessource.Enseignant:
							lListes.enseignant.addElement(aElement);
							break;
						case Enumere_Ressource_1.EGenreRessource.Personnel:
							lListes.personnel.addElement(aElement);
							break;
						case Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique:
							lListes.inspecteur.addElement(aElement);
							break;
						default:
							break;
					}
				}
			});
		}
		return lListes;
	}
	_actualiser(aAvecActualisationListes) {
		if (aAvecActualisationListes) {
			this.listes = this._getListes();
		}
		this.afficher();
	}
	_getLibelleDeGenre(aGenre) {
		switch (aGenre) {
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return ObjetTraduction_1.GTraductions.getValeur("actualites.Eleves");
			case Enumere_Ressource_1.EGenreRessource.Responsable:
				return ObjetTraduction_1.GTraductions.getValeur(
					"actualites.Responsables",
				);
			case Enumere_Ressource_1.EGenreRessource.MaitreDeStage:
				return ObjetTraduction_1.GTraductions.getValeur(
					"actualites.MaitresDeStage",
				);
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				return ObjetTraduction_1.GTraductions.getValeur(
					"actualites.Professeurs",
				);
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return ObjetTraduction_1.GTraductions.getValeur(
					"actualites.Personnels",
				);
			case Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique:
				return ObjetTraduction_1.GTraductions.getValeur(
					"actualites.Inspecteurs",
				);
			default:
				break;
		}
		return "";
	}
	_getListeParGenre(aGenre) {
		switch (aGenre) {
			case Enumere_Ressource_1.EGenreRessource.Classe:
				return this.listes.classe;
			case Enumere_Ressource_1.EGenreRessource.Groupe:
				return this.listes.groupe;
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return this.listes.eleve;
			case Enumere_Ressource_1.EGenreRessource.Responsable:
				return this.listes.responsable;
			case Enumere_Ressource_1.EGenreRessource.MaitreDeStage:
				return this.listes.maitreDeStage;
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				return this.listes.enseignant;
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return this.listes.personnel;
			case Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique:
				return this.listes.inspecteur;
			default:
				return;
		}
	}
}
exports.ObjetDetailListeDiffusion = ObjetDetailListeDiffusion;
class DonneesListe_ListeIndividusDiffusion extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListe) {
		super(aListe);
		this.setOptions({
			avecSelection: false,
			avecFusionLignePereFils: true,
			avecBoutonActionLigne: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return !aParams.article.pere
			? aParams.article.getLibelle() +
					' <span class="odld_strNumber">(' +
					aParams.article.nbrIndividus +
					")</span>"
			: "";
	}
	getInfosSuppZonePrincipale(aParams) {
		const H = [];
		if (aParams.article.pere) {
			if (aParams.article.listeIndividus.count()) {
				H.push('<ul class="odld_listePublic browser-default">');
				aParams.article.listeIndividus.parcourir((aIndividu) => {
					H.push("<li>", aIndividu.getLibelle(), "</li>");
				});
				H.push("</ul>");
			}
		}
		return H.join("");
	}
	desactiverIndentationParente() {
		return true;
	}
}
class DonneesListe_RessourcesPourDiffusion extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecBoutonActionLigne: false,
			avecEvnt_SelectionClick: true,
			avecEvnt_SelectionDblClick: true,
		});
	}
}
