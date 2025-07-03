exports._InterfacePageDossiers = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetListeElements_1 = require("ObjetListeElements");
const DonneesListe_Dossiers_1 = require("DonneesListe_Dossiers");
const InterfacePage_1 = require("InterfacePage");
const ObjetListe_1 = require("ObjetListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetRequetePageDossiers_1 = require("ObjetRequetePageDossiers");
class _InterfacePageDossiers extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.afficherAnneesPrecedentes = false;
	}
	construireInstances() {
		this.identListeDossiers = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementListeDossiers,
			this.initialiserListe,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [];
		this.completerAddSurZone();
		this.IdentZoneAlClient = this.identListeDossiers;
	}
	completerAddSurZone() {}
	getCallbackDeListe() {
		return null;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "interface_affV p-all-l" },
				this.IdentRecapitulatif
					? IE.jsx.str("div", {
							id: this.getNomInstance(this.IdentRecapitulatif),
						})
					: "",
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identListeDossiers),
					class: "interface_affV_client",
				}),
			),
		);
		return H.join("");
	}
	evenementListeDossiers(aParametres) {}
	lancerRequeteDonnees() {
		this.setEtatSaisie(false);
		this.executerRequetePageDossiers();
	}
	executerRequetePageDossiers() {
		const lParamsRequete = this.getParametresRequete();
		new ObjetRequetePageDossiers_1.ObjetRequetePageDossiers(
			this,
			this.actionSurRequetePageDossiers,
		).lancerRequete(lParamsRequete);
	}
	getParametresRequete() {
		return null;
	}
	actionSurRequetePageDossiers(aJSONRequete) {
		this.afficherBandeau(true);
		if (!!aJSONRequete.msg) {
			this.evenementAfficherMessage(aJSONRequete.msg);
		} else {
			this.listePJEleve = aJSONRequete.listePJ;
			this.ListeGenres = aJSONRequete.listeGenres;
			this.ListeDossiers = aJSONRequete.listeDossiers;
			this.setDonneesObjetRecapitulatif(
				aJSONRequete.listeGenres,
				this.afficherAnneesPrecedentes,
			);
			const ListeDossiersMiseEnForme =
				new ObjetListeElements_1.ObjetListeElements();
			this.ListeDossiers.parcourir((aDossier) => {
				aDossier.estDossier = true;
				ListeDossiersMiseEnForme.addElement(aDossier);
				if (aDossier.listeElements) {
					aDossier.listeElements.parcourir((aElement) => {
						aElement.pere = aDossier;
						aElement.estDossier = false;
						aDossier.estUnDeploiement = true;
						aDossier.estDeploye = true;
						if (aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
							ListeDossiersMiseEnForme.addElement(aElement);
						}
					});
				}
			});
			this.getInstance(this.identListeDossiers).setDonnees(
				new DonneesListe_Dossiers_1.DonneesListe_Dossiers(
					ListeDossiersMiseEnForme,
					this.getCallbackDeListe(),
				),
			);
		}
	}
	setDonneesObjetRecapitulatif(aListeGenres, aAfficherAnneesPrecedentes) {}
}
exports._InterfacePageDossiers = _InterfacePageDossiers;
