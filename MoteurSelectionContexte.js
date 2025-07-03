exports.MoteurSelectionContexte = void 0;
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetRequeteListeServices_1 = require("ObjetRequeteListeServices");
const Enumere_Message_1 = require("Enumere_Message");
const ObjetDate_1 = require("ObjetDate");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetImage_1 = require("ObjetImage");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetRequeteListes_1 = require("ObjetRequeteListes");
const AccessApp_1 = require("AccessApp");
class MoteurSelectionContexte {
	constructor() {
		this.etatUtil = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.selection = { classe: null };
	}
	async getListeClasses(aParam) {
		if (
			[
				Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
				Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
			].includes(this.etatUtil.GenreEspace)
		) {
			this._actionSurGetListeClasses(aParam);
		} else {
			const lResult =
				await new ObjetRequeteListes_1.ObjetRequeteListes_ListeClassesGroupes(
					this,
				).lancerRequete();
			this._actionSurGetListeClasses(aParam, lResult);
		}
	}
	async getListePeriodes(aParam) {
		const lJSON =
			await new ObjetRequeteListes_1.ObjetRequeteListes_ListePeriodes(
				this,
			).lancerRequete({ ressource: aParam.classe });
		const lListePeriodes = lJSON.listePeriodes;
		if (!!lListePeriodes) {
			const lParamClbck = { listeElts: lListePeriodes };
			aParam.clbck.call(aParam.pere, lParamClbck);
		}
	}
	async getListeServices(aParam) {
		const lResult =
			await new ObjetRequeteListeServices_1.ObjetRequeteListeServices(
				this,
			).lancerRequete(aParam.utilisateur, aParam.classe, aParam.periode);
		const lListeServices = this._actionSurGetListeServices(lResult);
		if (!!lListeServices) {
			const lDefault = this._getServiceParDefaut(lListeServices, {
				classe: aParam.classe,
			});
			const lIndiceDefault = lListeServices.getIndiceParElement(lDefault);
			const lParamClbck = {
				listeElts: lListeServices,
				indiceEltParDefaut: lIndiceDefault,
			};
			aParam.clbck.call(aParam.pere, lParamClbck);
		}
	}
	async getListeEleves(aParam) {
		this.etatUtil.Navigation.setRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
			aParam.classe,
		);
		const lReponse =
			await new ObjetRequeteListes_1.ObjetRequeteListes_ListeEleves(
				this,
			).lancerRequete({
				ressource: aParam.classe,
				listeRessources: this.etatUtil.Navigation.getRessources(
					Enumere_Ressource_1.EGenreRessource.Classe,
				).setSerialisateurJSON({ ignorerEtatsElements: true }),
				avecUniquementStagiaire: !!aParam.avecUniquementStagiaire,
			});
		const lListeEleves = this._actionSurRequeteListeEleves(lReponse);
		if (!!lListeEleves) {
			const lParamClbck = { listeElts: lListeEleves };
			aParam.clbck.call(aParam.pere, lParamClbck);
		}
	}
	getLibelleMenu(aParam) {
		switch (aParam.genreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Classe:
				return aParam.avecGroupe === true
					? ObjetTraduction_1.GTraductions.getValeur("competences.ClasseGroupe")
					: ObjetTraduction_1.GTraductions.getValeur("Classe");
			case Enumere_Ressource_1.EGenreRessource.Matiere:
				return ObjetTraduction_1.GTraductions.getValeur("Matiere");
			case Enumere_Ressource_1.EGenreRessource.Periode:
				return ObjetTraduction_1.GTraductions.getValeur("Periode");
			case Enumere_Ressource_1.EGenreRessource.Pilier:
				return ObjetTraduction_1.GTraductions.getValeur("Competence");
			case Enumere_Ressource_1.EGenreRessource.Service:
				return ObjetTraduction_1.GTraductions.getValeur("Service");
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return ObjetTraduction_1.GTraductions.getValeur("Eleve");
			case Enumere_Ressource_1.EGenreRessource.Competence:
				return ObjetTraduction_1.GTraductions.getValeur("Competence");
			case Enumere_Ressource_1.EGenreRessource.Appreciation:
				return ObjetTraduction_1.GTraductions.getValeur("Appreciation");
			case Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire:
				return ObjetTraduction_1.GTraductions.getValeur("Discipline");
			case Enumere_Ressource_1.EGenreRessource.Palier:
				return ObjetTraduction_1.GTraductions.getValeur("competences.palier");
			case Enumere_Ressource_1.EGenreRessource.Salle:
				return ObjetTraduction_1.GTraductions.getValeur("Salle");
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				return ObjetTraduction_1.GTraductions.getValeur("Professeur");
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return ObjetTraduction_1.GTraductions.getValeur("Personnel");
			case Enumere_Ressource_1.EGenreRessource.Materiel:
				return ObjetTraduction_1.GTraductions.getValeur("Materiel");
			default:
				return null;
		}
	}
	getGenreMessageAucunElement(aGenreRessource) {
		switch (aGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Classe:
				return Enumere_Message_1.EGenreMessage.AucuneClasseDisponible;
			case Enumere_Ressource_1.EGenreRessource.Matiere:
				return Enumere_Message_1.EGenreMessage.AucunMatiere;
			case Enumere_Ressource_1.EGenreRessource.Periode:
				return Enumere_Message_1.EGenreMessage.AucunePeriodes;
			case Enumere_Ressource_1.EGenreRessource.Pilier:
				return null;
			case Enumere_Ressource_1.EGenreRessource.Service:
				return Enumere_Message_1.EGenreMessage.AucunService;
			case Enumere_Ressource_1.EGenreRessource.Eleve: {
				const lRessource = this.etatUtil.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Classe,
				);
				return lRessource &&
					lRessource.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe
					? Enumere_Message_1.EGenreMessage.AucunElevePourGroupe
					: Enumere_Message_1.EGenreMessage.AucunElevePourClasse;
			}
			case Enumere_Ressource_1.EGenreRessource.Appreciation:
				return Enumere_Message_1.EGenreMessage.AucunAppreciation;
			case Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire:
				return Enumere_Message_1.EGenreMessage.AucuneDiciplineLivret;
			case Enumere_Ressource_1.EGenreRessource.Palier:
				return Enumere_Message_1.EGenreMessage.AucunPalier;
			case Enumere_Ressource_1.EGenreRessource.Salle:
				return Enumere_Message_1.EGenreMessage.AucuneSalleDisponible;
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return null;
			case Enumere_Ressource_1.EGenreRessource.Materiel:
				return Enumere_Message_1.EGenreMessage.AucunMaterielDisponible;
			default:
				return null;
		}
	}
	remplirSelecteur(aParam) {
		const lListe = aParam.listeElts;
		aParam.instance.setDonnees(lListe, aParam.indiceEltParDefaut);
		const lCombo = aParam.instance.getCombo();
		lCombo.setActif(true);
		if (!lListe || lListe.count() === 0) {
			const lGenreMessageAucunElement = this.getGenreMessageAucunElement(
				aParam.genreRessource,
			);
			const lMsg = lGenreMessageAucunElement
				? ObjetTraduction_1.GTraductions.getValeur("Message")[
						lGenreMessageAucunElement
					]
				: "";
			aParam.clbck.call(aParam.pere, lMsg);
			const lLibelle = this.getLibelleMenu({
				genreRessource: aParam.genreRessource,
				avecGroupe: true,
			});
			lCombo.setOptionsObjetSaisie({ placeHolder: lLibelle });
			lCombo.setActif(false);
		}
	}
	formatterListeCours(aParam) {
		const lListeCours = aParam.listeCours;
		const lGenreTri =
			aParam.genreTri !== undefined && aParam.genreTri !== null
				? aParam.genreTri
				: Enumere_TriElement_1.EGenreTriElement.Decroissant;
		if (lListeCours.count() > 0) {
			for (let i = 0, lNbr = lListeCours.count(); i < lNbr; i++) {
				const lElementCours = lListeCours.get(i);
				const lDateDebut = ObjetDate_1.GDate.placeAnnuelleEnDate(
					lElementCours.Debut,
					false,
				);
				const lDateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(
					lElementCours.Fin,
					true,
				);
				lElementCours.dateDebut = new Date(
					lElementCours.DateDuCours.getFullYear(),
					lElementCours.DateDuCours.getMonth(),
					lElementCours.DateDuCours.getDate(),
					lDateDebut.getHours(),
					lDateDebut.getMinutes(),
					lDateDebut.getSeconds(),
					lDateDebut.getMilliseconds(),
				);
				lElementCours.dateFin = new Date(
					lElementCours.DateDuCours.getFullYear(),
					lElementCours.DateDuCours.getMonth(),
					lElementCours.DateDuCours.getDate(),
					lDateFin.getHours(),
					lDateFin.getMinutes(),
					lDateFin.getSeconds(),
					lDateFin.getMilliseconds(),
				);
				lElementCours.Libelle =
					ObjetDate_1.GDate.formatDate(
						lElementCours.DateDuCours,
						`[%JJJ %J %MMM]`,
					) +
					" " +
					ObjetDate_1.GDate.formatDate(
						lDateDebut,
						ObjetTraduction_1.GTraductions.getValeur("De") + " %hh:%mm",
					) +
					" " +
					ObjetDate_1.GDate.formatDate(
						lDateFin,
						ObjetTraduction_1.GTraductions.getValeur("A") + " %hh:%mm",
					);
				const lPublics = [];
				for (let J = 0; J < lElementCours.ListeContenus.count(); J++) {
					const lElementContenu = lElementCours.ListeContenus.get(J);
					const lGenre = lElementContenu.getGenre();
					switch (lGenre) {
						case Enumere_Ressource_1.EGenreRessource.Classe:
						case Enumere_Ressource_1.EGenreRessource.PartieDeClasse:
						case Enumere_Ressource_1.EGenreRessource.Groupe:
							lPublics.push(lElementContenu.getLibelle());
							break;
					}
				}
				lElementCours.classe = lPublics.join(", ");
				lElementCours.sousTitre =
					(lElementCours.classe ? lElementCours.classe : "") +
					(lElementCours.estSortiePedagogique
						? " - " +
							ObjetTraduction_1.GTraductions.getValeur(
								"EDT.AbsRess.SortiePedagogique",
							)
						: "") +
					(lElementCours.matiere && lElementCours.matiere.getLibelle()
						? " - " + lElementCours.matiere.getLibelle()
						: "") +
					(lElementCours.NomImageAppelFait
						? " " +
							'<div class="InlineBlock AlignementMilieuVertical">' +
							ObjetImage_1.GImage.composeImage(
								"Image_" + lElementCours.NomImageAppelFait,
								16,
							) +
							"</div>"
						: "");
			}
			lListeCours.setTri([
				ObjetTri_1.ObjetTri.init("DateDuCours", lGenreTri),
				ObjetTri_1.ObjetTri.init("Debut", lGenreTri),
			]);
			lListeCours.trier();
			return lListeCours;
		}
	}
	_actionSurGetListeClasses(aParam, aJSON) {
		const lAvecUniquementStagiaire =
			[Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationDeFinDeStage].includes(
				this.etatUtil.getGenreOnglet(),
			) &&
			[Enumere_Espace_1.EGenreEspace.Mobile_Etablissement].includes(
				this.etatUtil.GenreEspace,
			);
		const lListeClasse = [
			Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
			Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
		].includes(this.etatUtil.GenreEspace)
			? this.etatUtil.getListeClasses({
					avecClasse: true,
					avecGroupe: true,
					uniquementClasseEnseignee: true,
					uniquementClasseStagiaire: lAvecUniquementStagiaire,
				})
			: aJSON.listeClassesGroupes;
		const lAvecMesServices =
			[Enumere_Espace_1.EGenreEspace.Mobile_Professeur].includes(
				this.etatUtil.GenreEspace,
			) &&
			[Enumere_Onglet_1.EGenreOnglet.SaisieNotes].includes(
				this.etatUtil.getGenreOnglet(),
			);
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		let lGenre;
		let lAvecClasse = false;
		let lAvecGroupe = false;
		for (let I = 0; I < lListeClasse.count(); I++) {
			lGenre = lListeClasse.getGenre(I);
			if (lGenre === Enumere_Ressource_1.EGenreRessource.Classe) {
				lAvecClasse = true;
			}
			if (lGenre === Enumere_Ressource_1.EGenreRessource.Groupe) {
				lAvecGroupe = true;
			}
		}
		lListe.add(lListeClasse);
		if (lAvecMesServices) {
			const lMesServices = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("MesServices"),
				-1,
				Enumere_Ressource_1.EGenreRessource.Aucune,
				null,
			);
			lMesServices.AvecSelection = true;
			lListe.addElement(lMesServices);
		}
		if (lAvecClasse && lAvecGroupe) {
			let lElement = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("Classe"),
				-1,
				Enumere_Ressource_1.EGenreRessource.Classe,
				null,
			);
			lElement.AvecSelection = false;
			lListe.addElement(lElement);
			lElement = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("Groupe"),
				-1,
				Enumere_Ressource_1.EGenreRessource.Groupe,
				null,
			);
			lElement.AvecSelection = false;
			lListe.addElement(lElement);
		}
		lListe.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getGenre() !== Enumere_Ressource_1.EGenreRessource.Aucune;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getNumero() !== 0;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getGenre() !== Enumere_Ressource_1.EGenreRessource.Classe;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getNumero() !== -1;
			}),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lListe.trier();
		if (!!lListe) {
			const lDefault = this._getClasseParDefaut(lListe);
			const lIndiceDefault = lListe.getIndiceParElement(lDefault);
			const lParamClbck = {
				listeElts: lListe,
				indiceEltParDefaut: lIndiceDefault,
			};
			aParam.clbck.call(aParam.pere, lParamClbck);
		}
		return lListe;
	}
	_getClasseParDefaut(aListeClasses) {
		let lClasse = null;
		if (this.selection.classe !== null && this.selection.classe !== undefined) {
			lClasse = aListeClasses.getElementParNumero(
				this.selection.classe.getNumero(),
			);
		}
		if (lClasse !== null && lClasse !== undefined) {
			return lClasse;
		}
		aListeClasses.parcourir((aElement) => {
			if (aElement.getNumero() !== 0 && aElement.getNumero() !== -1) {
				lClasse = aElement;
				return false;
			}
		});
		return lClasse;
	}
	_getServiceParDefaut(aListeServices, aParam) {
		let lServiceParDefaut = null;
		const lRessource = aParam.classe;
		aListeServices.parcourir((aElement) => {
			if (aElement._estSurProfesseur) {
				if (!lServiceParDefaut || aElement.estUnService) {
					if (
						!lServiceParDefaut ||
						!(
							lRessource.getGenre() ===
								Enumere_Ressource_1.EGenreRessource.Classe &&
							aElement._estServicePartie
						)
					) {
						lServiceParDefaut = aElement;
					}
				}
			}
		});
		return lServiceParDefaut;
	}
	_actionSurGetListeServices(aListeServices) {
		const lListe = aListeServices;
		let lServicePere = null;
		lListe.parcourir((aElement) => {
			const lLibelleClasse = aElement.classe.getLibelle();
			const lLibelleGroupe = aElement.groupe.getLibelle();
			const lLibelleClasseGroupe =
				lLibelleClasse +
				(lLibelleClasse && lLibelleGroupe ? " > " : "") +
				lLibelleGroupe;
			let lTabLibelleProfesseurs = [];
			let lEstSurProfesseur = false;
			for (
				let I = 0;
				aElement.listeProfesseurs && I < aElement.listeProfesseurs.count();
				I++
			) {
				lTabLibelleProfesseurs.push(aElement.listeProfesseurs.getLibelle(I));
				if (
					aElement.listeProfesseurs.getNumero(I) ===
					this.etatUtil.getUtilisateur().getNumero()
				) {
					lEstSurProfesseur = true;
				}
			}
			const lLibelleProfesseurs = lTabLibelleProfesseurs.join("<br>");
			aElement._libelleClasseGroupe = lLibelleClasseGroupe;
			aElement._libelleProfesseurs = lLibelleProfesseurs;
			aElement._estSurProfesseur = lEstSurProfesseur;
			if (aElement.estUnService) {
				lServicePere = aElement;
			} else {
				aElement.pere = lServicePere;
				aElement.setLibelle("&nbsp;&nbsp;&nbsp;&nbsp;" + aElement.getLibelle());
			}
			const T = [];
			T.push(lLibelleClasseGroupe, " - ", lLibelleProfesseurs);
			aElement.sousTitre = T.join("");
		});
		lListe.setTri([
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init((D) => {
					return D.matiere && D.matiere.getNumero() ? 1 : 0;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.matiere ? D.matiere.getLibelle() : "";
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D._libelleClasseGroupe;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D._libelleProfesseurs;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return !D.estUnService;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getNumero();
				}),
			]),
		]);
		lListe.trier();
		return lListe;
	}
	_actionSurRequeteListeEleves(aJSON) {
		const lListeEleves = new ObjetListeElements_1.ObjetListeElements();
		if (this.avecDeLaClasse) {
			const lDonneeDeLaClasse = new ObjetElement_1.ObjetElement(
				this.estUneClasse
					? "< " + ObjetTraduction_1.GTraductions.getValeur("DeLaClasse") + " >"
					: "< " + ObjetTraduction_1.GTraductions.getValeur("DuGroupe") + " >",
				0,
				null,
				-1,
			);
			lListeEleves.addElement(lDonneeDeLaClasse);
		}
		aJSON.listeEleves.parcourir((D) => {
			const lEleve = MethodesObjet_1.MethodesObjet.dupliquer(D);
			lListeEleves.addElement(lEleve);
		});
		lListeEleves.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getNumero() !== 0;
			}),
			ObjetTri_1.ObjetTri.init("Position"),
		]);
		lListeEleves.trier();
		return lListeEleves;
	}
}
exports.MoteurSelectionContexte = MoteurSelectionContexte;
