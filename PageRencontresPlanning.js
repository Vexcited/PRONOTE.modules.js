exports.PageRencontresPlanning = void 0;
const ObjetListe_1 = require("ObjetListe");
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const TypeEtatCours_1 = require("TypeEtatCours");
const ObjetTri_1 = require("ObjetTri");
const GUID_1 = require("GUID");
const DonneesListe_RencontresPlanning_1 = require("DonneesListe_RencontresPlanning");
const ObjetRequeteSaisieRencontreAEuLieu_1 = require("ObjetRequeteSaisieRencontreAEuLieu");
class PageRencontresPlanning extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor() {
		super(...arguments);
		this.donneesRecues = false;
		this.idRencontres = GUID_1.GUID.getId();
		this.donnees = { message: null, listeRencontres: null };
		this.avecFiltreRencontresNonPlacees = [
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
		].includes(GEtatUtilisateur.GenreEspace);
		this.afficherRencontresNonPlacees = false;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbAfficherNonPlanifiees: {
				getValue: function () {
					return !!aInstance.afficherRencontresNonPlacees;
				},
				setValue: function (aValue) {
					aInstance.afficherRencontresNonPlacees = aValue;
					aInstance.instanceListe
						.getDonneesListe()
						.setAvecRencontreNonPlacee(aInstance.afficherRencontresNonPlacees);
					aInstance.instanceListe.actualiser();
				},
				getDisplay: function () {
					return (
						[
							Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
							Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
						].includes(GEtatUtilisateur.GenreEspace) &&
						aInstance.donnees.listeRencontres &&
						aInstance.donnees.listeRencontres.count() > 0
					);
				},
			},
			getIdentiteListe: function () {
				return {
					class: ObjetListe_1.ObjetListe,
					pere: aInstance,
					start: function (aListe) {
						aInstance.instanceListe = aListe;
						aListe.setOptionsListe({
							colonnes: [{ taille: "100%" }],
							skin: ObjetListe_1.ObjetListe.skin.flatDesign,
							messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
								"Rencontres.aucuneRencontrePlanifiee",
							),
							nonEditableSurModeExclusif: true,
						});
						aListe.setDonnees(
							new DonneesListe_RencontresPlanning_1.DonneesListe_RencontresPlanning(
								aInstance.donnees.listeRencontres,
								aInstance.afficherRencontresNonPlacees,
								{
									callback: (aRencontre, aVisio) => {
										new ObjetRequeteSaisieRencontreAEuLieu_1.ObjetRequeteSaisieRencontreAEuLieu(
											aInstance,
											aInstance.callback.evenement,
										).lancerRequete({
											rencontre: aRencontre.toJSONAll(),
											visio: aVisio ? aVisio.lienVisio.toJSONAll() : undefined,
										});
									},
								},
							),
							null,
							{ conserverPositionScroll: true },
						);
					},
				};
			},
		});
	}
	setDonnees(aDonnees) {
		this.donneesRecues = true;
		this.donnees.message = null;
		this.donnees.listeRencontres = null;
		if (!!aDonnees) {
			let lMessageAAfficher;
			let lListeRencontres;
			if (!!aDonnees.messageNonPublie) {
				lMessageAAfficher = aDonnees.messageNonPublie;
			} else {
				if (
					!this.avecFiltreRencontresNonPlacees &&
					!!aDonnees.listeRencontres
				) {
					lListeRencontres = aDonnees.listeRencontres.getListeElements((D) => {
						return this._estUneRencontrePlacee(D);
					});
				} else {
					lListeRencontres = aDonnees.listeRencontres;
				}
				if (!!lListeRencontres && lListeRencontres.count() > 0) {
					lListeRencontres.setTri([
						ObjetTri_1.ObjetTri.init("place"),
						ObjetTri_1.ObjetTri.init((D) => {
							return D.eleve ? D.eleve.getLibelle() : "";
						}),
					]);
					lListeRencontres.trier();
				}
			}
			if (!!lMessageAAfficher) {
				this.donnees.message = lMessageAAfficher;
			} else {
				this.donnees.listeRencontres = lListeRencontres;
			}
			this.afficher();
		}
	}
	construireAffichage() {
		if (!this.donneesRecues) {
			return "";
		}
		return this.composeListeRencontre();
	}
	composeListeRencontre() {
		const lHtml = [];
		if (!!this.donnees.message) {
			lHtml.push(
				IE.jsx.str(
					"div",
					{ id: "PRP_message", class: "m-xl" },
					this.composeAucuneDonnee(this.donnees.message),
				),
			);
		} else {
			lHtml.push(
				IE.jsx.str(
					"div",
					{
						id: this.idRencontres,
						class: "flex-contain cols",
						style: "height:100%;",
					},
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": "cbAfficherNonPlanifiees",
							"ie-display": "cbAfficherNonPlanifiees.getDisplay",
							class: "fix-bloc p-all-xl",
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"Rencontres.afficherNonPlanifiees",
						),
					),
					IE.jsx.str("div", {
						"ie-identite": "getIdentiteListe",
						class: "fluid-bloc",
					}),
				),
			);
		}
		return lHtml.join("");
	}
	_estUneRencontrePlacee(aRencontre) {
		return (
			!!aRencontre &&
			(aRencontre.etat === TypeEtatCours_1.TypeEtatCours.Impose ||
				aRencontre.etat === TypeEtatCours_1.TypeEtatCours.Pose)
		);
	}
}
exports.PageRencontresPlanning = PageRencontresPlanning;
