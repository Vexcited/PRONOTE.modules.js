const { ObjetListe } = require("ObjetListe.js");
const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { TypeEtatCours } = require("TypeEtatCours.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { tag } = require("tag.js");
const { GUID } = require("GUID.js");
const {
	DonneesListe_RencontresPlanning,
} = require("DonneesListe_RencontresPlanning.js");
Requetes.inscrire("SaisieRencontreAEuLieu", ObjetRequeteSaisie);
class PageRencontresPlanning extends ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.donneesRecues = false;
		this.idRencontres = GUID.getId();
		this.donnees = { message: null, listeRencontres: null };
		this.avecFiltreRencontresNonPlacees = [
			EGenreEspace.Mobile_Professeur,
			EGenreEspace.Mobile_Etablissement,
		].includes(GEtatUtilisateur.GenreEspace);
		this.afficherRencontresNonPlacees = false;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
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
							EGenreEspace.Mobile_Professeur,
							EGenreEspace.Mobile_Etablissement,
						].includes(GEtatUtilisateur.GenreEspace) &&
						aInstance.donnees.listeRencontres &&
						aInstance.donnees.listeRencontres.count() > 0
					);
				},
			},
			getIdentiteListe: function () {
				return {
					class: ObjetListe,
					pere: aInstance,
					evenement: function (aRencontre, aVisio) {
						Requetes(
							"SaisieRencontreAEuLieu",
							aInstance,
							aInstance.callback.evenement,
						).lancerRequete({
							rencontre: aRencontre.toJSONAll(),
							visio: aVisio ? aVisio.lienVisio.toJSONAll() : null,
						});
					},
					start: function (aListe) {
						aInstance.instanceListe = aListe;
						aListe.setOptionsListe({
							colonnes: [{ taille: "100%" }],
							skin: ObjetListe.skin.flatDesign,
							messageContenuVide: GTraductions.getValeur(
								"Rencontres.aucuneRencontrePlanifiee",
							),
							nonEditableSurModeExclusif: true,
						});
						aListe.setDonnees(
							new DonneesListe_RencontresPlanning(
								aInstance.donnees.listeRencontres,
								aInstance.afficherRencontresNonPlacees,
								{ callbackVisio: _validerVisio.bind(this) },
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
						return _estUneRencontrePlacee(D);
					});
				} else {
					lListeRencontres = aDonnees.listeRencontres;
				}
				if (!!lListeRencontres && lListeRencontres.count() > 0) {
					lListeRencontres.setTri([
						ObjetTri.init("place"),
						ObjetTri.init((D) => {
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
				'<div id="PRP_message" class="m-xl" >',
				this.composeAucuneDonnee(this.donnees.message),
				"</div>",
			);
		} else {
			lHtml.push(
				tag(
					"div",
					{
						id: this.idRencontres,
						class: ["flex-contain cols"],
						style: "height:100%",
					},
					tag(
						"ie-checkbox",
						{
							"ie-model": "cbAfficherNonPlanifiees",
							"ie-display": "cbAfficherNonPlanifiees.getDisplay",
							class: ["fix-bloc p-all-xl"],
						},
						GTraductions.getValeur("Rencontres.afficherNonPlanifiees"),
					),
					tag("div", {
						"ie-identite": "getIdentiteListe",
						class: ["fluid-bloc"],
					}),
				),
			);
		}
		return lHtml.join("");
	}
}
function _estUneRencontrePlacee(aRencontre) {
	return (
		!!aRencontre &&
		(aRencontre.etat === TypeEtatCours.Impose ||
			aRencontre.etat === TypeEtatCours.Pose)
	);
}
function _validerVisio(aVisio, aRencontre) {
	if (aVisio.lienVisio) {
		this.evenement(aRencontre, aVisio);
	}
}
module.exports = PageRencontresPlanning;
