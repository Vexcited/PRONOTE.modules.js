exports.InterfaceBulletinBIA = void 0;
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetDocumentsATelecharger_1 = require("ObjetDocumentsATelecharger");
const ObjetRequeteDocumentsATelecharger_1 = require("ObjetRequeteDocumentsATelecharger");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetTri_1 = require("ObjetTri");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetRequeteListeElevesBIA_1 = require("ObjetRequeteListeElevesBIA");
const AccessApp_1 = require("AccessApp");
const Enumere_Message_1 = require("Enumere_Message");
class InterfaceBulletinBIA extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor() {
		super(...arguments);
		this.etatUtil = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.avecSelecteurEleve =
			IE.estMobile &&
			this.etatUtil.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur;
	}
	construireInstances() {
		if (this.avecSelecteurEleve) {
			this.identSelection = this.add(
				ObjetSelection_1.ObjetSelection,
				this._evenementSelection,
				(aInstance) => {
					aInstance.setOptions({
						labelWAICellule:
							ObjetTraduction_1.GTraductions.getValeur("Message")[
								Enumere_Message_1.EGenreMessage.SelectionEleve
							],
					});
				},
			);
			this.AddSurZone = [this.identSelection];
		}
		this.identDocuments = this.add(
			ObjetDocumentsATelecharger_1.ObjetDocumentsATelecharger,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
	}
	construireStructureAffichage() {
		this.construireStructureAffichageBandeau();
		const lStyle = `height:100%;width:100%;max-width:${!IE.estMobile ? "45rem" : "100%"}`;
		return IE.jsx.str("div", {
			style: lStyle,
			id: this.getNomInstance(this.identDocuments),
		});
	}
	recupererDonnees() {
		if (this.avecSelecteurEleve) {
			this._requeteListeEleve();
		} else {
			this._requeteDocuments();
		}
	}
	_evenementSelection(aParam) {
		this._requeteDocuments(aParam.element.listeElevesBIA);
	}
	_requeteDocuments(aListeElevesBIA) {
		this.listeDocs = null;
		const lAvecListeElevesBIA =
			aListeElevesBIA &&
			[Enumere_Onglet_1.EGenreOnglet.BulletinAnneesPrec_Note].includes(
				this.etatUtil.getGenreOnglet(),
			) &&
			this.avecSelecteurEleve;
		return new ObjetRequeteDocumentsATelecharger_1.ObjetRequeteDocumentsATelecharger(
			this,
		)
			.lancerRequete({
				avecNotes: [
					Enumere_Onglet_1.EGenreOnglet.BulletinAnneesPrec_Note,
				].includes(this.etatUtil.getGenreOnglet()),
				avecCompetences: [
					Enumere_Onglet_1.EGenreOnglet.BulletinAnneesPrec_Competence,
				].includes(this.etatUtil.getGenreOnglet()),
				listeElevesBIA: lAvecListeElevesBIA && aListeElevesBIA,
			})
			.then((aDonnees) => {
				this.listeDocs = aDonnees.liste;
				this.getInstance(this.identDocuments).setDonnees({
					listeDocs: aDonnees.liste,
				});
			});
	}
	_requeteListeEleve() {
		new ObjetRequeteListeElevesBIA_1.ObjetRequeteListeElevesBIA(this)
			.lancerRequete()
			.then((aJSON) => {
				const lListe =
					aJSON.liste || new ObjetListeElements_1.ObjetListeElements();
				lListe
					.parcourir((aEleve) => {
						aEleve.Libelle = aEleve.nom + " " + aEleve.prenom;
					})
					.setTri([
						ObjetTri_1.ObjetTri.init("nom"),
						ObjetTri_1.ObjetTri.init("prenom"),
					])
					.trier();
				this.getInstance(this.identSelection).setVisible(lListe.count() > 0);
				if (lListe.count() === 0) {
					this.afficher(
						this.composeAucuneDonnee(
							ObjetTraduction_1.GTraductions.getValeur(
								"DocumentsATelecharger.Aucun",
							),
						),
					);
				} else {
					this.getInstance(this.identSelection).setDonnees(lListe, 0, "");
				}
			});
	}
}
exports.InterfaceBulletinBIA = InterfaceBulletinBIA;
