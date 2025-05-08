const { GHtml } = require("ObjetHtml.js");
const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreMediaUtil } = require("Enumere_Media.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreEtat } = require("Enumere_Etat.js");
class DonneesListe_SuivisAbsenceRetard extends ObjetDonneesListe {
	constructor(aDonnees, aCallbackMenuContextuel, aCallbackCreation) {
		super(aDonnees);
		this.callbackMenuContextuel = aCallbackMenuContextuel;
		this.callbackCreation = aCallbackCreation;
		this.listeFichiers = new ObjetListeElements();
		this.setOptions({ avecDeploiement: true, avecContenuTronque: true });
		this.typeAbsenceAvecCertificat = [
			EGenreRessource.Absence,
			EGenreRessource.AbsenceInternat,
		];
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
					? ObjetDonneesListe.ETypeCellule.Html
					: ObjetDonneesListe.ETypeCellule.DateCalendrier;
			case DonneesListe_SuivisAbsenceRetard.colonnes.heure:
				return ObjetDonneesListe.ETypeCellule.HeureMinute;
			case DonneesListe_SuivisAbsenceRetard.colonnes.nature:
				return ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_SuivisAbsenceRetard.colonnes.commentaire:
				return ObjetDonneesListe.ETypeCellule.ZoneTexte;
			case DonneesListe_SuivisAbsenceRetard.colonnes.RA:
				return ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_SuivisAbsenceRetard.colonnes.certificat:
				return ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getControleur(aInstanceDonneesListe, aInstanceListe) {
		return $.extend(
			true,
			super.getControleur(aInstanceDonneesListe, aInstanceListe),
			{
				plus: function (aLigne) {
					$(this.node).on("mousedown", (event) => {
						if (aInstanceDonneesListe.options.nonEditable) {
							return;
						}
						event.stopPropagation();
						aInstanceDonneesListe.callbackCreation(
							aInstanceDonneesListe.Donnees.get(aLigne),
						);
					});
				},
			},
		);
	}
	_getTitrePere(D, aLigne) {
		let lImage,
			lTitle = "";
		switch (D.getGenre()) {
			case EGenreRessource.Absence:
				lImage = "Image_RecapVS_AbsenceCours";
				lTitle = GTraductions.getValeur("SuivisAR.Absence");
				break;
			case EGenreRessource.AbsenceInternat:
				lImage = "Image_RecapVS_AbsenceInternat";
				lTitle = GTraductions.getValeur("SuivisAR.AbsenceInternat");
				break;
			case EGenreRessource.AbsenceRepas:
				lImage = "Image_RecapVS_AbsenceRepas";
				lTitle = GTraductions.getValeur("SuivisAR.AbsenceRepas");
				break;
			case EGenreRessource.Retard:
				lImage = "Image_RecapVS_Retard";
				lTitle = GTraductions.getValeur("SuivisAR.Retard");
				break;
		}
		const lHtml = [];
		lHtml.push('<div class="flex-contain flex-center flex-gap">');
		if (D.regle || this.options.nonEditable) {
			lHtml.push('<div class="p-all"></div>');
		} else {
			lHtml.push(
				"<div ",
				GHtml.composeAttr("ie-node", "plus", aLigne),
				' class="AvecMain p-left">',
				'<i class="icon_plus" title="' +
					GTraductions.getValeur("SuivisAR.AjouterSuivi") +
					'"></i>',
				"</div>",
			);
		}
		const lClassDeploiement = D.estUnDeploiement
			? D.estDeploye
				? "Image_DeploiementListe_Deploye"
				: "Image_DeploiementListe_NonDeploye"
			: "";
		lHtml.push(
			"<div",
			lClassDeploiement
				? ' class="' + lClassDeploiement + '"'
				: ' class="p-all"',
			"></div>",
		);
		const lContenu =
			D.libellePere +
			(D.motif && !D.motif.nonConnu ? " - " + D.motif.getLibelle() : "") +
			(D.confidentiel
				? " (" +
					GTraductions.getValeur("SuivisAR.AbsenceNonPublieeAuxParents") +
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
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuivisAbsenceRetard.colonnes.date:
				return aParams.article.estPere
					? this._getTitrePere(aParams.article, aParams.ligne)
					: aParams.article.date;
			case DonneesListe_SuivisAbsenceRetard.colonnes.nature: {
				const lNatureArr = [];
				let lClasseIcone;
				let lClasseImage;
				let lHint = "";
				if (aParams.article.convocation) {
					lClasseIcone = "icon_convocation mix-icon_vs i-red";
				} else if (!!aParams.article.media) {
					lClasseImage = EGenreMediaUtil.getNomImage(
						aParams.article.media.getGenre(),
						!aParams.article.media.envoi,
					);
				} else if (aParams.article.strMedia) {
					lClasseIcone = "icon_parents mix-icon_ok i-green";
					lHint = ` title="${aParams.article.strMedia}"`;
				}
				if (!!lClasseIcone || !!lClasseImage) {
					if (lClasseIcone) {
						lNatureArr.push(
							'<i class="',
							lClasseIcone,
							'"',
							lHint,
							' style="margin-left:auto; margin-right:auto;"></i>',
						);
					} else {
						lNatureArr.push(
							'<div class="',
							lClasseImage,
							'" style="margin-left:auto; margin-right:auto;"></div>',
						);
					}
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
				const lClass = "Image_Trombone";
				const lHtml = [];
				if (aParams.article.avecCertificat) {
					lHtml.push(
						'<div class="',
						lClass,
						'" style="margin-left:auto; margin-right:auto;"></div>',
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
	getHintForce(aParams) {
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
				if (V && V.ok && aParams.article.date) {
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
			maxSize: GApplication.droits.get(
				TypeDroits.tailleMaxDocJointEtablissement,
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
			lCouleurCellule = ObjetDonneesListe.ECouleurCellule.Deploiement;
		}
		return lCouleurCellule;
	}
	getTri() {
		return [
			ObjetTri.init((D) => {
				return D.estPere ? D.place : D.pere.place;
			}, EGenreTriElement.Decroissant),
			ObjetTri.init((D) => {
				return !D.estPere;
			}),
			ObjetTri.init((D) => {
				return D.estPere ? 0 : D.date;
			}, EGenreTriElement.Decroissant),
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
							GTraductions.getValeur("SuivisAR.remplacerCertificat"),
							{
								getOptionsSelecFile: function () {
									return {
										maxSize: GApplication.droits.get(
											TypeDroits.tailleMaxDocJointEtablissement,
										),
									};
								}.bind(this),
								addFiles: this.evenementSurRemplacer.bind(this, aParametres),
							},
							!!aParametres.article.estPere && !aParametres.nonEditable,
						);
						aParametres.menuContextuel.addCommande(
							DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu
								.SupprimerCertificat,
							GTraductions.getValeur("SuivisAR.supprimerCertificat"),
							!!aParametres.article.estPere && !aParametres.nonEditable,
						);
					}
					aParametres.menuContextuel.addCommande(
						DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu
							.ConsulterCertificat,
						GTraductions.getValeur("SuivisAR.consulterCertificat"),
						!!aParametres.article.estPere &&
							!aParametres.nonEditable &&
							aParametres.article.certificat.getEtat() !== EGenreEtat.Creation,
					);
				}
				break;
			default:
				aParametres.menuContextuel.addCommande(
					DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu.ReglerDossier,
					GTraductions.getValeur("SuivisAR.ReglerDossier"),
					!!aParametres.article.estPere && !aParametres.nonEditable,
				);
				aParametres.menuContextuel.addCommande(
					DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu.CreerSuivi,
					GTraductions.getValeur("SuivisAR.CreerSuivi"),
					!!aParametres.article.estPere &&
						!aParametres.article.regle &&
						!aParametres.nonEditable,
				);
				aParametres.menuContextuel.addCommande(
					DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu.ModifierMotif,
					GTraductions.getValeur("SuivisAR.ModifierMotif"),
					!!aParametres.article.estPere && !aParametres.nonEditable,
				);
				aParametres.menuContextuel.addCommande(
					EGenreCommandeMenu.Edition,
					GTraductions.getValeur("liste.modifier"),
					!aParametres.nonEditable &&
						(!aParametres.listeSelection ||
							aParametres.listeSelection.count() <= 1) &&
						this.avecEdition(aParametres),
				);
				aParametres.menuContextuel.addCommande(
					EGenreCommandeMenu.Suppression,
					GTraductions.getValeur("liste.supprimer"),
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
DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu = {
	ReglerDossier: 0,
	CreerSuivi: 1,
	ModifierMotif: 2,
	RemplacerCertificat: 3,
	ConsulterCertificat: 4,
	SupprimerCertificat: 5,
};
DonneesListe_SuivisAbsenceRetard.colonnes = {
	date: "DL_SuivisAbsenceRetard_date",
	nature: "DL_SuivisAbsenceRetard_nature",
	heure: "DL_SuivisAbsenceRetard_heure",
	lettre: "DL_SuivisAbsenceRetard_lettre",
	admin: "DL_SuivisAbsenceRetard_admin",
	RespEl: "DL_SuivisAbsenceRetard_respEl",
	commentaire: "DL_SuivisAbsenceRetard_comm",
	certificat: "DL_SuivisAbsenceRetard_certificat",
	RA: "DL_SuivisAbsenceRetard_RA",
};
DonneesListe_SuivisAbsenceRetard.genreAction = {
	AjouterDocument: 0,
	SupprimerDocument: 1,
	ModifierDocument: 2,
};
module.exports = { DonneesListe_SuivisAbsenceRetard };
