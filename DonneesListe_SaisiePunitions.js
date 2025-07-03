exports.DonneesListe_SaisiePunitions = void 0;
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEtatRealisationPunition_1 = require("TypeEtatRealisationPunition");
const ObjetUtilitaireAbsence_1 = require("ObjetUtilitaireAbsence");
class DonneesListe_SaisiePunitions extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aAutorisations) {
		super(aDonnees);
		this._autorisations = aAutorisations;
		this.setOptions({
			avecContenuTronque: true,
			avecEvnt_Selection: true,
			avecEvnt_Creation: true,
			avecEvnt_ApresSuppression: true,
		});
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SaisiePunitions.colonnes.date:
				return this._autorisations.saisie && !aParams.article.estLieIncident;
			case DonneesListe_SaisiePunitions.colonnes.motif:
				return this._autorisations.saisie && !aParams.article.estLieIncident;
			case DonneesListe_SaisiePunitions.colonnes.dossier:
				return (
					this._autorisations.saisie &&
					this._autorisations.avecPublicationDossier &&
					aParams.article.avecDossier
				);
			case DonneesListe_SaisiePunitions.colonnes.publication:
				return (
					this._autorisations.saisie &&
					this._autorisations.avecPublicationPunitions
				);
		}
		return false;
	}
	getCouleurCellule(aParams) {
		if (this._autorisations.saisie) {
			switch (aParams.idColonne) {
				case DonneesListe_SaisiePunitions.colonnes.nature:
					return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
				case DonneesListe_SaisiePunitions.colonnes.etat:
					if (
						!aParams.article.typesEtatPunition ||
						aParams.article.typesEtatPunition.count() === 0
					) {
						return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
					}
					break;
			}
		}
	}
	avecEvenementEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SaisiePunitions.colonnes.motif:
				return this._autorisations.saisie && !aParams.article.estLieIncident;
			case DonneesListe_SaisiePunitions.colonnes.publication:
				return this._autorisations.saisie;
		}
		return false;
	}
	avecSuppression() {
		return this._autorisations.saisie;
	}
	suppressionImpossible(D) {
		return !this._autorisations.saisie || !D.userEstProprietaire;
	}
	getMessageSuppressionImpossible() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"punition.suppressionImpossible",
		);
	}
	getMessageSuppressionConfirmation() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"punition.suppressionConfirmation",
		);
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SaisiePunitions.colonnes.date:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
					.DateCalendrier;
			case DonneesListe_SaisiePunitions.colonnes.etat:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Image;
			case DonneesListe_SaisiePunitions.colonnes.dossier:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_SaisiePunitions.colonnes.publication:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SaisiePunitions.colonnes.date:
				return aParams.article.dateDemande || "";
			case DonneesListe_SaisiePunitions.colonnes.nature:
				return !!aParams.article.nature
					? aParams.article.nature.getLibelle()
					: "";
			case DonneesListe_SaisiePunitions.colonnes.motif:
				return !!aParams.article.motifs
					? aParams.article.motifs.getTableauLibelles().join(", ")
					: "";
			case DonneesListe_SaisiePunitions.colonnes.etat:
				return TypeEtatRealisationPunition_1.TypeEtatRealisationPunitionUtil.getClassImage(
					aParams.article.typesEtatPunition,
				);
			case DonneesListe_SaisiePunitions.colonnes.dossier:
				return !!aParams.article.publicationDossier;
			case DonneesListe_SaisiePunitions.colonnes.publication:
				return IE.jsx.str("i", {
					role: "img",
					class:
						ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getClassesIconePublicationPunition(
							aParams.article.datePublication,
						),
					title:
						ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getHintPublicationPunition(
							aParams.article.datePublication,
						),
					"aria-label":
						ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getHintPublicationPunition(
							aParams.article.datePublication,
						),
				});
		}
		return "";
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_SaisiePunitions.colonnes.publication:
				lClasses.push("AlignementMilieu");
				break;
		}
		return lClasses.join(" ");
	}
	getTooltip(aParams) {
		if (aParams.idColonne === DonneesListe_SaisiePunitions.colonnes.etat) {
			return aParams.article.hintRealisation;
		}
		return "";
	}
	surEdition(aParams, aValeur) {
		switch (aParams.idColonne) {
			case DonneesListe_SaisiePunitions.colonnes.date:
				if (ObjetDate_1.GDate.estDateValide(aValeur)) {
					aParams.article.dateDemande = aValeur;
				}
				break;
			case DonneesListe_SaisiePunitions.colonnes.dossier:
				aParams.article.publicationDossier = aValeur;
				break;
		}
	}
	initialiserObjetGraphique(aParams, aInstance) {
		let lDateDernier = GParametres.DerniereDate;
		for (let i = 0; i < aParams.article.programmations.count(); i++) {
			const lProg = aParams.article.programmations.get(i);
			if (
				lProg.dateExecution &&
				ObjetDate_1.GDate.estAvantJour(lProg.dateExecution, lDateDernier)
			) {
				lDateDernier = lProg.dateExecution;
			}
			if (
				lProg.dateRealisation &&
				ObjetDate_1.GDate.estAvantJour(lProg.dateRealisation, lDateDernier)
			) {
				lDateDernier = lProg.dateRealisation;
			}
			if (
				lProg.report &&
				lProg.report.existe() &&
				lProg.report.dateExecution &&
				ObjetDate_1.GDate.estAvantJour(
					lProg.report.dateRealisation,
					lDateDernier,
				)
			) {
				lDateDernier = lProg.report.dateRealisation;
			}
		}
		aInstance.setParametres(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			lDateDernier,
			GParametres.JoursOuvres,
			null,
			GParametres.JoursFeries,
			false,
		);
	}
	setDonneesObjetGraphique(aParams, aInstance) {
		aInstance.setDonnees(aParams.article.dateDemande);
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (aParametres.avecCreation) {
			aParametres.menuContextuel.addCommande(
				Enumere_CommandeMenu_1.EGenreCommandeMenu.Creation,
				ObjetTraduction_1.GTraductions.getValeur("liste.creer"),
				!aParametres.nonEditable,
			);
		}
		aParametres.menuContextuel.addCommande(
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
			ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
			!aParametres.nonEditable &&
				aParametres.avecSuppression &&
				this._avecSuppression(aParametres),
		);
	}
}
exports.DonneesListe_SaisiePunitions = DonneesListe_SaisiePunitions;
(function (DonneesListe_SaisiePunitions) {
	let colonnes;
	(function (colonnes) {
		colonnes["date"] = "DL_SaisiePunition_date";
		colonnes["nature"] = "DL_SaisiePunition_nature";
		colonnes["motif"] = "DL_SaisiePunition_motif";
		colonnes["etat"] = "DL_SaisiePunition_etat";
		colonnes["dossier"] = "DL_SaisiePunition_dossier";
		colonnes["publication"] = "DL_SaisiePunition_publication";
	})(
		(colonnes =
			DonneesListe_SaisiePunitions.colonnes ||
			(DonneesListe_SaisiePunitions.colonnes = {})),
	);
})(
	DonneesListe_SaisiePunitions ||
		(exports.DonneesListe_SaisiePunitions = DonneesListe_SaisiePunitions = {}),
);
