exports.InterfaceRencontreDesiderata = void 0;
const ObjetRequeteSessionRencontres_1 = require("ObjetRequeteSessionRencontres");
const ObjetRequeteRencontres_1 = require("ObjetRequeteRencontres");
const ObjetRequeteSaisieRencontreDesiderata_1 = require("ObjetRequeteSaisieRencontreDesiderata");
const DonneesListe_RencontresDesiderata_1 = require("DonneesListe_RencontresDesiderata");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDate_1 = require("ObjetDate");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetSaisieIndisponibilite_1 = require("ObjetSaisieIndisponibilite");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Espace_1 = require("Enumere_Espace");
const InterfacePage_1 = require("InterfacePage");
const UtilitaireRencontres_1 = require("UtilitaireRencontres");
const Enumere_Etat_1 = require("Enumere_Etat");
const GUID_1 = require("GUID");
const AccessApp_1 = require("AccessApp");
class InterfaceRencontreDesiderata extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.etatUtilScoEspace = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.idMessage = this.Nom + "_Message";
		this.idInformation = GUID_1.GUID.getId();
		this.afficherTitreRubrique = true;
		this.donnees = { libelleBandeau: "" };
		this.nombreVoeuxNonRenseigne = 0;
	}
	construireInstances() {
		this.idComboSession = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evenementSurComboSessions.bind(this),
			this._initialiserComboSessions,
		);
		this.identPage = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListeRencontres,
		);
		this.identIndisponibilite = this.add(
			ObjetSaisieIndisponibilite_1.ObjetSaisieIndisponibilite,
			this._evenementSaisieIndispo.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [this.idComboSession];
		this.AddSurZone.push({
			html: '<span class="Gras" ie-html="getLibelleBandeau"></span>',
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getLibelleBandeau: function () {
				return aInstance.donnees.libelleBandeau;
			},
			information: {
				getDisplay: function () {
					return !!aInstance.information;
				},
				getHtml: function () {
					return aInstance.information ? `${aInstance.information}` : "";
				},
			},
			btnLegende: {
				event: function () {
					if (
						aInstance.desiderata &&
						aInstance.desiderata.autorisations &&
						aInstance.desiderata.autorisations.listeVoeux
					) {
						UtilitaireRencontres_1.TUtilitaireRencontre.ouvrirFenetreLegende(
							aInstance.desiderata.autorisations.listeVoeux,
						);
					}
				},
				getDisplay: function () {
					return (
						aInstance.desiderata &&
						aInstance.desiderata.autorisations &&
						aInstance.desiderata.autorisations.listeVoeux &&
						aInstance.desiderata.listeRencontres &&
						aInstance.desiderata.listeRencontres.count() > 0
					);
				},
			},
			getNombreNonRenseigne: function () {
				if (aInstance.donnees && aInstance.donnees.listeRencontres) {
					const lNombreVoeuxNonRenseigne = aInstance.donnees.listeRencontres
						.getListeElements((aRencontre) => {
							return !aRencontre.estUnDeploiement && !aRencontre.validationvoeu;
						})
						.count();
					return ObjetTraduction_1.GTraductions.getValeur(
						"Rencontres.desiderata.NonRenseignes",
						[lNombreVoeuxNonRenseigne],
					);
				}
				return "";
			},
			disponibilite: {
				getDisplay: function () {
					return (
						!!aInstance.indisponibilites &&
						aInstance.indisponibilites.avecSaisie &&
						aInstance.afficherTitreRubrique
					);
				},
			},
			desiderata: {
				getDisplay: function () {
					return !!aInstance.desiderata && aInstance.afficherTitreRubrique;
				},
			},
		});
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div class="FondBlanc PageDesiderataIndisponibilite flex-contain cols full-height">',
		);
		H.push(
			'<p class="m-left-l m-top-l" ie-html="information.getHtml" ie-display="information.getDisplay"></p>',
		);
		H.push(
			`<h2 class="m-left-l ie-titre" ie-display="disponibilite.getDisplay">${ObjetTraduction_1.GTraductions.getValeur("Rencontres.MesDisponibilites")}</h2>`,
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identIndisponibilite),
			'"></div>',
		);
		H.push(
			`<h2 class="m-left-l ie-titre" ie-display="desiderata.getDisplay">${ObjetTraduction_1.GTraductions.getValeur("Rencontres.PriorisationRencontres")}</h2>`,
		);
		H.push(
			`<div id="${this.idInformation}" class="flex-contain justify-between m-all-l" ><div ie-html="getNombreNonRenseigne"></div><ie-btnicon class="icon icon_legende i-large avecFond" ie-model="btnLegende" ie-display="btnLegende.getDisplay" title="${ObjetTraduction_1.GTraductions.getValeur("Legende")}"></ie-btnicon></div>`,
		);
		H.push(
			'<div style="width:72rem" class="fluid-bloc" id="' +
				this.getInstance(this.identPage).getNom() +
				'"></div>',
		);
		H.push(
			'<div id="' +
				this.idMessage +
				'" class="interface_affV_client Gras EspaceHaut AlignementMilieu"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	recupererDonnees() {
		new ObjetRequeteSessionRencontres_1.ObjetRequeteSessionRencontres(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete();
	}
	actionSurRecupererDonnees(aParams) {
		const lListeSessionsRencontre =
			UtilitaireRencontres_1.TUtilitaireRencontre.formaterListeSessionsRencontrePourCombo(
				aParams.listeSessions,
			);
		if (!lListeSessionsRencontre || lListeSessionsRencontre.count() === 0) {
			this.getInstance(this.idComboSession).setVisible(false);
			this._afficherRecapitulatif(
				false,
				ObjetTraduction_1.GTraductions.getValeur("Rencontres.aucuneSession"),
			);
		} else {
			lListeSessionsRencontre.setTri([
				ObjetTri_1.ObjetTri.init("date"),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			lListeSessionsRencontre.trier();
			this.getInstance(this.idComboSession).setVisible(true);
			let lIndiceSession;
			const lSessionRencontre =
				this.etatUtilScoEspace.getOnglet().sessionRencontre;
			if (!!lSessionRencontre) {
				lIndiceSession =
					lListeSessionsRencontre.getIndiceParElement(lSessionRencontre);
			} else {
				lIndiceSession =
					UtilitaireRencontres_1.TUtilitaireRencontre.chercherIndiceSessionProchaineSession(
						lListeSessionsRencontre,
					);
			}
			this.getInstance(this.idComboSession).setDonnees(
				lListeSessionsRencontre,
				lIndiceSession,
			);
			this._afficherRecapitulatif(lIndiceSession !== undefined);
		}
	}
	afficherPage() {
		this.setEtatSaisie(false);
		if (!!this.desiderata && this.desiderata.listeRencontres) {
			this.desiderata.listeRencontres.parcourir((D) => {
				D.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
			});
		}
	}
	valider(aRencontres) {
		new ObjetRequeteSaisieRencontreDesiderata_1.ObjetRequeteSaisieRencontreDesiderata(
			this,
			this.actionSurValidation,
		).lancerRequete({
			session: this.etatUtilScoEspace.getOnglet().sessionRencontre,
			listeRencontres: aRencontres,
		});
	}
	_initialiserListeRencontres(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
				"Rencontres.aucuneRencontre",
			),
			avecOmbreDroite: false,
		});
	}
	_evenementSaisieIndispo() {
		this._lancerRequete();
	}
	_afficherRecapitulatif(aAfficher, aMessage) {
		this.afficherTitreRubrique = aAfficher;
		if (aAfficher) {
			$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).show();
			$("#" + this.idInformation.escapeJQ()).show();
			$("#" + this.idMessage.escapeJQ()).hide();
		} else {
			aMessage = aMessage
				? aMessage
				: ObjetTraduction_1.GTraductions.getValeur(
						"Rencontres.selectionnerSession",
					);
			$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).hide();
			$("#" + this.idInformation.escapeJQ()).hide();
			$("#" + this.idMessage.escapeJQ())
				.html(aMessage)
				.show();
		}
		this.surResizeInterface();
	}
	_getListeVoeuxDisponiblesPourLaSession(aSession) {
		let lListeVoeux;
		if (!!aSession && !!aSession.autorisations) {
			lListeVoeux = aSession.autorisations.listeVoeux;
		}
		return lListeVoeux;
	}
	_initialiserComboSessions(aInstance) {
		aInstance.setOptionsObjetSaisie({
			mode: Enumere_Saisie_1.EGenreSaisie.Combo,
			longueur: 220,
			avecBouton: true,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.SelectionSessionRencontre",
			),
		});
		aInstance.setControleNavigation(true);
	}
	_evenementSurComboSessions(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection:
				this.etatUtilScoEspace.getOnglet().sessionRencontre = aParams.element;
				this._lancerRequete();
				break;
			default:
				break;
		}
	}
	_lancerRequete() {
		new ObjetRequeteRencontres_1.ObjetRequeteRencontres(
			this,
			this._surReponseRequeteRencontreDesiderata.bind(this),
		).lancerRequete(this.etatUtilScoEspace.getOnglet().sessionRencontre);
	}
	_surReponseRequeteRencontreDesiderata(aJSONSession) {
		this.desiderata = aJSONSession.desiderata;
		this.indisponibilites = aJSONSession.indisponibilites;
		this.autorisations = aJSONSession.autorisations;
		this.donnees.libelleBandeau = "";
		this.information = aJSONSession.information;
		if (aJSONSession.Message) {
			this._afficherRecapitulatif(false, aJSONSession.Message);
		} else {
			if (this.desiderata) {
				this._initialiserDesiderata();
			}
			if (this.indisponibilites && this.indisponibilites.avecSaisie) {
				$(
					"#" + this.getInstance(this.identIndisponibilite).getNom().escapeJQ(),
				).show();
				this.getInstance(this.identIndisponibilite).setDonnees({
					indisponibilites: this.indisponibilites,
					session: this.etatUtilScoEspace.getOnglet().sessionRencontre,
				});
			} else {
				$(
					"#" + this.getInstance(this.identIndisponibilite).getNom().escapeJQ(),
				).hide();
			}
		}
	}
	_initialiserDesiderata() {
		const lListeVoeux = this._getListeVoeuxDisponiblesPourLaSession(
			this.desiderata,
		);
		const lDateCourante = ObjetDate_1.GDate.getDateCourante();
		let lLibelle = "";
		if (
			this.autorisations &&
			(this.autorisations.saisieDesiderata ||
				this.autorisations.saisieDisponibilite)
		) {
			if (lDateCourante < this.desiderata.dateDebutSaisie) {
				this._afficherRecapitulatif(
					false,
					ObjetTraduction_1.GTraductions.getValeur(
						"Rencontres.desiderata.saisieEntre",
						[
							ObjetDate_1.GDate.formatDate(
								this.desiderata.dateDebutSaisie,
								"%JJ/%MM/%AAAA",
							),
							ObjetDate_1.GDate.formatDate(
								this.desiderata.dateFinSaisie,
								"%JJ/%MM/%AAAA",
							),
						],
					),
				);
			} else if (
				lDateCourante >= this.desiderata.dateDebutSaisie &&
				lDateCourante <= this.desiderata.dateFinSaisie
			) {
				lLibelle += ObjetTraduction_1.GTraductions.getValeur(
					"Rencontres.desiderata.saisieJusquA",
					[
						ObjetDate_1.GDate.formatDate(
							this.desiderata.dateFinSaisie,
							"%JJ/%MM/%AAAA",
						),
					],
				);
				this._afficherRecapitulatif(true);
			} else if (lDateCourante > this.desiderata.dateFinSaisie) {
				lLibelle += ObjetTraduction_1.GTraductions.getValeur(
					"Rencontres.desiderata.saisieCloturee",
				);
				this._afficherRecapitulatif(true);
			}
		} else {
			lLibelle = ObjetTraduction_1.GTraductions.getValeur(
				"Rencontres.desiderata.saisieParametrage",
			);
		}
		if (!!lListeVoeux && lListeVoeux.count() > 0) {
			this.donnees.libelleBandeau = lLibelle;
		} else {
			this.donnees.libelleBandeau = ObjetTraduction_1.GTraductions.getValeur(
				"Rencontres.desiderata.saisieParametrage",
			);
		}
		let lListeRencontres;
		if (
			this.etatUtilScoEspace.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Parent
		) {
			this.desiderata.listeRencontres.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return D.strMatiereFonction || "";
				}),
			]);
			this.desiderata.listeRencontres.trier();
			lListeRencontres =
				UtilitaireRencontres_1.TUtilitaireRencontre.formaterListeRencontresAvecProfesseurs(
					this.desiderata.listeRencontres,
				);
		} else {
			this.desiderata.listeRencontres.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return D.classe.getLibelle();
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.eleve.getLibelle();
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.eleve.getNumero();
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.strMatiereFonction || "";
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.strResponsables || "";
				}),
			]);
			this.desiderata.listeRencontres.trier();
			lListeRencontres =
				UtilitaireRencontres_1.TUtilitaireRencontre.formaterListeRencontresAvecParents(
					this.desiderata.listeRencontres,
				);
		}
		this.donnees.listeRencontres = lListeRencontres;
		const lAvecEleve =
			this.etatUtilScoEspace.GenreEspace !==
			Enumere_Espace_1.EGenreEspace.Parent;
		this.surResizeInterface();
		this.$refreshSelf().then(() => {
			this.getInstance(this.identPage).setDonnees(
				new DonneesListe_RencontresDesiderata_1.DonneesListe_RencontresDesiderata(
					lListeRencontres,
					{
						avecEleve: lAvecEleve,
						autorisations: this.desiderata.autorisations,
						avecSaisie: this.desiderata.avecSaisie,
						callbackDuree: this._modifierDuree.bind(this),
						callbackEditionDesiderata: (aRencontre) => {
							this.valider(
								new ObjetListeElements_1.ObjetListeElements([aRencontre]),
							);
						},
					},
				),
				null,
				{ conserverPositionScroll: true },
			);
		});
	}
	_modifierDuree(aRencontre) {
		const lListeRencontres = new ObjetListeElements_1.ObjetListeElements();
		lListeRencontres.add(aRencontre);
		this.valider(lListeRencontres);
		this._initialiserDesiderata();
	}
}
exports.InterfaceRencontreDesiderata = InterfaceRencontreDesiderata;
