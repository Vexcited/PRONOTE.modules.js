const { GStyle } = require("ObjetStyle.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetFenetre_Mention } = require("ObjetFenetre_Mention.js");
const { TypeContexteBulletin } = require("TypeContexteBulletin.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const {
	TypeModeAffichagePiedBulletin,
} = require("TypeModeAffichagePiedBulletin.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
	DonneesListe_AppreciationsPdB,
} = require("DonneesListe_AppreciationsPdB.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetTri } = require("ObjetTri.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { ObjetMoteurPiedDeBulletin } = require("ObjetMoteurPiedDeBulletin.js");
class PiedBulletin_Appreciations extends ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.moteurPdB = new ObjetMoteurPiedDeBulletin();
		this.params = {
			modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Onglets,
			modeSaisie: false,
			avecContenuVide: false,
		};
		const lGuid = GUID.getId();
		this.idModeConsult = lGuid + "_consult";
	}
	construireInstances() {
		if (
			(this.params.typeReleveBulletin === TypeReleveBulletin.BulletinNotes ||
				this.params.typeReleveBulletin ===
					TypeReleveBulletin.BulletinCompetences) &&
			this.params.contexte === TypeContexteBulletin.CB_Eleve &&
			this.params.modeSaisie === true
		) {
			this.identFenetreMentions = this.add(
				ObjetFenetre_Mention,
				_evntMention.bind(this),
				_initMentions.bind(this),
			);
		}
		if (this.params.modeSaisie === true) {
			this.identListe = this.add(
				ObjetListe,
				_evntListe.bind(this),
				_initListe.bind(this),
			);
		}
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		const lHauteurEntete = 21;
		H.push('<div class="full-height">');
		H.push(
			`<div class="p-y semi-bold theme-color-foncee" style="height:${lHauteurEntete}px;">${GTraductions.getValeur("BulletinEtReleve.Appreciations")}</div>`,
		);
		if (this.params.modeSaisie === true) {
			H.push(
				`<div style="height: calc(100% - ${lHauteurEntete}px);" id="${this.getInstance(this.identListe).getNom()}"></div>`,
			);
		}
		H.push('<div id="', this.idModeConsult, '"></div>');
		H.push("</div>");
		return H.join("");
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
		this.listeToutesAppr = new ObjetListeElements();
		const lAppr = this.params.appreciations;
		if (lAppr !== null && lAppr !== undefined) {
			const lTabAppr = [
				lAppr.general,
				lAppr.cpe,
				lAppr.conseilDeClasse,
				lAppr.commentaires,
			];
			const lNbr = lTabAppr.length;
			for (let i = 0; i < lNbr; i++) {
				const lGenreAppr = lTabAppr[i];
				if (
					lGenreAppr !== null &&
					lGenreAppr !== undefined &&
					lGenreAppr.count()
				) {
					trierApprDeCategorie(lGenreAppr);
					this.listeToutesAppr.add(lGenreAppr);
				}
			}
		}
		this.listeMentions = this.params.mentions;
	}
	estAffiche() {
		const lModeAccess =
			this.params.modeAffichage ===
			TypeModeAffichagePiedBulletin.MAPB_Accessible;
		const lAppr = this.params.appreciations;
		return (
			lAppr &&
			(lModeAccess ||
				!this.params.modeSaisie ||
				(this.identListe !== null && this.identListe !== undefined)) &&
				this.listeToutesAppr &&
			this.listeToutesAppr.count()
		);
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		const lAppr = this.params.appreciations;
		const lAvecSaisie =
			this.params.modeSaisie === true && this.params.avecSaisieAG;
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
				super.afficher();
				break;
		}
		if (this.params.modeSaisie === true) {
			if (lAppr && this.identListe !== null && this.identListe !== undefined) {
				this.getInstance(this.identListe).setDonnees(
					new DonneesListe_AppreciationsPdB(this.listeToutesAppr, {
						instanceListe: this.getInstance(this.identListe),
						saisie: lAvecSaisie,
						contexte: this.params.contexte,
						typeReleveBulletin: this.params.typeReleveBulletin,
						avecValidationAuto: this.params.avecValidationAuto,
						clbckValidationAutoSurEdition: this.params.avecValidationAuto
							? this.params.clbckValidationAutoSurEdition
							: null,
					}),
				);
			}
			GHtml.setHtml(this.idModeConsult, "");
		} else if (lAppr) {
			GHtml.setHtml(this.idModeConsult, getHtmlApprModeConsult.call(this));
		}
	}
	getDonneesSaisie() {
		const lResult = {};
		const lAppr = this.params.appreciations;
		if (lAppr) {
			if (lAppr.general && lAppr.general.count()) {
				$.extend(lResult, { listeGeneral: lAppr.general });
			}
			if (lAppr.conseilDeClasse && lAppr.conseilDeClasse.count()) {
				$.extend(lResult, { listeConseilDeClasse: lAppr.conseilDeClasse });
			}
			if (lAppr.commentaires && lAppr.commentaires.count()) {
				$.extend(lResult, { listeCommentaires: lAppr.commentaires });
			}
			if (lAppr.cpe && lAppr.cpe.count()) {
				$.extend(lResult, { listeCPE: lAppr.cpe });
			}
		}
		return lResult;
	}
	evenementSurAssistant() {
		_actualiserListe.call(this);
	}
	setParametres(aParam) {
		$.extend(true, this.params, aParam);
	}
	surResizeInterface() {
		_actualiserListe.call(this);
	}
}
function _evntListe(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Edition:
			switch (aParametres.idColonne) {
				case DonneesListe_AppreciationsPdB.colonnes.appreciation: {
					const lAppreciation = aParametres.article.ListeAppreciations.get(
						aParametres.declarationColonne.indice,
					);
					this.objCelluleAppreciation = {
						article: aParametres.article,
						appreciation: lAppreciation,
						idColonne: aParametres.idColonne,
						instanceListe: this.getInstance(this.identListe),
					};
					if (this.moteurPdB.estMention({ appreciation: lAppreciation })) {
						this.moteurPdB.evenementOuvrirMentions({
							instanceFenetre: this.getInstance(this.identFenetreMentions),
							listeMentions: this.listeMentions,
						});
					} else {
						this.callback.appel(this.objCelluleAppreciation);
					}
					break;
				}
				default:
					break;
			}
	}
}
function _initListe(aInstance) {
	const lColonnes = [
		{ id: DonneesListe_AppreciationsPdB.colonnes.libelle, taille: 300 },
		{
			id: DonneesListe_AppreciationsPdB.colonnes.appreciation,
			taille: 400,
			indice: 0,
		},
	];
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		AvecSuppression: false,
		avecLigneCreation: false,
		colonnesTriables: false,
		avecModeAccessible: true,
		avecSelection: false,
		hauteurAdapteContenu: true,
		nonEditableSurModeExclusif: true,
	});
}
function _initMentions(aInstance) {
	this.moteurPdB.initialiserMentions({ instanceFenetre: aInstance });
}
function _evntMention(aGenreBouton) {
	const lParam = $.extend(this.objCelluleAppreciation, {
		instanceFenetre: this.getInstance(this.identFenetreMentions),
		avecValidationAuto: this.params.avecValidationAuto,
		clbckValidationAutoSurEdition: this.params.clbckValidationAutoSurEdition,
	});
	this.moteurPdB.evenementMention(aGenreBouton, lParam);
	if (aGenreBouton === 1 && this.params.avecValidationAuto !== true) {
		this.setEtatSaisie(true);
	}
}
function trierApprDeCategorie(aListe) {
	if (aListe) {
		aListe.setTri([ObjetTri.init("Genre")]);
		aListe.trier();
	}
}
function _actualiserListe() {
	if (this.identListe !== null && this.identListe !== undefined) {
		this.getInstance(this.identListe).actualiser(true);
	}
}
function _existeContenuAppr(aListe) {
	if (aListe) {
		const lNbr = aListe.count();
		for (let i = 0; i < lNbr; i++) {
			const lElement = aListe.get(i);
			if (lElement.ListeAppreciations.get(0).getLibelle() !== "") {
				return true;
			}
		}
	}
	return false;
}
function _getHtmlListeAppr(aParam) {
	const H = [];
	const lListe = aParam.liste;
	if (lListe) {
		const lNbr = lListe.count();
		for (let i = 0; i < lNbr; i++) {
			const lElement = lListe.get(i);
			if (lElement) {
				const lLibelle = lElement.ListeAppreciations.get(0).getLibelle();
				const lIntitule = lElement.Intitule;
				if (lLibelle !== "" || aParam.avecContenuVide) {
					H.push("<div>");
					if (lIntitule !== "") {
						H.push("<span>" + lIntitule + "&nbsp;:&nbsp;" + "</span>");
					}
					H.push('<span class="Gras">' + lLibelle + "</span>");
					H.push("</div>");
				}
			}
		}
	}
	return H.join("");
}
function getHtmlApprModeConsult() {
	const H = [];
	const lAppr = this.params.appreciations;
	if (lAppr) {
		const lParam = {
			typeReleveBulletin: this.params.typeReleveBulletin,
			contexte: this.params.contexte,
		};
		const lTabAppr = [
			{ avecAppr: this.moteurPdB.avecAppAG(lParam), liste: lAppr.general },
			{ avecAppr: this.moteurPdB.avecAppCPE(lParam), liste: lAppr.cpe },
			{
				avecAppr: this.moteurPdB.avecAppConseilDeClasse(lParam),
				liste: lAppr.conseilDeClasse,
			},
			{
				avecAppr: this.moteurPdB.avecAppCommentaire(lParam),
				liste: lAppr.commentaires,
			},
		];
		const lAvecContenuVide = this.params.avecContenuVide;
		const lNbr = lTabAppr.length;
		for (let i = 0; i < lNbr; i++) {
			const lElt = lTabAppr[i];
			if (
				lElt.avecAppr &&
				lElt.liste &&
				(lAvecContenuVide || _existeContenuAppr(lElt.liste))
			) {
				H.push(
					_getHtmlListeAppr.call(this, {
						liste: lElt.liste,
						avecContenuVide: lAvecContenuVide,
					}),
				);
			}
		}
	}
	return H.join("");
}
module.exports = { PiedBulletin_Appreciations };
