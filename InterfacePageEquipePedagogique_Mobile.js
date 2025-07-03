exports.InterfacePageEquipePedagogique_Mobile = void 0;
const ObjetRequetePageEquipePedagogique_1 = require("ObjetRequetePageEquipePedagogique");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const DonneesListe_EquipePedagogique_1 = require("DonneesListe_EquipePedagogique");
const GUID_1 = require("GUID");
const ObjetListe_1 = require("ObjetListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const UtilitaireInterfacePageEquipePedagogique_1 = require("UtilitaireInterfacePageEquipePedagogique");
var EGenreAffichage;
(function (EGenreAffichage) {
	EGenreAffichage["nom"] = "nom";
	EGenreAffichage["matiere"] = "matiere";
})(EGenreAffichage || (EGenreAffichage = {}));
class InterfacePageEquipePedagogique_Mobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor() {
		super(...arguments);
		this.idPrincipal = this.Nom + "_Principal";
		this.listeProfesseurs = new ObjetListeElements_1.ObjetListeElements();
		this.idZoneChxModeAff = GUID_1.GUID.getId();
		this.listeTabs = new ObjetListeElements_1.ObjetListeElements();
	}
	construireInstances() {
		this.identListeEquipePedagogique = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListeEquipePedagogique,
		);
		this.identTabs = this.add(
			ObjetTabOnglets_1.ObjetTabOnglets,
			this._evenementChxModeAff.bind(this),
			this.initTabs,
		);
		this.AddSurZone = [this.identTabs];
	}
	initTabs(aObjetTabOnglet) {
		const lListeOnglet = new ObjetListeElements_1.ObjetListeElements();
		lListeOnglet.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"EquipePedagogique.liste.titre.nom",
				),
				null,
				EGenreAffichage.nom,
			),
		);
		lListeOnglet.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"EquipePedagogique.liste.titre.matiereFonction",
				),
				null,
				EGenreAffichage.matiere,
			),
		);
		aObjetTabOnglet.setParametres(lListeOnglet);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		return this.composePageEquipePedagogique();
	}
	composePageEquipePedagogique() {
		const H = [];
		H.push('<div class="EspaceGauche" style="', "height : 100%;", '">');
		H.push(
			'<div id="',
			this.getInstance(this.identListeEquipePedagogique).getNom(),
			'" class="p-top full-height" style="height:100%; max-width:130rem;"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	recupererDonnees() {
		this.lancerRequeteEquipePedagogique();
	}
	actionSurRecupererDonnees(aListe) {
		this.listeProfesseurs = aListe;
		this.listeEquipeParMatiereEtFonction =
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
				return D.Position;
			}),
		]);
		this.listeProfesseurs.trier();
		this.getInstance(this.identListeEquipePedagogique).setDonnees(
			new DonneesListe_EquipePedagogique_1.DonneesListe_EquipePedagogique(
				this.listeProfesseurs,
				true,
			),
		);
		this.getInstance(this.identTabs).selectOnglet(0, false);
	}
	_evenementChxModeAff(aObjet) {
		const lModeAffichageSelectionne = aObjet.getGenre();
		switch (lModeAffichageSelectionne) {
			case EGenreAffichage.nom:
				this.getInstance(this.identListeEquipePedagogique).setDonnees(
					new DonneesListe_EquipePedagogique_1.DonneesListe_EquipePedagogique(
						this.listeProfesseurs,
						true,
					),
				);
				break;
			case EGenreAffichage.matiere:
				this.getInstance(this.identListeEquipePedagogique).setDonnees(
					new DonneesListe_EquipePedagogique_1.DonneesListe_EquipePedagogique(
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
}
exports.InterfacePageEquipePedagogique_Mobile =
	InterfacePageEquipePedagogique_Mobile;
