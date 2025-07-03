exports.DonneesListe_RDV = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const MoteurRDV_1 = require("MoteurRDV");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypesRDV_1 = require("TypesRDV");
const ObjetDate_1 = require("ObjetDate");
class DonneesListe_RDV extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.moteurRDV = new MoteurRDV_1.MoteurRDV();
		this.filtres = aParam.memoFiltres
			? aParam.memoFiltres
			: DonneesListe_RDV.getFiltresParDefaut({
					voirRdvRefuses: !this.moteurRDV.estCtxResponsableDeRDV(),
				});
		this.clbckMenuCtx = aParam.clbckMenuCtx;
		this.clbckDemandeRdvPasses = aParam.clbckDemandeRdvPasses;
		this.filtres.voirRdvPasses = aParam.avecRdvPasses;
		this.setOptions({
			avecEvnt_Selection: true,
			avecEvnt_ModificationSelection: true,
		});
	}
	getZoneGauche(aParams) {
		let lRdv = aParams.article;
		if (lRdv.estRdvDeSerie) {
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				this.moteurRDV.getHtmlTime(lRdv),
			);
		} else {
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				this.moteurRDV.getHtmlHeadDate(lRdv),
			);
		}
	}
	getTitreZonePrincipale(aParams) {
		let lRdv = aParams.article;
		if (lRdv.estRdvSessionSerie) {
			return IE.jsx.str(IE.jsx.fragment, null, lRdv.session.sujet);
		} else {
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				this.moteurRDV.getStrInterlocuteurRdv(lRdv, false),
			);
		}
	}
	getInfosSuppZonePrincipale(aParams) {
		let lRdv = aParams.article;
		if (lRdv.estRdvSessionSerie) {
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				this.moteurRDV.getHtmlTime(lRdv),
			);
		}
	}
	_getHtmlZCEtatRdv(aRdv) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			this.moteurRDV.getStrEtatRDV(aRdv),
		);
	}
	getZoneComplementaire(aParams) {
		let lRdv = aParams.article;
		let lContientPJ =
			(!!lRdv.listePJ && lRdv.listePJ.count() > 0) ||
			(!!lRdv.session.listePJ && lRdv.session.listePJ.count() > 0);
		let lEstRdvTelephonique = !!lRdv.creneau
			? this.moteurRDV.estCreneauTelephonique(lRdv.creneau)
			: false;
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			(!this.moteurRDV.estDemande(lRdv) &&
				!this.moteurRDV.estRdvAnnule(lRdv) &&
				!this.moteurRDV.estProposition(lRdv) &&
				!this.moteurRDV.estRdvRefuse(lRdv)) ||
				lRdv.estRdvSessionSerie
				? IE.jsx.str(
						"p",
						{ class: "info-duree" },
						ObjetTraduction_1.GTraductions.getValeur("RDV.xMin", [
							this.moteurRDV.getDureeRdvEnMinutes(lRdv),
						]),
					)
				: "",
			lContientPJ || lEstRdvTelephonique
				? IE.jsx.str(
						"div",
						{ class: "icones-conteneur tiny m-top" },
						" ",
						lContientPJ ? IE.jsx.str("i", { class: "icon_piece_jointe" }) : "",
						" ",
						lEstRdvTelephonique
							? IE.jsx.str("i", { class: "icon_phone m-left-s" })
							: "",
					)
				: "",
		);
	}
	estLigneOff(aParams) {
		return (
			this.moteurRDV.estRdvAnnule(aParams.article) ||
			this.moteurRDV.estRdvRefuse(aParams.article)
		);
	}
	getZoneMessage(aParams) {
		let lRdv = aParams.article;
		let lIcon = this.moteurRDV.getIconLieuRdv();
		let lEstCtxRespRdv = this.moteurRDV.estCtxResponsableDeRDV();
		if (lRdv.estRdvSessionSerie) {
			let lStrNatureSerie = this.moteurRDV.estRdvImpose(lRdv)
				? ObjetTraduction_1.GTraductions.getValeur("Eleves")
				: ObjetTraduction_1.GTraductions.getValeur("RDV.responsablesN");
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "m-bottom" },
					lEstCtxRespRdv
						? IE.jsx.str(
								"div",
								{ class: "p-y", "ie-ellipsis": true },
								" ",
								ObjetTraduction_1.GTraductions.getValeur("RDV.RdvSerie"),
								"  ",
								lRdv.strClassesSerie,
								" (",
								lStrNatureSerie,
								")",
							)
						: "",
					IE.jsx.str(
						"div",
						{ class: "flex-contain flex-center flex-gap flex-wrap" },
						lRdv.dateDebSerie && lRdv.dateFinSerie
							? ObjetDate_1.GDate.estJourEgal(
									lRdv.dateDebSerie,
									lRdv.dateFinSerie,
								)
								? IE.jsx.str(
										"span",
										{ class: "semi-bold" },
										ObjetTraduction_1.GTraductions.getValeur("Le"),
										" ",
										ObjetDate_1.GDate.formatDate(
											lRdv.dateDebSerie,
											"%JJJJ %JJ %MMMM",
										),
									)
								: IE.jsx.str(
										"span",
										{ class: "semi-bold" },
										ObjetTraduction_1.GTraductions.getValeur("Du"),
										" ",
										ObjetDate_1.GDate.formatDate(
											lRdv.dateDebSerie,
											"%JJJJ %JJ %MMMM",
										),
										" ",
										ObjetTraduction_1.GTraductions.getValeur("Au"),
										" ",
										ObjetDate_1.GDate.formatDate(
											lRdv.dateFinSerie,
											"%JJJJ %JJ %MMMM",
										),
									)
							: "",
						lRdv.strLieuxSerie
							? IE.jsx.str(
									"span",
									{ class: "flex-contain flex-center" },
									IE.jsx.str("i", { class: lIcon, "aria-hidden": "true" }),
									lRdv.strLieuxSerie,
									" ",
								)
							: "",
					),
				),
				lEstCtxRespRdv
					? ObjetTraduction_1.GTraductions.getValeur("RDV.nbInscritsSurTotal", [
							lRdv.nbRdvValidesDeSession,
							lRdv.nbTotalRdvDeSession,
						])
					: "",
			);
		} else {
			let lEleveConcerne = this.moteurRDV.getStrEleveConcerneRdv(lRdv);
			let lEstCtxPresenceDemandee =
				this.moteurRDV.estCtxPresenceDemandeeAuRdv(lRdv);
			let lStrParticipants = lEstCtxPresenceDemandee
				? this.moteurRDV.strParticipantsRdv(lRdv, ", ")
				: "";
			let lAvecAffTel =
				lEstCtxRespRdv &&
				this.moteurRDV.estRdvValide(lRdv) &&
				this.moteurRDV.estCreneauTelephonique(lRdv.creneau) &&
				lRdv.telephone;
			let lAvecRappelDate =
				this.moteurRDV.estUnRdvEnSerie(lRdv) &&
				!lRdv.estRdvSessionSerie &&
				!ObjetDate_1.GDate.estJourEgal(lRdv.dateDebSerie, lRdv.dateFinSerie) &&
				this.moteurRDV.existeCreneauPourRdv(lRdv);
			let lAvecAffichageHeure =
				!this.moteurRDV.estUnRdvEnSerie(lRdv) &&
				this.moteurRDV.existeCreneauPourRdv(lRdv);
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					null,
					lEleveConcerne && !lEstCtxPresenceDemandee
						? IE.jsx.str(
								"div",
								{ class: ["m-y"] },
								ObjetTraduction_1.GTraductions.getValeur("RDV.concernantX", [
									lEleveConcerne,
								]),
							)
						: lEstCtxPresenceDemandee
							? IE.jsx.str(
									"div",
									{ class: ["m-y"] },
									ObjetTraduction_1.GTraductions.getValeur(
										"RDV.ParticipantsX",
										[lStrParticipants],
									),
								)
							: "",
					IE.jsx.str(
						"span",
						null,
						this.moteurRDV.estUnRdvEnSerie(lRdv) ? "" : lRdv.session.sujet,
					),
					lAvecRappelDate
						? IE.jsx.str(
								"span",
								null,
								ObjetDate_1.GDate.formatDate(
									lRdv.creneau.debut,
									"%JJJJ %JJ %MMMM",
								),
							)
						: "",
					lAvecAffichageHeure
						? IE.jsx.str(
								"div",
								{ class: ["m-y"] },
								ObjetDate_1.GDate.formatDate(lRdv.creneau.debut, "%hh%sh%mm"),
							)
						: "",
					this.moteurRDV.getHtmlLieuCreneau(lRdv),
					lAvecAffTel ? this.moteurRDV.composeTelNonEditable(lRdv) : "",
				),
			);
		}
	}
	getZoneMessageLarge(aParams) {
		let lRdv = aParams.article;
		let lHtmlInfoManquante = this.moteurRDV.getHtmlWarningInfoManquante(lRdv);
		let lEtatRDV =
			(this.moteurRDV.estDemande(lRdv) &&
				!this.moteurRDV.estCtxResponsableDeRDV()) ||
			this.moteurRDV.estRdvAnnule(lRdv) ||
			(this.moteurRDV.estProposition(lRdv) &&
				this.moteurRDV.estCtxResponsableDeRDV()) ||
			this.moteurRDV.estRdvRefuse(lRdv);
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "messages-complementaires" },
				lHtmlInfoManquante
					? lHtmlInfoManquante
					: lEtatRDV
						? IE.jsx.str(
								"p",
								{ class: "message-etat" },
								this._getHtmlZCEtatRdv(lRdv),
							)
						: (this.moteurRDV.estProposition(lRdv) &&
									!this.moteurRDV.estCtxResponsableDeRDV()) ||
								(this.moteurRDV.estDemande(lRdv) &&
									this.moteurRDV.estCtxResponsableDeRDV())
							? IE.jsx.str(
									"p",
									{ class: "message-action" },
									this._getHtmlZCEtatRdv(lRdv),
								)
							: "",
			),
		);
	}
	avecBoutonActionLigne(aParams) {
		return this.avecMenuContextuel(aParams);
	}
	avecMenuContextuel(aParams) {
		return this.moteurRDV.avecCmdMenuCtx(aParams.article);
	}
	remplirMenuContextuel(aParametres) {
		this.moteurRDV.initCmdMenuCtx(
			aParametres.menuContextuel,
			aParametres.article,
			this.clbckMenuCtx,
		);
	}
	jsxModeleCheckboxRendezVousDemandes() {
		return {
			getLibelle: () => {
				return this.moteurRDV.estCtxResponsableDeRDV()
					? ObjetTraduction_1.GTraductions.getValeur("RDV.voirRdvDemandes")
					: ObjetTraduction_1.GTraductions.getValeur(
							"RDV.voirRdvDemandesEnCours",
						);
			},
			getValue: () => {
				return this.filtres.voirRdvDemandes;
			},
			setValue: (aValue) => {
				this.filtres.voirRdvDemandes = aValue;
				this._actualiserFiltres();
			},
		};
	}
	jsxModeleCheckboxRendezVousProposes() {
		return {
			getLibelle: () => {
				return this.moteurRDV.estCtxResponsableDeRDV()
					? ObjetTraduction_1.GTraductions.getValeur("RDV.voirRdvProposes")
					: ObjetTraduction_1.GTraductions.getValeur(
							"RDV.voirRdvProposesAValider",
						);
			},
			getValue: () => {
				return this.filtres.voirRdvProposes;
			},
			setValue: (aValue) => {
				this.filtres.voirRdvProposes = aValue;
				this._actualiserFiltres();
			},
		};
	}
	jsxModeleCheckboxRendezVousValides() {
		return {
			getLibelle: () => {
				return ObjetTraduction_1.GTraductions.getValeur("RDV.voirRdvValides");
			},
			getValue: () => {
				return this.filtres.voirRdvValides;
			},
			setValue: (aValue) => {
				this.filtres.voirRdvValides = aValue;
				this._actualiserFiltres();
			},
		};
	}
	jsxModeleCheckboxRendezVousPasses() {
		return {
			getLibelle: () => {
				return ObjetTraduction_1.GTraductions.getValeur("RDV.voirRdvPasses");
			},
			getValue: () => {
				return this.filtres.voirRdvPasses;
			},
			setValue: (aValue) => {
				this.filtres.voirRdvPasses = aValue;
				this.clbckDemandeRdvPasses(aValue, this.filtres);
			},
		};
	}
	jsxModeleCheckboxRendezVousAnnules() {
		return {
			getLibelle: () => {
				return ObjetTraduction_1.GTraductions.getValeur("RDV.voirRdvAnnules");
			},
			getValue: () => {
				return this.filtres.voirRdvAnnules;
			},
			setValue: (aValue) => {
				this.filtres.voirRdvAnnules = aValue;
				this._actualiserFiltres();
			},
		};
	}
	jsxModeleCheckboxRendezVousRefuses() {
		return {
			getLibelle: () => {
				return ObjetTraduction_1.GTraductions.getValeur("RDV.voirRdvRefuses");
			},
			getValue: () => {
				return this.filtres.voirRdvRefuses;
			},
			setValue: (aValue) => {
				this.filtres.voirRdvRefuses = aValue;
				this._actualiserFiltres();
			},
		};
	}
	static getFiltresParDefaut(aParam) {
		return {
			voirRdvAnnules: true,
			voirRdvRefuses: aParam.voirRdvRefuses,
			voirRdvPasses: false,
			voirRdvDemandes: true,
			voirRdvProposes: true,
			voirRdvValides: true,
		};
	}
	estFiltresParDefaut() {
		if (!this.filtres) {
			return true;
		}
		let lDefaultValue = DonneesListe_RDV.getFiltresParDefaut({
			voirRdvRefuses: !this.moteurRDV.estCtxResponsableDeRDV(),
		});
		return (
			this.filtres.voirRdvAnnules === lDefaultValue.voirRdvAnnules &&
			this.filtres.voirRdvRefuses === lDefaultValue.voirRdvRefuses &&
			this.filtres.voirRdvPasses === lDefaultValue.voirRdvPasses &&
			this.filtres.voirRdvDemandes === lDefaultValue.voirRdvDemandes &&
			this.filtres.voirRdvProposes === lDefaultValue.voirRdvProposes &&
			this.filtres.voirRdvValides === lDefaultValue.voirRdvValides
		);
	}
	reinitFiltres() {
		this.filtres = DonneesListe_RDV.getFiltresParDefaut({
			voirRdvRefuses: !this.moteurRDV.estCtxResponsableDeRDV(),
		});
		this._actualiserFiltres();
	}
	construireFiltres() {
		if (!this.filtres) {
			return "";
		}
		return IE.jsx.str(
			"div",
			{ class: ["flex-contain", "cols"] },
			IE.jsx.str(
				"fieldset",
				{ class: ["m-top-xxl", "m-bottom-l", "flex-contain", "cols"] },
				IE.jsx.str(
					"legend",
					{ class: ["m-bottom-l"] },
					ObjetTraduction_1.GTraductions.getValeur("RDV.afficherMesRdv"),
				),
				IE.jsx.str(
					"div",
					{ class: "flex-contain cols flex-gap-l p-left-xl" },
					IE.jsx.str("ie-checkbox", {
						"ie-model": this.jsxModeleCheckboxRendezVousDemandes.bind(this),
					}),
					IE.jsx.str("ie-checkbox", {
						"ie-model": this.jsxModeleCheckboxRendezVousProposes.bind(this),
					}),
					IE.jsx.str("ie-checkbox", {
						"ie-model": this.jsxModeleCheckboxRendezVousValides.bind(this),
					}),
					IE.jsx.str("ie-checkbox", {
						"ie-model": this.jsxModeleCheckboxRendezVousPasses.bind(this),
					}),
					IE.jsx.str("ie-checkbox", {
						"ie-model": this.jsxModeleCheckboxRendezVousAnnules.bind(this),
					}),
					IE.jsx.str("ie-checkbox", {
						"ie-model": this.jsxModeleCheckboxRendezVousRefuses.bind(this),
					}),
				),
			),
		);
	}
	getVisible(D) {
		let lEstRdvAvecCreneau =
			(D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide ||
				D.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVAnnule) &&
			!!D.creneau;
		let lEstJourPasse = lEstRdvAvecCreneau
			? ObjetDate_1.GDate.estAvantJourCourant(D.creneau.debut)
			: D.estRdvSessionSerie && D.dateFinSerie
				? ObjetDate_1.GDate.estAvantJourCourant(D.dateFinSerie)
				: false;
		if (
			this.moteurRDV.estCtxResponsableDeRDV() &&
			this.moteurRDV.estUnRdvEnSerie(D) &&
			D.estRdvDeSerie &&
			this.moteurRDV.estProposition(D)
		) {
			return false;
		}
		return (
			!!D &&
			(!this.moteurRDV.estRdvRefuse(D) || this.filtres.voirRdvRefuses) &&
			(!this.moteurRDV.estDemande(D) || this.filtres.voirRdvDemandes) &&
			(!this.moteurRDV.estProposition(D) || this.filtres.voirRdvProposes) &&
			((lEstJourPasse && this.filtres.voirRdvPasses) ||
				(!lEstJourPasse &&
					(!this.moteurRDV.estRdvAnnule(D) || this.filtres.voirRdvAnnules) &&
					(!this.moteurRDV.estRdvValide(D) || this.filtres.voirRdvValides)))
		);
	}
	_actualiserFiltres() {
		this.paramsListe.actualiserListe();
	}
	getFiltres() {
		return this.filtres;
	}
}
exports.DonneesListe_RDV = DonneesListe_RDV;
