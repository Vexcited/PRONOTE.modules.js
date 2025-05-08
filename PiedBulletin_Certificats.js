const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Date } = require("ObjetFenetre_Date.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	DonneesListe_ListeAttestations,
} = require("DonneesListe_ListeAttestations.js");
const {
	TypeModeAffichagePiedBulletin,
} = require("TypeModeAffichagePiedBulletin.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const {
	ObjetRequeteSaisieFicheEleve,
} = require("ObjetRequeteSaisieFicheEleve.js");
class PiedBulletin_Certificats extends ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.params = { modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Onglets };
		this.avecSaisie =
			GApplication.droits.get(TypeDroits.eleves.avecSaisieAttestations) ||
			GEtatUtilisateur.pourPrimaire();
		this.attestationEtendue = GApplication.droits.get(
			TypeDroits.fonctionnalites.attestationEtendue,
		);
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
		this.listeAttestations = aParam.listeAttestations;
		this.listeAttestationsEleve = aParam.listeAttestationsEleve;
		this.eleve = aParam.eleve;
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.idListeAttestations;
		this.avecBandeau = false;
		this.AvecCadre = false;
	}
	construireInstances() {
		this.idListeAttestations = this.add(
			ObjetListe,
			this.evenementListeAttestations,
			this.initialiserListeAttestations,
		);
	}
	initialiserListeAttestations(aInstance) {
		const lColonnes = [
			{
				id: DonneesListe_ListeAttestations.colonnes.libelle,
				titre: GTraductions.getValeur("FicheEleve.libelle"),
				taille: 150,
			},
			{
				id: DonneesListe_ListeAttestations.colonnes.libelleLong,
				titre: GTraductions.getValeur("FicheEleve.libelleLong"),
				taille: 400,
			},
			{
				id: DonneesListe_ListeAttestations.colonnes.descriptif,
				titre: GTraductions.getValeur("FicheEleve.descriptifAttestation"),
				taille: 75,
			},
			{
				id: DonneesListe_ListeAttestations.colonnes.etat,
				titre: GTraductions.getValeur("FicheEleve.etat"),
				taille: 40,
			},
			{
				id: DonneesListe_ListeAttestations.colonnes.date,
				titre: GTraductions.getValeur("FicheEleve.date"),
				taille: 150,
			},
		];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			AvecSuppression: false,
			avecLigneCreation: false,
			avecSelection: false,
			colonnesCachees: this.attestationEtendue
				? []
				: [DonneesListe_ListeAttestations.colonnes.descriptif],
		});
	}
	evenementListeAttestations(aParametres) {
		switch (aParametres.genreEvenement) {
			case EGenreEvenementListe.Selection: {
				const lEtat = aParametres.article.delivree;
				if (lEtat && this.avecSaisie) {
					ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Date, {
						pere: this,
						evenement: function (aNumeroBouton, aDate) {
							if (aNumeroBouton === 1) {
								aParametres.article.date = aDate;
							}
							aParametres.article.setEtat(EGenreEtat.Modification);
							this.getInstance(this.idListeAttestations).actualiser();
							_validerAttestations.call(this);
						},
						initialiser: function (aInstance) {
							aInstance.setParametres(
								GDate.PremierLundi,
								GDate.premiereDate,
								GParametres.DerniereDate,
							);
						},
					}).setDonnees(GDate.getDateBornee(aParametres.article.date));
				}
				break;
			}
			case EGenreEvenementListe.ApresEdition:
				if (this.avecSaisie) {
					_validerAttestations.call(this);
				}
				break;
		}
	}
	getDonneesSaisie() {
		if (
			[
				TypeModeAffichagePiedBulletin.MAPB_Onglets,
				TypeModeAffichagePiedBulletin.MAPB_Lineaire,
			].includes(this.params.modeAffichage)
		) {
			return { listeAttestationsEleve: this.listeAttestationsEleve };
		}
	}
	estAffiche() {
		return !!this.listeAttestations && this.listeAttestations.count() > 0;
	}
	setParametres(aParam) {
		$.extend(true, this.params, aParam);
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin.MAPB_Onglets: {
				const lResult = new ObjetListeElements();
				const lListe = this.listeAttestationsEleve;
				this.listeAttestations.parcourir((aAttestation) => {
					lListe.parcourir((aAttestationEleve) => {
						if (aAttestation.abbreviation === aAttestationEleve.abbreviation) {
							aAttestation.date = aAttestationEleve.date
								? aAttestationEleve.date
								: new Date();
							aAttestation.delivree = aAttestationEleve.delivree;
						}
					});
					lResult.addElement(aAttestation);
				});
				this.listeAttestationsEleve = lResult;
				if (this.getInstance(this.idListeAttestations)) {
					const lDonneesListe = new DonneesListe_ListeAttestations(lResult);
					lDonneesListe.setParametres({ avecValidationAuto: this.avecSaisie });
					this.getInstance(this.idListeAttestations).setDonnees(lDonneesListe);
				}
				break;
			}
			case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
				GHtml.setHtml(
					this.Nom,
					this._construireAttestations(this.listeAttestationsEleve),
				);
				break;
		}
	}
	_construireAttestations(aParam) {
		const T = [];
		if (aParam) {
			const lNbr = aParam.count();
			T.push(
				'<div class="PetitEspaceHaut PetitEspaceBas Gras" style="',
				GStyle.composeCouleurTexte(GCouleur.themeCouleur.foncee),
				'">',
				GTraductions.getValeur("FicheEleve.attestations"),
				"</div>",
			);
			T.push(
				'<div><ul class="Texte10" style="display:table; width:50%; padding:0; margin:0">',
			);
			for (let i = 0; i < lNbr; i++) {
				const aElement = aParam.get(i);
				T.push(
					'<li style="display:table-row;">',
					'<span class="AlignementGauche" style="display:table-cell;">- ',
					aElement.getLibelle(),
					"</span>",
				);
				T.push(
					'<div class="Italique AlignementDroit">',
					aElement.delivree
						? GTraductions.getValeur("FicheEleve.delivree") +
								" " +
								GDate.formatDate(aElement.date, "%JJ/%MM/%AAAA")
						: GTraductions.getValeur("FicheEleve.nonDelivree"),
					"</div></li>",
				);
			}
			T.push("</ul></div>");
		}
		return T.join("");
	}
	getListeArborescente(aParam) {
		const lListe = this.params.listeAttestations;
		if (lListe) {
			let lCmp = 0;
			const lNbr = lListe.count();
			for (let i = 0; i < lNbr; i++) {
				if (lListe.get(i).getLibelle()) {
					lCmp++;
				}
			}
			if (lCmp > 0) {
				const lNoeudAttestations = aParam.listeArb.ajouterUnNoeudAuNoeud(
					aParam.racine,
					"",
					GTraductions.getValeur("PiedDeBulletin.Attestations"),
					null,
					false,
				);
				for (let i = 0, lNbr = lListe.count(); i < lNbr; i++) {
					if (lListe.get(i).getLibelle()) {
						const lLibelle = GChaine.avecEspaceSiVide(
							lListe.get(i).getLibelle(),
						);
						aParam.listeArb.ajouterUneFeuilleAuNoeud(
							lNoeudAttestations,
							"",
							lLibelle,
						);
					}
				}
			}
		}
	}
}
function _validerAttestations() {
	if (this.avecSaisie) {
		new ObjetRequeteSaisieFicheEleve(this).lancerRequete({
			listeAttestations: this.listeAttestationsEleve,
			eleve: this.eleve,
		});
	}
}
module.exports = { PiedBulletin_Certificats };
