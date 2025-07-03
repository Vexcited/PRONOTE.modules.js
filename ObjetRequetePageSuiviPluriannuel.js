exports.ObjetRequetePageSuiviPluriannuel = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetRequetePageSuiviPluriannuel extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aNumeroEleve, aParam) {
		this.JSON.eleve = new ObjetElement_1.ObjetElement(null, aNumeroEleve);
		this.param = aParam;
		if (this.param) {
			this.JSON.avecMoyennes = this.param.avecMoyennes;
			this.JSON.annees = this.param.annees;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		let lParam = { message: this.JSONReponse.message };
		if (!lParam.message) {
			const lAvecMoyennesSaisies = this.JSONReponse.avecMoyennesSaisies;
			const lAnneesSelectionnees =
				new ObjetListeElements_1.ObjetListeElements();
			const lListe = new ObjetListeElements_1.ObjetListeElements();
			const lListeMetas = this.JSONReponse.listeMetas;
			const lListeAnnees = this.JSONReponse.listeAnnees;
			const lListeDonnees = this.JSONReponse.listeDonnees;
			const lListeTotal = new ObjetElement_1.ObjetElement();
			const lInfosGrapheTotal = [];
			lListeMetas.parcourir((aMeta) => {
				const lLigne = new ObjetElement_1.ObjetElement();
				let lCompteur = 0;
				const lInfosGraphe = [];
				lLigne.matiere = aMeta.getLibelle();
				lListeAnnees.parcourir((aAnnee, aIndex) => {
					const lDonneeAnnee = lListeDonnees.get(aIndex);
					const lAnnee = new ObjetElement_1.ObjetElement();
					lAnnee.strAnnee = lDonneeAnnee.strAnnee;
					lAnnee.nbMaxPeriode = lDonneeAnnee.nbMaxPeriode;
					lAnnee.couleur = lDonneeAnnee.couleur;
					lAnnee.bareme = lDonneeAnnee.bareme;
					lAnnee.strClasses = lDonneeAnnee.strClasses;
					lAnnee.avecBulletins = lDonneeAnnee.avecBulletins;
					if (lAnnee.avecBulletins) {
						lAnnee.listeBulletins = lDonneeAnnee.listeBulletins;
					}
					lAnnee.suivi = _getDonnees(lCompteur, aMeta.Numero, lListeDonnees);
					lLigne["annee" + lCompteur] = lAnnee;
					lInfosGraphe.push({
						moyenne: lAnnee.suivi.moyenne,
						bareme: lAnnee.bareme,
						couleur: lAnnee.couleur,
					});
					if (!lListeTotal["annee" + lCompteur]) {
						const lTotal = new ObjetElement_1.ObjetElement();
						lTotal.moyenne = lDonneeAnnee.moyenne;
						lTotal.moyenneClasse = lDonneeAnnee.moyenneClasse;
						lTotal.strEsito = lDonneeAnnee.strEsito;
						lTotal.strAssiduite = lDonneeAnnee.strAssiduite;
						lTotal.hintAssiduite = lDonneeAnnee.hintAssiduite;
						lTotal.credits = lDonneeAnnee.credits;
						lListeTotal["annee" + lCompteur] = lTotal;
						lInfosGrapheTotal.push({
							moyenne: lTotal.moyenne,
							bareme: lAnnee.bareme,
							couleur: lAnnee.couleur,
						});
						const lAnneeSelectionnee = new ObjetElement_1.ObjetElement(
							lAnnee.strAnnee,
							lDonneeAnnee.identifiant,
						);
						lAnneeSelectionnee.cmsActif = true;
						lAnneeSelectionnee.strFin = lDonneeAnnee.strFinAnnee;
						lAnneesSelectionnees.addElement(lAnneeSelectionnee);
					}
					lCompteur++;
				});
				lLigne.infosGraphe = lInfosGraphe;
				lListe.addElement(lLigne);
			});
			lParam = {
				nombreDAnnees: lListeAnnees.count(),
				listeDonnees: lListe,
				listeTotal: lListeTotal,
				listeAnnees: lAnneesSelectionnees,
				infosGrapheTotal: lInfosGrapheTotal,
				avecMoyennesSaisies: lAvecMoyennesSaisies,
				grapheAvecMoyenne: this.JSONReponse.grapheAvecMoyenne,
				grapheSansMoyenne: this.JSONReponse.grapheSansMoyenne,
				grapheMessage: this.JSONReponse.grapheMessage,
				afficherMoyenneGenerale: this.JSONReponse.afficherMoyenneGenerale,
			};
		}
		this.callbackReussite.appel(lParam);
	}
}
exports.ObjetRequetePageSuiviPluriannuel = ObjetRequetePageSuiviPluriannuel;
CollectionRequetes_1.Requetes.inscrire(
	"PageSuiviPluriannuel",
	ObjetRequetePageSuiviPluriannuel,
);
function _getDonnees(aIdAnnee, aMeta, aListe) {
	const lListeSuivis = aListe.get(aIdAnnee).listeSuivis;
	let result = new ObjetElement_1.ObjetElement();
	lListeSuivis.parcourir((aElement) => {
		if (aElement.meta.Numero === aMeta) {
			result = aElement;
		}
	});
	return result;
}
