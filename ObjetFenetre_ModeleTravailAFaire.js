exports.ObjetFenetre_SaisieCreationTAF =
	exports.ObjetFenetre_ModeleTravailAFaire = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_ModeleTravailAFaire_Fd_1 = require("DonneesListe_ModeleTravailAFaire_Fd");
class ObjetFenetre_ModeleTravailAFaire extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.TitreFenetreModele",
			),
			largeur: 400,
			hauteur: 600,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
			],
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			_initialiserListe,
		);
		this.identFenetreCreationTAF = this.addFenetre(
			ObjetFenetre_SaisieCreationTAF,
			this.evenementFenetreCreationTAF,
		);
	}
	setDonnees(AListeModeles) {
		this.afficher();
		this.listeModeles = AListeModeles;
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_ModeleTravailAFaire_Fd_1.DonneesListe_ModeleTravailAFaire_Fd(
				AListeModeles,
			),
		);
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div id="',
			this.getNomInstance(this.identListe),
			'" class="table-contain full-size"></div>',
		);
		return T.join("");
	}
	refreshAffichage() {
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_ModeleTravailAFaire_Fd_1.DonneesListe_ModeleTravailAFaire_Fd(
				this.listeModeles,
			),
		);
	}
	evenementFenetreCreationTAF(aGenreBouton, aTaf) {
		if (aGenreBouton === 1) {
			this.listeModeles.add(aTaf);
			this.refreshAffichage();
		}
	}
	evenementSurListe(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementListe_1.EGenreEvenementListe.Creation
		) {
			this.ouvrirFenetreCreationTaf(null, false);
		}
		if (
			aParams.genreEvenement ===
			Enumere_EvenementListe_1.EGenreEvenementListe.Selection
		) {
			if (!!aParams.article.Editable) {
				this.ouvrirFenetreCreationTaf(aParams.article, true);
			}
		}
		if (
			aParams.genreEvenement ===
			Enumere_EvenementListe_1.EGenreEvenementListe.Edition
		) {
			this.ouvrirFenetreCreationTaf(aParams.article, true);
			aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		if (
			aParams.genreEvenement ===
			Enumere_EvenementListe_1.EGenreEvenementListe.Suppression
		) {
			aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			this.getInstance(this.identListe).actualiser(true);
			this.setBoutonActif(1, false);
			this.refreshAffichage();
		}
	}
	ouvrirFenetreCreationTaf(aTaf, estEnModification) {
		this.getInstance(this.identFenetreCreationTAF).setOptionsFenetre({
			largeur: 400,
			titre: !estEnModification
				? ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.TAF_EnrichirLaListe",
					)
				: ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ModifierTAF"),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.getInstance(this.identFenetreCreationTAF).setDonnees({
			listeModeles: this.listeModeles,
			tafSelectionne: aTaf,
			estEnModification: estEnModification,
		});
	}
}
exports.ObjetFenetre_ModeleTravailAFaire = ObjetFenetre_ModeleTravailAFaire;
function _initialiserListe(aInstance) {
	aInstance.setOptionsListe({
		skin: ObjetListe_1.ObjetListe.skin.flatDesign,
		avecLigneCreation: true,
	});
}
class ObjetFenetre_SaisieCreationTAF extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 400,
			avecTailleSelonContenu: true,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecComposeBasInFooter: true,
		});
	}
	setDonnees(aParams) {
		this.listeModeles = aParams.listeModeles;
		this.tafSelectionne = aParams.tafSelectionne;
		if (this.tafSelectionne !== null) {
			this.libelleEnModification = this.tafSelectionne.getLibelle();
		}
		this.estEnModification = aParams.estEnModification;
		this.afficher();
	}
	creerNouveauTAF() {
		const lTaf = ObjetElement_1.ObjetElement.create();
		lTaf.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		lTaf.setLibelle(this.titreNouveauTaf);
		lTaf.Editable = true;
		return lTaf;
	}
	modifierTAF(tafSelectionne, aValue) {
		const lTaf = this.listeModeles.getElementParNumero(
			tafSelectionne.getNumero(),
		);
		lTaf.setLibelle(aValue);
		lTaf.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	composeContenu() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"div",
					{ class: "field-contain label-up no-line" },
					IE.jsx.str(
						"label",
						{ class: "ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur("Libelle"),
					),
					IE.jsx.str("input", {
						"ie-model": "inputCreationTaf",
						class: "ie-autoresize m-bottom-l",
						"aria-label": ObjetTraduction_1.GTraductions.getValeur("Libelle"),
					}),
				),
			),
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			inputCreationTaf: {
				getValue: function () {
					if (
						aInstance === null || aInstance === void 0
							? void 0
							: aInstance.tafSelectionne
					) {
						return aInstance.libelleEnModification;
					} else {
						return aInstance.titreNouveauTaf ? aInstance.titreNouveauTaf : "";
					}
				},
				setValue: function (aValue) {
					if (
						aInstance === null || aInstance === void 0
							? void 0
							: aInstance.tafSelectionne
					) {
						aInstance.libelleEnModification = aValue;
					} else {
						aInstance.titreNouveauTaf = aValue;
					}
				},
				getDisabled: function () {
					return false;
				},
			},
		});
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			if (!this.estEnModification) {
				this.taf = this.creerNouveauTAF();
				const lExiste = this.listeModeles.getElementParLibelle(
					this.taf.getLibelle(),
				);
				if (!lExiste && !!this.taf.getLibelle()) {
					this.callback.appel(aGenreBouton, this.taf);
				} else if (!!this.taf.getLibelle()) {
					GApplication.getMessage().afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"liste.doublonNom",
							[this.taf.getLibelle()],
						),
					});
				} else {
					GApplication.getMessage().afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"liste.creationImpossible",
						),
					});
				}
			} else {
				if (this.libelleEnModification.length > 0) {
					const lExiste = this.listeModeles.getElementParLibelle(
						this.libelleEnModification,
					);
					if (!lExiste) {
						this.modifierTAF(this.tafSelectionne, this.libelleEnModification);
						this.callback.appel(aGenreBouton);
					} else {
						GApplication.getMessage().afficher({
							message: ObjetTraduction_1.GTraductions.getValeur(
								"liste.doublonNom",
								[lExiste.getLibelle()],
							),
						});
					}
				} else {
					GApplication.getMessage().afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"liste.editionImpossible",
						),
					});
				}
			}
			this.fermer();
		} else {
			this.fermer();
		}
	}
}
exports.ObjetFenetre_SaisieCreationTAF = ObjetFenetre_SaisieCreationTAF;
