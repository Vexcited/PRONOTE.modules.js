exports.ObjetFenetre_ListeMemosEleves = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const DonneesListe_MemosEleves_1 = require("DonneesListe_MemosEleves");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_MemoEleve_1 = require("ObjetFenetre_MemoEleve");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetRequeteSaisieMemoEleve_1 = require("ObjetRequeteSaisieMemoEleve");
const ObjetRequeteListeMemosEleves_1 = require("ObjetRequeteListeMemosEleves");
const ObjetElement_1 = require("ObjetElement");
const ObjetFenetre_EditionObservation_1 = require("ObjetFenetre_EditionObservation");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
const ObjetDate_1 = require("ObjetDate");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_ListeMemosEleves extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.parametresMemosEleves = {
			estValorisation: false,
			forcerConsultation: false,
		};
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.memo"),
			largeur: 450,
			hauteur: 460,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	setParametresMemosEleves(aParametres) {
		$.extend(this.parametresMemosEleves, aParametres);
		return this;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.index === 1) {
						let lAvecModif = false;
						if (aInstance.listeMemosEleves) {
							aInstance.listeMemosEleves.parcourir((D) => {
								if (D.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun) {
									lAvecModif = true;
									return false;
								}
							});
						}
						return !lAvecModif;
					}
					return (
						aInstance.optionsFenetre.listeBoutonsInactifs[
							aBoutonRepeat.element.index
						] === true
					);
				},
			},
		});
	}
	construireInstances() {
		this.identListeMemosEleves = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeMemo.bind(this),
		);
	}
	actualiser() {
		new ObjetRequeteListeMemosEleves_1.ObjetRequeteListeMemosEleves(
			this,
			this._actionSurRecupererDonnees.bind(this),
		).lancerRequete({
			eleve: this.eleve,
			estValorisation: this.parametresMemosEleves.estValorisation,
		});
	}
	setDonnees(aEleve) {
		this.existeEstExpire = false;
		this.eleve = aEleve;
		const lTitre = this.parametresMemosEleves.estValorisation
			? ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.titreFenetreValorisation",
					[this.eleve.getLibelle()],
				)
			: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.titreFenetreMemo", [
					this.eleve.getLibelle(),
				]);
		this.setOptionsFenetre({ titre: lTitre });
		this.actualiser();
	}
	composeContenu() {
		const H = [];
		H.push(
			'<div id="' +
				this.getNomInstance(this.identListeMemosEleves) +
				'" style="width: 100%; height: 100%"></div>',
		);
		return H.join("");
	}
	initialiserListeMemosEleves(aInstance) {
		const lTitreCreation = this.parametresMemosEleves.estValorisation
			? ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.CreerUnValorisation",
				)
			: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.CreerUnMemo");
		const lSaisie =
			!this.parametresMemosEleves.forcerConsultation &&
			(this.parametresMemosEleves.estValorisation
				? this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.absences.avecSaisieEncouragements,
					)
				: this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.dossierVS.saisirMemos,
					));
		const lTitreAucun = this.parametresMemosEleves.estValorisation
			? ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.aucunEncouragementValorisation",
				)
			: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.aucunMemo");
		aInstance.setOptionsListe({
			colonnes: [{ taille: "100%" }],
			avecLigneCreation: lSaisie,
			titreCreation: lTitreCreation,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			forcerOmbreScrollBottom: true,
			nonEditableSurModeExclusif: true,
			messageContenuVide: lTitreAucun,
		});
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(
			aNumeroBouton,
			this.parametresMemosEleves.estValorisation,
		);
	}
	_actionSurRecupererDonnees(aParam) {
		this.listeMemosEleves = aParam.listeMemosEleves;
		for (
			let i = 0;
			!this.existeEstExpire && i < this.listeMemosEleves.count();
			i++
		) {
			const lMemo = this.listeMemosEleves.get(i);
			if (lMemo.estExpire) {
				this.existeEstExpire = true;
			}
		}
		this.initialiserListeMemosEleves(
			this.getInstance(this.identListeMemosEleves),
		);
		this.afficher();
		this._actualiserListe();
	}
	_actualiserListe() {
		if (this.parametresMemosEleves.estValorisation) {
			if (this.listeMemosEleves) {
				this.eleve.avecValorisation = this.listeMemosEleves.count() > 0;
				this.eleve.listeValorisations = this.listeMemosEleves;
			} else {
				this.eleve.avecValorisation = false;
			}
		} else {
			if (this.listeMemosEleves) {
				this.eleve.avecMemo = this.listeMemosEleves.count() > 0;
				this.eleve.listeMemos = this.listeMemosEleves;
			} else {
				this.eleve.avecMemo = false;
			}
		}
		this.getInstance(this.identListeMemosEleves).setDonnees(
			new DonneesListe_MemosEleves_1.DonneesListe_MemosEleves(
				this.listeMemosEleves,
				this.parametresMemosEleves,
			),
		);
	}
	_evenementListeMemo(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				if (this.parametresMemosEleves.estValorisation) {
					const lThis = this;
					const lElement = ObjetElement_1.ObjetElement.create({
						Libelle: "",
						commentaire: "",
						observation: new ObjetElement_1.ObjetElement(""),
						estPubliee: true,
						date: ObjetDate_1.GDate.getDateJour(null, true),
						numeroObservation:
							TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement,
						dateVisu: undefined,
					});
					lElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					const lObjet = {
						observation: lElement,
						numeroObservation: 2,
						genreEtat: Enumere_Etat_1.EGenreEtat.Creation,
						typeObservation:
							TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement,
						publiable: true,
						avecDate: false,
						actif: true,
						maxlengthCommentaire: 1000,
					};
					const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_EditionObservation_1.ObjetFenetre_EditionObservation,
						{
							pere: this,
							evenement: (
								aSaisie,
								aGenreAbsence,
								aGenreObservation,
								aEstBtnValidation,
							) => {
								if (aSaisie) {
									const lListeMemo =
										new ObjetListeElements_1.ObjetListeElements();
									lElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
									lListeMemo.add(lElement);
									new ObjetRequeteSaisieMemoEleve_1.ObjetRequeteSaisieMemoEleve(
										lThis,
									)
										.lancerRequete({
											eleve: lThis.eleve,
											listeMemos: lListeMemo,
											estValorisation:
												lThis.parametresMemosEleves.estValorisation,
										})
										.then(() => {
											if (
												lThis.parametresMemosEleves.estValorisation &&
												!!lThis.parametresMemosEleves.callback
											) {
												lThis.parametresMemosEleves.callback();
											}
											lThis.actualiser();
										});
								}
							},
							initialiser: function (aInstance) {
								aInstance.setOptionsFenetre({ largeur: 480, hauteur: 240 });
							},
						},
						{
							fermerFenetreSurClicHorsFenetre: true,
							avecCroixFermeture: false,
						},
					);
					lFenetre.setDonnees(lObjet);
					lFenetre.afficher();
				} else {
					this._ouvrirFenetreMemo();
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (this.parametresMemosEleves.estValorisation) {
					aParametres.article.commentaire = aParametres.article.getLibelle();
					const lArticle = aParametres.article;
					const lObjet = {
						observation: lArticle,
						numeroObservation: aParametres.article.typeObservation,
						genreEtat: Enumere_Etat_1.EGenreEtat.Modification,
						typeObservation: aParametres.article.typeObservation,
						publiable: true,
						avecDate: false,
						actif:
							this.parametresMemosEleves.forcerConsultation ||
							lArticle.editable === false
								? false
								: aParametres.article.typeObservation.editable,
						maxlengthCommentaire: 1000,
					};
					const lThis = this;
					const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_EditionObservation_1.ObjetFenetre_EditionObservation,
						{
							pere: lThis,
							evenement: (
								aSaisie,
								aGenreAbsence,
								aGenreObservation,
								aEstBtnValidation,
							) => {
								if (aSaisie) {
									const lListeMemo =
										new ObjetListeElements_1.ObjetListeElements();
									lListeMemo.add(lArticle);
									new ObjetRequeteSaisieMemoEleve_1.ObjetRequeteSaisieMemoEleve(
										lThis,
									)
										.lancerRequete({
											eleve: lThis.eleve,
											listeMemos: lListeMemo,
											estValorisation:
												lThis.parametresMemosEleves.estValorisation,
										})
										.then(() => {
											if (
												lThis.parametresMemosEleves.estValorisation &&
												!!lThis.parametresMemosEleves.callback
											) {
												lThis.parametresMemosEleves.callback();
											}
											lThis.actualiser();
										});
								}
							},
							initialiser: function (aInstance) {
								aInstance.setOptionsFenetre({ largeur: 480, hauteur: 240 });
							},
						},
						{
							fermerFenetreSurClicHorsFenetre: true,
							avecCroixFermeture: false,
						},
					);
					lFenetre.setDonnees(lObjet);
					lFenetre.afficher();
				} else {
					this._ouvrirFenetreMemo(aParametres.article);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression: {
				const lListeMemo = new ObjetListeElements_1.ObjetListeElements();
				lListeMemo.add(aParametres.article);
				new ObjetRequeteSaisieMemoEleve_1.ObjetRequeteSaisieMemoEleve(this)
					.lancerRequete({
						eleve: this.eleve,
						listeMemos: lListeMemo,
						estValorisation: this.parametresMemosEleves.estValorisation,
					})
					.then(() => {
						this.actualiser();
					});
				break;
			}
		}
	}
	_ouvrirFenetreMemo(aMemo) {
		const lFenetreMemoEleve = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_MemoEleve_1.ObjetFenetre_MemoEleve,
			{
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: this.parametresMemosEleves.estValorisation
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.titreValorisation",
								)
							: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.memo"),
					});
				},
				pere: this,
				evenement: function (aGenreBouton) {
					if (aGenreBouton === 1) {
						this.actualiser();
					}
				},
			},
		);
		lFenetreMemoEleve.setDonnees({
			memo: aMemo,
			eleve: this.eleve,
			estValorisation: this.parametresMemosEleves.estValorisation,
		});
	}
}
exports.ObjetFenetre_ListeMemosEleves = ObjetFenetre_ListeMemosEleves;
