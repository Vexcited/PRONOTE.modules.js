exports.ObjetPreferenceCahierDeTexte = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetIdentite_1 = require("ObjetIdentite");
const TypeComparaisonRessourcesCoursCDT_1 = require("TypeComparaisonRessourcesCoursCDT");
const TypeOptionPublicationCDT_1 = require("TypeOptionPublicationCDT");
const ObjetRequeteSaisieParametresUtilisateurBase_1 = require("ObjetRequeteSaisieParametresUtilisateurBase");
const AccessApp_1 = require("AccessApp");
class ObjetPreferenceCahierDeTexte extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
	}
	jsxIfElementProgramme() {
		return this.applicationSco.parametresUtilisateur.get(
			"CDT.ElementProgramme.AutorisationFonctionnelleElementProgramme",
		);
	}
	jsxIfParcoursEducatif() {
		return this.applicationSco.parametresUtilisateur.get(
			"CDT.ParcoursEducatifs.AutorisationFonctionnelleParcoursEducatifs",
		);
	}
	jsxCbElementProgrammeSaisie() {
		return {
			getValue: () => {
				return this.applicationSco.parametresUtilisateur.get(
					"CDT.ElementProgramme.ActiverSaisie",
				);
			},
			setValue: (aValue) => {
				this.applicationSco.parametresUtilisateur.set(
					"CDT.ElementProgramme.ActiverSaisie",
					aValue,
				);
			},
			getDisabled: () => {
				return this.applicationSco.getModeExclusif();
			},
		};
	}
	jsxCbMatiereIdentique() {
		return {
			getValue: () => {
				return this.applicationSco.parametresUtilisateur.get(
					"CDT.Navigation.MatiereIdentique",
				);
			},
			setValue: (aValue) => {
				this.applicationSco.parametresUtilisateur.set(
					"CDT.Navigation.MatiereIdentique",
					aValue,
				);
			},
			getDisabled: () => {
				return this.applicationSco.getModeExclusif();
			},
		};
	}
	jsxRbType(aGenre) {
		return {
			getValue: () => {
				return (
					aGenre ===
					this.applicationSco.parametresUtilisateur.get(
						"CDT.Navigation.TypeCours",
					)
				);
			},
			setValue: () => {
				this.applicationSco.parametresUtilisateur.set(
					"CDT.Navigation.TypeCours",
					aGenre,
				);
			},
			getDisabled: () => {
				return this.applicationSco.getModeExclusif();
			},
			getName: () => {
				return `${this.Nom}_rbtype`;
			},
		};
	}
	jsxCbPartagePJAutorisee() {
		return {
			getValue: () => {
				return this.applicationSco.parametresUtilisateurBase.partagePJAutorisee;
			},
			setValue: (aPartagePJAutorisee) => {
				this.applicationSco.parametresUtilisateurBase.partagePJAutorisee =
					aPartagePJAutorisee;
				new ObjetRequeteSaisieParametresUtilisateurBase_1.ObjetRequeteSaisieParametresUtilisateurBase(
					this,
				).lancerRequete(this.applicationSco.parametresUtilisateurBase);
			},
			getDisabled: () => {
				return this.applicationSco.getModeExclusif();
			},
		};
	}
	jsxRbOptionPublication(aGenre) {
		return {
			getValue: () => {
				return (
					aGenre ===
					this.applicationSco.parametresUtilisateurBase.optionPublicationCDT
				);
			},
			setValue: () => {
				this.applicationSco.parametresUtilisateurBase.optionPublicationCDT =
					aGenre;
				new ObjetRequeteSaisieParametresUtilisateurBase_1.ObjetRequeteSaisieParametresUtilisateurBase(
					this,
				).lancerRequete(this.applicationSco.parametresUtilisateurBase);
			},
			getDisabled: () => {
				return this.applicationSco.getModeExclusif();
			},
			getName: () => {
				return `${this.Nom}_rbOptionsPub`;
			},
		};
	}
	jsxCbActiverParcoursEducatifs() {
		return {
			getValue: () => {
				return this.applicationSco.parametresUtilisateur.get(
					"CDT.ParcoursEducatifs.ActiverSaisie",
				);
			},
			setValue: (aValue) => {
				this.applicationSco.parametresUtilisateur.set(
					"CDT.ParcoursEducatifs.ActiverSaisie",
					aValue,
				);
			},
			getDisabled: () => {
				return this.applicationSco.getModeExclusif();
			},
		};
	}
	jsxCbActiverCommentaireSurSeance() {
		return {
			getValue: () => {
				return this.applicationSco.parametresUtilisateur.get(
					"CDT.Commentaire.ActiverSaisie",
				);
			},
			setValue: (aValue) => {
				this.applicationSco.parametresUtilisateur.set(
					"CDT.Commentaire.ActiverSaisie",
					aValue,
				);
			},
			getDisabled: () => {
				return this.applicationSco.getModeExclusif();
			},
		};
	}
	jsxCbEleveDetache() {
		return {
			getValue: () => {
				return this.applicationSco.parametresUtilisateur.get(
					"CDT.TAF.AffecterParDefautElevesDetaches",
				);
			},
			setValue: (aValue) => {
				this.applicationSco.parametresUtilisateur.set(
					"CDT.TAF.AffecterParDefautElevesDetaches",
					aValue,
				);
			},
			getDisabled: () => {
				return this.applicationSco.getModeExclusif();
			},
		};
	}
	construireAffichage() {
		const lLibelleNavigatonCoursCDT = ObjetTraduction_1.GTraductions.getValeur(
			"infosperso.NavigationCoursCDT",
		);
		const lLibelleOptionsPublicationAutoCDT =
			ObjetTraduction_1.GTraductions.getValeur(
				"infosperso.OptionsPublicationAutoCDT",
			);
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"fieldset",
				{
					"ie-if": this.jsxIfElementProgramme.bind(this),
					class: "inner-item-contain",
				},
				IE.jsx.str(
					"legend",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.ElementProgramme",
					),
				),
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "long-text",
						"ie-model": this.jsxCbElementProgrammeSaisie.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.ElementProgrammeSaisie",
					),
				),
			),
			IE.jsx.str(
				"fieldset",
				{ class: "inner-item-contain flex-contain cols" },
				IE.jsx.str("legend", null, lLibelleNavigatonCoursCDT),
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "m-bottom-xl",
						"ie-model": this.jsxCbMatiereIdentique.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.CoursMatiereIdentique",
					),
				),
				IE.jsx.str(
					"ie-radio",
					{
						class: "long-text",
						"ie-model": this.jsxRbType.bind(
							this,
							TypeComparaisonRessourcesCoursCDT_1
								.TypeComparaisonRessourcesCoursCDT.RessourcesIdentiques,
						),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.CoursRessourceIdentique",
					),
				),
				IE.jsx.str(
					"ie-radio",
					{
						class: "long-text",
						"ie-model": this.jsxRbType.bind(
							this,
							TypeComparaisonRessourcesCoursCDT_1
								.TypeComparaisonRessourcesCoursCDT.RessourcesCommunes,
						),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.CoursRessourceCommune",
					),
				),
				IE.jsx.str(
					"ie-radio",
					{
						class: "long-text",
						"ie-model": this.jsxRbType.bind(
							this,
							TypeComparaisonRessourcesCoursCDT_1
								.TypeComparaisonRessourcesCoursCDT.AuMoins1EleveEnCommun,
						),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.CoursEleveCommun",
					),
				),
			),
			IE.jsx.str(
				"fieldset",
				{ class: "inner-item-contain" },
				IE.jsx.str(
					"legend",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.OptionsDePartage",
					),
				),
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "long-text",
						"ie-model": this.jsxCbPartagePJAutorisee.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.AutoriserConsultationPJAutresProfesseurs",
					),
				),
			),
			IE.jsx.str(
				"fieldset",
				{ class: "inner-item-contain flex-contain cols" },
				IE.jsx.str("legend", null, lLibelleOptionsPublicationAutoCDT),
				IE.jsx.str(
					"ie-radio",
					{
						"ie-model": this.jsxRbOptionPublication.bind(
							this,
							TypeOptionPublicationCDT_1.TypeOptionPublicationCDT
								.OPT_PublicationDebutCours,
						),
					},
					ObjetTraduction_1.GTraductions.getValeur("infosperso.DesDebutCours"),
				),
				IE.jsx.str(
					"ie-radio",
					{
						"ie-model": this.jsxRbOptionPublication.bind(
							this,
							TypeOptionPublicationCDT_1.TypeOptionPublicationCDT
								.OPT_PublicationFinCours,
						),
					},
					ObjetTraduction_1.GTraductions.getValeur("infosperso.ALaFinDuCours"),
				),
			),
			IE.jsx.str(
				"fieldset",
				{ class: "inner-item-contain" },
				IE.jsx.str(
					"legend",
					null,
					ObjetTraduction_1.GTraductions.getValeur("infosperso.SaisieTAFs"),
				),
				IE.jsx.str(
					"ie-checkbox",
					{ class: "long-text", "ie-model": this.jsxCbEleveDetache.bind(this) },
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.AffecterElevesDetaches",
					),
				),
			),
			IE.jsx.str(
				"fieldset",
				{
					"ie-if": this.jsxIfParcoursEducatif.bind(this),
					class: "inner-item-contain",
				},
				IE.jsx.str(
					"legend",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.ParcoursEducatifs",
					),
				),
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "long-text",
						"ie-model": this.jsxCbActiverParcoursEducatifs.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.ActiverParcoursEducatifs",
					),
				),
			),
			IE.jsx.str(
				"fieldset",
				{ class: "inner-item-contain" },
				IE.jsx.str(
					"legend",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.SaisieCommentaireSurSeance",
					),
				),
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "long-text",
						"ie-model": this.jsxCbActiverCommentaireSurSeance.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.ActiverSaisieCommentaireSurSeance",
					),
				),
			),
		);
	}
}
exports.ObjetPreferenceCahierDeTexte = ObjetPreferenceCahierDeTexte;
