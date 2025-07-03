exports.ObjetFenetre_SignalementPunition = void 0;
const DonneesListe_Simple_1 = require("DonneesListe_Simple");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequeteSaisieListePunitions_1 = require("ObjetRequeteSaisieListePunitions");
const TypeGenrePunition_1 = require("TypeGenrePunition");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const ObjetUtilitaireAbsence_1 = require("ObjetUtilitaireAbsence");
const DonneesListe_SelectionMotifsPunition_1 = require("DonneesListe_SelectionMotifsPunition");
const ObjetFenetre_SaisieCreationMotif_1 = require("ObjetFenetre_SaisieCreationMotif");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetListeElements_1 = require("ObjetListeElements");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_SignalementPunition extends ObjetFenetre_Liste_1.ObjetFenetre_Liste {
	constructor(...aParams) {
		super(...aParams);
		this.parametresSco = (0, AccessApp_1.getApp)().getObjetParametres();
		this.avecCumuls = false;
		this.setOptionsFenetre({
			largeur: 600,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecComposeBasInFooter: true,
		});
	}
	construireInstances() {
		this.identListeNature = this.add(
			ObjetListe_1.ObjetListe,
			this._evnementListeNatures.bind(this),
			this._initialiserListeNatures,
		);
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evntSurDate.bind(this),
			this._initDate.bind(this),
		);
		this.identHeure = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evntSurHeure.bind(this),
			this._initHeure.bind(this),
		);
		this.identDuree = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evntSurDuree.bind(this),
			this._initDuree.bind(this),
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			this.initialiserListe,
		);
		this.identFenetreCreationMotif = this.addFenetre(
			ObjetFenetre_SaisieCreationMotif_1.ObjetFenetre_SaisieCreationMotif,
			this.evenementFenetreCreationMotif,
		);
	}
	initialiserListe(aInstance) {
		const lAvecCreationMotifs = (0, AccessApp_1.getApp)().droits.get(
			ObjetDroitsPN_1.TypeDroits.creerMotifIncidentPunitionSanction,
		);
		const lcheckAvecCumuls = () => {
			return {
				getValue: () => {
					return this.avecCumuls;
				},
				setValue: (aValue) => {
					this.avecCumuls = aValue;
					this.refreshAffichage();
				},
			};
		};
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecLigneCreation: !!lAvecCreationMotifs,
			boutons: [
				{
					getHtml: () =>
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-textleft": true, "ie-model": lcheckAvecCumuls },
							ObjetTraduction_1.GTraductions.getValeur("punition.avecCumuls"),
						),
				},
			],
		});
	}
	evenementSurListe(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementListe_1.EGenreEvenementListe.Creation
		) {
			this.ouvrirFenetreCreation();
		}
	}
	ouvrirFenetreCreation() {
		this.getInstance(this.identFenetreCreationMotif).setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("fenetreMotifs.titre"),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.getInstance(this.identFenetreCreationMotif).setDonnees({
			listeSousCategorieDossier: this.listeSousCategorieDossier,
		});
	}
	evenementFenetreCreationMotif(aGenreBouton, aMotif) {
		if (aGenreBouton === 1) {
			this.nouveauMotif = aMotif;
			aMotif.publication = false;
			aMotif.dossierObligatoire = false;
			this.motifs.add(aMotif);
			this.refreshAffichage();
		}
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
		this.listeSousCategorieDossier = aParam.listeSousCategorieDossier;
		this.afficher();
		this.avecValidation = aParam.avecValidation;
		this.setBoutonActif(1, false);
		this.getInstance(this.identListeNature).setDonnees(
			new DonneesListe_Simple_1.DonneesListe_Simple(
				aParam.listeNaturePunitions,
			),
		);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_SelectionMotifsPunition_1.DonneesListe_SelectionMotifsPunition(
				this.motifs,
				{ avecCumuls: this.avecCumuls },
			),
		);
		this.getInstance(this.identDate).setDonnees(this.punition.dateDemande);
	}
	composeContenu() {
		const T = [];
		T.push(
			`<div class="flex-contain cols full-size">\n              <div class="flex-contain flex-center p-y-l flex-gap">`,
		);
		T.push(
			`${ObjetTraduction_1.GTraductions.getValeur("punition.titre.Date")}<div class="m-right-l" id="${this.getNomInstance(this.identDate)}"></div>`,
		);
		T.push(
			`${ObjetTraduction_1.GTraductions.getValeur("punition.heure")}<div class="m-right-l" id="${this.getNomInstance(this.identHeure)}"></div>`,
		);
		T.push(
			`${ObjetTraduction_1.GTraductions.getValeur("punition.duree")}<div id="${this.getNomInstance(this.identDuree)}"></div>`,
		);
		T.push(`</div>`);
		T.push(` <div class="flex-contain fluid-bloc">`);
		T.push(
			`  <div class="fix-bloc flex-contain cols flex-gap" style="width: 200px;">\n                <div class="fix-bloc">${ObjetTraduction_1.GTraductions.getValeur("punition.titreChoixNature")}</div>\n                <div class="fluid-bloc" id="${this.getNomInstance(this.identListeNature)}"></div>\n              </div>`,
		);
		T.push(
			`  <div class="fluid-bloc flex-contain cols flex-gap">\n                <div class="fix-bloc">${ObjetTraduction_1.GTraductions.getValeur("punition.titreChoixMotif")}</div>\n\n                <div class="fluid-bloc" id="${this.getNomInstance(this.identListe)}"></div>\n              </div>`,
		);
		T.push(`</div>`);
		return T.join("");
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			this._validationAuto(aGenreBouton);
		} else {
			this._finSurValidation(aGenreBouton);
		}
	}
	refreshAffichage() {
		this.tempMotifs = MethodesObjet_1.MethodesObjet.dupliquer(this.motifs);
		this.tempMotifs.parcourir((aMotif) => {
			if (aMotif.cumulPere && aMotif.pere === undefined) {
				aMotif.pere = aMotif.cumulPere;
			}
		});
		if (!!this.avecCumuls) {
			this.getListeSousCategorieDossier();
		} else {
			this.supprimeMotifPere();
		}
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_SelectionMotifsPunition_1.DonneesListe_SelectionMotifsPunition(
				this.tempMotifs,
				{ avecCumuls: this.avecCumuls },
			),
		);
	}
	getListeSousCategorieDossier() {
		const lListeSousCategorieDossier =
			new ObjetListeElements_1.ObjetListeElements();
		const lAutreMotifs = new ObjetElement_1.ObjetElement();
		lAutreMotifs.setLibelle(
			ObjetTraduction_1.GTraductions.getValeur("punition.autresMotifs"),
		);
		lAutreMotifs.estPere = true;
		lAutreMotifs.estUnDeploiement = true;
		lAutreMotifs.estDeploye = true;
		lAutreMotifs.cmsActif = true;
		this.tempMotifs.parcourir((D) => {
			if (D.sousCategorieDossier) {
				const cumul = D.sousCategorieDossier;
				cumul.estPere = true;
				cumul.estUnDeploiement = true;
				cumul.estDeploye = true;
				cumul.cmsActif = true;
				D.pere = cumul;
				D.sauvegardePere = cumul;
				const lElementSousDossier =
					lListeSousCategorieDossier.getElementParElement(
						D.sousCategorieDossier,
					);
				if (!lElementSousDossier) {
					lListeSousCategorieDossier.add(cumul);
					const lCumulExisteDansMotifs = this.tempMotifs.getElementParLibelle(
						D.sousCategorieDossier.getLibelle(),
					);
					if (!lCumulExisteDansMotifs) {
						this.tempMotifs.add(cumul);
					}
				} else if (!!lElementSousDossier) {
					D.pere = lElementSousDossier;
				}
			} else if (!D.sousCategorieDossier && !D.estUnDeploiement) {
				D.pere = lAutreMotifs;
				D.sousCatgeorieDossier = lAutreMotifs;
			}
		});
		if (
			!this.tempMotifs.getElementParLibelle(
				ObjetTraduction_1.GTraductions.getValeur("punition.autresMotifs"),
			)
		) {
			this.tempMotifs.add(lAutreMotifs);
		}
	}
	supprimeMotifPere() {
		if (!this.avecCumuls) {
			this.tempMotifs.parcourir((aMotif) => {
				if (aMotif.pere) {
					aMotif.cumulPere = aMotif.pere;
					aMotif.pere = undefined;
				}
			});
		}
	}
	_evntSurDate(aDate) {
		let lPlace = ObjetDate_1.GDate.dateEnPlaceAnnuelle(
			this.punition.dateDemande,
		);
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
		lPlace = ObjetDate_1.GDate.dateEnPlaceAnnuelle(this.punition.dateDemande);
		this.punition.placeDemande = lPlace + lPlaceJour;
	}
	_evntSurHeure(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.punition
		) {
			this.punition.place = aParams.element.getGenre();
			this.punition.horsCours = aParams.element.getGenre() === -1;
			if (aParams.element.getGenre() !== -1) {
				const lPlace = ObjetDate_1.GDate.dateEnPlaceAnnuelle(
					this.punition.dateDemande,
				);
				this.punition.placeDemande = lPlace + aParams.element.getGenre();
			} else {
				this.punition.placeDemande = 0;
			}
		}
	}
	_evntSurDuree(aParams) {
		const lInstanceCombo = this.getInstance(this.identDuree);
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			lInstanceCombo.estUneInteractionUtilisateur() &&
			this.punition &&
			this.punition.duree !== aParams.element.getGenre()
		) {
			this.punition.duree = aParams.element.getGenre();
		}
	}
	_initialiserListeNatures(aInstance) {
		const lColonnes = [];
		lColonnes.push({ taille: "100%" });
		aInstance.setOptionsListe({ colonnes: lColonnes });
	}
	_evnementListeNatures(aParametres) {
		if (
			aParametres.genreEvenement ===
			Enumere_EvenementListe_1.EGenreEvenementListe.Selection
		) {
			const lElement = aParametres.article;
			this.punition.nature = lElement;
			this.punition.estProgrammable = lElement.programmable;
			this.punition.estPlanifiable =
				lElement.programmable &&
				[
					TypeGenrePunition_1.TypeGenrePunition.GP_Retenues,
					TypeGenrePunition_1.TypeGenrePunition.GP_Autre,
				].includes(lElement.getGenre());
			this.punition.peutEtreMultiSeance =
				this.punition.estPlanifiable &&
				[TypeGenrePunition_1.TypeGenrePunition.GP_Retenues].includes(
					lElement.getGenre(),
				);
			this.punition.peutEtreReporte =
				this.punition.estPlanifiable &&
				[
					TypeGenrePunition_1.TypeGenrePunition.GP_Retenues,
					TypeGenrePunition_1.TypeGenrePunition.GP_Autre,
				].includes(lElement.getGenre());
			const lListe = this.parametresSco.LibellesHeures.getListeElements(
				(aElement, aIndice) => {
					return aIndice < this.parametresSco.PlacesParJour - 1;
				},
			);
			if (
				this.punition.nature.getGenre() !==
				TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours
			) {
				const lHorsCours = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("punition.horsCours"),
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
					lDureeRecherchee = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
						lElement.dureeParDefaut,
					);
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
	_initDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({ classeCSSTexte: " " });
		aInstance.setParametresFenetre(
			this.parametresSco.PremierLundi,
			this.parametresSco.PremiereDate,
			this.parametresSco.DerniereDate,
			this.parametresSco.JoursOuvres,
			null,
			this.parametresSco.JoursFeries,
			null,
		);
	}
	_initHeure(aInstance) {
		aInstance.setOptionsObjetSaisie({
			mode: Enumere_Saisie_1.EGenreSaisie.Combo,
			longueur: 70,
			hauteur: 17,
			classTexte: "",
			deroulerListeSeulementSiPlusieursElements: false,
			initAutoSelectionAvecUnElement: false,
			labelWAICellule:
				ObjetTraduction_1.GTraductions.getValeur("punition.heure"),
		});
		aInstance.setActif(false);
	}
	_initDuree(aInstance) {
		aInstance.setOptionsObjetSaisie({
			mode: Enumere_Saisie_1.EGenreSaisie.Combo,
			longueur: 60,
			hauteur: 17,
			classTexte: "",
			deroulerListeSeulementSiPlusieursElements: false,
			initAutoSelectionAvecUnElement: false,
			labelWAICellule:
				ObjetTraduction_1.GTraductions.getValeur("punition.duree"),
		});
		aInstance.setActif(false);
	}
	_validationAuto(aGenreBouton) {
		if (this.punition) {
			if (!this.tempMotifs) {
				this.tempMotifs = MethodesObjet_1.MethodesObjet.dupliquer(this.motifs);
			}
			const lListeActif = this.tempMotifs.getListeElements((aElement) => {
				return aElement.cmsActif && !aElement.estUnDeploiement;
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
					ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getDatePublicationPunitionParDefaut(
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
			this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			this.listePunitions.addElement(this.punition);
			this.setEtatSaisie(true);
			const lObjetSaisie = {
				punitions: this.listePunitions,
				motifs: this.motifs,
			};
			new ObjetRequeteSaisieListePunitions_1.ObjetRequeteSaisieListePunitions(
				this,
			)
				.addUpload({ listeFichiers: this.listePJ })
				.lancerRequete(lObjetSaisie)
				.then((aReponse) => {
					this.setEtatSaisie(false);
					this._finSurValidation(aGenreBouton, aReponse.JSONRapportSaisie);
				});
		}
	}
	_finSurValidation(aGenreBouton, aJSON) {
		if (aJSON && aJSON.punition) {
			(0, AccessApp_1.getApp)()
				.getEtatUtilisateur()
				.setNrPunitionSelectionnee(aJSON.punition.getNumero());
		}
		const lMaSelection = this.getInstance(this.identListe).getSelection();
		this.fermer();
		this.callback.appel(
			aGenreBouton,
			lMaSelection,
			this.changementListe,
			aJSON,
		);
	}
}
exports.ObjetFenetre_SignalementPunition = ObjetFenetre_SignalementPunition;
