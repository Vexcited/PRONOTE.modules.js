exports.ObjetMoteurPunitions = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeGenrePunition_1 = require("TypeGenrePunition");
const ObjetUtilitaireAbsence_1 = require("ObjetUtilitaireAbsence");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_ChoixDatePublicationPunition_1 = require("ObjetFenetre_ChoixDatePublicationPunition");
const AccessApp_1 = require("AccessApp");
class ObjetMoteurPunitions {
	constructor(aParent) {
		this.enCreation = false;
		this.eleve = new ObjetElement_1.ObjetElement();
		this.listeEleves = new ObjetListeElements_1.ObjetListeElements();
		this.listeMotifsOrigin = new ObjetListeElements_1.ObjetListeElements();
		this.genreRessource = null;
		this.indiceAccompagnateur = 0;
		this.listeBoutons = [];
		this.listeDurees = new ObjetListeElements_1.ObjetListeElements();
		$.extend(aParent.controleur, this.getControleur());
		for (let i = 0; i <= 10; i++) {
			const lElement = new ObjetElement_1.ObjetElement();
			lElement.Libelle =
				i === 0
					? "&nbsp;"
					: ObjetDate_1.GDate.formatDureeEnMillisecondes(
							30 * i * 60 * 1000,
							"%xh%sh%mm",
						);
			lElement.duree = i * 30;
			this.listeDurees.addElement(lElement);
		}
	}
	init(aParam) {
		this.eleve = aParam.eleve;
		this.listeEleves = aParam.listeEleves;
		this.listeMotifsOrigin = aParam.listeMotifs;
		this.listeSousCategorieDossier = aParam.listeSousCategorieDossier;
		if (this.listeMotifsOrigin) {
			this.listeMotifsOrigin.trier();
		}
		this.listeNature = aParam.listeNature;
		if (this.listeNature) {
			this.listeNature.trier();
		}
		this.genreRessource =
			aParam.genreRessource === null || aParam.genreRessource === undefined
				? Enumere_Ressource_1.EGenreRessource.Punition
				: aParam.genreRessource;
		this.indiceAccompagnateur = 0;
		if (this.listeEleves && this.listeEleves.count() > 1) {
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
		}
		this.enCreation = false;
		if (this.eleve) {
			this.enCreation =
				aParam.punition === null || aParam.punition === undefined;
			if (!this.enCreation) {
				this.listeBoutons = [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				];
				this.punition = MethodesObjet_1.MethodesObjet.dupliquer(
					aParam.punition,
				);
				this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				if (
					this.punition.Accompagnateur &&
					this.punition.Accompagnateur.getNumero()
				) {
					this.indiceAccompagnateur =
						this.listeEleves.getIndiceExisteParNumeroEtGenre(
							this.punition.Accompagnateur.getNumero(),
						);
				}
			} else {
				this.listeBoutons = [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				];
				this.punition = new ObjetElement_1.ObjetElement();
				this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				this.punition.duree = 0;
				this.punition.Genre = parseInt(this.genreRessource);
				this.punition.documents = new ObjetListeElements_1.ObjetListeElements();
				this.punition.documentsTAF =
					new ObjetListeElements_1.ObjetListeElements();
				if (
					this.genreRessource === Enumere_Ressource_1.EGenreRessource.Exclusion
				) {
					this.punition.PlaceDebut = aParam.placeSaisieDebut;
					this.punition.PlaceFin = aParam.placeSaisieFin;
				}
				this.punition.listeMotifs =
					new ObjetListeElements_1.ObjetListeElements();
				if (this.listeNature && this.listeNature.count() > 0) {
					const lPremiereNature = this.listeNature.get(0);
					this.punition.naturePunition = new ObjetElement_1.ObjetElement(
						lPremiereNature.getLibelle(),
						lPremiereNature.getNumero(),
						lPremiereNature.getGenre(),
					);
					this.punition.naturePunition.nbJoursDecalagePublicationParDefaut =
						lPremiereNature.nbJoursDecalagePublicationParDefaut;
				}
				if (
					this.genreRessource === Enumere_Ressource_1.EGenreRessource.Exclusion
				) {
					this.punition.Accompagnateur = new ObjetElement_1.ObjetElement();
				}
			}
		}
	}
	getTitre() {
		if (this.genreRessource === Enumere_Ressource_1.EGenreRessource.Punition) {
			return (
				this.eleve.getLibelle() +
				" - " +
				(!this.enCreation
					? ObjetTraduction_1.GTraductions.getValeur(
							"fenetreSaisiePunition.modifierPunition",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"fenetreSaisiePunition.creerPunition",
						))
			);
		} else {
			return (
				this.eleve.getLibelle() +
				" - " +
				(!this.enCreation
					? ObjetTraduction_1.GTraductions.getValeur(
							"fenetreSaisiePunition.modifierExclusion",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"fenetreSaisiePunition.creerExclusion",
						))
			);
		}
	}
	avecModifType() {
		return (
			this.genreRessource === Enumere_Ressource_1.EGenreRessource.Punition &&
			this.enCreation
		);
	}
	setDatePublication(aDate) {
		ObjetMoteurPunitions.setDatePublicationDePunition(this.punition, aDate);
	}
	static setDatePublicationDePunition(aPunition, aDate) {
		if (aPunition) {
			aPunition.datePublication = aDate;
		}
	}
	avecDroitPublie() {
		return (0, AccessApp_1.getApp)().droits.get(
			ObjetDroitsPN_1.TypeDroits.punition.avecPublicationPunitions,
		);
	}
	avecModifDuree() {
		return this.enCreation || this.punition.DureeModifiable;
	}
	getListeDuree() {
		if (this.estPunitionEnDevoir()) {
			const lListe = new ObjetListeElements_1.ObjetListeElements();
			const lElement = new ObjetElement_1.ObjetElement();
			lElement.Date = this.punition.dateProgrammation
				? this.punition.dateProgrammation
				: this.punition.date;
			lElement.Libelle = !!lElement.Date
				? ObjetDate_1.GDate.formatDate(lElement.Date, "%JJ/%MM/%AAAA")
				: "";
			lListe.addElement(lElement);
			return lListe;
		} else {
			return this.listeDurees;
		}
	}
	estPunitionEnDevoir() {
		return this.genreRessource ===
			Enumere_Ressource_1.EGenreRessource.Punition &&
			this.punition.naturePunition
			? this.punition.naturePunition.getGenre() ===
					TypeGenrePunition_1.TypeGenrePunition.GP_Devoir
			: false;
	}
	getControleur() {
		const lMoteur = this;
		return {
			circonstance: {
				getValue: function () {
					return lMoteur.punition && lMoteur.punition.circonstance
						? lMoteur.punition.circonstance
						: "";
				},
				setValue: function (aValue) {
					lMoteur.punition.circonstance = aValue;
				},
			},
			commentaire: {
				getValue: function () {
					return lMoteur.punition && lMoteur.punition.commentaire
						? lMoteur.punition.commentaire
						: "";
				},
				setValue: function (aValue) {
					lMoteur.punition.commentaire = aValue;
				},
			},
			getClasseCssImagePublicationPunition() {
				const lPunition = lMoteur.punition;
				return ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getClassesIconePublicationPunition(
					lPunition ? lPunition.datePublication : null,
				);
			},
			getHintImagePublicationPunition() {
				const lPunition = lMoteur.punition;
				return ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getHintPublicationPunition(
					lPunition ? lPunition.datePublication : null,
				);
			},
			checkPublierPunition: {
				getValue() {
					return lMoteur.punition ? !!lMoteur.punition.datePublication : false;
				},
				setValue(aValue) {
					let lNouvelleDatePublication = null;
					if (aValue) {
						const lPunition = lMoteur.punition;
						if (lPunition) {
							lNouvelleDatePublication =
								ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getDatePublicationPunitionParDefaut(
									lPunition.naturePunition,
								);
						}
					}
					lMoteur.setDatePublication(lNouvelleDatePublication);
				},
			},
			modelSelecteurDatePublication: {
				getLibelle() {
					const lStrLibelle = [];
					const lPunition = lMoteur.punition;
					if (lPunition && lPunition.datePublication) {
						lStrLibelle.push(
							ObjetDate_1.GDate.formatDate(
								lPunition.datePublication,
								"%JJ/%MM/%AAAA",
							),
						);
					}
					return lStrLibelle.join("");
				},
				getIcone() {
					return "icon_calendar_empty";
				},
				event() {
					const lPunition = lMoteur.punition;
					if (lPunition) {
						const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_ChoixDatePublicationPunition_1.ObjetFenetre_ChoixDatePublicationPunition,
							{
								pere: lMoteur,
								evenement(aNumeroBouton, aDateChoisie) {
									if (aNumeroBouton) {
										let lNouvelleDatePublication = null;
										if (aDateChoisie) {
											lNouvelleDatePublication = aDateChoisie;
										}
										lPunition.datePublication = lNouvelleDatePublication;
									}
								},
							},
						);
						lFenetre.setDonnees(lPunition.datePublication);
					}
				},
				getDisabled() {
					const lPunition = lMoteur.punition;
					return !lPunition || !lPunition.datePublication;
				},
			},
			libelleCombo: function () {
				return lMoteur.genreRessource ===
					Enumere_Ressource_1.EGenreRessource.Punition
					? ObjetTraduction_1.GTraductions.getValeur(
							"fenetreSaisiePunition.type",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"fenetreSaisiePunition.accompagnateur",
						);
			},
			visibiliteComboType: function () {
				return lMoteur.genreRessource ===
					Enumere_Ressource_1.EGenreRessource.Punition
					? { display: "" }
					: { display: "none" };
			},
			visibiliteComboAccomp: function () {
				return lMoteur.genreRessource ===
					Enumere_Ressource_1.EGenreRessource.Punition
					? { display: "none" }
					: { display: "" };
			},
			visibiliteChoixDuree: function () {
				if (
					lMoteur.genreRessource !==
					Enumere_Ressource_1.EGenreRessource.Punition
				) {
					return { display: "none" };
				} else if (lMoteur.estPunitionEnDevoir()) {
					return { display: "none" };
				} else {
					return { display: "" };
				}
			},
			visibiliteChoixDate: function () {
				if (
					lMoteur.genreRessource !==
					Enumere_Ressource_1.EGenreRessource.Punition
				) {
					return { display: "none" };
				} else if (lMoteur.estPunitionEnDevoir()) {
					return { display: "" };
				} else {
					return { display: "none" };
				}
			},
		};
	}
	surValidation(aNumeroBouton) {
		let lResult = false;
		if (aNumeroBouton > 0) {
			lResult = true;
			if (!this.enCreation && aNumeroBouton === 1) {
				this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			}
			let lAttribut = "listePunitions";
			if (
				this.genreRessource === Enumere_Ressource_1.EGenreRessource.Exclusion
			) {
				lAttribut = "ListeAbsences";
			}
			if (this.enCreation) {
				this.eleve[lAttribut].addElement(this.punition);
			} else {
				const lIndice = this.eleve[lAttribut].getIndiceParNumeroEtGenre(
					this.punition.getNumero(),
				);
				this.eleve[lAttribut].addElement(this.punition, lIndice);
			}
		}
		if (this.listeEleves && this.listeEleves.count() > 1) {
			let lEleve = this.listeEleves.getElementParNumero(0);
			if (lEleve) {
				lEleve.Visible = false;
			}
			lEleve = this.eleve
				? this.listeEleves.getElementParNumero(this.eleve.getNumero())
				: null;
			if (lEleve) {
				lEleve.Visible = true;
			}
			this.listeEleves.trier();
		}
		return lResult;
	}
}
exports.ObjetMoteurPunitions = ObjetMoteurPunitions;
