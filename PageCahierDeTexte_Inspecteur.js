exports.PageCahierDeTexte_Inspecteur = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const PageCahierDeTexte_1 = require("PageCahierDeTexte");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
CollectionRequetes_1.Requetes.inscrire(
	"SaisieVisaCDT",
	ObjetRequeteJSON_1.ObjetRequeteSaisie,
);
class PageCahierDeTexte_Inspecteur extends PageCahierDeTexte_1.PageCahierDeTexte {
	composeLibelleTitrePrincipal(aListeDonnees, aLibelle) {
		const H = [];
		H.push(aLibelle);
		const lCDTsAvecVisas = new ObjetListeElements_1.ObjetListeElements(),
			LCDTsSansVisas = new ObjetListeElements_1.ObjetListeElements();
		if (aListeDonnees) {
			aListeDonnees.parcourir((aCDT) => {
				if (!aCDT.dateVisaI && !aCDT.individuVisaI) {
					LCDTsSansVisas.addElement(aCDT);
				} else {
					lCDTsAvecVisas.addElement(aCDT);
				}
			});
		}
		const lJSXModeleBouton = (aViser) => {
			return {
				event: () => {
					let lListe;
					if (aViser) {
						lListe = LCDTsSansVisas;
					} else {
						lListe = lCDTsAvecVisas;
					}
					lListe.setSerialisateurJSON({ ignorerEtatsElements: true });
					(0, CollectionRequetes_1.Requetes)("SaisieVisaCDT", this, () => {
						this.callback.appel({ actualiser: true });
					}).lancerRequete({ cdts: lListe, viser: aViser });
				},
			};
		};
		if (lCDTsAvecVisas.count() > 0) {
			H.push(
				IE.jsx.str(
					"ie-bouton",
					{
						"ie-model": lJSXModeleBouton.bind(this, false),
						style: "float:right; position:relative; margin-left:5px;",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.SupprimerLesVisas",
					),
				),
			);
		}
		if (LCDTsSansVisas.count() > 0) {
			H.push(
				IE.jsx.str(
					"ie-bouton",
					{
						"ie-model": lJSXModeleBouton.bind(this, true),
						style: "float:right; position:relative;",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.ViserCahiersDeTextes",
					),
				),
			);
		}
		return H.join("");
	}
}
exports.PageCahierDeTexte_Inspecteur = PageCahierDeTexte_Inspecteur;
