exports.InterfacePageConsoleAdministration = void 0;
const ObjetMenuOnglets_1 = require("ObjetMenuOnglets");
const ParametresAffichageDivers_1 = require("ParametresAffichageDivers");
const ParametresAffichageDivers_2 = require("ParametresAffichageDivers");
const ParametresAffichageDivers_3 = require("ParametresAffichageDivers");
const ParametresAffichageDivers_4 = require("ParametresAffichageDivers");
const ParametresAffichageMenuOnglets_1 = require("ParametresAffichageMenuOnglets");
const ObjetOnglet_1 = require("ObjetOnglet");
const ObjetPosition_1 = require("ObjetPosition");
const Enumere_Divers_1 = require("Enumere_Divers");
const Enumere_Onglet_Console_NET_1 = require("Enumere_Onglet_Console_NET");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const ParametresAffichageOnglet_1 = require("ParametresAffichageOnglet");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
var EProfilConnexion;
(function (EProfilConnexion) {
	EProfilConnexion[(EProfilConnexion["spr"] = 1)] = "spr";
	EProfilConnexion[(EProfilConnexion["ent"] = 2)] = "ent";
})(EProfilConnexion || (EProfilConnexion = {}));
class InterfacePageConsoleAdministration extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.objetApplicationConsoles = (0, AccessApp_1.getApp)();
	}
	construireInstances() {
		this.identMenuOnglets = this.add(
			ObjetMenuOnglets_1.ObjetMenuOnglets,
			null,
			this.initialiserMenuOnglets,
		);
		this.identPage = this.add(ObjetInterface_1.ObjetInterface);
	}
	construireStructureAffichage() {
		const lLargeurBordure = 1;
		const lHauteurMenuOnglets = 35 + lLargeurBordure;
		const lStyleBordure = `${lLargeurBordure}px solid ${(0, AccessApp_1.getApp)().getCouleur().texte}`;
		return IE.jsx.str(
			"div",
			{
				style: {
					position: "absolute",
					top: ObjetPosition_1.GPosition.getTop(this.Nom),
					width: "100%",
					bottom: 0,
				},
			},
			this.identMenuOnglets >= 0
				? IE.jsx.str("div", {
						id: this.getInstance(this.identMenuOnglets).getNom(),
						style: "height:32px",
						class: "AlignementBas EspaceHaut",
					})
				: "",
			this.identPage >= 0
				? IE.jsx.str(
						"div",
						{
							role: "main",
							style: {
								position: "absolute",
								top: lHauteurMenuOnglets,
								bottom: 0,
								left: 0,
								right: 0,
								backgroundColor: (0, AccessApp_1.getApp)().getCouleur().blanc,
								borderBottom: lStyleBordure,
								borderRight: lStyleBordure,
								borderLeft: lStyleBordure,
								"min-height": 50,
							},
						},
						IE.jsx.str("div", {
							id: this.getInstance(this.identPage).getNom(),
							style: { height: "100%", overflowY: "scroll" },
						}),
					)
				: "",
		);
	}
	evenementMenuOnglets(aParamOnglet) {
		this.objetApplicationConsoles.etatConsole.selectionCourante = aParamOnglet;
		this.getInstance(this.identMenuOnglets).setSelection(
			this.objetApplicationConsoles.etatConsole.selectionCourante.position,
		);
		if (this.existeInstance(this.identPage)) {
			this.getInstance(this.identPage).free();
		}
		this.Instances[this.identPage] = null;
		this.Instances[this.identPage] = this.creerPage(
			this.objetApplicationConsoles.etatConsole.selectionCourante.genre,
		);
		if (
			this.getInstance(this.identPage) instanceof
			ObjetInterface_1.ObjetInterface
		) {
			this.getInstance(this.identPage).initialiser(true);
		} else {
			this.getInstance(this.identPage).initialiser();
		}
	}
	evenementPage() {
		this.callback.appel();
	}
	creerPage(aGenreOnglet) {
		return this.construireObjetGraphique(
			this.objetApplicationConsoles.getObjetGraphiqueParGenre(aGenreOnglet),
			this.identPage,
			this.evenementPage,
		);
	}
	initialiserMenuOnglets(aObjet) {
		const lTexteActif =
			new ParametresAffichageDivers_1.ParametresAffichageTexte("texte");
		lTexteActif.setCouleur(
			(0, AccessApp_1.getApp)().getCouleur().texte,
			(0, AccessApp_1.getApp)().getCouleur().blanc,
		);
		lTexteActif.setTaillePolice(10);
		lTexteActif.setGras(false, true, true);
		lTexteActif.setSouligne(false, false);
		lTexteActif.setAlignementHorizontal(
			Enumere_Divers_1.EAlignementHorizontal.gauche,
		);
		const lActifCoinBordureSupGauche =
			new ParametresAffichageDivers_3.ParametresAffichageCoinBordure(
				"coinSuperieurGauche",
			);
		lActifCoinBordureSupGauche.setCouleur(
			(0, AccessApp_1.getApp)().getCouleur().texte,
			(0, AccessApp_1.getApp)().getCouleur().texte,
		);
		lActifCoinBordureSupGauche.setEpaisseur(1);
		const lActifCoinBordureInfDroit =
			new ParametresAffichageDivers_3.ParametresAffichageCoinBordure(
				"coinInferieurDroit",
			);
		lActifCoinBordureInfDroit.setCouleur(
			(0, AccessApp_1.getApp)().getCouleur().texte,
			(0, AccessApp_1.getApp)().getCouleur().texte,
		);
		lActifCoinBordureInfDroit.setEpaisseur(1);
		const lActifOnglet =
			new ParametresAffichageOnglet_1.ParametresAffichageOnglet(
				"parametresAffichageActif",
				(0, AccessApp_1.getApp)().getCouleur().intermediaire,
				lTexteActif,
				new ParametresAffichageDivers_2.ParametresAffichageBordure(
					"bordure",
					true,
					lActifCoinBordureSupGauche,
					lActifCoinBordureInfDroit,
				),
			);
		lActifOnglet.setCouleur(
			(0, AccessApp_1.getApp)().getCouleur().blanc,
			(0, AccessApp_1.getApp)().getCouleur().texte,
			(0, AccessApp_1.getApp)().getCouleur().themeNeutre.moyen1,
		);
		const lParametresAffichage =
			new ParametresAffichageMenuOnglets_1.ObjetParametresAffichageMenuOnglets(
				"ParametresAffichageMenuOnglets",
				30,
				"white",
				Enumere_Divers_1.EAlignementHorizontal.gauche,
				Enumere_Divers_1.EOrientation.horizontal,
				new ParametresAffichageDivers_4.ParametresAffichageSeparateur(
					"separateur",
					true,
					"white",
				),
				lActifOnglet,
				null,
			);
		aObjet.setParametres(lParametresAffichage);
	}
	getIconeOnglet(aGenre) {
		switch (aGenre) {
			case Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.publication:
				return "icon_rss";
			case Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.ent:
				return "icon_cle";
			case Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET
				.authentificationWsFed:
				return "icon_cle";
			case Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.securite:
				return "icon_lock";
			case Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET
				.edtDansAutreSite:
				return "icon_fiche_T_triple";
			case Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET
				.panneauxLumineux:
				return "icon_desktop";
		}
		return "icon_rss";
	}
	ongletAutorisePourProfil(aGenreOnglet) {
		return (
			((aGenreOnglet !==
				Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.ent &&
				aGenreOnglet !==
					Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET
						.authentificationWsFed) ||
				!this.objetApplicationConsoles.desactiverDelegationsAuthentification) &&
			(this.objetApplicationConsoles.getProfilConnexion() ===
				EProfilConnexion.spr ||
				(this.objetApplicationConsoles.getProfilConnexion() ===
					EProfilConnexion.ent &&
					aGenreOnglet ===
						Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.ent))
		);
	}
	controlerValiditeDuProfil() {
		let lTrouve = false;
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			EProfilConnexion,
		)) {
			if (
				this.objetApplicationConsoles.getProfilConnexion() ===
				EProfilConnexion[lKey]
			) {
				lTrouve = true;
			}
		}
		if (!lTrouve) {
			this.objetApplicationConsoles.setProfilConnexion(EProfilConnexion.spr);
		}
	}
	getGenresOngletDePosition() {
		const lGenreOngletDePosition = [
			Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.publication,
			Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.ent,
			Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.edtDansAutreSite,
			Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.securite,
			Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.panneauxLumineux,
		];
		return lGenreOngletDePosition;
	}
	recupererDonnees() {
		this.controlerValiditeDuProfil();
		const lGenreOngletDePosition = this.getGenresOngletDePosition();
		const lTabOnglets = [];
		let lPos = 0;
		for (let i = 0; i < lGenreOngletDePosition.length; i++) {
			const lGenreOnglet = lGenreOngletDePosition[i];
			if (
				this.ongletAutorisePourProfil(lGenreOnglet) &&
				this.objetApplicationConsoles.getObjetGraphiqueParGenre(lGenreOnglet)
			) {
				const lHint = ObjetTraduction_1.GTraductions.getValeur(
					"pageConsoleAdministration.hint",
				)
					? ObjetTraduction_1.GTraductions.getValeur(
							"pageConsoleAdministration.hint",
						)[lGenreOnglet]
					: ObjetTraduction_1.GTraductions.getValeur(
							"pageConsoleAdministration.onglets",
						)[lGenreOnglet];
				const lOnglet = new ObjetOnglet_1.ObjetOnglet(
					this.getInstance(this.identMenuOnglets).getNom() + ".Instances",
					lPos,
					this,
					this.evenementMenuOnglets,
				);
				lOnglet.setParametres({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"pageConsoleAdministration.onglets",
					)[lGenreOnglet],
					hint: lHint,
					icone: this.getIconeOnglet(lGenreOnglet),
					genre: lGenreOnglet,
					position: lPos,
				});
				lTabOnglets.push(lOnglet);
				lPos++;
			}
		}
		this.getInstance(this.identMenuOnglets).setDonnees(lTabOnglets);
		this.getInstance(this.identMenuOnglets).afficher();
		this.evenementMenuOnglets(
			this.objetApplicationConsoles.etatConsole.selectionCourante,
		);
	}
}
exports.InterfacePageConsoleAdministration = InterfacePageConsoleAdministration;
