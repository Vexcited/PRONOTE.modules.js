exports.InterfaceParcoursPeda = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreMaquetteBulletin_1 = require("TypeGenreMaquetteBulletin");
const TypeGenreParcoursEducatif_1 = require("TypeGenreParcoursEducatif");
const DonneesListe_ParcoursPeda_1 = require("DonneesListe_ParcoursPeda");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const MultiObjetRequeteParcoursEducatif = require("ObjetRequeteParcoursEducatif");
const MultiObjetRequeteSaisieParcoursEducatifs = require("ObjetRequeteSaisieParcoursEducatifs");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
class InterfaceParcoursPeda extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.listeFormatee = new ObjetListeElements_1.ObjetListeElements();
		this._avecEventResizeNavigateur = true;
		this.params = {
			periodeCloture: false,
			droits: { avecSaisie: false },
			filtres: {
				avecCumulParEleves: false,
				avecCumulParGenreParcours: false,
				genreParcours: null,
			},
			genreMaquette:
				TypeGenreMaquetteBulletin_1.TypeGenreMaquetteBulletin.tGMB_Notes,
			avecTitres: true,
			avecCompteurSurCumul: false,
		};
	}
	setAvecEventResizeNavigateur(aVal) {
		this._avecEventResizeNavigateur = aVal;
	}
	avecEventResizeNavigateur() {
		return this._avecEventResizeNavigateur
			? super.avecEventResizeNavigateur()
			: false;
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe.bind(this),
			this._initialiserListe.bind(this),
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = false;
		this.AvecCadre = false;
	}
	recupererDonnees() {
		this.recupererDonnees2();
	}
	recupererDonnees2(aParam) {
		if (aParam) {
			this.contexte = aParam;
			return new MultiObjetRequeteParcoursEducatif.ObjetRequeteParcoursEducatif(
				this,
			)
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
			ObjetHtml_1.GHtml.setHtml(
				this.Nom,
				this.composeMessage(
					ObjetTraduction_1.GTraductions.getValeur(
						"ParcoursPeda.MsgAucunParcours",
					),
				),
			);
		} else {
			this.initialiser(true);
			this._formaterDonneesSelonOptions(this.listeParcours, aParam.filtres);
			this.donneesListe =
				new DonneesListe_ParcoursPeda_1.DonneesListe_ParcoursPeda({
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
	getDonneesSaisie() {
		return {
			listeParcours: this.listeFormatee,
			periode: (0, AccessApp_1.getApp)()
				.getEtatUtilisateur()
				.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Periode),
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
		this.listeFormatee = new ObjetListeElements_1.ObjetListeElements();
		let lListeCumulsGenreParcours;
		let lTabListeCumulsEleves;
		let lListeCumulsEleves;
		if (aOptions.avecCumulParGenreParcours) {
			lListeCumulsGenreParcours = new ObjetListeElements_1.ObjetListeElements();
		}
		if (aOptions.avecCumulParEleves) {
			if (aOptions.avecCumulParGenreParcours) {
				lTabListeCumulsEleves = [];
				for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
					TypeGenreParcoursEducatif_1.TypeGenreParcoursEducatif,
				)) {
					const lGenre =
						TypeGenreParcoursEducatif_1.TypeGenreParcoursEducatif[lKey];
					lTabListeCumulsEleves[lGenre] =
						new ObjetListeElements_1.ObjetListeElements();
				}
			} else {
				lListeCumulsEleves = new ObjetListeElements_1.ObjetListeElements();
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
						lCumulGenreParcours = new ObjetElement_1.ObjetElement(
							TypeGenreParcoursEducatif_1.TypeGenreParcoursEducatifUtil.getLibelle(
								lGenreParcours,
							),
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
						lCumul = new ObjetElement_1.ObjetElement(
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
	_initialiserListe(aInstance) {
		const lColonnes = [
			{
				id: DonneesListe_ParcoursPeda_1.DonneesListe_ParcoursPeda.colonnes.date,
				taille: 60,
				titre: this.params.avecTitres
					? ObjetTraduction_1.GTraductions.getValeur(
							"ParcoursPeda.colonne.date",
						)
					: null,
			},
			{
				id: DonneesListe_ParcoursPeda_1.DonneesListe_ParcoursPeda.colonnes
					.description,
				taille: 400,
				titre: this.params.avecTitres
					? ObjetTraduction_1.GTraductions.getValeur(
							"ParcoursPeda.colonne.description",
						)
					: null,
			},
			{
				id: DonneesListe_ParcoursPeda_1.DonneesListe_ParcoursPeda.colonnes.type,
				taille: 100,
				titre: this.params.avecTitres
					? ObjetTraduction_1.GTraductions.getValeur(
							"ParcoursPeda.colonne.type",
						)
					: null,
				hint: this.params.avecTitres
					? ObjetTraduction_1.GTraductions.getValeur(
							"ParcoursPeda.colonne.hint_type",
						)
					: null,
			},
			{
				id: DonneesListe_ParcoursPeda_1.DonneesListe_ParcoursPeda.colonnes
					.suiviPar,
				taille: 160,
				titre: this.params.avecTitres
					? ObjetTraduction_1.GTraductions.getValeur(
							"ParcoursPeda.colonne.suiviPar",
						)
					: null,
			},
		];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			listeCreations: this.params.droits.avecSaisie
				? [
						DonneesListe_ParcoursPeda_1.DonneesListe_ParcoursPeda.colonnes
							.description,
					]
				: null,
			avecLigneCreation: !!this.params.droits.avecSaisie,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"ParcoursPeda.TitreCreation",
			),
			hauteurAdapteContenu: ![
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace),
			hauteurMaxAdapteContenu: 200,
			ariaLabel: this.options.ariaLabelListe || undefined,
		});
		GEtatUtilisateur.setTriListe({
			liste: aInstance,
			tri: [
				DonneesListe_ParcoursPeda_1.DonneesListe_ParcoursPeda.colonnes.date,
			],
		});
	}
	majEltCumulSurSuppression(aEltCumul, aTabNumeroAIgnorer) {
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
		if (lCumulEstPere) {
			aEltCumul.nbParcours--;
			if (aEltCumul.pere) {
				aEltCumul.pere.nbParcours--;
			}
		} else {
			aEltCumul.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			if (aEltCumul.pere) {
				this.majEltCumulSurSuppression(aEltCumul.pere, []);
			}
		}
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				if (
					this.params.filtres.avecCumulParEleves ||
					this.params.filtres.avecCumulParGenreParcours
				) {
					const lElt = this.listeFormatee.get(aParametres.ligne);
					if (lElt && lElt.pere) {
						this.majEltCumulSurSuppression(lElt.pere, [lElt.getNumero()]);
					}
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					titre: ObjetTraduction_1.GTraductions.getValeur("SaisieImpossible"),
					message: ObjetTraduction_1.GTraductions.getValeur("PeriodeCloturee"),
				});
				return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				this._validerModification();
				break;
		}
	}
	_validerModification() {
		Promise.resolve()
			.then(() => {
				return new MultiObjetRequeteSaisieParcoursEducatifs.ObjetRequeteSaisieParcoursEducatifs(
					this,
				).lancerRequete(this.getDonneesSaisie());
			})
			.then(
				() => {
					return this.recupererDonnees2(this.contexte);
				},
				(aParams) => {
					return aParams;
				},
			)
			.then(() => {
				this.setDonnees(this.params);
			});
	}
}
exports.InterfaceParcoursPeda = InterfaceParcoursPeda;
