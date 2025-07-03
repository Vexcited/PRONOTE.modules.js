exports.ObjetFenetre_RattachementCDT = void 0;
const DonneesListe_RattachementCDT_1 = require("DonneesListe_RattachementCDT");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_RattachementCDT extends ObjetFenetre_1.ObjetFenetre {
	construireInstances() {
		this.identListeCDT = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurlisteCDT,
			this.initialiserlisteCDT,
		);
	}
	setDonnees(alisteCDT, aAvecDrag, aOptionsDrag) {
		this.listeCDT = alisteCDT;
		this.avecDrag = aAvecDrag;
		this.optionsDrag = $.extend(
			{ callbackDragStart: null, callbackDragStop: null },
			aOptionsDrag,
		);
		this.actualiser();
		this.afficher();
		this.setBoutonActif(1, false);
		if (this.avecDrag) {
			this.setBoutonVisible(1, false);
		}
		this._actualiserListe();
	}
	composeContenu() {
		const T = [];
		let lHeightListe = this.optionsFenetre.hauteur - 23 - 30 - 5;
		if (this.avecDrag) {
			lHeightListe = lHeightListe - 32;
			T.push(
				'<div class="Texte10" style="height: 32px;">',
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.Rattachement.DragDrop",
				),
				"</div>",
			);
		} else {
			lHeightListe = lHeightListe - 18;
			T.push(
				'<div class="Texte10" style="height: 18px;">',
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.Rattachement.Selection",
				),
				"</div>",
			);
		}
		T.push(
			'<div id="' +
				this.getNomInstance(this.identListeCDT) +
				'" style="width: 100%; height: ',
			lHeightListe,
			'px;"></div>',
		);
		return T.join("");
	}
	composeBas() {
		const lModelBtnSupprimer = () => {
			return {
				event: () => {
					this.evenementSurBoutonSupprimer();
				},
				getDisabled: () => {
					return !this.selectionCourante;
				},
			};
		};
		return IE.jsx.str(
			"ie-bouton",
			{ "ie-model": lModelBtnSupprimer },
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.Rattachement.SupprimerCDTSelect",
			),
		);
	}
	initialiserlisteCDT(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_RattachementCDT_1.DonneesListe_RattachementCDT.colonnes
				.Classe,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.Rattachement.ClasseGroupe",
			),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_RattachementCDT_1.DonneesListe_RattachementCDT.colonnes
				.Titre,
			titre: ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.titre"),
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_RattachementCDT_1.DonneesListe_RattachementCDT.colonnes
				.Categorie,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.categorie",
			),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_RattachementCDT_1.DonneesListe_RattachementCDT.colonnes
				.NbrTAF,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.Rattachement.Travail",
			),
			taille: 40,
		});
		lColonnes.push({
			id: DonneesListe_RattachementCDT_1.DonneesListe_RattachementCDT.colonnes
				.Date,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.Rattachement.AncienCours",
			),
			taille: 100,
		});
		aInstance.setOptionsListe({ colonnes: lColonnes });
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton < 2) {
			this.fermer();
		}
		this.callback.appel(aGenreBouton, this.selectionCourante);
	}
	evenementSurBoutonSupprimer() {
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.ConfirmerSuppressionCDT",
			),
			callback: this._apresConfirmationSuppressionCDT.bind(this),
		});
	}
	_apresConfirmationSuppressionCDT(aGenreBouton) {
		if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
			this.selectionCourante.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			this.getInstance(this.identListeCDT).actualiser();
		}
	}
	evenementSurlisteCDT(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.selectionCourante = aParametres.article;
				if (!this.avecDrag) {
					this.setBoutonActif(1, true);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				this.setBoutonActif(1, false);
				this.setEtatSaisie(false);
				break;
		}
	}
	_actualiserListe() {
		this.getInstance(this.identListeCDT).setDonnees(
			new DonneesListe_RattachementCDT_1.DonneesListe_RattachementCDT(
				this.listeCDT,
				this.avecDrag,
				this,
				this._evenementSurMenuContextuelListe.bind(this),
				this.optionsDrag,
			),
		);
	}
	_evenementSurMenuContextuelListe(aLigne) {
		switch (aLigne.getGenre()) {
			case 1:
				this.surValidation(2);
				break;
			default:
				break;
		}
	}
}
exports.ObjetFenetre_RattachementCDT = ObjetFenetre_RattachementCDT;
