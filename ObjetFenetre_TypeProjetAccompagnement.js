exports.ObjetFenetre_TypeProjetAccompagnement = void 0;
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
class ObjetFenetre_TypeProjetAccompagnement extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("Themes"),
			largeur: 400,
			hauteur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecCroixFermeture: false,
		});
		this.donnees = { listeTypesProjet: null, eleve: null };
	}
	construireInstances() {
		this.identListeTypeProjetAcc = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe.bind(this),
			this._initialiserListe,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.index === 1) {
						const lTypeSelectionne = aInstance
							.getInstance(aInstance.identListeTypeProjetAcc)
							.getElementSelection();
						return !lTypeSelectionne;
					}
					return (
						aInstance.optionsFenetre.listeBoutonsInactifs &&
						aInstance.optionsFenetre.listeBoutonsInactifs[
							aBoutonRepeat.element.index
						] === true
					);
				},
			},
		});
	}
	setDonnees(aListeTypesProjet, aParam) {
		this.donnees.listeTypesProjet =
			MethodesObjet_1.MethodesObjet.dupliquer(aListeTypesProjet);
		this.donnees.eleve = aParam.eleve;
		this.afficher();
		this.getInstance(this.identListeTypeProjetAcc).setDonnees(
			new DonneesListe_TypeProjetAccompagnement(this.donnees.listeTypesProjet, {
				surModification: (aArticle) => {
					this.ouvrirFenetreEditionType(aArticle);
				},
				surSuppression: (aArticle) => {
					this.supprimerTypeProjetAccompagnement(aArticle);
				},
			}),
		);
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push(
			IE.jsx.str("div", {
				style: "height:100%",
				id: this.getNomInstance(this.identListeTypeProjetAcc),
			}),
		);
		return lHtml.join("");
	}
	ouvrirFenetreEditionType(aTypeProjet) {
		let lTypeProjetSaisi;
		if (aTypeProjet) {
			lTypeProjetSaisi = MethodesObjet_1.MethodesObjet.dupliquer(aTypeProjet);
		} else {
			lTypeProjetSaisi = new ObjetElement_1.ObjetElement("");
			lTypeProjetSaisi.estSupprimable = true;
			lTypeProjetSaisi.estModifiable = true;
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				evenement(aGenreBouton) {
					if (aGenreBouton === 1 && lTypeProjetSaisi.pourValidation()) {
						const lElementDeListeAvecLibelle =
							this.donnees.listeTypesProjet.getElementParLibelle(
								lTypeProjetSaisi.getLibelle(),
							);
						if (lElementDeListeAvecLibelle) {
							GApplication.getMessage().afficher({
								message: ObjetTraduction_1.GTraductions.getValeur(
									"FicheEleve.msgTypeProjetExiste",
								),
							});
						} else {
							if (aTypeProjet) {
								const lIndiceTypeExistant =
									this.donnees.listeTypesProjet.getIndiceParElement(
										aTypeProjet,
									);
								if (lIndiceTypeExistant > -1) {
									this.donnees.listeTypesProjet.remove(lIndiceTypeExistant);
								}
							}
							this.donnees.listeTypesProjet.add(lTypeProjetSaisi);
							this.getInstance(this.identListeTypeProjetAcc).actualiser(true);
						}
					}
				},
				initialiser(aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"FicheEleve.typeDeProjet",
						),
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
					return lTypeProjetSaisi.getLibelle();
				},
				setValue(aValue) {
					lTypeProjetSaisi.setLibelle(aValue);
					lTypeProjetSaisi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				},
			},
		});
		const lHtml =
			'<input ie-model="inputLibelle" type="text"  style="width:100%;" title="' +
			ObjetTraduction_1.GTraductions.getValeur("FicheEleve.type") +
			'" />';
		lFenetre.afficher(lHtml);
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			const lTypeSelectionne = this.getInstance(
				this.identListeTypeProjetAcc,
			).getElementSelection();
			if (lTypeSelectionne) {
				this.callback.appel(
					aNumeroBouton,
					lTypeSelectionne,
					this.donnees.listeTypesProjet,
				);
			}
		}
		this.fermer();
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecLigneCreation: true,
		});
	}
	evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.ouvrirFenetreEditionType(aParametres.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this.ouvrirFenetreEditionType(aParametres.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				this.supprimerTypeProjetAccompagnement(aParametres.article);
				break;
		}
	}
	supprimerTypeProjetAccompagnement(aTypeProjet) {
		if (aTypeProjet) {
			aTypeProjet.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			this.getInstance(this.identListeTypeProjetAcc).actualiser(true);
		}
	}
}
exports.ObjetFenetre_TypeProjetAccompagnement =
	ObjetFenetre_TypeProjetAccompagnement;
class DonneesListe_TypeProjetAccompagnement extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aCallbacks) {
		super(aDonnees);
		this.callbacks = aCallbacks;
		this.setOptions({
			avecEvnt_Creation: true,
			avecEvnt_Selection: true,
			flatDesignMinimal: true,
		});
	}
	estLigneOff(aParams) {
		return !aParams.article.Actif;
	}
	avecSelection(aParams) {
		return aParams.article.Actif;
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
			aParametres.article.estSupprimable,
			() => {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.msgConfirmerSupprTypeProjet",
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
