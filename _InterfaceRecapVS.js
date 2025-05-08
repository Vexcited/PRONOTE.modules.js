exports._InterfaceRecapVS = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_DomaineInformation_1 = require("Enumere_DomaineInformation");
const ObjetRequeteListeRegimesEleve_1 = require("ObjetRequeteListeRegimesEleve");
const ObjetSelecteurClasseGpe_1 = require("ObjetSelecteurClasseGpe");
const ObjetSelecteurRegimeEleve_1 = require("ObjetSelecteurRegimeEleve");
const ObjetSelecteurBourse_1 = require("ObjetSelecteurBourse");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const InterfacePage_1 = require("InterfacePage");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const ObjetFenetre_DetailAbsences_1 = require("ObjetFenetre_DetailAbsences");
class _InterfaceRecapVS extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurScoEspace = this.applicationSco.getEtatUtilisateur();
		this.initDroits();
		this._parametres = {
			domaine: this.etatUtilisateurScoEspace.getDomaineSelectionne(),
			classes: this.etatUtilisateurScoEspace.getListeClasses({
				avecClasse: true,
				uniquementClasseEnseignee: true,
			}),
			regimes: new ObjetListeElements_1.ObjetListeElements(),
			criteresFiltres: this.getCriteresSelectionParDefaut(),
			bourses: null,
			uniquementDontJeSuisAuteur: false,
		};
		this.setAutorisations();
	}
	initDroits() {
		this.droits = {
			avecPunitions: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPunitions,
			),
			avecChoixRepas: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionAbsencesDemiPension,
			),
			avecChoixInternat: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionAbsencesInternat,
			),
			gestionEtendueEleves: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionEtendueEleves,
			),
			avecInfirmerie: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionInfirmerie,
			),
		};
	}
	getCriteresSelectionParDefaut() {
		return null;
	}
	construireInstances() {
		this.identCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			this._evntSurCalendrier.bind(this),
			this._initCalendrier,
		);
		this.identSelecteurClasses = this.add(
			ObjetSelecteurClasseGpe_1.ObjetSelecteurClasseGpe,
			this.evntSelecteurClasses,
			this.initSelecteurClasses,
		);
		this.identSelecteurRegimeEleve = this.add(
			ObjetSelecteurRegimeEleve_1.ObjetSelecteurRegimeEleve,
			this.evntSelecteurRegime,
		);
		this.identSelecteurBourse = this.add(
			ObjetSelecteurBourse_1.ObjetSelecteurBourse,
			this.evntSelecteurBourse,
		);
		this.identFenetreAbsParCours = this.add(
			ObjetFenetre_DetailAbsences_1.ObjetFenetre_DetailAbsences,
			null,
			this._initFenetreAbsParCours,
		);
		this.identParamEtFiltres = null;
		this.identRecap = null;
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [this.identSelecteurClasses];
		if (this.droits.gestionEtendueEleves) {
			this.AddSurZone.push(this.identSelecteurRegimeEleve);
		}
		if (
			this.droits.gestionEtendueEleves &&
			GEtatUtilisateur.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.RecapAbsences
		) {
			this.AddSurZone.push(this.identSelecteurBourse);
		}
		if (
			GEtatUtilisateur.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.RecapFeuilleAppel
		) {
			this.AddSurZone.push({
				html:
					'<ie-checkbox ie-model="cbUniquementDontJeSuisAuteur">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"RecapAbs.UniquementDontJeSuisAuteur",
					) +
					"</label>",
			});
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbUniquementDontJeSuisAuteur: {
				getValue() {
					return aInstance._parametres.uniquementDontJeSuisAuteur;
				},
				setValue(aValeur) {
					aInstance._parametres.uniquementDontJeSuisAuteur = aValeur;
					aInstance.requeteDonneesRecap(aInstance._parametres);
				},
			},
		});
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div style="height:calc(100% - 0.8rem);">');
		H.push('<div class="ly-cols-2">');
		if (this.getInstance(this.identParamEtFiltres)) {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{
							id: this.Nom + "_C1",
							class: "aside-content full-height overflow-auto p-right",
							style: "width:" + this._getLargeurParamEtFiltres() + "px;",
						},
						IE.jsx.str("div", {
							id: this.getInstance(this.identParamEtFiltres).getNom(),
						}),
					),
				),
			);
		}
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ id: this.Nom + "_C2", class: "main-content cols" },
					IE.jsx.str(
						"div",
						{
							class: "fix-bloc p-right-l m-bottom",
							id: this.getInstance(this.identCalendrier).getNom(),
						},
						ObjetHtml_1.GHtml.composeBlanc(),
					),
					IE.jsx.str("div", {
						class: "fluid-bloc",
						id: this.getInstance(this.identRecap).getNom(),
					}),
				),
			),
		);
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	requeteCriteresSelection() {
		new ObjetRequeteListeRegimesEleve_1.ObjetRequeteListeRegimesEleve(
			this,
			this.surRecupererCriteresSelection,
		).lancerRequete({
			avecRegimesEleves: true,
			avecSeulementUtilises: true,
			avecAucun: true,
			avecMotifsAbsence: false,
			avecMotifsAbsRepas: false,
			avecMotifsAbsInternat: false,
			avecMotifsRetard: false,
			avecMotifsInfirmerie: false,
			avecIssuesInfirmerie: false,
			avecDetailElts: false,
			avecObservations: false,
		});
	}
	recupererDonnees() {
		this.getInstance(this.identSelecteurClasses).setDonnees({
			listeSelection: this._parametres.classes,
			listeTotale: this.etatUtilisateurScoEspace.getListeClasses({
				avecClasse: true,
				uniquementClasseEnseignee: true,
			}),
		});
		this.getInstance(this.identSelecteurClasses).actualiserLibelle();
		this.requeteCriteresSelection();
	}
	surRecupererCriteresSelection(aParam) {
		this._parametres.regimes = aParam.ListeRegimes;
		this.getInstance(this.identSelecteurRegimeEleve).setDonnees({
			listeSelection: this._parametres.regimes,
			listeTotale: aParam.ListeRegimes,
		});
		this.getInstance(this.identSelecteurRegimeEleve).actualiserLibelle();
		this._parametres.bourses = aParam.ListeBourses;
		this.getInstance(this.identSelecteurBourse).setDonnees({
			listeSelection: this._parametres.bourses,
			listeTotale: aParam.ListeBourses,
		});
		this.getInstance(this.identSelecteurBourse).actualiserLibelle();
		this.aFaireSurRecupererCriteresSelection(aParam);
		this.getInstance(this.identCalendrier).setDomaine(this._parametres.domaine);
	}
	initSelecteurClasses(aInstance) {
		aInstance.setOptions({ avecSelectionObligatoire: true });
	}
	evntSelecteurClasses(aParam) {
		this._parametres.classes = aParam.listeSelection;
		this.requeteDonneesRecap(this._parametres);
	}
	evntSelecteurRegime(aParam) {
		this._parametres.regimes = aParam.listeSelection;
		this.requeteDonneesRecap(this._parametres);
	}
	evntSelecteurBourse(aParam) {
		this._parametres.bourses = aParam.listeSelection;
		this.requeteDonneesRecap(this._parametres);
	}
	_initFenetreAbsParCours(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			largeur: 600,
			hauteur: 350,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
			],
		});
	}
	_getLargeurParamEtFiltres() {
		return 280;
	}
	_initCalendrier(aInstance) {
		UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(aInstance, {
			avecMultiSelection: true,
		});
		if (this.domaineRecap) {
			aInstance.setPeriodeDeConsultation(this.domaineRecap);
		}
		aInstance.setDomaineInformation(
			IE.Cycles.getDomaineFerie(),
			Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee,
		);
	}
	_evntSurCalendrier(aSelection, aDomaine) {
		this.etatUtilisateurScoEspace.setDomaineSelectionne(aDomaine);
		this._parametres.domaine = aDomaine;
		this.requeteDonneesRecap(this._parametres);
	}
}
exports._InterfaceRecapVS = _InterfaceRecapVS;
