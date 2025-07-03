exports.UtilitaireEDTJournalier = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const ObjetListeElements_1 = require("ObjetListeElements");
const tag_1 = require("tag");
const ObjetElement_1 = require("ObjetElement");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_DomaineFrequence_1 = require("Enumere_DomaineFrequence");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetCalculCoursMultiple_1 = require("ObjetCalculCoursMultiple");
const TypeStatutCours_1 = require("TypeStatutCours");
const UtilitaireVisiosSco_1 = require("UtilitaireVisiosSco");
const TypeGenreDisponibilite_1 = require("TypeGenreDisponibilite");
const TypeOrigineCreationCategorieCahierDeTexte_1 = require("TypeOrigineCreationCategorieCahierDeTexte");
const TypeHttpMarqueurContenuCours_1 = require("TypeHttpMarqueurContenuCours");
const Enumere_Espace_1 = require("Enumere_Espace");
const AccessApp_1 = require("AccessApp");
var TypeExclusion;
(function (TypeExclusion) {
	TypeExclusion["demipension"] = "demipension";
	TypeExclusion["etablissement"] = "etablissement";
	TypeExclusion["classe"] = "classe";
})(TypeExclusion || (TypeExclusion = {}));
class UtilitaireEDTJournalier {
	constructor() {}
	static formaterDonnees(aParams) {
		const lPlaceCourante = ObjetDate_1.GDate.dateEnPlaceHebdomadaire(
			new Date(),
		);
		const lEstJourCourant = ObjetDate_1.GDate.estJourCourant(aParams.date);
		const lExclusions = aParams.exclusions
			? _getExclusion(aParams.exclusions, aParams.jourCycleSelectionne)
			: null;
		let lSsTitre = "";
		if (lExclusions) {
			lExclusions.parcourir((aExclusion) => {
				lSsTitre = aExclusion;
			});
			aParams.exclusions = lExclusions;
		}
		let lListeDonnees = new ObjetListeElements_1.ObjetListeElements();
		const lListeCours = aParams.listeCours;
		new ObjetCalculCoursMultiple_1.ObjetCalculCoursMultiple().calculer({
			listeCours: lListeCours,
			avecCoursAnnules: true,
			avecCoursAnnulesSuperposes: !GEtatUtilisateur.estEspacePourEleve(),
			getPlaceDebutCours: function (aCours) {
				return _getPlaceDebutCours(aCours);
			}.bind(this),
			getPlaceFinCours: function (aCours) {
				return _getPlaceFinCours(aCours);
			}.bind(this),
		});
		lListeCours.trier();
		let aCoursPrecedent = null;
		lListeCours.parcourir((aCours) => {
			const lElement = _formatCours(aCours, aCoursPrecedent, {
				placeCourante: lPlaceCourante,
				estJourCourant: lEstJourCourant,
				avecTrouEDT: aParams.avecTrouEDT,
				exclusions: aParams.exclusions,
				joursStage: aParams.joursStage,
				absences: aParams.absences,
				avecIconeAppel: aParams.avecIconeAppel,
				debutDemiPensionHebdo: aParams.debutDemiPensionHebdo,
				finDemiPensionHebdo: aParams.finDemiPensionHebdo,
			});
			if (
				lSsTitre === "" &&
				lElement &&
				"enStage" in lElement &&
				lElement.enStage
			) {
				lSsTitre = {
					libelle: ObjetTraduction_1.GTraductions.getValeur("EDT.EnStage"),
					type: "stage",
				};
			}
			if (lElement) {
				lListeDonnees.addElement(lElement);
				aCoursPrecedent = lElement;
			}
		});
		lListeDonnees.setTri([ObjetTri_1.ObjetTri.init("debutPlaceJour")]);
		lListeDonnees.trier();
		if (aParams.avecTrouEDT) {
			if (aParams.disponibilites) {
				_ajouterDisponibilite(
					lListeDonnees,
					aParams.disponibilites,
					aParams.date,
				);
				lListeDonnees.trier();
			}
			_completerDonnees(lListeDonnees, aParams);
		}
		lListeDonnees.trier();
		return { soustitre: lSsTitre, listeDonnees: lListeDonnees };
	}
	static surClicVisioCours(aCours) {
		let lVisioCours = null;
		if (
			!!aCours &&
			"listeVisios" in aCours &&
			!!aCours.listeVisios &&
			aCours.listeVisios.getNbrElementsExistes() > 0
		) {
			lVisioCours = aCours.listeVisios.getPremierElement();
		}
		if (!!lVisioCours && !!lVisioCours.url) {
			const lOptions = {
				titre:
					aCours &&
					aCours.getGenre() ===
						TypeStatutCours_1.TypeStatutCours.ConseilDeClasse
						? ObjetTraduction_1.GTraductions.getValeur(
								"FenetreSaisieVisiosCours.URLAssocieeAuConseil",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreSaisieVisiosCours.URLAssocieeAuCours",
							),
			};
			UtilitaireVisiosSco_1.UtilitaireVisios.ouvrirFenetreConsultVisio(
				lVisioCours,
				lOptions,
			);
		}
	}
	static getTitreSemaine(aNumeroSemaine) {
		const lParametre = (0, AccessApp_1.getApp)().getObjetParametres();
		let lTitre = ObjetTraduction_1.GTraductions.getValeur("Semaine") + " ";
		if (lParametre.frequences && lParametre.frequences[aNumeroSemaine]) {
			lTitre += [
				Enumere_DomaineFrequence_1.EGenreDomaineFrequence.QZ1,
				Enumere_DomaineFrequence_1.EGenreDomaineFrequence.QZ2,
			].includes(lParametre.frequences[aNumeroSemaine].genre)
				? lParametre.frequences[aNumeroSemaine].libelle
				: ObjetTraduction_1.GTraductions.getValeur("Feriee").toLowerCase();
		} else {
			lTitre += aNumeroSemaine;
		}
		return lTitre;
	}
	static composeCours(aCours, aParams) {
		if ("masquerCours" in aCours && aCours.masquerCours) {
			return "";
		}
		const lCliquable =
			aParams.forcerClickCours ||
			aParams.estRetenue ||
			aParams.estSortiePedagogique;
		const lNodeCours =
			aCours.listeCours || lCliquable
				? ObjetHtml_1.GHtml.composeAttr("ie-node", "getNodeCours", [
						aParams.indexCours,
						aParams.indexCoursMultiple,
					])
				: "";
		const lWaiLabel = [
			ObjetTraduction_1.GTraductions.getValeur("Dates.DeHeureDebutAHeureFin", [
				aCours.heureDebut,
				aCours.heureFin,
			]),
			aCours.libelleAria,
		];
		const H = [];
		H.push(
			`<li ${lNodeCours} class="flex-contain ${lCliquable ? "AvecMain" : ""} ${"styleCours" in aCours && aCours.styleCours ? aCours.styleCours.join(" ") : ""}" tabindex="0">`,
		);
		H.push((0, tag_1.tag)("span", { class: "sr-only" }, lWaiLabel.join(" ")));
		H.push(
			(0, tag_1.tag)(
				"div",
				{ class: "container-heures", "aria-hidden": "true" },
				(0, tag_1.tag)(
					"div",
					{
						class: `${"estEnCours" in aCours && aCours.estEnCours ? "Gras" : ""}`,
					},
					aCours.heureDebut,
				),
				"masquerHeureFin" in aCours && aCours.masquerHeureFin
					? ""
					: (0, tag_1.tag)("div", aCours.heureFin),
			),
		);
		H.push(
			(0, tag_1.tag)("div", {
				class: "trait-matiere",
				style: `${"couleur" in aCours && aCours.couleur && !aCours.estPasse ? "background-color :" + aCours.couleur + ";" : ""}`,
			}),
		);
		H.push(
			(0, tag_1.tag)(
				"ul",
				{
					class: `container-cours ${"classCss" in aCours && aCours.classCss ? aCours.classCss.join(" ") : ""}`,
					"aria-label":
						"ariaLabel" in aCours && aCours.ariaLabel ? aCours.ariaLabel : "",
				},
				_composeContenuCours(aCours, !lCliquable, aParams),
			),
		);
		H.push("</li>");
		return H.join("");
	}
	static popupCoursMultiple(aInstance, aCoursMultiple, aParams) {
		const lContenu = [];
		lContenu.push('<div class="edtJournalier"><ul class="liste-cours">');
		if (aCoursMultiple.listeCours) {
			aCoursMultiple.listeCours.setTri([
				ObjetTri_1.ObjetTri.init("debutPlaceJour"),
			]);
			aCoursMultiple.listeCours.trier();
			aCoursMultiple.listeCours.parcourir((aCours, aIndex) => {
				aParams.indexCoursMultiple = aIndex;
				lContenu.push(UtilitaireEDTJournalier.composeCours(aCours, aParams));
			});
		}
		lContenu.push("</ul></div>");
		const lTitreModale = [];
		lTitreModale.push(
			ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur("EDT.coursMultipleEntreEt"),
				[
					aCoursMultiple.listeCours.count(),
					aCoursMultiple.heureDebut,
					aCoursMultiple.heureFin,
				],
			),
		);
		UtilitaireEDTJournalier.fermerFenetreCours.call(aInstance);
		aInstance.fenetreCours = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{ pere: aInstance },
			{
				titre: lTitreModale.join(""),
				largeur: 400,
				fermerFenetreSurClicHorsFenetre: true,
				callbackFermer: function () {
					aInstance.fenetreCours = null;
					if (aInstance.callbackPopup) {
						aInstance.callbackPopup();
					}
				}.bind(aInstance),
			},
		);
		$.extend(aInstance.fenetreCours.controleur, aInstance.controleur);
		aInstance.fenetreCours.afficher(lContenu.join(""));
	}
	static fermerFenetreCours() {
		if ("fenetreCours" in this && this.fenetreCours) {
			this.fenetreCours.fermer();
		}
	}
}
exports.UtilitaireEDTJournalier = UtilitaireEDTJournalier;
function _formatCours(aCours, aCoursPrecedent, aParams) {
	if (
		("estCoursMSInvisibleCouloir" in aCours &&
			!!aCours.estCoursMSInvisibleCouloir) ||
		aCours.Visible === false
	) {
		return;
	}
	const lElement = ObjetElement_1.ObjetElement.create({
		coursOriginal: aCours,
		place: aCours.place,
		estSortiePedagogique:
			"estSortiePedagogique" in aCours
				? aCours.estSortiePedagogique
				: undefined,
		etiquettes: new ObjetListeElements_1.ObjetListeElements(),
		couleur: "CouleurFond" in aCours ? aCours.CouleurFond : undefined,
		memo: "memo" in aCours ? aCours.memo : undefined,
		memoPrive: "memoPrive" in aCours ? aCours.memoPrive : undefined,
		tabMemosAcc: "tabMemosAcc" in aCours ? aCours.tabMemosAcc : undefined,
		DateDuCours: "DateDuCours" in aCours ? aCours.DateDuCours : undefined,
		libelleCours: "libelleCours" in aCours ? aCours.libelleCours : undefined,
		styleCours: [],
	});
	lElement.coursOriginal = aCours;
	if (aCours.listeCours) {
		lElement.setLibelle(
			ObjetTraduction_1.GTraductions.getValeur("EDT.seancesDifferentes", [
				aCours.listeCours.count(),
			]),
		);
		let lListeCours = new ObjetListeElements_1.ObjetListeElements();
		let lCoursPrecedent = null;
		aCours.listeCours.parcourir((aCoursMultiple) => {
			const lCoursCourant = _formatCours(
				aCoursMultiple,
				lCoursPrecedent,
				aParams,
			);
			lListeCours.addElement(lCoursCourant);
			lCoursPrecedent = lCoursCourant;
		});
		lElement.listeCours = lListeCours;
	}
	if ("horsHoraire" in aCours && aCours.horsHoraire) {
		lElement.debutPlaceJour =
			ObjetDate_1.GDate.dateEnPlaceHebdomadaire(aCours.DateDuCours, false) + 1;
	} else {
		lElement.debutPlaceJour = aCours.place;
	}
	lElement.finPlaceJour = lElement.debutPlaceJour + aCours.duree;
	lElement.heureDebut = ObjetDate_1.GDate.formatDate(
		aCours.DateDuCours || ObjetDate_1.GDate.placeEnDateHeure(aCours.Debut),
		"%xh%sh%mm",
	);
	lElement.heureFin = ObjetDate_1.GDate.formatDate(
		"DateDuCoursFin" in aCours && aCours.DateDuCoursFin
			? aCours.DateDuCoursFin
			: ObjetDate_1.GDate.placeEnDateHeure(aCours.Fin, true),
		"%xh%sh%mm",
	);
	if (aCoursPrecedent) {
		aCoursPrecedent.masquerHeureFin =
			lElement.heureDebut === aCoursPrecedent.heureFin;
	}
	if ("Statut" in aCours && aCours.Statut) {
		lElement.etiquettes.addElement(
			ObjetElement_1.ObjetElement.create({
				Libelle: aCours.Statut,
				theme: aCours.estAnnule ? "gd-red-foncee" : "gd-blue-moyen",
			}),
		);
	}
	const lEtiquetteVisio = {
		Libelle: "",
		theme: "gd-green-foncee",
		icone:
			"listeVisios" in aCours &&
			aCours.listeVisios &&
			aCours.listeVisios.count() > 0
				? "icon_cours_virtuel"
				: "",
		estVisio: true,
		numeroCours: aCours.getNumero(),
		coursMultiple: aCours.coursMultiple,
	};
	if ("dispenseEleve" in aCours && aCours.dispenseEleve) {
		if (aCours.dispenseEleve.maison) {
			lElement.etiquettes.addElement(
				ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur(
						"WidgetEDTJournalier.ALaMaison",
					),
					theme: "gd-green-foncee",
				}),
			);
		} else {
			lElement.etiquettes.addElement(
				ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur(
						"WidgetEDTJournalier.Dispense",
					),
					theme: "gd-orange-moyen",
				}),
			);
		}
	}
	if ("aucunEleve" in aCours && aCours.aucunEleve) {
		lElement.etiquettes.add(
			ObjetElement_1.ObjetElement.create({
				Libelle: ObjetTraduction_1.GTraductions.getValeur("EDT.AucunEleve"),
				theme: "gd-red-foncee",
			}),
		);
	}
	if (
		"listeVisios" in aCours &&
		aCours.listeVisios &&
		aCours.listeVisios.count() > 0
	) {
		lElement.etiquettes.addElement(
			ObjetElement_1.ObjetElement.create(lEtiquetteVisio),
		);
	}
	if (aParams.absences && aParams.absences.length) {
		if (
			GEtatUtilisateur.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant
		) {
			aParams.absences.map((aAbsence) => {
				const lAbsDebut = aAbsence.place;
				const lAbsFin = lAbsDebut + aAbsence.duree;
				const lCoursFin = aCours.Fin + 1;
				if (lAbsDebut <= aCours.Debut && lAbsFin >= lCoursFin) {
					lElement.etiquettes.addElement(
						ObjetElement_1.ObjetElement.create({
							Libelle:
								ObjetTraduction_1.GTraductions.getValeur("EDT.EleveAbsent"),
							theme: "gd-red-foncee",
						}),
					);
					lElement.styleCours.push("eleve-absent");
					return false;
				} else if (
					lAbsDebut <= aCours.Debut &&
					lAbsFin > aCours.Debut &&
					lAbsFin < lCoursFin
				) {
					lElement.etiquettes.addElement(
						ObjetElement_1.ObjetElement.create({
							Libelle: ObjetTraduction_1.GTraductions.getValeur(
								"EDT.EleveAbsentJusqua",
								[
									ObjetDate_1.GDate.formatDate(
										ObjetDate_1.GDate.placeEnDateHeure(lAbsFin),
										"%xh%sh%mm",
									),
								],
							),
							theme: "gd-red-foncee",
						}),
					);
					lElement.styleCours.push("eleve-absent");
					return false;
				} else if (
					lAbsDebut > aCours.Debut &&
					lAbsDebut < lCoursFin &&
					lAbsFin >= aCours.Fin
				) {
					lElement.etiquettes.addElement(
						ObjetElement_1.ObjetElement.create({
							Libelle: ObjetTraduction_1.GTraductions.getValeur(
								"EDT.EleveAbsentAPartirDe",
								[
									ObjetDate_1.GDate.formatDate(
										ObjetDate_1.GDate.placeEnDateHeure(lAbsDebut),
										"%xh%sh%mm",
									),
								],
							),
							theme: "gd-red-foncee",
						}),
					);
					lElement.styleCours.push("eleve-absent");
					return false;
				}
			});
		}
	}
	if (
		"cahierDeTextes" in aCours &&
		aCours.cahierDeTextes &&
		aCours.cahierDeTextes.originesCategorie &&
		aCours.cahierDeTextes.originesCategorie.count()
	) {
		[
			TypeOrigineCreationCategorieCahierDeTexte_1
				.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
			TypeOrigineCreationCategorieCahierDeTexte_1
				.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
		].forEach(function (aGenreCategorie) {
			const lOrigine =
				aCours.cahierDeTextes.originesCategorie.getElementParGenre(
					aGenreCategorie,
				);
			if (lOrigine) {
				lElement.etiquettes.addElement(
					ObjetElement_1.ObjetElement.create({
						Libelle: lOrigine.getLibelle(),
						theme: "gd-orange-claire",
					}),
				);
			}
		});
	}
	lElement.estEnCours =
		aParams.estJourCourant &&
		aParams.placeCourante >= aCours.Debut &&
		aParams.placeCourante <= aCours.Fin;
	lElement.estPasse =
		aParams.avecTrouEDT &&
		aParams.estJourCourant &&
		aCours.numeroSemaine &&
		aParams.placeCourante > aCours.place &&
		!lElement.estEnCours;
	lElement.professeurs = [];
	lElement.classes = [];
	lElement.groupes = [];
	lElement.partieDeClasse = [];
	lElement.salles = [];
	lElement.materiels = [];
	lElement.accompagnants = [];
	lElement.personnels = [];
	lElement.eleves = [];
	aCours.ListeContenus.parcourir((aContenu) => {
		switch (aContenu.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.Matiere:
				lElement.setLibelle(aContenu.getLibelle());
				lElement.libelleAria = aContenu.getLibelle();
				break;
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				lElement.professeurs.push(aContenu.getLibelle());
				break;
			case Enumere_Ressource_1.EGenreRessource.Classe:
				lElement.classes.push(aContenu.getLibelle());
				break;
			case Enumere_Ressource_1.EGenreRessource.Groupe:
				lElement.groupes.push(aContenu.getLibelle());
				break;
			case Enumere_Ressource_1.EGenreRessource.PartieDeClasse:
				lElement.partieDeClasse.push(aContenu.getLibelle());
				break;
			case Enumere_Ressource_1.EGenreRessource.Salle:
				lElement.salles.push(aContenu.getLibelle());
				break;
			case Enumere_Ressource_1.EGenreRessource.Materiel:
				lElement.materiels.push(aContenu.getLibelle());
				break;
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				if (aContenu.estAccompagnant) {
					lElement.accompagnants.push(aContenu.getLibelle());
				} else {
					lElement.personnels.push(aContenu.getLibelle());
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				lElement.eleves.push(aContenu.getLibelle());
				break;
			default:
				if (
					"estRetenue" in aCours &&
					aCours.estRetenue &&
					aContenu.estHoraire
				) {
					lElement.libelleAria = aContenu.getLibelle();
					lElement.setLibelle(
						'<i class="icon_punition self-center" role="presentation"></i>' +
							aContenu.getLibelle(),
					);
				} else {
					if (
						aContenu.marqueur &&
						aContenu.marqueur ===
							TypeHttpMarqueurContenuCours_1.TypeHttpMarqueurContenuCours
								.hmcc_ElevesAccompagnes
					) {
						lElement.eleves.push(aContenu.getLibelle());
					} else {
						lElement.autreContenu = aContenu.getLibelle();
					}
				}
				break;
		}
	});
	lElement.classCss = [];
	if ("estAnnule" in aCours && aCours.estAnnule) {
		lElement.styleCours.push("cours-annule");
	} else if (lElement.estPasse) {
		lElement.styleCours.push("greyed");
	}
	if (lElement.estEnCours) {
		lElement.styleCours.push("en-cours");
	}
	if ("estRetenue" in aCours && aCours.estRetenue) {
		lElement.classCss.push("est-retenue");
	}
	if (aParams.joursStage) {
		let lEnStage = false;
		const lStageAM = aParams.joursStage.am;
		const lStagePM = aParams.joursStage.pm;
		const lJourAnnee =
			ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
				IE.Cycles.dateDebutPremierCycle(),
				aCours.DateDuCours,
			) + 1;
		if (aCours.Debut <= aParams.debutDemiPensionHebdo) {
			lEnStage = lStageAM ? lStageAM.contains(lJourAnnee) : false;
		} else if (aCours.Fin >= aParams.finDemiPensionHebdo) {
			lEnStage = lStagePM ? lStagePM.contains(lJourAnnee) : false;
		}
		lElement.enStage = lEnStage;
		if (lEnStage) {
			lElement.styleCours.push("en-stage");
		}
	}
	lElement.styleCours.push(_estExcluDuCours(aCours, aParams.exclusions));
	if (
		"NomImageAppelFait" in aCours &&
		aCours.NomImageAppelFait &&
		aParams.avecIconeAppel
	) {
		lElement.NomImageAppelFait = aCours.NomImageAppelFait;
	}
	aCoursPrecedent = lElement;
	return lElement;
}
function _getPlaceDebutCours(aCours) {
	return !aCours || aCours.horsHoraire ? -1 : aCours.Debut;
}
function _getPlaceFinCours(aCours) {
	let lPlace = aCours.Fin;
	const lJourDebut = Math.floor(aCours.Debut / GParametres.PlacesParJour);
	if (Math.floor(aCours.Fin / GParametres.PlacesParJour) !== lJourDebut) {
		lPlace =
			lJourDebut * GParametres.PlacesParJour + GParametres.PlacesParJour - 1;
	}
	return lPlace;
}
function _composeContenuCours(aCours, aAvecCoursReduit, aParams) {
	const lEtiquettes = [];
	if ("etiquettes" in aCours && aCours.etiquettes) {
		aCours.etiquettes.parcourir((aEtiquette) => {
			lEtiquettes.push(_composeEtiquette(aEtiquette, aParams.indexCours));
		});
	}
	const H = [];
	let lHintImageAppel = "";
	switch (aCours.NomImageAppelFait) {
		case "AppelFait":
			lHintImageAppel =
				ObjetTraduction_1.GTraductions.getValeur("EDT.AppelFait");
			break;
		case "AppelNonFait":
			lHintImageAppel =
				ObjetTraduction_1.GTraductions.getValeur("EDT.AppelNonFait");
			break;
		case "AppelVerrouNonFait":
			lHintImageAppel = ObjetTraduction_1.GTraductions.getValeur(
				"EDT.AppelVerrouNonFait",
			);
			break;
	}
	let lLibelle = aCours.getLibelle();
	if (
		"libelleCours" in aCours &&
		aCours.libelleCours &&
		aCours.libelleCours.getLibelle()
	) {
		lLibelle += ` - ${aCours.libelleCours.getLibelle()}`;
	}
	H.push(
		(0, tag_1.tag)(
			"li",
			{
				class: [!aCours.estPasDeCours ? "libelle-cours" : "", "flex-contain"],
				"aria-hidden": "true",
			},
			"estDemiPension" in aCours && aCours.estDemiPension ? "" : lLibelle,
			"NomImageAppelFait" in aCours && aCours.NomImageAppelFait
				? (0, tag_1.tag)("div", {
						class: ["m-left", `Image_${aCours.NomImageAppelFait}`],
						"ie-hint": lHintImageAppel,
					})
				: "",
		),
	);
	H.push(
		"autreContenu" in aCours && aCours.autreContenu
			? (0, tag_1.tag)("li", aCours.autreContenu)
			: "",
	);
	if (!aCours.estPasse || !aAvecCoursReduit) {
		H.push(
			"professeurs" in aCours &&
				aCours.professeurs &&
				aCours.professeurs.length > 0
				? (0, tag_1.tag)("li", aCours.professeurs.join(", "))
				: "",
		);
		H.push(
			"classes" in aCours && aCours.classes && aCours.classes.length > 0
				? (0, tag_1.tag)("li", aCours.classes.join(", "))
				: "",
		);
		H.push(
			"groupes" in aCours && aCours.groupes && aCours.groupes.length > 0
				? (0, tag_1.tag)("li", aCours.groupes.join(", "))
				: "",
		);
		H.push(
			"partieDeClasse" in aCours &&
				aCours.partieDeClasse &&
				aCours.partieDeClasse.length > 0
				? (0, tag_1.tag)("li", aCours.partieDeClasse.join(", "))
				: "",
		);
		H.push(
			"personnels" in aCours &&
				aCours.personnels &&
				aCours.personnels.length > 0
				? (0, tag_1.tag)("li", aCours.personnels.join(", "))
				: "",
		);
		H.push(
			"accompagnants" in aCours &&
				aCours.accompagnants &&
				aCours.accompagnants.length > 0
				? (0, tag_1.tag)(
						"li",
						(0, tag_1.tag)("i", {
							class: ["icon_accompagnant p-right-s"],
							role: "img",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"PersonnelAccompagnant",
							),
						}),
						aCours.accompagnants.join(", "),
					)
				: "",
		);
		H.push(
			"eleves" in aCours && aCours.eleves && aCours.eleves.length > 0
				? (0, tag_1.tag)("li", aCours.eleves.join(", "))
				: "",
		);
		H.push(
			"salles" in aCours && aCours.salles && aCours.salles.length > 0
				? (0, tag_1.tag)("li", aCours.salles.join(", "))
				: "",
		);
		H.push(
			"materiels" in aCours && aCours.materiels && aCours.materiels.length > 0
				? (0, tag_1.tag)("li", aCours.materiels.join(", "))
				: "",
		);
		if ("memo" in aCours && aCours.memo) {
			let lStr = aCours.memo;
			if (aCours.memoPrive) {
				lStr = `${ObjetTraduction_1.GTraductions.getValeur("EDT.MemoPublic")} : ${lStr}`;
			}
			const lCss =
				aCours.estSortiePedagogique && !aCours.tabMemosAcc
					? ""
					: "icon_post_it_rempli";
			H.push(
				(0, tag_1.tag)(
					"li",
					(0, tag_1.tag)("i", { class: [lCss], role: "presentation" }),
					lStr,
				),
			);
		}
		if ("memoPrive" in aCours && aCours.memoPrive) {
			H.push(
				(0, tag_1.tag)(
					"li",
					(0, tag_1.tag)("i", {
						class: "icon_post_it_rempli mix-icon_pastille_evaluation m-right",
						role: "presentation",
					}),
					`${ObjetTraduction_1.GTraductions.getValeur("EDT.MemoAdministratif")} : ${aCours.memoPrive}`,
				),
			);
		}
		if (
			"estSortiePedagogique" in aCours &&
			aCours.estSortiePedagogique &&
			aCours.tabMemosAcc &&
			aCours.tabMemosAcc.length > 0
		) {
			for (const lMemo of aCours.tabMemosAcc) {
				const lMemoFormat = ObjetChaine_1.GChaine.replaceRCToHTML(lMemo);
				H.push((0, tag_1.tag)("li", lMemoFormat));
			}
		}
	}
	H.push(
		lEtiquettes && lEtiquettes.length > 0
			? (0, tag_1.tag)(
					"li",
					{ class: "container-etiquette" },
					lEtiquettes.join(""),
				)
			: "",
	);
	return H.join("");
}
function _composeEtiquette(aEtiquette, aIndexCours) {
	const lBtnVisio =
		aEtiquette.estVisio && aEtiquette.numeroCours
			? ObjetHtml_1.GHtml.composeAttr("ie-node", "getNodeVisioCours", [
					aEtiquette.numeroCours,
					aIndexCours,
				])
			: "";
	const H = [];
	if (aEtiquette.Libelle !== "") {
		H.push(
			(0, tag_1.tag)(
				"div",
				{ class: `m-left-s tag-style ie-chips ${aEtiquette.theme}` },
				aEtiquette.Libelle,
			),
		);
	}
	if (aEtiquette.icone) {
		H.push(
			`<ie-btnicon class="${aEtiquette.icone} self-center m-right bt-large" ${lBtnVisio}></ie-btnicon>`,
		);
	}
	return H.join("");
}
function _getExclusion(aJoursCycle, aJourCycleSelectionne) {
	const lExclusions = new ObjetListeElements_1.ObjetListeElements();
	if (aJoursCycle) {
		aJoursCycle.parcourir((aJour) => {
			if (
				aJourCycleSelectionne !== undefined &&
				aJour.jourCycle !== aJourCycleSelectionne
			) {
				return;
			}
			if (aJour.DP) {
				if (aJour.DP.exclusion) {
					lExclusions.addElement(
						ObjetElement_1.ObjetElement.create({
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"EDT.Exclusion.DemiPension",
							),
							type: TypeExclusion.demipension,
						}),
					);
				} else if (aJour.DP.MC) {
					lExclusions.addElement(
						ObjetElement_1.ObjetElement.create({
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.mesureConservatoire",
							),
							type: TypeExclusion.demipension,
						}),
					);
				}
			}
			if (aJour.exclusionsClasse) {
				lExclusions.addElement(
					ObjetElement_1.ObjetElement.create({
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"EDT.Exclusion.Classe",
						),
						type: TypeExclusion.classe,
						debut: aJour.exclusionsClasse.placeDebut,
						fin: aJour.exclusionsClasse.placeFin,
					}),
				);
			}
			if (aJour.exclusionsEtab) {
				lExclusions.addElement(
					ObjetElement_1.ObjetElement.create({
						libelle: aJour.exclusionsEtab.MC
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.mesureConservatoire",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"EDT.Exclusion.Etablissement",
								),
						type: TypeExclusion.etablissement,
						debut: aJour.exclusionsEtab.placeDebut,
						fin: aJour.exclusionsEtab.placeFin,
					}),
				);
			}
		});
	}
	return lExclusions;
}
function _estExcluDuCours(aCours, aExclusions) {
	let lVoileExlusion = "";
	if (aExclusions) {
		aExclusions.parcourir((aExclusion) => {
			if (
				"type" in aExclusion &&
				aExclusion.type === TypeExclusion.demipension
			) {
				lVoileExlusion =
					"estDemiPension" in aCours && aCours.estDemiPension
						? "exclusion-" + aExclusion.type
						: "";
				return;
			}
			if (
				"Debut" in aCours &&
				"debut" in aExclusion &&
				aCours.Debut >= aExclusion.debut &&
				aCours.Debut <= aExclusion.fin
			) {
				lVoileExlusion = "exclusion-" + aExclusion.type;
			}
		});
	}
	return lVoileExlusion;
}
function _ajouterTrou(aTrou, aParams) {
	const lParametre = (0, AccessApp_1.getApp)().getObjetParametres();
	const lElement = ObjetElement_1.ObjetElement.create({
		heureDebut: ObjetDate_1.GDate.formatDate(
			ObjetDate_1.GDate.placeEnDateHeure(aTrou.debut),
			"%xh%sh%mm",
		),
		heureFin: ObjetDate_1.GDate.formatDate(
			ObjetDate_1.GDate.placeEnDateHeure(aTrou.fin),
			"%xh%sh%mm",
		),
		debutPlaceJour: aTrou.debut,
		styleCours: [],
	});
	lElement.styleCours.push("greyed");
	if (aTrou.estDemiPension) {
		lElement.estDemiPension = true;
		lElement.classCss = ["demi-pension"];
		lElement.libelleAria =
			ObjetTraduction_1.GTraductions.getValeur("EDT.PauseDejeuner");
		lElement.setLibelle(
			ObjetTraduction_1.GTraductions.getValeur("EDT.PauseDejeuner"),
		);
		lElement.ariaLabel =
			ObjetTraduction_1.GTraductions.getValeur("EDT.PauseDejeuner");
		lElement.styleCours.push(_estExcluDuCours(lElement, aParams.exclusions));
	} else if (aTrou.estRecreation) {
		lElement.classCss = ["recreation"];
		lElement.libelleAria = aTrou.libelle;
		lElement.setLibelle(aTrou.libelle);
		lElement.ariaLabel = aTrou.libelle;
	} else if (aTrou.genrePriorite !== undefined) {
		lElement.ignorerTrou = true;
		lElement.finPlaceJour = lElement.debutPlaceJour + (aTrou.fin - aTrou.debut);
		lElement.heureFin =
			lElement.finPlaceJour < lParametre.LibellesHeures.count()
				? lParametre.LibellesHeures.getLibelle(lElement.finPlaceJour)
				: "";
		lElement.setLibelle(aTrou.libelle);
		lElement.masquerHeureFin = false;
		lElement.styleCours = [
			TypeGenreDisponibilite_1.TypeGenreDisponibiliteUtil.getClass(
				aTrou.genrePriorite,
			),
		];
	} else {
		lElement.libelleAria =
			ObjetTraduction_1.GTraductions.getValeur("EDT.PasDeCours");
		lElement.setLibelle(
			ObjetTraduction_1.GTraductions.getValeur("EDT.PasDeCours"),
		);
		lElement.masquerHeureFin = true;
		lElement.classCss = ["pas-de-cours"];
	}
	return lElement;
}
function _ajouterDisponibilite(aListe, aListeDisponibilites, aDate) {
	if (aListeDisponibilites) {
		aListeDisponibilites.forEach((aDisponibilite) => {
			if (aDate && !ObjetDate_1.GDate.estJourEgal(aDisponibilite.date, aDate)) {
				return;
			}
			const lListeMemePlace = aListe.getListeElements((aElement) => {
				return aElement.debutPlaceJour === aDisponibilite.placeDebut;
			});
			if (lListeMemePlace.count() > 0) {
				return;
			}
			aListe.addElement(
				_ajouterTrou({
					debut: aDisponibilite.placeDebut,
					fin: aDisponibilite.placeFin + 1,
					date: aDisponibilite.date,
					estDemiPension: false,
					genrePriorite: aDisponibilite.genre,
					libelle: aDisponibilite.libelle,
				}),
			);
		});
	}
}
function _completerDonnees(aListe, aParams) {
	let aCoursPrecedent = null;
	const lTableauTrou = [];
	aListe.parcourir((aCours) => {
		if (
			aCoursPrecedent &&
			!aCoursPrecedent.ignorerTrou &&
			aCours.debutPlaceJour !== aCoursPrecedent.finPlaceJour &&
			!aCours.ignorerTrou
		) {
			aCoursPrecedent.masquerHeureFin = true;
			const lDebut = aCoursPrecedent.finPlaceJour;
			const lFin = aCours.debutPlaceJour;
			const lEstDP =
				(lDebut >= aParams.debutDemiPensionHebdo &&
					lDebut < aParams.finDemiPensionHebdo) ||
				(lFin > aParams.debutDemiPensionHebdo &&
					lFin <= aParams.finDemiPensionHebdo) ||
				(lDebut < aParams.debutDemiPensionHebdo &&
					lFin > aParams.finDemiPensionHebdo);
			if (lEstDP) {
				if (
					lDebut < aParams.debutDemiPensionHebdo &&
					lFin > aParams.finDemiPensionHebdo
				) {
					lTableauTrou.push({
						debut: lDebut,
						fin: aParams.debutDemiPensionHebdo,
						estDemiPension: false,
					});
					lTableauTrou.push({
						debut: aParams.debutDemiPensionHebdo,
						fin: aParams.finDemiPensionHebdo,
						estDemiPension: true,
					});
					lTableauTrou.push({
						debut: aParams.finDemiPensionHebdo,
						fin: lFin,
						estDemiPension: false,
					});
				} else if (
					lDebut < aParams.debutDemiPensionHebdo &&
					lFin > aParams.debutDemiPensionHebdo
				) {
					lTableauTrou.push({
						debut: lDebut,
						fin: aParams.debutDemiPensionHebdo,
						estDemiPension: false,
					});
					lTableauTrou.push({
						debut: aParams.debutDemiPensionHebdo,
						fin: lFin,
						estDemiPension: true,
					});
				} else if (
					lDebut < aParams.finDemiPensionHebdo &&
					lFin > aParams.finDemiPensionHebdo
				) {
					lTableauTrou.push({
						debut: lDebut,
						fin: aParams.finDemiPensionHebdo,
						estDemiPension: true,
					});
					lTableauTrou.push({
						debut: aParams.finDemiPensionHebdo,
						fin: lFin,
						estDemiPension: false,
					});
				} else {
					lTableauTrou.push({
						debut: lDebut,
						fin: lFin,
						estDemiPension: lEstDP,
					});
				}
			} else {
				lTableauTrou.push({ debut: lDebut, fin: lFin, estDemiPension: lEstDP });
			}
		}
		aCoursPrecedent = aCours;
	});
	const lTableauFinal = [];
	lTableauTrou.forEach((aTrou) => {
		if (!isNaN(aTrou.debut) && aParams.recreations) {
			if (aTrou.estDemiPension) {
				lTableauFinal.push(aTrou);
				return;
			}
			let lAjouterTrou = false;
			aParams.recreations.parcourir((aRecreation) => {
				const lDebutRecre =
					aParams.premierePlaceHebdoDuJour + aRecreation.place;
				const lFinRecre = lDebutRecre + aRecreation.duree;
				if (aTrou.debut < lDebutRecre && aTrou.fin > lFinRecre) {
					lAjouterTrou = true;
					lTableauFinal.push({
						debut: aTrou.debut,
						fin: lDebutRecre,
						estRecreation: false,
					});
					lTableauFinal.push({
						debut: lDebutRecre,
						fin: lFinRecre,
						estRecreation: true,
						libelle: aRecreation.getLibelle(),
					});
					lTableauFinal.push({
						debut: lFinRecre,
						fin: aTrou.fin,
						estRecreation: false,
					});
				} else if (aTrou.debut < lDebutRecre && aTrou.fin > lDebutRecre) {
					lAjouterTrou = true;
					lTableauFinal.push({
						debut: aTrou.debut,
						fin: lDebutRecre,
						estRecreation: false,
					});
					lTableauFinal.push({
						debut: lDebutRecre,
						fin: aTrou.fin,
						estRecreation: true,
						libelle: aRecreation.getLibelle(),
					});
				} else if (aTrou.debut < lFinRecre && aTrou.fin > lFinRecre) {
					lAjouterTrou = true;
					lTableauFinal.push({
						debut: aTrou.debut,
						fin: lFinRecre,
						estRecreation: true,
						libelle: aRecreation.getLibelle(),
					});
					lTableauFinal.push({
						debut: lFinRecre,
						fin: aTrou.fin,
						estRecreation: false,
					});
				} else if (aTrou.debut >= lDebutRecre && aTrou.fin <= lFinRecre) {
					lAjouterTrou = true;
					lTableauFinal.push({
						debut: aTrou.debut,
						fin: aTrou.fin,
						estRecreation: true,
						libelle: aRecreation.getLibelle(),
					});
				}
			});
			if (!lAjouterTrou) {
				lTableauFinal.push(aTrou);
			}
		} else {
			lTableauFinal.push(aTrou);
		}
	});
	lTableauFinal.forEach((aTrou) => {
		if (!isNaN(aTrou.debut)) {
			aListe.addElement(_ajouterTrou(aTrou, aParams));
		}
	});
}
