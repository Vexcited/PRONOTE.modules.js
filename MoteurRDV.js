exports.MoteurRDV = exports.EGenreCmdCtxRdv = void 0;
const TypesRDV_1 = require("TypesRDV");
const TypesRDV_2 = require("TypesRDV");
const TypesRDV_3 = require("TypesRDV");
const TypesRDV_4 = require("TypesRDV");
const TypesRDV_5 = require("TypesRDV");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Espace_1 = require("Enumere_Espace");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const ObjetDate_1 = require("ObjetDate");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SelectionSalleLieu_js_1 = require("ObjetFenetre_SelectionSalleLieu.js");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetListe_1 = require("ObjetListe");
const GUID_1 = require("GUID");
const ObjetTri_1 = require("ObjetTri");
const jsx_1 = require("jsx");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const Enumere_MenuCtxModeMixte_1 = require("Enumere_MenuCtxModeMixte");
exports.EGenreCmdCtxRdv = {
	annulerRdv: "annulerRdv",
	modifierRdv: "modifierRdv",
	supprimerRdv: "supprimerRdv",
	accepterDemandeRdv: "accepterDemandeRdv",
	refuserDemandeRdv: "refuserDemandeRdv",
	modifierRdvCtxNonResp: "modifierRdvCtxNonResp",
};
class MoteurRDV {
	constructor() {
		this.estCtxResponsableDeRDV = function () {
			return (
				[
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
					Enumere_Espace_1.EGenreEspace.PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.Administrateur,
					Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
					Enumere_Espace_1.EGenreEspace.Etablissement,
					Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
					Enumere_Espace_1.EGenreEspace.Accompagnant,
					Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
					Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
				].indexOf(GEtatUtilisateur.GenreEspace) >= 0
			);
		};
		this.estCtxPresenceDemandeeAuRdv = function (aRdv) {
			if (
				[
					Enumere_Espace_1.EGenreEspace.Eleve,
					Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
					Enumere_Espace_1.EGenreEspace.PrimEleve,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
				].indexOf(GEtatUtilisateur.GenreEspace) === -1
			) {
				return false;
			}
			if (
				!aRdv.session ||
				aRdv.session.natureRDV ===
					TypesRDV_4.TypeNatureRDV.tNRDV_CreneauImpose ||
				aRdv.session.avecPresenceEleve !== true ||
				aRdv.eleveConcerne === null ||
				aRdv.eleveConcerne === undefined
			) {
				return false;
			}
			let lEleveConnecte = GEtatUtilisateur.getUtilisateur();
			if (
				lEleveConnecte.getNumero() !== aRdv.eleveConcerne.getNumero() ||
				(aRdv.listeParticipantRDV &&
					aRdv.listeParticipantRDV.getElementParNumeroEtGenre(
						lEleveConnecte.getNumero(),
						lEleveConnecte.getGenre(),
					))
			) {
				return false;
			}
			return true;
		};
	}
	async requeteListeRDV(aAvecRdvPasses) {
		const lReponse = await new ObjetRequeteRDV().lancerRequete({
			type: TypesRDV_5.TypeRDVCommandeRequete.rdvcr_RDV,
			avecRdvPasses: aAvecRdvPasses,
		});
		return lReponse;
	}
	async requeteSaisieRDV(aParam) {
		let lReponse;
		if (
			aParam.listePJs !== null &&
			aParam.listePJs !== undefined &&
			aParam.listePJs.count() > 0
		) {
			const lParamUpload = { listeFichiers: aParam.listePJs };
			lReponse = await new ObjetRequeteSaisieRDV()
				.addUpload(lParamUpload)
				.lancerRequete(aParam);
		} else {
			lReponse = await new ObjetRequeteSaisieRDV().lancerRequete(aParam);
		}
		return lReponse;
	}
	async requeteVerifCreneaux(aParam) {
		const lReponse = await new ObjetRequeteRDV().lancerRequete(aParam);
		return lReponse;
	}
	avecVerifCreneaux(aRDV) {
		if (!this.estCtxResponsableDeRDV()) {
			return false;
		}
		let lEstCreationRdv = aRDV.getEtat() === Enumere_Etat_1.EGenreEtat.Creation;
		return (
			(aRDV.session.natureRDV ===
				TypesRDV_4.TypeNatureRDV.tNRDV_CreneauImpose &&
				lEstCreationRdv) ||
			(aRDV.session.natureRDV ===
				TypesRDV_4.TypeNatureRDV.tNRDV_UniqueInitiativePublic &&
				!lEstCreationRdv &&
				!this.existeCreneauPourRdv(aRDV)) ||
			(aRDV.session.natureRDV ===
				TypesRDV_4.TypeNatureRDV.tNRDV_UniqueInitiativeRespRDV &&
				(lEstCreationRdv ||
					aRDV.etat === TypesRDV_3.TypeEtatRDV.terdv_PropositionEnCours ||
					aRDV.etat === TypesRDV_3.TypeEtatRDV.terdv_PropositionRefusee)) ||
			this.estUnRdvEnSerie(aRDV)
		);
	}
	getParamVerifCreneaux(aRDV) {
		if (!this.avecVerifCreneaux(aRDV)) {
			return;
		}
		let lResponsableRDV = GEtatUtilisateur.getUtilisateur();
		let lListeParticipantRDV = aRDV.listeParticipantRDV;
		let lEleveConcerne;
		let lListeCreneaux = new ObjetListeElements_1.ObjetListeElements();
		let lSession;
		switch (aRDV.session.natureRDV) {
			case TypesRDV_4.TypeNatureRDV.tNRDV_CreneauImpose:
				lListeCreneaux = lListeCreneaux.addElement(aRDV.creneau);
				break;
			case TypesRDV_4.TypeNatureRDV.tNRDV_UniqueInitiativePublic:
				lResponsableRDV = aRDV.session.responsableRDV;
				lEleveConcerne = aRDV.eleveConcerne;
				lListeCreneaux = aRDV.session.listeCreneauxProposes.getListeElements(
					(aCreneau) => {
						return aCreneau.getEtat() === Enumere_Etat_1.EGenreEtat.Creation;
					},
				);
				lSession = aRDV.session;
				break;
			case TypesRDV_4.TypeNatureRDV.tNRDV_UniqueInitiativeRespRDV:
				lEleveConcerne = aRDV.eleveConcerne;
				if (aRDV.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation) {
					lSession = aRDV.session;
				}
				lListeCreneaux = aRDV.session.listeCreneauxProposes.getListeElements(
					(aCreneau) => {
						return aCreneau.getEtat() === Enumere_Etat_1.EGenreEtat.Creation;
					},
				);
				break;
			case TypesRDV_4.TypeNatureRDV.tNRDV_EnSerie:
			case TypesRDV_4.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes:
				lSession = aRDV.session;
				lListeCreneaux = aRDV.session.listeCreneauxProposes.getListeElements(
					(aCreneau) => {
						return aCreneau.getEtat() === Enumere_Etat_1.EGenreEtat.Creation;
					},
				);
				break;
		}
		return {
			type: TypesRDV_5.TypeRDVCommandeRequete.rdvcr_VerifierCreneaux,
			responsableRDV: lResponsableRDV,
			natureRdv: aRDV.session.natureRDV,
			listeParticipantRDV: lListeParticipantRDV,
			eleveConcerne: lEleveConcerne,
			duree: aRDV.session.duree,
			listeCreneaux: lListeCreneaux,
			session: lSession,
		};
	}
	existeCreneauPourRdv(aRDV) {
		return (
			aRDV.etat === TypesRDV_3.TypeEtatRDV.terdv_RDVValide ||
			aRDV.etat === TypesRDV_3.TypeEtatRDV.terdv_RDVAnnule
		);
	}
	getHtmlHeadDate(aRdv) {
		return this.existeCreneauPourRdv(aRdv)
			? IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"time",
						{
							class: "date-contain",
							datetime: ObjetDate_1.GDate.formatDate(
								aRdv.creneau.debut,
								"%JJ %MMM",
							),
						},
						ObjetDate_1.GDate.formatDate(aRdv.creneau.debut, "%JJ %MMM"),
					),
				)
			: "";
	}
	getHtmlTime(aRdv) {
		return this.existeCreneauPourRdv(aRdv)
			? IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "time-contain" },
						ObjetDate_1.GDate.formatDate(aRdv.creneau.debut, "%hh%sh%mm"),
					),
				)
			: "";
	}
	getHtmlDateCreneau(aRdv) {
		return this.existeCreneauPourRdv(aRdv)
			? IE.jsx.str(
					IE.jsx.fragment,
					null,
					ObjetDate_1.GDate.formatDate(aRdv.creneau.debut, "%JJJJ %JJ %MMMM"),
				)
			: "";
	}
	getHtmlTimeCreneau(aRdv) {
		return this.existeCreneauPourRdv(aRdv)
			? IE.jsx.str(
					IE.jsx.fragment,
					null,
					ObjetDate_1.GDate.formatDate(aRdv.creneau.debut, "%hh%sh%mm"),
				)
			: "";
	}
	getHtmlWarningInfoManquante(aRdv) {
		let lInfoManquante = false;
		let lStrRaison = "";
		if (aRdv.estRdvSessionSerie && this.estCtxResponsableDeRDV()) {
			let lListeCreneaux = aRdv.session.listeCreneauxProposes;
			if (
				!this.tousRdvDeLaSerieOntUnCreneau(aRdv) &&
				this.aucunCreneauNestReservable(lListeCreneaux)
			) {
				lInfoManquante = true;
				lStrRaison = this.estCtxResponsableDeRDV()
					? ObjetTraduction_1.GTraductions.getValeur("RDV.creneauxARenseigner")
					: ObjetTraduction_1.GTraductions.getValeur("RDV.aucunCreneauLibre");
			}
		} else {
			if (this.existeCreneauPourRdv(aRdv)) {
				let lModalite = aRdv.creneau.modalite;
				switch (lModalite) {
					case TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Telephonique:
						if (!aRdv.telephone) {
							lInfoManquante = true;
							lStrRaison =
								ObjetTraduction_1.GTraductions.getValeur("RDV.TelNR");
						}
						break;
					case TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Visio:
						break;
				}
			} else if (this.estProposition(aRdv)) {
				let lListeCreneaux = aRdv.session.listeCreneauxProposes;
				if (this.aucunCreneauNestReservable(lListeCreneaux)) {
					lInfoManquante = true;
					lStrRaison = this.estCtxResponsableDeRDV()
						? ObjetTraduction_1.GTraductions.getValeur(
								"RDV.creneauxARenseigner",
							)
						: ObjetTraduction_1.GTraductions.getValeur("RDV.aucunCreneauLibre");
				}
			}
		}
		return lInfoManquante
			? IE.jsx.str(
					"span",
					{ class: "like-link" },
					lStrRaison,
					IE.jsx.str("i", { class: "icon_justifier", "aria-hidden": "true" }),
				)
			: "";
	}
	getHtmlNonRenseignee(aAvecWarning) {
		return aAvecWarning
			? IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str("i", {
						class: ["icon", "icon_warning_sign", "m-right-l"],
						"aria-hidden": "true",
					}),
					IE.jsx.str(
						"span",
						null,
						ObjetTraduction_1.GTraductions.getValeur("RDV.nonRenseigne"),
					),
				)
			: ObjetTraduction_1.GTraductions.getValeur("RDV.nonRenseigne");
	}
	getHtmlModaliteCreneau(aRdv) {
		let lIconSelonModaliteCreneau = this.getIconModaliteCreneauRDV(aRdv);
		let lStrSelonModaliteCreneau = this.getStrModaliteCreneauRDV(aRdv);
		return this.existeCreneauPourRdv(aRdv)
			? IE.jsx.str(
					IE.jsx.fragment,
					null,
					lIconSelonModaliteCreneau !== ""
						? IE.jsx.str("i", {
								class: [lIconSelonModaliteCreneau, "m-left"],
								"aria-hidden": "true",
							})
						: "",
					IE.jsx.str("span", null, lStrSelonModaliteCreneau),
				)
			: "";
	}
	existeLieuPourRdv(aRdv) {
		return (
			aRdv.creneau !== null &&
			aRdv.creneau !== undefined &&
			aRdv.creneau.lieu !== null &&
			aRdv.creneau.lieu !== undefined
		);
	}
	getHtmlLieuCreneau(aRdv) {
		return this.existeLieuPourRdv(aRdv)
			? IE.jsx.str(
					"div",
					{ class: ["flex-contain", "flex-center", "flex-gap-s"] },
					IE.jsx.str("i", {
						class: this.getIconLieuRdv(),
						"aria-hidden": "true",
					}),
					IE.jsx.str("span", null, aRdv.creneau.lieu.Libelle),
				)
			: "";
	}
	getIconModaliteCreneauRDV(aRDV) {
		return TypesRDV_5.TypeModaliteCreneauRDVUtil.getIcon(aRDV.creneau.modalite);
	}
	getStrModaliteCreneauRDV(aRDV) {
		return TypesRDV_5.TypeModaliteCreneauRDVUtil.getStr(aRDV.creneau.modalite);
	}
	getStrInterlocuteurRdv(aRdv, aAvecFonction) {
		return aRdv.estResponsableRDV
			? this.strParticipantsRdv(aRdv, ", ")
			: this.strResponsableRdv(aRdv, aAvecFonction);
	}
	estCtxDemandeDeRDV() {
		return [
			Enumere_Espace_1.EGenreEspace.Parent,
			Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			Enumere_Espace_1.EGenreEspace.PrimParent,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
		].includes(GEtatUtilisateur.GenreEspace);
	}
	estCtxForcerDirEnseignant() {
		return [
			Enumere_Espace_1.EGenreEspace.PrimParent,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
		].includes(GEtatUtilisateur.GenreEspace);
	}
	estRdvImpose(aRdv) {
		return [
			TypesRDV_4.TypeNatureRDV.tNRDV_CreneauImpose,
			TypesRDV_4.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes,
		].includes(aRdv.session.natureRDV);
	}
	strParticipants(aListeParticipants, aSeparateur) {
		let lResult = "";
		if (
			aListeParticipants === null ||
			aListeParticipants === undefined ||
			aListeParticipants.count() === 0
		) {
			return lResult;
		}
		aListeParticipants.parcourir((aParticipant) => {
			if (lResult === "") {
				lResult += aParticipant.getLibelle();
			} else {
				lResult += aSeparateur + aParticipant.getLibelle();
			}
			if (aParticipant.strClasse) {
				lResult += " (" + aParticipant.strClasse + ")";
			}
		});
		return lResult;
	}
	strParticipantsRdv(aRdv, aSeparateur) {
		return aRdv.listeParticipantRDV
			? this.strParticipants(aRdv.listeParticipantRDV, aSeparateur)
			: "";
	}
	strResponsableRdv(aRdv, aAvecFonction) {
		let lRespRdv = aRdv.session.responsableRDV;
		let lResult = lRespRdv.Libelle;
		if (aAvecFonction) {
			if (lRespRdv.fonction) {
				lResult += " (" + lRespRdv.fonction + ")";
			}
			if (aRdv.respRdvEstPPEleveConcerne === true) {
				lResult +=
					" (" + ObjetTraduction_1.GTraductions.getValeur("ProfPrincipal");
				if (aRdv.strMatieresRespRdvPourEleveConcerne) {
					lResult += " - " + aRdv.strMatieresRespRdvPourEleveConcerne;
				}
				lResult += ")";
			} else if (aRdv.strMatieresRespRdvPourEleveConcerne) {
				lResult += " (" + aRdv.strMatieresRespRdvPourEleveConcerne + ")";
			}
		}
		return lResult;
	}
	avecBtnCreationRdv() {
		let lEstEspaceEleve =
			[
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
				Enumere_Espace_1.EGenreEspace.PrimEleve,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
			].indexOf(GEtatUtilisateur.GenreEspace) >= 0;
		return !lEstEspaceEleve;
	}
	avecDemandeDeRdv() {
		let lEstCtxRespDeRDV = this.estCtxResponsableDeRDV();
		let lEstEspaceEleve =
			[
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
				Enumere_Espace_1.EGenreEspace.PrimEleve,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
			].indexOf(GEtatUtilisateur.GenreEspace) >= 0;
		return !lEstCtxRespDeRDV && !lEstEspaceEleve;
	}
	respRdvPeutVoirTelParticipant(aRdv) {
		return (
			aRdv.etat === TypesRDV_3.TypeEtatRDV.terdv_RDVValide &&
			(this.estCreneauTelephonique(aRdv.creneau) ||
				aRdv.respRdvPeutVoirInfoPublic)
		);
	}
	majNbCreneauxDePlage(aPlageHoraire) {
		if (
			aPlageHoraire.finPlage.getTime() <= aPlageHoraire.debutPlage.getTime()
		) {
			aPlageHoraire.nbCreneaux = 0;
			return;
		}
		let lDureePlageEnMs =
			aPlageHoraire.finPlage.getTime() - aPlageHoraire.debutPlage.getTime();
		let lDureePlageEnMin = Math.floor(
			lDureePlageEnMs / ObjetDate_1.GDate.DureeMinutes,
		);
		aPlageHoraire.nbCreneaux = Math.floor(
			lDureePlageEnMin /
				UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(aPlageHoraire.duree),
		);
	}
	setPlageHSelonDebutPlage(aDebutPlage, aPlageHoraire) {
		if (!ObjetDate_1.GDate.estJourEgal(aDebutPlage, aPlageHoraire.date)) {
			return;
		}
		aPlageHoraire.debutPlage = aDebutPlage;
		this.majNbCreneauxDePlage(aPlageHoraire);
		aPlageHoraire.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	setPlageHSelonFinPlage(aFinPlage, aPlageHoraire) {
		if (!ObjetDate_1.GDate.estJourEgal(aFinPlage, aPlageHoraire.date)) {
			return;
		}
		aPlageHoraire.finPlage = aFinPlage;
		this.majNbCreneauxDePlage(aPlageHoraire);
		aPlageHoraire.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	setPlageHSelonDate(aDate, aPlageHoraire) {
		if (ObjetDate_1.GDate.estDateEgale(aDate, aPlageHoraire.date)) {
			return;
		}
		let lRefDebPlage = new Date();
		lRefDebPlage.setTime(aPlageHoraire.debutPlage.getTime());
		let lRefFinPlage = new Date();
		lRefFinPlage.setTime(aPlageHoraire.finPlage.getTime());
		aPlageHoraire.date = aDate;
		aPlageHoraire.debutPlage.setFullYear(
			aDate.getFullYear(),
			aDate.getMonth(),
			aDate.getDate(),
		);
		aPlageHoraire.debutPlage.setHours(lRefDebPlage.getHours());
		aPlageHoraire.debutPlage.setMinutes(lRefDebPlage.getMinutes());
		aPlageHoraire.finPlage.setFullYear(
			aDate.getFullYear(),
			aDate.getMonth(),
			aDate.getDate(),
		);
		aPlageHoraire.finPlage.setHours(lRefFinPlage.getHours());
		aPlageHoraire.finPlage.setMinutes(lRefFinPlage.getMinutes());
		aPlageHoraire.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	initPlageHoraireCreneaux(aDuree) {
		let lResult = new ObjetElement_1.ObjetElement();
		lResult.duree = aDuree ? aDuree : this.getDureeRdvParDefaut();
		const lPremiereHeure = ObjetDate_1.GDate.placeEnDateHeure(0);
		let lDateProchainJOuvre = ObjetDate_1.GDate.getProchainJourOuvre(
			ObjetDate_1.GDate.getDateCourante(),
		);
		let lDateInitPlageH = new Date(
			lDateProchainJOuvre.setHours(
				lPremiereHeure.getHours(),
				lPremiereHeure.getMinutes(),
			),
		);
		let lDateFinPlageH = new Date();
		let lDureeEnMin = this.getDureePlageHoraireEnMinutes(
			this.getDureePlageHoraireParDefaut(),
		);
		lDateFinPlageH.setTime(
			lDateInitPlageH.getTime() + lDureeEnMin * ObjetDate_1.GDate.DureeMinutes,
		);
		lResult.date = lDateProchainJOuvre;
		lResult.debutPlage = lDateInitPlageH;
		lResult.finPlage = lDateFinPlageH;
		lResult.modalite = TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Presentiel;
		this.majNbCreneauxDePlage(lResult);
		return lResult;
	}
	getCreneauxDepuisPlageHoraire(aPlageH) {
		let lTabCreneaux = [];
		let lNbCreneaux = aPlageH.nbCreneaux;
		let lDebPlage = aPlageH.debutPlage.getTime();
		let lDureePlageEnMin =
			UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(aPlageH.duree) *
			ObjetDate_1.GDate.DureeMinutes;
		let lDateDeb = new Date();
		let lDateFin = new Date();
		lDateDeb.setTime(lDebPlage);
		lDateFin.setTime(lDebPlage + lDureePlageEnMin);
		for (let i = 1, lNb = lNbCreneaux; i <= lNb; i++) {
			let lCreneau = this.getCreneau(
				lDateDeb,
				lDateFin,
				aPlageH.modalite,
				aPlageH.lieu,
			);
			lTabCreneaux.push(lCreneau);
			lDateDeb.setTime(lDateFin.getTime());
			lDateFin.setTime(lDateDeb.getTime() + lDureePlageEnMin);
		}
		return lTabCreneaux;
	}
	getCreneau(aDeb, aFin, aModalite, aLieu) {
		let lCreneau = new ObjetElement_1.ObjetElement();
		lCreneau.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		lCreneau.debut = new Date();
		lCreneau.debut.setTime(aDeb.getTime());
		lCreneau.fin = new Date();
		lCreneau.fin.setTime(aFin.getTime());
		lCreneau.etat = TypesRDV_2.TypeEtatCreneauSessionRDV.tecsrdv_Libre;
		lCreneau.modalite = aModalite;
		lCreneau.lieu = aLieu;
		return lCreneau;
	}
	initCreneau() {
		const lPremiereHeure = ObjetDate_1.GDate.placeEnDateHeure(0);
		let lDateProchainJOuvre = ObjetDate_1.GDate.getProchainJourOuvre(
			ObjetDate_1.GDate.getDateCourante(),
		);
		let lDateInitCreneau = new Date(
			lDateProchainJOuvre.setHours(
				lPremiereHeure.getHours(),
				lPremiereHeure.getMinutes(),
			),
		);
		return this.getCreneau(
			lDateInitCreneau,
			lDateInitCreneau,
			TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Presentiel,
		);
	}
	estCreneauLibre(aCreneau) {
		return aCreneau.etat === TypesRDV_2.TypeEtatCreneauSessionRDV.tecsrdv_Libre;
	}
	estCreneauPasse(aCreneau) {
		return aCreneau.debut < new Date();
	}
	estCreneauOccupe(aCreneau) {
		return (
			aCreneau.etat === TypesRDV_2.TypeEtatCreneauSessionRDV.tecsrdv_Occupe
		);
	}
	estCreneauTelephonique(aCreneau) {
		return (
			aCreneau.modalite ===
			TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Telephonique
		);
	}
	existeCreneauTelephonique(aListeCreneaux) {
		let lCreneauTelTrouve = false;
		aListeCreneaux.parcourir((aCreneau) => {
			if (aCreneau.existe() && this.estCreneauTelephonique(aCreneau)) {
				lCreneauTelTrouve = true;
				return false;
			}
		});
		return lCreneauTelTrouve;
	}
	existeCreneauOccupeOuPasse(aListeCreneaux) {
		let lCreneauTrouve = false;
		aListeCreneaux.parcourir((aCreneau) => {
			if (
				aCreneau.existe() &&
				(this.estCreneauOccupe(aCreneau) || this.estCreneauPasse(aCreneau))
			) {
				lCreneauTrouve = true;
				return false;
			}
		});
		return lCreneauTrouve;
	}
	nbCreneauxReservables(aListeCreneaux) {
		let lNbOk = 0;
		if (!aListeCreneaux || aListeCreneaux.count() === 0) {
			return lNbOk;
		}
		aListeCreneaux.parcourir((aCreneau) => {
			if (!this.estCreneauOccupe(aCreneau) && !this.estCreneauPasse(aCreneau)) {
				lNbOk++;
			}
		});
		return lNbOk;
	}
	tousRdvDeLaSerieOntUnCreneau(aRdvSessionSerie) {
		if (!aRdvSessionSerie.estRdvSessionSerie) {
			return false;
		}
		let lNbRdvAvecCreneau =
			aRdvSessionSerie.nbRdvValidesDeSession +
			aRdvSessionSerie.nbRdvAnnulesDeSession;
		return aRdvSessionSerie.nbTotalRdvDeSession - lNbRdvAvecCreneau === 0;
	}
	existeAuMoinsUnCreneau(aListeCreneaux) {
		if (aListeCreneaux === null || aListeCreneaux === undefined) {
			return false;
		}
		return (
			aListeCreneaux
				.getListeElements((aCreneau) => {
					return aCreneau.existe();
				})
				.count() > 0
		);
	}
	aucunCreneauNestReservable(aListeCreneaux) {
		return this.nbCreneauxReservables(aListeCreneaux) < 1;
	}
	copierRdv(aRdv) {
		return MethodesObjet_1.MethodesObjet.dupliquer(aRdv);
	}
	initRDV(aNatureRDV) {
		let lSession = new ObjetElement_1.ObjetElement();
		lSession.natureRDV = aNatureRDV;
		lSession.duree = this.getDureeRdvParDefaut();
		lSession.sujet = "";
		lSession.description = "";
		lSession.avecPresenceEleve = false;
		lSession.listeCreneauxProposes =
			new ObjetListeElements_1.ObjetListeElements();
		lSession.listePJ = new ObjetListeElements_1.ObjetListeElements();
		lSession.dureeCreneauxEnEdition = lSession.duree;
		if (this.estCtxResponsableDeRDV()) {
			lSession.responsableRDV = GEtatUtilisateur.getUtilisateur();
		}
		let lRDV = new ObjetElement_1.ObjetElement();
		lRDV.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		lRDV.session = lSession;
		lRDV.creneau = this.initCreneau();
		lRDV.estResponsableRDV = this.estCtxResponsableDeRDV();
		switch (aNatureRDV) {
			case TypesRDV_4.TypeNatureRDV.tNRDV_CreneauImpose:
				lRDV.etat = TypesRDV_3.TypeEtatRDV.terdv_RDVValide;
				break;
			case TypesRDV_4.TypeNatureRDV.tNRDV_UniqueInitiativeRespRDV:
				lRDV.etat = TypesRDV_3.TypeEtatRDV.terdv_PropositionEnCours;
				break;
		}
		lRDV.listeParticipantRDV = new ObjetListeElements_1.ObjetListeElements();
		if (aNatureRDV === TypesRDV_4.TypeNatureRDV.tNRDV_EnSerie) {
			lRDV.tabFamillesParticipantRDV = [];
			lRDV.estRdvSessionSerie = true;
		} else if (
			aNatureRDV === TypesRDV_4.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes
		) {
			lRDV.listeParticipantsSerie =
				new ObjetListeElements_1.ObjetListeElements();
			lRDV.estRdvSessionSerie = true;
		}
		lRDV.listePJ = new ObjetListeElements_1.ObjetListeElements();
		return lRDV;
	}
	estUnRdvEnSerie(aRdv) {
		return (
			aRdv &&
			((aRdv.session &&
				(aRdv.session.natureRDV === TypesRDV_4.TypeNatureRDV.tNRDV_EnSerie ||
					aRdv.session.natureRDV ===
						TypesRDV_4.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes)) ||
				aRdv.estRdvDeSerie)
		);
	}
	getListeModalites() {
		const lTabAExclure = [
			TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Libre,
			TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Visio,
		];
		return TypesRDV_5.TypeModaliteCreneauRDVUtil.toListe(lTabAExclure);
	}
	getIconSelonEtatRDV(aEtat) {
		switch (aEtat) {
			case TypesRDV_3.TypeEtatRDV.terdv_RDVAnnule:
				return "icon_remove";
			case TypesRDV_3.TypeEtatRDV.terdv_RDVDemande:
				return this.estCtxResponsableDeRDV()
					? "icon_exclamation"
					: "icon_edt_permanence";
			case TypesRDV_3.TypeEtatRDV.terdv_PropositionEnCours:
				return this.estCtxResponsableDeRDV()
					? "icon_edt_permanence"
					: "icon_exclamation";
			case TypesRDV_3.TypeEtatRDV.terdv_RDVRefuse:
				return "icon_sens_interdit";
			default:
				return "";
		}
	}
	getIconEtatRDV(aRdv) {
		return this.getIconSelonEtatRDV(aRdv.etat);
	}
	getStrEtatRDV(aRdv) {
		switch (aRdv.etat) {
			case TypesRDV_3.TypeEtatRDV.terdv_RDVAnnule:
				return ObjetTraduction_1.GTraductions.getValeur("RDV.annule");
			case TypesRDV_3.TypeEtatRDV.terdv_RDVDemande:
				return this.estCtxResponsableDeRDV()
					? ObjetTraduction_1.GTraductions.getValeur("RDV.voirRdvDemandes")
					: ObjetTraduction_1.GTraductions.getValeur("RDV.demandeRdv");
			case TypesRDV_3.TypeEtatRDV.terdv_PropositionEnCours:
				return this.estCtxResponsableDeRDV()
					? ObjetTraduction_1.GTraductions.getValeur("RDV.propositionEnCours")
					: ObjetTraduction_1.GTraductions.getValeur("RDV.aValider");
			case TypesRDV_3.TypeEtatRDV.terdv_RDVRefuse:
				return ObjetTraduction_1.GTraductions.getValeur("RDV.refuse");
			default:
				return "";
		}
	}
	getIconLieuRdv() {
		return "icon_map_marker";
	}
	estProposition(aRdv) {
		return (
			aRdv.etat === TypesRDV_3.TypeEtatRDV.terdv_PropositionEnCours ||
			aRdv.etat === TypesRDV_3.TypeEtatRDV.terdv_PropositionRefusee
		);
	}
	estDemande(aRdv) {
		return (
			!this.estUnRdvEnSerie(aRdv) &&
			aRdv.etat === TypesRDV_3.TypeEtatRDV.terdv_RDVDemande
		);
	}
	estRdvAnnule(aRdv) {
		return aRdv.etat === TypesRDV_3.TypeEtatRDV.terdv_RDVAnnule;
	}
	estRdvRefuse(aRdv) {
		return aRdv.etat === TypesRDV_3.TypeEtatRDV.terdv_RDVRefuse;
	}
	estRdvValide(aRdv) {
		return aRdv.etat === TypesRDV_3.TypeEtatRDV.terdv_RDVValide;
	}
	estRdvAnnulable(aRdv) {
		return (
			aRdv.etat === TypesRDV_3.TypeEtatRDV.terdv_RDVValide &&
			aRdv.creneau &&
			!this.estCreneauPasse(aRdv.creneau)
		);
	}
	annulerRdv(aInstance, aRdv, aClbck) {
		if (!this.estRdvAnnulable(aRdv)) {
			return;
		}
		this.ouvrirFenetreAnnulationRdv(aInstance, aRdv, aClbck);
	}
	refuserRdv(aInstance, aRdv, aClbck) {
		if (!this.estDemande(aRdv)) {
			return;
		}
		this.ouvrirFenetreRefusRdv(aInstance, aRdv, aClbck);
	}
	ouvrirFenetreRefusRdv(aInstance, aRdv, aClbck) {
		if (!aRdv) {
			return;
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				evenement: (aNumeroBouton, aParams) => {
					if (aParams.numeroBouton === 1) {
						this.requeteSaisieRDV({
							type: TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_RefuserRdv,
							rdv: aRdv,
						}).then(() => {
							aClbck();
						});
					}
				},
				initialiser: (aInstance) => {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"RDV.refuserDemandeRdv",
						),
						largeurMin: 300,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							{
								libelle: ObjetTraduction_1.GTraductions.getValeur(
									"RDV.confirmerRefusRdv",
								),
								valider: true,
								theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
							},
						],
					});
				},
			},
		);
		return lFenetre.afficher(this.composeRefusRdv(lFenetre, aRdv));
	}
	ouvrirFenetreAnnulationRdv(aInstance, aRdv, aClbck) {
		if (!aRdv) {
			return;
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				evenement: (aNumeroBouton, aParams) => {
					if (aParams.numeroBouton === 1) {
						this.requeteSaisieRDV({
							type: TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_AnnulerRdv,
							rdv: aRdv,
						}).then(() => {
							aClbck();
						});
					}
				},
				initialiser: (aInstance) => {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur("RDV.annulerRdv"),
						largeurMin: 300,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("RDV.conserverRdv"),
							{
								libelle: ObjetTraduction_1.GTraductions.getValeur(
									"RDV.confirmerAnnulationRdv",
								),
								valider: true,
								theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
							},
						],
					});
				},
			},
		);
		return lFenetre.afficher(this.composeAnnulationRdv(lFenetre, aRdv));
	}
	supprimerRdv(aRdv, aClbck) {
		GApplication.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: aRdv.estRdvSessionSerie
					? ObjetTraduction_1.GTraductions.getValeur(
							"RDV.msgConfirmSupprSessionRdv",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"RDV.msgConfirmSupprimerRdv",
						),
			})
			.then((aGenreBouton) => {
				if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
					this.requeteSaisieRDV({
						type: aRdv.estRdvSessionSerie
							? TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_SupprimerSessionRdv
							: TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_SupprimerRdv,
						rdv: aRdv,
					}).then(() => {
						aClbck();
					});
				}
			});
	}
	getDureePlageHoraireParDefaut() {
		return UtilitaireDuree_1.TUtilitaireDuree.minEnDuree(
			MoteurRDV.C_DefaultDureePlageHoraire,
		);
	}
	getDureePlageHoraireEnMinutes(aDuree) {
		return aDuree
			? UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(aDuree)
			: MoteurRDV.C_DefaultDureePlageHoraire;
	}
	getDureeRdvParDefaut() {
		return UtilitaireDuree_1.TUtilitaireDuree.minEnDuree(
			MoteurRDV.C_DefaultDureeRDV,
		);
	}
	getDureeRdvEnMinutes(aRdv) {
		return aRdv && aRdv.session
			? UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(aRdv.session.duree)
			: MoteurRDV.C_DefaultDureeRDV;
	}
	getParticipantDuRdv(aRdv) {
		return aRdv.listeParticipantRDV && aRdv.listeParticipantRDV.count() > 0
			? aRdv.listeParticipantRDV.get(0)
			: null;
	}
	estRdvAvecUnParent(aRdv) {
		let lParticipant = this.getParticipantDuRdv(aRdv);
		return (
			lParticipant &&
			lParticipant.Genre === Enumere_Ressource_1.EGenreRessource.Responsable
		);
	}
	getStrEleveConcerne(aEleveConcerne) {
		return (
			aEleveConcerne.getLibelle() +
			(aEleveConcerne.strClasse ? " (" + aEleveConcerne.strClasse + ")" : "")
		);
	}
	getStrEleveConcerneRdv(aRdv) {
		let lEstRdvAvecParent = this.estRdvAvecUnParent(aRdv);
		return lEstRdvAvecParent
			? this.getStrEleveConcerne(aRdv.eleveConcerne)
			: "";
	}
	_getIdentiteDatePlageCreneau(
		aInstance,
		aRdv,
		aPlageHoraireCreneaux,
		aEditable,
	) {
		let lMoteurRdv = this;
		return {
			class: ObjetCelluleDate_1.ObjetCelluleDate,
			pere: aInstance,
			init(aInstanceDate) {
				aInstanceDate.setOptionsObjetCelluleDate({
					ariaDescription: ObjetTraduction_1.GTraductions.getValeur("Date"),
					required: true,
				});
			},
			start(aInstanceDate) {
				if (!aRdv || !aPlageHoraireCreneaux) {
					return;
				}
				aInstanceDate.setPremiereDateSaisissable(ObjetDate_1.GDate.aujourdhui);
				aInstanceDate.setDonnees(aPlageHoraireCreneaux.date);
				aInstanceDate.setActif(aEditable);
			},
			evenement(aDate) {
				if (
					!ObjetDate_1.GDate.estDateEgale(aDate, aPlageHoraireCreneaux.date)
				) {
					lMoteurRdv.setPlageHSelonDate(aDate, aPlageHoraireCreneaux);
					aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			},
		};
	}
	_getHtmlInfosCreneaux(aPlageHoraireCreneaux) {
		return function () {
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					null,
					ObjetTraduction_1.GTraductions.getValeur("RDV.dureeParCreneau", [
						UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
							aPlageHoraireCreneaux.duree,
						),
					]),
				),
				IE.jsx.str(
					"div",
					null,
					ObjetTraduction_1.GTraductions.getValeur("RDV.nbCreneaux", [
						aPlageHoraireCreneaux.nbCreneaux,
					]),
				),
			);
		};
	}
	_getInputHeureDebPlageCreneau(aRdv, aPlageHoraireCreneaux, aEditable) {
		let lMoteurRdv = this;
		return {
			getValueInit() {
				return !!aRdv && aPlageHoraireCreneaux
					? ObjetDate_1.GDate.formatDate(
							aPlageHoraireCreneaux.debutPlage,
							"%hh:%mm",
						)
					: "";
			},
			exitChange(aValue, aParamsSetter) {
				let lDateDeb = aPlageHoraireCreneaux.debutPlage;
				const lDate = new Date(
					lDateDeb.getFullYear(),
					lDateDeb.getMonth(),
					lDateDeb.getDate(),
					aParamsSetter.time.heure,
					aParamsSetter.time.minute,
				);
				if (
					!ObjetDate_1.GDate.estDateEgale(
						lDate,
						aPlageHoraireCreneaux.debutPlage,
					)
				) {
					lMoteurRdv.setPlageHSelonDebutPlage(lDate, aPlageHoraireCreneaux);
					aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			},
			getDisabled() {
				return !aEditable;
			},
		};
	}
	_getInputHeureFinPlageCreneau(aRdv, aPlageHoraireCreneaux, aEditable) {
		let lMoteurRdv = this;
		return {
			getValueInit() {
				return !!aRdv && aPlageHoraireCreneaux
					? ObjetDate_1.GDate.formatDate(
							aPlageHoraireCreneaux.finPlage,
							"%hh:%mm",
						)
					: "";
			},
			exitChange(aValue, aParamsSetter) {
				let lDateFin = aPlageHoraireCreneaux.finPlage;
				const lDate = new Date(
					lDateFin.getFullYear(),
					lDateFin.getMonth(),
					lDateFin.getDate(),
					aParamsSetter.time.heure,
					aParamsSetter.time.minute,
				);
				if (
					!ObjetDate_1.GDate.estDateEgale(lDate, aPlageHoraireCreneaux.finPlage)
				) {
					lMoteurRdv.setPlageHSelonFinPlage(lDate, aPlageHoraireCreneaux);
					aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			},
			getDisabled() {
				return !aEditable;
			},
		};
	}
	_getComboModalitePlageCreneau(
		aRdv,
		aPlageHoraireCreneaux,
		aEditable,
		aListeModalites,
	) {
		return {
			init: function (aCombo) {
				aCombo.setOptionsObjetSaisie({
					estLargeurAuto: false,
					avecTriListeElements: false,
					celluleAvecTexteHtml: true,
					labelWAICellule:
						ObjetTraduction_1.GTraductions.getValeur("RDV.TypeRDV"),
					required: true,
				});
			},
			getDonnees: function (aDonnees) {
				if (!aDonnees) {
					return aListeModalites;
				}
			},
			getIndiceSelection: function () {
				let lIndice = 0;
				if (aPlageHoraireCreneaux.modalite) {
					lIndice = aListeModalites.getIndiceElementParFiltre((D) => {
						return D.Genre === aPlageHoraireCreneaux.modalite;
					});
				}
				return Math.max(lIndice, 0);
			},
			event: function (aParametres) {
				if (
					aParametres.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					!!aParametres.element &&
					aPlageHoraireCreneaux.modalite !== aParametres.element.Genre
				) {
					aPlageHoraireCreneaux.modalite = aParametres.element.Genre;
					aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aPlageHoraireCreneaux.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			},
			getDisabled() {
				return !aEditable;
			},
		};
	}
	_getLocalisationPlageCreneau(
		aInstance,
		aRdv,
		aPlageHoraireCreneaux,
		aListeSallesLieux,
	) {
		let lMoteurRdv = this;
		return {
			getIcone() {
				let lIcon = lMoteurRdv.getIconLieuRdv();
				return IE.jsx.str("i", { class: lIcon, "aria-hidden": "true" });
			},
			getLibelle: function () {
				if (aPlageHoraireCreneaux && aPlageHoraireCreneaux.lieu) {
					return aPlageHoraireCreneaux.lieu.getLibelle();
				} else {
					return ObjetTraduction_1.GTraductions.getValeur(
						"RDV.choisirSalleLieux",
					);
				}
			},
			event() {
				let lFenetreselectionSalleLieu =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SelectionSalleLieu_js_1.ObjetFenetre_SelectionSalleLieu,
						{
							pere: aInstance,
							evenement: function (
								aGenreRessource,
								aListeRessourcesSelectionnees,
							) {
								let lNbLieux = aListeRessourcesSelectionnees.count();
								if (lNbLieux === 1) {
									aPlageHoraireCreneaux.lieu =
										aListeRessourcesSelectionnees.get(0);
								} else if (lNbLieux === 0) {
									aPlageHoraireCreneaux.lieu = null;
								} else {
								}
								aPlageHoraireCreneaux.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
								aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							},
							initialiser: (aInstance) => {
								const lparamsListe = {
									skin: ObjetListe_1.ObjetListe.skin.flatDesign,
									optionsListe: {
										skin: ObjetListe_1.ObjetListe.skin.flatDesign,
									},
								};
								const lTitre = ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.FenetreSelectionLieu_Titre",
								);
								aInstance.paramsListe = lparamsListe;
								aInstance.setOptionsFenetre({
									titre: lTitre,
									largeur: 450,
									hauteur: 450,
									hauteurMaxContenu: 720,
									avecScroll: true,
									listeBoutons: [
										ObjetTraduction_1.GTraductions.getValeur("Fermer"),
									],
								});
							},
						},
					);
				lFenetreselectionSalleLieu.setDonnees({
					listeRessources: aListeSallesLieux,
					listeRessourcesSelectionnees:
						aPlageHoraireCreneaux && aPlageHoraireCreneaux.lieu
							? new ObjetListeElements_1.ObjetListeElements().add(
									aPlageHoraireCreneaux.lieu,
								)
							: new ObjetListeElements_1.ObjetListeElements(),
					avecMonoSelection: true,
				});
			},
			getDisabled() {
				return (
					!aPlageHoraireCreneaux ||
					aPlageHoraireCreneaux.modalite !==
						TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Presentiel
				);
			},
		};
	}
	_getIdentiteDateCreneau(aInstance, aRdv, aCreneau, aCreneauEditable) {
		return {
			class: ObjetCelluleDate_1.ObjetCelluleDate,
			pere: aInstance,
			init(aInstanceDate) {
				aInstanceDate.setOptionsObjetCelluleDate({
					ariaDescription: ObjetTraduction_1.GTraductions.getValeur("Date"),
					required: true,
				});
			},
			start(aInstanceDate) {
				if (!aRdv || !aCreneau) {
					return;
				}
				aInstanceDate.setPremiereDateSaisissable(ObjetDate_1.GDate.aujourdhui);
				aInstanceDate.setDonnees(aCreneau.debut);
				aInstanceDate.setActif(aCreneauEditable);
			},
			evenement(aDate) {
				if (!ObjetDate_1.GDate.estDateEgale(aDate, aCreneau.debut)) {
					aDate.setHours(
						aCreneau.debut.getHours(),
						aCreneau.debut.getMinutes(),
					);
					aCreneau.debut = aDate;
					aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aCreneau.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			},
		};
	}
	_getInputHeureDebCreneau(aRdv, aCreneau, aCreneauEditable) {
		return {
			getValueInit() {
				return !!aRdv && aCreneau
					? ObjetDate_1.GDate.formatDate(aCreneau.debut, "%hh:%mm")
					: "";
			},
			exitChange(aValue, aParamsSetter) {
				const lDate = new Date(
					aCreneau.debut.getFullYear(),
					aCreneau.debut.getMonth(),
					aCreneau.debut.getDate(),
					aParamsSetter.time.heure,
					aParamsSetter.time.minute,
				);
				if (!ObjetDate_1.GDate.estDateEgale(lDate, aCreneau.debut)) {
					aCreneau.debut = lDate;
					aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aCreneau.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			},
			getDisabled() {
				return !aCreneauEditable;
			},
		};
	}
	_getComboModalite(aRdv, aCreneau, aCreneauEditable, aListeModalites) {
		return {
			init: function (aCombo) {
				aCombo.setOptionsObjetSaisie({
					estLargeurAuto: false,
					avecTriListeElements: false,
					celluleAvecTexteHtml: true,
					labelWAICellule:
						ObjetTraduction_1.GTraductions.getValeur("RDV.TypeRDV"),
					required: true,
				});
			},
			getDonnees: function (aDonnees) {
				if (!aDonnees) {
					return aListeModalites;
				}
			},
			getIndiceSelection: function () {
				let lIndice = 0;
				if (aCreneau.modalite) {
					lIndice = aListeModalites.getIndiceElementParFiltre((D) => {
						return D.Genre === aCreneau.modalite;
					});
				}
				return Math.max(lIndice, 0);
			},
			event: function (aParametres) {
				if (
					aParametres.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					!!aParametres.element &&
					aCreneau.modalite !== aParametres.element.Genre
				) {
					aCreneau.modalite = aParametres.element.Genre;
					aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aCreneau.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			},
			getDisabled() {
				return !aCreneauEditable;
			},
		};
	}
	_getChipsHeureCreneauPropose(aInstance, aRdv, aOptions) {
		let lMoteurRdv = this;
		return {
			eventBtn: (aNumeroCreneau) => {
				let lCreneau =
					aRdv.session.listeCreneauxProposes.getElementParNumero(
						aNumeroCreneau,
					);
				if (lCreneau) {
					lCreneau.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					aRdv.session.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			},
			getOptions(aNumeroCreneau) {
				let lCreneau =
					aRdv.session.listeCreneauxProposes.getElementParNumero(
						aNumeroCreneau,
					);
				return {
					avecBtn:
						aOptions.avecSuppressionCreneau &&
						(!lMoteurRdv.estUnRdvEnSerie(aRdv) ||
							(lCreneau &&
								(!lMoteurRdv.estCreneauOccupe(lCreneau) ||
									lCreneau.estSupprimable === true))),
				};
			},
			getDisabled: function (aNumeroCreneau) {
				return false;
			},
			getTitle(aNumeroCreneau) {
				let lCreneau =
					aRdv.session.listeCreneauxProposes.getElementParNumero(
						aNumeroCreneau,
					);
				return lCreneau ? lMoteurRdv._getTitleCreneau(lCreneau) : "";
			},
		};
	}
	_getTitleCreneau(aCreneau) {
		let lStrHint = "";
		switch (aCreneau.etat) {
			case TypesRDV_2.TypeEtatCreneauSessionRDV.tecsrdv_Occupe:
				lStrHint = ObjetTraduction_1.GTraductions.getValeur("RDV.occupe");
				break;
			case TypesRDV_2.TypeEtatCreneauSessionRDV.tecsrdv_Refuse:
				lStrHint = ObjetTraduction_1.GTraductions.getValeur("RDV.refuse");
				break;
			default:
				if (this.estCreneauPasse(aCreneau)) {
					lStrHint = ObjetTraduction_1.GTraductions.getValeur("RDV.expire");
				} else {
					lStrHint =
						aCreneau.modalite !==
						TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Presentiel
							? TypesRDV_5.TypeModaliteCreneauRDVUtil.getStr(aCreneau.modalite)
							: aCreneau.lieu
								? aCreneau.lieu.getLibelle()
								: "";
				}
				break;
		}
		return lStrHint;
	}
	_getConfirmSurChoixCreneau(aRdv, aOptions) {
		let lControleur = {};
		const lMessage = [];
		let lEstRdvTelephonique = this.estCreneauTelephonique(aRdv.creneau);
		let lStrLabel = lEstRdvTelephonique
			? ObjetTraduction_1.GTraductions.getValeur(
					"RDV.confirmChoixCreneau_CtxRdvTel",
					[this.strResponsableRdv(aRdv, false)],
				)
			: "";
		let lLeProfPeutVoirInfosParent = aRdv.respRdvPeutVoirInfoPublic;
		lMessage.push(
			ObjetTraduction_1.GTraductions.getValeur("RDV.strConfirmChoixCreneau", [
				ObjetDate_1.GDate.formatDate(aRdv.creneau.debut, "%JJJ %JJ %MMM"),
				ObjetDate_1.GDate.formatDate(aRdv.creneau.debut, "%hh%sh%mm"),
			]),
		);
		if (lEstRdvTelephonique || lLeProfPeutVoirInfosParent) {
			lMessage.push("<br/>", "<br/>");
			lMessage.push(
				this.composeSectionTelephone(
					lControleur,
					aRdv,
					false,
					lStrLabel,
					["section"],
					["m-bottom"],
				),
			);
		}
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: lMessage.join(""),
			callback: function (aGenreAction) {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					if (
						lEstRdvTelephonique &&
						(aRdv.telephone === undefined ||
							aRdv.telephone === null ||
							aRdv.telephone === "")
					) {
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"RDV.telObligatoirePourRdvTel",
							),
							callback: () => {
								aOptions.clbckSurAnnuler();
							},
						});
					} else {
						aOptions.clbckSurValider();
					}
				} else {
					aOptions.clbckSurAnnuler();
				}
			},
			controleur: lControleur,
		});
	}
	_getRadioSelectionCreneau(aInstance, aRdv, aOptions) {
		let lMoteurRdv = this;
		return {
			getValue: function (aNumeroCreneau) {
				return aRdv.creneau !== null && aRdv.creneau !== undefined
					? aNumeroCreneau === aRdv.creneau.getNumero()
					: false;
			},
			setValue: function (aNumeroCreneau) {
				let lCreneau =
					aRdv.session.listeCreneauxProposes.getElementParNumero(
						aNumeroCreneau,
					);
				if (lCreneau) {
					aRdv.creneau = lCreneau;
					aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					lMoteurRdv._getConfirmSurChoixCreneau(aRdv, aOptions);
				}
			},
			getDisabled: function (aNumeroCreneau) {
				return false;
			},
		};
	}
	_getLocalisation(aInstance, aRdv, aCreneau, aListeSallesLieux) {
		let lMoteurRdv = this;
		return {
			getIcone() {
				let lIcon = lMoteurRdv.getIconLieuRdv();
				return IE.jsx.str("i", { class: lIcon, "aria-hidden": "true" });
			},
			getLibelle: function () {
				if (aCreneau && aCreneau.lieu) {
					return aCreneau.lieu.getLibelle();
				} else {
					return ObjetTraduction_1.GTraductions.getValeur(
						"RDV.choisirSalleLieux",
					);
				}
			},
			event() {
				let lFenetreselectionSalleLieu =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SelectionSalleLieu_js_1.ObjetFenetre_SelectionSalleLieu,
						{
							pere: aInstance,
							evenement: function (
								aGenreRessource,
								aListeRessourcesSelectionnees,
							) {
								let lNbLieux = aListeRessourcesSelectionnees.count();
								if (lNbLieux === 1) {
									aCreneau.lieu = aListeRessourcesSelectionnees.get(0);
								} else if (lNbLieux === 0) {
									aCreneau.lieu = null;
								} else {
								}
								aCreneau.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							},
							initialiser: (aInstance) => {
								const lparamsListe = {
									skin: ObjetListe_1.ObjetListe.skin.flatDesign,
									optionsListe: {
										skin: ObjetListe_1.ObjetListe.skin.flatDesign,
									},
								};
								const lTitre = ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.FenetreSelectionLieu_Titre",
								);
								aInstance.paramsListe = lparamsListe;
								aInstance.setOptionsFenetre({
									titre: lTitre,
									largeur: 450,
									hauteur: 450,
									hauteurMaxContenu: 720,
									avecScroll: true,
									listeBoutons: [
										ObjetTraduction_1.GTraductions.getValeur("Fermer"),
										ObjetTraduction_1.GTraductions.getValeur("Valider"),
									],
								});
							},
						},
					);
				lFenetreselectionSalleLieu.setDonnees({
					listeRessources: aListeSallesLieux,
					listeRessourcesSelectionnees:
						aCreneau && aCreneau.lieu
							? new ObjetListeElements_1.ObjetListeElements().add(aCreneau.lieu)
							: new ObjetListeElements_1.ObjetListeElements(),
					avecMonoSelection: true,
				});
			},
			getDisabled() {
				return (
					!aCreneau ||
					aCreneau.modalite !==
						TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Presentiel
				);
			},
		};
	}
	_getHtmlSectionTelNonEditable(aRdv) {
		let lStrTelAvecInd = ObjetChaine_1.GChaine.formatTelephoneAvecIndicatif(
			aRdv.indTelephone,
			aRdv.telephone,
		);
		let lStrTelOnly = ObjetChaine_1.GChaine.formatTelephone(aRdv.telephone);
		let lStrTelAvecEspaces = ObjetChaine_1.GChaine.geStrTelephoneAvecEspaces(
			aRdv.telephone,
		);
		let lStrAff = IE.estMobile
			? lStrTelOnly
			: aRdv.indTelephone
				? `(+${aRdv.indTelephone}) ${lStrTelAvecEspaces}`
				: lStrTelAvecEspaces;
		return aRdv.telephone
			? IE.jsx.str(
					"div",
					{ class: ["lien-communication tel-mobile as-flex"] },
					IE.jsx.str("a", { href: "tel:" + lStrTelAvecInd }, lStrAff),
				)
			: this.getHtmlNonRenseignee(false);
	}
	_getIndTelCible(aRdv) {
		return {
			getValue: function () {
				return aRdv && aRdv.indTelephone ? aRdv.indTelephone : "";
			},
			setValue: function (aValue) {
				aRdv.indTelephone = aValue;
				aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			},
			getDisabled() {
				return false;
			},
		};
	}
	_getTelCible(aRdv) {
		return {
			getValue: function () {
				return aRdv && aRdv.telephone ? aRdv.telephone : "";
			},
			setValue: function (aValue) {
				aRdv.telephone = aValue;
				aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			},
			getDisabled() {
				return false;
			},
		};
	}
	_getHtmlSectionTelEditable(aControleur, aRdv, aIdTel) {
		aControleur["indTelCible"] = this._getIndTelCible(aRdv);
		aControleur["telCible"] = this._getTelCible(aRdv);
		return IE.jsx.str(
			"div",
			{ class: "flex-contain" },
			IE.jsx.str("input", {
				"ie-model": "indTelCible",
				class: "round-style m-right ",
				"ie-indicatiftel": true,
				type: "text",
				tabindex: "0",
				title: ObjetTraduction_1.GTraductions.getValeur(
					"RDV.titleIndicatifTel",
				),
			}),
			IE.jsx.str("input", {
				id: aIdTel,
				"ie-model": "telCible",
				class: "round-style",
				"ie-telephone": true,
				type: "text",
				tabindex: "0",
				title: ObjetTraduction_1.GTraductions.getValeur("RDV.titleTelephone"),
			}),
		);
	}
	composeTelNonEditable(aRdv) {
		if (
			!this.existeCreneauPourRdv(aRdv) ||
			this.estRdvAnnule(aRdv) ||
			!this.estCreneauTelephonique(aRdv.creneau) ||
			!aRdv.telephone ||
			!this.estCtxResponsableDeRDV()
		) {
			return "";
		}
		return this._getHtmlSectionTelNonEditable(aRdv);
	}
	composeSectionTelephone(
		aControleur,
		aRdv,
		aNonEditable,
		aStrLabel,
		aCss,
		aCssLabel,
	) {
		let lEstRdvAnnule = this.estRdvAnnule(aRdv);
		let lEstRdvRefuse = this.estRdvRefuse(aRdv);
		let lAvecWarning =
			this.existeCreneauPourRdv(aRdv) &&
			this.estCreneauTelephonique(aRdv.creneau) &&
			!aRdv.telephone &&
			!lEstRdvAnnule;
		let lIdTel = GUID_1.GUID.getId();
		let lCssLabel = aCssLabel.concat([""]);
		let lLabel =
			aStrLabel !== ""
				? aStrLabel
				: aRdv.estResponsableRDV
					? ObjetTraduction_1.GTraductions.getValeur("RDV.telCtxResp", [
							this.getStrInterlocuteurRdv(aRdv, false),
						])
					: ObjetTraduction_1.GTraductions.getValeur("RDV.telCtxCible");
		return IE.jsx.str(
			"div",
			{ class: aCss },
			IE.jsx.str(
				"label",
				{ for: !aRdv.estResponsableRDV ? lIdTel : "", class: lCssLabel },
				lAvecWarning
					? IE.jsx.str("i", {
							class: ["icon", "icon_warning_sign", "m-right-l"],
							"aria-hidden": "true",
						})
					: "",
				IE.jsx.str("span", null, lLabel),
			),
			aNonEditable || aRdv.estResponsableRDV || lEstRdvAnnule || lEstRdvRefuse
				? this._getHtmlSectionTelNonEditable(aRdv)
				: this._getHtmlSectionTelEditable(aControleur, aRdv, lIdTel),
		);
	}
	getHtmlResumeRDV(aRdv) {
		let lEleveConcerne = this.getStrEleveConcerneRdv(aRdv);
		let lEstCtxPresenceDemandee = this.estCtxPresenceDemandeeAuRdv(aRdv);
		let lStrParticipants = lEstCtxPresenceDemandee
			? this.strParticipantsRdv(aRdv, ", ")
			: "";
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: ["rdv-resume"] },
				IE.jsx.str(
					"div",
					{ class: ["rdv-intitule"] },
					IE.jsx.str(
						"div",
						{ class: ["rdv-titre"] },
						this.getStrInterlocuteurRdv(aRdv, true),
					),
					lEleveConcerne && !lEstCtxPresenceDemandee
						? IE.jsx.str(
								"div",
								{ class: ["rdv-titre"] },
								ObjetTraduction_1.GTraductions.getValeur("RDV.concernantX", [
									lEleveConcerne,
								]),
							)
						: "",
					lEstCtxPresenceDemandee
						? IE.jsx.str(
								"div",
								{ class: ["rdv-titre"] },
								ObjetTraduction_1.GTraductions.getValeur("RDV.ParticipantsX", [
									lStrParticipants,
								]),
							)
						: "",
				),
			),
		);
	}
	_getMotifAnnulationRdv(aInstance, aRdv) {
		return {
			getValue: function () {
				return aRdv ? aRdv.motifRefusAnnulation : "";
			},
			setValue: function (aValue) {
				if (aRdv && aRdv.motifRefusAnnulation !== aValue) {
					aRdv.motifRefusAnnulation = aValue;
					aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			},
			getDisabled() {
				return false;
			},
		};
	}
	_composeAnnulationRefusRdv(aInstance, aRdv, aStrLabelMotif) {
		aInstance.controleur["motifAnnulationRdv"] = this._getMotifAnnulationRdv(
			aInstance,
			aRdv,
		);
		let lIdMotifAnnulation = GUID_1.GUID.getId();
		return IE.jsx.str(
			"div",
			{ class: "FenetreEditionRDV" },
			IE.jsx.str(
				"div",
				{ class: "field-contain label-up contenuRDV" },
				IE.jsx.str(
					"label",
					{ for: lIdMotifAnnulation, class: "ie-titre-petit m-top-xl" },
					aStrLabelMotif,
				),
				IE.jsx.str("ie-textareamax", {
					"ie-model": "motifAnnulationRdv",
					id: lIdMotifAnnulation,
					"ie-compteurmax": MoteurRDV.C_TailleMotifRefusAnnulationRdv,
					maxlength: MoteurRDV.C_TailleMotifRefusAnnulationRdv,
					class: "m-top full-size",
				}),
			),
		);
	}
	composeDetailPublicSerie(aInstance, aRdv) {
		if (!aRdv || !aRdv.estRdvSessionSerie) {
			return "";
		}
		const H = [];
		let lEstRdvEnEtatCreation =
			aRdv.Etat === Enumere_Etat_1.EGenreEtat.Creation;
		if (lEstRdvEnEtatCreation) {
			if (
				(aRdv.session.natureRDV === TypesRDV_4.TypeNatureRDV.tNRDV_EnSerie &&
					(aRdv.tabFamillesParticipantRDV === null ||
						aRdv.tabFamillesParticipantRDV === undefined)) ||
				(aRdv.session.natureRDV ===
					TypesRDV_4.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes &&
					(aRdv.listeParticipantsSerie === null ||
						aRdv.listeParticipantsSerie === undefined))
			) {
				lEstRdvEnEtatCreation = false;
			}
		}
		if (lEstRdvEnEtatCreation) {
			if (this.estRdvImpose(aRdv) && aRdv.listeParticipantsSerie) {
				H.push("<ul>");
				aRdv.listeParticipantsSerie.parcourir((aEleve) => {
					H.push(IE.jsx.str("li", { class: "m-top-xl" }, aEleve.getLibelle()));
				});
				H.push("</ul>");
			} else if (
				aRdv &&
				aRdv.tabFamillesParticipantRDV !== null &&
				aRdv.tabFamillesParticipantRDV !== undefined
			) {
				H.push("<ul>");
				aRdv.tabFamillesParticipantRDV.forEach((aFamille) => {
					H.push(
						IE.jsx.str(
							"li",
							{ class: "m-top-xl" },
							this.strParticipants(aFamille.listeParticipantRDV, ", ") +
								(aFamille.eleveConcerne
									? " - " +
										ObjetTraduction_1.GTraductions.getValeur(
											"RDV.concernantX",
											[this.getStrEleveConcerne(aFamille.eleveConcerne)],
										)
									: ""),
						),
					);
				});
				H.push("</ul>");
			}
		} else {
			if (this.estRdvImpose(aRdv)) {
				if (aRdv.listeParticipantsSansCreneau.count() > 0) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "semi-bold m-top-xl" },
							ObjetTraduction_1.GTraductions.getValeur(
								"RDV.listeParticipantsPasReserve",
								[aRdv.listeParticipantsSansCreneau.count()],
							),
						),
					);
					H.push("<ul>");
					aRdv.listeParticipantsSansCreneau.parcourir((aParticipant) => {
						H.push(
							IE.jsx.str(
								"li",
								{ class: "m-top-xl" },
								aParticipant.getLibelle(),
							),
						);
					});
					H.push("</ul>");
				}
				if (aRdv.listeParticipantsAyantCreneau.count() > 0) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: ["semi-bold", "m-top-xl"] },
							ObjetTraduction_1.GTraductions.getValeur(
								"RDV.listeParticipantsReserve",
								[aRdv.listeParticipantsAyantCreneau.count()],
							),
						),
					);
					H.push("<ul>");
					aRdv.listeParticipantsAyantCreneau.parcourir((aParticipant) => {
						H.push(
							IE.jsx.str(
								"li",
								{ class: "m-top-xl" },
								aParticipant.getLibelle(),
							),
						);
					});
					H.push("</ul>");
				}
			} else {
				if (
					aRdv.tabFamillesParticipantsSansCreneau &&
					aRdv.tabFamillesParticipantsSansCreneau.length > 0
				) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "semi-bold m-top-xl" },
							ObjetTraduction_1.GTraductions.getValeur(
								"RDV.listeParticipantsPasReserve",
								[aRdv.tabFamillesParticipantsSansCreneau.length],
							),
						),
					);
					H.push("<ul>");
					aRdv.tabFamillesParticipantsSansCreneau.forEach((aFamille) => {
						H.push(
							IE.jsx.str(
								"li",
								{ class: "m-top-xl" },
								this.strParticipants(aFamille.listeParticipantRDV, ", ") +
									(aFamille.eleveConcerne
										? " - " +
											ObjetTraduction_1.GTraductions.getValeur(
												"RDV.concernantX",
												[this.getStrEleveConcerne(aFamille.eleveConcerne)],
											)
										: ""),
							),
						);
					});
					H.push("</ul>");
				}
				if (
					aRdv.tabFamillesParticipantsAyantCreneau &&
					aRdv.tabFamillesParticipantsAyantCreneau.length > 0
				) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: ["semi-bold", "m-top-xl"] },
							ObjetTraduction_1.GTraductions.getValeur(
								"RDV.listeParticipantsReserve",
								[aRdv.tabFamillesParticipantsAyantCreneau.length],
							),
						),
					);
					H.push("<ul>");
					aRdv.tabFamillesParticipantsAyantCreneau.forEach((aFamille) => {
						H.push(
							IE.jsx.str(
								"li",
								{ class: "m-top-xl" },
								this.strParticipants(aFamille.listeParticipantRDV, ", ") +
									(aFamille.eleveConcerne
										? " - " +
											ObjetTraduction_1.GTraductions.getValeur(
												"RDV.concernantX",
												[this.getStrEleveConcerne(aFamille.eleveConcerne)],
											)
										: ""),
							),
						);
					});
					H.push("</ul>");
				}
			}
		}
		return H.join("");
	}
	composeAnnulationRdv(aInstance, aRdv) {
		return this._composeAnnulationRefusRdv(
			aInstance,
			aRdv,
			ObjetTraduction_1.GTraductions.getValeur("RDV.signalerMotifAnnulation"),
		);
	}
	composeRefusRdv(aInstance, aRdv) {
		return this._composeAnnulationRefusRdv(
			aInstance,
			aRdv,
			ObjetTraduction_1.GTraductions.getValeur("RDV.signalerMotifRefusRdv"),
		);
	}
	composeSelectionPlageCreneau(
		aInstance,
		aRdv,
		aPlageHoraireCreneaux,
		aCreneauEditable,
		aListeModalites,
		aListeSallesLieux,
	) {
		let lMoteurRdv = this;
		let lIdSelectLocalisation = GUID_1.GUID.getId();
		let lIdLabelComboModalite = GUID_1.GUID.getId();
		aInstance.controleur["getIdentiteDatePlageCreneau"] = function () {
			return lMoteurRdv._getIdentiteDatePlageCreneau(
				aInstance,
				aRdv,
				aPlageHoraireCreneaux,
				aCreneauEditable,
			);
		};
		aInstance.controleur["inputHeureDebPlageCreneau"] =
			lMoteurRdv._getInputHeureDebPlageCreneau(
				aRdv,
				aPlageHoraireCreneaux,
				aCreneauEditable,
			);
		aInstance.controleur["inputHeureFinPlageCreneau"] =
			lMoteurRdv._getInputHeureFinPlageCreneau(
				aRdv,
				aPlageHoraireCreneaux,
				aCreneauEditable,
			);
		aInstance.controleur["comboModalitePlageCreneau"] =
			lMoteurRdv._getComboModalitePlageCreneau(
				aRdv,
				aPlageHoraireCreneaux,
				aCreneauEditable,
				aListeModalites,
			);
		aInstance.controleur["localisationPlageCreneau"] =
			lMoteurRdv._getLocalisationPlageCreneau(
				aInstance,
				aRdv,
				aPlageHoraireCreneaux,
				aListeSallesLieux,
			);
		aInstance.controleur["getHtmlInfosCreneaux"] =
			lMoteurRdv._getHtmlInfosCreneaux(aPlageHoraireCreneaux);
		let lLegende = this.composeLegendeRdv({
			avecCreneauxOccupes: false,
			avecCreneauTel: false,
			avecChampsObl: true,
		});
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: ["field-contain", "in-row"] },
				IE.jsx.str(
					"label",
					{ class: "ie-titre-petit" },
					ObjetTraduction_1.GTraductions.getValeur("Date"),
				),
				IE.jsx.str("div", { "ie-identite": "getIdentiteDatePlageCreneau" }),
			),
			IE.jsx.str(
				"div",
				{ class: ["field-contain", "label-up"] },
				IE.jsx.str(
					"label",
					{ class: "ie-titre-petit m-bottom-xl champ-requis" },
					ObjetTraduction_1.GTraductions.getValeur("RDV.plageDispo"),
				),
				IE.jsx.str(
					"div",
					{ class: ["flex-contain", "flex-center", "flex-gap"] },
					IE.jsx.str(
						"span",
						null,
						ObjetTraduction_1.GTraductions.getValeur("De"),
					),
					IE.jsx.str("input", {
						required: true,
						type: "time",
						"ie-model": "inputHeureDebPlageCreneau",
						class: "round-style like-input",
						"aria-label":
							ObjetTraduction_1.GTraductions.getValeur("RDV.hDebPlage"),
					}),
					IE.jsx.str(
						"span",
						null,
						ObjetTraduction_1.GTraductions.getValeur("A"),
					),
					IE.jsx.str("input", {
						required: true,
						type: "time",
						"ie-model": "inputHeureFinPlageCreneau",
						class: "round-style like-input",
						"aria-label":
							ObjetTraduction_1.GTraductions.getValeur("RDV.hFinPlage"),
					}),
				),
				IE.jsx.str("div", {
					class: "m-y-l",
					"ie-html": "getHtmlInfosCreneaux",
				}),
			),
			IE.jsx.str(
				"div",
				{ class: ["field-contain", "in-row"] },
				IE.jsx.str(
					"label",
					{ id: lIdLabelComboModalite, class: "ie-titre-petit champ-requis" },
					ObjetTraduction_1.GTraductions.getValeur("RDV.TypeRDV"),
				),
				IE.jsx.str("ie-combo", {
					"ie-model": "comboModalitePlageCreneau",
					"aria-labelledby": lIdLabelComboModalite,
				}),
			),
			IE.jsx.str(
				"div",
				{ class: ["field-contain", "in-row"] },
				IE.jsx.str(
					"label",
					{ id: lIdSelectLocalisation, class: "ie-titre-petit" },
					ObjetTraduction_1.GTraductions.getValeur("RDV.salleLieu"),
				),
				IE.jsx.str("ie-btnselecteur", {
					"ie-model": "localisationPlageCreneau",
					"aria-labelledby": lIdSelectLocalisation,
				}),
			),
			lLegende,
		);
	}
	composeSelectionCreneau(
		aInstance,
		aRdv,
		aCreneau,
		aCreneauEditable,
		aListeModalites,
		aListeSallesLieux,
		aAvecLegendeObl,
	) {
		let lMoteurRdv = this;
		let lIdSelectLocalisation = GUID_1.GUID.getId();
		let lIdLabelComboModalite = GUID_1.GUID.getId();
		aInstance.controleur["getIdentiteDateCreneau"] = function () {
			return lMoteurRdv._getIdentiteDateCreneau(
				aInstance,
				aRdv,
				aCreneau,
				aCreneauEditable,
			);
		};
		aInstance.controleur["inputHeureDebCreneau"] =
			lMoteurRdv._getInputHeureDebCreneau(aRdv, aCreneau, aCreneauEditable);
		aInstance.controleur["comboModalite"] = lMoteurRdv._getComboModalite(
			aRdv,
			aCreneau,
			aCreneauEditable,
			aListeModalites,
		);
		aInstance.controleur["localisation"] = lMoteurRdv._getLocalisation(
			aInstance,
			aRdv,
			aCreneau,
			aListeSallesLieux,
		);
		let lLegende = this.composeLegendeRdv({
			avecCreneauxOccupes: false,
			avecCreneauTel: false,
			avecChampsObl: aAvecLegendeObl,
		});
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: ["field-contain", "in-row", "no-line"] },
				IE.jsx.str(
					"label",
					{ class: "ie-titre-petit champ-requis" },
					ObjetTraduction_1.GTraductions.getValeur("Date"),
				),
				IE.jsx.str("div", { "ie-identite": "getIdentiteDateCreneau" }),
			),
			IE.jsx.str(
				"div",
				{ class: ["field-contain", "in-row", "no-line"] },
				IE.jsx.str(
					"label",
					{ class: "ie-titre-petit champ-requis" },
					ObjetTraduction_1.GTraductions.getValeur("Heure"),
				),
				IE.jsx.str("input", {
					required: true,
					type: "time",
					"ie-model": "inputHeureDebCreneau",
					size: "3",
					class: "round-style real-size",
					"aria-label":
						ObjetTraduction_1.GTraductions.getValeur("RDV.hDebCreneau"),
				}),
			),
			IE.jsx.str(
				"div",
				{ class: ["field-contain", "in-row", "no-line"] },
				IE.jsx.str(
					"label",
					{ id: lIdLabelComboModalite, class: "ie-titre-petit champ-requis" },
					ObjetTraduction_1.GTraductions.getValeur("RDV.TypeRDV"),
				),
				IE.jsx.str("ie-combo", {
					"ie-model": "comboModalite",
					"aria-labelledby": lIdLabelComboModalite,
				}),
			),
			IE.jsx.str(
				"div",
				{ class: ["field-contain", "in-row", "no-line"] },
				IE.jsx.str(
					"label",
					{ id: lIdSelectLocalisation, class: "ie-titre-petit" },
					ObjetTraduction_1.GTraductions.getValeur("RDV.salleLieu"),
				),
				IE.jsx.str("ie-btnselecteur", {
					"ie-model": "localisation",
					"aria-labelledby": lIdSelectLocalisation,
				}),
			),
			lLegende,
		);
	}
	composeLegendeRdv(aParam) {
		if (
			!aParam.avecCreneauxOccupes &&
			!aParam.avecCreneauTel &&
			!aParam.avecChampsObl
		) {
			return "";
		}
		return IE.jsx.str(
			"div",
			{ class: ["legend-contain"] },
			IE.jsx.str(
				"div",
				{ class: "legend-titre" },
				ObjetTraduction_1.GTraductions.getValeur("Legende"),
			),
			aParam.avecCreneauTel
				? IE.jsx.str(
						"div",
						{ class: "legend-item" },
						IE.jsx.str("i", {
							class: [
								"icon",
								TypesRDV_5.TypeModaliteCreneauRDVUtil.getIcon(
									TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Telephonique,
								),
							],
							"aria-hidden": "true",
						}),
						IE.jsx.str(
							"span",
							{ "aria-hidden": "true" },
							ObjetTraduction_1.GTraductions.getValeur(
								"RDV.LegendeTelephonique",
							),
						),
					)
				: "",
			aParam.avecCreneauxOccupes
				? IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"div",
							{ class: "legend-item" },
							IE.jsx.str("i", {
								class: ["icon", this.getIconCreneauOccupe()],
								"aria-hidden": "true",
							}),
							IE.jsx.str(
								"span",
								{ "aria-hidden": "true" },
								ObjetTraduction_1.GTraductions.getValeur("RDV.LegendeOccupe"),
							),
						),
						IE.jsx.str(
							"div",
							{ class: "legend-item" },
							IE.jsx.str("i", {
								class: ["icon", this.getIconCreneauPasse()],
								"aria-hidden": "true",
							}),
							IE.jsx.str(
								"span",
								{ "aria-hidden": "true" },
								ObjetTraduction_1.GTraductions.getValeur("RDV.LegendeExpire"),
							),
						),
					)
				: "",
			aParam.avecChampsObl
				? IE.jsx.str(
						"div",
						{ class: "legend-item" },
						IE.jsx.str("span", { class: "icon asterisque" }, "*"),
						IE.jsx.str(
							"span",
							{ "aria-hidden": "true" },
							ObjetTraduction_1.GTraductions.getValeur("RDV.InfoObligatoire"),
						),
					)
				: "",
		);
	}
	getInfosSessionSerieDepuisCreneaux(aListeCreneaux) {
		if (!aListeCreneaux) {
			return;
		}
		let lDeb = null,
			lFin = null;
		let llisteLieux = new ObjetListeElements_1.ObjetListeElements();
		aListeCreneaux.parcourir((aCreneau) => {
			if (aCreneau.lieu !== null && aCreneau.lieu !== undefined) {
				let lIndice = llisteLieux.getIndiceParNumeroEtGenre(
					aCreneau.lieu.getNumero(),
					aCreneau.lieu.getGenre(),
				);
				if (lIndice === null || lIndice === undefined) {
					llisteLieux.addElement(aCreneau.lieu);
				}
			}
			if (lDeb === null && lFin === null) {
				lDeb = aCreneau.debut;
				lFin = aCreneau.debut;
			} else {
				if (
					aCreneau.debut < lDeb &&
					!ObjetDate_1.GDate.estJourEgal(aCreneau.debut, lDeb)
				) {
					lDeb = aCreneau.debut;
				}
				if (
					aCreneau.debut > lFin &&
					!ObjetDate_1.GDate.estJourEgal(aCreneau.debut, lFin)
				) {
					lFin = aCreneau.debut;
				}
			}
		});
		return {
			dateDebSession: lDeb,
			dateFinSession: lFin,
			strLieux: this.getStrLieux(llisteLieux),
		};
	}
	composeCreneauxProposes(aInstance, aRdv, aListeCreneaux, aOptions) {
		if (aListeCreneaux === null || aListeCreneaux === undefined) {
			return;
		}
		aListeCreneaux.setTri([ObjetTri_1.ObjetTri.init("debut")]);
		aListeCreneaux.trier();
		let lDateCourante = null;
		let lListeSections = new ObjetListeElements_1.ObjetListeElements();
		let lSection;
		let lAuMoinsUnCreneauPropose = this.existeAuMoinsUnCreneau(aListeCreneaux);
		let lAucunCreneauReservable =
			this.aucunCreneauNestReservable(aListeCreneaux);
		aListeCreneaux.parcourir((aCreneau) => {
			if (
				(lDateCourante === null ||
					!ObjetDate_1.GDate.estJourEgal(aCreneau.debut, lDateCourante)) &&
				aCreneau.existe()
			) {
				lDateCourante = aCreneau.debut;
				lSection = new ObjetElement_1.ObjetElement(
					ObjetDate_1.GDate.formatDate(aCreneau.debut, "%JJJJ %JJ %MMMM"),
				);
				lSection.date = aCreneau.debut;
				lSection.listeCreneaux = new ObjetListeElements_1.ObjetListeElements();
				lSection.listeCreneaux.addElement(aCreneau);
				lSection.listeLieux = new ObjetListeElements_1.ObjetListeElements();
				if (aCreneau.lieu !== null && aCreneau.lieu !== undefined) {
					lSection.listeLieux.addElement(aCreneau.lieu);
				}
				lListeSections.addElement(lSection);
			} else {
				if (aCreneau.existe()) {
					lSection.listeCreneaux.addElement(aCreneau);
					if (aCreneau.lieu !== null && aCreneau.lieu !== undefined) {
						let lIndice = lSection.listeLieux.getIndiceParNumeroEtGenre(
							aCreneau.lieu.getNumero(),
							aCreneau.lieu.getGenre(),
						);
						if (lIndice === null || lIndice === undefined) {
							lSection.listeLieux.addElement(aCreneau.lieu);
						}
					}
				}
			}
		});
		const H = [];
		let lStrPlusDeCreneauxReservable = this.estCtxResponsableDeRDV()
			? ObjetTraduction_1.GTraductions.getValeur(
					"RDV.plusDeCreneauxReservables",
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"RDV.tousCreneauxProposesOccupesOuExpires",
				);
		if (aOptions.avecChoixCreneau) {
			if (lAuMoinsUnCreneauPropose && lAucunCreneauReservable) {
				H.push(
					IE.jsx.str(
						"div",
						{ class: "TexteRougeFonce" },
						lStrPlusDeCreneauxReservable,
					),
				);
			} else {
				const lHtml = [];
				lListeSections.parcourir((aSection) => {
					if (!this.aucunCreneauNestReservable(aSection.listeCreneaux)) {
						lHtml.push(
							this.composeSectionCreneauxProposes(
								aSection,
								aInstance,
								aRdv,
								aOptions,
							),
						);
					}
				});
				H.push(IE.jsx.str("div", { role: "group" }, lHtml.join("")));
			}
		} else {
			H.push(
				lAuMoinsUnCreneauPropose && lAucunCreneauReservable
					? IE.jsx.str(
							"div",
							{ class: ["m-top-l"] },
							IE.jsx.str(
								"span",
								{ class: "TexteRougeFonce" },
								lStrPlusDeCreneauxReservable,
							),
						)
					: "",
			);
			lListeSections.parcourir((aSection) => {
				H.push(
					this.composeSectionCreneauxProposes(
						aSection,
						aInstance,
						aRdv,
						aOptions,
					),
				);
			});
		}
		return H.join("");
	}
	composeSectionCreneauxProposes(aSection, aInstance, aRdv, aOptions) {
		let lStrLieux = this.getStrLieux(aSection.listeLieux);
		let lNbCreneauxProposes = aOptions.avecChoixCreneau
			? this.nbCreneauxReservables(aSection.listeCreneaux)
			: aSection.listeCreneaux.count();
		return IE.jsx.str(
			"div",
			{ class: "liste-creneaux" },
			IE.jsx.str(
				"label",
				{ class: "ie-titre-petit p-y-l" },
				IE.jsx.str("span", { class: "semi-bold" }, aSection.getLibelle()),
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str("span", null, " - "),
					IE.jsx.str(
						"span",
						null,
						" ",
						ObjetTraduction_1.GTraductions.getValeur("RDV.xCreneaux", [
							lNbCreneauxProposes,
						]),
					),
				),
			),
			IE.jsx.str(
				"div",
				{ class: "chips-contain" },
				aOptions.avecChoixCreneau
					? this.composeEtiquettesChoixCreneau(
							aInstance,
							aRdv,
							aSection.listeCreneaux,
							aOptions,
						)
					: this.composeEtiquettesCreneaux(
							aInstance,
							aRdv,
							aSection.listeCreneaux,
							aOptions,
						),
			),
			lStrLieux !== ""
				? IE.jsx.str(
						"div",
						null,
						IE.jsx.str("i", {
							class: [this.getIconLieuRdv()],
							"aria-hidden": "true",
						}),
						"  ",
						IE.jsx.str("span", null, " ", lStrLieux),
					)
				: "",
		);
	}
	getNbFamillesParticipantSessionSerie(aRdv) {
		let lNbFamillesParticipants = 0;
		if (
			aRdv &&
			aRdv.tabFamillesParticipantRDV !== null &&
			aRdv.tabFamillesParticipantRDV !== undefined
		) {
			lNbFamillesParticipants = aRdv.tabFamillesParticipantRDV.length;
		} else {
			lNbFamillesParticipants = aRdv.nbTotalRdvDeSession;
		}
		return lNbFamillesParticipants;
	}
	getNbElevesParticipantSessionSerie(aRdv) {
		let lNbParticipants = 0;
		let lEstCtxCreation =
			aRdv &&
			aRdv.listeParticipantsSerie !== null &&
			aRdv.listeParticipantsSerie !== undefined;
		if (lEstCtxCreation) {
			lNbParticipants = aRdv.listeParticipantsSerie.count();
		} else {
			lNbParticipants = aRdv.nbTotalRdvDeSession;
		}
		return lNbParticipants;
	}
	getStrLieux(aListeLieux) {
		let lStrLieux = [];
		if (aListeLieux.count() > 0) {
			aListeLieux.parcourir((aLieu) => {
				lStrLieux.push(aLieu.getLibelle());
			});
		}
		return lStrLieux.length > 0 ? lStrLieux.join(", ") : "";
	}
	estAvecChoixCreneau(aRdv) {
		let lEstPropositionEnCours =
			aRdv.etat === TypesRDV_3.TypeEtatRDV.terdv_PropositionEnCours;
		return lEstPropositionEnCours && !this.estCtxResponsableDeRDV();
	}
	composeEtiquettesChoixCreneau(aInstance, aRdv, aListeCreneaux, aOptions) {
		let lMoteurRdv = this;
		aInstance.controleur["radioSelectionCreneau"] =
			lMoteurRdv._getRadioSelectionCreneau(aInstance, aRdv, aOptions);
		const H = [];
		aListeCreneaux.parcourir((aCreneau) => {
			if (!this.estCreneauOccupe(aCreneau) && !this.estCreneauPasse(aCreneau)) {
				H.push(
					IE.jsx.str(
						"ie-radio",
						{
							name: "radioSelectionCreneau",
							title: this._getTitleCreneau(aCreneau),
							"ie-model": (0, jsx_1.jsxFuncAttr)("radioSelectionCreneau", [
								aCreneau.getNumero(),
							]),
							class: [
								"as-chips",
								"tag-style",
								aCreneau.modalite !==
								TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Presentiel
									? "iconic " +
										TypesRDV_5.TypeModaliteCreneauRDVUtil.getIcon(
											aCreneau.modalite,
										)
									: "",
							],
						},
						ObjetDate_1.GDate.formatDate(aCreneau.debut, "%hh%sh%mm"),
					),
				);
			}
		});
		return H.join("");
	}
	getIconCreneauPasse() {
		return "icon_retour_arriere";
	}
	getIconCreneauOccupe() {
		return "icon_volume_horaire";
	}
	composeEtiquettesCreneaux(aInstance, aRdv, aListeCreneaux, aOptions) {
		let lMoteurRdv = this;
		aInstance.controleur["chipsHeureCreneauPropose"] =
			lMoteurRdv._getChipsHeureCreneauPropose(aInstance, aRdv, aOptions);
		const H = [];
		aListeCreneaux.parcourir((aCreneau) => {
			if (aCreneau.existe()) {
				let lClassIcon = !this.estCreneauLibre(aCreneau)
					? "iconic " + this.getIconCreneauOccupe()
					: this.estCreneauPasse(aCreneau)
						? "iconic " + this.getIconCreneauPasse()
						: aCreneau.modalite !==
								TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Presentiel
							? "iconic " +
								TypesRDV_5.TypeModaliteCreneauRDVUtil.getIcon(aCreneau.modalite)
							: "";
				H.push(
					IE.jsx.str(
						"ie-chips",
						{
							"ie-model": (0, jsx_1.jsxFuncAttr)("chipsHeureCreneauPropose", [
								aCreneau.getNumero(),
							]),
							"ie-title": (0, jsx_1.jsxFuncAttr)(
								"chipsHeureCreneauPropose.getTitle",
								[aCreneau.getNumero()],
							),
							class: [lClassIcon],
						},
						ObjetDate_1.GDate.formatDate(aCreneau.debut, "%hh%sh%mm"),
					),
				);
			}
		});
		return H.join("");
	}
	estCreneauEnConflit(aParam) {
		let lEstCreneauEnConflit = false;
		if (aParam.creneauAVerifier && aParam.listeCreneauxExistant) {
			aParam.listeCreneauxExistant.parcourir((aCreneau) => {
				if (aCreneau.existe()) {
					let lDeb = aCreneau.debut;
					let lFin = new Date(
						lDeb.getTime() +
							UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(aParam.dureeRdv) -
							1,
					);
					if (
						ObjetDate_1.GDate.dateEntreLesDates(
							aParam.creneauAVerifier.debut,
							lDeb,
							lFin,
							true,
						)
					) {
						lEstCreneauEnConflit = true;
						return;
					}
				}
			});
		}
		return lEstCreneauEnConflit;
	}
	ouvrirFenetreSelectionCreneau(
		aInstance,
		aRdv,
		aListeModalites,
		aListeSallesLieux,
	) {
		if (!aRdv || !aRdv.session) {
			return;
		}
		if (
			aRdv.session.listeCreneauxProposes === null ||
			aRdv.session.listeCreneauxProposes === undefined
		) {
			aRdv.session.listeCreneauxProposes =
				new ObjetListeElements_1.ObjetListeElements();
		}
		let lCreneauEnCreation = this.initCreneau();
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				evenement: (aNumeroBouton, aParams) => {
					if (aParams.numeroBouton === 1) {
						let lListeCreneaux = aRdv.session.listeCreneauxProposes;
						if (
							!this.estCreneauEnConflit({
								creneauAVerifier: lCreneauEnCreation,
								listeCreneauxExistant: lListeCreneaux,
								dureeRdv: aRdv.session.duree,
							})
						) {
							lListeCreneaux.addElement(lCreneauEnCreation);
							aRdv.session.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							aRdv.session.dureeCreneauxEnEdition = aRdv.session.duree;
						} else {
							GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"RDV.strCreneauEnConflit",
								),
							});
						}
					}
				},
				initialiser: (aInstance) => {
					aInstance.setOptionsFenetre({
						titre:
							ObjetTraduction_1.GTraductions.getValeur("RDV.ajouterCreneau"),
						largeurMin: 350,
						avecTailleSelonContenu: true,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Fermer"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		);
		return lFenetre.afficher(
			this.composeSelectionCreneau(
				lFenetre,
				aRdv,
				lCreneauEnCreation,
				true,
				aListeModalites,
				aListeSallesLieux,
				true,
			),
		);
	}
	ouvrirFenetreSelectionCreneauxParPlageHoraire(
		aInstance,
		aRdv,
		aListeModalites,
		aListeSallesLieux,
	) {
		if (!aRdv || !aRdv.session) {
			return;
		}
		if (
			aRdv.session.listeCreneauxProposes === null ||
			aRdv.session.listeCreneauxProposes === undefined
		) {
			aRdv.session.listeCreneauxProposes =
				new ObjetListeElements_1.ObjetListeElements();
		}
		let lPlageHoraireCreneaux = this.initPlageHoraireCreneaux(
			aRdv.session.duree,
		);
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				evenement: (aNumeroBouton, aParams) => {
					if (aParams.numeroBouton === 1) {
						let lTabCreneauxEnCreation = this.getCreneauxDepuisPlageHoraire(
							lPlageHoraireCreneaux,
						);
						let lTabCreneauxValides = [];
						for (let i = 0, lNb = lTabCreneauxEnCreation.length; i < lNb; i++) {
							let lCreneau = lTabCreneauxEnCreation[i];
							if (
								!this.estCreneauEnConflit({
									creneauAVerifier: lCreneau,
									listeCreneauxExistant: aRdv.session.listeCreneauxProposes,
									dureeRdv: aRdv.session.duree,
								})
							) {
								lTabCreneauxValides.push(lCreneau);
							}
						}
						let lAvecMsgInfo = false;
						if (lTabCreneauxValides.length < lTabCreneauxEnCreation.length) {
							lAvecMsgInfo = true;
						}
						if (lTabCreneauxValides.length > 0) {
							let lListeCreneaux = aRdv.session.listeCreneauxProposes;
							lListeCreneaux.add(lTabCreneauxValides);
							aRdv.session.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							aRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							aRdv.session.dureeCreneauxEnEdition = aRdv.session.duree;
						}
						if (lAvecMsgInfo) {
							let lNbConflits =
								lTabCreneauxEnCreation.length - lTabCreneauxValides.length;
							GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message:
									lNbConflits === 1
										? ObjetTraduction_1.GTraductions.getValeur(
												"RDV.strCreneauPlageEnConflit",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"RDV.strCreneauxPlageEnConflit",
												[lNbConflits],
											),
							});
						}
					}
				},
				initialiser: (aInstance) => {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"RDV.plageDeCreneaux",
						),
						largeur: 450,
						avecTailleSelonContenu: true,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		);
		return lFenetre.afficher(
			this.composeSelectionPlageCreneau(
				lFenetre,
				aRdv,
				lPlageHoraireCreneaux,
				true,
				aListeModalites,
				aListeSallesLieux,
			),
		);
	}
	avecCmdMenuCtx(aRdv) {
		const lArticleRdv = aRdv;
		const lEstRespRdv = lArticleRdv.estResponsableRDV;
		const lEstCtxPresenceDemandee =
			this.estCtxPresenceDemandeeAuRdv(lArticleRdv);
		const lEstDemande = this.estDemande(lArticleRdv);
		return (
			!GApplication.getModeExclusif() &&
			((lEstRespRdv && !lEstDemande) ||
				(lEstRespRdv && lEstDemande) ||
				(lArticleRdv.etat === TypesRDV_3.TypeEtatRDV.terdv_RDVValide &&
					!lEstCtxPresenceDemandee))
		);
	}
	initCmdMenuCtx(aMenu, aRdv, aClbck) {
		const lMenu = aMenu;
		const lArticleRdv = aRdv;
		const lEstRespRdv = lArticleRdv.estResponsableRDV;
		const lEstRdvAnnulable = this.estRdvAnnulable(lArticleRdv);
		const lEstRdvAnnule = this.estRdvAnnule(lArticleRdv);
		const lEstRdvRefuse = this.estRdvRefuse(lArticleRdv);
		const lEstCtxPresenceDemandee =
			this.estCtxPresenceDemandeeAuRdv(lArticleRdv);
		const lEstRdvValide = this.estRdvValide(lArticleRdv);
		const lEstDemande = this.estDemande(lArticleRdv);
		if (!GApplication.getModeExclusif()) {
			if (lEstRespRdv && !lEstDemande) {
				if (
					!this.estUnRdvEnSerie(lArticleRdv) ||
					lArticleRdv.estRdvSessionSerie ||
					lEstRdvValide
				) {
					lMenu.add(
						ObjetTraduction_1.GTraductions.getValeur("Modifier"),
						lEstRespRdv && !lEstRdvAnnule && !lEstRdvRefuse,
						(aLigneMenu) => {
							aClbck(exports.EGenreCmdCtxRdv.modifierRdv, lArticleRdv);
						},
						{
							icon: "icon_pencil",
							typeAffEnModeMixte:
								Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
						},
					);
				}
				if (lArticleRdv.etat !== TypesRDV_3.TypeEtatRDV.terdv_RDVValide) {
					lMenu.add(
						ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
						lEstRespRdv,
						(aLigneMenu) => {
							aClbck(exports.EGenreCmdCtxRdv.supprimerRdv, lArticleRdv);
						},
						{
							icon: "icon_trash",
							typeAffEnModeMixte:
								Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
						},
					);
				}
			}
			if (lEstRespRdv && lEstDemande) {
				lMenu.add(
					ObjetTraduction_1.GTraductions.getValeur("RDV.accepterRdv"),
					true,
					(aLigneMenu) => {
						aClbck(exports.EGenreCmdCtxRdv.accepterDemandeRdv, lArticleRdv);
					},
					{
						icon: "icon_ok",
						typeAffEnModeMixte:
							Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.bouton,
					},
				);
				lMenu.add(
					ObjetTraduction_1.GTraductions.getValeur("RDV.refuserRdv"),
					true,
					(aLigneMenu) => {
						aClbck(exports.EGenreCmdCtxRdv.refuserDemandeRdv, lArticleRdv);
					},
					{
						icon: "icon_remove",
						typeAffEnModeMixte:
							Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.bouton,
					},
				);
			}
			if (
				lArticleRdv.etat === TypesRDV_3.TypeEtatRDV.terdv_RDVValide &&
				!lEstCtxPresenceDemandee
			) {
				lMenu.add(
					ObjetTraduction_1.GTraductions.getValeur("RDV.annulerRdv"),
					lEstRdvAnnulable,
					(aLigneMenu) => {
						aClbck(exports.EGenreCmdCtxRdv.annulerRdv, lArticleRdv);
					},
					{
						icon: "icon_fermeture_widget",
						typeAffEnModeMixte:
							Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.bouton,
					},
				);
				if (!lEstRespRdv && this.respRdvPeutVoirTelParticipant(aRdv)) {
					lMenu.add(
						ObjetTraduction_1.GTraductions.getValeur("RDV.modifierNumeroRdv"),
						true,
						(aLigneMenu) => {
							aClbck(
								exports.EGenreCmdCtxRdv.modifierRdvCtxNonResp,
								lArticleRdv,
							);
						},
						{
							icon: "icon_pencil",
							typeAffEnModeMixte:
								Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
						},
					);
				}
			}
		}
	}
}
exports.MoteurRDV = MoteurRDV;
MoteurRDV.C_TailleSujetRdv = 100;
MoteurRDV.C_TailleDescriptionRdv = 1000;
MoteurRDV.C_MaxDureeRDV = 1440;
MoteurRDV.C_MinDureeRDV = 1;
MoteurRDV.C_DefaultDureeRDV = 30;
MoteurRDV.C_DefaultDureePlageHoraire = 120;
MoteurRDV.C_TailleMotifRefusAnnulationRdv = 300;
MoteurRDV.C_WidthMaxChipsPJ = 300;
class ObjetRequeteRDV extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		if (aParametres.listeParticipantRDV) {
			aParametres.listeParticipantRDV.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		if (aParametres.listeCreneaux) {
			aParametres.listeCreneaux.setSerialisateurJSON({
				ignorerEtatsElements: false,
				methodeSerialisation: (aElement, aJSONElement) => {
					if (aElement.pourValidation()) {
						aJSONElement.debut = aElement.debut;
						aJSONElement.modalite = aElement.modalite;
						return true;
					} else {
						return false;
					}
				},
			});
		}
		return super.lancerRequete(aParametres);
	}
}
CollectionRequetes_1.Requetes.inscrire("RDV", ObjetRequeteRDV);
class ObjetRequeteSaisieRDV extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParametres) {
		let lEstPourPrimaire = GApplication.getEtatUtilisateur().pourPrimaire();
		Object.assign(this.JSON, aParametres);
		switch (this.JSON.type) {
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_AnnulerRdv: {
				if (!aParametres.rdv) {
					return;
				}
				this.JSON.rdv = this._serialiserAnnulationRefusRdv(aParametres.rdv);
				break;
			}
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_RefuserRdv: {
				if (!aParametres.rdv) {
					return;
				}
				this.JSON.rdv = this._serialiserAnnulationRefusRdv(aParametres.rdv);
				break;
			}
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_CreerRdvCreneauImpose: {
				if (lEstPourPrimaire) {
					return;
				}
				if (
					!aParametres.rdv ||
					!aParametres.rdv.session ||
					!aParametres.rdv.creneau ||
					!aParametres.rdv.listeParticipantRDV
				) {
					return;
				}
				this.JSON.rdv = this._serialiserRdv(aParametres.rdv);
				break;
			}
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_CreerDemandeRdv: {
				if (
					!aParametres.rdv ||
					!aParametres.rdv.session ||
					!aParametres.rdv.session.responsableRDV
				) {
					return;
				}
				this.JSON.rdv = this._serialiserDemandeRdv(aParametres.rdv);
				break;
			}
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_CreerRdvSerieAvecEleves:
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_CreerRdvSerieAvecParents: {
				if (
					lEstPourPrimaire &&
					this.JSON.type ===
						TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_CreerRdvSerieAvecEleves
				) {
					return;
				}
				if (
					!aParametres.rdv ||
					!aParametres.rdv.session ||
					!aParametres.rdv.session.responsableRDV ||
					!aParametres.rdv.session.listeCreneauxProposes
				) {
					return;
				}
				this.JSON.rdv = this._serialiserRdvEnSerie(aParametres.rdv);
				break;
			}
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_EditerSessionRdv: {
				if (
					!aParametres.rdv ||
					!aParametres.rdv.session ||
					(aParametres.rdv.session.natureRDV !==
						TypesRDV_4.TypeNatureRDV.tNRDV_EnSerie &&
						!aParametres.rdv.session.listeCreneauxProposes)
				) {
					return;
				}
				this.JSON.rdv = this._serialiserRdvEnSerie(aParametres.rdv);
				break;
			}
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_EditerRdv: {
				if (
					!aParametres.rdv ||
					!aParametres.rdv.session ||
					(aParametres.rdv.session.natureRDV ===
						TypesRDV_4.TypeNatureRDV.tNRDV_CreneauImpose &&
						!aParametres.rdv.creneau) ||
					(aParametres.rdv.session.natureRDV ===
						TypesRDV_4.TypeNatureRDV.tNRDV_UniqueInitiativePublic &&
						aParametres.rdv.etat === TypesRDV_3.TypeEtatRDV.terdv_RDVValide &&
						!aParametres.rdv.creneau) ||
					(aParametres.rdv.etat !== TypesRDV_3.TypeEtatRDV.terdv_RDVValide &&
						!aParametres.rdv.session.listeCreneauxProposes)
				) {
					return;
				}
				this.JSON.rdv = this._serialiserRdv(aParametres.rdv);
				break;
			}
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_AccepterDemandeRdv: {
				if (
					!aParametres.rdv ||
					!aParametres.rdv.session ||
					!aParametres.rdv.session.listeCreneauxProposes
				) {
					return;
				}
				this.JSON.rdv = this._serialiserDemandeRdvAcceptee(aParametres.rdv);
				break;
			}
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_CreerPropositionRdv: {
				if (
					!aParametres.rdv ||
					!aParametres.rdv.session ||
					!aParametres.rdv.session.listeCreneauxProposes
				) {
					return;
				}
				this.JSON.rdv = this._serialiserPropositionRdv(aParametres.rdv);
				break;
			}
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_ValiderCreneauRdv: {
				if (
					!aParametres.rdv ||
					aParametres.rdv.etat !==
						TypesRDV_3.TypeEtatRDV.terdv_PropositionEnCours ||
					!aParametres.rdv.creneau
				) {
					return;
				}
				this.JSON.rdv = this._serialiserValidationCreneauRdv(aParametres.rdv);
				break;
			}
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_ModifierTelCible: {
				if (!aParametres.rdv) {
					return;
				}
				this.JSON.rdv = this._serialiserModifTelCibleRdv(aParametres.rdv);
				break;
			}
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_SupprimerSessionRdv:
			case TypesRDV_1.TypeRDVCommandeSaisie.rdvcs_SupprimerRdv: {
				if (!aParametres.rdv) {
					return;
				}
				this.JSON.rdv = this._serialiserRdv(aParametres.rdv);
				break;
			}
			default:
		}
		return this.appelAsynchrone();
	}
	_serialiserAnnulationRefusRdv(aRdv) {
		let lRdv = aRdv.toJSON();
		lRdv.motifRefusAnnulation = aRdv.motifRefusAnnulation;
		return lRdv;
	}
	_serialiserRdvEnSerie(aRdv) {
		let lRdv = aRdv.toJSON();
		lRdv.session = this._serialiserSessionRdv(aRdv.session);
		if (
			aRdv.estRdvSessionSerie &&
			aRdv.Etat === Enumere_Etat_1.EGenreEtat.Creation
		) {
			if (aRdv.tabFamillesParticipantRDV) {
				lRdv.tabFamillesParticipantRDV = [];
				aRdv.tabFamillesParticipantRDV.forEach((aFamille) => {
					lRdv.tabFamillesParticipantRDV.push({
						listeParticipantRDV:
							aFamille.listeParticipantRDV.setSerialisateurJSON({
								ignorerEtatsElements: true,
							}),
						eleveConcerne: aFamille.eleveConcerne,
					});
				});
			} else if (aRdv.listeParticipantsSerie) {
				lRdv.listeParticipantsSerie =
					aRdv.listeParticipantsSerie.setSerialisateurJSON({
						ignorerEtatsElements: true,
					});
			}
		}
		return lRdv;
	}
	_serialiserDemandeRdv(aRdv) {
		let lRdv = aRdv.toJSON();
		lRdv.session = this._serialiserSessionRdv(aRdv.session);
		let lParticipantRdv = GEtatUtilisateur.getUtilisateur();
		lRdv.listeParticipantRDV = new ObjetListeElements_1.ObjetListeElements()
			.add(lParticipantRdv)
			.setSerialisateurJSON({ ignorerEtatsElements: true });
		lRdv.telephone = aRdv.telephone;
		lRdv.indTelephone = aRdv.indTelephone;
		return lRdv;
	}
	_serialiserDemandeRdvAcceptee(aRdv) {
		let lRdv = aRdv.toJSON();
		lRdv.session = this._serialiserSessionRdv(aRdv.session);
		if (
			aRdv.listePJ !== null &&
			aRdv.listePJ !== undefined &&
			aRdv.listePJ.count() > 0
		) {
			lRdv.listePJ = aRdv.listePJ;
			lRdv.listePJ.setSerialisateurJSON({
				methodeSerialisation: this._serialiserDocument,
			});
		}
		return lRdv;
	}
	_serialiserPropositionRdv(aRdv) {
		let lRdv = aRdv.toJSON();
		if (aRdv.Etat === Enumere_Etat_1.EGenreEtat.Creation) {
			lRdv.listeParticipantRDV = aRdv.listeParticipantRDV.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
			lRdv.eleveConcerne = aRdv.eleveConcerne;
		}
		lRdv.session = this._serialiserSessionRdv(aRdv.session);
		if (
			aRdv.listePJ !== null &&
			aRdv.listePJ !== undefined &&
			aRdv.listePJ.count() > 0
		) {
			lRdv.listePJ = aRdv.listePJ;
			lRdv.listePJ.setSerialisateurJSON({
				methodeSerialisation: this._serialiserDocument,
			});
		}
		return lRdv;
	}
	_serialiserValidationCreneauRdv(aRdv) {
		let lRdv = aRdv.toJSON();
		lRdv.creneau = aRdv.creneau.toJSON();
		return lRdv;
	}
	_serialiserModifTelCibleRdv(aRdv) {
		let lRdv = aRdv.toJSON();
		lRdv.telephone = aRdv.telephone;
		lRdv.indTelephone = aRdv.indTelephone;
		return lRdv;
	}
	_serialiserDocument(aElement, aJSONElement) {
		const lIdFichier =
			aElement.idFichier !== undefined && aElement.idFichier !== null
				? aElement.idFichier.toString()
				: null;
		if (lIdFichier !== null) {
			aJSONElement.idFichier = lIdFichier;
		}
	}
	_serialiserRdv(aRdv) {
		let lRdv = aRdv.toJSON();
		if (aRdv.Etat === Enumere_Etat_1.EGenreEtat.Creation) {
			lRdv.listeParticipantRDV = aRdv.listeParticipantRDV.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		lRdv.session = this._serialiserSessionRdv(aRdv.session);
		if (aRdv.creneau !== null && aRdv.creneau !== undefined) {
			lRdv.creneau = aRdv.creneau.toJSON();
			this._serialiserCreneauSessionRdv(aRdv.creneau, lRdv.creneau);
		}
		if (
			aRdv.listePJ !== null &&
			aRdv.listePJ !== undefined &&
			aRdv.listePJ.count() > 0
		) {
			lRdv.listePJ = aRdv.listePJ;
			lRdv.listePJ.setSerialisateurJSON({
				methodeSerialisation: this._serialiserDocument,
			});
		}
		return lRdv;
	}
	_serialiserSessionRdv(aSessionRdv) {
		let lSession = aSessionRdv.toJSON();
		if (aSessionRdv.duree) {
			lSession.duree = aSessionRdv.duree;
		}
		lSession.sujet = aSessionRdv.sujet;
		lSession.description = aSessionRdv.description;
		if (aSessionRdv.responsableRDV) {
			lSession.responsableRDV = aSessionRdv.responsableRDV;
		}
		if (aSessionRdv.listeCreneauxProposes) {
			lSession.listeCreneauxProposes =
				aSessionRdv.listeCreneauxProposes.setSerialisateurJSON({
					ignorerEtatsElements: false,
					methodeSerialisation: (aElement, aJSONElement) => {
						if (aElement.pourValidation()) {
							this._serialiserCreneauSessionRdv(aElement, aJSONElement);
							return true;
						} else {
							return false;
						}
					},
				});
		}
		if (
			aSessionRdv.listePJ !== null &&
			aSessionRdv.listePJ !== undefined &&
			aSessionRdv.listePJ.count() > 0
		) {
			lSession.listePJ = aSessionRdv.listePJ;
			lSession.listePJ.setSerialisateurJSON({
				methodeSerialisation: this._serialiserDocument,
			});
		}
		lSession.avecPresenceEleve = aSessionRdv.avecPresenceEleve;
		return lSession;
	}
	_serialiserCreneauSessionRdv(aCreneau, lCreneau) {
		lCreneau.debut = aCreneau.debut;
		lCreneau.modalite = aCreneau.modalite;
		if (
			aCreneau.modalite === TypesRDV_2.TypeModaliteCreneauRDV.tmcrdv_Presentiel
		) {
			if (aCreneau.lieu) {
				lCreneau.lieu = aCreneau.lieu;
			}
		}
	}
}
CollectionRequetes_1.Requetes.inscrire("SaisieRdv", ObjetRequeteSaisieRDV);
