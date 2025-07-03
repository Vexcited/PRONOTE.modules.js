exports.ObjetFenetre_OrdonnerElementsProgramme = void 0;
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_Simple_1 = require("DonneesListe_Simple");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
class ObjetFenetre_OrdonnerElementsProgramme extends ObjetFenetre_Liste_1.ObjetFenetre_Liste {
	constructor(...aParams) {
		super(...aParams);
		this.optionsAffichage = {
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_OrdonnerElementsProgramme.Titre",
			),
			largeur: 600,
			hauteur: 300,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
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
					genre: ObjetListe_1.ObjetListe.typeBouton.supprimer,
					event: function (aParam) {
						lThis._supprimerElementProgramme(aParam);
					},
					getDisabled: this._getDisabledBoutonsListe,
				},
				{
					class: "Image_OptionOrdonnerPourListe",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_OrdonnerElementsProgramme.HintBoutonOrdonnerParOccurenceCDT",
					),
					event: (aParam) => {
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
							new ObjetRequeteOrdonnerListeElementsProgramme(this)
								.lancerRequete(lParamsRequete)
								.then((aJSONReponse) => {
									lThis.donnees.listeElementsProgramme.vider();
									lThis.donnees.listeElementsProgramme.add(
										aJSONReponse.listeOrdonnee,
									);
									this._marquerSaisieListe(
										lThis.donnees.listeElementsProgramme,
									);
									aParam.liste.actualiser(false, true);
								});
						}
					},
					getDisabled: function () {
						return false;
					},
				},
				{ genre: ObjetListe_1.ObjetListe.typeBouton.monter },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.descendre },
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
		this._actualiserPositionsElementProgramme(
			this.donnees.listeElementsProgramme,
		);
		const lDonneesListe = new DonneesListe_Simple_1.DonneesListe_Simple(
			this.donnees.listeElementsProgramme,
		).setOptions({ avecLigneDroppable: true, avecLigneDraggable: true });
		lDonneesListe.surDeplacementElementSurLigne = (
			aParamsLigneDestination,
			aParamsSource,
		) => {
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
			this._marquerSaisieListe(this.donnees.listeElementsProgramme);
		};
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
	_marquerSaisieListe(aListe) {
		if (!!aListe) {
			aListe.avecSaisie = true;
		}
	}
	_actualiserPositionsElementProgramme(aListeElementsProgramme) {
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
	_getDisabledBoutonsListe(aParam) {
		const lListeSelection = aParam.liste.getListeElementsSelection();
		if (lListeSelection.count() !== 1 || !lListeSelection.get(0)) {
			return true;
		}
		if (aParam.bouton.genre === ObjetListe_1.ObjetListe.typeBouton.supprimer) {
			return false;
		} else if (
			aParam.bouton.genre === ObjetListe_1.ObjetListe.typeBouton.monter
		) {
			return lListeSelection.get(0).getPosition() <= 1;
		}
		return (
			lListeSelection.get(0).getPosition() >=
			aParam.liste.getListeArticles().count()
		);
	}
	_supprimerElementProgramme(aParam) {
		const lListeSelection = aParam.liste.getListeElementsSelection();
		if (lListeSelection.count() > 0) {
			const lElementASupprimer = lListeSelection.get(0);
			const lListeElmtsProgramme = this.donnees.listeElementsProgramme;
			if (lListeElmtsProgramme) {
				lListeElmtsProgramme.removeFilter((D) => {
					return D.getNumero() === lElementASupprimer.getNumero();
				});
				this._marquerSaisieListe(lListeElmtsProgramme);
				this._actualiserPositionsElementProgramme(lListeElmtsProgramme);
				aParam.liste.actualiser(false, true);
			}
		}
	}
}
exports.ObjetFenetre_OrdonnerElementsProgramme =
	ObjetFenetre_OrdonnerElementsProgramme;
class ObjetRequeteOrdonnerListeElementsProgramme extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
	"OrdonnerListeElementsProgramme",
	ObjetRequeteOrdonnerListeElementsProgramme,
);
