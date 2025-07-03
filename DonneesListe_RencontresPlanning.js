exports.DonneesListe_RencontresPlanning = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const Type3Etats_1 = require("Type3Etats");
const TypeEtatCours_1 = require("TypeEtatCours");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const UtilitaireVisiosSco_1 = require("UtilitaireVisiosSco");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetTri_1 = require("ObjetTri");
class DonneesListe_RencontresPlanning extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aAvecRencontreNonPlacee, aParams) {
		super(aDonnees);
		this.avecSaisie = [
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			Enumere_Espace_1.EGenreEspace.Etablissement,
			Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
		].includes(GEtatUtilisateur.GenreEspace);
		this.setOptions({
			avecEvnt_Selection: false,
			avecDeselectionSurNonSelectionnable: false,
			avecEvnt_SelectionDblClick: false,
			avecBoutonActionLigne: this.avecSaisie,
			avecTri: true,
		});
		this.params = aParams;
		this.avecRencontreNonPlacee = aAvecRencontreNonPlacee;
	}
	getEleveClasse(aArticle) {
		return `${aArticle.eleve.getLibelle()} (${aArticle.classe.getLibelle()})`;
	}
	getProfPersonnels(aArticle) {
		const lHtml = [];
		const lProfPersonnels = new ObjetListeElements_1.ObjetListeElements();
		lProfPersonnels.add(aArticle.professeurs).add(aArticle.personnels);
		lHtml.push(lProfPersonnels.getTableauLibelles().join(", "));
		lHtml.push(aArticle.eleve.getLibelle());
		const lLibelleProf = lProfPersonnels.getTableauLibelles().join(", ");
		const lLibelle = GEtatUtilisateur.avecPlusieursMembres()
			? ObjetTraduction_1.GTraductions.getValeur("Rencontres.pourEleve", [
					lLibelleProf,
					aArticle.eleve.getLibelle(),
				])
			: lLibelleProf;
		return lLibelle;
	}
	getResponsables(aArticle) {
		return aArticle.responsables
			? aArticle.responsables.getTableauLibelles().join(", ")
			: "";
	}
	getTitreZonePrincipale(aParams) {
		let lTitre = "";
		if (
			[
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			lTitre = this.getProfPersonnels(aParams.article);
		} else {
			lTitre = this.getEleveClasse(aParams.article);
		}
		return lTitre;
	}
	jsxModeleCheckboxNomPropriete(aArticle) {
		return {
			getValue: () => {
				return aArticle.aEuLieu === Type3Etats_1.Type3Etats.TE_Oui;
			},
			setValue: (aValue) => {
				aArticle.aEuLieu = aValue
					? Type3Etats_1.Type3Etats.TE_Oui
					: Type3Etats_1.Type3Etats.TE_Non;
				if (this.params.callback) {
					this.params.callback(aArticle);
				}
			},
		};
	}
	getZoneMessage(aParams) {
		const lStrSalle = [];
		if (aParams.article.salle && aParams.article.salle.existeNumero()) {
			lStrSalle.push(
				IE.jsx.str(
					"span",
					{ class: "m-right-l fluid-bloc" },
					ObjetTraduction_1.GTraductions.getValeur("Salle"),
					" : ",
					aParams.article.salle.getLibelle(),
				),
			);
		}
		const lContenuJaiVuLaFamille = [];
		if (this.avecSaisie) {
			lContenuJaiVuLaFamille.push(
				IE.jsx.str(
					"ie-checkbox",
					{
						class: ["m-right-xl short"],
						"ie-model": this.jsxModeleCheckboxNomPropriete.bind(
							this,
							aParams.article,
						),
					},
					ObjetTraduction_1.GTraductions.getValeur("Rencontres.jaiVuLaFamille"),
				),
			);
		}
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain cols m-top" },
				lStrSalle.join(""),
				IE.jsx.str(
					"div",
					{ class: "cta-contain" },
					lContenuJaiVuLaFamille.join(""),
				),
			),
		);
		return H.join("");
	}
	getZoneGauche(aParams) {
		return IE.jsx.str(
			"div",
			{ class: "time-contain colore" },
			" ",
			aParams.article.strDebutRencontre,
			" ",
		);
	}
	getZoneComplementaire(aParams) {
		return IE.jsx.str(
			"div",
			{ class: "flex-contain" },
			IE.jsx.str(
				"span",
				{ class: "self-center p-right-l" },
				aParams.article.duree.toString(),
				" ",
				ObjetTraduction_1.GTraductions.getValeur("Rencontres.abbrMin"),
			),
			this._composeLienVisio(aParams.article),
		);
	}
	getInfosSuppZonePrincipale(aParams) {
		const H = [];
		if (
			[
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			H.push(aParams.article.strMatiereFonction);
		} else {
			H.push(
				IE.jsx.str(
					"span",
					null,
					this.getResponsables(aParams.article),
					IE.jsx.str("br", null),
					IE.jsx.str("span", null, aParams.article.strMatiereFonction),
				),
			);
		}
		return H.join("");
	}
	getVisible(D) {
		return (
			D.etat === TypeEtatCours_1.TypeEtatCours.Impose ||
			D.etat === TypeEtatCours_1.TypeEtatCours.Pose ||
			this.avecRencontreNonPlacee
		);
	}
	setAvecRencontreNonPlacee(aAvecRencontreNonPlacee) {
		this.avecRencontreNonPlacee = aAvecRencontreNonPlacee;
	}
	avecMenuContextuel(aParams) {
		return !!aParams.article && this.avecSaisie;
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel || !this.avecSaisie) {
			return;
		}
		const lCleLienVisio = aParametres.article.visio
			? "Rencontres.modifierLienVisio"
			: "Rencontres.creerLienVisio";
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur(lCleLienVisio),
			true,
			() => {
				this._ouvrirLienVisio(aParametres.article, true);
			},
			{ icon: "icon_cours_virtuel" },
		);
		const lRencontreVu =
			aParametres.article.aEuLieu === Type3Etats_1.Type3Etats.TE_Oui
				? "Rencontres.jeNaiPasVuLaFamille"
				: "Rencontres.jaiVuLaFamille";
		const lIconeRencontre =
			aParametres.article.aEuLieu === Type3Etats_1.Type3Etats.TE_Oui
				? "icon_eye_close"
				: "icon_eye_open";
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur(lRencontreVu),
			true,
			() => {
				aParametres.article.aEuLieu =
					aParametres.article.aEuLieu === Type3Etats_1.Type3Etats.TE_Oui
						? Type3Etats_1.Type3Etats.TE_Non
						: Type3Etats_1.Type3Etats.TE_Oui;
				if (this.params.callback) {
					this.params.callback(aParametres.article);
				}
			},
			{ icon: lIconeRencontre },
		);
		aParametres.menuContextuel.setDonnees();
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.init(
				"place",
				Enumere_TriElement_1.EGenreTriElement.Croissant,
			),
			ObjetTri_1.ObjetTri.init("strMatiereFonction"),
			ObjetTri_1.ObjetTri.init("eleve.Libelle"),
		];
	}
	_ouvrirLienVisio(aArticle, aEnSaisie) {
		let strResponsables = this.getResponsables(aArticle);
		if (this.avecSaisie && aEnSaisie) {
			let lVisio = aArticle.visio
				? aArticle.visio
				: new ObjetElement_1.ObjetElement();
			lVisio.titreFenetre = ObjetTraduction_1.GTraductions.getValeur(
				"Rencontres.lienRencontreAvec",
				[this.getEleveClasse(aArticle), strResponsables],
			);
			UtilitaireVisiosSco_1.UtilitaireVisios.ouvrirFenetreEditionVisios(
				lVisio,
				null,
				(aGenreBouton, aVisio) => {
					if (this.params && this.params.callback) {
						this.params.callback(aArticle, aVisio);
					}
				},
			);
		} else if (aArticle.visio) {
			const lTitre = this.avecSaisie
				? this.getEleveClasse(aArticle) + "<br>" + strResponsables
				: ObjetTraduction_1.GTraductions.getValeur(
						"Rencontres.lienRencontreAvec",
						[
							this.getProfPersonnels(aArticle),
							"<br>" + aArticle.strMatiereFonction,
						],
					);
			const lOptions = { titre: lTitre };
			UtilitaireVisiosSco_1.UtilitaireVisios.ouvrirFenetreConsultVisio(
				aArticle.visio,
				lOptions,
			);
		}
	}
	jsxModeleBoutonLienVisio(aArticle) {
		return {
			event: () => {
				this._ouvrirLienVisio(aArticle, false);
			},
		};
	}
	_composeLienVisio(aElement) {
		if (aElement.visio) {
			let lLabel = aElement.visio.libelleLien || aElement.visio.url;
			const H = IE.jsx.str("ie-btnicon", {
				class: [
					"theme_color_foncee i-large avecFond",
					UtilitaireVisiosSco_1.UtilitaireVisios.getNomIconePresenceVisios(),
				],
				"ie-model": this.jsxModeleBoutonLienVisio.bind(this, aElement),
				"ie-tooltipdescribe":
					UtilitaireVisiosSco_1.UtilitaireVisios.getHintVisio(aElement.visio),
				"aria-label": lLabel,
			});
			return ([
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			].includes(GEtatUtilisateur.GenreEspace) &&
				this.avecSaisie) ||
				aElement
				? H
				: "";
		}
		return "";
	}
}
exports.DonneesListe_RencontresPlanning = DonneesListe_RencontresPlanning;
