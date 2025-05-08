const { MethodesObjet } = require("MethodesObjet.js");
const { GHtml } = require("ObjetHtml.js");
const { GUID } = require("GUID.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { tag } = require("tag.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const {
	ObjetFenetre_EvenementPeriodicite,
} = require("ObjetFenetre_EvenementPeriodicite.js");
const { UtilitaireGenreRessource } = require("GestionnaireBlocPN.js");
const { UtilitaireGenreEspace } = require("GestionnaireBlocPN.js");
const { UtilitaireGenreReponse } = require("GestionnaireBlocPN.js");
const { MoteurDestinatairesPN } = require("MoteurDestinatairesPN.js");
const { MoteurGestionPJPN } = require("MoteurGestionPJPN.js");
const {
	FenetreEditionDestinatairesParEntites,
} = require("FenetreEditionDestinatairesParEntites.js");
const {
	FenetreEditionDestinatairesParIndividus,
} = require("FenetreEditionDestinatairesParIndividus.js");
const { ObjetRequeteListeDiffusion } = require("ObjetRequeteListeDiffusion.js");
const {
	ObjetFenetre_SelectionListeDiffusion,
} = require("ObjetFenetre_SelectionListeDiffusion.js");
const { GCache } = require("Cache.js");
const {
	DonneesListe_SelectionDiffusion,
} = require("DonneesListe_SelectionDiffusion.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { ObjetRequeteSaisieAgenda } = require("ObjetRequeteSaisieAgenda.js");
const { EGenreEvtAgenda } = require("EGenreEvtAgenda.js");
const {
	ObjetMoteurFormSaisieMobile,
} = require("ObjetMoteurFormSaisieMobile.js");
const { ObjetSelecteurPJ } = require("ObjetSelecteurPJ.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const c_TailleMaxCommentaire = 1000;
class ObjetFenetre_SaisieAgenda extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.id = {
			titre: GUID.getId(),
			ctnHeure: GUID.getId(),
			ctnDestinataire: GUID.getId(),
			listePJ: GUID.getId(),
			libellePeriodicite: GUID.getId(),
			blocHeure: GUID.getId(),
			blocDate: GUID.getId(),
			ctnPeriodicite: GUID.getId(),
			inputTitre: GUID.getId(),
			inputCtnEvent: GUID.getId(),
			CBdirecteur: GUID.getId(),
			libelleCloud: GUID.getId(),
			libelleDocJoint: GUID.getId(),
			labeComboSelecCategorie: GUID.getId(),
		};
		this.utilitaires = {
			genreRessource: new UtilitaireGenreRessource(),
			genreEspace: new UtilitaireGenreEspace(),
			genreReponse: new UtilitaireGenreReponse(),
			moteurDestinataires: new MoteurDestinatairesPN(),
			moteurGestionPJ: new MoteurGestionPJPN(),
		};
		this.moteurFormSaisie = new ObjetMoteurFormSaisieMobile();
		this.destinataire = {};
		this.options = {
			avecCBElevesRattaches: GParametres.avecElevesRattaches,
			avecGestionEleves: GApplication.droits.get(
				TypeDroits.fonctionnalites.gestionEleves,
			),
			avecGestionPersonnels: GApplication.droits.get(
				TypeDroits.fonctionnalites.gestionPersonnels,
			),
			avecGestionStages: GApplication.droits.get(
				TypeDroits.fonctionnalites.gestionStages,
			),
			avecGestionIPR: GApplication.droits.get(
				TypeDroits.fonctionnalites.gestionIPR,
			),
		};
		this._nbCarTitre = 50;
		this.avecPublicationPageEtablissement = GApplication.droits.get(
			TypeDroits.communication.avecPublicationPageEtablissement,
		);
		this.listeJoursDeLaSemaine = new ObjetListeElements();
		for (let i = 0; i < 7; i++) {
			this.listeJoursDeLaSemaine.addElement(
				new ObjetElement(GTraductions.getValeur("Jours")[i]),
			);
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			comboSelecCategorie: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						labelledById: aInstance.id.labeComboSelecCategorie,
						estLargeurAuto: true,
						getContenuElement: function (aParams) {
							const T = [];
							T.push(
								`<div class="libelle ie-line-color left" style="--color-line:${aParams.element.couleur}">${aParams.element.getLibelle()}</div>`,
							);
							return T.join("");
						},
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return !!aInstance.listeFamilles ? aInstance.listeFamilles : null;
					}
				},
				getIndiceSelection() {
					return !!aInstance.evenement && !!aInstance.evenement.indiceFamille
						? aInstance.evenement.indiceFamille
						: 0;
				},
				event(aParam) {
					if (!!aParam.element) {
						aInstance.evenement.famille = aParam.element;
						aInstance.evenement.indiceFamille = aParam.indice;
					}
				},
			},
			inputTitre: {
				getValue() {
					return !!aInstance.evenement && !!aInstance.evenement.Libelle
						? aInstance.evenement.Libelle
						: "";
				},
				setValue(aValue) {
					aInstance.evenement.Libelle = aValue;
				},
			},
			inputCtnEvent: {
				getValue() {
					return !!aInstance.evenement && !!aInstance.evenement.Commentaire
						? aInstance.evenement.Commentaire
						: "";
				},
				setValue(aValue) {
					aInstance.evenement.Commentaire = aValue;
				},
			},
			switchHoraire: {
				getValue() {
					return !!aInstance.evenement
						? !aInstance.evenement.sansHoraire
						: false;
				},
				setValue(aValue) {
					aInstance.evenement.sansHoraire = !aValue;
					if (aInstance.evenement.sansHoraire) {
						$("#" + aInstance.id.ctnHeure)
							.children()
							.addClass("is-disabled");
					} else {
						$("#" + aInstance.id.ctnHeure)
							.children()
							.removeClass("is-disabled");
					}
				},
			},
			switchPartage: {
				getValue() {
					if (aInstance.evenement) {
						if (aInstance.evenement.publie) {
							$("#" + aInstance.id.ctnDestinataire).show();
							$("#" + aInstance.id.ctnDestinataire).removeAttr("aria-hidden");
						} else {
							$("#" + aInstance.id.ctnDestinataire).hide();
							$("#" + aInstance.id.ctnDestinataire).attr("aria-hidden", "true");
						}
					}
					return !!aInstance.evenement ? aInstance.evenement.publie : true;
				},
				setValue(aValue) {
					aInstance.evenement.publie = aValue;
				},
			},
			inputTimeHoraire: {
				heureDebut: {
					getValue() {
						return aInstance.valueInputHeureDebut;
					},
					setValue(aValue) {
						aInstance.valueInputHeureDebut = aValue;
					},
					getDisabled() {
						if (!!aInstance.evenement) {
							if (aInstance.evenement.sansHoraire) {
								$("#" + aInstance.id.ctnHeure)
									.children()
									.addClass("is-disabled");
							} else {
								$("#" + aInstance.id.ctnHeure)
									.children()
									.removeClass("is-disabled");
							}
						}
						return aInstance.evenement ? aInstance.evenement.sansHoraire : true;
					},
					exitChange() {
						_verifValueTime.call(aInstance, true);
					},
				},
				heureFin: {
					getValue() {
						return aInstance.valueInputHeureFin;
					},
					setValue(aValue) {
						aInstance.valueInputHeureFin = aValue;
					},
					getDisabled() {
						return aInstance.evenement ? aInstance.evenement.sansHoraire : true;
					},
					exitChange() {
						_verifValueTime.call(aInstance, false);
					},
				},
			},
			periodique: {
				estPeriodique: function () {
					return aInstance.donnee.periodicite;
				},
			},
			estPublie: function () {
				return aInstance.evenement ? aInstance.evenement.publie : true;
			},
			cbPublicationPageEtablissement: {
				getValue() {
					return (
						!!aInstance.evenement &&
						!!aInstance.evenement.publicationPageEtablissement
					);
				},
				setValue(aValue) {
					if (
						!!aInstance.evenement &&
						aInstance.avecPublicationPageEtablissement
					) {
						aInstance.evenement.publicationPageEtablissement = aValue;
					}
				},
				getDisabled() {
					return !aInstance.evenement || !aInstance.evenement.publie;
				},
			},
			avecPublicationPageEtablissement() {
				return aInstance.avecPublicationPageEtablissement;
			},
			pourPrim() {
				return GEtatUtilisateur.pourPrimaire();
			},
			pourPN() {
				return !GEtatUtilisateur.pourPrimaire();
			},
			CBdirecteur: {
				getValue() {
					return !!aInstance.evenement && !!aInstance.evenement.avecDirecteur;
				},
				setValue(aChecked) {
					if (!!aInstance.evenement && aInstance.evenement.avecDirecteur) {
						aInstance.evenement.avecDirecteur = aChecked;
					}
				},
				getDisabled() {
					return true;
				},
			},
			selecteurPeriodicite: {
				event: _evntSelectPeriodicite.bind(aInstance),
				getLibelle() {
					return aInstance.evenement.estPeriodique
						? GTraductions.getValeur(
								"Fenetre_SaisieAgenda.ModifierLaPeriodicite",
							)
						: GTraductions.getValeur("Fenetre_SaisieAgenda.DefinirPeriodicite");
				},
				getIcone() {
					return tag("i", { class: "icon_ul" });
				},
			},
			selecteurDestParEntite: {
				event: _evntSelectDestParEntite.bind(aInstance),
				getLibelle() {
					if (
						aInstance.destinataire &&
						MethodesObjet.isNumeric(aInstance.destinataire.nbClasses) &&
						MethodesObjet.isNumeric(aInstance.destinataire.nbGpe)
					) {
						return `${GTraductions.getValeur("Fenetre_SaisieAgenda.ParClasses").ucfirst()} <span class="theme_color_moyen1">(${aInstance.destinataire.nbClasses})</span> ${GTraductions.getValeur("Fenetre_SaisieAgenda.OuGroupes")} <span class="theme_color_moyen1">(${aInstance.destinataire.nbGpe})</span>`;
					}
					return "";
				},
				getIcone() {
					return tag("i", { class: "icon_group" });
				},
			},
			selecteurDestParIndiv: {
				event: _evntSelectDestParIndiv.bind(aInstance),
				getLibelle() {
					const lPourPrim = GEtatUtilisateur.pourPrimaire();
					if (
						lPourPrim ||
						MethodesObjet.isNumeric(aInstance.destinataire.nbIndiv)
					) {
						return lPourPrim
							? GTraductions.getValeur("actualites.Edition.Destinataires")
							: `${GTraductions.getValeur("Fenetre_SaisieAgenda.ATitreIndividuel")} <span class="theme_color_moyen1">(${aInstance.destinataire.nbIndiv})</span>`;
					}
					return "";
				},
				getIcone() {
					return tag("i", { class: "icon_user" });
				},
			},
			chipsDocJoint: {
				eventBtn(aIndice) {
					const lElement = aInstance.evenement.listeDocJoints.get(aIndice);
					if (lElement) {
						lElement.setEtat(EGenreEtat.Suppression);
						_actualiserLibelleDocJoints.call(aInstance);
					}
				},
			},
		});
	}
	construireInstances() {
		this.identDateDebut = this.add(
			ObjetCelluleDate,
			_evenementSurDate.bind(this, true),
		);
		this.getInstance(this.identDateDebut).setOptionsObjetCelluleDate({
			ariaDescription: GTraductions.getValeur(
				"Fenetre_SaisieAgenda.DescDateDebut",
			),
		});
		this.identDateFin = this.add(
			ObjetCelluleDate,
			_evenementSurDate.bind(this, false),
		);
		this.getInstance(this.identDateFin).setOptionsObjetCelluleDate({
			ariaDescription: GTraductions.getValeur(
				"Fenetre_SaisieAgenda.DescDateFin",
			),
		});
		this.identPJ = this.add(
			ObjetSelecteurPJ,
			_evenementPJ.bind(this),
			_initialiserPJ.bind(this),
		);
	}
	setDonnees(aParametres) {
		this.donnees = aParametres;
		const lParam = {
			agenda: null,
			avecSaisie: false,
			etat: EGenreEtat.Aucun,
			listeFamilles: new ObjetListeElements(),
			listeJourDansMois: new ObjetListeElements(),
			genreEvt: EGenreEvtAgenda.nonPeriodique,
		};
		$.extend(lParam, aParametres);
		this.listeFamilles = lParam.listeFamilles;
		this.agenda = lParam.agenda;
		this.listePJ = lParam.listePJ;
		this.avecSaisie = lParam.avecSaisie;
		this.dateDebutAgenda =
			aParametres.dateDebutAgenda || GParametres.PremiereDate;
		this.dateFinAgenda = aParametres.dateFinAgenda;
		this.etat = lParam.etat;
		this.listeJourDansMois = lParam.listeJourDansMois;
		this.genreEvt = lParam.genreEvt;
		this.getInstance(this.identDateDebut).setActif(!!this.avecSaisie);
		this.getInstance(this.identDateFin).setActif(!!this.avecSaisie);
		this.getInstance(this.identDateDebut).setParametresFenetre(
			GParametres.PremierLundi,
			this.dateDebutAgenda,
			this.dateFinAgenda,
		);
		this.getInstance(this.identDateFin).setParametresFenetre(
			GParametres.PremierLundi,
			this.dateDebutAgenda,
			this.dateFinAgenda,
		);
		let lTitreFenetre = "";
		if (this.etat !== EGenreEtat.Creation) {
			lTitreFenetre = GTraductions.getValeur(
				"Fenetre_SaisieAgenda.ModificationEvenement",
			);
			this.evenementOrigine = lParam.agenda;
			this.evenement = MethodesObjet.dupliquer(lParam.agenda);
		} else {
			lTitreFenetre = GTraductions.getValeur(
				"Fenetre_SaisieAgenda.NouvelEvenement",
			);
			this.evenementOrigine = null;
			this.evenement = lParam.agenda;
			if (GDate.estAvantJour(this.evenement.DateDebut, this.dateDebutAgenda)) {
				this.evenement.DateDebut = new Date(this.dateDebutAgenda);
				this.evenement.DateFin = new Date(this.dateDebutAgenda);
				this.evenement.DateDebut.setHours(9);
				this.evenement.DateFin.setHours(17);
				this.evenement.DateDebut.setMinutes(0);
				this.evenement.DateFin.setMinutes(0);
			}
		}
		const lNumero =
			this.genreEvt !== EGenreEvtAgenda.surTouteLaSerie
				? this.evenement.famille.getNumero()
				: this.evenement.periodicite.famille.getNumero();
		const lIndiceSession = this.listeFamilles.getIndiceElementParFiltre(
			(aElement) => {
				return aElement.getNumero() === lNumero;
			},
		);
		this.evenement.indiceFamille = lIndiceSession;
		this.setOptionsFenetre({ titre: lTitreFenetre });
		if (
			this.genreEvt !== EGenreEvtAgenda.surEvtUniquement &&
			!!this.evenement.periodicite
		) {
			this.evenement.periodicite.estEvtPerso = false;
		}
		if (this.genreEvt === EGenreEvtAgenda.surEvtUniquement) {
			this.evenement.periodicite.estEvtPerso = true;
		}
		_initValueInputHeure.call(this);
		this.afficher(this._composeContenu());
		this.construireAffichage();
		this.updateContenu();
	}
	updateCompteursDestinataires() {
		const lNbClasses = this.evenement.listePublicEntite
			.getListeElements((D) => {
				return (
					D.getGenre() === this.utilitaires.genreRessource.getRessourceClasse()
				);
			})
			.getNbrElementsExistes();
		this.destinataire.nbClasses = lNbClasses;
		const lNbGpe = this.evenement.listePublicEntite
			.getListeElements((D) => {
				return (
					D.getGenre() === this.utilitaires.genreRessource.getRessourceGroupe()
				);
			})
			.getNbrElementsExistes();
		this.destinataire.nbGpe = lNbGpe;
		const lNbIndiv = this.evenement.listePublicIndividu.getNbrElementsExistes();
		this.destinataire.nbIndiv = lNbIndiv;
	}
	_composeContenu() {
		const H = [];
		H.push(
			`\n            <section class="flex-contain cols ObjetFenetre_SaisieAgenda">\n              <article class="field-contain p-y-l label-up border-bottom">\n                <label for="${this.id.inputTitre}" class="fix-bloc">${GTraductions.getValeur("Fenetre_SaisieAgenda.TitreEvenement")}</label>\n                <input type="text" ie-model="inputTitre" id="${this.id.inputTitre}" class="round-style" placeholder="${GTraductions.getValeur("Fenetre_SaisieAgenda.RedigerTitreEvenement")}" maxlength="${this._nbCarTitre}" />\n              </article>\n              <article class="field-contain label-up border-bottom p-bottom">\n                <label for="${this.id.inputCtnEvent}" class="fix-bloc">${GTraductions.getValeur("Fenetre_SaisieAgenda.ContenueEvenement")}</label>\n                <ie-textareamax ie-model="inputCtnEvent" id="${this.id.inputCtnEvent}" class="round-style" style="width:100%; ${IE.estMobile ? "" : "min-height: 7rem;"}" ie-compteur="" placeholder="${GTraductions.getValeur("Fenetre_SaisieAgenda.RedigerContenueEvenement")}" maxlength="${c_TailleMaxCommentaire}" ></ie-textareamax>\n              </article>\n              <article class="field-contain label-up border-bottom p-bottom-l">\n                <label class="fix-bloc" id="${this.id.labeComboSelecCategorie}">${GTraductions.getValeur("Fenetre_SaisieAgenda.Categorie")}</label>\n                <ie-combo ie-model="comboSelecCategorie"></ie-combo>\n              </article>\n              <section class="field-contain label-up border-bottom p-bottom-l">\n                <div class="pj-global-conteneur no-line" id="${this.getInstance(this.identPJ).getNom()}"></div>\n                <div class="pj-liste-conteneur" id="${this.id.libelleDocJoint}"></div>\n                <div class="pj-liste-conteneur" id="${this.id.libelleCloud}"></div>\n              </section>\n              <section class="field-contain label-up border-bottom">\n                <article class="periode-contain ctn-date" id="${this.id.blocDate}">\n                  <span class="label-gauche" >${GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteDu")}</span>\n                  <div id="${this.getInstance(this.identDateDebut).getNom()}" class="fluid-bloc"></div>\n                  <span class="label-gauche">${GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteAu").toLowerCase()}</span>\n                  <div id="${this.getInstance(this.identDateFin).getNom()}" class="m-all fluid-bloc"></div>\n                </article>\n                <section>\n                  <section id="${this.id.blocHeure}">\n                    <ie-switch ie-model="switchHoraire" aria-label="${GTraductions.getValeur("Fenetre_SaisieAgenda.AvecHoraire")}">${GTraductions.getValeur("Fenetre_SaisieAgenda.AvecHoraire")}</ie-switch>\n                    <article class="ctn-time" id="${this.id.ctnHeure}">\n                      <div class="hours-contain"><input type="time" aria-label="${GTraductions.getValeur("Fenetre_SaisieAgenda.WAI.heureDebut")}" ie-model="inputTimeHoraire.heureDebut" class="round-style" /></div>\n                      <div class="hours-contain"><input type="time" aria-label="${GTraductions.getValeur("Fenetre_SaisieAgenda.WAI.heureFin")}" ie-model="inputTimeHoraire.heureFin" class="round-style" /></div>\n                    </article>\n                  </section>\n                  <ie-btnselecteur id="${this.id.ctnPeriodicite}" class="m-y" ie-model="selecteurPeriodicite" aria-label="${this.evenement.estPeriodique ? GTraductions.getValeur("Fenetre_SaisieAgenda.ModifierLaPeriodicite") : GTraductions.getValeur("Fenetre_SaisieAgenda.DefinirPeriodicite")}"></ie-btnselecteur>\n                  <article id="${this.id.libellePeriodicite}" class="m-all-l"></article>\n                </section>\n              </section>\n              <section class="field-contain label-up">\n                <ie-switch ie-model="switchPartage" aria-label="${GTraductions.getValeur("Fenetre_SaisieAgenda.Publie")}"><i class="iconic icon_fiche_cours_partage color-theme i-medium m-right-l fix-bloc"></i>${GTraductions.getValeur("Fenetre_SaisieAgenda.Publie")}</ie-switch>\n                <section class="ctn-destinataire" id="${this.id.ctnDestinataire}">\n                  <ie-btnselecteur ie-model="selecteurDestParEntite" aria-label="${GTraductions.getValeur("Fenetre_SaisieAgenda.WAI.destinataireClasseGroupe")}" ie-if="pourPN" ></ie-btnselecteur>\n                  <ie-btnselecteur ie-model="selecteurDestParIndiv" aria-label="${GTraductions.getValeur("Fenetre_SaisieAgenda.WAI.destinataireIndividuel")}"></ie-btnselecteur>\n                  <div ie-if="pourPrim" class="field-contain">\n                      <ie-checkbox class="def-txt" id="${this.id.CBdirecteur}" ie-model="CBdirecteur">${GTraductions.getValeur("actualites.Directeur")}</ie-checkbox>\n                  </div>\n                </section>\n                <div class="ctn-messages">\n                  <p tabindex="0">\n                      ${GEtatUtilisateur.pourPrimaire() ? GTraductions.getValeur("Fenetre_SaisieAgenda.InfoPartageAvecPrimaire") : GTraductions.getValeur("Fenetre_SaisieAgenda.InfoPartageAvec")}\n                  </p>\n                </div>\n              </section>\n              <section class="field-contain ">\n                  <ie-checkbox ie-model="cbPublicationPageEtablissement" ie-if="avecPublicationPageEtablissement">${GTraductions.getValeur("Fenetre_SaisieAgenda.publicationPageEtablissement")}</ie-checkbox>\n              </section>\n            </section>\n          `,
		);
		return H.join("");
	}
	updateContenu() {
		if (!!this.evenement.sansHoraire) {
			$("#" + this.id.ctnHeure)
				.children()
				.addClass("is-disabled");
		} else {
			$("#" + this.id.ctnHeure)
				.children()
				.removeClass("is-disabled");
		}
		this._actualiserBlocHoraire();
		this.updateCompteursDestinataires();
		this._actualiserBlocPeriodicite();
		_setHeureEvent.call(this);
		this.getInstance(this.identPJ).setDonnees({
			idListePJ: this.id.libelleDocJoint,
			listePJ: this.evenement.listeDocJoints,
			listeTotale: this.listePJ,
			idContextFocus: this.Nom,
		});
	}
	_actualiserBlocHoraire() {
		this.getInstance(this.identDateDebut).initialiser();
		this.getInstance(this.identDateDebut).setDonnees(this.evenement.DateDebut);
		this.getInstance(this.identDateFin).initialiser();
		this.getInstance(this.identDateFin).setDonnees(this.evenement.DateFin);
	}
	_actualiserBlocPeriodicite() {
		GHtml.setDisplay(
			this.id.blocDate,
			this.genreEvt !== EGenreEvtAgenda.surTouteLaSerie &&
				this.genreEvt !== EGenreEvtAgenda.surNouvelleSerie,
		);
		GHtml.setDisplay(
			this.id.blocHeure,
			this.genreEvt !== EGenreEvtAgenda.surTouteLaSerie &&
				this.genreEvt !== EGenreEvtAgenda.surNouvelleSerie,
		);
		GHtml.setDisplay(
			this.id.libellePeriodicite,
			(this.evenement.estPeriodique &&
				this.genreEvt === EGenreEvtAgenda.surTouteLaSerie) ||
				this.genreEvt === EGenreEvtAgenda.surNouvelleSerie,
		);
		GHtml.setDisplay(
			this.id.ctnPeriodicite,
			this.genreEvt !== EGenreEvtAgenda.surEvtUniquement,
		);
		if (
			(this.genreEvt === EGenreEvtAgenda.surTouteLaSerie ||
				this.genreEvt === EGenreEvtAgenda.surNouvelleSerie) &&
			this.evenement.estPeriodique
		) {
			GHtml.setHtml(
				this.id.libellePeriodicite,
				this.evenement.periodicite.libelleDescription,
			);
		}
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			let lMsgAvertissementPbPartage;
			if (!GEtatUtilisateur.pourPrimaire()) {
				lMsgAvertissementPbPartage = _getMsgControlePartageEvenement(
					this.evenement,
				);
			}
			if (!!lMsgAvertissementPbPartage) {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: lMsgAvertissementPbPartage,
				});
				return;
			}
			this.evenement.setEtat(EGenreEtat.Modification);
			_setHeureEvent.call(this);
			if (this.evenement.estPeriodique) {
				if (this.evenement.periodicite.estEvtPerso) {
					this.evenement.periodicite.DateEvenement =
						this.evenementOrigine.DateDebut;
				} else {
					this.evenement.DateFin = this.evenement.DateDebut;
				}
			}
		}
		if (aGenreBouton === 1) {
			_validationAuto.bind(this)();
		} else {
			_finSurValidation.bind(this)(aGenreBouton);
		}
	}
}
function _setHeureEvent() {
	if (!this.evenement.estPeriodique || this.evenement.periodicite.estEvtPerso) {
		const lEvenement = this.evenement;
		const lHeureDebutHeure = parseInt(
			this.valueInputHeureDebut.substring(0, 2),
		);
		const lHeureDebutMin = parseInt(this.valueInputHeureDebut.substring(3, 5));
		const lHeureFinHeure = parseInt(this.valueInputHeureFin.substring(0, 2));
		const lHeureFinMin = parseInt(this.valueInputHeureFin.substring(3, 5));
		lEvenement.DateDebut.setHours(lHeureDebutHeure);
		lEvenement.DateDebut.setMinutes(lHeureDebutMin);
		lEvenement.DateFin.setHours(lHeureFinHeure);
		lEvenement.DateFin.setMinutes(lHeureFinMin);
	}
}
function _validationAuto() {
	if (this.evenement && this.evenement.getEtat() !== EGenreEtat.Aucun) {
		this.evenement.setEtat(EGenreEtat.Modification);
		const lListeEvenements = new ObjetListeElements();
		lListeEvenements.addElement(this.evenement);
		new ObjetRequeteSaisieAgenda(this, _reponseSaisie.bind(this, 1))
			.addUpload({
				listeFichiers: this.evenement.listeDocJoints,
				listeDJCloud: this.evenement.listeDocJoints,
			})
			.lancerRequete({
				listeEvenements: lListeEvenements,
				listePiecesJointes: this.evenement.listeDocJoints,
			});
	}
}
function _reponseSaisie(aGenreBouton, aJSON) {
	this.evenementSaisie = aJSON.evenementSaisie || undefined;
	this.setEtatSaisie(false);
	_finSurValidation.bind(this)(aGenreBouton);
}
function _finSurValidation(aGenreBouton) {
	const lOptions = {
		numeroBouton: aGenreBouton,
		etat: this.etat,
		evenement: this.evenement,
		evenementOrigine: this.evenementOrigine,
	};
	if (this.evenementSaisie) {
		lOptions.numeroEvenementSaisie = this.evenementSaisie.getNumero();
	}
	this.callback.appel(lOptions);
	this.fermer();
}
function _initValueInputHeure() {
	const lEvenement = this.evenement;
	const lHoursDeb =
		lEvenement.DateDebut.getHours().toString().length === 1
			? "0" + lEvenement.DateDebut.getHours()
			: lEvenement.DateDebut.getHours();
	const lMinutesDeb =
		lEvenement.DateDebut.getMinutes().toString().length === 1
			? "0" + lEvenement.DateDebut.getMinutes()
			: lEvenement.DateDebut.getMinutes();
	const lHoursFin =
		lEvenement.DateFin.getHours().toString().length === 1
			? "0" + lEvenement.DateFin.getHours()
			: lEvenement.DateFin.getHours();
	const lMinutesFin =
		lEvenement.DateFin.getMinutes().toString().length === 1
			? "0" + lEvenement.DateFin.getMinutes()
			: lEvenement.DateFin.getMinutes();
	this.valueInputHeureDebut = lHoursDeb + ":" + lMinutesDeb;
	this.valueInputHeureFin = lHoursFin + ":" + lMinutesFin;
}
function _initialiserPJ(aInstance) {
	aInstance.setOptions({
		genrePJ: EGenreDocumentJoint.Fichier,
		genreRessourcePJ: EGenreRessource.DocJointEtablissement,
		avecMenuContextuel: false,
		maxFiles: 0,
		maxSize: GApplication.droits.get(TypeDroits.tailleMaxDocJointEtablissement),
		ouvrirFenetreChoixTypesAjout: true,
		optionsCloud: {
			avecCloud: true,
			callbackChoixFichierParFichier: surAjoutUnFichierCloud.bind(this),
			callbackChoixFichierFinal: surAjoutFinalFichiersClouds.bind(this),
		},
		avecAjoutExistante: true,
		idLibellePJ: this.id.libelleDocJoint,
		avecBoutonSupp: true,
		libelleSelecteur: GTraductions.getValeur(
			"Fenetre_SaisieAgenda.AjouterPieceJointes",
		),
	});
}
function _evenementSurDate(aEstDateDebut, aDate) {
	if (aEstDateDebut) {
		this.evenement.DateDebut = aDate;
		if (
			this.evenement.DateDebut > this.evenement.DateFin ||
			this.evenement.estPeriodique
		) {
			this.evenement.DateFin = new Date(this.evenement.DateDebut);
		}
	} else {
		this.evenement.DateFin = aDate;
		if (
			this.evenement.DateDebut > this.evenement.DateFin ||
			this.evenement.estPeriodique
		) {
			this.evenement.DateDebut = new Date(this.evenement.DateFin);
		}
	}
	this.getInstance(this.identDateDebut).setDonnees(this.evenement.DateDebut);
	this.getInstance(this.identDateFin).setDonnees(this.evenement.DateFin);
	this.updateContenu();
}
function _evntSelectPeriodicite() {
	if (this.etat === EGenreEtat.Creation) {
		_setHeureEvent.call(this);
	}
	const lEvenement = this.evenement;
	const lFenetrePeriodicite = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_EvenementPeriodicite,
		{
			pere: this,
			initialiser: function (aInstance) {
				aInstance.setDonnees(this);
			},
		},
	);
	lFenetrePeriodicite.afficher();
	const lDateDebut =
		lEvenement.estPeriodique && lEvenement.periodicite.DateDebut
			? lEvenement.periodicite.DateDebut
			: lEvenement.DateDebut;
	const lDateFin =
		lEvenement.estPeriodique && lEvenement.periodicite.DateFin
			? lEvenement.periodicite.DateFin
			: !!this.dateFinAgenda
				? this.dateFinAgenda
				: GParametres.DerniereDate;
	lFenetrePeriodicite
		.getInstance(lFenetrePeriodicite.identDateDebut)
		.setDonnees(lDateDebut);
	lFenetrePeriodicite
		.getInstance(lFenetrePeriodicite.identDateFin)
		.setDonnees(lDateFin);
}
function _evntSelectDestParEntite() {
	const lFenetre = ObjetFenetre.creerInstanceFenetre(
		FenetreEditionDestinatairesParEntites,
		{
			pere: this,
			evenement: function (aNumeroBouton, aDonnees) {
				if (aNumeroBouton === 1) {
					this.evenement = aDonnees.donnee;
					this.updateCompteursDestinataires();
				}
			}.bind(this),
			initialiser: function (aInstanceFenetre) {
				aInstanceFenetre.setUtilitaires(this.utilitaires);
				aInstanceFenetre.setOptionsFenetre({
					largeur: 350,
					avecTailleSelonContenu: true,
					modale: true,
					titre: GTraductions.getValeur("destinataires.destsParEntites"),
					listeBoutons: [
						GTraductions.getValeur("Annuler"),
						GTraductions.getValeur("Valider"),
					],
				});
				aInstanceFenetre.setOptions({ avecChoixParEleve: false });
			}.bind(this),
		},
	);
	lFenetre.setDonnees({ donnee: this.evenement });
}
function _evntSelectDestParIndiv() {
	const lFenetre = ObjetFenetre.creerInstanceFenetre(
		FenetreEditionDestinatairesParIndividus,
		{
			pere: this,
			evenement: function (aNumeroBouton, aDonnees) {
				if (aNumeroBouton === 1) {
					this.evenement = aDonnees.donnee;
					this.updateCompteursDestinataires();
				}
			}.bind(this),
			initialiser: function (aInstanceFenetre) {
				aInstanceFenetre.setUtilitaires(this.utilitaires);
				aInstanceFenetre.setOptions({
					avecGestionEleves: this.options
						? this.options.avecGestionEleves
						: true,
					avecGestionPersonnels: this.options
						? this.options.avecGestionPersonnels
						: true,
					avecGestionStages: this.options
						? this.options.avecGestionStages
						: true,
					avecGestionIPR: this.options ? this.options.avecGestionIPR : true,
				});
				aInstanceFenetre.avecListeDiffusion = true;
				aInstanceFenetre.surBtnListeDiffusion = () => {
					let lListeDiffusions = null;
					if (GCache && GCache.general.existeDonnee("listeDiffusion")) {
						lListeDiffusions = GCache.general.getDonnee("listeDiffusion");
					}
					return Promise.resolve()
						.then(() => {
							if (!lListeDiffusions) {
								return new ObjetRequeteListeDiffusion(this)
									.lancerRequete()
									.then((aJSON) => {
										if (aJSON && aJSON.liste) {
											lListeDiffusions = aJSON.liste;
											if (GCache) {
												GCache.general.setDonnee(
													"listeDiffusion",
													lListeDiffusions,
												);
											}
										}
									});
							}
						})
						.then(() => {
							return new Promise((aResolve) => {
								if (!lListeDiffusions) {
									return null;
								}
								lListeDiffusions.parcourir((aElement) => {
									aElement.cmsActif = false;
								});
								ObjetFenetre.creerInstanceFenetre(
									ObjetFenetre_SelectionListeDiffusion,
									{
										pere: this,
										evenement: (aGenreBouton) => {
											let lListeDiffusionsSelection = new ObjetListeElements();
											if (aGenreBouton === 1) {
												lListeDiffusionsSelection =
													lListeDiffusions.getListeElements(
														(aElement) => !!aElement.cmsActif,
													);
											}
											aResolve(lListeDiffusionsSelection);
										},
									},
								).setDonnees(
									new DonneesListe_SelectionDiffusion(lListeDiffusions),
									false,
								);
							});
						});
				};
				aInstanceFenetre.setOptionsFenetre({
					avecTailleSelonContenu: true,
					modale: true,
					titre: GTraductions.getValeur("destinataires.destsATitreIndiv"),
					listeBoutons: [
						GTraductions.getValeur("Annuler"),
						GTraductions.getValeur("Valider"),
					],
				});
			},
		},
	);
	lFenetre.setDonnees({ donnee: this.evenement });
}
function surAjoutUnFichierCloud(aNouvelElement) {
	this.evenement.listeDocJoints.addElement(aNouvelElement);
	this.listePJ.addElement(aNouvelElement);
}
function surAjoutFinalFichiersClouds() {
	_actualiserLibelleDocJoints.call(this);
	this.evenement.setEtat(EGenreEtat.Modification);
}
function _actualiserLibelleDocJoints() {
	if (GEtatUtilisateur.avecCloudDisponibles()) {
		const lIEModelChips = !this.avecSaisie ? null : "chipsDocJoint";
		const lSeparateur = !this.avecSaisie ? ", " : " ";
		GHtml.setHtml(
			this.id.libelleCloud,
			UtilitaireUrl.construireListeUrls(this.evenement.listeDocJoints, {
				genreFiltre: EGenreDocumentJoint.Cloud,
				genreRessource: EGenreRessource.DocJointEtablissement,
				separateur: lSeparateur,
				IEModelChips: lIEModelChips,
			}),
			{ controleur: this.controleur },
		);
	}
}
function _getMsgControlePartageEvenement(aEvenement) {
	let lMsg = null;
	if (!!aEvenement) {
		const lNbGenreEntites = !!aEvenement.genresPublicEntite
			? aEvenement.genresPublicEntite.count()
			: 0;
		const lNbPublicEntite = !!aEvenement.listePublicEntite
			? aEvenement.listePublicEntite.count()
			: 0;
		if (lNbGenreEntites > 0 && lNbPublicEntite === 0) {
			lMsg = GTraductions.getValeur(
				"Fenetre_SaisieAgenda.SelectionnerAuMoinsUneClasseGroupe",
			);
		} else if (lNbGenreEntites === 0 && lNbPublicEntite > 0) {
			lMsg = GTraductions.getValeur(
				"Fenetre_SaisieAgenda.SelectionnerAuMoinsUneEntite",
			);
		}
	}
	return lMsg;
}
function _evenementPJ() {
	_actualiserLibelleDocJoints.bind(this)();
	this.evenement.setEtat(EGenreEtat.Modification);
}
function _verifValueTime(aEstDebut) {
	let lDebut = this.valueInputHeureDebut;
	let lDebutHours = parseInt(lDebut.substring(0, 2));
	let lDebutMin = parseInt(lDebut.substring(3, 5));
	let lFin = this.valueInputHeureFin;
	let lFinHours = parseInt(lFin.substring(0, 2));
	let lFinMin = parseInt(lFin.substring(3, 5));
	if (aEstDebut) {
		if (lDebutHours > lFinHours) {
			this.valueInputHeureFin = lDebut;
		}
		if (lDebutMin > lFinMin && lDebutHours === lFinHours) {
			this.valueInputHeureFin = lDebut;
		}
	} else {
		if (lFinHours < lDebutHours) {
			this.valueInputHeureDebut = lFin;
		}
		if (lFinMin < lDebutMin && lDebutHours === lFinHours) {
			this.valueInputHeureDebut = lFin;
		}
	}
}
module.exports = { ObjetFenetre_SaisieAgenda };
