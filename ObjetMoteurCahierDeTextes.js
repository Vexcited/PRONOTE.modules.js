exports.ObjetMoteurCDT = exports.EGenreEvntCdT = void 0;
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const TypeNiveauDifficulte_1 = require("TypeNiveauDifficulte");
const TypeOrigineCreationCategorieCahierDeTexte_1 = require("TypeOrigineCreationCategorieCahierDeTexte");
const ObjetRequeteSaisieCahierDeTextes_1 = require("ObjetRequeteSaisieCahierDeTextes");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const AccessApp_1 = require("AccessApp");
var EGenreEvntCdT;
(function (EGenreEvntCdT) {
	EGenreEvntCdT["publierCdT"] = "publierCdT";
	EGenreEvntCdT["publierDate"] = "publierDate";
	EGenreEvntCdT["copierCdT"] = "copierCdT";
	EGenreEvntCdT["collerCdT"] = "collerCdT";
	EGenreEvntCdT["deleteCdT"] = "deleteCdT";
	EGenreEvntCdT["createContenu"] = "createContenu";
	EGenreEvntCdT["editContenu"] = "editContenu";
	EGenreEvntCdT["deleteContenu"] = "deleteContenu";
	EGenreEvntCdT["createTAF"] = "createTAF";
	EGenreEvntCdT["editTAF"] = "editTAF";
	EGenreEvntCdT["deleteTAF"] = "deleteTAF";
	EGenreEvntCdT["actualiserFicheTAFDuCours"] = "actualiserFicheTAFDuCours";
	EGenreEvntCdT["editNoteProchaineSeance"] = "editNoteProchaineSeance";
	EGenreEvntCdT["editCommentairePrive"] = "editCommentairePrive";
})(EGenreEvntCdT || (exports.EGenreEvntCdT = EGenreEvntCdT = {}));
class ObjetMoteurCDT {
	estContenuVide(aContenu) {
		return (
			this.estContenuSansTitre(aContenu) &&
			!this.estContenuAvecDescriptif(aContenu) &&
			!this.estContenuAvecCategorie(aContenu) &&
			!this.estContenuAvecPJ(aContenu) &&
			!this.estContenuAvecExecQCM(aContenu) &&
			(!(0, AccessApp_1.getApp)().parametresUtilisateur.get(
				"avecGestionDesThemes",
			) ||
				!this.estContenuAvecThemes(aContenu))
		);
	}
	strTitreContenu(aContenu) {
		return aContenu !== null && aContenu !== undefined
			? aContenu.getLibelle()
			: "";
	}
	estContenuSansTitre(aContenu) {
		return this.strTitreContenu(aContenu) === "";
	}
	getCategorieDeContenu(aContenu) {
		return aContenu !== null && aContenu !== undefined
			? aContenu.categorie
			: null;
	}
	estContenuAvecCategorie(aContenu) {
		const lCategorie = this.getCategorieDeContenu(aContenu);
		return (
			lCategorie !== null &&
			lCategorie !== undefined &&
			lCategorie.getNumero() !== 0 &&
			lCategorie.getLibelle() !== ""
		);
	}
	strCategorieContenu(aContenu) {
		const lCategorie = this.getCategorieDeContenu(aContenu);
		return lCategorie !== null && lCategorie !== undefined
			? lCategorie.getLibelle()
			: "";
	}
	strCategorie(aCategorie) {
		return aCategorie !== null && aCategorie !== undefined
			? aCategorie.getLibelle()
			: "";
	}
	estCategorieContenuAvecImg(aContenu) {
		return this.estCategorieAvecImg(aContenu.categorie);
	}
	estCategorieAvecImg(aCategorie) {
		return (
			aCategorie &&
			aCategorie.getGenre() &&
			TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.estTypeAvecIcone(
				aCategorie.getGenre(),
			)
		);
	}
	htmlIconCategorieContenu(aContenu) {
		if (aContenu && aContenu.categorie) {
			return this.htmlIconCategorie(aContenu.categorie);
		}
	}
	htmlIconCategorie(aCategorie) {
		if (aCategorie) {
			const lIcone =
				TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getIcone(
					aCategorie.getGenre(),
				);
			if (lIcone) {
				return `<i class="${lIcone}" role="presentation">${aCategorie.libelleIcone || ""}</i>`;
			}
		}
	}
	estContenuAvecThemes(aContenu) {
		return (
			!!aContenu.ListeThemes &&
			aContenu.ListeThemes.count() &&
			(0, AccessApp_1.getApp)().parametresUtilisateur.get(
				"avecGestionDesThemes",
			)
		);
	}
	strThemesContenu(aContenu) {
		return (
			ObjetTraduction_1.GTraductions.getValeur("Themes") +
			" : " +
			aContenu.ListeThemes.getTableauLibelles().join(", ")
		);
	}
	strDescriptifContenu(aContenu) {
		return aContenu !== null && aContenu !== undefined
			? aContenu.descriptif
			: "";
	}
	estContenuAvecDescriptif(aContenu) {
		return this.strDescriptifContenu(aContenu) !== "";
	}
	textAreaToDescription(aValeur) {
		return "<div>" + aValeur.replace(/\n/g, "<br>\n") + "</div>";
	}
	estContenuAvecPJ(aContenu) {
		return this.getListePJDeContenu(aContenu).getNbrElementsExistes() > 0;
	}
	getListePJDeContenu(aContenu) {
		return aContenu !== null && aContenu !== undefined
			? aContenu.ListePieceJointe
			: new ObjetListeElements_1.ObjetListeElements();
	}
	estContenuAvecExecQCM(aContenu) {
		return this.getListeExecQCMDeContenu(aContenu).getNbrElementsExistes() > 0;
	}
	getListeExecQCMDeContenu(aContenu) {
		return aContenu !== null && aContenu !== undefined
			? aContenu.listeExecutionQCM
			: new ObjetListeElements_1.ObjetListeElements();
	}
	creerContenuParDefaut() {
		const lContenu = new ObjetElement_1.ObjetElement();
		lContenu.Libelle = "";
		lContenu.descriptif = "";
		lContenu.estVide = true;
		lContenu.categorie = new ObjetElement_1.ObjetElement("", 0);
		lContenu.ListePieceJointe = new ObjetListeElements_1.ObjetListeElements();
		lContenu.listeExecutionQCM = new ObjetListeElements_1.ObjetListeElements();
		lContenu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		lContenu.libelleCBTheme = ObjetTraduction_1.GTraductions.getValeur(
			"Theme.libelleCB.contenu",
		);
		return lContenu;
	}
	creerTAFParDefaut(aParam) {
		const lTAF = new ObjetElement_1.ObjetElement();
		lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		Object.assign(lTAF, {
			descriptif: "",
			PourLe:
				aParam && aParam.date
					? aParam.date
					: ObjetDate_1.GDate.getDateCourante(),
			listeEleves: new ObjetListeElements_1.ObjetListeElements(),
			estPourTous: true,
			pourTousLesEleves: true,
			avecMiseEnForme: (0, AccessApp_1.getApp)().parametresUtilisateur.get(
				"CDT.TAF.ActiverMiseEnForme",
			),
			niveauDifficulte: (0, AccessApp_1.getApp)().parametresUtilisateur.get(
				"CDT.TAF.NiveauDifficulte",
			),
			duree: (0, AccessApp_1.getApp)().parametresUtilisateur.get(
				"CDT.TAF.Duree",
			),
			genreRendu: TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_AucunRendu,
			ListePieceJointe: new ObjetListeElements_1.ObjetListeElements(),
			libelleCBTheme: ObjetTraduction_1.GTraductions.getValeur(
				"Theme.libelleCB.taf",
			),
		});
		return lTAF;
	}
	estTAFVide(aTAF) {
		return !this.estTAFAvecDescriptif(aTAF);
	}
	estTAFQCM(aTAF) {
		return !!aTAF.executionQCM;
	}
	estTAFAvecDescriptif(aTAF) {
		return this.strDescriptifTAF(aTAF) !== "";
	}
	strDescriptifTAF(aTAF) {
		let lStr = "";
		if (aTAF !== null && aTAF !== undefined) {
			if (this.estTAFQCM(aTAF)) {
				lStr = this.getTitreExecutionQCM({ execQCM: aTAF.executionQCM });
			} else {
				lStr = aTAF.descriptif;
			}
		}
		return lStr;
	}
	strPourLeTAF(aTAF, aParam) {
		const lAvecTraduc =
			aParam && aParam.avecTraduc !== null && aParam.avecTraduc !== undefined
				? aParam.avecTraduc
				: false;
		const lStr = [];
		if (lAvecTraduc) {
			lStr.push(
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.PourLe") + " ",
			);
		}
		lStr.push(ObjetDate_1.GDate.formatDate(aTAF.PourLe, "%JJJ %J %MMM"));
		return lStr.join("");
	}
	strDonneLeTAF(aTAF, aParam) {
		const lAvecTraduc =
			aParam && aParam.avecTraduc !== null && aParam.avecTraduc !== undefined
				? aParam.avecTraduc
				: false;
		const lStr = [];
		if (lAvecTraduc) {
			lStr.push(
				ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.donneLe") + " ",
			);
		}
		lStr.push(ObjetDate_1.GDate.formatDate(aTAF.DonneLe, " %JJ/%MM"));
		return lStr.join("");
	}
	strModeRenduTAF(aTAF, aOptions) {
		const lStr = [];
		lStr.push(
			aTAF.executionQCM
				? ""
				: TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelle(aTAF.genreRendu),
		);
		if (
			aOptions !== null &&
			aOptions !== undefined &&
			aOptions.avecNbRendu === true &&
			!aTAF.executionQCM
		) {
			lStr.push(" (", aTAF.nbrRendus, "/", aTAF.nbrEleves, ")");
		}
		return lStr.join("");
	}
	strSuiviRenduTAF(aTAF) {
		const lStr = [];
		const lAvecAction = false;
		const lIENode = " ie-node=\"renduTAF('" + aTAF.getNumero() + "')\"";
		const lAction = lAvecAction ? ' class="link" ' + lIENode : "";
		if (lAvecAction) {
			lStr.push("<a ", lAction, ">");
		}
		lStr.push(
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.TAFARendre.RenduPar",
			),
			" ",
			aTAF.nbrRendus,
			"/",
			aTAF.nbrEleves,
		);
		if (lAvecAction) {
			lStr.push("</a>");
		}
		return lStr.join("");
	}
	strSuiviFaitSelonEleves(aTAF) {
		const lStr = [];
		const lAvecAction = false;
		const lIENode = " ie-node=\"renduTAF('" + aTAF.getNumero() + "')\"";
		const lAction = lAvecAction ? ' class="link" ' + lIENode : "";
		if (lAvecAction) {
			lStr.push("<a ", lAction, ">");
		}
		lStr.push(
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.TAFARendre.FaitPar",
			),
			" ",
			aTAF.nbrFaitsSelonEleve,
			"/",
			aTAF.nbrEleves,
		);
		if (lAvecAction) {
			lStr.push("</a>");
		}
		return lStr.join("");
	}
	strPublicTAF(aTAF, aParam) {
		const lLibelleCourt = aParam.avecLibellesCourt === true;
		if (!aTAF || aTAF.estPourTous || aTAF.pourTousLesEleves) {
			return lLibelleCourt
				? ObjetTraduction_1.GTraductions.getValeur("tous")
				: ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.tousLesEleves",
					);
		}
		const lNombresDElevesDeTAF = aTAF.listeEleves
			? aTAF.listeEleves.count()
			: aTAF.nbrEleves;
		const lNbrTotal = aParam.listeTousEleves.count();
		return lLibelleCourt
			? lNombresDElevesDeTAF + "/" + lNbrTotal
			: ObjetChaine_1.GChaine.format(
					lNombresDElevesDeTAF === 1
						? ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.eleve")
						: ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.eleves"),
					[lNombresDElevesDeTAF, lNbrTotal],
				);
	}
	strDureeTAF(aTAF) {
		const lStr = [];
		if (aTAF.duree) {
			const lFormatMin = aTAF.duree > 60 ? "%mm" : "%xm";
			lStr.push(
				ObjetDate_1.GDate.formatDureeEnMillisecondes(
					aTAF.duree * 60 * 1000,
					aTAF.duree > 60 ? "%xh%sh" + lFormatMin : lFormatMin + "mn",
				),
			);
		}
		return lStr.join("");
	}
	estTAFAvecPublic(aTAF) {
		return (
			aTAF.nomPublic !== null &&
			aTAF.nomPublic !== undefined &&
			aTAF.nomPublic !== ""
		);
	}
	estTAFAvecDuree(aTAF) {
		return (
			aTAF.duree !== null &&
			aTAF.duree !== undefined &&
			aTAF.duree !== "" &&
			aTAF.duree !== 0
		);
	}
	estTAFAvecDifficulte(aTAF) {
		return (
			aTAF.niveauDifficulte !== null &&
			aTAF.niveauDifficulte !== undefined &&
			aTAF.niveauDifficulte !== ""
		);
	}
	strDifficulteTAF(aTAF) {
		return TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.typeToStr(
			aTAF.niveauDifficulte,
		);
	}
	htmlIconDifficulteTAF(aTAF, aOptions) {
		return TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.getImage(
			aTAF.niveauDifficulte,
			{ color: aOptions.color, avecTitle: aOptions.avecTitle },
		);
	}
	getListeDifficulte() {
		return TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.toListe(true);
	}
	iconPublicTAF() {
		return "icon_group";
	}
	iconModeRenduTAF() {
		return "icon_arrow_right";
	}
	iconDureeTAF() {
		return "icon_time";
	}
	iconPourLeDonneLeTAF() {
		return "icon_calendar_empty";
	}
	estTAFAvecRendu(aTAF) {
		return !TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estSansRendu(
			aTAF.genreRendu,
		);
	}
	estTAFAvecERendu(aTAF) {
		return TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
			aTAF.genreRendu,
			false,
		);
	}
	iconSuiviRenduTAF() {
		return "icon_inbox";
	}
	getListeModeRendu() {
		const lTabAExclure = [
			TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduKiosque,
		];
		return TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.toListe(lTabAExclure);
	}
	estTAFAvecPJ(aTAF) {
		return this.getListePJDeTAF(aTAF).getNbrElementsExistes() > 0;
	}
	getListePJDeTAF(aTAF) {
		return aTAF !== null && aTAF !== undefined && !aTAF.executionQCM
			? aTAF.ListePieceJointe
			: new ObjetListeElements_1.ObjetListeElements();
	}
	getHtmlCategorie(aCategorie) {
		const H = [];
		H.push('<div style="display:flex; flex-wrap:nowrap; align-items:center;">');
		H.push("<div>", this.strCategorie(aCategorie), "</div>");
		H.push(
			'<div style="margin-left:auto;">',
			this.htmlIconCategorie(aCategorie),
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	formatterDataCdtGeneral(aParams) {
		const lListeCategories = aParams.ListeCategories;
		lListeCategories.parcourir((aCategorie) => {
			if (this.estCategorieAvecImg(aCategorie)) {
				const lHtmlCategorie = this.getHtmlCategorie(aCategorie);
				aCategorie.libelleHtml = lHtmlCategorie;
				aCategorie.libelleHtmlTitre = lHtmlCategorie;
			}
		});
		const lEltAucun = new ObjetElement_1.ObjetElement("", 0);
		const lHtmlAucun =
			"<div>" +
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.CategorieAucune",
			) +
			"</div>";
		lEltAucun.libelleHtml = lHtmlAucun;
		lEltAucun.libelleHtmlTitre = lHtmlAucun;
		lListeCategories.addElement(lEltAucun);
		lListeCategories.trier();
		return aParams;
	}
	async saisieCdT(aParam) {
		var _a, _b;
		const lResult =
			await new ObjetRequeteSaisieCahierDeTextes_1.ObjetRequeteSaisieCahierDeTextes(
				this,
			)
				.addUpload({
					listeFichiers:
						aParam.listeFichiersUpload ||
						new ObjetListeElements_1.ObjetListeElements(),
					listeDJCloud: aParam.listeDocumentsJoints,
				})
				.lancerRequete(
					aParam.cours.getNumero(),
					aParam.numeroSemaine,
					aParam.listeCategories,
					aParam.listeDocumentsJoints,
					aParam.listeModeles,
					new ObjetListeElements_1.ObjetListeElements().addElement(aParam.cdt),
				);
		aParam.clbck({
			contenu:
				(_a = lResult.JSONRapportSaisie) === null || _a === void 0
					? void 0
					: _a.contenu,
			taf:
				(_b = lResult.JSONRapportSaisie) === null || _b === void 0
					? void 0
					: _b.taf,
		});
	}
	getListeTousEleves(aParam) {
		const lListeTousEleves = new ObjetListeElements_1.ObjetListeElements();
		if (aParam.listeClassesEleves) {
			aParam.listeClassesEleves.parcourir((aClasse) => {
				if (!!aClasse.listeEleves) {
					lListeTousEleves.add(aClasse.listeEleves);
				}
			});
		}
		lListeTousEleves.trier();
		return lListeTousEleves;
	}
	getListeSelectionEleves(aParam) {
		let lListeSelectionEleves = new ObjetListeElements_1.ObjetListeElements();
		if (!aParam.listeEleves || aParam.listeEleves.count() === 0) {
			lListeSelectionEleves = MethodesObjet_1.MethodesObjet.dupliquer(
				aParam.listeTousEleves,
			);
		} else {
			aParam.listeEleves.parcourir((D) => {
				const lEleve = MethodesObjet_1.MethodesObjet.dupliquer(D);
				lEleve.Genre = Enumere_Ressource_1.EGenreRessource.Eleve;
				lListeSelectionEleves.addElement(lEleve);
			});
		}
		return lListeSelectionEleves;
	}
	majDataTAFSurModifPublic(aParam) {
		const lTAF = aParam.data;
		let lEstPourTousInitial = lTAF.estPourTous;
		const lListeDetaches = new ObjetListeElements_1.ObjetListeElements();
		const lListeEnCours = new ObjetListeElements_1.ObjetListeElements();
		aParam.listeTousEleves.parcourir((aElement) => {
			if (aElement.estElevesDetachesDuCours) {
				lListeDetaches.addElement(aElement);
			} else {
				lListeEnCours.addElement(aElement);
			}
		});
		lTAF.listeEleves = new ObjetListeElements_1.ObjetListeElements();
		const lListe = aParam.listeRessourcesSelectionnees;
		if (!lListeDetaches || lListeDetaches.count() === 0) {
			lTAF.estPourTous = lListe.count() === aParam.listeTousEleves.count();
		} else {
			lTAF.estPourTous =
				lListe.count() === lListeEnCours.count() &&
				lListe.getIndiceElementParFiltre((aElement) => {
					return aElement.estElevesDetachesDuCours;
				}) === -1;
		}
		lTAF.pourTousLesEleves = lTAF.estPourTous;
		lTAF.nbrEleves = lListe.count();
		lListe.parcourir((D) => {
			D.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lTAF.listeEleves.addElement(D);
		});
		if (lTAF.estPourTous) {
			if (lEstPourTousInitial !== lTAF.estPourTous) {
				lTAF.avecModificationPublic = true;
			}
		}
		lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	getListeRessourcesDeGenre(aParam) {
		return aParam.data.ListePieceJointe.getListeElements((aElt) => {
			const lParam = { documentJoint: aElt };
			if (
				aParam.genreRessource ===
					Enumere_DocumentJoint_1.EGenreDocumentJoint.LienKiosque ||
				aParam.genreRessource ===
					Enumere_DocumentJoint_1.EGenreDocumentJoint.Url
			) {
				$.extend(lParam, { afficherIconeDocument: false });
			}
			aElt.libelleHtml = ObjetChaine_1.GChaine.composerUrlLienExterne(lParam);
			if (aElt.getGenre() === aParam.genreRessource) {
				aElt.avecSaisie = aParam.avecSaisie;
			}
			return aElt.getGenre() === aParam.genreRessource;
		});
	}
	majDataSurRemoveRessource(aParam) {
		const lRessource = aParam.data.ListePieceJointe.getElementParNumeroEtGenre(
			aParam.numeroRessource,
			aParam.genreRessource,
		);
		if (lRessource !== null && lRessource !== undefined) {
			lRessource.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		}
	}
	majDataContenuCdT(aParam) {
		if (!aParam.contenu || !aParam.cdt) {
			return;
		}
		if (
			aParam.contenuARemplacer !== null &&
			aParam.contenuARemplacer !== undefined
		) {
			aParam.contenuARemplacer.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			aParam.contenuARemplacer.ListePieceJointe.parcourir((D) => {
				D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			});
		}
		const lContenu = MethodesObjet_1.MethodesObjet.dupliquer(aParam.contenu);
		aParam.cdt.listeContenus.addElement(lContenu);
		aParam.cdt.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		lContenu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		lContenu.ListePieceJointe.parcourir((D) => {
			D.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		});
		lContenu.listeExecutionQCM.parcourir((D) => {
			D.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		});
	}
	majDataTAFCdT(aParam) {
		if (!aParam.taf || !aParam.cdt) {
			return;
		}
		if (aParam.tafARemplacer) {
			aParam.tafARemplacer.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			aParam.tafARemplacer.ListePieceJointe.parcourir((D) => {
				D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			});
		}
		const lTAF = MethodesObjet_1.MethodesObjet.dupliquer(aParam.taf);
		aParam.cdt.ListeTravailAFaire.addElement(lTAF);
		aParam.cdt.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		lTAF.PourLe = aParam.date;
		lTAF.listeEleves = new ObjetListeElements_1.ObjetListeElements();
		lTAF.estPourTous = true;
		lTAF.pourTousLesEleves = true;
		lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		if (lTAF.executionQCM) {
			lTAF.executionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		} else {
			lTAF.ListePieceJointe.parcourir((D) => {
				D.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			});
		}
	}
	majDataListeTAFsCdT(aParam) {
		if (!aParam.cdt || !aParam.listeTAFs || !aParam.date) {
			return;
		}
		for (let I = 0; I < aParam.cdt.ListeTravailAFaire.count(); I++) {
			let lTAF = aParam.cdt.ListeTravailAFaire.get(I);
			lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			for (let J = 0; J < lTAF.ListePieceJointe.count(); J++) {
				let lPJ = lTAF.ListePieceJointe.get(J);
				lPJ.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			}
		}
		aParam.listeTAFs.parcourir((aTaf) => {
			if (aTaf.getNumero() !== 0) {
				this.majDataTAFCdT({ cdt: aParam.cdt, taf: aTaf, date: aParam.date });
			}
		});
		aParam.cdt.ListeTravailAFaire.trier();
	}
	majDataSurCollerCdT(aParam) {
		if (!aParam.cible || !aParam.source) {
			return;
		}
		aParam.cible.publie = aParam.source.publie;
		aParam.cible.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		aParam.cible.listeContenus.parcourir((aContenu) => {
			aContenu.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			aContenu.ListePieceJointe.parcourir((D) => {
				D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			});
		});
		aParam.source.listeContenus.parcourir((aContenu) => {
			if (aContenu.getNumero() !== 0 && !this.estContenuVide(aContenu)) {
				this.majDataContenuCdT({ cdt: aParam.cible, contenu: aContenu });
			}
		});
		this.majDataListeTAFsCdT({
			cdt: aParam.cible,
			listeTAFs: aParam.source.ListeTravailAFaire,
			date: aParam.dateTAF,
		});
		if (aParam.avecCopieEltPgm && aParam.source.listeElementsProgrammeCDT) {
			if (!aParam.cible.listeElementsProgrammeCDT) {
				aParam.cible.listeElementsProgrammeCDT =
					new ObjetListeElements_1.ObjetListeElements();
			}
			aParam.cible.listeElementsProgrammeCDT =
				new ObjetListeElements_1.ObjetListeElements().add(
					aParam.source.listeElementsProgrammeCDT,
				);
			aParam.cible.listeElementsProgrammeCDT.avecSaisie = true;
			aParam.cible.listeElementsProgrammeCDT.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
	}
	getTitreExecutionQCM(aParam) {
		const H = [];
		const lExec = aParam.execQCM;
		const lAction = "";
		H.push(
			"<div>",
			lExec.estEnPublication === true
				? ObjetTraduction_1.GTraductions.getValeur("ExecutionQCM.RepondreQCM")
				: ObjetDate_1.GDate.formatDate(
						lExec.dateDebutPublication,
						"" +
							ObjetTraduction_1.GTraductions.getValeur(
								"ExecutionQCM.QCMPublieLe",
							) +
							" %J %MMMM",
					),
			" : ",
			"<span",
			lAction,
			">",
			lExec.QCM.getLibelle(),
			"</span>",
			"</div>",
		);
		return H.join("");
	}
	getHtmlTAFExecutionQCM(aParam) {
		const H = [];
		const lExec = aParam.execQCM;
		H.push(
			aParam.descriptif,
			" (",
			UtilitaireQCM_1.UtilitaireQCM.getStrResumeModalites(lExec, true),
			")",
		);
		H.push("<br />");
		const lAction = "";
		const lHtml =
			"<span " +
			lAction +
			">" +
			ObjetDate_1.GDate.formatDate(
				lExec.dateDebutPublication,
				"%JJ/%MM - %hh%sh%mm",
			) +
			"</span> ";
		H.push(
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.taf.DisponibleAPartirDuNet",
				[lHtml],
			),
		);
		if (!aParam.CDTPublie) {
			H.push(
				"(",
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.taf.SousReserveQueCDTSoitPublie",
				),
				")",
			);
		}
		return H.join("");
	}
	composeHtmlLigneQCM(aParam) {
		const lHtml = [];
		lHtml.push(
			'<div style="display:flex; flex-wrap:nowrap;">',
			'<i role="presentation" class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i>',
			"<div>",
			aParam.libelle,
			"</div>",
			"</div>",
		);
		return lHtml.join("");
	}
}
exports.ObjetMoteurCDT = ObjetMoteurCDT;
