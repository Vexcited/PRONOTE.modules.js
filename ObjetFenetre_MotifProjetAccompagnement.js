exports.ObjetFenetre_MotifProjetAccompagnement = void 0;
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetElement_1 = require("ObjetElement");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTri_1 = require("ObjetTri");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
class ObjetFenetre_MotifProjetAccompagnement extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 400,
			hauteur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecCroixFermeture: false,
		});
		this.donnees = { listeMotifs: null };
	}
	construireInstances() {
		this.identListeMotifsProjAcc = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe.bind(this),
			this._initialiserListe,
		);
	}
	setDonnees(aListeMotifs) {
		this.donnees.listeMotifs =
			MethodesObjet_1.MethodesObjet.dupliquer(aListeMotifs);
		this.afficher();
		this.getInstance(this.identListeMotifsProjAcc).setDonnees(
			new DonneesListe_MotifProjetAccompagnement(this.donnees.listeMotifs, {
				surModification: (aArticle) => {
					this._ouvrirFenetreEditionMotif(aArticle);
				},
				surSuppression: (aArticle) => {
					this.supprimerMotifProjetAccompagnement(aArticle);
				},
			}),
		);
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push(
			IE.jsx.str("div", {
				style: "height:100%",
				id: this.getNomInstance(this.identListeMotifsProjAcc),
			}),
		);
		return lHtml.join("");
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			this.callback.appel(aNumeroBouton, this.donnees.listeMotifs);
		}
		this.fermer();
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			avecLigneCreation: true,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
		});
	}
	evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this._ouvrirFenetreEditionMotif(aParametres.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this._ouvrirFenetreEditionMotif(aParametres.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				this.supprimerMotifProjetAccompagnement(aParametres.article);
				break;
		}
	}
	supprimerMotifProjetAccompagnement(aMotifProjetAcc) {
		if (aMotifProjetAcc) {
			aMotifProjetAcc.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			this.getInstance(this.identListeMotifsProjAcc).actualiser(true);
		}
	}
	_ouvrirFenetreEditionMotif(aMotifProjAcc) {
		let lMotifSaisi;
		if (aMotifProjAcc) {
			lMotifSaisi = MethodesObjet_1.MethodesObjet.dupliquer(aMotifProjAcc);
		} else {
			lMotifSaisi = new ObjetElement_1.ObjetElement("");
			lMotifSaisi.estSupprimable = true;
			lMotifSaisi.estModifiable = true;
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				evenement: function (aGenreBouton) {
					if (aGenreBouton === 1 && lMotifSaisi.pourValidation()) {
						const lElementDeListeAvecLibelle =
							this.donnees.listeMotifs.getElementParLibelle(
								lMotifSaisi.getLibelle(),
							);
						if (lElementDeListeAvecLibelle) {
							GApplication.getMessage().afficher({
								message: ObjetTraduction_1.GTraductions.getValeur(
									"FicheEleve.msgMotifProjetExiste",
								),
							});
						} else {
							if (aMotifProjAcc) {
								const lIndiceMotifExistant =
									this.donnees.listeMotifs.getIndiceParElement(aMotifProjAcc);
								if (lIndiceMotifExistant > -1) {
									this.donnees.listeMotifs.remove(lIndiceMotifExistant);
								}
							}
							this.donnees.listeMotifs.add(lMotifSaisi);
							this.getInstance(this.identListeMotifsProjAcc).actualiser(true);
						}
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre:
							ObjetTraduction_1.GTraductions.getValeur("FicheEleve.motifs"),
						largeur: 300,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		);
		$.extend(lFenetre.controleur, {
			inputLibelle: {
				getValue() {
					return lMotifSaisi.getLibelle();
				},
				setValue(aValue) {
					lMotifSaisi.setLibelle(aValue);
					lMotifSaisi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				},
			},
		});
		const lHtml =
			'<input ie-model="inputLibelle" type="text"  style="width:100%;" title="' +
			ObjetTraduction_1.GTraductions.getValeur("FicheEleve.motifs") +
			'" />';
		lFenetre.afficher(lHtml);
	}
}
exports.ObjetFenetre_MotifProjetAccompagnement =
	ObjetFenetre_MotifProjetAccompagnement;
class DonneesListe_MotifProjetAccompagnement extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aCallbacks) {
		super(aDonnees);
		this.callbacks = aCallbacks;
		this.setOptions({
			avecEvnt_Creation: true,
			avecEvnt_Selection: true,
			avecCB: true,
			avecCocheCBSurLigne: true,
			flatDesignMinimal: true,
		});
	}
	getValueCB(aParams) {
		return aParams.article ? aParams.article.selectionne : false;
	}
	setValueCB(aParams, aValue) {
		aParams.article.selectionne = aValue;
		aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Modifier"),
			aParametres.article.estModifiable,
			() => {
				this.callbacks.surModification(aParametres.article);
			},
			{ icon: "icon_pencil" },
		);
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			aParametres.article.estSupprimable &&
				aParametres.article.nbReferences === 0 &&
				!aParametres.article.selectionne,
			() => {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.msgConfirmerSupprMotif",
					),
					callback: (aGenreAction) => {
						if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
							this.callbacks.surSuppression(aParametres.article);
						}
					},
				});
			},
			{ icon: "icon_trash" },
		);
		aParametres.menuContextuel.setDonnees();
	}
	getTri() {
		const lTris = [];
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.getNumero();
			}),
		);
		lTris.push(ObjetTri_1.ObjetTri.init("Libelle"));
		return lTris;
	}
}
