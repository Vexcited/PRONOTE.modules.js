exports.DonneesListe_ListePersonnels = exports.InterfaceListePersonnels =
	void 0;
const AccessApp_1 = require("AccessApp");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetElement_1 = require("ObjetElement");
const ObjetFenetre_Discussion_1 = require("ObjetFenetre_Discussion");
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetRequeteListeRessourcesPourCommunication_1 = require("ObjetRequeteListeRessourcesPourCommunication");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
class InterfaceListePersonnels extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor() {
		super(...arguments);
		this.application = (0, AccessApp_1.getApp)();
		this.etatUtilisateur = this.application.getEtatUtilisateur();
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe_1.ObjetListe, null, this.initListe);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichage() {
		return IE.jsx.str(
			"div",
			{
				class: [Divers_css_1.StylesDivers.lyCols1],
				style: { maxWidth: !IE.estMobile && "130rem" },
			},
			IE.jsx.str("div", {
				class: [Divers_css_1.StylesDivers.fullHeight],
				id: this.getNomInstance(this.identListe),
			}),
		);
	}
	recupererDonnees() {
		this.requeteConsultation();
	}
	afficherListe(aListe) {
		const lInstance = this.getInstance(this.identListe);
		lInstance.setDonnees(new DonneesListe_ListePersonnels(aListe));
	}
	initListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
			ariaLabel: this.etatUtilisateur.getLibelleLongOnglet(),
		});
	}
	async requeteConsultation() {
		const lResponse =
			await new ObjetRequeteListeRessourcesPourCommunication_1.ObjetRequeteListeRessourcesPourCommunication(
				this,
			).lancerRequete({
				onglet: ObjetElement_1.ObjetElement.create({
					Genre: Enumere_Ressource_1.EGenreRessource.Personnel,
				}),
				filtreElement: this.etatUtilisateur.getMembre(),
			});
		this.afficherListe(lResponse.listeRessourcesPourCommunication);
	}
}
exports.InterfaceListePersonnels = InterfaceListePersonnels;
class DonneesListe_ListePersonnels extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.application = (0, AccessApp_1.getApp)();
	}
	getInfosSuppZonePrincipale({ article }) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				null,
				UtilitaireMessagerie_1.UtilitaireMessagerie.getLibelleSuppListePublics(
					article,
				),
			),
			IE.jsx.str(
				"div",
				null,
				article.email &&
					IE.jsx.str("a", { href: `mailto:${article.email}` }, article.email),
			),
		);
	}
	avecBoutonActionLigne() {
		return this.avecCommandeDiscussionsCommunes();
	}
	avecCommandeDiscussionsCommunes() {
		return (
			!IE.estMobile &&
			this.application.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
			) &&
			!this.application.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
			)
		);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (this.avecCommandeDiscussionsCommunes()) {
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"fenetreCommunication.bouton.discussionsCommunes",
				),
				true,
				() =>
					ObjetFenetre_Discussion_1.ObjetFenetre_Discussion.afficherDiscussionsCommunes(
						new ObjetListeElements_1.ObjetListeElements().add(
							aParametres.article,
						),
					),
			);
		}
		aParametres.menuContextuel.setDonnees();
	}
}
exports.DonneesListe_ListePersonnels = DonneesListe_ListePersonnels;
