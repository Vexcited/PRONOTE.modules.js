exports.ObjetFenetre_Infirmerie = void 0;
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const GUID_1 = require("GUID");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
class ObjetFenetre_Infirmerie extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.enCreation = false;
		this.listeEleves = new ObjetListeElements_1.ObjetListeElements();
		this.eleve = new ObjetElement_1.ObjetElement();
		this.absence = new ObjetElement_1.ObjetElement();
		this.dateMin = new Date();
		this.dateMax = new Date();
		this.indiceAccompagnateur = 0;
		this.disabled = false;
		this.maxlengthCommentaire = 1000;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			input: {
				getValueInit: function (aDebut) {
					const lDate = aDebut ? aInstance.DateDebut : aInstance.DateFin;
					if (!lDate) {
						return;
					}
					return ObjetDate_1.GDate.formatDate(lDate, "%hh:%mm");
				},
				exitChange(aDebut, aValue, aParamsSetter) {
					if (aParamsSetter.time.ok) {
						aInstance.setDate(
							aDebut,
							aParamsSetter.time.heure,
							aParamsSetter.time.minute,
						);
					}
				},
				getDisabled() {
					return aInstance.disabled;
				},
			},
			avecCommentaire: function () {
				return aInstance.absence
					? aInstance.avecCommentaireAutorise &&
							!aInstance.absence.commentaireEstConfidentiel
					: true;
			},
			commentaire: {
				getValue: function () {
					return aInstance.absence && aInstance.avecCommentaireAutorise
						? aInstance.absence.commentaire
						: "";
				},
				setValue: function (aValue) {
					if (aInstance.avecCommentaireAutorise) {
						aInstance.absence.commentaire = aValue;
					}
				},
				getDisabled() {
					return aInstance.disabled;
				},
			},
			avecEditionPublicationWeb: function () {
				return aInstance.avecEditionPublication === true;
			},
			publicationWeb: {
				getValue: function () {
					return aInstance.absence ? aInstance.absence.estPubliee : false;
				},
				setValue: function (aValue) {
					aInstance.absence.estPubliee = aValue;
				},
				getDisabled() {
					return aInstance.disabled;
				},
			},
		});
	}
	setDonnees(aListeEleves, aParam) {
		this.enCreation = false;
		this.listeEleves = aListeEleves;
		this.eleve = this.listeEleves.getElementParNumero(aParam.numeroEleve);
		this.absence = aParam.absence;
		this.avecCommentaireAutorise = aParam.avecCommentaireAutorise;
		this.dateMin = aParam.borneMin;
		this.dateMax = aParam.borneMax;
		this.indiceAccompagnateur = 0;
		const lavecBoutonSupprimer =
			aParam.avecBoutonSupprimer !== undefined
				? aParam.avecBoutonSupprimer
				: true;
		this.avecEditionPublication = aParam.avecEditionPublication;
		this.disabled =
			aParam.actif === undefined || aParam.actif === null
				? false
				: !aParam.actif;
		let lEleve = this.listeEleves.getElementParNumero(0);
		if (lEleve) {
			lEleve.Visible = true;
		}
		lEleve = this.eleve
			? this.listeEleves.getElementParNumero(this.eleve.getNumero())
			: null;
		if (lEleve) {
			lEleve.Visible = false;
		}
		this.listeEleves.trier();
		this.numerosBouton_supprimer = -99;
		this.numerosBouton_valider = 1;
		let lListeBoutons = [];
		if (!this.disabled) {
			lListeBoutons = [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			];
		} else {
			lListeBoutons = [ObjetTraduction_1.GTraductions.getValeur("Fermer")];
		}
		if (!this.absence) {
			this.enCreation = true;
			this.absence = new ObjetElement_1.ObjetElement(
				null,
				null,
				Enumere_Ressource_1.EGenreRessource.Infirmerie,
			);
			this.absence.PlaceDebut = aParam.placeDebut;
			this.absence.PlaceFin = aParam.placeFin;
			this.absence.DateDebut = ObjetDate_1.GDate.placeAnnuelleEnDate(
				aParam.placeDebut,
			);
			this.absence.DateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(
				aParam.placeFin,
				true,
			);
			this.absence.Accompagnateur = new ObjetElement_1.ObjetElement();
			this.absence.commentaire = "";
			this.absence.AvecInfirmerie = true;
			this.absence.estPubliee =
				aParam.publierParDefautPassageInf !== null &&
				aParam.publierParDefautPassageInf !== undefined
					? aParam.publierParDefautPassageInf
					: false;
			this.absence.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		} else if (lavecBoutonSupprimer && !this.disabled) {
			lListeBoutons = [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			];
			this.numerosBouton_supprimer = 1;
			this.numerosBouton_valider = 2;
		}
		if (this.absence.Accompagnateur.Numero) {
			this.indiceAccompagnateur =
				this.listeEleves.getIndiceExisteParNumeroEtGenre(
					this.absence.Accompagnateur.getNumero(),
				);
		}
		this.DateDebut = this.absence.DateDebut;
		this.DateFin = this.absence.DateFin;
		if ("maxlengthCommentaire" in aParam && aParam.maxlengthCommentaire > 0) {
			this.maxlengthCommentaire = aParam.maxlengthCommentaire;
		}
		this.setOptionsFenetre({ listeBoutons: lListeBoutons });
		this.getInstance(this.IdentComboEleves).setDonnees(
			this.listeEleves,
			this.indiceAccompagnateur,
		);
		this.getInstance(this.IdentComboEleves).setActif(!this.disabled);
		this.afficher();
	}
	surValidation(ANumeroBouton) {
		if (this.surValidationInterne(ANumeroBouton)) {
			this.callback.appel(
				ANumeroBouton,
				this.eleve ? this.eleve.Numero : null,
				this.enCreation ? this.absence : null,
			);
		}
		this.fermer();
	}
	setDate(aEstDebut, aHeures, aMinutes) {
		const lDate = aEstDebut ? this.DateDebut : this.DateFin;
		lDate.setHours(aHeures);
		lDate.setMinutes(aMinutes);
		if (aEstDebut) {
			this.absence.PlaceDebut = ObjetDate_1.GDate.dateEnPlaceAnnuelle(lDate);
			if (lDate > this.DateFin) {
				this.DateFin.setHours(aHeures);
				this.DateFin.setMinutes(aMinutes);
				this.absence.PlaceFin = this.absence.PlaceDebut;
			}
		} else {
			this.absence.PlaceFin = ObjetDate_1.GDate.dateEnPlaceAnnuelle(
				lDate,
				true,
			);
			if (lDate < this.DateDebut) {
				this.DateDebut.setHours(aHeures);
				this.DateDebut.setMinutes(aMinutes);
				this.absence.PlaceDebut = this.absence.PlaceFin;
			}
		}
	}
	surValidationInterne(ANumeroBouton) {
		if (
			(this.enCreation && ANumeroBouton === this.numerosBouton_supprimer) ||
			ANumeroBouton === this.numerosBouton_valider
		) {
			if (this.absence.DateDebut.getTime() >= this.absence.DateFin.getTime()) {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.InfirmerieHeureSortieSuperieurAHeureEntree",
					),
				});
				return false;
			}
			if (
				this.absence.DateDebut.getTime() < this.dateMin.getTime() ||
				this.absence.DateFin.getTime() > this.dateMax.getTime()
			) {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.InfirmerieEnDehorsLimite",
					),
				});
				return false;
			}
		}
		if (!this.enCreation && ANumeroBouton === this.numerosBouton_supprimer) {
			this.absence.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		}
		if (
			ANumeroBouton === this.numerosBouton_valider &&
			this.absence.getEtat() === Enumere_Etat_1.EGenreEtat.Aucun
		) {
			this.absence.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		let lEleve = this.listeEleves.getElementParNumero(0);
		if (lEleve) {
			lEleve.Visible = false;
		}
		lEleve = this.eleve
			? this.listeEleves.getElementParNumero(this.eleve.Numero)
			: null;
		if (lEleve) {
			lEleve.Visible = true;
		}
		this.listeEleves.trier();
		return true;
	}
	construireInstances() {
		this.IdentComboEleves = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurComboEleves,
			this.initialiserComboEleves,
		);
	}
	composeContenu() {
		const T = [];
		T.push(`<div class="flex-contain cols">`);
		const lIdHeureDebut = GUID_1.GUID.getId();
		T.push(
			`<div class="field-contain cols-on-mobile">\n              <label for="${lIdHeureDebut}" class="fix-bloc ie-titre-petit" style="width: 11.5rem;">${ObjetTraduction_1.GTraductions.getValeur("Absence.HeureDepart")} : </label>\n              <input id="${lIdHeureDebut}" type="time" ie-model="input(true)" />\n            </div>`,
		);
		const lIdHeureFin = GUID_1.GUID.getId();
		T.push(
			`<div class="field-contain cols-on-mobile">\n              <label for="${lIdHeureFin}" class="fix-bloc ie-titre-petit" style="width: 11.5rem;">${ObjetTraduction_1.GTraductions.getValeur("Absence.HeureRetour")} : </label>\n              <input id="${lIdHeureFin}" type="time" ie-model="input(false)"  />\n            </div>`,
		);
		T.push(
			`<div class="field-contain cols-on-mobile">\n              <label class="fix-bloc ie-titre-petit" style="width: 11.5rem;">${ObjetTraduction_1.GTraductions.getValeur("Absence.AccompagnePar")} : </label>\n              <div class="on-mobile" id="${this.getNomInstance(this.IdentComboEleves)}"></div>\n           </div>`,
		);
		T.push(`<div class="field-contain f-wrap" ie-display="avecCommentaire">`);
		const lIdCommentaire = GUID_1.GUID.getId();
		T.push(
			`<label for="${lIdCommentaire}" class="ie-titre-petit m-bottom-l" style="width:100%;">${ObjetTraduction_1.GTraductions.getValeur("Absence.Commentaire")} : </label>`,
		);
		T.push(
			`<ie-textareamax class="full-size" style="height:80px;" id="${lIdCommentaire}" ie-compteurmax="${this.maxlengthCommentaire}" maxlength="${this.maxlengthCommentaire}" ie-model="commentaire" placeholder="${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.saisissezUnCommentaire")}"></ie-textareamax>`,
		);
		T.push(`</div>`);
		T.push(
			`<div class="public-team" ie-display="avecEditionPublicationWeb">\n      <span class="icon-contain only-mobile"><i class="icon_info_sondage_publier i-medium i-as-deco" role="presentation"></i></span>\n      <ie-checkbox ie-model="publicationWeb">${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.PublierParents")}</ie-checkbox>\n    </div>`,
		);
		T.push(`</div>`);
		return T.join("");
	}
	initialiserComboEleves(AInstance) {
		AInstance.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.comboEleveAccInfirmerie",
			),
			longueur: 150,
			celluleAvecTexteHtml: true,
		});
	}
	evenementSurComboEleves(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.absence.Accompagnateur.Numero = aParams.element.getNumero();
		}
	}
}
exports.ObjetFenetre_Infirmerie = ObjetFenetre_Infirmerie;
