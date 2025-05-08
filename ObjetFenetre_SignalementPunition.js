const { DonneesListe_Simple } = require("DonneesListe_Simple.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreSaisie } = require("Enumere_Saisie.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	ObjetRequeteSaisieListePunitions,
} = require("ObjetRequeteSaisieListePunitions.js");
const { TypeGenrePunition } = require("TypeGenrePunition.js");
const { TUtilitaireDuree } = require("UtilitaireDuree.js");
const { ObjetUtilitaireAbsence } = require("ObjetUtilitaireAbsence.js");
class ObjetFenetre_SignalementPunition extends ObjetFenetre_Liste {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identListeNature = this.add(
			ObjetListe,
			_evnementListeNatures.bind(this),
			_initialiserListeNatures,
		);
		this.identDate = this.add(
			ObjetCelluleDate,
			_evntSurDate.bind(this),
			_initDate.bind(this),
		);
		this.identHeure = this.add(
			ObjetSaisie,
			_evntSurHeure.bind(this),
			_initHeure.bind(this),
		);
		this.identDuree = this.add(
			ObjetSaisie,
			_evntSurDuree.bind(this),
			_initDuree.bind(this),
		);
		this.identListe = this.add(
			ObjetListe,
			this.evenementSurListe,
			this.initialiserListe,
		);
	}
	verifierActivationBtnValider(aBoutonRepeat) {
		return (
			aBoutonRepeat.element.index !== 1 ||
			(!!this.punition && !!this.punition.nature)
		);
	}
	setDonnees(aParam) {
		this.punition = aParam.punition;
		this.listePunitions = aParam.listePunitions;
		this.motifs = aParam.motifs;
		this.listePJ = aParam.listePJ;
		this.afficher();
		this.avecValidation = aParam.avecValidation;
		this.setBoutonActif(1, false);
		this.getInstance(this.identListeNature).setDonnees(
			new DonneesListe_Simple(aParam.listeNaturePunitions),
		);
		this.getInstance(this.identListe).setDonnees(
			aParam.objetDonneesListeMotifs,
		);
		this.getInstance(this.identDate).setDonnees(this.punition.dateDemande);
	}
	composeContenu() {
		const T = [];
		T.push(
			`<div class="flex-contain cols full-size">\n              <div class="flex-contain flex-center p-y-l flex-gap">`,
		);
		T.push(
			`${GTraductions.getValeur("punition.titre.Date")}<div class="m-right-l" id="${this.getNomInstance(this.identDate)}"></div>`,
		);
		T.push(
			`${GTraductions.getValeur("punition.heure")}<div class="m-right-l" id="${this.getNomInstance(this.identHeure)}"></div>`,
		);
		T.push(
			`${GTraductions.getValeur("punition.duree")}<div id="${this.getNomInstance(this.identDuree)}"></div>`,
		);
		T.push(`</div>`);
		T.push(` <div class="flex-contain fluid-bloc">`);
		T.push(
			`  <div class="fix-bloc flex-contain cols flex-gap" style="width: 200px;">\n                <div class="fix-bloc">${GTraductions.getValeur("punition.titreChoixNature")}</div>\n                <div class="fluid-bloc" id="${this.getNomInstance(this.identListeNature)}"></div>\n              </div>`,
		);
		T.push(
			`  <div class="fluid-bloc flex-contain cols flex-gap">\n                <div class="fix-bloc">${GTraductions.getValeur("punition.titreChoixMotif")}</div>\n                <div class="fluid-bloc" id="${this.getNomInstance(this.identListe)}"></div>\n              </div>`,
		);
		T.push(`</div>`);
		return T.join("");
	}
	getControleur() {
		return $.extend(true, super.getControleur(this), {
			heure: {
				getValue: function () {
					return this.instance.incident
						? GDate.formatDate(this.instance.incident.dateheure, "%hh:%mm")
						: "";
				},
				setValue: function (aValue, aHeures, aMinutes) {
					const lDate = new Date(
						this.instance.incident.dateheure.getFullYear(),
						this.instance.incident.dateheure.getMonth(),
						this.instance.incident.dateheure.getDate(),
						aHeures,
						aMinutes,
					);
					this.instance.incident.dateheure = lDate;
				},
				getDisabled: function () {
					return (
						!this.instance.incident || !this.instance.incident.estRapporteur
					);
				},
			},
		});
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			_validationAuto.bind(this)(aGenreBouton);
		} else {
			_finSurValidation.bind(this)(aGenreBouton);
		}
	}
}
function _evntSurDate(aDate) {
	let lPlace = GDate.dateEnPlaceAnnuelle(this.punition.dateDemande);
	let lPlaceJour = this.punition.placeDemande - lPlace;
	if (lPlaceJour < 0) {
		lPlaceJour = 0;
	}
	const lDate = new Date(
		aDate.getFullYear(),
		aDate.getMonth(),
		aDate.getDate(),
	);
	this.punition.dateDemande = lDate;
	lPlace = GDate.dateEnPlaceAnnuelle(this.punition.dateDemande);
	this.punition.placeDemande = lPlace + lPlaceJour;
}
function _evntSurHeure(aParams) {
	if (
		aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
		this.punition
	) {
		this.punition.place = aParams.element.getGenre();
		this.punition.horsCours = aParams.element.getGenre() === -1;
		if (aParams.element.getGenre() !== -1) {
			const lPlace = GDate.dateEnPlaceAnnuelle(this.punition.dateDemande);
			this.punition.placeDemande = lPlace + aParams.element.getGenre();
		} else {
			this.punition.placeDemande = 0;
		}
	}
}
function _evntSurDuree(aParams) {
	const lInstanceCombo = this.getInstance(this.identDuree);
	if (
		aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
		lInstanceCombo.estUneInteractionUtilisateur() &&
		this.punition &&
		this.punition.duree !== aParams.element.getGenre()
	) {
		this.punition.duree = aParams.element.getGenre();
	}
}
function _initialiserListeNatures(aInstance) {
	const lColonnes = [];
	lColonnes.push({ taille: "100%" });
	aInstance.setOptionsListe({ colonnes: lColonnes });
}
function _evnementListeNatures(aParametres) {
	if (aParametres.genreEvenement === EGenreEvenementListe.Selection) {
		const lElement = aParametres.article;
		this.punition.nature = lElement;
		this.punition.estProgrammable = lElement.programmable;
		this.punition.estPlanifiable =
			lElement.programmable &&
			[TypeGenrePunition.GP_Retenues, TypeGenrePunition.GP_Autre].includes(
				lElement.getGenre(),
			);
		this.punition.peutEtreMultiSeance =
			this.punition.estPlanifiable &&
			[TypeGenrePunition.GP_Retenues].includes(lElement.getGenre());
		this.punition.peutEtreReporte =
			this.punition.estPlanifiable &&
			[TypeGenrePunition.GP_Retenues, TypeGenrePunition.GP_Autre].includes(
				lElement.getGenre(),
			);
		const lListe = GParametres.LibellesHeures.getListeElements(
			(aElement, aIndice) => {
				return aIndice < GParametres.PlacesParJour - 1;
			},
		);
		if (
			this.punition.nature.getGenre() !== TypeGenrePunition.GP_ExclusionCours
		) {
			const lHorsCours = new ObjetElement(
				GTraductions.getValeur("punition.horsCours"),
				undefined,
				-1,
			);
			lListe.insererElement(lHorsCours, 0);
		}
		let lIndice = 0;
		if (this.punition.place > -1) {
			lIndice = lListe.getIndiceParNumeroEtGenre(null, this.punition.place);
		}
		this.getInstance(this.identHeure).reset();
		this.getInstance(this.identHeure).setActif(true);
		this.getInstance(this.identHeure).setDonnees(lListe, lIndice);
		this.getInstance(this.identDuree).reset();
		if (lElement.durees) {
			let lDureeRecherchee = null;
			if (this.punition.duree) {
				lDureeRecherchee = this.punition.duree;
			} else if (!!lElement.dureeParDefaut) {
				lDureeRecherchee = TUtilitaireDuree.dureeEnMin(lElement.dureeParDefaut);
			}
			let lIndiceDuree;
			if (lDureeRecherchee) {
				lIndiceDuree = lElement.durees.getIndiceExisteParNumeroEtGenre(
					null,
					lDureeRecherchee,
				);
			}
			this.getInstance(this.identDuree).setActif(true);
			this.getInstance(this.identDuree).setDonnees(
				lElement.durees,
				lIndiceDuree,
			);
		} else {
			this.getInstance(this.identDuree).setActif(false);
		}
	}
}
function _initDate(aInstance) {
	aInstance.setOptionsObjetCelluleDate({ classeCSSTexte: " " });
	aInstance.setParametresFenetre(
		GParametres.PremierLundi,
		GParametres.PremiereDate,
		GParametres.DerniereDate,
		GParametres.JoursOuvres,
		null,
		GParametres.JoursFeries,
		null,
	);
}
function _initHeure(aInstance) {
	aInstance.setOptionsObjetSaisie({
		mode: EGenreSaisie.Combo,
		longueur: 70,
		hauteur: 17,
		classTexte: "",
		deroulerListeSeulementSiPlusieursElements: false,
		initAutoSelectionAvecUnElement: false,
		labelWAICellule: GTraductions.getValeur("punition.heure"),
	});
	aInstance.setActif(false);
}
function _initDuree(aInstance) {
	aInstance.setOptionsObjetSaisie({
		mode: EGenreSaisie.Combo,
		longueur: 60,
		hauteur: 17,
		classTexte: "",
		deroulerListeSeulementSiPlusieursElements: false,
		initAutoSelectionAvecUnElement: false,
		labelWAICellule: GTraductions.getValeur("punition.duree"),
	});
	aInstance.setActif(false);
}
function _validationAuto(aGenreBouton) {
	if (this.punition) {
		const lListeActif = this.motifs.getListeElements((aElement) => {
			return aElement.cmsActif;
		});
		this.punition.motifs = lListeActif;
		let lSeraPubliee = false;
		for (let i = 0; i < this.punition.motifs.count(); i++) {
			const lMotif = this.punition.motifs.get(i);
			if (lMotif.existe() && lMotif.publication) {
				lSeraPubliee = true;
				if (lSeraPubliee) {
					break;
				}
			}
		}
		if (lSeraPubliee) {
			this.punition.datePublication =
				ObjetUtilitaireAbsence.getDatePublicationPunitionParDefaut(
					this.punition,
				);
		} else {
			this.punition.datePublication = null;
		}
		if (
			!this.punition.duree &&
			!!this.punition.nature &&
			!!this.punition.nature.durees
		) {
			const lElementDureeSelectionnee = this.getInstance(
				this.identDuree,
			).getSelection();
			if (!!lElementDureeSelectionnee) {
				this.punition.duree = lElementDureeSelectionnee.getGenre();
			}
		}
		this.punition.setEtat(EGenreEtat.Creation);
		this.listePunitions.addElement(this.punition);
		this.setEtatSaisie(true);
		const lObjetSaisie = {
			punitions: this.listePunitions,
			motifs: this.motifs,
		};
		new ObjetRequeteSaisieListePunitions(
			this,
			_reponseSaisie.bind(this, aGenreBouton),
		)
			.addUpload({ listeFichiers: this.listePJ })
			.lancerRequete(lObjetSaisie);
	}
}
function _reponseSaisie(aGenreBouton, aJSON) {
	this.setEtatSaisie(false);
	_finSurValidation.bind(this)(aGenreBouton, aJSON);
}
function _finSurValidation(aGenreBouton, aJSON) {
	if (aJSON && aJSON.punition) {
		GEtatUtilisateur.setNrPunitionSelectionnee(aJSON.punition.getNumero());
	}
	const lMaSelection = this.getInstance(this.identListe).getSelection();
	this.fermer();
	if (this.optionsFenetre.callback) {
		this.optionsFenetre.callback(
			aGenreBouton,
			lMaSelection,
			this.changementListe,
			aJSON,
		);
	}
	this.callback.appel(aGenreBouton, lMaSelection, this.changementListe, aJSON);
}
module.exports = { ObjetFenetre_SignalementPunition };
