exports.ObjetAffichagePageMenus_Mobile = void 0;
const ObjetRequetePageMenus_1 = require("ObjetRequetePageMenus");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const UtilitaireMenus_1 = require("UtilitaireMenus");
const Enumere_Repas_1 = require("Enumere_Repas");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_LegendeIconesMenu_1 = require("ObjetFenetre_LegendeIconesMenu");
const ObjetBoutonFlottant_1 = require("ObjetBoutonFlottant");
const ObjetMenuCantine_1 = require("ObjetMenuCantine");
const TypeDomaine_1 = require("TypeDomaine");
class ObjetAffichagePageMenus_Mobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.jourActif = null;
		this.avecDetailAllergenes = true;
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementCalendrier,
			this.initDate,
		);
		this.identPage = this.add(
			ObjetMenuCantine_1.ObjetMenuCantine,
			null,
			(aInstance) => aInstance.setFiltre(this.avecDetailAllergenes),
		);
		const lAddSurZone = [this.identDate];
		this.dateCourant = null;
		this.identTabs = this.add(
			ObjetTabOnglets_1.ObjetTabOnglets,
			this.eventTabs,
			this.initTabs,
		);
		lAddSurZone.push(this.identTabs);
		this.AddSurZone = lAddSurZone;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnModale: {
				getStyle() {
					return { bottom: "9%", marginRight: "5%" };
				},
				getIdentiteBouton() {
					return {
						class: ObjetBoutonFlottant_1.ObjetBoutonFlottant,
						pere: this,
						init(aBtn) {
							aInstance.identBtnFlottant = aBtn;
							const lParam = {
								listeBoutons: [
									{
										primaire: true,
										icone: "icon_legende",
										ariaLabel:
											ObjetTraduction_1.GTraductions.getValeur(
												"menus.TitreFenetre",
											),
										callback: aInstance.ouvrirFenetreIcones.bind(aInstance),
									},
								],
							};
							aBtn.setOptionsBouton(lParam);
						},
					};
				},
			},
		});
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identPage;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	recupererDonnees() {
		this.dateCourant = GApplication.getEtatUtilisateur().getDerniereDate();
		if (GApplication.getDemo()) {
			this.dateCourant = GApplication.getDateDemo();
		}
		this.getInstance(this.identDate).setDonnees(this.dateCourant, true);
	}
	initDate(aInstance) {
		const lOptions = {
			avecBoutonsPrecedentSuivant: true,
			avecSelectionSemaine: false,
		};
		aInstance.setOptionsObjetCelluleDate(lOptions);
		const lActifJour = new TypeDomaine_1.TypeDomaine();
		this.applicationSco
			.getObjetParametres()
			.joursDemiPension.each((i) => lActifJour.setValeur(true, i + 1));
		aInstance.setParametresFenetre(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			lActifJour,
		);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(`<div class="InterfacePageMenus">`);
		H.push(`<div id="${this.getInstance(this.identTabs).getNom()}"></div>`);
		H.push(`<div id="${this.getInstance(this.identPage).getNom()}"></div>`);
		if (!this.identBtnFlottant) {
			$("#" + GInterface.idZonePrincipale).ieHtmlAppend(
				'<div class="is-sticky" ie-style="btnModale.getStyle" ie-identite="btnModale.getIdentiteBouton" ></div>',
				{ controleur: this.controleur },
			);
		}
		H.push(`</div>`);
		return H.join("");
	}
	evenementCalendrier(aSelection) {
		this.dateCourant = aSelection;
		new ObjetRequetePageMenus_1.ObjetRequetePageMenus(
			this,
			this.actionSurCalendrier,
		).lancerRequete(this.dateCourant);
	}
	eventTabs(aOnglet) {
		this.afficherRepas(aOnglet.getGenre());
	}
	initTabs(aInstance) {
		const lListeOnglet = new ObjetListeElements_1.ObjetListeElements();
		lListeOnglet.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("menus.Midi"),
				0,
				Enumere_Repas_1.EGenreRepas.Midi,
			),
		);
		lListeOnglet.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("menus.Soir"),
				0,
				Enumere_Repas_1.EGenreRepas.Soir,
			),
		);
		aInstance.setParametres(lListeOnglet);
	}
	actionSurCalendrier(aParams) {
		this.ListeJours = aParams.ListeJours;
		this.listeAllergenes = aParams.ListeAllergenes;
		this.listelabels = aParams.Listelabels;
		const lListe = this.ListeJours.getListeElements((aJour) =>
			ObjetDate_1.GDate.estJourEgal(this.dateCourant, aJour.Date),
		);
		if (lListe.count() > 0) {
			const lJourActif = lListe.get(0);
			this.donnees = UtilitaireMenus_1.UtilitaireMenus.formatDonneesJour(
				lJourActif,
				this.ListeJours,
				aParams.AvecRepasMidi,
				aParams.AvecRepasSoir,
			);
			this.jourActif = lJourActif;
		} else {
			this.donnees = null;
			this.jourActif = null;
		}
		const lTabs = this.getInstance(this.identTabs);
		if (this.donnees && this.donnees.avecPlusieurRepas) {
			lTabs.setVisible(true);
			lTabs.selectOnglet(Enumere_Repas_1.EGenreRepas.Midi);
		} else {
			lTabs.setVisible(false);
			if (this.donnees) {
				this.setVisibleBtn(true);
				this.getInstance(this.identPage).setDonnees({ donnees: this.donnees });
			} else {
				this.setVisibleBtn(false);
				this.getInstance(this.identPage).afficherMessage(
					this.composeAucuneDonnee(
						ObjetTraduction_1.GTraductions.getValeur("menus.MenuVide"),
					),
				);
			}
		}
	}
	setVisibleBtn(aParam) {
		if (this.identBtnFlottant) {
			this.identBtnFlottant.setVisible(aParam);
		}
	}
	afficherRepas(aGenre) {
		this.setVisibleBtn(true);
		this.getInstance(this.identPage).setDonnees({
			donnees: this.donnees,
			genreRepas: aGenre,
		});
	}
	ouvrirFenetreIcones() {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_LegendeIconesMenu_1.ObjetFenetre_LegendeIconesMenu,
			{ pere: this },
		).setDonnees({
			listeAllergenes: this.listeAllergenes,
			listelabels: this.listelabels,
		});
	}
	free() {
		super.free();
		if (this.identBtnFlottant) {
			$("#" + this.identBtnFlottant.getNom().escapeJQ()).remove();
		}
	}
}
exports.ObjetAffichagePageMenus_Mobile = ObjetAffichagePageMenus_Mobile;
