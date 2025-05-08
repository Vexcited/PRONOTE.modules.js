const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetElement } = require("ObjetElement.js");
const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
class ObjetFenetre_TypeProjetAccompagnement extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("Themes"),
			largeur: 400,
			hauteur: 500,
			heightMax_mobile: true,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
			avecCroixFermeture: false,
		});
		this.donnees = { listeTypesProjet: null, eleve: null };
	}
	construireInstances() {
		this.identListeTypeProjetAcc = this.add(
			ObjetListe,
			evenementSurListe.bind(this),
			_initialiserListe,
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
		this.donnees.listeTypesProjet = MethodesObjet.dupliquer(aListeTypesProjet);
		this.donnees.eleve = aParam.eleve;
		this.afficher();
		this.getInstance(this.identListeTypeProjetAcc).setDonnees(
			new DonneesListe_TypeProjetAccompagnement(this.donnees.listeTypesProjet),
		);
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push(
			'<div style="height:100%" id="',
			this.getNomInstance(this.identListeTypeProjetAcc),
			'"></div>',
		);
		return lHtml.join("");
	}
	ouvrirFenetreEditionType(aTypeProjet) {
		let lTypeProjetSaisi;
		if (aTypeProjet) {
			lTypeProjetSaisi = MethodesObjet.dupliquer(aTypeProjet);
		} else {
			lTypeProjetSaisi = new ObjetElement("");
			lTypeProjetSaisi.estSupprimable = true;
			lTypeProjetSaisi.estModifiable = true;
		}
		const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
			pere: this,
			evenement(aGenreBouton) {
				if (aGenreBouton === 1 && lTypeProjetSaisi.pourValidation()) {
					const lElementDeListeAvecLibelle =
						this.donnees.listeTypesProjet.getElementParLibelle(
							lTypeProjetSaisi.getLibelle(),
						);
					if (lElementDeListeAvecLibelle) {
						GApplication.getMessage().afficher({
							message: GTraductions.getValeur("FicheEleve.msgTypeProjetExiste"),
						});
					} else {
						if (aTypeProjet) {
							const lIndiceTypeExistant =
								this.donnees.listeTypesProjet.getIndiceParElement(aTypeProjet);
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
					titre: GTraductions.getValeur("FicheEleve.typeDeProjet"),
					largeur: 300,
					listeBoutons: [
						GTraductions.getValeur("Annuler"),
						GTraductions.getValeur("Valider"),
					],
				});
			},
		});
		$.extend(lFenetre.controleur, {
			inputLibelle: {
				getValue() {
					return lTypeProjetSaisi.getLibelle();
				},
				setValue(aValue) {
					lTypeProjetSaisi.setLibelle(aValue);
					lTypeProjetSaisi.setEtat(EGenreEtat.Modification);
				},
			},
		});
		const lHtml =
			'<input ie-model="inputLibelle" type="text" class="round-style" style="width:100%;" title="' +
			GTraductions.getValeur("FicheEleve.type") +
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
}
function _initialiserListe(aInstance) {
	aInstance.setOptionsListe({
		skin: ObjetListe.skin.flatDesign,
		avecLigneCreation: true,
	});
}
function evenementSurListe(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Selection:
			break;
		case EGenreEvenementListe.Creation:
			this.ouvrirFenetreEditionType(aParametres.article);
			break;
		case EGenreEvenementListe.Edition:
			this.ouvrirFenetreEditionType(aParametres.article);
			break;
		case EGenreEvenementListe.Suppression:
			aParametres.article.setEtat(EGenreEtat.Suppression);
			this.getInstance(this.identListeTypeProjetAcc).actualiser(true);
			break;
	}
}
class DonneesListe_TypeProjetAccompagnement extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
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
			GTraductions.getValeur("Modifier"),
			aParametres.article.estModifiable,
			function () {
				this.callback.appel({
					article: aParametres.article,
					genreEvenement: EGenreEvenementListe.Edition,
				});
			},
			{ icon: "icon_pencil" },
		);
		aParametres.menuContextuel.add(
			GTraductions.getValeur("Supprimer"),
			aParametres.article.estSupprimable,
			function () {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Confirmation,
					message: GTraductions.getValeur(
						"FicheEleve.msgConfirmerSupprTypeProjet",
					),
					callback: (aGenreAction) => {
						if (aGenreAction === EGenreAction.Valider) {
							this.callback.appel({
								article: aParametres.article,
								genreEvenement: EGenreEvenementListe.Suppression,
							});
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
			ObjetTri.init((D) => {
				return !!D.getNumero();
			}),
		);
		lTris.push(ObjetTri.init("Libelle"));
		return lTris;
	}
}
module.exports = { ObjetFenetre_TypeProjetAccompagnement };
