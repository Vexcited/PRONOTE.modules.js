const { ObjetRequetePageAgenda } = require("ObjetRequetePageAgenda.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { GTraductions } = require("ObjetTraduction.js");
const { DonneesListe_Agenda } = require("DonneesListe_Agenda.js");
const { ObjetListe } = require("ObjetListe.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetFenetre_DetailAgenda } = require("ObjetFenetre_DetailAgenda.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { GDate } = require("ObjetDate.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const { ObjetFenetre_SaisieAgenda } = require("ObjetFenetre_SaisieAgenda.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { TypeHttpNotificationDonnes } = require("TypeHttpNotificationDonnes.js");
const { EGenreEvtAgenda } = require("EGenreEvtAgenda.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { ObjetRequeteSaisieAgenda } = require("ObjetRequeteSaisieAgenda.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
class InterfacePageAgendaMobile extends InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.listeEvenements = null;
		this.avecPublicationPageEtablissement = GApplication.droits.get(
			TypeDroits.communication.avecPublicationPageEtablissement,
		);
		this._objGestionFocus_apresFenetreSaisieAgenda = {};
	}
	construireInstances() {
		this.identListeAgenda = this.add(
			ObjetListe,
			_evenementSurListeAgenda.bind(this),
			_initialiserListeAgenda,
		);
	}
	recupererDonnees() {
		new ObjetRequetePageAgenda(
			this,
			_surRecupererDonneesAgenda.bind(this),
		).lancerRequete();
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListeAgenda;
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			`<div style="height:100%" id="${this.getInstance(this.identListeAgenda).getNom()}"></div>`,
		);
		return H.join("");
	}
	evntBtnCreerElementAgenda(aNbJoursEcoules) {
		let lJourDeSemaine;
		let lDate;
		if (aNbJoursEcoules === undefined) {
			lJourDeSemaine =
				GDate.getNbrJoursDepuisPremiereLundi(GDate.aujourdhui) % 7;
			lDate = GDate.aujourdhui;
		} else {
			lJourDeSemaine = aNbJoursEcoules % 7;
			lDate = GDate.getJour(GDate.PremierLundi, aNbJoursEcoules);
		}
		const lAgendaVierge = _getEvenementParDefaut.bind(this)(
			lJourDeSemaine,
			lDate,
		);
		ObjetFenetre.creerInstanceFenetre(ObjetFenetre_SaisieAgenda, {
			pere: this,
			evenement: _evenementFenetreSaisieAgenda.bind(this),
			initialiser(aInstance) {
				aInstance.setOptionsFenetre({
					avecTailleSelonContenu: true,
					listeBoutons: [
						GTraductions.getValeur("Annuler"),
						GTraductions.getValeur("Valider"),
					],
				});
			},
		}).setDonnees({
			agenda: lAgendaVierge,
			listeClassesGroupes: this.listeClassesGroupes,
			listeFamilles: this.listeFamilles,
			etat: EGenreEtat.Creation,
			avecSaisie: true,
			listePJ: this.listePiecesJointes,
			listeJourDansMois: this.listeJourDansMois,
			genreEvt: EGenreEvtAgenda.nonPeriodique,
			dateDebutAgenda: this.dateDebutPrevisionnel,
			dateFinAgenda: this.dateFinPrevisionnel,
		});
	}
	evntDupliquerElementAgenda(aArticle) {
		const lArticle = aArticle;
		this.copieAgenda = MethodesObjet.dupliquer(lArticle);
		const lListe = (this.copieAgenda.listeDocJoints = new ObjetListeElements());
		lArticle.listeDocJoints.parcourir((D) => {
			if (D.getEtat() !== EGenreEtat.Suppression) {
				const lElement = MethodesObjet.dupliquer(D);
				if (lElement.getEtat() === EGenreEtat.Aucun) {
					lElement.setEtat(EGenreEtat.Creation);
				}
				lListe.addElement(lElement);
			}
		});
		const lAgenda = MethodesObjet.dupliquer(this.copieAgenda);
		lAgenda.avecModificationPublic = true;
		lAgenda.Etat = EGenreEtat.Aucun;
		lAgenda.Numero = null;
		lAgenda.setEtat(EGenreEtat.Creation);
		const lDateDebutOrigine = lAgenda.DateDebut,
			lDateFinOrigine = lAgenda.DateFin,
			lEcartJour = GDate.getNbrJoursEntreDeuxDates(
				lAgenda.DateDebut,
				lAgenda.DateFin,
			);
		lAgenda.DateDebut = new Date(lAgenda.DateDebut);
		lAgenda.DateFin = GDate.getDateBornee(
			GDate.getJourSuivant(lAgenda.DateDebut, lEcartJour),
		);
		lAgenda.DateDebut.setHours(lDateDebutOrigine.getHours());
		lAgenda.DateDebut.setMinutes(lDateDebutOrigine.getMinutes());
		lAgenda.DateFin.setHours(lDateFinOrigine.getHours());
		lAgenda.DateFin.setMinutes(lDateFinOrigine.getMinutes());
		ObjetFenetre.creerInstanceFenetre(ObjetFenetre_SaisieAgenda, {
			pere: this,
			evenement: _evenementFenetreSaisieAgenda.bind(this),
			initialiser(aInstance) {
				aInstance.setOptionsFenetre({
					avecTailleSelonContenu: true,
					listeBoutons: [
						GTraductions.getValeur("Annuler"),
						GTraductions.getValeur("Valider"),
					],
				});
			},
		}).setDonnees({
			agenda: lAgenda,
			listeFamilles: this.listeFamilles,
			etat: EGenreEtat.Creation,
			avecSaisie: true,
			listePJ: this.listePiecesJointes,
			listeJourDansMois: this.listeJourDansMois,
			genreEvt: lAgenda.estPeriodique
				? EGenreEvtAgenda.surEvtUniquement
				: EGenreEvtAgenda.nonPeriodique,
			dateDebutAgenda: this.dateDebutPrevisionnel,
			dateFinAgenda: this.dateFinPrevisionnel,
		});
	}
	_gestionFocusApresFenetreSaisieAgenda(aParams) {
		if (aParams.numeroBouton !== 1) {
			return;
		}
		if (aParams.evenement) {
			this._objGestionFocus_apresFenetreSaisieAgenda.element =
				aParams.evenement;
		}
		if (aParams.numeroEvenementSaisie) {
			this._objGestionFocus_apresFenetreSaisieAgenda.numero =
				aParams.numeroEvenementSaisie;
		}
	}
	getIndiceParElement(aArticle) {
		if (!aArticle || !aArticle.getNumero || !aArticle.getGenre) {
			return null;
		}
		const lObjetListe = this.getInstance(this.identListeAgenda);
		const lListe = lObjetListe.getDonneesListe().Donnees;
		const lIndice = lListe.getIndiceParNumeroEtGenre(
			aArticle.getNumero(),
			aArticle.getGenre(),
			true,
		);
		return lIndice;
	}
}
function _initialiserListeAgenda(aInstance) {
	aInstance.setOptionsListe({
		skin: ObjetListe.skin.flatDesign,
		forcerScrollV_mobile: true,
		titreCreation: GTraductions.getValeur("Agenda.CreerEvenement"),
		avecLigneCreation: !!GApplication.droits.get(
			TypeDroits.agenda.avecSaisieAgenda,
		),
		messageContenuVide: GTraductions.getValeur("Agenda.AucunEvenementPublie"),
	});
}
function _surRecupererDonneesAgenda(aParam) {
	this.listeEvenements = aParam.listeEvenements;
	if (this.listeEvenements) {
		this.listeEvenements.setTri([
			ObjetTri.init((D) => {
				if (!D.DateDebut) {
					return false;
				}
				return (
					new Date(
						D.DateDebut.getFullYear(),
						D.DateDebut.getMonth(),
						D.DateDebut.getDate(),
					),
					EGenreTriElement.Decroissant
				);
			}),
			ObjetTri.init((D) => {
				if (!D.DateDebut) {
					return false;
				}
				return (
					!D.sansHoraire && D.DateDebut.getTime(), EGenreTriElement.Croissant
				);
			}),
		]);
		this.listeEvenements.trier();
	}
	this.listeFamilles = aParam.listeFamilles;
	this.listeClassesGroupes = MethodesObjet.dupliquer(
		aParam.listeClassesGroupes,
	);
	this.listeJourDansMois = aParam.listeJourDansMois;
	this.dateDebutPrevisionnel = aParam.dateDebutPrevisionnel;
	this.dateFinPrevisionnel = aParam.dateFinPrevisionnel;
	if (
		GEtatUtilisateur.listeDonnees &&
		GEtatUtilisateur.listeDonnees[
			TypeHttpNotificationDonnes.THND_ListeDocJointEtablissement
		]
	) {
		this.listePiecesJointes = MethodesObjet.dupliquer(
			GEtatUtilisateur.listeDonnees[
				TypeHttpNotificationDonnes.THND_ListeDocJointEtablissement
			],
		);
	}
	if (!!aParam.listeEvenements) {
		_actualiserAgenda.bind(this)();
	}
}
function _evenementFenetreSaisieAgenda(aParametres) {
	if (aParametres.numeroBouton === 1) {
		this.recupererDonnees();
		this._gestionFocusApresFenetreSaisieAgenda(aParametres);
	}
}
function _evenementSurListeAgenda(aParametres) {
	const lArticle = aParametres.article;
	let lGenreEvt;
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.SelectionClick:
			ObjetFenetre.creerInstanceFenetre(ObjetFenetre_DetailAgenda, {
				pere: this,
				evenement: _evenementFenetreDetailAgenda.bind(this),
				initialiser(aInstance) {
					aInstance.setOptionsFenetre({
						avecTailleSelonContenu: false,
						listeBoutons:
							!!lArticle.proprietaire &&
							IE.estMobile &&
							GApplication.droits.get(TypeDroits.agenda.avecSaisieAgenda)
								? [GTraductions.getValeur("Modifier")]
								: [],
					});
					aInstance.setOptions({
						estEspaceProf: [
							EGenreEspace.Professeur,
							EGenreEspace.Mobile_Professeur,
						].includes(GEtatUtilisateur.GenreEspace),
						droitSaisie: GApplication.droits.get(
							TypeDroits.agenda.avecSaisieAgenda,
						),
						estFenetreAgenda: true,
					});
				},
			}).setDonnees({
				detail: lArticle,
				evenementAgenda: _evenementSurListeAgenda.bind(this),
				evenementDupliquer: this.evntDupliquerElementAgenda.bind(this),
				avecPublicationPageEtablissement: this.avecPublicationPageEtablissement,
			});
			break;
		case EGenreEvenementListe.Creation:
			this.evntBtnCreerElementAgenda();
			break;
		case EGenreEvenementListe.Edition:
			if (lArticle.estPeriodique) {
				lGenreEvt = EGenreEvtAgenda.surEvtUniquement;
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Confirmation,
					message: _composeMessage(true),
					controleur: {
						RDEvenement: {
							getValue: function (aIndice) {
								return lGenreEvt === aIndice;
							},
							setValue: function (aIndice) {
								lGenreEvt = aIndice;
							},
						},
					},
					callback: function (aGenreAction) {
						if (aGenreAction === EGenreAction.Valider) {
							_callbackFenetreSaisieAgenda.bind(this)(lArticle, lGenreEvt);
						}
					}.bind(this),
				});
			} else {
				_callbackFenetreSaisieAgenda.bind(this)(
					lArticle,
					EGenreEvtAgenda.nonPeriodique,
				);
			}
			break;
		case EGenreEvenementListe.Suppression:
			if (lArticle.proprietaire) {
				if (lArticle.estPeriodique) {
					lGenreEvt = EGenreEvtAgenda.surEvtUniquement;
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Confirmation,
						message: _composeMessage(false),
						controleur: {
							RDEvenement: {
								getValue: function (aIndice) {
									return lGenreEvt === aIndice;
								},
								setValue: function (aIndice) {
									lGenreEvt = aIndice;
								},
							},
						},
						callback: function (aGenreAction) {
							if (aGenreAction === EGenreAction.Valider) {
								_callbackSupprimerAgenda.bind(this)(lArticle, lGenreEvt);
							}
						}.bind(this),
					});
				} else {
					lGenreEvt = EGenreEvtAgenda.nonPeriodique;
					const H = [];
					H.push(
						'<div class="Gras">',
						GTraductions.getValeur("Agenda.AgendaSuppressionEvt"),
						"</div>",
					);
					H.push(
						'<div class="GrandEspaceHaut">',
						GTraductions.getValeur("Agenda.AgendaConfirmerSupp"),
						"</div>",
					);
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Confirmation,
						message: H.join(""),
						callback: function (aGenreAction) {
							if (aGenreAction === EGenreAction.Valider) {
								_callbackSupprimerAgenda.bind(this)(lArticle, lGenreEvt);
							}
						}.bind(this),
					});
				}
			}
			break;
	}
}
function _evenementFenetreDetailAgenda(aParam) {
	if (!aParam) {
		return;
	}
	const lParam = {
		article: aParam.element,
		genreEvenement: EGenreEvenementListe.Edition,
	};
	_evenementSurListeAgenda.call(this, lParam);
}
function _actualiserAgenda() {
	this.getInstance(this.identListeAgenda).setDonnees(
		new DonneesListe_Agenda(this.listeEvenements, {
			eventDupliquer: this.evntDupliquerElementAgenda.bind(this),
		}),
	);
	let lIndexLigne = 0;
	if (this._objGestionFocus_apresFenetreSaisieAgenda.numero) {
		lIndexLigne = this.getInstance(this.identListeAgenda)
			.getDonneesListe()
			.Donnees.getIndiceParNumeroEtGenre(
				this._objGestionFocus_apresFenetreSaisieAgenda.numero,
			);
	} else if (this._objGestionFocus_apresFenetreSaisieAgenda.element) {
		lIndexLigne = this.getIndiceParElement(
			this._objGestionFocus_apresFenetreSaisieAgenda.element,
		);
	} else {
		const lEvenementLePlusProche = _getJourLePlusProche(
			this.listeEvenements,
			GDate.aujourdhui,
		);
		if (
			lEvenementLePlusProche &&
			lEvenementLePlusProche.element &&
			MethodesObjet.isNumeric(lEvenementLePlusProche.indice)
		) {
			lIndexLigne = lEvenementLePlusProche.indice;
		}
	}
	if (MethodesObjet.isNumeric(lIndexLigne)) {
		this.getInstance(this.identListeAgenda).scrollTo({ ligne: lIndexLigne });
	}
}
function _callbackFenetreSaisieAgenda(aElement, aGenreEvt) {
	ObjetFenetre.creerInstanceFenetre(ObjetFenetre_SaisieAgenda, {
		pere: this,
		evenement: _evenementFenetreSaisieAgenda.bind(this),
		initialiser(aInstance) {
			aInstance.setOptionsFenetre({
				avecTailleSelonContenu: true,
				listeBoutons: [
					GTraductions.getValeur("Annuler"),
					GTraductions.getValeur("Valider"),
				],
			});
		},
	}).setDonnees({
		agenda: aElement,
		etat: EGenreEtat.Modification,
		avecSaisie: true,
		listePJ: this.listePiecesJointes,
		listeFamilles: this.listeFamilles,
		listeJourDansMois: this.listeJourDansMois,
		genreEvt: aGenreEvt,
		dateDebutAgenda: this.dateDebutPrevisionnel,
		dateFinAgenda: this.dateFinPrevisionnel,
	});
}
function _callbackSupprimerAgenda(aElementAgenda, aGenreEvt) {
	aElementAgenda.setEtat(EGenreEtat.Suppression);
	if (aGenreEvt !== EGenreEvtAgenda.nonPeriodique) {
		aElementAgenda.periodicite.estEvtPerso =
			aGenreEvt === EGenreEvtAgenda.surEvtUniquement;
	}
	this.dateCourante = aElementAgenda.DateDebut;
	new ObjetRequeteSaisieAgenda(this, this.actionSurValidation).lancerRequete({
		listeEvenements: this.listeEvenements,
		listePiecesJointes: this.listePiecesJointes,
	});
}
function _composeMessage(aEstModif) {
	const H = [];
	H.push(
		'<div class="Gras">',
		GTraductions.getValeur("Agenda.AgendaAttentionEvtPeriodique"),
		"</div>",
	);
	H.push(
		'<div class="GrandEspaceHaut">',
		aEstModif
			? GTraductions.getValeur("Agenda.AgendaEvtPeriodiqueConfirmerModif")
			: GTraductions.getValeur("Agenda.AgendaEvtPeriodiqueConfirmerSupp"),
		"</div>",
	);
	H.push('<div class="EspaceHaut EspaceGauche">');
	H.push(
		'<div><ie-radio ie-model="RDEvenement(',
		EGenreEvtAgenda.surEvtUniquement,
		')" class="EspaceHaut">',
		GTraductions.getValeur("Agenda.AgendaSupprimerEvtUniquementOpt1"),
		"</ie-radio></div>",
	);
	H.push(
		'<div><ie-radio ie-model="RDEvenement(',
		EGenreEvtAgenda.surTouteLaSerie,
		')" class="EspaceHaut">',
		GTraductions.getValeur("Agenda.AgendaSupprimerTousEvtsDeLaSerieOpt2"),
		"</ie-radio></div>",
	);
	H.push("</div>");
	return H.join("");
}
function _getEvenementParDefaut(aJourDeSemaine, aDate) {
	const lEvenement = new ObjetElement("");
	lEvenement.setEtat(EGenreEtat.Creation);
	lEvenement.DateDebut = new Date(aDate);
	lEvenement.DateFin = new Date(aDate);
	lEvenement.DateDebut.setHours(9);
	lEvenement.DateFin.setHours(17);
	lEvenement.DateDebut.setMinutes(0);
	lEvenement.DateFin.setMinutes(0);
	lEvenement.sansHoraire = true;
	lEvenement.publie = true;
	lEvenement.proprietaire = true;
	lEvenement.Commentaire = "";
	const lFamille = this.listeFamilles.get(0);
	lEvenement.famille = lFamille;
	lEvenement.CouleurCellule = lFamille ? lFamille.couleur : "#FFFF00";
	lEvenement.genresPublicEntite = new TypeEnsembleNombre();
	lEvenement.avecElevesRattaches = false;
	lEvenement.listePublicEntite = new ObjetListeElements();
	lEvenement.listePublicIndividu = new ObjetListeElements();
	if (GEtatUtilisateur.pourPrimaire()) {
		lEvenement.avecDirecteur = true;
	}
	lEvenement.Public = {
		listeClassesGroupes: new ObjetListeElements(),
		listeProfs: new ObjetListeElements(),
	};
	lEvenement.listeDocJoints = new ObjetListeElements();
	return lEvenement;
}
function _getJourLePlusProche(aListeElements, aDateCible) {
	let lElementLePlusProche = null;
	let lIndiceElementLePlusProche = null;
	let lEcrartEntreElementEtDateCiblelePlusProche = Infinity;
	const lDateCibleSansHeure = new Date(
		aDateCible.getFullYear(),
		aDateCible.getMonth(),
		aDateCible.getDate(),
	);
	if (aListeElements && aListeElements.parcourir) {
		aListeElements.parcourir((aElement, aIndex) => {
			if (!aElement.DateDebut) {
				return;
			}
			const lDateSansHeure = new Date(
				aElement.DateDebut.getFullYear(),
				aElement.DateDebut.getMonth(),
				aElement.DateDebut.getDate(),
			);
			const lEcrartEntreElementEtDateCible =
				lDateSansHeure - lDateCibleSansHeure;
			if (
				lEcrartEntreElementEtDateCible >= 0 &&
				lEcrartEntreElementEtDateCible <=
					lEcrartEntreElementEtDateCiblelePlusProche
			) {
				lEcrartEntreElementEtDateCiblelePlusProche =
					lEcrartEntreElementEtDateCible;
				lElementLePlusProche = aElement;
				lIndiceElementLePlusProche = aIndex;
			}
		});
	}
	return { element: lElementLePlusProche, indice: lIndiceElementLePlusProche };
}
module.exports = InterfacePageAgendaMobile;
