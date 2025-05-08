const {
	ObjetRequetePageEquipePedagogique,
} = require("ObjetRequetePageEquipePedagogique.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	DonneesListe_EquipePedagogique,
} = require("DonneesListe_EquipePedagogique.js");
const { GUID } = require("GUID.js");
const { ObjetListe } = require("ObjetListe.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const {
	UtilitaireFormaterListeParMatiereEtFonction,
} = require("UtilitaireInterfacePageEquipePedagogique.js");
const EGenreAffichage = { nom: "nom", matiere: "matiere" };
class ObjetAffichageEquipePedagogique extends InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.idPrincipal = this.Nom + "_Principal";
		this.listeProfesseurs = new ObjetListeElements();
		this.idZoneChxModeAff = GUID.getId();
		this.listeTabs = new ObjetListeElements();
	}
	construireInstances() {
		this.identListeEquipePedagogique = this.add(
			ObjetListe,
			null,
			_initialiserListeEquipePedagogique,
		);
		this.identTabs = this.add(
			ObjetTabOnglets,
			_evenementChxModeAff.bind(this),
			this.initTabs,
		);
		this.AddSurZone = [this.identTabs];
	}
	initTabs(aObjetTabOnglet) {
		const lListeOnglet = new ObjetListeElements();
		lListeOnglet.add(
			new ObjetElement(
				GTraductions.getValeur("EquipePedagogique.liste.titre.nom"),
				null,
				EGenreAffichage.nom,
			),
		);
		lListeOnglet.add(
			new ObjetElement(
				GTraductions.getValeur("EquipePedagogique.liste.titre.matiereFonction"),
				null,
				EGenreAffichage.matiere,
			),
		);
		aObjetTabOnglet.setParametres(lListeOnglet);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		if (this.getInstance(this.identTripleCombo)) {
			this.AddSurZone = [this.identTripleCombo];
		}
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		return this.composePageEquipePedagogique();
	}
	composePageEquipePedagogique() {
		const H = [];
		H.push(
			'<div class="EspaceGauche" style="',
			GNavigateur.isLayoutTactile ? "" : "height : 100%;",
			'">',
		);
		H.push(
			'<div id="',
			this.getInstance(this.identListeEquipePedagogique).getNom(),
			'" class="p-top full-height" style="height:100%; max-width:130rem;"></div>',
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
		this.listeProfesseurs = aListe;
		this.listeEquipeParMatiereEtFonction =
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
				return D.Position;
			}),
		]);
		this.listeProfesseurs.trier();
		this.getInstance(this.identListeEquipePedagogique).setDonnees(
			new DonneesListe_EquipePedagogique(this.listeProfesseurs, true),
		);
		this.getInstance(this.identTabs).selectOnglet(0, false);
	}
}
function _evenementChxModeAff(aObjet) {
	const lModeAffichageSelectionne = aObjet.getGenre();
	switch (lModeAffichageSelectionne) {
		case EGenreAffichage.nom:
			this.getInstance(this.identListeEquipePedagogique).setDonnees(
				new DonneesListe_EquipePedagogique(this.listeProfesseurs, true),
			);
			break;
		case EGenreAffichage.matiere:
			this.getInstance(this.identListeEquipePedagogique).setDonnees(
				new DonneesListe_EquipePedagogique(
					this.listeEquipeParMatiereEtFonction,
					false,
				),
			);
			break;
		default:
			break;
	}
	this.modeAffichage = lModeAffichageSelectionne;
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
module.exports = ObjetAffichageEquipePedagogique;
