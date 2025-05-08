const {
	EGenreRessource,
	EGenreRessourceUtil,
} = require("Enumere_Ressource.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { TypeGenreInternetIndividu } = require("TypeGenreInternetIndividu.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetRequeteListePublics } = require("ObjetRequeteListePublics.js");
const {
	ObjetFenetre_SelectionClasseGroupe,
} = require("ObjetFenetre_SelectionClasseGroupe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	TypeGenreCumulSelectionPublic,
} = require("ObjetFenetre_SelectionPublic.js");
const {
	ObjetFenetre_SelectionPublic_PN,
} = require("ObjetFenetre_SelectionPublic_PN.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { UtilitaireMessagerie } = require("UtilitaireMessagerie.js");
const { UtilitaireListePublics } = require("UtilitaireListePublics.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
class MoteurDestinatairesPN {
	estGenrePublicEntite(aParam) {
		if (aParam.donnee === null || aParam.donnee === undefined) {
			return false;
		}
		const lGenresPublicEntite = aParam.donnee.genresPublicEntite;
		switch (aParam.genreRessource) {
			case EGenreRessource.Responsable:
				return (
					lGenresPublicEntite.contains(
						TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
					) ||
					lGenresPublicEntite.contains(
						TypeGenreInternetIndividu.InternetIndividu_Parent,
					)
				);
			default:
				return lGenresPublicEntite.contains(
					_toInternetIndividu.call(this, aParam.genreRessource),
				);
		}
	}
	setGenrePublicEntite(aParam) {
		if (aParam.donnee === null || aParam.donnee === undefined) {
			return;
		}
		const lGenresPublicEntite = aParam.donnee.genresPublicEntite;
		const lRelatifEleve =
			aParam.genreRessource === EGenreRessource.Responsable
				? aParam.valeur === true
					? true
					: this.estRelatifEleve(aParam)
				: null;
		const lGII = _toInternetIndividu.call(
			this,
			aParam.genreRessource,
			lRelatifEleve,
		);
		const lEstCoche = lGenresPublicEntite.contains(lGII);
		if (lEstCoche) {
			lGenresPublicEntite.remove(lGII);
		} else {
			lGenresPublicEntite.add(lGII);
		}
		aParam.donnee.avecModificationPublic = true;
	}
	estRelatifEleve(aParam) {
		if (aParam.donnee === null || aParam.donnee === undefined) {
			return;
		}
		const lGenresPublicEntite = aParam.donnee.genresPublicEntite;
		switch (aParam.genreRessource) {
			case EGenreRessource.Responsable:
				if (
					lGenresPublicEntite.contains(
						TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
					)
				) {
					return true;
				}
				if (
					lGenresPublicEntite.contains(
						TypeGenreInternetIndividu.InternetIndividu_Parent,
					)
				) {
					return false;
				}
				break;
		}
		return null;
	}
	setChoixParMembre(aParam) {
		if (aParam.donnee === null || aParam.donnee === undefined) {
			return;
		}
		const lGenresPublicEntite = aParam.donnee.genresPublicEntite;
		switch (aParam.genreRessource) {
			case EGenreRessource.Responsable:
				lGenresPublicEntite.add(
					_toInternetIndividu.call(
						this,
						aParam.genreRessource,
						aParam.choixParMembre,
					),
				);
				lGenresPublicEntite.remove(
					_toInternetIndividu.call(
						this,
						aParam.genreRessource,
						!aParam.choixParMembre,
					),
				);
				aParam.donnee.avecModificationPublic = true;
				break;
		}
	}
	getDonneesPublic(aParam) {
		const lGenreRessource = aParam.genreRessource;
		const lEstResponsableAResponsable = [
			EGenreEspace.Parent,
			EGenreEspace.Mobile_Parent,
		].includes(GEtatUtilisateur.GenreEspace);
		const lParams = {
			genres: [lGenreRessource],
			sansFiltreSurEleve:
				GApplication.droits.get(TypeDroits.communication.toutesClasses) ||
				aParam.forcerSansFiltreSurEleve === true,
			entreResponsables: lEstResponsableAResponsable,
			avecFonctionPersonnel: true,
			avecInfoRencontresSepareesDesResponsables:
				!!aParam.avecInfoRencontresSepareesDesResponsables,
			eleve: aParam.eleve,
			avecInfoResponsablePreferentiel: !!aParam.avecInfoResponsablePreferentiel,
		};
		if (lEstResponsableAResponsable) {
			lParams["avecFiltreDelegues"] = true;
		}
		return new ObjetRequeteListePublics(
			this,
			aParam.clbck ? aParam.clbck.bind(this) : null,
		).lancerRequete(lParams);
	}
	getTitreSelectRessource(aParam) {
		const lGenreRessource = aParam.genreRessource;
		return EGenreRessourceUtil.getTitreFenetreSelectionRessource(
			lGenreRessource,
		);
	}
	ouvrirModaleSelectionRessource(aParam) {
		const lModaleSelect = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionClasseGroupe,
			{
				pere: this,
				evenement: function (
					aGenreRessource,
					aListeRessourcesSelect,
					aNumeroBouton,
				) {
					if (aNumeroBouton === 1) {
						const lEntitesAutreGenre =
							aParam.donnee.listePublicEntite.getListeElements((aElt) => {
								return aElt.getGenre() !== aGenreRessource;
							});
						aParam.donnee.listePublicEntite = lEntitesAutreGenre;
						aParam.donnee.listePublicEntite.add(
							MethodesObjet.dupliquer(aListeRessourcesSelect),
						);
						aParam.donnee.avecModificationPublic = true;
						aParam.clbck();
					}
				},
			},
		);
		const lGenreRessource = aParam.genreRessource;
		const lAvecClasse = lGenreRessource === EGenreRessource.Classe;
		const lListeClassesGroupes = GEtatUtilisateur.getListeClasses({
			avecClasse: lAvecClasse,
			avecGroupe: lGenreRessource === EGenreRessource.Groupe,
			uniquementClasseEnseignee: [
				EGenreEspace.Professeur,
				EGenreEspace.Mobile_Professeur,
			].includes(GEtatUtilisateur.GenreEspace)
				? !GApplication.droits.get(TypeDroits.communication.toutesClasses)
				: false,
		});
		const lTitre =
			lGenreRessource === EGenreRessource.Classe
				? GTraductions.getValeur("fenetreSelectionClasseGroupe.titreClasses")
				: GTraductions.getValeur("fenetreSelectionClasseGroupe.titreGroupes");
		lModaleSelect.setSelectionObligatoire(false);
		lModaleSelect.setAvecCumul(lAvecClasse);
		lModaleSelect.setDonnees({
			listeRessources: lListeClassesGroupes,
			listeRessourcesSelectionnees: MethodesObjet.dupliquer(
				aParam.donnee.listePublicEntite,
			),
			genreRessource: lGenreRessource,
			titre: lTitre,
		});
	}
	ouvrirModaleSelectionPublic(aParam) {
		const lAvecFiltreDelegues =
			[EGenreEspace.Parent, EGenreEspace.Mobile_Parent].includes(
				GEtatUtilisateur.GenreEspace,
			) && aParam.genreRessource === EGenreRessource.Responsable;
		aParam = Object.assign(
			{ avecCoche: true, avecFiltreDelegues: lAvecFiltreDelegues },
			aParam,
		);
		this.getDonneesPublic({
			genreRessource: aParam.genreRessource,
			eleve: aParam.eleve,
		}).then((aDonnees) => {
			this.openModaleSelectPublic({
				listePublicDonnee: aParam.listePublicDonnee,
				clbck: aParam.clbck,
				titre: this.getTitreSelectRessource({
					genreRessource: aParam.genreRessource,
				}),
				genreRessource: aParam.genreRessource,
				listeRessources: aDonnees.listePublic,
				listeRessourcesSelectionnees: aParam.listePublicDonnee.getListeElements(
					(aElt) => {
						return aElt.getGenre() === aParam.genreRessource;
					},
				),
				listeServicesPeriscolaire: aParam.listeServicesPeriscolaire,
				listeProjetsAcc: aParam.listeProjetsAcc,
				listeFamilles: aDonnees.listeFamilles,
				listeNiveauxResponsabilite: aDonnees.listeNiveauxResponsabilite,
				avecCoche: aParam.avecCoche,
				avecFiltreDelegues: aParam.avecFiltreDelegues,
				avecFiltreSelonAcceptRdv: aParam.avecFiltreSelonAcceptRdv,
				avecDirEnseignant: aParam.avecDirEnseignant,
			});
		});
	}
	automatiserSelectionPublic(aParam) {
		this.getDonneesPublic({
			genreRessource: aParam.genreRessource,
			clbck: function (aDonnees) {
				const lListeComplet = aDonnees.listePublic;
				if (aParam.donnee.listePublicIndividu.count() === 0) {
					let lClasse = null;
					let lEstClasseUnique = true;
					lListeComplet.parcourir((aElt) => {
						if (aElt.classes && aElt.classes.count() === 1) {
							const lClasseCourante = aElt.classes.get(0);
							if (lClasse === null) {
								lClasse = lClasseCourante;
							} else {
								if (lClasse.getNumero() !== lClasseCourante.getNumero()) {
									lEstClasseUnique = false;
								}
							}
						} else {
							lEstClasseUnique = false;
						}
					});
					if (lEstClasseUnique === true) {
						aParam.donnee.listePublicIndividu =
							lListeComplet.getListeElements();
						aParam.donnee.avecModificationPublic = true;
						aParam.clbck();
					}
				}
			}.bind(this),
		});
	}
	openModaleSelectPublic(aParam) {
		const lGenreRessource = aParam.genreRessource;
		const lAvecCoche = "avecCoche" in aParam ? aParam.avecCoche : true;
		const lValeurParDefautAvecFiltreDelegues =
			aParam.genreRessource === EGenreRessource.Responsable &&
			[EGenreEspace.Parent, EGenreEspace.Mobile_Parent].includes(
				GEtatUtilisateur.GenreEspace,
			);
		const lAvecFiltreDelegues =
			"avecFiltreDelegues" in aParam
				? aParam.avecFiltreDelegues
				: lValeurParDefautAvecFiltreDelegues;
		const lModaleSelect = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionPublic_PN,
			{
				pere: this,
				evenement: function (
					aGenreRessource,
					aListeRessourcesSelect,
					aNumeroBouton,
				) {
					if (aNumeroBouton === 1) {
						const lPublicAutresGenres =
							aParam.listePublicDonnee.getListeElements((aElt) => {
								return aElt.getGenre() !== aGenreRessource;
							});
						aParam.listePublicDonnee = lPublicAutresGenres;
						aParam.listePublicDonnee.add(
							MethodesObjet.dupliquer(aListeRessourcesSelect),
						);
						aParam.clbck({
							listePublicDonnee: aParam.listePublicDonnee,
							avecModificationPublic: true,
						});
					}
				},
			},
			{ titre: aParam.titre },
		);
		const lListeCumuls = new ObjetListeElements();
		switch (lGenreRessource) {
			case EGenreRessource.Eleve:
			case EGenreRessource.Responsable: {
				lListeCumuls.addElement(
					new ObjetElement(
						GTraductions.getValeur("destinataires.Cumul.Classe"),
						0,
						TypeGenreCumulSelectionPublic.classe,
						0,
					),
				);
				lListeCumuls.addElement(
					new ObjetElement(
						GTraductions.getValeur("destinataires.Cumul.Groupe"),
						0,
						TypeGenreCumulSelectionPublic.groupe,
						1,
					),
				);
				lListeCumuls.addElement(
					new ObjetElement(
						GTraductions.getValeur("destinataires.Cumul.Alphabetique"),
						0,
						TypeGenreCumulSelectionPublic.initial,
						2,
					),
				);
				if (lGenreRessource === EGenreRessource.Responsable) {
					lListeCumuls.addElement(
						new ObjetElement(
							GTraductions.getValeur("destinataires.Cumul.NomDesEleves"),
							0,
							TypeGenreCumulSelectionPublic.nomEleves,
						),
					);
				}
				if (aParam.listeServicesPeriscolaire) {
					lListeCumuls.addElement(
						new ObjetElement(
							GTraductions.getValeur(
								"destinataires.Cumul.ServicesPeriscolaire",
							),
							0,
							TypeGenreCumulSelectionPublic.servicesPeriscolaire,
						),
					);
				}
				if (aParam.listeProjetsAcc) {
					lListeCumuls.addElement(
						new ObjetElement(
							GTraductions.getValeur("actualites.Cumul.ProjetsAccompagnement"),
							0,
							TypeGenreCumulSelectionPublic.projetsAccompagnement,
						),
					);
				}
				if (aParam.listeFamilles) {
					aParam.listeFamilles.parcourir((aFamille) => {
						const lFiltreFamille = new ObjetElement(
							aFamille.getLibelle(),
							0,
							TypeGenreCumulSelectionPublic.famille,
						);
						lFiltreFamille.famille = aFamille;
						lListeCumuls.addElement(lFiltreFamille);
					});
				}
				lModaleSelect.setListeCumuls(lListeCumuls);
				lModaleSelect.setGenreCumulActif(TypeGenreCumulSelectionPublic.classe);
				lModaleSelect.setOptions({
					getInfosSuppZonePrincipale(aParams) {
						return UtilitaireListePublics.getLibelleSuppListePublics(
							aParams.article,
						);
					},
				});
				break;
			}
			case EGenreRessource.Personnel:
				lListeCumuls.add(
					new ObjetElement(
						GTraductions.getValeur("Fenetre_SelectionPublic.Cumul.Aucun"),
						0,
						TypeGenreCumulSelectionPublic.sans,
						0,
					),
				);
				lListeCumuls.add(
					new ObjetElement(
						GTraductions.getValeur("actualites.Cumul.Fonction"),
						0,
						TypeGenreCumulSelectionPublic.fonction,
						1,
					),
				);
				lModaleSelect.setListeCumuls(lListeCumuls);
				lModaleSelect.setGenreCumulActif(
					TypeGenreCumulSelectionPublic.fonction,
				);
				lModaleSelect.setOptions({
					getInfosSuppZonePrincipale(aParams) {
						return lModaleSelect.getGenreCumul() !==
							TypeGenreCumulSelectionPublic.fonction
							? UtilitaireMessagerie.getLibelleSuppListePublics(aParams.article)
							: "";
					},
				});
				break;
			case EGenreRessource.Enseignant:
				lModaleSelect.setOptions({
					getInfosSuppZonePrincipale(aParams) {
						return UtilitaireListePublics.getLibelleSuppListePublics(
							aParams.article,
						);
					},
				});
				break;
		}
		lModaleSelect.setListeCumuls(lListeCumuls);
		lModaleSelect.setOptions({
			avecCocheRessources: true,
			selectionObligatoire: false,
			filtres: [],
			avecBarreTitre: false,
			estDeploye: false,
			avecFiltreDelegues: lAvecFiltreDelegues,
			avecFiltreSelonAcceptRdv: aParam.avecFiltreSelonAcceptRdv,
			avecFiltreAucunAccesEspace:
				aParam.avecFiltreAucunAccesEspace !== null &&
				aParam.avecFiltreAucunAccesEspace !== undefined
					? aParam.avecFiltreAucunAccesEspace
					: false,
			avecDirEnseignant: aParam.avecDirEnseignant,
		});
		if (!lAvecCoche) {
			lModaleSelect.setOptionsFenetreSelectionRessource({
				optionsDonneesListe: {
					avecCB: false,
					avecSelection: true,
					avecEvnt_Selection: true,
				},
				avecCocheRessources: false,
			});
			lModaleSelect.setOptionsFenetre({
				listeBoutons: [
					{
						libelle: GTraductions.getValeur("Fermer"),
						theme: TypeThemeBouton.secondaire,
					},
				],
			});
		}
		lModaleSelect.setDonnees({
			listeRessources: aParam.listeRessources,
			listeRessourcesSelectionnees: aParam.listeRessourcesSelectionnees,
			genreRessource: aParam.genreRessource,
			titre: aParam.titre,
			listeNiveauxResponsabilite: aParam.listeNiveauxResponsabilite,
		});
	}
	construireHtmlDestRespToResp(aParam) {
		const H = [];
		H.push(
			'<div ie-node="',
			aParam.node,
			'()" class="itemDest flex-contain conteneurIcon">',
		);
		H.push('<i class="icon_group"></i>');
		H.push(
			'<div class="strIcon">',
			GTraductions.getValeur("destinataires.respDesClasses"),
			' <span class="strNumber" id="',
			aParam.idCompteur,
			'"> (0) </span></div>',
		);
		H.push('<i class="icon_angle_right"></i>');
		H.push("</div>");
		return H.join("");
	}
	construireHtmlDestPrimaireRespClasses(aParam) {
		const H = [];
		H.push(
			'<div ie-node="',
			aParam.node,
			"(",
			EGenreRessource.Classe,
			')" class="itemDest flex-contain conteneurIcon">',
		);
		H.push('<i class="icon_group"></i>');
		H.push(
			'<div class="strIcon">',
			GTraductions.getValeur("destinataires.respDesClasses"),
			' <span class="strNumber" id="',
			aParam.idCompteur,
			'"> (0) </span></div>',
		);
		H.push('<i class="icon_angle_right"></i>');
		H.push("</div>");
		return H.join("");
	}
	construireHtmlDestPrimaireResponsables(aParam) {
		const H = [];
		H.push(
			_construireHtmlSelectionDeRessource.call(this, {
				node: aParam.node,
				genreRessource: EGenreRessource.Responsable,
				strRessource: GTraductions.getValeur("destinataires.responsables"),
				idCompteur: aParam.idCompteur,
			}),
		);
		return H.join("");
	}
	construireHtmlDestPrimaireProfs(aParam) {
		const H = [];
		H.push(
			_construireHtmlSelectionDeRessource.call(this, {
				node: aParam.node,
				genreRessource: EGenreRessource.Enseignant,
				strRessource: GTraductions.getValeur("destinataires.professeurs"),
				idCompteur: aParam.idCompteur,
			}),
		);
		return H.join("");
	}
	construireHtmlDestPrimairePersonnels(aParam) {
		const H = [];
		H.push(
			_construireHtmlSelectionDeRessource.call(this, {
				node: aParam.node,
				genreRessource: EGenreRessource.Personnel,
				strRessource: GTraductions.getValeur("destinataires.personnels"),
				idCompteur: aParam.idCompteur,
			}),
		);
		return H.join("");
	}
	construireHtmlDestPrimaireDirecteur(aParam) {
		const H = [];
		H.push(
			'<ie-checkbox class="itemDest" ie-model="',
			aParam.node,
			'()">',
			aParam.str,
			"</ie-checkbox>",
		);
		return H.join("");
	}
	surSelectEntitesPrimaireRespClasses(aParam) {
		if (!GEtatUtilisateur.pourPrimaire()) {
			return;
		}
		const lDonnee = aParam.donnee;
		const lNbClasses = lDonnee.listePublicEntite
			.getListeElements((D) => {
				return D.getGenre() === EGenreRessource.Classe;
			})
			.getNbrElementsExistes();
		const lEstCoche = lDonnee.genresPublicEntite.contains(
			TypeGenreInternetIndividu.InternetIndividu_Parent,
		);
		if (lNbClasses > 0) {
			if (!lEstCoche) {
				lDonnee.genresPublicEntite.add(
					TypeGenreInternetIndividu.InternetIndividu_Parent,
				);
			}
		} else {
			if (lEstCoche) {
				lDonnee.genresPublicEntite.remove(
					TypeGenreInternetIndividu.InternetIndividu_Parent,
				);
			}
		}
	}
}
function _toInternetIndividu(aGenreRessource, aRelatifEleve) {
	switch (aGenreRessource) {
		case EGenreRessource.Enseignant:
			return TypeGenreInternetIndividu.InternetIndividu_Professeur;
		case EGenreRessource.Eleve:
			return TypeGenreInternetIndividu.InternetIndividu_Eleve;
		case EGenreRessource.Responsable:
			return aRelatifEleve
				? TypeGenreInternetIndividu.InternetIndividu_ParentEleve
				: TypeGenreInternetIndividu.InternetIndividu_Parent;
		case EGenreRessource.MaitreDeStage:
			return TypeGenreInternetIndividu.InternetIndividu_MaitreDeStageEleve;
		case EGenreRessource.Personnel:
			return TypeGenreInternetIndividu.InternetIndividu_Personnel;
	}
}
function _construireHtmlSelectionDeRessource(aParam) {
	const H = [];
	H.push(
		'<ie-btnselecteur class="m-bottom-l" ie-model="getSelectRessource" ie-node="',
		aParam.node,
		"(",
		aParam.genreRessource,
		')">',
		aParam.strRessource,
		' <span class="strNumber" id="',
		aParam.idCompteur,
		'"></span>',
		"</ie-btnselecteur>",
	);
	return H.join("");
}
module.exports = { MoteurDestinatairesPN };
