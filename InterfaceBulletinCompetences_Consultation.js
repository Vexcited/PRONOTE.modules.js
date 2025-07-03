exports.InterfaceBulletinCompetences_Consultation = void 0;
const Invocateur_1 = require("Invocateur");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetTraduction_1 = require("ObjetTraduction");
const _InterfaceBulletinCompetences_1 = require("_InterfaceBulletinCompetences");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const MultipleObjetDocumentsATelecharger = require("ObjetDocumentsATelecharger");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const InterfacePiedBulletin_1 = require("InterfacePiedBulletin");
const ObjetRequeteSaisieAccuseReceptionDocument_1 = require("ObjetRequeteSaisieAccuseReceptionDocument");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Message_1 = require("Enumere_Message");
class InterfaceBulletinCompetences_Consultation extends _InterfaceBulletinCompetences_1._InterfaceBulletinCompetences {
	constructor(...aParams) {
		super(...aParams);
		this.avecGestionAccuseReception =
			[
				Enumere_Espace_1.EGenreEspace.PrimParent,
				Enumere_Espace_1.EGenreEspace.Parent,
			].includes(GEtatUtilisateur.GenreEspace) &&
			(this.etatUtilisateurSco.pourPrimaire() ||
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionARBulletins,
				));
	}
	construireInstances() {
		super.construireInstances();
		this.identPiedPage = this.add(
			InterfacePiedBulletin_1.InterfacePiedBulletin,
		);
		this.identCombo = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurCombo,
			this.initialiserCombo,
		);
		if (
			[
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.PrimEleve,
				Enumere_Espace_1.EGenreEspace.PrimParent,
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.Accompagnant,
				Enumere_Espace_1.EGenreEspace.Tuteur,
			].includes(GEtatUtilisateur.GenreEspace) &&
			MultipleObjetDocumentsATelecharger
		) {
			this.identDocumentsATelecharger = this.add(
				MultipleObjetDocumentsATelecharger.ObjetDocumentsATelecharger,
			);
		}
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		this.AddSurZone = [this.identCombo, { separateur: true }];
		this.AddSurZone.push({ blocGauche: true });
		if (this.avecGestionAccuseReception && !this.estPourClasse()) {
			this.AddSurZone.push({
				html: IE.jsx.str(
					"ie-checkbox",
					{
						class: "AlignementMilieuVertical",
						"ie-model": this.jsxModeleCheckboxAccuseReception.bind(this),
						"ie-display": this.jsxDisplayAccuseReception.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.JAiPrisConnaissanceDuBilanPeriodique",
					),
				),
			});
		}
		this.AddSurZone.push({ blocDroit: true });
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(super.construireStructureAffichageAutre());
		if (this.getInstance(this.identDocumentsATelecharger)) {
			H.push(
				'<div class="Table BorderBox" id="' +
					this.getNomInstance(this.identDocumentsATelecharger) +
					'" style="display:none;max-width: 70rem;"></div>',
			);
		}
		return H.join("");
	}
	jsxDisplayAccuseReception() {
		const lResponsableAR = this._getResponsableAccuseReception();
		return (
			!this.avecMessage && this.avecGestionAccuseReception && !!lResponsableAR
		);
	}
	jsxModeleCheckboxAccuseReception() {
		return {
			getValue: () => {
				const lResponsableAR = this._getResponsableAccuseReception();
				return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : false;
			},
			setValue: (aValue) => {
				const lResponsableAR = this._getResponsableAccuseReception();
				if (!!lResponsableAR) {
					lResponsableAR.aPrisConnaissance = aValue;
					new ObjetRequeteSaisieAccuseReceptionDocument_1.ObjetRequeteSaisieAccuseReceptionDocument(
						this,
					).lancerRequete({
						periode: this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Periode,
						),
						aPrisConnaissance: aValue,
					});
				}
			},
			getDisabled: () => {
				const lResponsableAR = this._getResponsableAccuseReception();
				return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : true;
			},
		};
	}
	recupererDonnees() {
		if (this.getInstance(this.identCombo)) {
			this.IdPremierElement = this.getInstance(
				this.identCombo,
			).getPremierElement();
			const lListePeriodes = this.etatUtilisateurSco.getOngletListePeriodes();
			if (lListePeriodes && lListePeriodes.count()) {
				this.getInstance(this.identCombo).setVisible(true);
				this.getInstance(this.identCombo).setDonnees(lListePeriodes);
				this.getInstance(this.identCombo).setSelectionParElement(
					this.etatUtilisateurSco.getPeriode(),
					0,
				);
			} else {
				this.getInstance(this.identCombo).setVisible(false);
				this.evenementAfficherMessage(
					Enumere_Message_1.EGenreMessage.AucunBulletinDeCompetencesPourEleve,
				);
				this.getInstance(this.identCombo).IdPremierElement =
					this.idMessageActionRequise;
			}
		}
	}
	getAriaLabelListe() {
		var _a, _b;
		return `${this.etatUtilisateurSco.getLibelleLongOnglet()} ${((_a = this.etatUtilisateurSco.getPeriode()) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""} ${((_b = this.onglet) === null || _b === void 0 ? void 0 : _b.getLibelle()) || ""}`.trim();
	}
	_getResponsableAccuseReception() {
		let lReponsableAccuseReception = null;
		if (
			!!this.donnees.listeAccusesReception &&
			this.donnees.listeAccusesReception.count() > 0
		) {
			lReponsableAccuseReception =
				this.donnees.listeAccusesReception.getPremierElement();
			if (!!lReponsableAccuseReception) {
			}
		}
		return lReponsableAccuseReception;
	}
	estPourClasse() {
		return (
			GEtatUtilisateur.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.BulletinCompetencesClasse
		);
	}
	estJaugeCliquable() {
		return (
			GEtatUtilisateur.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.BulletinCompetences ||
			GEtatUtilisateur.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.ReleveDeCompetences
		);
	}
	_getParametresPDF() {
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
					.BulletinDeCompetences,
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
			avecChoixGraphe:
				GEtatUtilisateur.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.BulletinCompetences ||
				GEtatUtilisateur.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.ReleveDeCompetences,
			avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
		};
	}
	getParametresPiedPageEleve() {
		return {
			typeReleveBulletin:
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences,
			typeContexteBulletin:
				TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve,
			avecSaisie: false,
		};
	}
	getParametresPiedPageClasse() {
		return {
			typeReleveBulletin:
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences,
			typeContexteBulletin:
				TypeContexteBulletin_1.TypeContexteBulletin.CB_Classe,
			avecSaisie: false,
		};
	}
	avecLegendeBulletin() {
		return true;
	}
	initialiserCombo(aInstance) {
		aInstance.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPeriode",
			),
		});
	}
	evenementSurCombo(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.etatUtilisateurSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
				aParams.element,
			);
			if (
				aParams.element &&
				aParams.element.estAnneesPrecedentes &&
				this.getInstance(this.identDocumentsATelecharger)
			) {
				ObjetHtml_1.GHtml.setDisplay(
					this.getNomInstance(this.identDocumentsATelecharger),
					true,
				);
				ObjetHtml_1.GHtml.setDisplay(this.idBulletin, false);
				this.getInstance(this.identDocumentsATelecharger).setDonnees({
					avecCompetences: true,
				});
				Invocateur_1.Invocateur.evenement(
					Invocateur_1.ObjetInvocateur.events.activationImpression,
					Enumere_GenreImpression_1.EGenreImpression.Aucune,
				);
			} else {
				if (this.getInstance(this.identDocumentsATelecharger)) {
					ObjetHtml_1.GHtml.setDisplay(
						this.getNomInstance(this.identDocumentsATelecharger),
						false,
					);
				}
				ObjetHtml_1.GHtml.setDisplay(this.idBulletin, true);
				this._evenementDernierMenuDeroulant();
			}
		}
	}
	_evenementDernierMenuDeroulant() {
		super._evenementDernierMenuDeroulant();
	}
}
exports.InterfaceBulletinCompetences_Consultation =
	InterfaceBulletinCompetences_Consultation;
