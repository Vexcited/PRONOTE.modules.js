const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GTraductions } = require("ObjetTraduction.js");
const { Type3Etats } = require("Type3Etats.js");
const { TypeEtatCours } = require("TypeEtatCours.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { tag } = require("tag.js");
const { UtilitaireVisios } = require("UtilitaireVisiosSco.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetTri } = require("ObjetTri.js");
class DonneesListe_RencontresPlanning extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aAvecRencontreNonPlacee, aParams) {
		super(aDonnees);
		this.avecSaisie = [
			EGenreEspace.Professeur,
			EGenreEspace.Mobile_Professeur,
			EGenreEspace.Etablissement,
			EGenreEspace.Mobile_Etablissement,
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
		const lProfPersonnels = new ObjetListeElements();
		lProfPersonnels.add([aArticle.professeurs, aArticle.personnels]);
		lHtml.push(lProfPersonnels.getTableauLibelles().join(", "));
		lHtml.push(aArticle.eleve.getLibelle());
		const lLibelleProf = lProfPersonnels.getTableauLibelles().join(", ");
		const lLibelle = GEtatUtilisateur.avecPlusieursMembres()
			? GTraductions.getValeur("Rencontres.pourEleve", [
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
			[EGenreEspace.Parent, EGenreEspace.Mobile_Parent].includes(
				GEtatUtilisateur.GenreEspace,
			)
		) {
			const lProfPersonnels = new ObjetListeElements();
			lProfPersonnels.add([
				aParams.article.professeurs,
				aParams.article.personnels,
			]);
			lTitre = this.getProfPersonnels(aParams.article);
		} else {
			lTitre = this.getEleveClasse(aParams.article);
		}
		return lTitre;
	}
	getZoneMessage(aParams) {
		const H = [];
		H.push(
			tag(
				"div",
				{ class: "flex-contain cols m-top" },
				aParams.article.salle.existeNumero()
					? `<span class="m-right-l fluid-bloc">${GTraductions.getValeur("Salle")} : ${aParams.article.salle.getLibelle()} </span>`
					: "",
				tag(
					"div",
					{ class: ["cta-contain"] },
					this.avecSaisie
						? tag(
								"ie-checkbox",
								{
									class: ["m-right-xl short"],
									"ie-model": tag.funcAttr("cbFamilleVu", [
										aParams.article.getNumero(),
									]),
								},
								GTraductions.getValeur("Rencontres.jaiVuLaFamille"),
							)
						: "",
				),
			),
		);
		return H.join("");
	}
	getZoneGauche(aParams) {
		return `<div class="time-contain colore"> ${aParams.article.strDebutRencontre} </div>`;
	}
	getZoneComplementaire(aParams) {
		return tag(
			"div",
			{ class: "flex-contain" },
			tag(
				"span",
				{ class: "self-center p-right-l" },
				aParams.article.duree.toString() +
					" " +
					GTraductions.getValeur("Rencontres.abbrMin"),
			),
			_composeLienVisio.call(this, aParams.article),
		);
	}
	getInfosSuppZonePrincipale(aParams) {
		return [EGenreEspace.Parent, EGenreEspace.Mobile_Parent].includes(
			GEtatUtilisateur.GenreEspace,
		)
			? aParams.article.strMatiereFonction
			: tag(
					"span",
					this.getResponsables(aParams.article),
					"<br>",
					tag("span", aParams.article.strMatiereFonction),
				);
	}
	getVisible(D) {
		return (
			D.etat === TypeEtatCours.Impose ||
			D.etat === TypeEtatCours.Pose ||
			this.avecRencontreNonPlacee
		);
	}
	setAvecRencontreNonPlacee(aAvecRencontreNonPlacee) {
		this.avecRencontreNonPlacee = aAvecRencontreNonPlacee;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			cbFamilleVu: {
				getValue: function (aNumero) {
					if (aNumero) {
						const lElement = aInstance.Donnees.getElementParNumero(aNumero);
						return lElement && lElement.aEuLieu === Type3Etats.TE_Oui;
					}
				},
				setValue: function (aNumero, aValue) {
					if (aNumero) {
						const lElement = aInstance.Donnees.getElementParNumero(aNumero);
						lElement.aEuLieu = aValue ? Type3Etats.TE_Oui : Type3Etats.TE_Non;
						if (this.instance.callback) {
							this.instance.callback.appel(lElement);
						}
					}
				},
			},
			getNodeVisio: function (aNumero) {
				$(this.node).on("click", () => {
					_ouvrirLienVisio.call(aInstance, aNumero, false);
				});
			},
		});
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
			GTraductions.getValeur(lCleLienVisio),
			true,
			function () {
				_ouvrirLienVisio.call(
					this.Donnees,
					aParametres.article.getNumero(),
					true,
				);
			},
			{ icon: "icon_cours_virtuel" },
		);
		const lRencontreVu =
			aParametres.article.aEuLieu === Type3Etats.TE_Oui
				? "Rencontres.jeNaiPasVuLaFamille"
				: "Rencontres.jaiVuLaFamille";
		const lIconeRencontre =
			aParametres.article.aEuLieu === Type3Etats.TE_Oui
				? "icon_eye_open"
				: "icon_eye_close";
		aParametres.menuContextuel.add(
			GTraductions.getValeur(lRencontreVu),
			true,
			function () {
				aParametres.article.aEuLieu =
					aParametres.article.aEuLieu === Type3Etats.TE_Oui
						? Type3Etats.TE_Non
						: Type3Etats.TE_Oui;
				if (this.callback) {
					this.callback.appel(aParametres.article);
				}
			},
			{ icon: lIconeRencontre },
		);
		aParametres.menuContextuel.setDonnees();
	}
	getTri() {
		return [
			ObjetTri.init("place", EGenreTriElement.Croissant),
			ObjetTri.init("strMatiereFonction"),
			ObjetTri.init("eleve.Libelle"),
		];
	}
}
function _ouvrirLienVisio(aNumero, aEnSaisie) {
	const lElement = this.Donnees.getElementParNumero(aNumero);
	if (lElement) {
		let strResponsables = this.getResponsables(lElement);
		if (this.avecSaisie && aEnSaisie) {
			let lVisio = lElement.visio ? lElement.visio : new ObjetElement();
			lVisio.titreFenetre = GTraductions.getValeur(
				"Rencontres.lienRencontreAvec",
				[this.getEleveClasse(lElement), strResponsables],
			);
			UtilitaireVisios.ouvrirFenetreEditionVisios(
				lVisio,
				null,
				(aGenreBouton, aVisio) => {
					if (this.params && this.params.callbackVisio) {
						this.params.callbackVisio(aVisio, lElement);
					}
				},
			);
		} else if (lElement.visio) {
			const lTitre = this.avecSaisie
				? this.getEleveClasse(lElement) + "<br>" + strResponsables
				: GTraductions.getValeur("Rencontres.lienRencontreAvec", [
						this.getProfPersonnels(lElement),
						"<br>" + lElement.strMatiereFonction,
					]);
			const lOptions = { titre: lTitre };
			UtilitaireVisios.ouvrirFenetreConsultVisio(lElement.visio, lOptions);
		}
	}
}
function _composeLienVisio(aElement) {
	if (aElement.visio) {
		const H = tag("ie-btnicon", {
			class: [
				"theme_color_foncee i-large avecFond",
				UtilitaireVisios.getNomIconePresenceVisios(),
			],
			"ie-node": tag.funcAttr("getNodeVisio", [aElement.getNumero()]),
			"ie-hint": UtilitaireVisios.getHintVisio(aElement),
			title: UtilitaireVisios.getHintVisio(aElement),
		});
		return ([EGenreEspace.Professeur, EGenreEspace.Mobile_Professeur].includes(
			GEtatUtilisateur.GenreEspace,
		) &&
			this.avecSaisie) ||
			aElement
			? H
			: "";
	}
	return "";
}
module.exports = { DonneesListe_RencontresPlanning };
