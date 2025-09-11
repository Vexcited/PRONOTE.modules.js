exports.InterfaceDernieresNotes = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_DernieresNotes_1 = require("DonneesListe_DernieresNotes");
const Enumere_Message_1 = require("Enumere_Message");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetRequeteDernieresNotes_1 = require("ObjetRequeteDernieresNotes");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetFenetre_MethodeCalculMoyenne_1 = require("ObjetFenetre_MethodeCalculMoyenne");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const MoteurDernieresNotes_1 = require("MoteurDernieresNotes");
const UtilitaireQCMPN_1 = require("UtilitaireQCMPN");
const AccessApp_1 = require("AccessApp");
class InterfaceDernieresNotes extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.etatUtilSco = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.ids = {
			detailDerniereNote: this.Nom + "_detail",
			valeurMoyenneGenerale: this.Nom + "_moyGen",
		};
		this.parametres = {
			triParOrdreChronologique: true,
			afficherMoyenneService: true,
			afficherMoyenneDevoir: true,
			largeurs: { liste: 625, detail: 600 },
		};
		this.donnees = {
			moyenneGenerale: undefined,
			avecDetailService: true,
			avecDetailDevoir: true,
		};
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.moteurDernieresNotes =
			new MoteurDernieresNotes_1.MoteurDernieresNotes();
	}
	construireInstances() {
		this.identComboPeriodes = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this._evenementSurComboPeriodes.bind(this),
			this._initComboPeriodes,
		);
		this.identListeDernieresNotes = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeDernieresNotes.bind(this),
			this._initListeDernieresNotes.bind(this),
		);
		this.identFenetreMethodeCalculMoyenne = this.add(
			ObjetFenetre_MethodeCalculMoyenne_1.ObjetFenetre_MethodeCalculMoyenne,
			null,
			this.initialiserMethodeCalculMoyenne,
		);
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identListeDernieresNotes;
		this.avecBandeau = true;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identComboPeriodes);
		this.AddSurZone.push({
			html:
				'<div role="radiogroup" aria-label="' +
				ObjetTraduction_1.GTraductions.getValeur("ChoixTypeAffichage") +
				'">' +
				'<ie-radio class="as-chips" ie-model="radioTriDevoirs(0)">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"DernieresNotes.tri.Par_ordre_chronologique",
				) +
				"</ie-radio>" +
				'<ie-radio class="m-left as-chips" ie-model="radioTriDevoirs(1)">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"DernieresNotes.tri.Par_matiere",
				) +
				"</ie-radio>" +
				"</div>",
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			radioTriDevoirs: {
				getValue: function (aMode) {
					return aMode === 0
						? aInstance.parametres.triParOrdreChronologique
						: !aInstance.parametres.triParOrdreChronologique;
				},
				setValue: function (aData) {
					aInstance.parametres.triParOrdreChronologique = aData === 0;
					const lListeDernieresNotes = aInstance.getInstance(
						aInstance.identListeDernieresNotes,
					);
					if (lListeDernieresNotes.getDonneesListe()) {
						lListeDernieresNotes
							.getDonneesListe()
							.setParametres({
								avecServices: !aInstance.parametres.triParOrdreChronologique,
							});
						lListeDernieresNotes.actualiser({
							conserverSelection: true,
							avecScrollSelection: true,
						});
						if (
							!aInstance.getSelectedDevoir() ||
							!aInstance.getSelectedDevoir().existeNumero()
						) {
							ObjetHtml_1.GHtml.setHtml(
								aInstance.ids.detailDerniereNote,
								aInstance._composeDetailSelectionnezUnDevoir(),
							);
						}
					}
					aInstance._surModifContexteAffichage();
				},
			},
			btnCalculMoyenne: {
				event: function (aNumeroService) {
					const lService =
						aInstance.listeDevoirs.getElementParNumero(aNumeroService);
					const lEleve = aInstance.etatUtilSco.getMembre();
					const lClasse = lEleve.Classe;
					const lPeriode = aInstance.etatUtilSco.getPeriode();
					const lParametresCalcul = {
						libelleEleve: lEleve.getLibelle(),
						numeroEleve: lEleve.getNumero(),
						libelleClasse: lClasse.getLibelle(),
						numeroClasse: lClasse.getNumero(),
						libelleServiceNotation: lService.getLibelle(),
						numeroServiceNotation: lService.getNumero(),
						numeroPeriodeNotation: lPeriode.getNumero(),
						genreChoixNotation: lPeriode.getGenre(),
						moyenneTrimestrielle: true,
						pourMoyenneNette: true,
						ordreChronologique: aInstance.etatUtilSco.getTriDevoirs(),
					};
					if (aInstance.identFenetreMethodeCalculMoyenne) {
						aInstance
							.getInstance(aInstance.identFenetreMethodeCalculMoyenne)
							.setDonnees(lParametresCalcul);
					}
				},
				getDisabled: function (aNumeroService) {
					const lService =
						aInstance.listeDevoirs.getElementParNumero(aNumeroService);
					return !lService.moyEleve || !lService.moyEleve.estUneValeur();
				},
			},
			afficherCorrigerQCM: {
				event: function () {
					aInstance.evntCorrigeQCM();
				},
			},
		});
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(`<div class="InterfaceDernieresNotes">`);
		H.push(
			`<section id="${this.getInstance(this.identListeDernieresNotes).getNom()}" class="liste-contain ListeDernieresNotes" style="--liste-width : ${this.parametres.largeurs.liste}px;"></section>`,
		);
		H.push(
			`<section tabindex="0" id="${this.ids.detailDerniereNote}" class="Zone-DetailsNotes detail-contain" style="--detail-width : ${this.parametres.largeurs.detail}px;"></section>`,
		);
		H.push(`</div>`);
		return H.join("");
	}
	initialiserMethodeCalculMoyenne(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"DernieresNotes.Detail.DetailsMethodeCalcMoy",
			),
			largeur: 600,
			hauteur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
			],
			largeurMin: 600,
			hauteurMin: 150,
		});
	}
	evntCorrigeQCM(aExecQCM) {
		var _a;
		let lExec = aExecQCM;
		if (!lExec) {
			lExec =
				(_a = this.getSelectedDevoir()) === null || _a === void 0
					? void 0
					: _a.executionQCM;
		}
		if (lExec) {
			this.afficherExecutionQCM(lExec);
		}
	}
	afficherExecutionQCM(aExecutionQCM) {
		UtilitaireQCMPN_1.UtilitaireQCMPN.executerQCM(
			this.getInstance(this.identFenetreVisuQCM),
			aExecutionQCM,
			true,
		);
	}
	recupererDonnees() {
		if (this.getInstance(this.identComboPeriodes)) {
			this.IdPremierElement = this.getInstance(
				this.identComboPeriodes,
			).getPremierElement();
			this.listePeriodes = this.etatUtilSco.getOngletListePeriodes();
			if (this.listePeriodes && this.listePeriodes.count()) {
				this.getInstance(this.identComboPeriodes).setVisible(true);
				this.getInstance(this.identComboPeriodes).setDonnees(
					this.listePeriodes,
				);
				this.getInstance(this.identComboPeriodes).setSelectionParElement(
					this.etatUtilSco.getPeriode(),
					0,
				);
			} else {
				this.getInstance(this.identComboPeriodes).setVisible(false);
			}
		}
	}
	_initComboPeriodes(aInstance) {
		aInstance.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPeriode",
			),
		});
	}
	_evenementSurComboPeriodes(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.etatUtilSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
				aParams.element,
			);
			new ObjetRequeteDernieresNotes_1.ObjetRequeteDernieresNotes(
				this,
				this._surRequeteDernieresNotes.bind(this),
			).lancerRequete({ periode: aParams.element });
			this._surModifContexteAffichage();
		}
	}
	_initListeDernieresNotes(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
			ariaLabel: () => {
				var _a;
				return `${this.etatUtilSco.getLibelleLongOnglet()} ${((_a = this.etatUtilSco.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Periode)) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""} ${this.parametres.triParOrdreChronologique ? ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.tri.Par_ordre_chronologique") : ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.tri.Par_matiere")}`;
			},
		});
	}
	_evenementListeDernieresNotes(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				if (
					!!aParametres.article &&
					aParametres.article.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Devoir
				) {
					this.setSelectedDevoir(aParametres.article);
				} else {
					this.setSelectedDevoir(null);
				}
				ObjetHtml_1.GHtml.setHtml(
					this.ids.detailDerniereNote,
					this._composeDetail(aParametres.article),
					{ instance: this },
				);
				ObjetHtml_1.GHtml.setFocus(this.ids.detailDerniereNote);
				break;
		}
	}
	_composeDetailSelectionnezUnDevoir() {
		let lMessage = "";
		if (this.donnees.avecDetailDevoir) {
			lMessage = ObjetTraduction_1.GTraductions.getValeur(
				"DernieresNotes.Selectionnez_un_devoir",
			);
		} else if (
			this.donnees.avecDetailService &&
			!this.parametres.triParOrdreChronologique
		) {
			lMessage =
				ObjetTraduction_1.GTraductions.getValeur("Message")[
					Enumere_Message_1.EGenreMessage.SelectionMatiere
				];
		}
		return [
			'<div class="Gras AlignementMilieu GrandEspaceHaut">',
			lMessage,
			"</div>",
		].join("");
	}
	_composeDetail(aElement) {
		const H = [];
		if (aElement) {
			if (aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Service) {
				H.push(
					this.moteurDernieresNotes.composeDetailsService(aElement, {
						avecAffichageComplet: this.donnees.avecDetailService,
						libelleMoyenneDuPublicService: aElement.estServiceEnGroupe
							? ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Moyenne_groupe",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Moyenne_classe",
								),
					}),
				);
			} else {
				H.push(
					this.moteurDernieresNotes.composeDetailsDevoir(aElement, {
						commentaireEnTitre: true,
						libelleMoyenneDuPublicDevoir: aElement.estEnGroupe
							? ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Moyenne_groupe",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Moyenne_classe",
								),
						piecesJointes: this.moteur.composePieceJointeDevoir(aElement),
					}),
				);
			}
		}
		return H.join("");
	}
	_surRequeteDernieresNotes(aDonnees) {
		if (
			!!aDonnees &&
			!!aDonnees.listeDevoirs &&
			aDonnees.listeDevoirs.count() > 0
		) {
			this.afficherBandeau(true);
			const lListeDernieresNotes = this.getInstance(
				this.identListeDernieresNotes,
			);
			this.donnees.avecDetailService = aDonnees.avecDetailService || false;
			this.donnees.avecDetailDevoir = aDonnees.avecDetailDevoir || false;
			this.donnees.moyenneGenerale = !!aDonnees.moyenneGenerale
				? aDonnees.moyenneGenerale
				: null;
			const lListeDevoirs = new ObjetListeElements_1.ObjetListeElements();
			aDonnees.listeDevoirs.parcourir((D) => {
				let lServiceDeLaListeDevoirs = lListeDevoirs.getElementParNumero(
					D.service.getNumero(),
				);
				if (!lServiceDeLaListeDevoirs) {
					lListeDevoirs.addElement(D.service);
					lServiceDeLaListeDevoirs = D.service;
					lServiceDeLaListeDevoirs.nbNotesEleve = 0;
				}
				lListeDevoirs.addElement(D);
				D.pere = lServiceDeLaListeDevoirs;
				lServiceDeLaListeDevoirs.nbNotesEleve++;
			});
			this.listeDevoirs = lListeDevoirs;
			lListeDernieresNotes.setDonnees(
				new DonneesListe_DernieresNotes_1.DonneesListe_DernieresNotes(
					this.listeDevoirs,
					{
						avecServices: !this.parametres.triParOrdreChronologique,
						afficherMoyenneService: this.parametres.afficherMoyenneService,
						afficherMoyenneDevoir: this.parametres.afficherMoyenneDevoir,
						avecDetailService: this.donnees.avecDetailService,
						avecDetailDevoir: this.donnees.avecDetailDevoir,
						callbackExecutionQCM: this.evntCorrigeQCM.bind(this),
						htmlTotal: this.donnees.moyenneGenerale
							? this.moteurDernieresNotes.composeLigneTotaleDernieresNotes(
									this.donnees.moyenneGenerale,
								)
							: "",
					},
				),
			);
			let llIndexSelectionDevoir = -1;
			const lNavigationDevoir = this.getSelectedDevoir();
			if (!!lNavigationDevoir && lNavigationDevoir.existeNumero()) {
				llIndexSelectionDevoir = lListeDevoirs.getIndiceElementParFiltre(
					(D) => {
						return D.getNumero() === lNavigationDevoir.getNumero();
					},
				);
			}
			if (llIndexSelectionDevoir !== -1) {
				lListeDernieresNotes.selectionnerLigne({
					ligne: llIndexSelectionDevoir,
					avecScroll: true,
					avecEvenement: true,
				});
			} else {
				ObjetHtml_1.GHtml.setHtml(
					this.ids.detailDerniereNote,
					this._composeDetailSelectionnezUnDevoir(),
				);
			}
		} else {
			ObjetHtml_1.GHtml.setHtml(this.ids.detailDerniereNote, "&nbsp;");
			this.evenementAfficherMessage(Enumere_Message_1.EGenreMessage.PasDeNotes);
			this.setSelectedDevoir(null);
		}
	}
	getSelectedDevoir() {
		return this.etatUtilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Devoir,
		);
	}
	setSelectedDevoir(aDevoir) {
		this._surModifContexteAffichage();
		this.etatUtilSco.Navigation.setRessource(
			Enumere_Ressource_1.EGenreRessource.Devoir,
			aDevoir,
		);
	}
	_surModifContexteAffichage() {
		if (this.identFenetreMethodeCalculMoyenne) {
			const lFenetre = this.getInstance(this.identFenetreMethodeCalculMoyenne);
			if (lFenetre.estAffiche) {
				lFenetre.fermer();
			}
		}
	}
}
exports.InterfaceDernieresNotes = InterfaceDernieresNotes;
