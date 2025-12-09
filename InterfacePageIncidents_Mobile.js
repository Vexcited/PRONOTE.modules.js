exports.InterfacePageIncidents_Mobile = void 0;
const Enumere_TriElement_1 = require("Enumere_TriElement");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const ObjetRequeteIncidents_1 = require("ObjetRequeteIncidents");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_2 = require("ObjetTraduction");
const TypeGenreStatutProtagonisteIncident_1 = require("TypeGenreStatutProtagonisteIncident");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetRequeteSaisieIncidentsVuParAdmin_1 = require("ObjetRequeteSaisieIncidentsVuParAdmin");
const MethodesObjet_1 = require("MethodesObjet");
const TradInterfacePageIncidents_Mobile =
	ObjetTraduction_2.TraductionsModule.getModule(
		"InterfacePageIncidents_Mobile",
		{ titreDuA: "", signalePar: "", uniquNonRA: "", description: "" },
	);
class InterfacePageIncidents_Mobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor() {
		super(...arguments);
		this.uniquementNonRA = true;
	}
	construireInstances() {
		this.identPage = this.add(ObjetListe_1.ObjetListe, null, (aListe) => {
			aListe.setOptionsListe({
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				boutons: [
					{
						getHtml: () =>
							IE.jsx.str(
								"ie-switch",
								{ "ie-model": this.jsxModelCB.bind(this) },
								TradInterfacePageIncidents_Mobile.uniquNonRA,
							),
					},
					{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
				],
				messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.aucunIncident",
				),
			});
		});
	}
	jsxModelCB() {
		return {
			getValue: () => {
				return this.uniquementNonRA;
			},
			setValue: (aValue) => {
				this.uniquementNonRA = aValue;
				this.actualiserListe();
			},
		};
	}
	recupererDonnees() {
		this.recupererDonneesIncidents();
	}
	async recupererDonneesIncidents() {
		const lReponse = await new ObjetRequeteIncidents_1.ObjetRequeteIncidents(
			this,
		).lancerRequete();
		this.incidents = lReponse.incidents
			.setTri([
				ObjetTri_1.ObjetTri.init(
					"dateheure",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			])
			.trier();
		this.actualiserListe();
	}
	actualiserListe() {
		const lListe = this.incidents.getListeElements((aElement) => {
			return !this.uniquementNonRA || !aElement.estRA;
		});
		this.getInstance(this.identPage).setDonnees(
			new DonneesListeIncident(lListe),
		);
	}
}
exports.InterfacePageIncidents_Mobile = InterfacePageIncidents_Mobile;
class DonneesListeIncident extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListe) {
		super(aListe);
		this.setOptions({
			avecBoutonActionLigne: false,
			avecSelection: false,
			avecTri: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return ObjetChaine_1.GChaine.format(
			TradInterfacePageIncidents_Mobile.titreDuA,
			[
				ObjetDate_1.GDate.formatDate(
					aParams.article.dateheure,
					"%JJ/%MM/%AAAA",
				),
				ObjetDate_1.GDate.formatDate(aParams.article.dateheure, "%hh:%mm"),
			],
		);
	}
	getInfosSuppZonePrincipale(aParams) {
		return ObjetChaine_1.GChaine.format(
			TradInterfacePageIncidents_Mobile.signalePar,
			[aParams.article.rapporteur.getLibelle()],
		);
	}
	getZoneMessage(aParams) {
		var _a;
		const lStrProta = this.getStrProtagonistes(
			aParams.article,
			TypeGenreStatutProtagonisteIncident_1.TypeGenreStatutProtagonisteIncident
				.GSP_Auteur,
		);
		const lStrVikos = this.getStrProtagonistes(
			aParams.article,
			TypeGenreStatutProtagonisteIncident_1.TypeGenreStatutProtagonisteIncident
				.GSP_Victime,
		);
		const lStrTemoins = this.getStrProtagonistes(
			aParams.article,
			TypeGenreStatutProtagonisteIncident_1.TypeGenreStatutProtagonisteIncident
				.GSP_Temoin,
		);
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"p",
				{ class: Divers_css_1.StylesDivers.pTop },
				`${ObjetTraduction_1.GTraductions.getValeur("fiche.incident.motifs")} : ${aParams.article.listeMotifs.getTableauLibelles().join(", ")}`,
			),
			IE.jsx.str(
				"p",
				null,
				`${ObjetTraduction_1.GTraductions.getValeur("fiche.incident.gravite")} : ${aParams.article.gravite}`,
			),
			lStrProta
				? IE.jsx.str(
						"p",
						null,
						`${ObjetTraduction_1.GTraductions.getValeur("fiche.incident.auteur")} : ${lStrProta}`,
					)
				: "",
			lStrVikos
				? IE.jsx.str(
						"p",
						null,
						`${ObjetTraduction_1.GTraductions.getValeur("fiche.incident.victime")} : ${lStrVikos}`,
					)
				: "",
			lStrTemoins
				? IE.jsx.str(
						"p",
						null,
						`${ObjetTraduction_1.GTraductions.getValeur("fiche.incident.temoin")} : ${lStrTemoins}`,
					)
				: "",
			(
				(_a = aParams.article.lieu) === null || _a === void 0
					? void 0
					: _a.existeNumero()
			)
				? IE.jsx.str(
						"p",
						null,
						`${ObjetTraduction_1.GTraductions.getValeur("fiche.incident.lieu")} : ${aParams.article.lieu.getLibelle()}`,
					)
				: "",
			aParams.article.getLibelle()
				? IE.jsx.str(
						"p",
						null,
						`${TradInterfacePageIncidents_Mobile.description} : ${aParams.article.getLibelle()}`,
					)
				: "",
			() => {
				const H = [];
				aParams.article.documents.parcourir((aDoc) => {
					H.push(
						IE.jsx.str(
							"li",
							{ class: [Divers_css_1.StylesDivers.browserDefault] },
							ObjetChaine_1.GChaine.composerUrlLienExterne({
								documentJoint: aDoc,
								genreRessource:
									Enumere_Ressource_1.EGenreRessource
										.RelationIncidentFichierExterne,
							}),
						),
					);
				});
				if (H.length > 0) {
					return IE.jsx.str(
						"ul",
						{
							class: [
								Divers_css_1.StylesDivers.pTop,
								Divers_css_1.StylesDivers.flexContain,
								Divers_css_1.StylesDivers.flexWrap,
								Divers_css_1.StylesDivers.flexGap,
							],
						},
						H.join(""),
					);
				}
				return "";
			},
			GEtatUtilisateur.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Mobile_Administrateur
				? IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModeleCBevntVu.bind(this, aParams.article),
							class: Divers_css_1.StylesDivers.mTop,
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"fiche.incident.labelCocheVise",
						),
					)
				: "",
		);
	}
	jsxModeleCBevntVu(aArticle) {
		return {
			getValue() {
				return !!aArticle.estVise;
			},
			setValue: async (aValue) => {
				aArticle.estVise = aValue;
				const lIncident = MethodesObjet_1.MethodesObjet.dupliquer(aArticle);
				lIncident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				await new ObjetRequeteSaisieIncidentsVuParAdmin_1.ObjetRequeteSaisieIncidentsVuParAdmin(
					this,
				).lancerRequete({
					incidents: new ObjetListeElements_1.ObjetListeElements().add(
						lIncident,
					),
				});
			},
		};
	}
	getStrProtagonistes(aArticle, aGenre) {
		const lListeProtagonistes = aArticle.protagonistes.getListeElements(
			(aElement) => {
				return aElement.Genre === aGenre;
			},
		);
		const lListeElts = new ObjetListeElements_1.ObjetListeElements();
		lListeProtagonistes.parcourir((aAuteur) => {
			lListeElts.addElement(aAuteur.protagoniste);
		});
		if (lListeElts.count() > 0) {
			return lListeElts.getTableauLibelles().join(", ");
		} else {
			return "";
		}
	}
}
