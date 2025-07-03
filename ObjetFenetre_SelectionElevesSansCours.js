exports.ObjetFenetre_SelectionElevesSansCours = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
CollectionRequetes_1.Requetes.inscrire(
	"ListeElevesSansCours",
	ObjetRequeteJSON_1.ObjetRequeteConsultation,
);
class ObjetFenetre_SelectionElevesSansCours extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SelectionElevesSansCours.Titre",
			),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			largeur: 950,
			hauteur: 500,
		});
		this.parametres = {
			eleveChoisi: null,
			listeSelection: new ObjetListeElements_1.ObjetListeElements(),
			cours: null,
			date: null,
			listeInitialeEleves: null,
			listeEleves: new ObjetListeElements_1.ObjetListeElements(),
		};
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe.bind(this),
			this._initialiserListe,
		);
	}
	setDonnees(aCours, aDate, aListeEleves) {
		this.parametres.cours = aCours;
		this.parametres.date = aDate;
		this.parametres.listeInitialeEleves = aListeEleves;
		(0, CollectionRequetes_1.Requetes)(
			"ListeElevesSansCours",
			this,
			this._reponseRequete.bind(this),
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
						!aInstance.parametres.eleveChoisi &&
						aInstance.parametres.listeSelection.count() === 0
					);
				},
			},
			cbPresenceObli: {
				getValue: function () {
					return ObjetFenetre_SelectionElevesSansCours.avecObligatoire;
				},
				setValue: function (aValue) {
					ObjetFenetre_SelectionElevesSansCours.avecObligatoire = aValue;
					aInstance
						.getInstance(aInstance.identListe)
						.setDonnees(
							new DonneesListe_ListeElevesSansCours(
								aInstance.parametres.listeEleves,
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
					aInstance
						.getInstance(aInstance.identListe)
						.setDonnees(
							new DonneesListe_ListeElevesSansCours(
								aInstance.parametres.listeEleves,
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
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SelectionElevesSansCours.PresenceNonObligatoire",
			),
			"</ie-checkbox></div>",
		);
		T.push(
			'<div class="PetitEspace fix-bloc"><ie-checkbox ie-model="cbPresenceEtab">',
			ObjetTraduction_1.GTraductions.getValeur(
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
		const lListe = new ObjetListeElements_1.ObjetListeElements().add(
			this.parametres.listeSelection,
		);
		lListe.parcourir((D) => {
			if (!D.coche) {
				D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			}
		});
		if (this.parametres.eleveChoisi) {
			this.parametres.eleveChoisi.setEtat(
				Enumere_Etat_1.EGenreEtat.Modification,
			);
			lListe.addElement(this.parametres.eleveChoisi);
		}
		this.callback.appel(aNumeroBouton, {
			cours: this.parametres.cours,
			date: this.parametres.date,
			listeEleves: lListe,
		});
	}
	_reponseRequete(aJSON) {
		this.parametres.listeEleves = aJSON.listeEleves;
		if (this.parametres.listeInitialeEleves) {
			this.parametres.listeInitialeEleves.parcourir((aEleve) => {
				if ("eleveAjouteAuCours" in aEleve && aEleve.eleveAjouteAuCours) {
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
	_initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ListeElevesSansCours.Colonnes.coche,
			titre: { estCoche: true },
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListe_ListeElevesSansCours.Colonnes.nom,
			titre: ObjetTraduction_1.GTraductions.getValeur("Eleve"),
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_ListeElevesSansCours.Colonnes.classe,
			titre: ObjetTraduction_1.GTraductions.getValeur("Classe"),
			taille: 80,
		});
		lColonnes.push({
			id: DonneesListe_ListeElevesSansCours.Colonnes.transport,
			titre: {
				classeCssImage: "Image_ColonneTransportScolaire",
				title: ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_SelectionElevesSansCours.title.UsagerTransport",
				),
			},
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListe_ListeElevesSansCours.Colonnes.codepostal,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SelectionElevesSansCours.CP",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SelectionElevesSansCours.title.CodePostal",
			),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_ListeElevesSansCours.Colonnes.autorisation,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SelectionElevesSansCours.AutorisationSortie",
			),
			taille: 130,
		});
		lColonnes.push({
			id: DonneesListe_ListeElevesSansCours.Colonnes.cours,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SelectionElevesSansCours.CoursInitial",
			),
			taille: 120,
		});
		lColonnes.push({
			id: DonneesListe_ListeElevesSansCours.Colonnes.raison,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SelectionElevesSansCours.Raison",
			),
			taille: 120,
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			parsingSurColonne: ObjetListe_1.ObjetListe.parsingSurColonneTri,
		});
		GEtatUtilisateur.setTriListe({
			liste: aInstance,
			colonnesTriables: [false, true, true, true, true, true, true, true],
			tri: 2,
			onglet: "ObjetFenetre_SelectionElevesSansCours",
		});
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition: {
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
}
exports.ObjetFenetre_SelectionElevesSansCours =
	ObjetFenetre_SelectionElevesSansCours;
ObjetFenetre_SelectionElevesSansCours.avecObligatoire = false;
ObjetFenetre_SelectionElevesSansCours.avecNonObligatoire = true;
class DonneesListe_ListeElevesSansCours extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecSuppression: false, avecEvnt_ApresEdition: true });
	}
	avecEdition(aParams) {
		return (
			aParams.idColonne === DonneesListe_ListeElevesSansCours.Colonnes.coche
		);
	}
	getColonneTransfertEdition() {
		return DonneesListe_ListeElevesSansCours.Colonnes.coche;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeElevesSansCours.Colonnes.coche:
				return !!aParams.article.coche;
			case DonneesListe_ListeElevesSansCours.Colonnes.nom:
				return aParams.article.getLibelle();
			case DonneesListe_ListeElevesSansCours.Colonnes.classe:
				return aParams.article.classe;
			case DonneesListe_ListeElevesSansCours.Colonnes.codepostal:
				return aParams.article.cp;
			case DonneesListe_ListeElevesSansCours.Colonnes.autorisation:
				return aParams.article.autorisation;
			case DonneesListe_ListeElevesSansCours.Colonnes.transport:
				return !!aParams.article.transport;
			case DonneesListe_ListeElevesSansCours.Colonnes.cours:
				return aParams.article.coursInit;
			case DonneesListe_ListeElevesSansCours.Colonnes.raison:
				return aParams.article.raison;
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeElevesSansCours.Colonnes.coche:
			case DonneesListe_ListeElevesSansCours.Colonnes.transport:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	surEdition(aParams, V) {
		if (
			aParams.idColonne === DonneesListe_ListeElevesSansCours.Colonnes.coche
		) {
			aParams.article.coche = V;
		}
	}
	getTri(aColonne, aGenreTri) {
		const lColonneNom = this.getNumeroColonneDId(
			DonneesListe_ListeElevesSansCours.Colonnes.nom,
		);
		return [
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(this, aColonne),
				aGenreTri,
			),
			ObjetTri_1.ObjetTri.init(this.getValeurPourTri.bind(this, lColonneNom)),
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
(function (DonneesListe_ListeElevesSansCours) {
	let Colonnes;
	(function (Colonnes) {
		Colonnes["coche"] = "DL_ElevesSansCours_coche";
		Colonnes["nom"] = "DL_ElevesSansCours_nom";
		Colonnes["classe"] = "DL_ElevesSansCours_classe";
		Colonnes["transport"] = "DL_ElevesSansCours_transport";
		Colonnes["codepostal"] = "DL_ElevesSansCours_cp";
		Colonnes["autorisation"] = "DL_ElevesSansCours_autorisation";
		Colonnes["cours"] = "DL_ElevesSansCours_cours";
		Colonnes["raison"] = "DL_ElevesSansCours_raison";
	})(
		(Colonnes =
			DonneesListe_ListeElevesSansCours.Colonnes ||
			(DonneesListe_ListeElevesSansCours.Colonnes = {})),
	);
})(
	DonneesListe_ListeElevesSansCours || (DonneesListe_ListeElevesSansCours = {}),
);
