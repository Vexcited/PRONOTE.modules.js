exports.ObjetRequeteSaisieParametresiCal = exports.MoteurParametresiCal =
	void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const TypeGenreICal_1 = require("TypeGenreICal");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireQRCode_1 = require("UtilitaireQRCode");
const Toast_1 = require("Toast");
const ComparateurChaines_1 = require("ComparateurChaines");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetNavigateur_1 = require("ObjetNavigateur");
class MoteurParametresiCal {
	constructor() {
		this.application = GApplication;
		this.etatUtilisateur = this.application.getEtatUtilisateur();
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		if (this.donnees && this.donnees.liste && this.donnees.liste.count() > 0) {
			this.donnees.liste.parcourir((aElement) => {
				aElement.nom = this.getNomPourFichier(aElement);
				this.completerInformationsLien(aElement);
				if (aElement.getGenre() === TypeGenreICal_1.TypeGenreICal.ICal_EDT) {
					aElement.setLibelle(
						`${aElement.getLibelle()} (${TypeGenreICal_1.TypeGenreICalUtil.getLibelle(aElement.getGenre()).toLowerCase()})`,
					);
				}
			});
			this.donnees.liste.trier();
			this.donnees.article = this.donnees.liste.get(0);
		}
	}
	getNomPourFichier(aArticle) {
		let lLibelle = "";
		if (aArticle.getGenre() === TypeGenreICal_1.TypeGenreICal.ICal_Agenda) {
			lLibelle = TypeGenreICal_1.TypeGenreICalUtil.getPrefixICal(
				aArticle.getGenre(),
			);
		} else {
			lLibelle = ObjetChaine_1.GChaine.enleverEntites(aArticle.getLibelle())
				.trim()
				.toLowerCase();
			lLibelle = ComparateurChaines_1.ComparateurChaines.normalize(lLibelle);
			lLibelle = lLibelle.replace(/[^a-z0-9]/g, "");
			if (aArticle.getGenre() === TypeGenreICal_1.TypeGenreICal.ICal_EDT) {
				lLibelle =
					TypeGenreICal_1.TypeGenreICalUtil.getPrefixICal(aArticle.getGenre()) +
					"_" +
					lLibelle;
			}
		}
		return lLibelle;
	}
	setArticle(aArticle) {
		this.donnees.article = aArticle;
	}
	getListe() {
		return this.donnees.liste || new ObjetListeElements_1.ObjetListeElements();
	}
	avecListeChoixDonnees() {
		return (
			[
				Enumere_Espace_1.EGenreEspace.Accompagnant,
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.PrimParent,
				Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
			].includes(this.etatUtilisateur.GenreEspace) &&
			this.donnees &&
			this.donnees.liste.count() > 0
		);
	}
	avecChoixDonneesExport() {
		return (
			this.donnees &&
			this.donnees.avecLienPerso &&
			this.donnees.article.getGenre() ===
				TypeGenreICal_1.TypeGenreICal.ICal_Perso
		);
	}
	avecChoixEDT() {
		return this.donnees.avecEDT;
	}
	getExportEDT() {
		return (
			this.donnees && this.donnees.article && this.donnees.article.exportEDT
		);
	}
	setExportEDT(aValue) {
		const lInitValue = this.donnees.article.exportEDT;
		this.donnees.article.exportEDT = aValue;
		const lParam = { exportEDT: aValue };
		if (this.donnees.avecAgenda) {
			lParam.exportAgenda = this.donnees.article.exportAgenda;
		}
		this.requeteSaisie(lParam).then((aJSON) => {
			if (aJSON.JSONRapportSaisie && aJSON.JSONRapportSaisie.message) {
				Toast_1.Toast.afficher({
					msg: aJSON.JSONRapportSaisie.message,
					type: Toast_1.ETypeToast.erreur,
					dureeAffichage: 3000,
				});
				this.donnees.article.exportEDT = lInitValue;
			}
		});
	}
	exportCalendrier() {
		if (
			this.avecChoixDonneesExport() &&
			!this.getExportEDT() &&
			!this.getExportAgenda()
		) {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"iCal.exportImpossible.titre",
				),
				message: ObjetTraduction_1.GTraductions.getValeur(
					"iCal.exportImpossible.info",
				),
			});
		} else {
			const lLien = this.getLienPermanent();
			if (lLien) {
				window.open(lLien);
			}
		}
	}
	copierLienCalendrier() {
		const lLien = this.getLienPermanent();
		if (
			this.avecChoixDonneesExport() &&
			!this.getExportEDT() &&
			!this.getExportAgenda()
		) {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"iCal.exportImpossible.titre",
				),
				message: ObjetTraduction_1.GTraductions.getValeur(
					"iCal.exportImpossible.info",
				),
			});
		} else {
			this.copierLienVersClipboard(lLien);
		}
	}
	avecChoixAgenda() {
		return this.donnees.avecAgenda;
	}
	getExportAgenda() {
		return (
			this.donnees && this.donnees.article && this.donnees.article.exportAgenda
		);
	}
	setExportAgenda(aValue) {
		const lInitValue = this.donnees.article.exportAgenda;
		this.donnees.article.exportAgenda = aValue;
		const lParam = { exportAgenda: aValue };
		if (this.donnees.avecEDT) {
			lParam.exportEDT = this.donnees.article.exportEDT;
		}
		this.requeteSaisie(lParam).then((aJSON) => {
			if (aJSON.JSONRapportSaisie && aJSON.JSONRapportSaisie.message) {
				Toast_1.Toast.afficher({
					msg: aJSON.JSONRapportSaisie.message,
					type: Toast_1.ETypeToast.erreur,
					dureeAffichage: 3000,
				});
				this.donnees.article.exportAgenda = lInitValue;
			}
		});
	}
	avecLienPermanent() {
		return this.donnees.article && !!this.donnees.article.lienNavigateur;
	}
	getLienPermanent() {
		if (
			this.donnees.article &&
			this.donnees.article.nom &&
			this.donnees.article.paramICal
		) {
			if (!this.donnees.article.lienNavigateur) {
				this.completerInformationsLien(this.donnees.article);
			}
			return ObjetChaine_1.GChaine.encoderUrl(
				this.donnees.article.lienNavigateur,
			);
		}
		return "";
	}
	copierLienVersClipboard(aLien) {
		if (
			aLien &&
			navigator &&
			navigator.clipboard &&
			navigator.clipboard.writeText
		) {
			navigator.clipboard.writeText(aLien).then(
				() => {
					Toast_1.Toast.afficher({
						msg: ObjetTraduction_1.GTraductions.getValeur(
							"iCal.fenetre.btnCopierSucces",
						),
						type: Toast_1.ETypeToast.succes,
						dureeAffichage: 3000,
					});
				},
				() => {
					Toast_1.Toast.afficher({
						msg: ObjetTraduction_1.GTraductions.getValeur(
							"iCal.fenetre.btnCopierEchec",
						),
						type: Toast_1.ETypeToast.erreur,
						dureeAffichage: 3000,
					});
				},
			);
		}
	}
	composeQRCode() {
		if (
			this.donnees &&
			this.donnees &&
			this.donnees.article &&
			this.donnees.article.lienNavigateur
		) {
			const H = [];
			H.push(
				IE.jsx.str(
					"span",
					{ class: "m-bottom" },
					ObjetTraduction_1.GTraductions.getValeur("iCal.modes.synchro.qrCode"),
				),
			);
			H.push(
				IE.jsx.str(
					"article",
					{ class: "bg-white" },
					UtilitaireQRCode_1.UtilitaireQRCode.genererImage(
						this.donnees.article.lienNavigateur,
						{
							taille: 240,
							alt: ObjetTraduction_1.GTraductions.getValeur(
								"iCal.modes.synchro.qrCodeAlt",
							),
						},
					),
				),
			);
			return H.join("");
		} else {
			return "";
		}
	}
	completerInformationsLien(aArticle) {
		const lVersion = GParametres.versionPN;
		if (aArticle && aArticle.nom && aArticle.paramICal) {
			const lParamSuppl = aArticle.paramSuppl
				? `&param=${aArticle.paramSuppl}`
				: "";
			aArticle.href = `ical/${aArticle.nom}.ics?icalsecurise=${aArticle.paramICal}&version=${lVersion}${lParamSuppl}`;
			aArticle.lienNavigateur =
				ObjetNavigateur_1.Navigateur.getHost() + aArticle.href;
		}
	}
	async requeteSaisie(aParam) {
		const lReponse = await new ObjetRequeteSaisieParametresiCal(
			this,
		).lancerRequete(aParam);
		return lReponse;
	}
}
exports.MoteurParametresiCal = MoteurParametresiCal;
class ObjetRequeteSaisieParametresiCal extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieParametresiCal = ObjetRequeteSaisieParametresiCal;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieParametresiCal",
	ObjetRequeteSaisieParametresiCal,
);
