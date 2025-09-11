exports.PiedBulletin_Appreciations = void 0;
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_Mention_1 = require("ObjetFenetre_Mention");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const TypeModeAffichagePiedBulletin_1 = require("TypeModeAffichagePiedBulletin");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const DonneesListe_AppreciationsPdB_1 = require("DonneesListe_AppreciationsPdB");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetTri_1 = require("ObjetTri");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetMoteurPiedDeBulletin_1 = require("ObjetMoteurPiedDeBulletin");
class PiedBulletin_Appreciations extends ObjetInterface_1.ObjetInterface {
	constructor() {
		super(...arguments);
		this.moteurPdB =
			new ObjetMoteurPiedDeBulletin_1.ObjetMoteurPiedDeBulletin();
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
			modeSaisie: false,
			avecContenuVide: false,
		};
		this.idModeConsult = this.Nom + "_consult";
	}
	construireInstances() {
		if (
			(this.params.typeReleveBulletin ===
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes ||
				this.params.typeReleveBulletin ===
					TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences) &&
			this.params.contexte ===
				TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve &&
			this.params.modeSaisie === true
		) {
			this.identFenetreMentions = this.add(
				ObjetFenetre_Mention_1.ObjetFenetre_Mention,
				this._evntMention.bind(this),
				this._initMentions.bind(this),
			);
		}
		if (this.params.modeSaisie === true) {
			this.identListe = this.add(
				ObjetListe_1.ObjetListe,
				this._evntListe.bind(this),
				this._initListe.bind(this),
			);
		}
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		const lHauteurEntete = 21;
		H.push('<div class="full-height">');
		H.push(
			`<h2 class="p-y ie-titre-petit Gras theme-color-foncee" style="height:${lHauteurEntete}px;">${ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Appreciations")}</h2>`,
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
		this.listeToutesAppr = new ObjetListeElements_1.ObjetListeElements();
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
					this.trierApprDeCategorie(lGenreAppr);
					this.listeToutesAppr.add(lGenreAppr);
				}
			}
		}
		this.listeMentions = this.params.mentions;
	}
	estAffiche() {
		const lAppr = this.params.appreciations;
		return (
			lAppr &&
			(!this.params.modeSaisie ||
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
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				super.afficher();
				break;
		}
		if (this.params.modeSaisie === true) {
			if (lAppr && this.identListe !== null && this.identListe !== undefined) {
				this.getInstance(this.identListe).setDonnees(
					new DonneesListe_AppreciationsPdB_1.DonneesListe_AppreciationsPdB(
						this.listeToutesAppr,
						{
							instanceListe: this.getInstance(this.identListe),
							saisie: lAvecSaisie,
							contexte: this.params.contexte,
							typeReleveBulletin: this.params.typeReleveBulletin,
							avecValidationAuto: this.params.avecValidationAuto,
							clbckValidationAutoSurEdition: this.params.avecValidationAuto
								? this.params.clbckValidationAutoSurEdition
								: null,
						},
					),
				);
			}
			ObjetHtml_1.GHtml.setHtml(this.idModeConsult, "");
		} else if (lAppr) {
			ObjetHtml_1.GHtml.setHtml(
				this.idModeConsult,
				this.getHtmlApprModeConsult(),
			);
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
		this._actualiserListe();
	}
	setParametres(aParam) {
		$.extend(true, this.params, aParam);
	}
	surResizeInterface() {
		this._actualiserListe();
	}
	_evntListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_AppreciationsPdB_1.DonneesListe_AppreciationsPdB
						.colonnes.appreciation: {
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
	_initListe(aInstance) {
		const lColonnes = [
			{
				id: DonneesListe_AppreciationsPdB_1.DonneesListe_AppreciationsPdB
					.colonnes.libelle,
				taille: 300,
			},
			{
				id: DonneesListe_AppreciationsPdB_1.DonneesListe_AppreciationsPdB
					.colonnes.appreciation,
				taille: 400,
				indice: 0,
			},
		];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			AvecSuppression: false,
			avecLigneCreation: false,
			colonnesTriables: false,
			hauteurAdapteContenu: true,
			nonEditableSurModeExclusif: true,
			ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
				"BulletinEtReleve.Appreciations",
			),
		});
	}
	_initMentions(aInstance) {
		this.moteurPdB.initialiserMentions({ instanceFenetre: aInstance });
	}
	_evntMention(aGenreBouton) {
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
	trierApprDeCategorie(aListe) {
		if (aListe) {
			aListe.setTri([ObjetTri_1.ObjetTri.init("Genre")]);
			aListe.trier();
		}
	}
	_actualiserListe() {
		if (this.identListe !== null && this.identListe !== undefined) {
			this.getInstance(this.identListe).actualiser(true);
		}
	}
	_existeContenuAppr(aListe) {
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
	_getHtmlListeAppr(aParam) {
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
						H.push("<p>");
						if (lIntitule !== "") {
							H.push("<span>" + lIntitule + "&nbsp;:&nbsp;" + "</span>");
						}
						H.push('<span class="Gras">' + lLibelle + "</span>");
						H.push("</p>");
					}
				}
			}
		}
		return H.join("");
	}
	getHtmlApprModeConsult() {
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
					(lAvecContenuVide || this._existeContenuAppr(lElt.liste))
				) {
					H.push(
						this._getHtmlListeAppr({
							liste: lElt.liste,
							avecContenuVide: lAvecContenuVide,
						}),
					);
				}
			}
		}
		return H.join("");
	}
}
exports.PiedBulletin_Appreciations = PiedBulletin_Appreciations;
