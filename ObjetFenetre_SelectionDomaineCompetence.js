exports.ObjetFenetre_SelectionDomaineCompetence = void 0;
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_SelectionDomaineCompetence_1 = require("DonneesListe_SelectionDomaineCompetence");
const ObjetRequeteSaisieCompetencesGrilles_1 = require("ObjetRequeteSaisieCompetencesGrilles");
const TypeReferentielGrilleCompetence_1 = require("TypeReferentielGrilleCompetence");
class ObjetFenetre_SelectionDomaineCompetence extends ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource {
	constructor(...aParams) {
		super(...aParams);
		this._options = this._options || {};
		this._options.avecCreation = false;
		this._options.avecEdition = false;
		this._options.avecSuppression = false;
		this._options.commandeSaisie = null;
		this._options.commandeSuppression = null;
		this._options.avecColonneLVE = true;
	}
	setOptionsFenetreSelectionRessource(aOptions) {
		super.setOptionsFenetreSelectionRessource(aOptions);
	}
	_creerObjetDonneesListe() {
		return new DonneesListe_SelectionDomaineCompetence_1.DonneesListe_SelectionDomaineCompetence(
			this.listeRessources,
			{
				avecEdition: this._options.avecEdition,
				avecSuppression: this._options.avecSuppression,
			},
		);
	}
	_initialiserListe(aInstance) {
		const lColonnes = [];
		if (this._options.avecCocheRessources) {
			lColonnes.push({
				id: DonneesListe_SelectionDomaineCompetence_1
					.DonneesListe_SelectionDomaineCompetence.colonnes.coche,
				taille: 20,
			});
		}
		lColonnes.push({
			id: DonneesListe_SelectionDomaineCompetence_1
				.DonneesListe_SelectionDomaineCompetence.colonnes.libelle,
			taille: "100%",
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"competencesGrilles.GrilleCompetences.AjoutDomaine.Libelle",
			),
		});
		if (this._options.avecColonneLVE) {
			lColonnes.push({
				id: DonneesListe_SelectionDomaineCompetence_1
					.DonneesListe_SelectionDomaineCompetence.colonnes.lve,
				taille: 60,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"competencesGrilles.GrilleCompetences.AjoutDomaine.LVE",
				),
			});
		}
		const lOptionsListe = { colonnes: lColonnes, avecRollover: false };
		if (this._options.avecCreation === true) {
			Object.assign(lOptionsListe, {
				listeCreations: [
					DonneesListe_SelectionDomaineCompetence_1
						.DonneesListe_SelectionDomaineCompetence.colonnes.libelle,
				],
				avecLigneCreation: true,
				titreCreation: ObjetTraduction_1.GTraductions.getValeur(
					"competencesGrilles.GrilleCompetences.AjoutDomaine.CreerDomaine",
				),
			});
		}
		aInstance.setOptionsListe(lOptionsListe);
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this._saisie(this._options.commandeSaisie, {
					referentiel: aParametres.article,
				});
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
				this._saisie(this._options.commandeSaisie, {
					referentiel: aParametres.article,
				});
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				this._saisie(this._options.commandeSuppression, {
					referentiel: aParametres.article,
				});
				break;
		}
	}
	surValidation(ANumeroBouton) {
		let lListeDomainesSelectionnes =
			new ObjetListeElements_1.ObjetListeElements();
		if (this._options.avecCocheRessources) {
			this.listeRessources.parcourir((D) => {
				if (!!D.selectionne) {
					lListeDomainesSelectionnes.addElement(D);
				}
			});
		} else {
			lListeDomainesSelectionnes = this.getInstance(
				this.identListe,
			).getListeElementsSelection();
		}
		this.fermer();
		this.callback.appel(ANumeroBouton, lListeDomainesSelectionnes);
	}
	_saisie(aCommande, aParametresSaisie) {
		const lParametresSaisie = $.extend(
			{
				commande: aCommande,
				genreReferentiel:
					TypeReferentielGrilleCompetence_1.TypeGenreReferentiel
						.GR_PilierDeCompetence,
			},
			aParametresSaisie,
		);
		new ObjetRequeteSaisieCompetencesGrilles_1.ObjetRequeteSaisieCompetencesGrilles(
			this,
			function (aJSONRapportSaisie, aJSONReponse) {
				if (aCommande === this._options.commandeSaisie) {
					if (aJSONRapportSaisie && aJSONRapportSaisie.Pilier) {
						aParametresSaisie.referentiel.setEtat(
							Enumere_Etat_1.EGenreEtat.Aucun,
						);
						aParametresSaisie.referentiel.setNumero(
							aJSONRapportSaisie.Pilier.getNumero(),
						);
					}
				} else if (aCommande === this._options.commandeSuppression) {
					if (
						aJSONReponse &&
						(aJSONReponse.messageConfirmation ||
							aJSONReponse.messageInformation)
					) {
						const lThis = this;
						if (!!aJSONReponse.messageConfirmation) {
							GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: aJSONReponse.messageConfirmation,
								callback: function (aGenreAction) {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										const lParametresSaisieAvecConfirmation = $.extend(
											{ confirmation: true },
											lParametresSaisie,
										);
										lThis._saisie(aCommande, lParametresSaisieAvecConfirmation);
									}
								},
							});
						} else {
							GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message: aJSONReponse.messageInformation,
							});
						}
					} else {
						const lIndice = this.listeRessources.getIndiceParElement(
							lParametresSaisie.referentiel,
						);
						this.listeRessources.remove(lIndice);
						this._actualiserListe();
					}
				}
			},
		).lancerRequete(lParametresSaisie);
	}
}
exports.ObjetFenetre_SelectionDomaineCompetence =
	ObjetFenetre_SelectionDomaineCompetence;
