exports.InterfacePageSaisieAbsences_Journee = void 0;
const PageSaisieAbsences_1 = require("PageSaisieAbsences");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetClass_1 = require("ObjetClass");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetGestionnaireMotifs_1 = require("ObjetGestionnaireMotifs");
const Enumere_EvenementSaisieAbsences_1 = require("Enumere_EvenementSaisieAbsences");
const AccessApp_1 = require("AccessApp");
class InterfacePageSaisieAbsences_Journee extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilScoEspace = this.appScoEspace.getEtatUtilisateur();
		this.parametresSco = this.appScoEspace.getObjetParametres();
		this.TexteRetard = "5'";
		this.TexteExclusion = ObjetTraduction_1.GTraductions.getValeur(
			"AbsenceVS.ExclusionAbr",
		);
		this.TexteInfirmerie = ObjetTraduction_1.GTraductions.getValeur(
			"AbsenceVS.InfirmerieAbr",
		);
		this.CouleurAbsence = "#fdce40";
		this.CouleurRetard = "#3333cc";
		this.CouleurExclusion = "var(--color-red-moyen)";
		this.CouleurInfirmerie = "#008000";
		this.genreAbsenceActif = Enumere_Ressource_1.EGenreRessource.Absence;
		this.options = {
			avecSaisiePunition: false,
			avecSaisieExclusion: false,
			avecSaisiePassageInfirmerie: false,
			avecSaisieRetard: false,
		};
	}
	construireInstances() {
		this.IdentAbsences = this.add(
			PageSaisieAbsences_1.PageSaisieAbsences,
			this.evenementAbsences,
			this.initialiserAbsences,
		);
		if (this.options.avecSaisieExclusion) {
			this.identGestionnaireMotifs = this.add(
				ObjetGestionnaireMotifs_1.ObjetGestionnaireMotifs,
				this._surGestionnaireMotifs.bind(this),
			);
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			radioTypeAbsence: {
				getValue: function (aGenreAbsence) {
					return aInstance.genreAbsenceActif === aGenreAbsence;
				},
				setValue: function (aGenreAbsence) {
					aInstance.genreAbsenceActif = aGenreAbsence;
					aInstance
						.getInstance(aInstance.IdentAbsences)
						.setTypeAbsence(aGenreAbsence);
					switch (aGenreAbsence) {
						case Enumere_Ressource_1.EGenreRessource.Retard:
							ObjetHtml_1.GHtml.setFocus(aInstance.Nom + "_DureeRetard");
							break;
					}
				},
				getDisabled: function (aGenreAbsence) {
					return !aInstance._genreAbsenceAutoriseSurCoursCourant(aGenreAbsence);
				},
			},
			btnSaisiePunition: {
				event() {
					aInstance._evenementSurBoutonSaisiePunitions();
				},
				getDisabled() {
					let lEstActif = false;
					if (aInstance.getActif()) {
						const lEleveSelectionne =
							aInstance.etatUtilScoEspace.Navigation.getRessource(
								Enumere_Ressource_1.EGenreRessource.Eleve,
							);
						if (!!lEleveSelectionne) {
							lEstActif = true;
							if (
								!!lEleveSelectionne.estSorti ||
								!!lEleveSelectionne.sortiePeda ||
								!!lEleveSelectionne.estDetache
							) {
								lEstActif = false;
							}
						}
					}
					return !lEstActif;
				},
			},
			btnListePunitions: {
				event() {
					aInstance._evenementSurBoutonListePunitions();
				},
				getDisabled() {
					let lEstActif = false;
					if (aInstance.getActif()) {
						lEstActif = true;
					}
					return !lEstActif;
				},
			},
			getHintBtnListePunitions() {
				return ObjetTraduction_1.GTraductions.getValeur(
					"Absence.HintBoutonVoirPunition",
				);
			},
		});
	}
	setDonnees(aOptions) {
		$.extend(this.options, aOptions);
	}
	setDonneesBandeauAbsences(ADureeRetard, AListeMotifsExclusion) {
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_BandeauAbsences", true);
		if (MethodesObjet_1.MethodesObjet.isNumber(ADureeRetard)) {
			this.DureeRetard = ADureeRetard;
			ObjetHtml_1.GHtml.setValue(this.Nom + "_DureeRetard", "" + ADureeRetard);
		}
		this.listeMotifsExclusion = AListeMotifsExclusion;
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div class="m-all" style="height:60px;">' +
				this.composeBandeauAbsences() +
				"</div>",
		);
		H.push(
			'<div class="m-all" id="' +
				this.Instances[this.IdentAbsences].getNom() +
				'" style="position:relative;"></div>',
		);
		return H.join("");
	}
	composeBandeauAbsences() {
		const lHauteurContenu = 37;
		const lHtml = [];
		lHtml.push(
			'<table id="',
			this.Nom,
			'_BandeauAbsences" class="EspaceBas p-left-s" style="display:none;">',
			'<tr><td class="full-width">',
		);
		lHtml.push(
			'<fieldset class="',
			ObjetClass_1.GClass.getZone(),
			'" style="margin:0 2px 2px 0; padding:0;">',
			'<legend class="',
			ObjetClass_1.GClass.getLegende(),
			'">',
			ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.LegendeFeuilleAppel"),
			"</legend>",
			'<table style="' +
				ObjetStyle_1.GStyle.composeHeight(lHauteurContenu) +
				'">',
			"<tr>",
		);
		lHtml.push(
			'<td class="EspaceGauche">',
			"<table><tr>",
			"<td>",
			'<ie-radio ie-model="radioTypeAbsence(',
			Enumere_Ressource_1.EGenreRessource.Absence,
			')">',
			ObjetTraduction_1.GTraductions.getValeur("Absence.Absence"),
			"</ie-radio>",
			"</td>",
			'<td class="PetitEspaceGauche"><div style="width:15px; border:1px solid darkgray; background-color: ',
			this.CouleurAbsence,
			';" class="Texte9">&nbsp;</div></td>',
			"</tr></table>",
			"</td>",
		);
		if (this.options.avecSaisieRetard) {
			lHtml.push(
				'<td class="GrandEspaceGauche">',
				"<table><tr>",
				"<td>",
				'<ie-radio ie-model="radioTypeAbsence(',
				Enumere_Ressource_1.EGenreRessource.Retard,
				')">',
				ObjetTraduction_1.GTraductions.getValeur("Absence.Retard"),
				"</ie-radio>",
				"</td>",
				'<td class="PetitEspaceGauche"><input type="text" maxlength="3" style="width:30px;" tabindex="-1" class="Texte10 CelluleTexte" id="',
				this.Nom,
				'_DureeRetard" onchange="',
				this.Nom,
				'.evenementSurDureeRetard (value)" onkeypress="',
				this.Nom,
				'.surKeyPressDureeRetard (event)" /></td>',
				'<td class="Texte10 Gras EspaceGauche">' +
					ObjetTraduction_1.GTraductions.getValeur("Absence.minute") +
					"</td>",
				"</tr></table>",
				"</td>",
			);
		}
		if (this.options.avecSaisieExclusion) {
			lHtml.push(
				'<td class="GrandEspaceGauche">',
				"<table><tr>",
				"<td>",
				'<ie-radio ie-model="radioTypeAbsence(',
				Enumere_Ressource_1.EGenreRessource.Exclusion,
				')">',
				ObjetTraduction_1.GTraductions.getValeur("Absence.Exclusion"),
				"</ie-radio>",
				"</td>",
				'<td class="EspaceGauche Gras" style="color:',
				this.CouleurExclusion,
				'">',
				this.TexteExclusion,
				"</td>",
				"</tr></table>",
				"</td>",
			);
		}
		if (this.options.avecSaisiePassageInfirmerie) {
			lHtml.push(
				'<td class="GrandEspaceGauche EspaceDroit">',
				"<table><tr>",
				"<td>",
				'<ie-radio ie-model="radioTypeAbsence(',
				Enumere_Ressource_1.EGenreRessource.Infirmerie,
				')">',
				ObjetTraduction_1.GTraductions.getValeur("Absence.Infirmerie"),
				"</ie-radio>",
				"</td>",
				'<td class="EspaceGauche Gras" style="color:',
				this.CouleurInfirmerie,
				'; font-family:Verdana, Geneva, Arial, Helvetica, sans-serif;">',
				this.TexteInfirmerie,
				"</td>",
				"</tr></table>",
				"</td>",
			);
		}
		lHtml.push("</tr>", "</table>", "</fieldset>", "</td>");
		if (this.options.avecSaisiePunition) {
			lHtml.push(
				'<td class="EspaceGauche">',
				'<fieldset class="',
				ObjetClass_1.GClass.getZone(),
				'" style="margin:0px 2px 2px 2px; padding:0px;">',
				'<legend class="',
				ObjetClass_1.GClass.getLegende(),
				'">',
				ObjetTraduction_1.GTraductions.getValeur("Absence.TitrePunitions"),
				"</legend>",
				'<table style="' +
					ObjetStyle_1.GStyle.composeHeight(lHauteurContenu) +
					'"><tr>',
			);
			lHtml.push(
				'<td class="EspaceGauche"><div class="Image_IconePunition"></div></td>',
			);
			lHtml.push(
				'<td><ie-bouton ie-model="btnSaisiePunition">',
				ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.SaisirPunition"),
				"</ie-bouton></td>",
			);
			lHtml.push(
				'<td><ie-bouton ie-model="btnListePunitions" ie-title="getHintBtnListePunitions">',
				ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Liste"),
				"</ie-bouton></td>",
			);
			lHtml.push("</tr></table>", "</fieldset>", "</td>");
		}
		lHtml.push("</tr>", "</table>");
		return lHtml.join("");
	}
	initialiserAbsences(aInstance) {
		aInstance.setCouleurs(
			this.CouleurAbsence,
			this.CouleurExclusion,
			this.CouleurRetard,
			this.CouleurInfirmerie,
		);
		aInstance.setParametres(
			this.parametresSco.PlacesParJour,
			this.parametresSco.PlacesParHeure,
			this.parametresSco.LibellesHeures,
		);
	}
	evenementAbsences(aEvent, aObjet) {
		switch (aEvent) {
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.CreerExclusion:
				if (!this.options.avecSaisieExclusion) {
					return;
				}
				this.objAbsence = aObjet;
				this.getInstance(this.identGestionnaireMotifs).ouvrirFenetre({
					avecSetDonnees: true,
				});
				break;
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.SelectionEleve:
				if (this.options.avecSaisiePunition) {
					this.$refresh();
				}
				return this.callback.appel(aEvent, aObjet);
			default:
				return this.callback.appel(aEvent, aObjet);
		}
	}
	_evenementSurBoutonListePunitions() {
		if (!this.options.avecSaisiePunition) {
			return;
		}
		this.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.PunitionListe,
		);
	}
	_evenementSurBoutonSaisiePunitions() {
		if (!this.options.avecSaisiePunition) {
			return;
		}
		this.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.PunitionSaisie,
		);
	}
	evenementSurDureeRetard(AValeur) {
		const LDuree = parseInt(AValeur, 10);
		if (!isNaN(LDuree) && LDuree >= 1 && LDuree <= 999) {
			this.DureeRetard = LDuree;
		}
		ObjetHtml_1.GHtml.setValue(this.Nom + "_DureeRetard", this.DureeRetard);
		this.getInstance(this.IdentAbsences).setDonneesDureeRetard(
			this.DureeRetard,
		);
		this.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.DureeRetard,
			{ dureeRetard: this.DureeRetard },
		);
	}
	surKeyPressDureeRetard(aEvent) {
		GNavigateur.setCaractereTouche(aEvent);
		if (!GNavigateur.estCaractereDecimal()) {
			GNavigateur.bloquerValeurEvenement(aEvent);
		}
	}
	recupererDonnees() {}
	setActif(aEstActif) {
		super.setActif(aEstActif);
		ObjetHtml_1.GHtml.setDisplay(
			this.getInstance(this.IdentAbsences).getNom(),
			aEstActif,
		);
	}
	setDeplacementBornes(aEstDeplace) {
		this.getInstance(this.IdentAbsences).setAvecDeplacementBornes(aEstDeplace);
	}
	afficher(aMessage) {
		ObjetHtml_1.GHtml.setDisplay(
			this.getInstance(this.IdentAbsences).getNom(),
			true,
		);
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_BandeauAbsences", false);
		this.getInstance(this.IdentAbsences).afficher(aMessage);
	}
	setDonneesAbsences(aObjet) {
		this.coursSelectionne = aObjet ? aObjet.cours : null;
		if (!this._genreAbsenceAutoriseSurCoursCourant(this.genreAbsenceActif)) {
			this.genreAbsenceActif = Enumere_Ressource_1.EGenreRessource.Absence;
		}
		this.enAffichage = true;
		const lIdBandeau = this.Nom + "_BandeauAbsences";
		ObjetHtml_1.GHtml.setDisplay(lIdBandeau, false);
		if (aObjet) {
			aObjet.callbackAvecGrille = function () {
				ObjetHtml_1.GHtml.setDisplay(lIdBandeau, true);
			};
		}
		this.getInstance(this.IdentAbsences).setDonnees(aObjet);
	}
	setEnAffichage() {
		this.enAffichage = false;
		this.getInstance(this.IdentAbsences).DonneesRecues = false;
	}
	setPlacesSaisie(aDebut, aFin) {
		this.getInstance(this.IdentAbsences).setDonneesPlacesSaisie(aDebut, aFin);
	}
	retourAbsence(aNumeroEleve, aRessourceAbsence, aBidon) {
		this.getInstance(this.IdentAbsences).evenementAbsence(
			aNumeroEleve,
			aRessourceAbsence,
		);
	}
	actualiserPunitionsEleve(aNumeroEleve) {
		this.getInstance(this.IdentAbsences).actualiserPunitionsEleve(aNumeroEleve);
	}
	_genreAbsenceAutoriseSurCoursCourant(aGenreAbsence) {
		if (this.coursSelectionne && this.coursSelectionne.estSortiePedagogique) {
			return (
				aGenreAbsence !== Enumere_Ressource_1.EGenreRessource.Infirmerie &&
				aGenreAbsence !== Enumere_Ressource_1.EGenreRessource.Exclusion
			);
		}
		return true;
	}
	_surGestionnaireMotifs(aParam) {
		if (
			aParam.event ===
			ObjetGestionnaireMotifs_1.ObjetGestionnaireMotifs.genreEvent
				.actualiserDonnees
		) {
			if (aParam.genreBouton === 1) {
				this.objAbsence.listeMotifs = aParam.liste;
				this.callback.appel(
					Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
						.ActionSurAbsence,
					this.objAbsence,
				);
			} else {
				if (this.objAbsence && this.objAbsence.callbackAnnulation) {
					this.objAbsence.callbackAnnulation();
				}
			}
		}
	}
}
exports.InterfacePageSaisieAbsences_Journee =
	InterfacePageSaisieAbsences_Journee;
