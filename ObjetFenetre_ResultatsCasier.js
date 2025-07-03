exports.DonneesListe_Criteres = exports.ObjetFenetre_ResultatsCasier = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetRequeteCasierResultats_1 = require("ObjetRequeteCasierResultats");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetTri_1 = require("ObjetTri");
class ObjetFenetre_ResultatsCasier extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.setOptionsFenetre({
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			largeur: 600,
			hauteur: 650,
		});
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe_1.ObjetListe, null, this.initListe);
	}
	async setDonnees(aParams) {
		this.donnees = aParams.casier;
		const lResult = this.afficher();
		await this.requeteConsultation();
		return await lResult;
	}
	async requeteConsultation() {
		const lRes =
			await new ObjetRequeteCasierResultats_1.ObjetRequeteCasierResultats(
				this,
			).lancerRequete({ casier: this.donnees });
		this.liste = this.formatDonnees(lRes.listeIndividus);
		this.afficherListe();
	}
	formatDonnees(aListe) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		if (aListe) {
			const lListeCumul = new ObjetListeElements_1.ObjetListeElements();
			const lMapInfosLecture = new Map();
			aListe.parcourir((aIndiv) => {
				var _a;
				const lIndivFD = ObjetElement_1.ObjetElement.create(
					Object.assign(Object.assign({}, aIndiv), {
						estUnDeploiement: false,
						estDeploye: true,
					}),
				);
				let lCumul = lListeCumul.getElementParGenre(aIndiv.getGenre());
				if (!lCumul) {
					lCumul = this.getCumul(aIndiv.getGenre());
					lListeCumul.add(lCumul);
				}
				const lInfos =
					(_a = lMapInfosLecture.get(aIndiv.getGenre())) !== null &&
					_a !== void 0
						? _a
						: this.getInfosLectureParDefaut();
				lInfos.nbrTotal += 1;
				if (aIndiv.estLu) {
					lInfos.nbrLu += 1;
				}
				lMapInfosLecture.set(aIndiv.getGenre(), lInfos);
				lIndivFD.pere = lCumul;
				lListe.add(lIndivFD);
			});
			if (lListeCumul.count() > 0) {
				lListeCumul.parcourir((aCumul) => {
					var _a;
					const lInfosLecture =
						(_a = lMapInfosLecture.get(aCumul.getGenre())) !== null &&
						_a !== void 0
							? _a
							: this.getInfosLectureParDefaut();
					lListe.add(Object.assign(aCumul, lInfosLecture));
				});
			}
		}
		return lListe;
	}
	getInfosLectureParDefaut() {
		return { nbrTotal: 0, nbrLu: 0 };
	}
	getLibelleCumul(aGenre) {
		switch (aGenre) {
			case Enumere_Ressource_1.EGenreRessource.Responsable:
				return ObjetTraduction_1.GTraductions.getValeur("Responsables");
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return ObjetTraduction_1.GTraductions.getValeur("Eleves");
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				return ObjetTraduction_1.GTraductions.getValeur("Professeurs");
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return ObjetTraduction_1.GTraductions.getValeur("Personnels");
			case Enumere_Ressource_1.EGenreRessource.MaitreDeStage:
				return TradObjetFenetre_ResultatsCasier.maitresDeStage;
			default:
				return "";
		}
	}
	getCumul(aGenre) {
		return ObjetElement_1.ObjetElement.create(
			Object.assign(
				{
					Libelle: this.getLibelleCumul(aGenre),
					Genre: aGenre,
					estUnDeploiement: true,
					estDeploye: false,
				},
				this.getInfosLectureParDefaut(),
			),
		);
	}
	composeContenu() {
		return IE.jsx.str("div", {
			class: ["full-height"],
			id: this.getNomInstance(this.identListe),
		});
	}
	afficherListe() {
		if (!this.donnees) {
			return;
		}
		const lInstanceListe = this.getInstance(this.identListe);
		this.initListe(lInstanceListe);
		lInstanceListe.setDonnees(new DonneesListe_Criteres(this.liste));
	}
	initListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			messageContenuVide: TradObjetFenetre_ResultatsCasier.aucunDestinataire,
			boutons: [
				{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer },
			],
		});
	}
}
exports.ObjetFenetre_ResultatsCasier = ObjetFenetre_ResultatsCasier;
const isCumul = (aElem) => {
	return aElem.estUnDeploiement;
};
class DonneesListe_Criteres extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListe) {
		super(aListe);
		this.setOptions({
			avecEventDeploiementSurCellule: true,
			avecBoutonActionLigne: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return IE.jsx.str(
			"p",
			null,
			isCumul(aParams.article)
				? aParams.article.getLibelle()
				: aParams.article.identite,
		);
	}
	getInfosSuppZonePrincipale(aParams) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			isCumul(aParams.article)
				? IE.jsx.str(
						"p",
						null,
						IE.jsx.str("span", null, aParams.article.nbrLu),
						"/",
						IE.jsx.str("span", null, aParams.article.nbrTotal),
					)
				: this.getLibelleInfosSupp(aParams.article),
		);
	}
	getLibelleInfosSupp(aArticle) {
		switch (true) {
			case !!aArticle.fonction:
				return IE.jsx.str(
					"p",
					null,
					TradObjetFenetre_ResultatsCasier.fonction,
					" : ",
					aArticle.fonction,
				);
			case !!aArticle.eleves:
				return IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur("Eleve"),
					" : ",
					aArticle.eleves,
				);
			case !!aArticle.classe:
				return IE.jsx.str(
					"p",
					null,
					TradObjetFenetre_ResultatsCasier.classe,
					" : ",
					aArticle.classe,
				);
			default:
				return "";
		}
	}
	getZoneComplementaire(aParams) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			isCumul(aParams.article)
				? IE.jsx.str(
						"p",
						null,
						this.getStrPourcent(
							aParams.article.nbrLu,
							aParams.article.nbrTotal,
						),
					)
				: IE.jsx.str(
						IE.jsx.fragment,
						null,
						aParams.article.estLu &&
							IE.jsx.str("i", {
								class: "icon_ok color-green-foncee",
								"aria-label": TradObjetFenetre_ResultatsCasier.estLu,
								role: "img",
							}),
					),
		);
	}
	getStrPourcent(aLu, aTotal) {
		var _a;
		const lVal =
			(_a = Math.floor((aLu * 100) / aTotal)) !== null && _a !== void 0
				? _a
				: 0;
		return IE.jsx.str(IE.jsx.fragment, null, lVal, " %");
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init("Libelle"),
			]),
		];
	}
}
exports.DonneesListe_Criteres = DonneesListe_Criteres;
const ObjetTraduction_2 = require("ObjetTraduction");
const TradObjetFenetre_ResultatsCasier =
	ObjetTraduction_2.TraductionsModule.getModule(
		"ObjetFenetre_ResultatsCasier",
		{
			fonction: "",
			classe: "",
			maitresDeStage: "",
			estLu: "",
			aucunDestinataire: "",
		},
	);
