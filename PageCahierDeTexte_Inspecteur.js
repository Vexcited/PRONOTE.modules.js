const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { PageCahierDeTexte } = require("PageCahierDeTexte.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
Requetes.inscrire("SaisieVisaCDT", ObjetRequeteSaisie);
class PageCahierDeTexte_Inspecteur extends PageCahierDeTexte {
	constructor(...aParams) {
		super(...aParams);
	}
	composeLibelleTitrePrincipal(aListeDonnees, aLibelle, aPourImpression) {
		const H = [];
		H.push(aLibelle);
		if (aPourImpression) {
			return H.join("");
		}
		const lCDTsAvecVisas = new ObjetListeElements(),
			LCDTsSansVisas = new ObjetListeElements();
		if (aListeDonnees) {
			aListeDonnees.parcourir((aCDT) => {
				if (!aCDT.dateVisaI && !aCDT.individuVisaI) {
					LCDTsSansVisas.addElement(aCDT);
				} else {
					lCDTsAvecVisas.addElement(aCDT);
				}
			});
		}
		this.controleur.bouton = {
			event: function (aViser) {
				let lListe;
				if (aViser) {
					lListe = LCDTsSansVisas;
				} else {
					lListe = lCDTsAvecVisas;
				}
				lListe.setSerialisateurJSON({ ignorerEtatsElements: true });
				Requetes("SaisieVisaCDT", this.instance, () => {
					this.instance.callback.appel({ actualiser: true });
				}).lancerRequete({ cdts: lListe, viser: aViser });
			},
		};
		if (lCDTsAvecVisas.count() > 0) {
			H.push(
				'<ie-bouton ie-model="bouton(false)" style="float:right; position:relative; margin-left:5px;">',
				GTraductions.getValeur("CahierDeTexte.SupprimerLesVisas"),
				"</ie-bouton>",
			);
		}
		if (LCDTsSansVisas.count() > 0) {
			H.push(
				'<ie-bouton ie-model="bouton(true)" style="float:right; position:relative;">',
				GTraductions.getValeur("CahierDeTexte.ViserCahiersDeTextes"),
				"</ie-bouton>",
			);
		}
		return H.join("");
	}
}
module.exports = PageCahierDeTexte_Inspecteur;
