const { GHtml } = require("ObjetHtml.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeGenreMaquetteBulletin } = require("TypeGenreMaquetteBulletin.js");
const {
	TypeGenreParcoursEducatif,
	TypeGenreParcoursEducatifUtil,
} = require("TypeGenreParcoursEducatif.js");
const { DonneesListe_ParcoursPeda } = require("DonneesListe_ParcoursPeda.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const ObjetRequeteParcoursEducatif = require("ObjetRequeteParcoursEducatif.js");
const ObjetRequeteSaisieParcoursEducatifs = require("ObjetRequeteSaisieParcoursEducatifs.js");
const { MethodesObjet } = require("MethodesObjet.js");
class InterfaceParcoursPeda extends ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.params = {
			periodeCloture: false,
			droits: { avecSaisie: false },
			filtres: {
				avecCumulParEleves: false,
				avecCumulParGenreParcours: false,
				genreParcours: null,
			},
			genreMaquette: TypeGenreMaquetteBulletin.tGMB_Notes,
			avecTitres: true,
			avecCompteurSurCumul: false,
		};
		this.listeFormatee = new ObjetListeElements();
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe,
			_evenementSurListe.bind(this),
			_initialiserListe.bind(this),
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = false;
		this.AvecCadre = false;
	}
	recupererDonnees(aParam) {
		if (aParam) {
			this.contexte = aParam;
			return new ObjetRequeteParcoursEducatif(this)
				.lancerRequete({
					classeGroupe: aParam.classeGroupe,
					periode: aParam.periode,
					listeEleves: aParam.listeEleves,
					pourClasseGroupeEntier: aParam.pourClasseGroupeEntier,
					genreMaquette: aParam.genreMaquette,
				})
				.then(
					(aParam) => {
						this.libelleUtilisateur = aParam.libelleUtilisateur;
						this.listeGenreParcours = aParam.listeGenreParcours;
						this.listeParcours = aParam.listeParcours;
						this.periodeCloture = aParam.Cloture;
						return this.listeGenreParcours;
					},
					() => {},
				);
		}
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
		if (
			this.params.droits.avecSaisie === false &&
			this.listeParcours.count() === 0
		) {
			GHtml.setHtml(
				this.Nom,
				this.composeMessage(
					GTraductions.getValeur("ParcoursPeda.MsgAucunParcours"),
				),
			);
		} else {
			this.initialiser(true);
			this._formaterDonneesSelonOptions(this.listeParcours, aParam.filtres);
			this.donneesListe = new DonneesListe_ParcoursPeda({
				donnees: this.listeFormatee,
				libelleUtilisateur: this.libelleUtilisateur,
				ressources: aParam.ressources,
				filtres: aParam.filtres,
				droits: aParam.droits,
				periodeCloture: this.periodeCloture,
				avecTitres: aParam.avecTitres,
				avecCompteurSurCumul: aParam.avecCompteurSurCumul,
			});
			this._actualiserListe();
		}
	}
	composeMessage(aMsg) {
		const H = [];
		H.push("<div>");
		H.push(aMsg);
		H.push("</div>");
		return H.join("");
	}
	_getDonneesSaisie() {
		return {
			listeParcours: this.listeFormatee,
			periode: GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Periode,
			),
			genreMaquette: this.params.genreMaquette,
		};
	}
	_actualiserListe() {
		if (this.identListe !== undefined && this.identListe !== null) {
			const lListe = this.getInstance(this.identListe);
			lListe.setDonnees(this.donneesListe);
		}
	}
	_formaterDonneesSelonOptions(aListeDonnees, aOptions) {
		const lCumulsDeploye = true;
		this.listeFormatee = new ObjetListeElements();
		let lListeCumulsGenreParcours;
		let lTabListeCumulsEleves;
		let lListeCumulsEleves;
		if (aOptions.avecCumulParGenreParcours) {
			lListeCumulsGenreParcours = new ObjetListeElements();
		}
		if (aOptions.avecCumulParEleves) {
			if (aOptions.avecCumulParGenreParcours) {
				lTabListeCumulsEleves = [];
				for (const lKey of MethodesObjet.enumKeys(TypeGenreParcoursEducatif)) {
					const lGenre = TypeGenreParcoursEducatif[lKey];
					lTabListeCumulsEleves[lGenre] = new ObjetListeElements();
				}
			} else {
				lListeCumulsEleves = new ObjetListeElements();
			}
		}
		const lNbr = aListeDonnees.count();
		for (let i = 0; i < lNbr; i++) {
			const lElt = aListeDonnees.get(i);
			if (
				aOptions.genreParcours === null ||
				aOptions.genreParcours.includes(lElt.getGenre())
			) {
				let lGenreParcours;
				let lCumulGenreParcours;
				if (aOptions.avecCumulParGenreParcours) {
					lGenreParcours = lElt.getGenre();
					lCumulGenreParcours = lListeCumulsGenreParcours.get(
						lListeCumulsGenreParcours.getIndiceParNumeroEtGenre(
							lGenreParcours,
							lGenreParcours,
						),
					);
					if (!lCumulGenreParcours) {
						lCumulGenreParcours = new ObjetElement(
							TypeGenreParcoursEducatifUtil.getLibelle(lGenreParcours),
							lGenreParcours,
							lGenreParcours,
						);
						lCumulGenreParcours.estDeploye = lCumulsDeploye;
						lCumulGenreParcours.estUnDeploiement = true;
						lCumulGenreParcours.estCumulGenreParcours = true;
						lCumulGenreParcours.nbParcours = 1;
						lListeCumulsGenreParcours.addElement(lCumulGenreParcours);
						this.listeFormatee.addElement(lCumulGenreParcours);
					} else {
						lCumulGenreParcours.nbParcours++;
					}
					if (!aOptions.avecCumulParEleves) {
						lElt.pere = lCumulGenreParcours;
					}
				}
				if (aOptions.avecCumulParEleves) {
					let lListeCouranteCumulsEleves;
					if (aOptions.avecCumulParGenreParcours) {
						lListeCouranteCumulsEleves = lTabListeCumulsEleves[lGenreParcours];
					} else {
						lListeCouranteCumulsEleves = lListeCumulsEleves;
					}
					const lEleve = lElt.ressource;
					let lCumul = lListeCouranteCumulsEleves.get(
						lListeCouranteCumulsEleves.getIndiceParNumeroEtGenre(
							lEleve.getNumero(),
						),
					);
					if (!lCumul) {
						lCumul = new ObjetElement(
							lEleve.getLibelle(),
							lEleve.getNumero(),
							lEleve.getGenre(),
						);
						lCumul.estDeploye = lCumulsDeploye;
						lCumul.estUnDeploiement = true;
						lCumul.estCumulEleve = true;
						lCumul.nbParcours = 1;
						lListeCouranteCumulsEleves.addElement(lCumul);
						this.listeFormatee.addElement(lCumul);
						if (aOptions.avecCumulParGenreParcours) {
							lCumul.pere = lCumulGenreParcours;
						}
					} else {
						lCumul.nbParcours++;
					}
					lElt.pere = lCumul;
				}
				this.listeFormatee.addElement(lElt);
			}
		}
	}
	actualiserSurChangementTabOnglet() {
		if (this.getInstance(this.identListe)) {
			this.getInstance(this.identListe).actualiser(true);
		}
	}
}
function _initialiserListe(aInstance) {
	const lColonnes = [
		{
			id: DonneesListe_ParcoursPeda.colonnes.date,
			taille: 60,
			titre: this.params.avecTitres
				? GTraductions.getValeur("ParcoursPeda.colonne.date")
				: null,
		},
		{
			id: DonneesListe_ParcoursPeda.colonnes.description,
			taille: 400,
			titre: this.params.avecTitres
				? GTraductions.getValeur("ParcoursPeda.colonne.description")
				: null,
		},
		{
			id: DonneesListe_ParcoursPeda.colonnes.type,
			taille: 100,
			titre: this.params.avecTitres
				? GTraductions.getValeur("ParcoursPeda.colonne.type")
				: null,
			hint: this.params.avecTitres
				? GTraductions.getValeur("ParcoursPeda.colonne.hint_type")
				: null,
		},
		{
			id: DonneesListe_ParcoursPeda.colonnes.suiviPar,
			taille: 160,
			titre: this.params.avecTitres
				? GTraductions.getValeur("ParcoursPeda.colonne.suiviPar")
				: null,
		},
	];
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		listeCreations: this.params.droits.avecSaisie
			? [DonneesListe_ParcoursPeda.colonnes.description]
			: null,
		avecLigneCreation: !!this.params.droits.avecSaisie,
		titreCreation: GTraductions.getValeur("ParcoursPeda.TitreCreation"),
		hauteurAdapteContenu: ![
			EGenreEspace.Professeur,
			EGenreEspace.Etablissement,
			EGenreEspace.PrimProfesseur,
			EGenreEspace.PrimDirection,
		].includes(GEtatUtilisateur.GenreEspace),
		hauteurMaxAdapteContenu: 200,
	});
	GEtatUtilisateur.setTriListe({
		liste: aInstance,
		tri: [DonneesListe_ParcoursPeda.colonnes.date],
	});
}
function majEltCumulSurSuppression(aEltCumul, aTabNumeroAIgnorer) {
	let lCumulEstPere = false;
	this.listeFormatee.parcourir((D) => {
		if (
			D &&
			D.pere &&
			D.pere.getNumero() === aEltCumul.getNumero() &&
			(!aEltCumul.pere ||
				(D.pere.pere &&
					aEltCumul.pere.getNumero() === D.pere.pere.getNumero())) &&
			D.existe() &&
			(aTabNumeroAIgnorer.length === 0 ||
				!aTabNumeroAIgnorer.includes(D.getNumero()))
		) {
			lCumulEstPere = true;
			return false;
		}
	});
	if (lCumulEstPere === true) {
		aEltCumul.nbParcours--;
		if (aEltCumul.pere) {
			aEltCumul.pere.nbParcours--;
		}
	} else {
		aEltCumul.setEtat(EGenreEtat.Suppression);
		if (aEltCumul.pere) {
			majEltCumulSurSuppression.bind(this)(aEltCumul.pere, []);
		}
	}
}
function _evenementSurListe(aParametres, aGenreEvenement, I, J) {
	switch (aGenreEvenement) {
		case EGenreEvenementListe.Suppression:
			if (
				this.params.filtres.avecCumulParEleves ||
				this.params.filtres.avecCumulParGenreParcours
			) {
				const lElt = this.listeFormatee.get(J);
				if (lElt && lElt.pere) {
					majEltCumulSurSuppression.bind(this)(lElt.pere, [lElt.getNumero()]);
				}
			}
			break;
		case EGenreEvenementListe.Creation:
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				titre: GTraductions.getValeur("SaisieImpossible"),
				message: GTraductions.getValeur("PeriodeCloturee"),
			});
			return EGenreEvenementListe.Creation;
		case EGenreEvenementListe.ApresEdition:
		case EGenreEvenementListe.ApresCreation:
		case EGenreEvenementListe.ApresSuppression:
			_validerModification.call(this);
			break;
	}
}
function _validerModification() {
	Promise.resolve()
		.then(() => {
			return new ObjetRequeteSaisieParcoursEducatifs(this).lancerRequete(
				this._getDonneesSaisie(),
			);
		})
		.then(
			() => {
				return this.recupererDonnees(this.contexte);
			},
			(aParams) => {
				return aParams;
			},
		)
		.then(() => {
			this.setDonnees(this.params);
		});
}
module.exports = { InterfaceParcoursPeda };
