exports.ObjetFenetre_Criteres = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ChoixDestinatairesParCriteres_1 = require("ChoixDestinatairesParCriteres");
const ObjetRequeteDestinatairesParCriteres_1 = require("ObjetRequeteDestinatairesParCriteres");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetTri_1 = require("ObjetTri");
const DonneesListe_Criteres_1 = require("DonneesListe_Criteres");
const MethodesObjet_1 = require("MethodesObjet");
class ObjetFenetre_Criteres extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.setOptionsFenetre({
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			largeur: 600,
			hauteur: 650,
			addParametresValidation: this.addParametresValidation.bind(this),
		});
		this.optionsFenetreCriteres = { uniquementClasseEnseignee: false };
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe_1.ObjetListe, null, this.initListe);
	}
	async setDonnees(aParams) {
		this.genreCritere = aParams.genreCritere;
		this.genreIndivAssocieAuCritere = aParams.genreIndivAssocieAuCritere;
		this.genreRessource = aParams.genreRessource;
		this.listeRessourceSelectionnee = aParams.listeRessourceSelectionnee
			? MethodesObjet_1.MethodesObjet.dupliquer(
					aParams.listeRessourceSelectionnee,
				)
			: new ObjetListeElements_1.ObjetListeElements();
		const lResult = this.afficher();
		await this.requeteConsultation();
		return await lResult;
	}
	setOptionsFenetreCriteres(aOptionsDepot) {
		Object.assign(this.optionsFenetreCriteres, aOptionsDepot);
		return this;
	}
	async requeteConsultation() {
		switch (this.genreCritere) {
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_AppartenanceClasse: {
				const lListeClasses = this.etatUtilisateurSco.getListeClasses({
					avecClasse: true,
					uniquementClasseEnseignee:
						this.optionsFenetreCriteres.uniquementClasseEnseignee,
				});
				this.donnees = this.formatDonneesPourAffichage(lListeClasses);
				this.afficherListe();
				break;
			}
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_LienFamille:
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_Regime:
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_AutorisationDeSortie:
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_NiveauResponsabilite:
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_ProjetAccompagnement: {
				const lRes =
					await new ObjetRequeteDestinatairesParCriteres_1.ObjetRequeteDestinatairesParCriteres(
						this,
					).lancerRequete({
						criteres: [this.genreCritere],
						genreIndivAssocieAuCritere: this.genreIndivAssocieAuCritere,
						genreRessource: this.genreRessource,
						genreRequete:
							ChoixDestinatairesParCriteres_1
								.TypeGenreRequeteDestinataireParCriteres.TGR_InfosCriteres,
					});
				const lListe = this.getListeRequete(lRes);
				if (lListe) {
					this.donnees = this.formatDonneesPourAffichage(lListe);
					this.afficherListe();
				}
				break;
			}
		}
	}
	getListeRequete(aJSON) {
		switch (this.genreCritere) {
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_LienFamille:
				return aJSON.listeFamilles;
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_Regime:
				return aJSON.listeRegimes;
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_AutorisationDeSortie:
				return aJSON.listeAutorisationsSortie;
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_ProjetAccompagnement:
				return aJSON.listeProjetsAcc;
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_NiveauResponsabilite:
				return aJSON.listeNiveauxResponsabilite;
		}
	}
	formatDonneesPourAffichage(aListe) {
		const lListeFormat = new ObjetListeElements_1.ObjetListeElements();
		const lListeNiveaux = new ObjetListeElements_1.ObjetListeElements();
		aListe === null || aListe === void 0
			? void 0
			: aListe.parcourir((aElement) => {
					var _a;
					const lElementFormat = ObjetElement_1.ObjetElement.create({
						Libelle: aElement.Libelle,
						Numero: aElement.Numero,
						Genre: aElement.Genre,
						Position: aElement.Position,
						Actif: aElement.Actif,
						Etat: aElement.Etat,
						estDeploye: true,
						estUnDeploiement: false,
						typeCriteres: this.genreCritere,
						estCoche: !!this.listeRessourceSelectionnee.getElementParNumero(
							aElement.getNumero(),
						),
					});
					switch (this.genreCritere) {
						case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
							.CTMDOC_AppartenanceClasse: {
							const lClasse = aElement;
							if (lClasse.niveau) {
								let lNiveau = lListeNiveaux.getElementParNumero(
									lClasse.niveau.getNumero(),
								);
								if (!lNiveau) {
									lNiveau = ObjetElement_1.ObjetElement.create({
										Libelle: lClasse.niveau.Libelle,
										Numero: lClasse.niveau.Numero,
										Genre: lClasse.niveau.Genre,
										estDeploye: true,
										estUnDeploiement: true,
										typeCriteres: this.genreCritere,
									});
									lListeNiveaux.add(lNiveau);
								}
								lElementFormat.pere = lNiveau;
							}
							break;
						}
						case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
							.CTMDOC_LienFamille: {
							const lFamille = aElement;
							lElementFormat.infos = { estSousFamille: false };
							if (
								((_a =
									lFamille === null || lFamille === void 0
										? void 0
										: lFamille.listeSousFamilles) === null || _a === void 0
									? void 0
									: _a.count()) > 0
							) {
								lElementFormat.estUnDeploiement = true;
								lFamille.listeSousFamilles.parcourir((aSousFamille) => {
									const lElementSousFamilleFormat =
										ObjetElement_1.ObjetElement.create({
											Libelle: aSousFamille.Libelle,
											Numero: aSousFamille.Numero,
											Genre: aSousFamille.Genre,
											estDeploye: true,
											estUnDeploiement: false,
											typeCriteres: this.genreCritere,
											pere: lElementFormat,
											estCoche:
												!!this.listeRessourceSelectionnee.getElementParNumero(
													aSousFamille.getNumero(),
												),
											infos: { estSousFamille: true },
										});
									lListeFormat.add(lElementSousFamilleFormat);
								});
							}
							break;
						}
						case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
							.CTMDOC_Regime: {
							const lRegime = aElement;
							lElementFormat.infos = {
								estRepasSoir: lRegime.estRepasSoir,
								estRepasMidi: lRegime.estRepasMidi,
								estInternat: lRegime.estInternat,
							};
							break;
						}
						case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
							.CTMDOC_AutorisationDeSortie: {
							const lAutorisation = aElement;
							lElementFormat.infos = {
								descriptif: lAutorisation.descriptif,
								listeDetailHoraires: lAutorisation.listeDetailHoraires,
								couleur: lAutorisation.couleur,
								estValeurParDefaut: lAutorisation.estValeurParDefaut,
								code: lAutorisation.code,
							};
							break;
						}
						case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
							.CTMDOC_ProjetAccompagnement: {
							const lProjetAcc = aElement;
							lElementFormat.infos = { code: lProjetAcc.code };
							break;
						}
						case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
							.CTMDOC_NiveauResponsabilite: {
							break;
						}
					}
					lListeFormat.add(lElementFormat);
				});
		if (
			(lListeNiveaux === null || lListeNiveaux === void 0
				? void 0
				: lListeNiveaux.count()) > 0
		) {
			lListeFormat.add(lListeNiveaux);
		}
		const lTris = [
			ObjetTri_1.ObjetTri.init("Position"),
			ObjetTri_1.ObjetTri.init("Libelle"),
		];
		if (ObjetFenetre_Criteres.estCritereAvecDeploiement(this.genreCritere)) {
			lListeFormat.setTri([ObjetTri_1.ObjetTri.initRecursif("pere", lTris)]);
		} else {
			lListeFormat.setTri(lTris);
		}
		lListeFormat.trier();
		return lListeFormat;
	}
	addParametresValidation(aParams) {
		if (aParams.numeroBouton !== 1) {
			return;
		}
		const lListeElementCoche = this.getInstance(
			this.identListe,
		).getListeArticlesCochees();
		const lSelection = new ObjetListeElements_1.ObjetListeElements();
		for (const lElementCoche of lListeElementCoche) {
			if (!lElementCoche.estUnDeploiement) {
				lSelection.add(lElementCoche);
			}
		}
		return { selection: lSelection };
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
		lInstanceListe.setDonnees(
			new DonneesListe_Criteres_1.DonneesListe_Criteres(this.donnees),
		);
	}
	initListe(aInstance) {
		const lListebtn = [
			{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
		];
		if (ObjetFenetre_Criteres.estCritereAvecDeploiement(this.genreCritere)) {
			lListebtn.push({ genre: ObjetListe_1.ObjetListe.typeBouton.deployer });
		}
		aInstance.setOptionsListe({
			avecCBToutCocher: true,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			ariaLabel: this.optionsFenetre.titre,
			boutons: lListebtn,
			messageContenuVide: this.getMessageCtnVide(),
		});
	}
	getMessageCtnVide() {
		switch (this.genreCritere) {
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_LienFamille:
				return ChoixDestinatairesParCriteres_1.TradChoixDestinatairesParCriteres
					.messageCtnRubrique;
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_Regime:
				return ChoixDestinatairesParCriteres_1.TradChoixDestinatairesParCriteres
					.messageCtnRegime;
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_AutorisationDeSortie:
				return ChoixDestinatairesParCriteres_1.TradChoixDestinatairesParCriteres
					.messageCtnAutorisationDeSortie;
			case ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_ProjetAccompagnement:
				return ChoixDestinatairesParCriteres_1.TradChoixDestinatairesParCriteres
					.messageCtnProjetAccompagnement;
			default:
				return "";
		}
	}
}
exports.ObjetFenetre_Criteres = ObjetFenetre_Criteres;
(function (ObjetFenetre_Criteres) {
	ObjetFenetre_Criteres.criteresAvecDeploiement = [
		ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
			.CTMDOC_AppartenanceClasse,
		ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
			.CTMDOC_LienFamille,
	];
	ObjetFenetre_Criteres.estCritereAvecDeploiement = (aCritere) =>
		ObjetFenetre_Criteres.criteresAvecDeploiement.includes(aCritere);
})(
	ObjetFenetre_Criteres ||
		(exports.ObjetFenetre_Criteres = ObjetFenetre_Criteres = {}),
);
