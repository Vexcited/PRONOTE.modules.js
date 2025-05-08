const {
	ObjetRequeteConsultation,
	ObjetRequeteSaisie,
} = require("ObjetRequeteJSON.js");
const { Invocateur } = require("Invocateur.js");
const { CommunicationProduit } = require("CommunicationProduit.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const DonneesListe_PanierRessourceKiosque = require("DonneesListe_PanierRessourceKiosque.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const ObjetFenetre_LienKiosque = require("ObjetFenetre_LienKiosque.js");
const ObjetRequetePanierRessourceKiosque = require("ObjetRequetePanierRessourceKiosque.js");
const { TypeGenreApiKiosque } = require("TypeGenreApiKiosque.js");
Requetes.inscrire("SaisiePanierRessourceKiosque", ObjetRequeteSaisie);
Requetes.inscrire(
	"listeManuelsRessourcesGranulaires",
	ObjetRequeteConsultation,
);
const cDureeTimerKiosque = 20000;
class ObjetFenetre_PanierRessourceKiosque extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.options = { avecMultiSelection: false };
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("FenetrePanierKiosque.fenetreTitre"),
			largeur: 532,
			hauteur: 400,
			listeBoutons: [
				GTraductions.getValeur("Fermer"),
				GTraductions.getValeur("FenetrePanierKiosque.bouton.ajouterLien"),
			],
		});
	}
	setOptions(aOptions) {
		$.extend(this.options, aOptions);
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe,
			this.evenementSurListe,
			this.initialiserListe,
		);
		this.getInstance(this.identListe).setOptionsListe({
			labelWAI: GTraductions.getValeur("FenetrePanierKiosque.fenetreTitre"),
		});
		Invocateur.abonner("notification_Kiosque", this._notificationKiosque, this);
	}
	detruireInstances() {
		Invocateur.desabonner("notification_Kiosque", this);
		GApplication.getCommunication().setDureeTimerPresence(
			CommunicationProduit.cDureeTimerPresence,
		);
	}
	_notificationKiosque() {
		this.actualiserDonneesKiosque();
		GApplication.getCommunication().setDureeTimerPresence(
			CommunicationProduit.cDureeTimerPresence,
		);
	}
	afficherFenetre(aGenresApiKiosque) {
		this.genresApiKiosque = aGenresApiKiosque || new TypeEnsembleNombre();
		this.pouriDevoir =
			this.genresApiKiosque.contains(TypeGenreApiKiosque.Api_EnvoiNote) &&
			GEtatUtilisateur.activerKiosqueRenduTAF;
		this.pourExerciceNum =
			this.genresApiKiosque.contains(TypeGenreApiKiosque.Api_RenduPJTAF) &&
			GEtatUtilisateur.activerKiosqueRenduTAF;
		const lColonnesCachees = [
			DonneesListe_PanierRessourceKiosque.colonnes.coche,
			DonneesListe_PanierRessourceKiosque.colonnes.api,
		];
		if (this.pouriDevoir || this.pourExerciceNum) {
			lColonnesCachees.push(
				DonneesListe_PanierRessourceKiosque.colonnes.renduTAF,
			);
			lColonnesCachees.push(
				DonneesListe_PanierRessourceKiosque.colonnes.envoiNote,
			);
		} else {
			if (!GEtatUtilisateur.activerKiosqueRenduTAF) {
				lColonnesCachees.push(
					DonneesListe_PanierRessourceKiosque.colonnes.renduTAF,
				);
			}
			if (!GEtatUtilisateur.activerKiosqueEnvoiNote) {
				lColonnesCachees.push(
					DonneesListe_PanierRessourceKiosque.colonnes.envoiNote,
				);
			}
		}
		this.getInstance(this.identListe).setOptionsListe({
			colonnesCachees: lColonnesCachees,
		});
		this.actualiserDonneesKiosque(true);
	}
	actualiserDonneesKiosque() {
		new ObjetRequetePanierRessourceKiosque(
			this,
			this.apresRequeteDonnees,
		).lancerRequete({ genresApi: this.genresApiKiosque });
	}
	apresRequeteDonnees(aJSON) {
		this.listeRessourceKiosque = aJSON.listeRessourceKiosque;
		this.listeRessourceKiosque.parcourir(
			(aElement, aIndice, alisteRessourceKiosque) => {
				aElement.estSelectionne = false;
				if (!!aElement.pere) {
					const lPere = alisteRessourceKiosque.getElementParGenre(
						aElement.pere.getGenre(),
					);
					aElement.pere = lPere;
				} else {
					aElement.estUnDeploiement = true;
					aElement.estDeploye = true;
				}
			},
		);
		if (!!this.fenetreManuels && this._ouvertureInvisible) {
			this.fenetreManuels.fermer();
		}
		this._ouvertureInvisible =
			this.listeRessourceKiosque.getNbrElementsExistes() === 0;
		this.setDonnees(this.listeRessourceKiosque, aJSON.message);
	}
	setDonnees(aListe, aMessage) {
		if (aMessage) {
			const lThis = this;
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				message: aMessage,
				callback: function () {
					lThis.callback.appel(0);
				},
			});
		} else {
			this.liste = aListe;
			if (!this._actualisationDesDonnees) {
				this.actualiser();
				if (!this._ouvertureInvisible) {
					this.afficher();
				}
			} else {
				this._actualisationDesDonnees = undefined;
			}
			this.setBoutonActif(1, false);
			if (!this._ouvertureInvisible || this._listeSet) {
				this._actualiserListe();
			}
			if (this._ouvertureInvisible) {
				this.ouvrirFenetreSelectionManuels();
			}
		}
	}
	composeContenu() {
		const T = [];
		T.push('<table class="Table">');
		if (this.pouriDevoir) {
			T.push("<tr><td>");
			T.push('<div style="padding: 5px;">');
			T.push(
				GTraductions.getValeur("FenetrePanierKiosque.info.iDevoir", [
					'<span class="Image_Kiosque_ListeDevoir InlineBlock AlignementMilieuVertical"></span>',
				]),
				"*",
			);
			T.push("</div>");
			T.push("</td></tr>");
		}
		if (this.pourExerciceNum) {
			T.push("<tr><td>");
			T.push('<div style="padding: 5px;">');
			T.push(
				GTraductions.getValeur("FenetrePanierKiosque.info.TAF", [
					'<span class="Image_Kiosque_ListeCahierTexte InlineBlock AlignementMilieuVertical"></span>',
				]),
				"*",
			);
			T.push("</div>");
			T.push("</td></tr>");
		}
		T.push(
			'<tr style="width: 100%; height: 100%;"><td style="width: 100%; height: 100%;">',
			'<div id="' +
				this.getNomInstance(this.identListe) +
				'" style="width: 100%; height: 100%"></div>',
			"</td></tr>",
		);
		if (this.pouriDevoir || this.pourExerciceNum) {
			T.push("<tr><td>");
			T.push('<div style="padding: 5px;">');
			T.push(
				"* ",
				GTraductions.getValeur("FenetrePanierKiosque.info.KiosqueDisponible"),
			);
			T.push("</div>");
			T.push("</td></tr>");
		}
		T.push("</table>");
		return T.join("");
	}
	initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_PanierRessourceKiosque.colonnes.coche,
			taille: 18,
		});
		lColonnes.push({
			id: DonneesListe_PanierRessourceKiosque.colonnes.titre,
			taille: "100%",
			titre: GTraductions.getValeur("FenetrePanierKiosque.colonne.titre"),
			sansBordureDroite: true,
		});
		lColonnes.push({
			id: DonneesListe_PanierRessourceKiosque.colonnes.lien,
			taille: 17,
			titre: null,
		});
		lColonnes.push({
			id: DonneesListe_PanierRessourceKiosque.colonnes.commentaire,
			taille: 132,
			titre: {
				libelle: GTraductions.getValeur(
					"FenetrePanierKiosque.colonne.commentaire",
				),
				title: GTraductions.getValeur(
					"FenetrePanierKiosque.liste.HintCommentaire",
				),
			},
		});
		lColonnes.push({
			id: DonneesListe_PanierRessourceKiosque.colonnes.dateAjout,
			taille: 80,
			titre: GTraductions.getValeur("FenetrePanierKiosque.colonne.date"),
		});
		lColonnes.push({
			id: DonneesListe_PanierRessourceKiosque.colonnes.api,
			taille: 40,
			titre: GTraductions.getValeur("FenetrePanierKiosque.colonne.api"),
		});
		lColonnes.push({
			id: DonneesListe_PanierRessourceKiosque.colonnes.renduTAF,
			taille: 20,
			titre: {
				classeCssImage: "Image_Kiosque_ListeCahierTexte",
				title: GTraductions.getValeur(
					"FenetrePanierKiosque.liste.HintRenduPJTAF",
				),
			},
		});
		lColonnes.push({
			id: DonneesListe_PanierRessourceKiosque.colonnes.envoiNote,
			taille: 20,
			titre: {
				classeCssImage: "Image_Kiosque_ListeDevoir",
				title: GTraductions.getValeur(
					"FenetrePanierKiosque.liste.HintEnvoiNote",
				),
			},
		});
		const lColonnesCachees = [
			DonneesListe_PanierRessourceKiosque.colonnes.coche,
			DonneesListe_PanierRessourceKiosque.colonnes.api,
		];
		if (!GEtatUtilisateur.activerKiosqueRenduTAF) {
			lColonnesCachees.push(
				DonneesListe_PanierRessourceKiosque.colonnes.renduTAF,
			);
		}
		if (!GEtatUtilisateur.activerKiosqueEnvoiNote) {
			lColonnesCachees.push(
				DonneesListe_PanierRessourceKiosque.colonnes.envoiNote,
			);
		}
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			colonnesCachees: lColonnesCachees,
			avecLigneCreation: true,
			titreCreation: GTraductions.getValeur("FenetrePanierKiosque.creerLien"),
		});
	}
	surValidation(aNumeroBouton) {
		const lResult = {
			genreBouton: aNumeroBouton,
			liste: this.listeRessourceKiosque,
			selection: this.listeSelectionnes,
		};
		this.callback.appel(lResult);
		this.fermer();
	}
	evenementSurListe(aParametres, aGenreEvenementListe) {
		switch (aGenreEvenementListe) {
			case EGenreEvenementListe.Selection:
				this.listeSelectionnes = this.getInstance(
					this.identListe,
				).getListeElementsSelection();
				this._mettreAJourBoutonAjouter();
				break;
			case EGenreEvenementListe.ApresEdition:
				if (
					aParametres.idColonne ===
					DonneesListe_PanierRessourceKiosque.colonnes.coche
				) {
					this.listeSelectionnes = this.liste.getListeElements((aElement) => {
						return aElement.estSelectionne;
					});
					this._mettreAJourBoutonAjouter();
				} else {
					const lListeATraiter = new ObjetListeElements();
					if (
						!!aParametres.article &&
						!!aParametres.article.ressource &&
						aParametres.article.ressource.getEtat() === EGenreEtat.Modification
					) {
						lListeATraiter.addElement(aParametres.article.ressource);
						lListeATraiter.setSerialisateurJSON({
							methodeSerialisation: _serialiserRessource.bind(this),
						});
						Requetes(
							"SaisiePanierRessourceKiosque",
							this,
							this.apresRequeteSaisie,
						).lancerRequete({ ressources: lListeATraiter });
					}
				}
				break;
			case EGenreEvenementListe.Creation:
				this.ouvrirFenetreSelectionManuels();
				return EGenreEvenementListe.Creation;
			case EGenreEvenementListe.Suppression: {
				const lListeASupprimer = new ObjetListeElements();
				aParametres.listeSuppressions.parcourir(
					function (aElement) {
						if (
							!!aElement.ressource &&
							aElement.ressource.getGenre() ===
								EGenreRessource.PanierRessourceKiosque
						) {
							aElement.ressource.setEtat(EGenreEtat.Suppression);
							this.addElement(aElement.ressource);
						}
					}.bind(lListeASupprimer),
				);
				const lListe = this.listeRessourceKiosque.getListeElements(
					(aElement) => {
						return aElement.ressource.existe();
					},
				);
				IE.log.addLog("nombre ressources restantes : " + lListe.count());
				this._ouvertureInvisible = false;
				Requetes(
					"SaisiePanierRessourceKiosque",
					this,
					this.apresRequeteSaisie,
				).lancerRequete({ ressources: lListeASupprimer });
				return EGenreEvenementListe.Suppression;
			}
		}
	}
	ouvrirFenetreSelectionManuels() {
		const lThis = this;
		Requetes("listeManuelsRessourcesGranulaires", this, function (aJSON) {
			this.fenetreManuels = ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_LienKiosque,
				{
					pere: lThis,
					evenement: _eventFenetreLienKiosque.bind(lThis),
					initialiser: _initFenetreLienKiosque,
				},
			);
			this.fenetreManuels.setDonnees(
				aJSON.listeRessources,
				this.genresApiKiosque,
			);
		}).lancerRequete({ genresApi: this.genresApiKiosque });
	}
	apresRequeteSaisie() {
		this._actualisationDesDonnees = true;
		this.actualiserDonneesKiosque();
	}
	_mettreAJourBoutonAjouter() {
		const lActif = this.options.avecMultiSelection
			? this.listeSelectionnes.count() > 0
			: this.listeSelectionnes.count() === 1;
		if (this.options.avecMultiSelection) {
			let lLibelle = GTraductions.getValeur(
				"FenetrePanierKiosque.bouton.ajouterLien",
			);
			if (this.listeSelectionnes.count() > 1) {
				lLibelle = GTraductions.getValeur(
					"FenetrePanierKiosque.bouton.ajouterLiens",
					[this.listeSelectionnes.count()],
				);
			}
			this.setBoutonLibelle(1, lLibelle);
		}
		this.setBoutonActif(1, lActif);
	}
	_actualiserListe() {
		this._listeSet = true;
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_PanierRessourceKiosque({
				donnees: this.liste,
				pere: this,
				avecMultiSelection: this.options.avecMultiSelection,
				callbackLien: _eventFenetreLienKiosque.bind(this, 0),
			}),
		);
	}
}
function _serialiserRessource(aElement, aJSON) {
	aJSON.commentaire = aElement.commentaire;
}
function _eventFenetreLienKiosque(aBouton, aGenre) {
	if (aGenre === EGenreRessource.RessourceNumeriqueKiosque) {
		GApplication.getCommunication().setDureeTimerPresence(cDureeTimerKiosque);
	} else {
		if (this._ouvertureInvisible) {
			this.fermer();
		}
	}
}
function _initFenetreLienKiosque(aInstance) {
	aInstance.setOptionsFenetre({
		titre: GTraductions.getValeur("FenetrePanierKiosque.fenetreTitre"),
		largeur: 532,
		hauteur: 220,
		listeBoutons: [GTraductions.getValeur("Fermer")],
	});
}
module.exports = { ObjetFenetre_PanierRessourceKiosque };
