exports.InterfacePageEquipePedagogique = void 0;
const ObjetRequetePageEquipePedagogique_1 = require("ObjetRequetePageEquipePedagogique");
const DonneesListe_EquipePedagogique_1 = require("DonneesListe_EquipePedagogique");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const InterfacePage_1 = require("InterfacePage");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const UtilitaireHtml_1 = require("UtilitaireHtml");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireInterfacePageEquipePedagogique_1 = require("UtilitaireInterfacePageEquipePedagogique");
const AccessApp_1 = require("AccessApp");
var EGenreAffichage;
(function (EGenreAffichage) {
	EGenreAffichage["nom"] = "nom";
	EGenreAffichage["matiere"] = "matiere";
})(EGenreAffichage || (EGenreAffichage = {}));
class InterfacePageEquipePedagogique extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.etatUtilEspac = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.idPrincipal = this.Nom + "_Principal";
		this.listeProfesseurs = new ObjetListeElements_1.ObjetListeElements();
		this.idZoneChxModeAff = `${this.Nom}_idZoneChxModeAff`;
	}
	construireInstances() {
		if (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
			].includes(this.etatUtilEspac.GenreEspace)
		) {
			this.identTripleCombo = this.add(
				InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
				this._evenementSurDernierMenuDeroulant.bind(this),
				this._initialiserTripleCombo,
			);
		}
		this.identListeEquipePedagogique = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListeEquipePedagogique,
		);
		if (this.getInstance(this.identTripleCombo)) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		} else {
			this.IdPremierElement = this.getInstance(
				this.identListeEquipePedagogique,
			).getPremierElement();
		}
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		if (this.getInstance(this.identTripleCombo)) {
			this.AddSurZone = [this.identTripleCombo];
		}
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		const lListeRadios = [];
		lListeRadios.push({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"EquipePedagogique.liste.titre.nom",
			),
			value: EGenreAffichage.nom,
		});
		lListeRadios.push({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"EquipePedagogique.liste.titre.matiereFonction",
			),
			value: EGenreAffichage.matiere,
		});
		this.AddSurZone.push({
			html: UtilitaireHtml_1.UtilitaireHtml.composeGroupeRadiosBoutons({
				id: this.idZoneChxModeAff,
				listeRadios: lListeRadios,
				selectedValue: this.modeAffichage,
			}),
		});
	}
	construireStructureAffichageAutre() {
		return this.composePageEquipePedagogique();
	}
	composePageEquipePedagogique() {
		const H = [];
		H.push('<div class="EspaceGauche" style="', "height :100%;", '">');
		H.push(
			'<div id="',
			this.getInstance(this.identListeEquipePedagogique).getNom(),
			'" class="p-top full-height" style="max-width:130rem;"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	recupererDonnees() {
		if (!this.getInstance(this.identTripleCombo)) {
			this.lancerRequeteEquipePedagogique();
		}
	}
	actionSurRecupererDonnees(aListe) {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
			this,
			this._getParametresPDF.bind(this),
		);
		$("#" + this.idZoneChxModeAff.escapeJQ() + " > input")
			.off("change")
			.on("change", this._evenementChxModeAff.bind(this));
		this.listeProfesseurs = aListe;
		this.listeParMatiere =
			UtilitaireInterfacePageEquipePedagogique_1.UtilitaireFormaterListeParMatiereEtFonction.formaterListeParMatiere(
				this.listeProfesseurs,
			);
		this.listeProfesseurs.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getGenre() !== Enumere_Ressource_1.EGenreRessource.Enseignant;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.estEnleve;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getPosition();
			}),
		]);
		this.listeProfesseurs.trier();
		this.getInstance(this.identListeEquipePedagogique).setDonnees(
			new DonneesListe_EquipePedagogique_1.DonneesListe_EquipePedagogique(
				this.listeProfesseurs,
				true,
			),
		);
	}
	_evenementChxModeAff(aObjet) {
		const lModeAffichageSelectionne = $(aObjet.target).val();
		let lListe;
		let boolEstAffichageParNom;
		switch (lModeAffichageSelectionne) {
			case EGenreAffichage.nom:
				lListe = this.listeProfesseurs;
				boolEstAffichageParNom = true;
				break;
			case EGenreAffichage.matiere:
				lListe = this.listeParMatiere;
				boolEstAffichageParNom = false;
				break;
			default:
				break;
		}
		this.getInstance(this.identListeEquipePedagogique).setDonnees(
			new DonneesListe_EquipePedagogique_1.DonneesListe_EquipePedagogique(
				lListe,
				boolEstAffichageParNom,
			),
		);
		this.modeAffichage = lModeAffichageSelectionne;
	}
	_initialiserTripleCombo(aInstance) {
		aInstance.setParametres([Enumere_Ressource_1.EGenreRessource.Classe]);
	}
	_evenementSurDernierMenuDeroulant() {
		this.lancerRequeteEquipePedagogique(
			this.etatUtilEspac.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
		);
	}
	_initialiserListeEquipePedagogique(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
		});
	}
	lancerRequeteEquipePedagogique(aClasse) {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		let lParamsRequete;
		if (aClasse) {
			lParamsRequete = { classe: aClasse };
		}
		new ObjetRequetePageEquipePedagogique_1.ObjetRequetePageEquipePedagogique(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete(lParamsRequete);
	}
	_getParametresPDF() {
		const lParamsPDF = {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.EquipePedagogique,
		};
		if (!this.etatUtilEspac.estEspacePourEleve()) {
			lParamsPDF.classe = this.etatUtilEspac.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			);
		}
		return lParamsPDF;
	}
}
exports.InterfacePageEquipePedagogique = InterfacePageEquipePedagogique;
