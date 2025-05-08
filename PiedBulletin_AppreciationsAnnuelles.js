const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetFenetre_Mention } = require("ObjetFenetre_Mention.js");
const { TypeContexteBulletin } = require("TypeContexteBulletin.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const {
	TypeModeAffichagePiedBulletin,
} = require("TypeModeAffichagePiedBulletin.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
	DonneesListe_AppreciationsAnnuellesPdB,
} = require("DonneesListe_AppreciationsAnnuellesPdB.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { ObjetElement } = require("ObjetElement.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const {
	TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetMoteurPiedDeBulletin } = require("ObjetMoteurPiedDeBulletin.js");
const { TypePositionnementUtil } = require("TypePositionnement.js");
class PiedBulletin_AppreciationsAnnuelles extends ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.moteurPdB = new ObjetMoteurPiedDeBulletin();
		this.params = {
			modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Onglets,
			modeSaisie: false,
			avecContenuVide: false,
		};
		const lGuid = GUID.getId();
		this.idModeConsult = lGuid + "_consult";
	}
	construireInstances() {
		if (
			this.params.typeReleveBulletin ===
				TypeReleveBulletin.AppreciationsBulletinParEleve &&
			this.params.contexte === TypeContexteBulletin.CB_Eleve &&
			this.params.modeSaisie === true
		) {
			this.identFenetreMentions = this.add(
				ObjetFenetre_Mention,
				_evntMention.bind(this),
				_initMentions.bind(this),
			);
		}
		if (this.params.modeSaisie === true) {
			this.identListe = this.add(
				ObjetListe,
				_evntListe.bind(this),
				_initListe.bind(this),
			);
		}
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		const lHauteurEntete = 15;
		H.push('<div style="height:100%">');
		if (this.params.modeSaisie === true) {
			H.push(
				'<div style="height: calc(100% - ',
				lHauteurEntete + 3,
				'px);" id="' + this.getInstance(this.identListe).getNom() + '"></div>',
			);
		}
		H.push('<div id="', this.idModeConsult, '"></div>');
		H.push("</div>");
		return H.join("");
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
		this.listePeriodes = this.params.periodes;
		this.listeColonnes = this.params.colonnes;
		this.listeMentions = this.params.mentions;
	}
	estAffiche() {
		return this.listeColonnes.count() > 0;
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		const lAppr = this.listeColonnes;
		const lAvecSaisie =
			this.params.modeSaisie === true && this.params.avecSaisieAG;
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
				super.afficher();
				break;
		}
		if (lAppr && this.identListe !== null && this.identListe !== undefined) {
			const lParam = {
				global: this.params.global,
				typeReleveBulletin: this.params.typeReleveBulletin,
				avecSaisie: lAvecSaisie,
				initMenuContextuel: _initMenuContextuelListe.bind(this),
			};
			$.extend(lParam, {
				avecValidationAuto: this.params.avecValidationAuto,
				clbckValidationAutoSurEdition: this.params.avecValidationAuto
					? this.params.clbckValidationAutoSurEdition
					: null,
				instanceListe: this.getInstance(this.identListe),
			});
			this.getInstance(this.identListe).setDonnees(
				new DonneesListe_AppreciationsAnnuellesPdB(this.listePeriodes, lParam),
			);
		}
		GHtml.setHtml(this.idModeConsult, "");
	}
	getDonneesSaisie() {
		const lInstance = this;
		const lListeDonnees = new ObjetListeElements();
		lListeDonnees.listeMoyennes = new ObjetListeElements();
		lListeDonnees.listeNiveauDAcquitions = new ObjetListeElements();
		lInstance.listeColonnes.parcourir((D) => {
			const lElement = new ObjetElement();
			lElement.ListeAppreciations = new ObjetListeElements();
			if (lInstance.params.global) {
				lElement.Numero = D.getNumero();
				lElement.Intitule = D.Intitule.join(", ");
				lElement.Genre = D.getGenre();
			}
			lInstance.listePeriodes.parcourir((periode) => {
				const lPeriode = new ObjetElement();
				lPeriode.Numero = periode.getNumero();
				lPeriode.Libelle = periode.getLibelle();
				const lListeAppr = lInstance.params.global
					? periode.listeAppreciationsGenerales
					: periode.listeAppreciations;
				lListeAppr.parcourir((lAppr) => {
					if (lAppr.getGenre() === D.getGenre()) {
						lAppr.periode = lPeriode;
						lElement.ListeAppreciations.addElement(lAppr);
					}
				});
			});
			lListeDonnees.addElement(lElement);
		});
		lInstance.listePeriodes.parcourir((periode) => {
			const lPeriode = new ObjetElement();
			lPeriode.Numero = periode.getNumero();
			lPeriode.Libelle = periode.getLibelle();
			if (periode.moyenneLSU) {
				const lMoyenne = new ObjetElement();
				lMoyenne.moyenne = periode.moyenneLSU;
				lMoyenne.periode = lPeriode;
				lListeDonnees.listeMoyennes.addElement(lMoyenne);
			}
			if (periode.niveauDAcquisition) {
				const lNiveauDAcquisition = new ObjetElement();
				lNiveauDAcquisition.setEtat(periode.niveauDAcquisition.Etat);
				lNiveauDAcquisition.position = periode.niveauDAcquisition;
				lNiveauDAcquisition.periode = lPeriode;
				lListeDonnees.listeNiveauDAcquitions.addElement(lNiveauDAcquisition);
			}
		});
		return lListeDonnees;
	}
	evenementSurAssistant() {
		_actualiserListe.call(this);
	}
	setParametres(aParam) {
		$.extend(true, this.params, aParam);
	}
	surResizeInterface() {
		_actualiserListe.call(this);
	}
}
function _evntListe(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Edition:
			if (
				aParametres.idColonne ===
				DonneesListe_AppreciationsAnnuellesPdB.colonnes.niveauDAcquisition
			) {
				aParametres.ouvrirMenuContextuel();
			} else if (
				aParametres.idColonne !==
				DonneesListe_AppreciationsAnnuellesPdB.colonnes.moyenneLSU
			) {
				const listeAppreciations = this.params.global
					? aParametres.article.listeAppreciationsGenerales
					: aParametres.article.listeAppreciations;
				const lAppreciation = listeAppreciations.get(
					aParametres.declarationColonne.indice,
				);
				this.objCelluleAppreciation = {
					article: aParametres.article,
					appreciation: lAppreciation,
					idColonne: aParametres.idColonne,
					instanceListe: this.getInstance(this.identListe),
					global: this.params.global,
				};
				if (this.moteurPdB.estMention({ appreciation: lAppreciation })) {
					this.moteurPdB.evenementOuvrirMentions({
						instanceFenetre: this.getInstance(this.identFenetreMentions),
						listeMentions: this.listeMentions,
					});
				} else {
					this.callback.appel(this.objCelluleAppreciation);
				}
			}
			break;
	}
}
function _initMenuContextuelListe(aParametres) {
	const lSelections = this.getInstance(
		this.identListe,
	).getTableauCellulesSelection();
	if (!lSelections || lSelections.length === 0) {
		return;
	}
	TUtilitaireCompetences.initMenuContextuelNiveauAcquisition({
		instance: this,
		menuContextuel: aParametres.menuContextuel,
		avecLibelleRaccourci: true,
		evaluationsEditables: true,
		genrePositionnement: TypePositionnementUtil.getGenrePositionnementParDefaut(
			aParametres.article.typePositionnementClasse,
		),
		genreChoixValidationCompetence:
			TypeGenreValidationCompetence.tGVC_Competence,
		callbackNiveau: _modifierNiveauDeSelectionCourante.bind(this),
	});
}
function _modifierNiveauDeSelectionCourante(aNiveau) {
	if (!aNiveau) {
		return;
	}
	const lListe = this.getInstance(this.identListe),
		lSelections = lListe.getTableauCellulesSelection();
	if (lSelections.length === 0) {
		return;
	}
	lSelections.forEach((aSelection) => {
		if (
			aSelection.idColonne ===
			DonneesListe_AppreciationsAnnuellesPdB.colonnes.niveauDAcquisition
		) {
			aSelection.article.niveauDAcquisition = aNiveau;
			aSelection.article.niveauDAcquisition.setEtat(EGenreEtat.Modification);
		}
	});
	this.setEtatSaisie(true);
	this.getInstance(this.identListe).actualiser(true);
}
function _initListe(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_AppreciationsAnnuellesPdB.colonnes.periode,
		taille: "65px",
	});
	if (!this.params.global) {
		if (this.params.periodes) {
			const lPremierePeriode = this.params.periodes.get(0);
			if (lPremierePeriode) {
				if (lPremierePeriode.evolution) {
					lColonnes.push({
						id: DonneesListe_AppreciationsAnnuellesPdB.colonnes.evolution,
						taille: "35px",
						titre: {
							libelle: GTraductions.getValeur(
								"AppreciationsBulletinEleve.PiedDeBulletin.Evolutions",
							),
						},
					});
				}
			}
			if (lPremierePeriode.niveauDAcquisition) {
				lColonnes.push({
					id: DonneesListe_AppreciationsAnnuellesPdB.colonnes
						.niveauDAcquisition,
					taille: "35px",
					titre: {
						libelle: GTraductions.getValeur(
							"AppreciationsBulletinEleve.PiedDeBulletin.Positionnement",
						),
					},
				});
			}
			if (lPremierePeriode.moyenneLSU) {
				lColonnes.push({
					id: DonneesListe_AppreciationsAnnuellesPdB.colonnes.moyenneLSU,
					taille: "35px",
					titre: {
						libelle: GTraductions.getValeur(
							"AppreciationsBulletinEleve.PiedDeBulletin.Moyenne",
						),
					},
				});
			}
		}
		if (this.params.options && this.params.options.afficherDevoirsEvalPdB) {
			if (
				this.params.periodes.get(0) &&
				this.params.periodes.get(0).nbrDevoirs !== undefined
			) {
				lColonnes.push({
					id: DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbDevoirs,
					taille: "35px",
					titre: {
						libelle: GTraductions.getValeur(
							"AppreciationsBulletinEleve.PiedDeBulletin.Devoirs",
						),
					},
				});
			}
			lColonnes.push({
				id: DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbEvals,
				taille: "35px",
				titre: {
					libelle: GTraductions.getValeur(
						"AppreciationsBulletinEleve.PiedDeBulletin.Evaluations",
					),
				},
			});
		}
		if (this.params.options && this.params.options.afficherAbsencePdB) {
			lColonnes.push({
				id: DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbAbs,
				taille: "35px",
				titre: {
					libelle: GTraductions.getValeur(
						"AppreciationsBulletinEleve.PiedDeBulletin.Absences",
					),
				},
			});
		}
		if (this.params.options && this.params.options.afficherRetardPdB) {
			lColonnes.push({
				id: DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbRetard,
				taille: "35px",
				titre: {
					libelle: GTraductions.getValeur(
						"AppreciationsBulletinEleve.PiedDeBulletin.Retards",
					),
				},
			});
		}
	}
	if (this.listeColonnes) {
		for (
			let lNumAppreciation = 0;
			lNumAppreciation < this.listeColonnes.count();
			lNumAppreciation++
		) {
			lColonnes.push({
				id:
					DonneesListe_AppreciationsAnnuellesPdB.colonnes.appreciation +
					this.listeColonnes.getGenre(lNumAppreciation),
				taille: "20%",
				titre: this.listeColonnes.get(lNumAppreciation).Intitule.join(", "),
				indice: lNumAppreciation,
				genre: this.listeColonnes.getGenre(lNumAppreciation),
			});
		}
	}
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		AvecSuppression: false,
		avecLigneCreation: false,
		colonnesTriables: false,
		avecModeAccessible: true,
		avecSelection: false,
		hauteurAdapteContenu: true,
		nonEditableSurModeExclusif: true,
		scrollHorizontal:
			DonneesListe_AppreciationsAnnuellesPdB.colonnes.appreciation + "0",
	});
}
function _initMentions(aInstance) {
	this.moteurPdB.initialiserMentions({ instanceFenetre: aInstance });
}
function _evntMention(aGenreBouton) {
	const lParam = $.extend(this.objCelluleAppreciation, {
		instanceFenetre: this.getInstance(this.identFenetreMentions),
		avecValidationAuto: this.params.avecValidationAuto,
		clbckValidationAutoSurEdition: this.params.clbckValidationAutoSurEdition,
	});
	this.moteurPdB.evenementMention(aGenreBouton, lParam);
	if (aGenreBouton === 1 && this.params.avecValidationAuto !== true) {
		this.setEtatSaisie(true);
	}
}
function _actualiserListe() {
	if (this.identListe !== null && this.identListe !== undefined) {
		this.getInstance(this.identListe).actualiser(true);
	}
}
module.exports = { PiedBulletin_AppreciationsAnnuelles };
