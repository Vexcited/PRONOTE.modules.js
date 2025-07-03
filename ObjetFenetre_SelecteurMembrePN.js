exports.ObjetFenetre_SelecteurMembrePN = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const DonneesListe_SelecteurMembrePN_1 = require("DonneesListe_SelecteurMembrePN");
const ObjetElement_1 = require("ObjetElement");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_SelecteurMembreCP_1 = require("ObjetFenetre_SelecteurMembreCP");
const TraductionsAppliMobile_1 = require("TraductionsAppliMobile");
class ObjetFenetre_SelecteurMembrePN extends ObjetFenetre_SelecteurMembreCP_1.ObjetFenetre_SelecteurMembreCP {
	constructor(...aParams) {
		super(...aParams);
		this.interfaceMobile = GInterface;
	}
	evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				if (aParametres.article.pourAppli) {
					window.messageData.push({ action: "changerProfil" });
				} else {
					this.interfaceMobile.changementRessource(aParametres.ligne);
				}
				this.fermer();
				break;
		}
	}
	getDonneesListe(aListe) {
		return new DonneesListe_SelecteurMembrePN_1.DonneesListe_SelecteurMembrePN(
			aListe,
		);
	}
	static ouvrir() {
		var _a;
		const lApplicationScoMobile = GApplication;
		const lListeRessources = MethodesObjet_1.MethodesObjet.dupliquer(
			lApplicationScoMobile.getInterfaceMobile().getListeRessources(),
		);
		if (
			GApplication.estAppliMobile &&
			((_a =
				lApplicationScoMobile === null || lApplicationScoMobile === void 0
					? void 0
					: lApplicationScoMobile.profilsApp) === null || _a === void 0
				? void 0
				: _a.length) > 1
		) {
			const lLibelle = `${TraductionsAppliMobile_1.TradAppliMobile.ChangerCompte} (${lApplicationScoMobile.profilsApp.length})`;
			const lCompteAppli = new ObjetElement_1.ObjetElement(lLibelle);
			lCompteAppli.pourAppli = true;
			lListeRessources.add(lCompteAppli);
		}
		let lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelecteurMembrePN,
			{
				pere: this,
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({ avecScroll: true });
				},
			},
		);
		lFenetre.afficher();
		lFenetre.setDonnees({
			listeRessources: lListeRessources,
			nbreRecherche: ObjetFenetre_SelecteurMembrePN.miniPourRecherche,
		});
	}
}
exports.ObjetFenetre_SelecteurMembrePN = ObjetFenetre_SelecteurMembrePN;
