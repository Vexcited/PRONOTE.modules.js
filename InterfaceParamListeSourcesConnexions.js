exports.InterfaceParamListeSourcesConnexions = void 0;
const ObjetInterface_1 = require("ObjetInterface");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequeteSecurisationCompte_1 = require("ObjetRequeteSecurisationCompte");
const TypeSecurisationCompte_1 = require("TypeSecurisationCompte");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetDate_1 = require("ObjetDate");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetParamChoixStrategieSecurisation_1 = require("ObjetParamChoixStrategieSecurisation");
class InterfaceParamListeSourcesConnexions extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
	}
	static avecParametrageVisible(aDonnees) {
		return (
			ObjetParamChoixStrategieSecurisation_1.ObjetParamChoixStrategieSecurisation.avecParametrageVisible(
				aDonnees,
			) &&
			aDonnees.listeSourcesConnexions &&
			aDonnees.mode !==
				TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
					.MGDA_Inactive
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireInstances() {
		this.identListeSources = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementListeSources,
			this.initialiserListeSources,
		);
	}
	initialiserListeSources(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			hauteurAdapteContenu: Infinity,
			messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
				"DoubleAuth.AucunAppareilEnregistre",
			),
		});
	}
	evenementListeSources(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this.ouvrirFenetreDetailSource(aParametres.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression: {
				const lThis = this;
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"DoubleAuth.PrefConfirmerSupprimer",
					),
					callback(aNumeroBouton) {
						if (aNumeroBouton === Enumere_Action_1.EGenreAction.Valider) {
							new ObjetRequeteSecurisationCompte_1.ObjetRequeteSecurisationComptePreference(
								lThis,
							)
								.lancerRequete({
									action:
										TypeSecurisationCompte_1.TypeCommandeSecurisationCompteHttp
											.csch_SupprimerSourceConnexionConnue,
									identifiantSysteme: aParametres.article.identifiantSysteme,
									genreSource: aParametres.article.getGenre(),
								})
								.then(() => {
									lThis.callback.appel({ actualiser: true });
								});
						}
					},
				});
				break;
			}
		}
	}
	ouvrirFenetreDetailSource(aSourceConnexion) {
		const lTitre = IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str("i", {
				class:
					TypeSecurisationCompte_1.TypeGenreSourceConnexionUtil.getIcone(
						aSourceConnexion.getGenre(),
					) + " m-right",
				role: "presentation",
			}),
			aSourceConnexion.getLibelle(),
		);
		const lFenetreMessage = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DetailsAppareil,
			{
				pere: this,
				initialiser(aInstanceFenetre) {
					aInstanceFenetre.setOptionsFenetre({
						titre: lTitre,
						largeur: 600,
						listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
					});
				},
				evenement() {
					if (aSourceConnexion.getLibelle()) {
						new ObjetRequeteSecurisationCompte_1.ObjetRequeteSecurisationComptePreference(
							this,
						)
							.setOptions({ gererMessageErreur: null })
							.lancerRequete({
								action:
									TypeSecurisationCompte_1.TypeCommandeSecurisationCompteHttp
										.csch_RenommerSourceConnexionConnue,
								identifiantSysteme: aSourceConnexion.identifiantSysteme,
								genreSource: aSourceConnexion.getGenre(),
								libelleSaisi: aSourceConnexion.getLibelle(),
							})
							.catch(() => {})
							.then(() => {
								this.callback.appel({ actualiser: true });
							});
					}
				},
			},
		);
		lFenetreMessage.setDonnees(aSourceConnexion);
	}
	setDonnees(aListeSourcesConnexions) {
		this.initialiser();
		this.getInstance(this.identListeSources).setDonnees(
			new DonneesListe_SourcesConnexion(aListeSourcesConnexions),
		);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			"<div>",
			`<div id="${this.getInstance(this.identListeSources).getNom()}"></div>`,
			"</div>",
		);
		H.push(
			"<p>",
			ObjetTraduction_1.GTraductions.getValeur(
				"DoubleAuth.PrefChoisirDEnregistrer",
			),
			"</p>",
		);
		H.push(
			"<p>",
			ObjetTraduction_1.GTraductions.getValeur("DoubleAuth.PersonnesConfiance"),
			"</p>",
		);
		H.push(
			"<p>",
			ObjetTraduction_1.GTraductions.getValeur(
				"DoubleAuth.PrefPensezASupprimer",
			),
			"</p>",
		);
		return H.join("");
	}
}
exports.InterfaceParamListeSourcesConnexions =
	InterfaceParamListeSourcesConnexions;
class DonneesListe_SourcesConnexion extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecSelection: false });
	}
	getIconeGaucheContenuFormate(aParams) {
		return TypeSecurisationCompte_1.TypeGenreSourceConnexionUtil.getIcone(
			aParams.article.getGenre(),
		);
	}
	avecMenuContextuel() {
		return true;
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("DoubleAuth.Details"),
			true,
			function () {
				this.callback.appel({
					article: aParametres.article,
					genreEvenement: Enumere_EvenementListe_1.EGenreEvenementListe.Edition,
				});
			},
			{ icon: "icon_pencil" },
		);
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			true,
			function () {
				this.callback.appel({
					article: aParametres.article,
					genreEvenement:
						Enumere_EvenementListe_1.EGenreEvenementListe.Suppression,
				});
			},
			{ icon: "icon_trash" },
		);
		aParametres.menuContextuel.setDonnees();
	}
}
class ObjetFenetre_DetailsAppareil extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idInputSource = `${this.Nom}_inpSource`;
		this.donnees = { sourceConnexion: null, avecChangement: false };
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			txtNomSourceConnexion: {
				getValue() {
					return aInstance.donnees.sourceConnexion
						? aInstance.donnees.sourceConnexion.getLibelle() || ""
						: "";
				},
				setValue(aValue) {
					if (aInstance.donnees.sourceConnexion) {
						aInstance.donnees.sourceConnexion.setLibelle(aValue);
						aInstance.donnees.avecChangement = true;
					}
				},
			},
			getLibelleSysteme() {
				return aInstance.donnees.sourceConnexion
					? aInstance.donnees.sourceConnexion.libelleSysteme
					: "";
			},
			getStrDateDerniereConnexion() {
				let lStrDate = "";
				if (
					aInstance.donnees.sourceConnexion &&
					aInstance.donnees.sourceConnexion.dateDerniereConnexion
				) {
					lStrDate = ObjetDate_1.GDate.formatDate(
						aInstance.donnees.sourceConnexion.dateDerniereConnexion,
						" %JJ %MMMM %AAAA %hh%sh%mmm%ss",
					);
				}
				return lStrDate;
			},
			getStrGenreConnexion() {
				let lStrGenre = "";
				if (aInstance.donnees.sourceConnexion) {
					switch (aInstance.donnees.sourceConnexion.getGenre()) {
						case TypeSecurisationCompte_1.TypeGenreSourceConnexion
							.GSC_ClientLourd:
							lStrGenre =
								ObjetTraduction_1.GTraductions.getValeur("DoubleAuth.Client");
							break;
						case TypeSecurisationCompte_1.TypeGenreSourceConnexion
							.GSC_ApplicationMobile:
							lStrGenre =
								ObjetTraduction_1.GTraductions.getValeur("DoubleAuth.Mobile");
							break;
						case TypeSecurisationCompte_1.TypeGenreSourceConnexion
							.GSC_Navigateur:
							lStrGenre = ObjetTraduction_1.GTraductions.getValeur(
								"DoubleAuth.Navigateur",
							);
							break;
						default:
					}
				}
				return lStrGenre;
			},
		});
	}
	composeContenu() {
		return IE.jsx.str(
			"ul",
			null,
			IE.jsx.str(
				"li",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					{ for: this.idInputSource },
					ObjetTraduction_1.GTraductions.getValeur(
						"DoubleAuth.PrefListeLibelle",
					),
					" : ",
				),
				IE.jsx.str("input", {
					type: "text",
					id: this.idInputSource,
					"ie-model": "txtNomSourceConnexion",
					class: "round-style",
				}),
			),
			IE.jsx.str(
				"li",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"DoubleAuth.PrefListeAppareil",
					),
					" : ",
				),
				IE.jsx.str("div", { "ie-html": "getLibelleSysteme" }),
			),
			IE.jsx.str(
				"li",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					null,
					ObjetTraduction_1.GTraductions.getValeur("DoubleAuth.PrefListeDate"),
					" : ",
				),
				IE.jsx.str("div", { "ie-html": "getStrDateDerniereConnexion" }),
			),
			IE.jsx.str(
				"li",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					null,
					ObjetTraduction_1.GTraductions.getValeur("DoubleAuth.PrefListeIcone"),
					" : ",
				),
				IE.jsx.str("div", { "ie-html": "getStrGenreConnexion" }),
			),
		);
	}
	surValidation() {
		if (this.donnees.avecChangement) {
			this.callback.appel();
		}
		this.fermer();
	}
	setDonnees(aSourceConnexion) {
		this.donnees.avecChangement = false;
		this.donnees.sourceConnexion = aSourceConnexion;
		this.afficher();
	}
}
