const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetListe } = require("ObjetListe.js");
const { DonneesListe_Simple } = require("DonneesListe_Simple.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
class ObjetFenetre_OrdonnerElementsProgramme extends ObjetFenetre_Liste {
	constructor(...aParams) {
		super(...aParams);
		this.optionsAffichage = {
			titre: GTraductions.getValeur("Fenetre_OrdonnerElementsProgramme.Titre"),
			largeur: 600,
			hauteur: 300,
			listeBoutons: [GTraductions.getValeur("Fermer")],
		};
		this.donnees = {
			service: null,
			periode: null,
			listeElementsProgramme: null,
		};
	}
	initialiserFenetre() {
		const lThis = this;
		const lParamsListe = {};
		lParamsListe.tailles = ["100%"];
		lParamsListe.optionsListe = {
			boutons: [
				{
					genre: ObjetListe.typeBouton.supprimer,
					event: function (aParam) {
						_supprimerElementProgramme.call(lThis, aParam);
					},
					getDisabled: _getDisabledBoutonsListe,
				},
				{
					class: "Image_OptionOrdonnerPourListe",
					title: GTraductions.getValeur(
						"Fenetre_OrdonnerElementsProgramme.HintBoutonOrdonnerParOccurenceCDT",
					),
					event: function (aParam) {
						const lListeOriginale = lThis.donnees.listeElementsProgramme;
						if (!!lListeOriginale) {
							const lListeDupliquee = lListeOriginale.getListeElements();
							lListeDupliquee.setSerialisateurJSON({
								ignorerEtatsElements: true,
							});
							const lParamsRequete = {
								service: lThis.donnees.service,
								periode: lThis.donnees.periode,
								liste: lListeDupliquee,
							};
							Requetes("OrdonnerListeElementsProgramme", this)
								.lancerRequete(lParamsRequete)
								.then((aJSONReponse) => {
									lThis.donnees.listeElementsProgramme.vider();
									lThis.donnees.listeElementsProgramme.add(
										aJSONReponse.listeOrdonnee,
									);
									_marquerSaisieListe(lThis.donnees.listeElementsProgramme);
									aParam.liste.actualiser(false, true);
								});
						}
					},
					getDisabled: function () {
						return false;
					},
				},
				{ genre: ObjetListe.typeBouton.monter },
				{ genre: ObjetListe.typeBouton.descendre },
			],
		};
		this.setOptionsFenetre({
			titre: this.optionsAffichage.titre,
			largeur: this.optionsAffichage.largeur,
			hauteur: this.optionsAffichage.hauteur,
			listeBoutons: this.optionsAffichage.listeBoutons,
		});
		this.paramsListe = lParamsListe;
	}
	setDonneesFenetreOrdonnerElementProgramme(aDonnees) {
		this.donnees = {
			service: aDonnees.service,
			periode: aDonnees.periode,
			listeElementsProgramme: aDonnees.listeElementsProgramme,
		};
		_actualiserPositionsElementProgramme(this.donnees.listeElementsProgramme);
		const lDonneesListe = new DonneesListe_Simple(
			this.donnees.listeElementsProgramme,
		).setOptions({ avecLigneDroppable: true, avecLigneDraggable: true });
		lDonneesListe.surDeplacementElementSurLigne = function (
			aParamsLigneDestination,
			aParamsSource,
		) {
			const lPositionDest = aParamsLigneDestination.article.Position;
			const lPositionSource = aParamsSource.article.Position;
			this.donnees.listeElementsProgramme.parcourir((aElement) => {
				if (
					lPositionSource > lPositionDest &&
					aElement.Position >= lPositionDest &&
					aElement.Position < lPositionSource
				) {
					aElement.Position += 1;
				} else if (
					lPositionSource < lPositionDest &&
					aElement.Position > lPositionSource &&
					aElement.Position <= lPositionDest
				) {
					aElement.Position += -1;
				}
			});
			aParamsSource.article.Position = lPositionDest;
			_marquerSaisieListe(this.donnees.listeElementsProgramme);
		}.bind(this);
		this.setDonnees(lDonneesListe);
	}
	surValidation() {
		this.fermer();
		const lListe = this.donnees.listeElementsProgramme;
		if (lListe && lListe.avecSaisie) {
			lListe.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		this.callback.appel(lListe ? lListe.avecSaisie : false);
	}
}
Requetes.inscrire("OrdonnerListeElementsProgramme", ObjetRequeteConsultation);
function _marquerSaisieListe(aListe) {
	if (!!aListe) {
		aListe.avecSaisie = true;
	}
}
function _actualiserPositionsElementProgramme(aListeElementsProgramme) {
	if (!!aListeElementsProgramme) {
		let lPosition = 1;
		aListeElementsProgramme.parcourir((D) => {
			if (D.existe()) {
				D.Position = lPosition;
				lPosition++;
			}
		});
	}
}
function _getDisabledBoutonsListe(aParam) {
	const lListeSelection = aParam.liste.getListeElementsSelection();
	if (lListeSelection.count() !== 1 || !lListeSelection.get(0)) {
		return true;
	}
	if (aParam.bouton.genre === ObjetListe.typeBouton.supprimer) {
		return false;
	} else if (aParam.bouton.genre === ObjetListe.typeBouton.monter) {
		return lListeSelection.get(0).getPosition() <= 1;
	}
	return (
		lListeSelection.get(0).getPosition() >=
		aParam.liste.getListeArticles().count()
	);
}
function _supprimerElementProgramme(aParam) {
	const lListeSelection = aParam.liste.getListeElementsSelection();
	if (lListeSelection.count() > 0) {
		const lElementASupprimer = lListeSelection.get(0);
		const lListeElmtsProgramme = this.donnees.listeElementsProgramme;
		if (lListeElmtsProgramme) {
			lListeElmtsProgramme.removeFilter((D) => {
				return D.getNumero() === lElementASupprimer.getNumero();
			});
			_marquerSaisieListe(lListeElmtsProgramme);
			_actualiserPositionsElementProgramme(lListeElmtsProgramme);
			aParam.liste.actualiser(false, true);
		}
	}
}
module.exports = { ObjetFenetre_OrdonnerElementsProgramme };
