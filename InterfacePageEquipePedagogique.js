const {
	ObjetRequetePageEquipePedagogique,
} = require("ObjetRequetePageEquipePedagogique.js");
const {
	DonneesListe_EquipePedagogique,
} = require("DonneesListe_EquipePedagogique.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { InterfacePage } = require("InterfacePage.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { UtilitaireHtml } = require("UtilitaireHtml.js");
const { GUID } = require("GUID.js");
const { ObjetTri } = require("ObjetTri.js");
const {
	UtilitaireFormaterListeParMatiereEtFonction,
} = require("UtilitaireInterfacePageEquipePedagogique.js");
const EGenreAffichage = { nom: "nom", matiere: "matiere" };
class InterfacePageEquipePedagogique extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.idPrincipal = this.Nom + "_Principal";
		this.listeProfesseurs = new ObjetListeElements();
		this.idZoneChxModeAff = GUID.getId();
	}
	construireInstances() {
		if (
			[EGenreEspace.Professeur, EGenreEspace.Etablissement].includes(
				GEtatUtilisateur.GenreEspace,
			)
		) {
			this.identTripleCombo = this.add(
				ObjetAffichagePageAvecMenusDeroulants,
				_evenementSurDernierMenuDeroulant.bind(this),
				_initialiserTripleCombo,
			);
		}
		this.identListeEquipePedagogique = this.add(
			ObjetListe,
			null,
			_initialiserListeEquipePedagogique,
		);
		if (!!this.identTripleCombo) {
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
		this.GenreStructure = EStructureAffichage.Autre;
		const lListeRadios = [];
		lListeRadios.push({
			libelle: GTraductions.getValeur("EquipePedagogique.liste.titre.nom"),
			value: EGenreAffichage.nom,
		});
		lListeRadios.push({
			libelle: GTraductions.getValeur(
				"EquipePedagogique.liste.titre.matiereFonction",
			),
			value: EGenreAffichage.matiere,
		});
		this.AddSurZone.push({
			html: UtilitaireHtml.composeGroupeRadiosBoutons({
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
		H.push(
			'<div class="EspaceGauche" style="',
			GNavigateur.isLayoutTactile ? "" : "height :100%;",
			'">',
		);
		H.push(
			'<div id="',
			this.getInstance(this.identListeEquipePedagogique).getNom(),
			'" class="p-top full-height"  style="max-width:130rem;"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	recupererDonnees() {
		if (!this.getInstance(this.identTripleCombo)) {
			lancerRequeteEquipePedagogique.call(this);
		}
	}
	actionSurRecupererDonnees(aListe) {
		Invocateur.evenement(
			ObjetInvocateur.events.activationImpression,
			EGenreImpression.GenerationPDF,
			this,
			_getParametresPDF,
		);
		$("#" + this.idZoneChxModeAff.escapeJQ() + " > input")
			.off("change")
			.on("change", _evenementChxModeAff.bind(this));
		this.listeProfesseurs = aListe;
		this.listeParMatiere =
			UtilitaireFormaterListeParMatiereEtFonction.formaterListeParMatiere(
				this.listeProfesseurs,
			);
		this.listeProfesseurs.setTri([
			ObjetTri.init((D) => {
				return D.getGenre() !== EGenreRessource.Enseignant;
			}),
			ObjetTri.init((D) => {
				return !!D.estEnleve;
			}),
			ObjetTri.init((D) => {
				return D.getPosition();
			}),
		]);
		this.listeProfesseurs.trier();
		this.getInstance(this.identListeEquipePedagogique).setDonnees(
			new DonneesListe_EquipePedagogique(this.listeProfesseurs, true),
		);
	}
}
function _evenementChxModeAff(aObjet) {
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
		new DonneesListe_EquipePedagogique(lListe, boolEstAffichageParNom),
	);
	this.modeAffichage = lModeAffichageSelectionne;
}
function _initialiserTripleCombo(aInstance) {
	aInstance.setParametres([EGenreRessource.Classe]);
}
function _evenementSurDernierMenuDeroulant() {
	lancerRequeteEquipePedagogique.call(
		this,
		GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe),
	);
}
function _initialiserListeEquipePedagogique(aInstance) {
	aInstance.setOptionsListe({ skin: ObjetListe.skin.flatDesign });
}
function lancerRequeteEquipePedagogique(aClasse) {
	Invocateur.evenement(
		ObjetInvocateur.events.activationImpression,
		EGenreImpression.Aucune,
	);
	let lParamsRequete;
	if (aClasse) {
		lParamsRequete = { classe: aClasse };
	}
	new ObjetRequetePageEquipePedagogique(
		this,
		this.actionSurRecupererDonnees,
	).lancerRequete(lParamsRequete);
}
function _getParametresPDF() {
	const lParamsPDF = {
		genreGenerationPDF: TypeHttpGenerationPDFSco.EquipePedagogique,
	};
	if (!GEtatUtilisateur.estEspacePourEleve()) {
		lParamsPDF.classe = GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.Classe,
		);
	}
	return lParamsPDF;
}
module.exports = InterfacePageEquipePedagogique;
