exports.ObjetFenetre_SignalementIncident = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequeteSaisieIncidents_1 = require("ObjetRequeteSaisieIncidents");
const ObjetRequeteSaisieMotifs_1 = require("ObjetRequeteSaisieMotifs");
const GUID_1 = require("GUID");
const DonneesListe_SelectionMotifsPunition_1 = require("DonneesListe_SelectionMotifsPunition");
const ObjetFenetre_SaisieCreationMotif_1 = require("ObjetFenetre_SaisieCreationMotif");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_SignalementIncident extends ObjetFenetre_Liste_1.ObjetFenetre_Liste {
	constructor() {
		super(...arguments);
		this.avecCumuls = false;
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			this.initialiserListe,
		);
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evntSurDate.bind(this),
			this._initDate.bind(this),
		);
		this.identFenetreCreationMotif = this.addFenetre(
			ObjetFenetre_SaisieCreationMotif_1.ObjetFenetre_SaisieCreationMotif,
			this.evenementFenetreCreationMotif,
		);
	}
	initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecLigneCreation: this.paramsListe.avecLigneCreation,
			boutons: [
				{
					getHtml: () =>
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-textleft": true,
								"ie-model": this.jsxcheckAvecCumuls.bind(this),
							},
							ObjetTraduction_1.GTraductions.getValeur("punition.avecCumuls"),
						),
				},
			],
		});
	}
	jsxcheckAvecCumuls() {
		return {
			getValue: () => {
				return this.avecCumuls;
			},
			setValue: (aValue) => {
				this.avecCumuls = aValue;
				this.refreshAffichage();
			},
		};
	}
	evenementSurListe(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementListe_1.EGenreEvenementListe.Creation
		) {
			this.ouvrirFenetreCreation();
		}
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
	setDonneesSignalement(aParam) {
		this.incident = aParam.incident;
		this.incidents = aParam.incidents;
		this.motifs = aParam.motifs;
		this.listePJ = aParam.listePJ;
		this.listeSousCategorieDossier = aParam.listeSousCategorieDossier;
		this.afficher();
		this.avecValidation = aParam.avecValidation;
		this.setBoutonActif(1, false);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_SelectionMotifsPunition_1.DonneesListe_SelectionMotifsPunition(
				this.motifs,
				{ avecCumuls: this.avecCumuls },
			),
		);
		this.getInstance(this.identDate).setDonnees(this.incident.dateheure);
	}
	jsxheure() {
		return {
			getValue: () => {
				return this.incident
					? ObjetDate_1.GDate.formatDate(this.incident.dateheure, "%hh:%mm")
					: "";
			},
			setValue: (aValue, aParamsSetter) => {
				const lDate = new Date(
					this.incident.dateheure.getFullYear(),
					this.incident.dateheure.getMonth(),
					this.incident.dateheure.getDate(),
					aParamsSetter.time.heure,
					aParamsSetter.time.minute,
				);
				this.incident.dateheure = lDate;
			},
			getDisabled: () => {
				return !this.incident || !this.incident.estEditable;
			},
		};
	}
	composeContenu() {
		const T = [];
		const lIdInputHeure = GUID_1.GUID.getId();
		T.push(
			`<div class="flex-contain cols full-size">\n              <div class="flex-contain flex-center p-y-l flex-gap">`,
		);
		T.push(
			`<label>${ObjetTraduction_1.GTraductions.getValeur("incidents.date")}</label><div class="m-right-l" id="${this.getNomInstance(this.identDate)}"></div>`,
		);
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"label",
					{ for: lIdInputHeure },
					ObjetTraduction_1.GTraductions.getValeur("incidents.heure"),
				),
				IE.jsx.str("input", {
					id: lIdInputHeure,
					type: "time",
					"ie-model": this.jsxheure.bind(this),
				}),
			),
		);
		T.push(` </div>`);
		T.push(
			` <div class="flex-contain fluid-bloc m-top">\n                <div class="full-size" id="${this.getNomInstance(this.identListe)}"></div>\n             </div>`,
		);
		T.push(`</div>`);
		return T.join("");
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			if (!this.tempMotifs) {
				this.tempMotifs = MethodesObjet_1.MethodesObjet.dupliquer(this.motifs);
			}
			if (this.tempMotifs.existeElementPourValidation()) {
				const lListeActif = this.tempMotifs.getListeElements((aElement) => {
					return aElement.cmsActif && !aElement.estUnDeploiement;
				});
				this.requeteSaisieMotifs(lListeActif, this.tempMotifs, aGenreBouton);
			} else {
				this._validationAuto(aGenreBouton);
			}
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
				const lCumul = D.sousCategorieDossier;
				lCumul.estPere = true;
				lCumul.estUnDeploiement = true;
				lCumul.estDeploye = true;
				lCumul.cmsActif = true;
				D.pere = lCumul;
				D.sauvegardePere = lCumul;
				const lElementSousDossier =
					lListeSousCategorieDossier.getElementParElement(
						D.sousCategorieDossier,
					);
				if (!lElementSousDossier) {
					lListeSousCategorieDossier.add(lCumul);
					const lCumulExisteDansMotifs = this.tempMotifs.getElementParLibelle(
						D.sousCategorieDossier.getLibelle(),
					);
					if (!lCumulExisteDansMotifs) {
						this.tempMotifs.add(lCumul);
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
		const lDate = new Date(
			aDate.getFullYear(),
			aDate.getMonth(),
			aDate.getDate(),
			this.incident.dateheure.getHours(),
			this.incident.dateheure.getMinutes(),
		);
		this.incident.dateheure = lDate;
	}
	_initDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({ classeCSSTexte: " " });
		aInstance.setControleNavigation(true);
	}
	requeteSaisieMotifs(aListeDonnees, aListeTot, aGenreBouton) {
		new ObjetRequeteSaisieMotifs_1.ObjetRequeteSaisieMotifs(
			this,
			this._apresRequeteSaisieMotifs.bind(this, aGenreBouton),
		).lancerRequete({
			motifs: aListeTot,
			selection: aListeDonnees,
			avecAucunMotif: false,
		});
	}
	_apresRequeteSaisieMotifs(aGenreBouton, aListeDonnees, aListeTot) {
		if (aListeTot) {
			this.motifs = aListeTot;
		}
		const lArrNew = aListeDonnees.getTableauNumeros();
		this.motifs.parcourir((aElement) => {
			if (lArrNew.includes(aElement.getNumero())) {
				aElement.cmsActif = true;
			}
		});
		this._validationAuto(aGenreBouton);
	}
	_validationAuto(aGenreBouton) {
		if (this.incident) {
			const lListeMotifsConcernes = this.avecCumuls
				? this.tempMotifs
				: this.motifs;
			if (lListeMotifsConcernes) {
				const lListeActif = lListeMotifsConcernes.getListeElements(
					(aElement) => {
						return aElement.cmsActif && !aElement.estUnDeploiement;
					},
				);
				const lAvecMotifFaitDeViolence =
					lListeActif.getIndiceElementParFiltre((aElement) => {
						return aElement.estFaitDeViolence;
					}) > -1;
				this.incident.faitDeViolence = lAvecMotifFaitDeViolence;
				this.incident.listeMotifs = lListeActif;
				this.incident.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				this.incidents.addElement(this.incident);
				this.setEtatSaisie(true);
				const lObjetSaisie = {
					incidents: this.incidents,
					motifs: lListeMotifsConcernes,
				};
				new ObjetRequeteSaisieIncidents_1.ObjetRequeteSaisieIncidents(this)
					.addUpload({ listeFichiers: this.listePJ })
					.lancerRequete(lObjetSaisie)
					.then((aReponse) => {
						this.setEtatSaisie(false);
						this._finSurValidation(aGenreBouton, aReponse.JSONRapportSaisie);
					});
			}
		}
	}
	_finSurValidation(aGenreBouton, aJSON) {
		if (aJSON && aJSON.incident) {
			(0, AccessApp_1.getApp)()
				.getEtatUtilisateur()
				.setNrIncidentSelectionne(aJSON.incident.getNumero());
		}
		const lMaSelection = this.getInstance(this.identListe).getSelection();
		this.fermer();
		if (this.optionsFenetre.callback) {
			this.optionsFenetre.callback(
				aGenreBouton,
				lMaSelection,
				this.changementListe,
			);
		}
		this.callback.appel(aGenreBouton, lMaSelection, this.changementListe);
	}
}
exports.ObjetFenetre_SignalementIncident = ObjetFenetre_SignalementIncident;
