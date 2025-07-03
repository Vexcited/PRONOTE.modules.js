exports.ObjetSelecteurMotifPunition = void 0;
const _ObjetSelecteur_1 = require("_ObjetSelecteur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_SelectionMotifsPunition_1 = require("DonneesListe_SelectionMotifsPunition");
const ObjetListe_1 = require("ObjetListe");
class ObjetSelecteurMotifPunition extends _ObjetSelecteur_1._ObjetSelecteur {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({
			titreFenetre: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.SelectionnerIncidents",
			),
			titreLibelle: ObjetTraduction_1.GTraductions.getValeur(
				"RecapPunition.motifsPunitionSanction",
			),
			tooltip: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.SelectionnerIncidents",
			),
		});
	}
	construireInstanceFenetreSelection() {
		this.identFenetreSelection = this.addFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			this.evntFenetreSelection,
			this.initFenetreSelection,
		);
	}
	setDonnees(aParam) {
		super.setDonnees(aParam);
		this.param = MethodesObjet_1.MethodesObjet.dupliquer(aParam);
	}
	initFenetreSelection(aInstance) {
		aInstance.setOptionsFenetre({
			modale: true,
			titre: this._options.titreFenetre,
			largeur: 450,
			hauteur: 700,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			modeActivationBtnValider:
				aInstance.modeActivationBtnValider.auMoinsUnEltSelectionne,
		});
		aInstance.paramsListe = {
			editable: false,
			optionsListe: {
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				avecToutSelectionner: true,
				avecCBToutCocher: true,
				boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
			},
		};
	}
	evntFenetreSelection(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			const lListeRessourcesSelectionnees = this.tempMotifs.getListeElements(
				(aElement) => {
					return aElement.cmsActif && !aElement.estUnDeploiement;
				},
			);
			this.callback.appel({ listeSelection: lListeRessourcesSelectionnees });
			this.listeSelection = lListeRessourcesSelectionnees;
			this.actualiserLibelle();
		}
	}
	evntBtnSelection() {
		this.tempMotifs = MethodesObjet_1.MethodesObjet.dupliquer(this.listeTotale);
		const lListeSelect = this.listeSelection;
		this.tempMotifs.parcourir((aElement) => {
			aElement.cmsActif = !!lListeSelect.getElementParNumeroEtGenre(
				aElement.getNumero(),
				aElement.getGenre(),
			);
		});
		this.getInstance(this.identFenetreSelection).setDonnees(
			new DonneesListe_SelectionMotifsPunition_1.DonneesListe_SelectionMotifsPunition(
				this.tempMotifs,
				{},
			),
			false,
		);
	}
}
exports.ObjetSelecteurMotifPunition = ObjetSelecteurMotifPunition;
