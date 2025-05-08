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
class ObjetFenetre_MotifProjetAccompagnement extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 400,
			hauteur: 500,
			heightMax_mobile: true,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
			avecCroixFermeture: false,
		});
		this.donnees = { listeMotifs: null };
	}
	construireInstances() {
		this.identListeMotifsProjAcc = this.add(
			ObjetListe,
			evenementSurListe.bind(this),
			_initialiserListe,
		);
	}
	setDonnees(aListeMotifs) {
		this.donnees.listeMotifs = MethodesObjet.dupliquer(aListeMotifs);
		this.afficher();
		this.getInstance(this.identListeMotifsProjAcc).setDonnees(
			new DonneesListe_MotifProjetAccompagnement(this.donnees.listeMotifs),
		);
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push(
			'<div style="height:100%" id="',
			this.getNomInstance(this.identListeMotifsProjAcc),
			'"></div>',
		);
		return lHtml.join("");
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			this.callback.appel(aNumeroBouton, this.donnees.listeMotifs);
		}
		this.fermer();
	}
}
function _initialiserListe(aInstance) {
	aInstance.setOptionsListe({
		avecLigneCreation: true,
		skin: ObjetListe.skin.flatDesign,
	});
}
function evenementSurListe(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Creation:
			_ouvrirFenetreEditionMotif.call(this, aParametres.article);
			break;
		case EGenreEvenementListe.Edition:
			_ouvrirFenetreEditionMotif.call(this, aParametres.article);
			break;
		case EGenreEvenementListe.Suppression:
			aParametres.article.setEtat(EGenreEtat.Suppression);
			this.getInstance(this.identListeMotifsProjAcc).actualiser(true);
			break;
	}
}
function _ouvrirFenetreEditionMotif(aMotifProjAcc) {
	let lMotifSaisi;
	if (aMotifProjAcc) {
		lMotifSaisi = MethodesObjet.dupliquer(aMotifProjAcc);
	} else {
		lMotifSaisi = new ObjetElement("");
		lMotifSaisi.estSupprimable = true;
		lMotifSaisi.estModifiable = true;
	}
	const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
		pere: this,
		evenement: function (aGenreBouton) {
			if (aGenreBouton === 1 && lMotifSaisi.pourValidation()) {
				const lElementDeListeAvecLibelle =
					this.donnees.listeMotifs.getElementParLibelle(
						lMotifSaisi.getLibelle(),
					);
				if (lElementDeListeAvecLibelle) {
					GApplication.getMessage().afficher({
						message: GTraductions.getValeur("FicheEleve.msgMotifProjetExiste"),
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
				titre: GTraductions.getValeur("FicheEleve.motifs"),
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
				return lMotifSaisi.getLibelle();
			},
			setValue(aValue) {
				lMotifSaisi.setLibelle(aValue);
				lMotifSaisi.setEtat(EGenreEtat.Modification);
			},
		},
	});
	const lHtml =
		'<input ie-model="inputLibelle" type="text" class="round-style" style="width:100%;" title="' +
		GTraductions.getValeur("FicheEleve.motifs") +
		'" />';
	lFenetre.afficher(lHtml);
}
class DonneesListe_MotifProjetAccompagnement extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
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
		aParams.article.setEtat(EGenreEtat.Modification);
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
			aParametres.article.estSupprimable &&
				aParametres.article.nbReferences === 0 &&
				!aParametres.article.selectionne,
			function () {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Confirmation,
					message: GTraductions.getValeur("FicheEleve.msgConfirmerSupprMotif"),
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
module.exports = { ObjetFenetre_MotifProjetAccompagnement };
