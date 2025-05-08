const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
Requetes.inscrire("ListeElevesSansCours", ObjetRequeteConsultation);
class ObjetFenetre_SelectionElevesSansCours extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("Fenetre_SelectionElevesSansCours.Titre"),
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
			largeur: 950,
			hauteur: 500,
		});
		this.parametres = {
			eleveChoisi: null,
			listeSelection: new ObjetListeElements(),
			cours: null,
			date: null,
			listeInitialeEleves: null,
			listeEleves: new ObjetListeElements(),
		};
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe,
			_evenementSurListe.bind(this),
			_initialiserListe,
		);
	}
	setDonnees(aCours, aDate, aListeEleves) {
		this.parametres.cours = aCours;
		this.parametres.date = aDate;
		this.parametres.listeInitialeEleves = aListeEleves;
		Requetes(
			"ListeElevesSansCours",
			this,
			_reponseRequete.bind(this),
		).lancerRequete(this.parametres);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.index === 0) {
						return false;
					}
					return (
						!this.instance.parametres.eleveChoisi &&
						this.instance.parametres.listeSelection.count() === 0
					);
				},
			},
			cbPresenceObli: {
				getValue: function () {
					return ObjetFenetre_SelectionElevesSansCours.avecObligatoire;
				},
				setValue: function (aValue) {
					ObjetFenetre_SelectionElevesSansCours.avecObligatoire = aValue;
					this.instance
						.getInstance(this.instance.identListe)
						.setDonnees(
							new DonneesListe_ListeElevesSansCours(
								this.instance.parametres.listeEleves,
							),
						);
				},
			},
			cbPresenceEtab: {
				getValue: function () {
					return ObjetFenetre_SelectionElevesSansCours.avecNonObligatoire;
				},
				setValue: function (aValue) {
					ObjetFenetre_SelectionElevesSansCours.avecNonObligatoire = aValue;
					this.instance
						.getInstance(this.instance.identListe)
						.setDonnees(
							new DonneesListe_ListeElevesSansCours(
								this.instance.parametres.listeEleves,
							),
						);
				},
			},
		});
	}
	composeContenu() {
		const T = [];
		T.push('<div class="full-height flex-contain cols">');
		T.push(
			'<div class="PetitEspace fix-bloc"><ie-checkbox ie-model="cbPresenceObli">',
			GTraductions.getValeur(
				"Fenetre_SelectionElevesSansCours.PresenceNonObligatoire",
			),
			"</ie-checkbox></div>",
		);
		T.push(
			'<div class="PetitEspace fix-bloc"><ie-checkbox ie-model="cbPresenceEtab">',
			GTraductions.getValeur(
				"Fenetre_SelectionElevesSansCours.PresenceObligatoire",
			),
			"</ie-checkbox></div>",
		);
		T.push(
			'<div id="',
			this.getNomInstance(this.identListe),
			'" class="fluid-bloc">&nbsp;</div>',
		);
		T.push("</div>");
		return T.join("");
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		const lListe = new ObjetListeElements().add(this.parametres.listeSelection);
		lListe.parcourir((D) => {
			if (!D.coche) {
				D.setEtat(EGenreEtat.Suppression);
			}
		});
		if (this.parametres.eleveChoisi) {
			this.parametres.eleveChoisi.setEtat(EGenreEtat.Modification);
			lListe.addElement(this.parametres.eleveChoisi);
		}
		this.callback.appel(aNumeroBouton, {
			cours: this.parametres.cours,
			date: this.parametres.date,
			listeEleves: lListe,
		});
	}
}
ObjetFenetre_SelectionElevesSansCours.avecObligatoire = false;
ObjetFenetre_SelectionElevesSansCours.avecNonObligatoire = true;
function _reponseRequete(aJSON) {
	this.parametres.listeEleves = aJSON.listeEleves;
	if (this.parametres.listeInitialeEleves) {
		this.parametres.listeInitialeEleves.parcourir((aEleve) => {
			if (aEleve.eleveAjouteAuCours) {
				const lEleve = aJSON.listeEleves.getElementParNumero(
					aEleve.getNumero(),
				);
				if (lEleve) {
					lEleve.coche = true;
				}
			}
		});
	}
	this.afficher();
	this.getInstance(this.identListe).setDonnees(
		new DonneesListe_ListeElevesSansCours(this.parametres.listeEleves),
	);
}
function _initialiserListe(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_ListeElevesSansCours.colonnes.coche,
		titre: { estCoche: true },
		taille: 20,
	});
	lColonnes.push({
		id: DonneesListe_ListeElevesSansCours.colonnes.nom,
		titre: GTraductions.getValeur("Eleve"),
		taille: "100%",
	});
	lColonnes.push({
		id: DonneesListe_ListeElevesSansCours.colonnes.classe,
		titre: GTraductions.getValeur("Classe"),
		taille: 80,
	});
	lColonnes.push({
		id: DonneesListe_ListeElevesSansCours.colonnes.transport,
		titre: {
			classeCssImage: "Image_ColonneTransportScolaire",
			title: GTraductions.getValeur(
				"Fenetre_SelectionElevesSansCours.title.UsagerTransport",
			),
		},
		taille: 20,
	});
	lColonnes.push({
		id: DonneesListe_ListeElevesSansCours.colonnes.codepostal,
		titre: GTraductions.getValeur("Fenetre_SelectionElevesSansCours.CP"),
		hint: GTraductions.getValeur(
			"Fenetre_SelectionElevesSansCours.title.CodePostal",
		),
		taille: 50,
	});
	lColonnes.push({
		id: DonneesListe_ListeElevesSansCours.colonnes.autorisation,
		titre: GTraductions.getValeur(
			"Fenetre_SelectionElevesSansCours.AutorisationSortie",
		),
		taille: 130,
	});
	lColonnes.push({
		id: DonneesListe_ListeElevesSansCours.colonnes.cours,
		titre: GTraductions.getValeur(
			"Fenetre_SelectionElevesSansCours.CoursInitial",
		),
		taille: 120,
	});
	lColonnes.push({
		id: DonneesListe_ListeElevesSansCours.colonnes.raison,
		titre: GTraductions.getValeur("Fenetre_SelectionElevesSansCours.Raison"),
		taille: 120,
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		parsingSurColonne: ObjetListe.parsingSurColonneTri,
	});
	GEtatUtilisateur.setTriListe({
		liste: aInstance,
		colonnesTriables: [false, true, true, true, true, true, true, true],
		tri: 2,
		onglet: "ObjetFenetre_SelectionElevesSansCours",
	});
}
function _evenementSurListe(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.ApresEdition: {
			const lListeInitiale = this.parametres.listeInitialeEleves;
			this.parametres.listeSelection =
				this.parametres.listeEleves.getListeElements((D) => {
					const lEstDansListeInitiale = !!lListeInitiale.getElementParNumero(
						D.getNumero(),
					);
					return (
						(D.coche && !lEstDansListeInitiale) ||
						(!D.coche && lEstDansListeInitiale)
					);
				});
			break;
		}
	}
}
class DonneesListe_ListeElevesSansCours extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecSuppression: false, avecEvnt_ApresEdition: true });
	}
	avecEdition(aParams) {
		return (
			aParams.idColonne === DonneesListe_ListeElevesSansCours.colonnes.coche
		);
	}
	getColonneTransfertEdition() {
		return DonneesListe_ListeElevesSansCours.colonnes.coche;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeElevesSansCours.colonnes.coche:
				return !!aParams.article.coche;
			case DonneesListe_ListeElevesSansCours.colonnes.nom:
				return aParams.article.getLibelle();
			case DonneesListe_ListeElevesSansCours.colonnes.classe:
				return aParams.article.classe;
			case DonneesListe_ListeElevesSansCours.colonnes.codepostal:
				return aParams.article.cp;
			case DonneesListe_ListeElevesSansCours.colonnes.autorisation:
				return aParams.article.autorisation;
			case DonneesListe_ListeElevesSansCours.colonnes.transport:
				return !!aParams.article.transport;
			case DonneesListe_ListeElevesSansCours.colonnes.cours:
				return aParams.article.coursInit;
			case DonneesListe_ListeElevesSansCours.colonnes.raison:
				return aParams.article.raison;
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeElevesSansCours.colonnes.coche:
			case DonneesListe_ListeElevesSansCours.colonnes.transport:
				return ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	surEdition(aParams, V) {
		if (
			aParams.idColonne === DonneesListe_ListeElevesSansCours.colonnes.coche
		) {
			aParams.article.coche = V;
		}
	}
	getTri(aColonne, aGenreTri) {
		const lColonneNom = this.getNumeroColonneDId(
			DonneesListe_ListeElevesSansCours.colonnes.nom,
		);
		return [
			ObjetTri.init(this.getValeurPourTri.bind(this, aColonne), aGenreTri),
			ObjetTri.init(this.getValeurPourTri.bind(this, lColonneNom)),
		];
	}
	getClass(aParams) {
		const lClasses = [];
		if (aParams.article && !aParams.article.attendu) {
			lClasses.push("Italique");
		}
		return lClasses.join(" ");
	}
	getVisible(D) {
		if (D.attendu) {
			return ObjetFenetre_SelectionElevesSansCours.avecNonObligatoire;
		} else {
			return ObjetFenetre_SelectionElevesSansCours.avecObligatoire;
		}
	}
}
DonneesListe_ListeElevesSansCours.colonnes = {
	coche: "DL_ElevesSansCours_coche",
	nom: "DL_ElevesSansCours_nom",
	classe: "DL_ElevesSansCours_classe",
	transport: "DL_ElevesSansCours_transport",
	codepostal: "DL_ElevesSansCours_cp",
	autorisation: "DL_ElevesSansCours_autorisation",
	cours: "DL_ElevesSansCours_cours",
	raison: "DL_ElevesSansCours_raison",
};
module.exports = { ObjetFenetre_SelectionElevesSansCours };
