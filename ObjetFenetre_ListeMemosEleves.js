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
class ObjetFenetre_ListeMemosEleves extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.memo"),
			largeur: 450,
			hauteur: 460,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
		this.estValorisation = false;
	}
	setOptionsListeMemosEleve(aOptions) {
		this.optionsListeMemosEleve = aOptions;
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
			estValorisation: this.estValorisation,
		});
	}
	setDonnees(aEstValorisation, aEleve) {
		this.estValorisation = !!aEstValorisation;
		this.existeEstExpire = false;
		this.eleve = aEleve;
		const lTitre = this.estValorisation
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
		const T = [];
		T.push(
			'<div id="' +
				this.getNomInstance(this.identListeMemosEleves) +
				'" style="width: 100%; height: 100%"></div>',
		);
		return T.join("");
	}
	initialiserListeMemosEleves(aInstance) {
		const lTitreCreation = this.estValorisation
			? ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.CreerUnValorisation",
				)
			: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.CreerUnMemo");
		aInstance.setOptionsListe({
			colonnes: [{ taille: "100%" }],
			avecLigneCreation: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.dossierVS.saisirMemos,
			),
			titreCreation: lTitreCreation,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			forcerOmbreScrollBottom: true,
			nonEditableSurModeExclusif: true,
			messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.aucunMemo",
			),
		});
		aInstance.setOptions(this.optionsListeMemosEleve);
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, this.estValorisation);
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
		if (this.estValorisation) {
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
				{ estValorisation: this.estValorisation },
			),
		);
	}
	_evenementListeMemo(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this._ouvrirFenetreMemo();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this._ouvrirFenetreMemo(aParametres.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression: {
				const lListeMemo = new ObjetListeElements_1.ObjetListeElements();
				lListeMemo.add(aParametres.article);
				new ObjetRequeteSaisieMemoEleve_1.ObjetRequeteSaisieMemoEleve(this)
					.lancerRequete({
						eleve: this.eleve,
						listeMemos: lListeMemo,
						estValorisation: this.estValorisation,
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
						titre: this.estValorisation
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
			estValorisation: this.estValorisation,
		});
	}
}
exports.ObjetFenetre_ListeMemosEleves = ObjetFenetre_ListeMemosEleves;
