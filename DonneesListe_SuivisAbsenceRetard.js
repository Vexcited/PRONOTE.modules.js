exports.DonneesListe_SuivisAbsenceRetard = void 0;
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Media_1 = require("Enumere_Media");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Etat_1 = require("Enumere_Etat");
const AccessApp_1 = require("AccessApp");
const MethodesObjet_1 = require("MethodesObjet");
class DonneesListe_SuivisAbsenceRetard extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aCallbackMenuContextuel, aCallbackCreation) {
		super(aDonnees);
		this.typeAbsenceAvecCertificat = [
			Enumere_Ressource_1.EGenreRessource.Absence,
			Enumere_Ressource_1.EGenreRessource.AbsenceInternat,
		];
		this.appSco = (0, AccessApp_1.getApp)();
		this.callbackMenuContextuel = aCallbackMenuContextuel;
		this.callbackCreation = aCallbackCreation;
		this.listeFichiers = new ObjetListeElements_1.ObjetListeElements();
		this.setOptions({ avecDeploiement: true, avecContenuTronque: true });
	}
	avecSuppression(aParams) {
		return (
			!aParams.article.estPere &&
			!aParams.article.convocation &&
			!aParams.article.nonEditable
		);
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne !== DonneesListe_SuivisAbsenceRetard.colonnes.RA &&
			aParams.idColonne !== DonneesListe_SuivisAbsenceRetard.colonnes.certificat
		);
	}
	avecEdition(aParams) {
		if (!aParams.article || aParams.article.nonEditable) {
			return false;
		}
		if (aParams.article.estPere) {
			return (
				aParams.idColonne === DonneesListe_SuivisAbsenceRetard.colonnes.RA ||
				(aParams.idColonne ===
					DonneesListe_SuivisAbsenceRetard.colonnes.certificat &&
					this.typeAbsenceAvecCertificat.includes(aParams.article.getGenre()))
			);
		} else if (!aParams.article.pere.regle) {
			return (
				aParams.idColonne !==
					DonneesListe_SuivisAbsenceRetard.colonnes.lettre &&
				aParams.idColonne !== DonneesListe_SuivisAbsenceRetard.colonnes.RA &&
				aParams.idColonne !==
					DonneesListe_SuivisAbsenceRetard.colonnes.certificat &&
				(aParams.idColonne !==
					DonneesListe_SuivisAbsenceRetard.colonnes.nature ||
					!aParams.article.libelleLettre)
			);
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		const _avecEvenement_Edition_FilsNonRegle = function (_aParams) {
			switch (_aParams.idColonne) {
				case DonneesListe_SuivisAbsenceRetard.colonnes.admin:
					return true;
				case DonneesListe_SuivisAbsenceRetard.colonnes.RespEl: {
					const lSurEditionAutre =
						_aParams.article && _aParams.article.__surEditionAutre;
					delete _aParams.article.__surEditionAutre;
					return !lSurEditionAutre;
				}
				case DonneesListe_SuivisAbsenceRetard.colonnes.nature:
					return !_aParams.article.libelleLettre;
				case DonneesListe_SuivisAbsenceRetard.colonnes.date:
					return !_aParams.article.pere;
			}
			return false;
		};
		if (
			!aParams.article ||
			aParams.article.nonEditable ||
			this.options.nonEditable
		) {
			return false;
		}
		if (aParams.article.estPere) {
			return (
				aParams.idColonne === DonneesListe_SuivisAbsenceRetard.colonnes.RA ||
				aParams.idColonne ===
					DonneesListe_SuivisAbsenceRetard.colonnes.certificat
			);
		} else if (!aParams.article.pere.regle) {
			return _avecEvenement_Edition_FilsNonRegle(aParams);
		}
		return false;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuivisAbsenceRetard.colonnes.date:
				return aParams.article.estPere
					? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html
					: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.DateCalendrier;
			case DonneesListe_SuivisAbsenceRetard.colonnes.heure:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.HeureMinute;
			case DonneesListe_SuivisAbsenceRetard.colonnes.nature:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_SuivisAbsenceRetard.colonnes.commentaire:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
			case DonneesListe_SuivisAbsenceRetard.colonnes.RA:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_SuivisAbsenceRetard.colonnes.certificat:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	_getTitrePere(D, aLigne) {
		let lImage,
			lTitle = "";
		switch (D.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.Absence:
				lImage = "Image_RecapVS_AbsenceCours";
				lTitle = ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Absence");
				break;
			case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
				lImage = "Image_RecapVS_AbsenceInternat";
				lTitle = ObjetTraduction_1.GTraductions.getValeur(
					"SuivisAR.AbsenceInternat",
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
				lImage = "Image_RecapVS_AbsenceRepas";
				lTitle = ObjetTraduction_1.GTraductions.getValeur(
					"SuivisAR.AbsenceRepas",
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Retard:
				lImage = "Image_RecapVS_Retard";
				lTitle = ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Retard");
				break;
		}
		const lHtml = [];
		lHtml.push('<div class="flex-contain flex-center flex-gap">');
		if (D.regle || this.options.nonEditable) {
			lHtml.push('<div class="p-all"></div>');
		} else {
			lHtml.push(
				IE.jsx.str("ie-btnicon", {
					"ie-model": this.jsxModelBtn.bind(this, D),
					class: "icon_plus p-left",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"SuivisAR.AjouterSuivi",
					),
				}),
			);
		}
		lHtml.push(
			`<i class="${(D.estUnDeploiement ? (D.estDeploye ? "icon_fleche_num_bas" : "icon_fleche_num") : "") + " " + ObjetListe_css_1.StylesObjetListe.iconDeploiement}" role="presentation" class="m-all" style="width:10px"></i>`,
		);
		const lContenu =
			D.libellePere +
			(D.motif && !D.motif.nonConnu ? " - " + D.motif.getLibelle() : "") +
			(D.confidentiel
				? " (" +
					ObjetTraduction_1.GTraductions.getValeur(
						"SuivisAR.AbsenceNonPublieeAuxParents",
					) +
					")"
				: "");
		lHtml.push(
			'<div class="flex-contain flex-center flex-gap-l" title="',
			lTitle + " " + lContenu,
			'">',
			'<div class="fix-bloc ' + lImage + '"></div><div class="fluid-bloc">',
			lContenu,
			"</div></div>",
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	jsxModelBtn(aArticle) {
		return {
			event: () => {
				if (this.options.nonEditable || !aArticle) {
					return;
				}
				this.callbackCreation(aArticle);
			},
		};
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuivisAbsenceRetard.colonnes.date:
				return aParams.article.estPere
					? this._getTitrePere(aParams.article, aParams.ligne)
					: aParams.article.date;
			case DonneesListe_SuivisAbsenceRetard.colonnes.nature: {
				const lNatureArr = [];
				let lClasseIcone;
				let lHint = "";
				if (aParams.article.convocation) {
					lClasseIcone = "icon_convocation mix-icon_vs i-red";
				} else if (!!aParams.article.media) {
					lClasseIcone = Enumere_Media_1.EGenreMediaUtil.getClassesIconeMedia(
						aParams.article.media.getGenre(),
						!aParams.article.media.envoi,
					);
				} else if (aParams.article.strMedia) {
					lClasseIcone = "icon_parents mix-icon_ok i-green";
					lHint = ` title="${aParams.article.strMedia}"`;
				}
				if (lClasseIcone) {
					lNatureArr.push(
						'<i class="',
						lClasseIcone,
						'"',
						lHint,
						' role="presentation"></i>',
					);
				} else if (!!aParams.article.media && !!aParams.article.media.code) {
					lNatureArr.push(aParams.article.media.code);
				}
				return lNatureArr.join("");
			}
			case DonneesListe_SuivisAbsenceRetard.colonnes.heure:
				return aParams.article.estPere ? "" : aParams.article.date;
			case DonneesListe_SuivisAbsenceRetard.colonnes.lettre:
				return aParams.article.libelleLettre || "";
			case DonneesListe_SuivisAbsenceRetard.colonnes.admin:
				return aParams.article.personnel
					? aParams.article.personnel.getLibelle()
					: "";
			case DonneesListe_SuivisAbsenceRetard.colonnes.RespEl:
				return aParams.article.respEleve || "";
			case DonneesListe_SuivisAbsenceRetard.colonnes.commentaire:
				return aParams.article.commentaire || "";
			case DonneesListe_SuivisAbsenceRetard.colonnes.RA:
				return aParams.article.regle;
			case DonneesListe_SuivisAbsenceRetard.colonnes.certificat: {
				const lHtml = [];
				if (aParams.article.avecCertificat) {
					lHtml.push(
						IE.jsx.str("i", {
							class: fonts_css_1.StylesFonts.icon_piece_jointe,
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"SuivisAR.consulterCertificat",
							),
							role: "img",
						}),
					);
				}
				return lHtml.join("");
			}
		}
		return "";
	}
	getLibelleDraggable(aParams) {
		let lLibelleDraggable = " ";
		if (!!aParams.article.media) {
			lLibelleDraggable =
				aParams.article.media.getLibelle() +
				" - " +
				this.getChaineDeDate(aParams.article.date);
		}
		return lLibelleDraggable;
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuivisAbsenceRetard.colonnes.nature:
				return !!aParams.article.media
					? aParams.article.media.getLibelle()
					: "";
			case DonneesListe_SuivisAbsenceRetard.colonnes.certificat:
				return aParams.article.avecCertificat
					? aParams.article.certificatHint
					: "";
		}
		return "";
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_SuivisAbsenceRetard.colonnes.date:
				if (!!V) {
					const lDate = aParams.article.date;
					aParams.article.date = V;
					if (aParams.article.date) {
						aParams.article.date.setHours(
							lDate.getHours(),
							lDate.getMinutes(),
							0,
							0,
						);
					}
				}
				break;
			case DonneesListe_SuivisAbsenceRetard.colonnes.heure:
				if (
					V &&
					MethodesObjet_1.MethodesObjet.isObject(V) &&
					"ok" in V &&
					V.ok &&
					aParams.article.date
				) {
					aParams.article.date.setHours(V.heure, V.minute, 0, 0);
				}
				break;
			case DonneesListe_SuivisAbsenceRetard.colonnes.RespEl:
				aParams.article.respEleve = V;
				break;
			case DonneesListe_SuivisAbsenceRetard.colonnes.commentaire:
				aParams.article.commentaire = V;
				break;
			case DonneesListe_SuivisAbsenceRetard.colonnes.RA:
				aParams.article.regle = V;
				break;
			default:
		}
	}
	autoriserChaineVideSurEdition(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_SuivisAbsenceRetard.colonnes.commentaire
		) {
			return true;
		}
		return false;
	}
	getClass(aParams) {
		const lClasses = [];
		if (aParams.article.estPere) {
			lClasses.push("Gras");
			if (
				aParams.idColonne === DonneesListe_SuivisAbsenceRetard.colonnes.date &&
				aParams.article.estUnDeploiement
			) {
				lClasses.push("AvecMain");
			}
		}
		return lClasses.join(" ");
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_SuivisAbsenceRetard.colonnes.nature:
			case DonneesListe_SuivisAbsenceRetard.colonnes.certificat:
				lClasses.push("AlignementMilieu");
				break;
		}
		return lClasses.join(" ");
	}
	fusionCelluleAvecColonnePrecedente(aParams) {
		if (aParams.article.estPere) {
			switch (aParams.idColonne) {
				case DonneesListe_SuivisAbsenceRetard.colonnes.date:
				case DonneesListe_SuivisAbsenceRetard.colonnes.certificat:
				case DonneesListe_SuivisAbsenceRetard.colonnes.RA:
					return false;
			}
			return true;
		}
		return false;
	}
	avecSelecFile(aParams) {
		return (
			aParams.idColonne ===
				DonneesListe_SuivisAbsenceRetard.colonnes.certificat &&
			aParams.article.estPere &&
			this.typeAbsenceAvecCertificat.includes(aParams.article.getGenre()) &&
			!aParams.article.avecCertificat
		);
	}
	getOptionsSelecFile() {
		return {
			maxSize: this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		};
	}
	evenementSurSelecFile(aParams, aParamsInput) {
		const lElement = aParamsInput.eltFichier;
		lElement.suivi = aParams.article;
		this.listeFichiers.addElement(lElement);
		this.options.saisie(
			{
				genreSaisie:
					DonneesListe_SuivisAbsenceRetard.genreAction.AjouterDocument,
				article: aParams.article,
				Libelle: aParamsInput.eltFichier.getLibelle(),
				idFichier: aParamsInput.eltFichier.idFichier,
			},
			this.listeFichiers,
		);
	}
	evenementSurRemplacer(aParams, aParamsInput) {
		const lElement = aParamsInput.eltFichier;
		lElement.suivi = aParams.article;
		this.listeFichiers.addElement(lElement);
		this.options.saisie(
			{
				genreSaisie:
					DonneesListe_SuivisAbsenceRetard.genreAction.ModifierDocument,
				article: aParams.article,
				Libelle: aParamsInput.eltFichier.getLibelle(),
				idFichier: aParamsInput.eltFichier.idFichier,
			},
			this.listeFichiers,
		);
	}
	getCouleurCellule(aParams) {
		let lCouleurCellule;
		if (
			aParams.article.estPere &&
			aParams.idColonne === DonneesListe_SuivisAbsenceRetard.colonnes.date
		) {
			lCouleurCellule =
				ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
		}
		return lCouleurCellule;
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.init((D) => {
				return D.estPere ? D.place : D.pere.place;
			}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
			ObjetTri_1.ObjetTri.init((D) => {
				return !D.estPere;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.estPere ? 0 : D.date;
			}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
		];
	}
	initialiserObjetGraphique(aParams, aInstance) {
		aInstance.setParametres(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			null,
			null,
			null,
			false,
		);
	}
	setDonneesObjetGraphique(aParams, aInstance) {
		aInstance.setDonnees(aParams.article.date);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		switch (aParametres.idColonne) {
			case DonneesListe_SuivisAbsenceRetard.colonnes.certificat:
				if (!!aParametres.article.avecCertificat) {
					if (!aParametres.article.regle) {
						aParametres.menuContextuel.addSelecFile(
							ObjetTraduction_1.GTraductions.getValeur(
								"SuivisAR.remplacerCertificat",
							),
							{
								getOptionsSelecFile: () => {
									return {
										maxSize: this.appSco.droits.get(
											ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
										),
									};
								},
								addFiles: this.evenementSurRemplacer.bind(this, aParametres),
							},
							!!aParametres.article.estPere && !aParametres.nonEditable,
						);
						aParametres.menuContextuel.addCommande(
							DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu
								.SupprimerCertificat,
							ObjetTraduction_1.GTraductions.getValeur(
								"SuivisAR.supprimerCertificat",
							),
							!!aParametres.article.estPere && !aParametres.nonEditable,
						);
					}
					aParametres.menuContextuel.addCommande(
						DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu
							.ConsulterCertificat,
						ObjetTraduction_1.GTraductions.getValeur(
							"SuivisAR.consulterCertificat",
						),
						!!aParametres.article.estPere &&
							!aParametres.nonEditable &&
							aParametres.article.certificat.getEtat() !==
								Enumere_Etat_1.EGenreEtat.Creation,
					);
				}
				break;
			default:
				aParametres.menuContextuel.addCommande(
					DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu.ReglerDossier,
					ObjetTraduction_1.GTraductions.getValeur("SuivisAR.ReglerDossier"),
					!!aParametres.article.estPere && !aParametres.nonEditable,
				);
				aParametres.menuContextuel.addCommande(
					DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu.CreerSuivi,
					ObjetTraduction_1.GTraductions.getValeur("SuivisAR.CreerSuivi"),
					!!aParametres.article.estPere &&
						!aParametres.article.regle &&
						!aParametres.nonEditable,
				);
				aParametres.menuContextuel.addCommande(
					DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu.ModifierMotif,
					ObjetTraduction_1.GTraductions.getValeur("SuivisAR.ModifierMotif"),
					!!aParametres.article.estPere && !aParametres.nonEditable,
				);
				aParametres.menuContextuel.addCommande(
					Enumere_CommandeMenu_1.EGenreCommandeMenu.Edition,
					ObjetTraduction_1.GTraductions.getValeur("liste.modifier"),
					!aParametres.nonEditable &&
						(!aParametres.listeSelection ||
							aParametres.listeSelection.count() <= 1) &&
						this.avecEdition(aParametres),
				);
				aParametres.menuContextuel.addCommande(
					Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
					ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
					!aParametres.nonEditable && this.avecSuppression(aParametres),
				);
				break;
		}
		aParametres.menuContextuel.setDonnees();
	}
	evenementMenuContextuel(aParametres) {
		this.callbackMenuContextuel(
			aParametres.idColonne,
			aParametres.article,
			aParametres.ligneMenu,
		);
	}
}
exports.DonneesListe_SuivisAbsenceRetard = DonneesListe_SuivisAbsenceRetard;
(function (DonneesListe_SuivisAbsenceRetard) {
	let GenreCommandeMenu;
	(function (GenreCommandeMenu) {
		GenreCommandeMenu[(GenreCommandeMenu["ReglerDossier"] = 0)] =
			"ReglerDossier";
		GenreCommandeMenu[(GenreCommandeMenu["CreerSuivi"] = 1)] = "CreerSuivi";
		GenreCommandeMenu[(GenreCommandeMenu["ModifierMotif"] = 2)] =
			"ModifierMotif";
		GenreCommandeMenu[(GenreCommandeMenu["RemplacerCertificat"] = 3)] =
			"RemplacerCertificat";
		GenreCommandeMenu[(GenreCommandeMenu["ConsulterCertificat"] = 4)] =
			"ConsulterCertificat";
		GenreCommandeMenu[(GenreCommandeMenu["SupprimerCertificat"] = 5)] =
			"SupprimerCertificat";
	})(
		(GenreCommandeMenu =
			DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu ||
			(DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu = {})),
	);
	let colonnes;
	(function (colonnes) {
		colonnes["date"] = "DL_SuivisAbsenceRetard_date";
		colonnes["nature"] = "DL_SuivisAbsenceRetard_nature";
		colonnes["heure"] = "DL_SuivisAbsenceRetard_heure";
		colonnes["lettre"] = "DL_SuivisAbsenceRetard_lettre";
		colonnes["admin"] = "DL_SuivisAbsenceRetard_admin";
		colonnes["RespEl"] = "DL_SuivisAbsenceRetard_respEl";
		colonnes["commentaire"] = "DL_SuivisAbsenceRetard_comm";
		colonnes["certificat"] = "DL_SuivisAbsenceRetard_certificat";
		colonnes["RA"] = "DL_SuivisAbsenceRetard_RA";
	})(
		(colonnes =
			DonneesListe_SuivisAbsenceRetard.colonnes ||
			(DonneesListe_SuivisAbsenceRetard.colonnes = {})),
	);
	let genreAction;
	(function (genreAction) {
		genreAction[(genreAction["AjouterDocument"] = 0)] = "AjouterDocument";
		genreAction[(genreAction["SupprimerDocument"] = 1)] = "SupprimerDocument";
		genreAction[(genreAction["ModifierDocument"] = 2)] = "ModifierDocument";
	})(
		(genreAction =
			DonneesListe_SuivisAbsenceRetard.genreAction ||
			(DonneesListe_SuivisAbsenceRetard.genreAction = {})),
	);
})(
	DonneesListe_SuivisAbsenceRetard ||
		(exports.DonneesListe_SuivisAbsenceRetard =
			DonneesListe_SuivisAbsenceRetard =
				{}),
);
