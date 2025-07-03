exports.InterfacePageSuiviPluriannuel = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetListeElements_1 = require("ObjetListeElements");
const DonneesListe_SuiviPluriAnnuel_1 = require("DonneesListe_SuiviPluriAnnuel");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const InterfacePage_1 = require("InterfacePage");
const ObjetRequetePageSuiviPluriannuel_1 = require("ObjetRequetePageSuiviPluriannuel");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetStyle_2 = require("ObjetStyle");
const ObjetFicheGraphe_1 = require("ObjetFicheGraphe");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const DonneesListe_SelectAnnees_1 = require("DonneesListe_SelectAnnees");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const ObjetChaine_1 = require("ObjetChaine");
const UtilitaireGenerationPDF_1 = require("UtilitaireGenerationPDF");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const Enumere_DocTelechargement_1 = require("Enumere_DocTelechargement");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_BulletinBIA_1 = require("ObjetFenetre_BulletinBIA");
const ObjetElement_1 = require("ObjetElement");
const AccessApp_1 = require("AccessApp");
class InterfacePageSuiviPluriannuel extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.etatUtilScoEspace = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.listeAnnees = new ObjetListeElements_1.ObjetListeElements();
		this.avecMoyennes = true;
	}
	construireInstances() {
		super.construireInstances();
		if (
			this.etatUtilScoEspace.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Professeur
		) {
			this.identTripleCombo = this.add(
				InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
				this.evenementSurDernierMenuDeroulant,
				initialiserTripleCombo,
			);
		}
		if (
			this.identTripleCombo !== null &&
			this.identTripleCombo !== undefined &&
			this.getInstance(this.identTripleCombo) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		}
		this.identPage = this.add(ObjetListe_1.ObjetListe);
		this.identFicheGraphe = this.add(ObjetFicheGraphe_1.ObjetFicheGraphe);
		this.identFenetreSelectAnnees = this.addFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			this.evenementFenetreSelectAnnees,
			this.initialiserSelectAnnees,
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.identPage;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identTripleCombo);
		this.AddSurZone.push({ separateur: true });
		this.AddSurZone.push({ html: this.getHtmlBoutonBandeauGraphe() });
	}
	evenementSurDernierMenuDeroulant(aLigneClasse, aLignePeriode, aLigneEleve) {
		this.NumeroClasse = aLigneClasse.getNumero();
		this.NumeroEleve = aLigneEleve.getNumero();
		this.libelleEleve = aLigneEleve.getLibelle();
		this.NumeroPeriode = aLignePeriode.getNumero();
		this.GenrePeriode = aLignePeriode.getGenre();
		new ObjetRequetePageSuiviPluriannuel_1.ObjetRequetePageSuiviPluriannuel(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete(this.getNumeroEleve());
	}
	getNumeroEleve() {
		return this.etatUtilScoEspace.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Professeur
			? this.NumeroEleve
			: this.etatUtilScoEspace.getMembre().getNumero();
	}
	getLibelleEleve() {
		return this.etatUtilScoEspace.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Professeur
			? this.libelleEleve
			: this.etatUtilScoEspace.getMembre().getLibelle();
	}
	getTitleBoutonGraphe() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"SuiviPluriannuel.titreGraphe",
			[this.getLibelleEleve()],
		);
	}
	recupererDonnees() {
		if (
			this.etatUtilScoEspace.GenreEspace !==
			Enumere_Espace_1.EGenreEspace.Professeur
		) {
			new ObjetRequetePageSuiviPluriannuel_1.ObjetRequetePageSuiviPluriannuel(
				this,
				this.actionSurRecupererDonnees,
			).lancerRequete(this.getNumeroEleve());
		}
	}
	actionSurRecupererDonnees(aParam) {
		this.afficherBandeau(true);
		this.setGraphe(null);
		if (aParam.message) {
			this.evenementAfficherMessage(aParam.message);
		} else {
			this.listeAnnees = aParam.listeAnnees;
			this._initialiserListe(
				this.getInstance(this.identPage),
				aParam.nombreDAnnees,
				aParam.listeDonnees,
				aParam.afficherMoyenneGenerale,
			);
			const lData =
				new DonneesListe_SuiviPluriAnnuel_1.DonneesListe_SuiviPluriAnnuel({
					listeDonnees: aParam.listeDonnees,
					listeTotal: aParam.listeTotal,
					infosGrapheTotal: aParam.infosGrapheTotal,
					avecMoyennesSaisies: aParam.avecMoyennesSaisies,
				});
			this.getInstance(this.identPage).setDonnees(lData);
			this.actualiserGrapheSuiviPluriAnnuel(aParam);
		}
	}
	initialiserSelectAnnees(aInstance) {
		const lParamsListe = {
			optionsListe: {
				arialabel: ObjetTraduction_1.GTraductions.getValeur(
					"SuiviPluriannuel.choixAnnees",
				),
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			},
		};
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviPluriannuel.choixAnnees",
			),
			largeur: 250,
			hauteur: 250,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			modeActivationBtnValider:
				aInstance.modeActivationBtnValider.auMoinsUnEltSelectionne,
		});
		aInstance.paramsListe = lParamsListe;
	}
	ouvrirFenetreSelectionAnnees() {
		this.getInstance(this.identFenetreSelectAnnees).setDonnees(
			new DonneesListe_SelectAnnees_1.DonneesListe_SelectAnnees_Fd(
				this.listeAnnees,
			),
			false,
		);
	}
	evenementFenetreSelectAnnees(aGenreBouton) {
		if (aGenreBouton === 1) {
			this.actionApresFiltre();
		}
	}
	actionApresFiltre() {
		const lAnnees = this.listeAnnees.getListeElements((aElement) => {
			return !!aElement.cmsActif;
		});
		const lAnneesGraphe = new TypeEnsembleNombre_1.TypeEnsembleNombre();
		lAnneesGraphe.add(lAnnees.getTableauNumeros());
		this.copieAnnees = MethodesObjet_1.MethodesObjet.dupliquer(
			this.listeAnnees,
		);
		new ObjetRequetePageSuiviPluriannuel_1.ObjetRequetePageSuiviPluriannuel(
			this,
			this.actionSurRecupererGraphe,
		).lancerRequete(this.getNumeroEleve(), {
			annees: lAnneesGraphe,
			avecMoyennes: this.avecMoyennes,
		});
	}
	actionSurRecupererGraphe(aParam) {
		if (this.copieAnnees) {
			this.listeAnnees = this.copieAnnees;
		}
		this.actualiserGrapheSuiviPluriAnnuel(aParam);
	}
	actualiserGrapheSuiviPluriAnnuel(aParam) {
		const lAnnees = this.listeAnnees.getListeElements((aElement) => {
			return !!aElement.cmsActif;
		});
		const lGraphe = !!this.avecMoyennes
			? aParam.grapheAvecMoyenne
			: aParam.grapheSansMoyenne;
		const lLabel = ObjetTraduction_1.GTraductions.getValeur(
			"SuiviPluriannuel.labelAnneesGraphe",
			[lAnnees.getNumero(0), lAnnees.get(lAnnees.count() - 1).strFin],
		);
		this.setGraphe(
			{
				image: [lGraphe],
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"SuiviPluriannuel.titreGraphe",
					[this.getLibelleEleve()],
				),
				message: aParam.grapheMessage,
				alt: _construireAltGraph.call(this, aParam),
			},
			{
				filtres: [
					{
						getHtml: () => {
							const lbtnAnnees = () => {
								return {
									event: () => {
										this.ouvrirFenetreSelectionAnnees();
									},
								};
							};
							return IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str(
									"span",
									{ class: "EspaceDroit" },
									ObjetChaine_1.GChaine.insecable(lLabel),
								),
								IE.jsx.str(
									"ie-bouton",
									{
										"ie-model": lbtnAnnees,
										class: "Texte9",
										"ie-tooltiplabel": lLabel,
									},
									"...",
								),
							);
						},
					},
					{
						getHtml: () => {
							const lcbMoyennes = () => {
								return {
									getValue: () => {
										return !!this.avecMoyennes;
									},
									setValue: (aValue) => {
										this.avecMoyennes = aValue;
										this.actualiserGrapheSuiviPluriAnnuel(aParam);
									},
								};
							};
							return IE.jsx.str(
								"ie-checkbox",
								{ "ie-model": lcbMoyennes, class: "NoWrap" },
								ObjetChaine_1.GChaine.insecable(
									ObjetTraduction_1.GTraductions.getValeur(
										"SuiviPluriannuel.avecMoyennes",
									),
								),
							);
						},
					},
				],
			},
		);
		this.actualiserFicheGraphe();
	}
	_initialiserListe(aListe, aNombreAnnees, aListeDonnees, aAfficherMoyenne) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_SuiviPluriAnnuel_1.DonneesListe_SuiviPluriAnnuel.colonnes
				.matiere,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviPluriannuel.matiere",
			),
			taille: 200,
		});
		for (let i = 0; i < aNombreAnnees; i++) {
			lColonnes.push({
				id:
					DonneesListe_SuiviPluriAnnuel_1.DonneesListe_SuiviPluriAnnuel.colonnes
						.annee + i,
				titre: { getLibelleHtml: () => this._getTitreAnnee(aListeDonnees, i) },
				taille: 100,
			});
		}
		lColonnes.push({
			id: DonneesListe_SuiviPluriAnnuel_1.DonneesListe_SuiviPluriAnnuel.colonnes
				.graphe,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviPluriannuel.graphique",
			),
			taille: 50 + 20 * aNombreAnnees,
		});
		{
			aListe.setOptionsListe({
				colonnes: lColonnes,
				hauteurAdapteContenu: true,
				avecLigneTotal: aAfficherMoyenne,
				ariaLabel: () => {
					var _a, _b;
					return `${this.etatUtilScoEspace.getLibelleLongOnglet()} ${this.existeInstance(this.identTripleCombo) ? ((_a = this.etatUtilScoEspace.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Classe)) === null || _a === void 0 ? void 0 : _a.getLibelle()) || "" : ""} ${this.existeInstance(this.identTripleCombo) ? ((_b = this.etatUtilScoEspace.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Eleve)) === null || _b === void 0 ? void 0 : _b.getLibelle()) || "" : ""}`.trim();
				},
			});
		}
	}
	jsxEventValidationAnnee(aAnnee) {
		const lLargeur = 500;
		const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_BulletinBIA_1.ObjetFenetre_BulletinBIA,
			{ pere: this },
			{
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"SuiviPluriannuel.bulletins",
				),
				largeur: lLargeur,
				hauteur: 450,
			},
		);
		const lListeDocs = new ObjetListeElements_1.ObjetListeElements();
		aAnnee.listeBulletins.parcourir((aBulletin) => {
			const lElement = new ObjetElement_1.ObjetElement();
			lElement.typeDocument =
				Enumere_DocTelechargement_1.EGenreDocTelechargement.bulletinBIA;
			lElement.bulletin = aBulletin;
			lElement.annee = aBulletin.annee;
			lElement.event = function () {
				UtilitaireGenerationPDF_1.GenerationPDF.genererPDF({
					paramPDF: {
						genreGenerationPDF:
							TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.BulletinBIA,
						nomFichier: aBulletin.nomFichier,
						ident: aBulletin.ident,
					},
				});
			};
			lListeDocs.addElement(lElement);
		});
		lInstance.setDonnees({
			listeDocs: lListeDocs,
			avecNotes: true,
			avecCompetences: true,
			avecCertificat: false,
		});
		lInstance.afficher();
	}
	_getTitreAnnee(aListeDonnees, aIndice) {
		const lDonnees = aListeDonnees.get(0)["annee" + aIndice];
		const lHtml = [];
		lHtml.push(
			'<div class="flex-contain cols justify-center p-y-l" style="',
			ObjetStyle_2.GStyle.composeCouleurBordure(
				GCouleur.bordure,
				1,
				ObjetStyle_1.EGenreBordure.bas,
			),
			'">',
		);
		lHtml.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain flex-center justify-center" },
				IE.jsx.str("div", {
					class: "fix-bloc i-small m-right",
					style: ObjetStyle_2.GStyle.composeCouleurFond(lDonnees.couleur),
				}),
				IE.jsx.str("div", { class: "regular" }, lDonnees.strAnnee),
			),
		);
		if (lDonnees.avecBulletins) {
			lHtml.push(
				IE.jsx.str(
					"div",
					{
						class: "AvecMain m-top",
						"ie-eventvalidation": this.jsxEventValidationAnnee.bind(
							this,
							lDonnees,
						),
						role: "button",
						tabindex: "0",
						"aria-haspopup": "dialog",
					},
					IE.jsx.str("div", { class: "InlineBlock Image_BtnPDF" }),
					IE.jsx.str(
						"div",
						{ class: "InlineBlock AlignementHaut PetitEspaceHaut" },
						ObjetTraduction_1.GTraductions.getValeur(
							"SuiviPluriannuel.bulletins",
						),
					),
				),
			);
		}
		lHtml.push("</div>");
		lHtml.push(
			IE.jsx.str("div", { class: "PetitEspace" }, lDonnees.strClasses),
		);
		return lHtml.join("");
	}
}
exports.InterfacePageSuiviPluriannuel = InterfacePageSuiviPluriannuel;
function initialiserTripleCombo(aInstance) {
	aInstance.setParametres([
		Enumere_Ressource_1.EGenreRessource.Classe,
		Enumere_Ressource_1.EGenreRessource.Eleve,
	]);
}
function _construireAltGraph(aParam) {
	const H = [];
	if (aParam.listeDonnees && aParam.listeDonnees.count()) {
		if (aParam.listeAnnees.count() > 1) {
			const lAnnees = [];
			aParam.listeAnnees.parcourir((aAnnee) => {
				lAnnees.push(aAnnee.getLibelle());
			});
			H.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"SuiviPluriannuel.altGraph.annees",
					[lAnnees.join(", ")],
				),
			);
		} else {
			H.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"SuiviPluriannuel.altGraph.annee",
					[aParam.listeAnnees.getPremierElement().getLibelle()],
				),
			);
		}
		aParam.listeDonnees.parcourir((aService) => {
			if (aService.infosGraphe && aService.infosGraphe.length) {
				H.push(aService.matiere);
				aService.infosGraphe.forEach((aInfo) => {
					if (aInfo.moyenne && aInfo.moyenne.estUneValeur()) {
						H.push(
							_getStrNote(aInfo.moyenne) + "/" + _getStrNote(aInfo.bareme),
						);
					} else {
						H.push(
							ObjetTraduction_1.GTraductions.getValeur(
								"SuiviPluriannuel.altGraph.pasDeNote",
							),
						);
					}
				});
				H.push(";");
			}
		});
	}
	return H.join(" ");
}
function _getStrNote(aNote) {
	return aNote !== null && aNote !== false && aNote !== undefined
		? aNote.getNote !== null && aNote.getNote !== undefined
			? aNote.getNote()
			: aNote + ""
		: "";
}
