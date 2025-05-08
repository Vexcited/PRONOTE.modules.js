const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GDate } = require("ObjetDate.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetMoteurInfirmerie {
	constructor(aParent) {
		const lSelf = this;
		$.extend(aParent.controleur, this.getControleur());
		aParent.getMoteur = function () {
			return lSelf;
		};
		this.enCreation = false;
		this.listeEleves = new ObjetListeElements();
		this.eleve = new ObjetElement();
		this.absence = new ObjetElement();
		this.dateMin = new Date();
		this.dateMax = new Date();
		this.indiceAccompagnateur = 0;
		this.disabled = false;
		this.listeBoutons = [];
	}
	init(aParam) {
		this.enCreation = false;
		this.listeEleves = aParam.listeEleves;
		this.eleve = this.listeEleves.getElementParNumero(aParam.numeroEleve);
		this.absence = aParam.absence;
		this.dateMin = aParam.borneMin;
		this.dateMax = aParam.borneMax;
		this.indiceAccompagnateur = 0;
		this.avecBoutonSupprimer =
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
		if (!this.disabled) {
			this.listeBoutons = [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			];
		} else {
			this.listeBoutons = [GTraductions.getValeur("Fermer")];
		}
		if (
			this.absence === null ||
			this.absence === undefined ||
			this.absence === false
		) {
			this.enCreation = true;
			this.absence = new ObjetElement(null, null, EGenreRessource.Infirmerie);
			this.absence.PlaceDebut = aParam.placeDebut;
			this.absence.PlaceFin = aParam.placeFin;
			this.absence.DateDebut = GDate.placeAnnuelleEnDate(aParam.placeDebut);
			this.absence.DateFin = GDate.placeAnnuelleEnDate(aParam.placeFin, true);
			this.absence.Accompagnateur = new ObjetElement();
			this.absence.commentaire = "";
			this.absence.AvecInfirmerie = true;
			this.absence.estPubliee =
				aParam.publierParDefautPassageInf !== null &&
				aParam.publierParDefautPassageInf !== undefined
					? aParam.publierParDefautPassageInf
					: false;
			this.absence.setEtat(EGenreEtat.Creation);
		} else if (this.avecBoutonSupprimer && !this.disabled) {
			this.listeBoutons = [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Supprimer"),
				GTraductions.getValeur("Valider"),
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
	}
	getControleur() {
		return {
			input: {
				getValueInit: function (aDebut) {
					const lDate = aDebut
						? this.instance.getMoteur().DateDebut
						: this.instance.getMoteur().DateFin;
					if (!lDate) {
						return;
					}
					return GDate.formatDate(lDate, "%hh:%mm");
				},
				exitChange(aDebut, aValue, aParamsSetter) {
					if (aParamsSetter.time.ok) {
						this.instance
							.getMoteur()
							.setDate(
								aDebut,
								aParamsSetter.time.heure,
								aParamsSetter.time.minute,
							);
					}
				},
				getDisabled() {
					return this.instance.getMoteur().disabled;
				},
			},
			avecCommentaire: function () {
				return this.instance.getMoteur().absence
					? !this.instance.getMoteur().absence.commentaireEstConfidentiel
					: true;
			},
			commentaire: {
				getValue: function () {
					return this.instance.getMoteur().absence
						? this.instance.getMoteur().absence.commentaire
						: "";
				},
				setValue: function (aValue) {
					this.instance.getMoteur().absence.commentaire = aValue;
				},
				getDisabled() {
					return this.instance.getMoteur().disabled;
				},
			},
			avecEditionPublicationWeb: function () {
				return this.instance.getMoteur().avecEditionPublication === true;
			},
			publicationWeb: {
				getValue: function () {
					return this.instance.getMoteur().absence
						? this.instance.getMoteur().absence.estPubliee
						: false;
				},
				setValue: function (aValue) {
					this.instance.getMoteur().absence.estPubliee = aValue;
				},
				getDisabled() {
					return this.instance.getMoteur().disabled;
				},
			},
		};
	}
	setDate(aEstDebut, aHeures, aMinutes) {
		const lDate = aEstDebut ? this.DateDebut : this.DateFin;
		lDate.setHours(aHeures);
		lDate.setMinutes(aMinutes);
		if (aEstDebut) {
			this.absence.PlaceDebut = GDate.dateEnPlaceAnnuelle(lDate);
			if (lDate > this.DateFin) {
				this.DateFin.setHours(aHeures);
				this.DateFin.setMinutes(aMinutes);
				this.absence.PlaceFin = this.absence.PlaceDebut;
			}
		} else {
			this.absence.PlaceFin = GDate.dateEnPlaceAnnuelle(lDate, true);
			if (lDate < this.DateDebut) {
				this.DateDebut.setHours(aHeures);
				this.DateDebut.setMinutes(aMinutes);
				this.absence.PlaceDebut = this.absence.PlaceFin;
			}
		}
	}
	surValidation(ANumeroBouton) {
		if (
			(this.enCreation && ANumeroBouton === this.numerosBouton_supprimer) ||
			ANumeroBouton === this.numerosBouton_valider
		) {
			if (this.absence.DateDebut.getTime() >= this.absence.DateFin.getTime()) {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: GTraductions.getValeur(
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
					type: EGenreBoiteMessage.Information,
					message: GTraductions.getValeur("AbsenceVS.InfirmerieEnDehorsLimite"),
				});
				return false;
			}
		}
		if (!this.enCreation && ANumeroBouton === this.numerosBouton_supprimer) {
			this.absence.setEtat(EGenreEtat.Suppression);
		}
		if (
			ANumeroBouton === this.numerosBouton_valider &&
			this.absence.getEtat() === EGenreEtat.Aucun
		) {
			this.absence.setEtat(EGenreEtat.Modification);
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
}
module.exports = { ObjetMoteurInfirmerie };
