const { GTraductions } = require("ObjetTraduction.js");
const { GDate } = require("ObjetDate.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { tag } = require("tag.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EGenreDomaineFrequence } = require("Enumere_DomaineFrequence.js");
const { GHtml } = require("ObjetHtml.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetCalculCoursMultiple } = require("ObjetCalculCoursMultiple.js");
const { TypeStatutCours } = require("TypeStatutCours.js");
const { UtilitaireVisios } = require("UtilitaireVisiosSco.js");
const { TypeGenreDisponibiliteUtil } = require("TypeGenreDisponibilite.js");
const {
	TypeOrigineCreationCategorieCahierDeTexte,
} = require("TypeOrigineCreationCategorieCahierDeTexte.js");
const {
	TypeHttpMarqueurContenuCours,
} = require("TypeHttpMarqueurContenuCours.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const TypeExclusion = {
	demipension: "demipension",
	etablissement: "etablissement",
	classe: "classe",
};
class UtilitaireEDTJournalier {
	constructor() {}
	static formaterDonnees(aParams) {
		const lPlaceCourante = GDate.dateEnPlaceHebdomadaire(new Date());
		const lEstJourCourant = GDate.estJourCourant(aParams.date);
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
		let lListeDonnees = new ObjetListeElements();
		const lListeCours = aParams.listeCours;
		new ObjetCalculCoursMultiple().calculer({
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
			if (lSsTitre === "" && lElement && lElement.enStage) {
				lSsTitre = {
					libelle: GTraductions.getValeur("EDT.EnStage"),
					type: "stage",
				};
			}
			if (lElement) {
				lListeDonnees.addElement(lElement);
				aCoursPrecedent = lElement;
			}
		});
		lListeDonnees.setTri([ObjetTri.init("debutPlaceJour")]);
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
			!!aCours.listeVisios &&
			aCours.listeVisios.getNbrElementsExistes() > 0
		) {
			lVisioCours = aCours.listeVisios.getPremierElement();
		}
		if (!!lVisioCours && !!lVisioCours.url) {
			const lOptions = {
				titre:
					aCours && aCours.getGenre() === TypeStatutCours.ConseilDeClasse
						? GTraductions.getValeur(
								"FenetreSaisieVisiosCours.URLAssocieeAuConseil",
							)
						: GTraductions.getValeur(
								"FenetreSaisieVisiosCours.URLAssocieeAuCours",
							),
			};
			UtilitaireVisios.ouvrirFenetreConsultVisio(lVisioCours, lOptions);
		}
	}
	static getTitreSemaine(aNumeroSemaine) {
		let lTitre = GTraductions.getValeur("Semaine") + " ";
		if (GParametres.frequences && GParametres.frequences[aNumeroSemaine]) {
			lTitre += [
				EGenreDomaineFrequence.QZ1,
				EGenreDomaineFrequence.QZ2,
			].includes(GParametres.frequences[aNumeroSemaine].genre)
				? GParametres.frequences[aNumeroSemaine].libelle
				: GTraductions.getValeur("Feriee").toLowerCase();
		} else {
			lTitre += aNumeroSemaine;
		}
		return lTitre;
	}
	static composeCours(aCours, aParams) {
		if (aCours.masquerCours) {
			return "";
		}
		const lCliquable =
			aParams.forcerClickCours ||
			aParams.estRetenue ||
			aParams.estSortiePedagogique;
		const lNodeCours =
			aCours.listeCours || lCliquable
				? GHtml.composeAttr("ie-node", "getNodeCours", [
						aParams.indexCours,
						aParams.indexCoursMultiple,
					])
				: "";
		const lWaiLabel = [
			GTraductions.getValeur("Dates.DeHeureDebutAHeureFin", [
				aCours.heureDebut,
				aCours.heureFin,
			]),
			aCours.libelleAria,
		];
		const H = [];
		H.push(
			`<li ${lNodeCours} class="flex-contain ${lCliquable ? "AvecMain" : ""} ${aCours.styleCours ? aCours.styleCours.join(" ") : ""}" tabindex="0">`,
		);
		H.push(tag("span", { class: "sr-only" }, lWaiLabel.join(" ")));
		H.push(
			tag(
				"div",
				{ class: "container-heures", "aria-hidden": "true" },
				tag(
					"div",
					{ class: `${aCours.estEnCours ? "Gras" : ""}` },
					aCours.heureDebut,
				),
				aCours.masquerHeureFin ? "" : tag("div", aCours.heureFin),
			),
		);
		H.push(
			tag("div", {
				class: "trait-matiere",
				style: `${aCours.couleur && !aCours.estPasse ? "background-color :" + aCours.couleur + ";" : ""}`,
			}),
		);
		H.push(
			tag(
				"ul",
				{
					class: `container-cours ${aCours.classCss ? aCours.classCss.join(" ") : ""}`,
					"aria-label": aCours.ariaLabel ? aCours.ariaLabel : "",
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
			aCoursMultiple.listeCours.setTri([ObjetTri.init("debutPlaceJour")]);
			aCoursMultiple.listeCours.trier();
			aCoursMultiple.listeCours.parcourir((aCours, aIndex) => {
				aParams.indexCoursMultiple = aIndex;
				lContenu.push(UtilitaireEDTJournalier.composeCours(aCours, aParams));
			});
		}
		lContenu.push("</ul></div>");
		const lTitreModale = [];
		lTitreModale.push(
			GChaine.format(GTraductions.getValeur("EDT.coursMultipleEntreEt"), [
				aCoursMultiple.listeCours.count(),
				aCoursMultiple.heureDebut,
				aCoursMultiple.heureFin,
			]),
		);
		UtilitaireEDTJournalier.fermerFenetreCours.call(aInstance);
		aInstance.fenetreCours = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre,
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
		if (this.fenetreCours) {
			this.fenetreCours.fermer();
		}
	}
}
function _formatCours(aCours, aCoursPrecedent, aParams) {
	if (!!aCours.estCoursMSInvisibleCouloir || aCours.Visible === false) {
		return;
	}
	const lElement = new ObjetElement("", aCours.getNumero());
	lElement.coursOriginal = aCours;
	if (aCours.listeCours) {
		lElement.setLibelle(
			GTraductions.getValeur("EDT.seancesDifferentes", [
				aCours.listeCours.count(),
			]),
		);
		let lListeCours = new ObjetListeElements();
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
	lElement.place = aCours.place;
	lElement.estSortiePedagogique = aCours.estSortiePedagogique;
	lElement.etiquettes = new ObjetListeElements();
	lElement.couleur = aCours.CouleurFond;
	lElement.memo = aCours.memo;
	lElement.memoPrive = aCours.memoPrive;
	lElement.tabMemosAcc = aCours.tabMemosAcc;
	lElement.DateDuCours = aCours.DateDuCours;
	lElement.libelleCours = aCours.libelleCours;
	lElement.styleCours = [];
	if (aCours.horsHoraire) {
		lElement.debutPlaceJour =
			GDate.dateEnPlaceHebdomadaire(aCours.DateDuCours, false) + 1;
	} else {
		lElement.debutPlaceJour = aCours.place;
	}
	lElement.finPlaceJour = lElement.debutPlaceJour + aCours.duree;
	lElement.heureDebut = GDate.formatDate(
		aCours.DateDuCours || GDate.placeEnDateHeure(aCours.Debut),
		"%xh%sh%mm",
	);
	lElement.heureFin = GDate.formatDate(
		aCours.DateDuCoursFin
			? aCours.DateDuCoursFin
			: GDate.placeEnDateHeure(aCours.Fin, true),
		"%xh%sh%mm",
	);
	if (aCoursPrecedent) {
		aCoursPrecedent.masquerHeureFin =
			lElement.heureDebut === aCoursPrecedent.heureFin;
	}
	if (aCours.Statut) {
		lElement.etiquettes.addElement({
			Libelle: aCours.Statut,
			theme: aCours.estAnnule ? "gd-util-rouge-foncee" : "gd-util-bleu-moyen",
		});
	}
	const lEtiquetteVisio = {
		Libelle: "",
		theme: "gd-util-vert-foncee",
		icone:
			aCours.listeVisios && aCours.listeVisios.count() > 0
				? "icon_cours_virtuel"
				: "",
		estVisio: true,
		numeroCours: aCours.getNumero(),
		coursMultiple: aCours.coursMultiple,
	};
	if (aCours.dispenseEleve) {
		if (aCours.dispenseEleve.maison) {
			lElement.etiquettes.addElement({
				Libelle: GTraductions.getValeur("WidgetEDTJournalier.ALaMaison"),
				theme: "gd-util-vert-foncee",
			});
		} else {
			lElement.etiquettes.addElement({
				Libelle: GTraductions.getValeur("WidgetEDTJournalier.Dispense"),
				theme: "gd-util-orange-moyen",
			});
		}
	}
	if (aCours.aucunEleve) {
		lElement.etiquettes.add(
			ObjetElement.create({
				Libelle: GTraductions.getValeur("EDT.AucunEleve"),
				theme: "gd-util-rouge-foncee",
			}),
		);
	}
	if (aCours.listeVisios && aCours.listeVisios.count() > 0) {
		lElement.etiquettes.addElement(lEtiquetteVisio);
	}
	if (aParams.absences && aParams.absences.length) {
		if (GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_Accompagnant) {
			aParams.absences.map((aAbsence) => {
				const lAbsDebut = aAbsence.place;
				const lAbsFin = lAbsDebut + aAbsence.duree;
				const lCoursFin = aCours.Fin + 1;
				if (lAbsDebut <= aCours.Debut && lAbsFin >= lCoursFin) {
					lElement.etiquettes.addElement({
						Libelle: GTraductions.getValeur("EDT.EleveAbsent"),
						theme: "gd-util-rouge-foncee",
					});
					lElement.styleCours.push("eleve-absent");
					return false;
				} else if (
					lAbsDebut <= aCours.Debut &&
					lAbsFin > aCours.Debut &&
					lAbsFin < lCoursFin
				) {
					lElement.etiquettes.addElement({
						Libelle: GTraductions.getValeur("EDT.EleveAbsentJusqua", [
							GDate.formatDate(GDate.placeEnDateHeure(lAbsFin), "%xh%sh%mm"),
						]),
						theme: "gd-util-rouge-foncee",
					});
					lElement.styleCours.push("eleve-absent");
					return false;
				} else if (
					lAbsDebut > aCours.Debut &&
					lAbsDebut < lCoursFin &&
					lAbsFin >= aCours.Fin
				) {
					lElement.etiquettes.addElement({
						Libelle: GTraductions.getValeur("EDT.EleveAbsentAPartirDe", [
							GDate.formatDate(GDate.placeEnDateHeure(lAbsDebut), "%xh%sh%mm"),
						]),
						theme: "gd-util-rouge-foncee",
					});
					lElement.styleCours.push("eleve-absent");
					return false;
				}
			});
		}
	}
	if (aCours.cahierDeTextes && aCours.cahierDeTextes.originesCategorie) {
		[
			TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
			TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
		].forEach(function (aGenreCategorie) {
			if (aCours.cahierDeTextes.originesCategorie.contains(aGenreCategorie)) {
				let lTitle = "";
				switch (aGenreCategorie) {
					case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir:
						lTitle = GTraductions.getValeur("EDT.DevoirSurveille");
						break;
					case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation:
						lTitle = GTraductions.getValeur("EDT.EvaluationCompetence");
						break;
				}
				lElement.etiquettes.addElement({
					Libelle: lTitle,
					theme: "gd-util-marron-claire",
				});
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
			case EGenreRessource.Matiere:
				lElement.setLibelle(aContenu.getLibelle());
				lElement.libelleAria = aContenu.getLibelle();
				break;
			case EGenreRessource.Enseignant:
				lElement.professeurs.push(aContenu.getLibelle());
				break;
			case EGenreRessource.Classe:
				lElement.classes.push(aContenu.getLibelle());
				break;
			case EGenreRessource.Groupe:
				lElement.groupes.push(aContenu.getLibelle());
				break;
			case EGenreRessource.PartieDeClasse:
				lElement.partieDeClasse.push(aContenu.getLibelle());
				break;
			case EGenreRessource.Salle:
				lElement.salles.push(aContenu.getLibelle());
				break;
			case EGenreRessource.Materiel:
				lElement.materiels.push(aContenu.getLibelle());
				break;
			case EGenreRessource.Personnel:
				if (aContenu.estAccompagnant) {
					lElement.accompagnants.push(aContenu.getLibelle());
				} else {
					lElement.personnels.push(aContenu.getLibelle());
				}
				break;
			case EGenreRessource.Eleve:
				lElement.eleves.push(aContenu.getLibelle());
				break;
			default:
				if (aCours.estRetenue && aContenu.estHoraire) {
					lElement.libelleAria = aContenu.getLibelle();
					lElement.setLibelle(
						'<i class="icon_punition self-center" ></i>' +
							aContenu.getLibelle(),
					);
				} else {
					if (
						aContenu.marqueur &&
						aContenu.marqueur ===
							TypeHttpMarqueurContenuCours.hmcc_ElevesAccompagnes
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
	if (aCours.estAnnule) {
		lElement.styleCours.push("cours-annule");
	} else if (lElement.estPasse) {
		lElement.styleCours.push("greyed");
	}
	if (lElement.estEnCours) {
		lElement.styleCours.push("en-cours");
	}
	if (aCours.estRetenue) {
		lElement.classCss.push("est-retenue");
	}
	if (aParams.joursStage) {
		let lEnStage = false;
		const lStageAM = aParams.joursStage.am;
		const lStagePM = aParams.joursStage.pm;
		const lJourAnnee =
			GDate.getNbrJoursEntreDeuxDates(
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
	if (aCours.NomImageAppelFait && aParams.avecIconeAppel) {
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
	if (aCours.etiquettes) {
		aCours.etiquettes.parcourir((aEtiquette) => {
			lEtiquettes.push(_composeEtiquette(aEtiquette, aParams.indexCours));
		});
	}
	const H = [];
	let lHintImageAppel = "";
	switch (aCours.NomImageAppelFait) {
		case "AppelFait":
			lHintImageAppel = GTraductions.getValeur("EDT.AppelFait");
			break;
		case "AppelNonFait":
			lHintImageAppel = GTraductions.getValeur("EDT.AppelNonFait");
			break;
		case "AppelVerrouNonFait":
			lHintImageAppel = GTraductions.getValeur("EDT.AppelVerrouNonFait");
			break;
	}
	let lLibelle = aCours.getLibelle();
	if (aCours.libelleCours && aCours.libelleCours.getLibelle()) {
		lLibelle += ` - ${aCours.libelleCours.getLibelle()}`;
	}
	H.push(
		tag(
			"li",
			{
				class: [!aCours.estPasDeCours ? "libelle-cours" : "", "flex-contain"],
				"aria-hidden": "true",
			},
			aCours.estDemiPension ? "" : lLibelle,
			aCours.NomImageAppelFait
				? tag("div", {
						class: ["m-left", `Image_${aCours.NomImageAppelFait}`],
						"ie-hint": lHintImageAppel,
					})
				: "",
		),
	);
	H.push(aCours.autreContenu ? tag("li", aCours.autreContenu) : "");
	if (!aCours.estPasse || !aAvecCoursReduit) {
		H.push(
			aCours.professeurs && aCours.professeurs.length > 0
				? tag("li", aCours.professeurs.join(", "))
				: "",
		);
		H.push(
			aCours.classes && aCours.classes.length > 0
				? tag("li", aCours.classes.join(", "))
				: "",
		);
		H.push(
			aCours.groupes && aCours.groupes.length > 0
				? tag("li", aCours.groupes.join(", "))
				: "",
		);
		H.push(
			aCours.partieDeClasse && aCours.partieDeClasse.length > 0
				? tag("li", aCours.partieDeClasse.join(", "))
				: "",
		);
		H.push(
			aCours.personnels && aCours.personnels.length > 0
				? tag("li", aCours.personnels.join(", "))
				: "",
		);
		H.push(
			aCours.accompagnants && aCours.accompagnants.length > 0
				? tag(
						"li",
						tag("i", { class: ["icon_accompagnant p-right-s"] }),
						aCours.accompagnants.join(", "),
					)
				: "",
		);
		H.push(
			aCours.eleves && aCours.eleves.length > 0
				? tag("li", aCours.eleves.join(", "))
				: "",
		);
		H.push(
			aCours.salles && aCours.salles.length > 0
				? tag("li", aCours.salles.join(", "))
				: "",
		);
		H.push(
			aCours.materiels && aCours.materiels.length > 0
				? tag("li", aCours.materiels.join(", "))
				: "",
		);
		if (aCours.memo) {
			let lStr = aCours.memo;
			if (aCours.memoPrive) {
				lStr = `${GTraductions.getValeur("EDT.MemoPublic")} : ${lStr}`;
			}
			const lCss =
				aCours.estSortiePedagogique && !aCours.tabMemosAcc
					? ""
					: "icon_post_it_rempli";
			H.push(
				tag("li", tag("i", { class: [lCss], role: "presentation" }), lStr),
			);
		}
		if (aCours.memoPrive) {
			H.push(
				tag(
					"li",
					tag("i", {
						class: "icon_post_it_rempli mix-icon_pastille_evaluation m-right",
						role: "presentation",
					}),
					`${GTraductions.getValeur("EDT.MemoAdministratif")} : ${aCours.memoPrive}`,
				),
			);
		}
		if (
			aCours.estSortiePedagogique &&
			aCours.tabMemosAcc &&
			aCours.tabMemosAcc.length > 0
		) {
			for (const lMemo of aCours.tabMemosAcc) {
				const lMemoFormat = GChaine.replaceRCToHTML(lMemo);
				H.push(tag("li", lMemoFormat));
			}
		}
	}
	H.push(
		lEtiquettes && lEtiquettes.length > 0
			? tag("li", { class: "container-etiquette" }, lEtiquettes.join(""))
			: "",
	);
	return H.join("");
}
function _composeEtiquette(aEtiquette, aIndexCours) {
	const lBtnVisio =
		aEtiquette.estVisio && aEtiquette.numeroCours
			? GHtml.composeAttr("ie-node", "getNodeVisioCours", [
					aEtiquette.numeroCours,
					aIndexCours,
				])
			: "";
	const H = [];
	if (aEtiquette.Libelle !== "") {
		H.push(
			tag(
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
	const lExclusions = new ObjetListeElements();
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
					lExclusions.addElement({
						libelle: GTraductions.getValeur("EDT.Exclusion.DemiPension"),
						type: TypeExclusion.demipension,
					});
				} else if (aJour.DP.MC) {
					lExclusions.addElement({
						libelle: GTraductions.getValeur("AbsenceVS.mesureConservatoire"),
						type: TypeExclusion.demipension,
					});
				}
			}
			if (aJour.exclusionsClasse) {
				lExclusions.addElement({
					libelle: GTraductions.getValeur("EDT.Exclusion.Classe"),
					type: TypeExclusion.classe,
					debut: aJour.exclusionsClasse.placeDebut,
					fin: aJour.exclusionsClasse.placeFin,
				});
			}
			if (aJour.exclusionsEtab) {
				lExclusions.addElement({
					libelle: aJour.exclusionsEtab.MC
						? GTraductions.getValeur("AbsenceVS.mesureConservatoire")
						: GTraductions.getValeur("EDT.Exclusion.Etablissement"),
					type: TypeExclusion.etablissement,
					debut: aJour.exclusionsEtab.placeDebut,
					fin: aJour.exclusionsEtab.placeFin,
				});
			}
		});
	}
	return lExclusions;
}
function _estExcluDuCours(aCours, aExclusions) {
	let lVoileExlusion = "";
	if (aExclusions) {
		aExclusions.parcourir((aExclusion) => {
			if (aExclusion.type === TypeExclusion.demipension) {
				lVoileExlusion = aCours.estDemiPension
					? "exclusion-" + aExclusion.type
					: "";
				return;
			}
			if (aCours.Debut >= aExclusion.debut && aCours.Debut <= aExclusion.fin) {
				lVoileExlusion = "exclusion-" + aExclusion.type;
			}
		});
	}
	return lVoileExlusion;
}
function _ajouterTrou(aTrou, aParams) {
	const lElement = new ObjetElement("");
	lElement.heureDebut = GDate.formatDate(
		GDate.placeEnDateHeure(aTrou.debut),
		"%xh%sh%mm",
	);
	lElement.heureFin = GDate.formatDate(
		GDate.placeEnDateHeure(aTrou.fin),
		"%xh%sh%mm",
	);
	lElement.debutPlaceJour = aTrou.debut;
	lElement.styleCours = [];
	lElement.styleCours.push("greyed");
	if (aTrou.estDemiPension) {
		lElement.estDemiPension = true;
		lElement.classCss = ["demi-pension"];
		lElement.libelleAria = GTraductions.getValeur("EDT.PauseDejeuner");
		lElement.setLibelle(GTraductions.getValeur("EDT.PauseDejeuner"));
		lElement.ariaLabel = GTraductions.getValeur("EDT.PauseDejeuner");
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
			lElement.finPlaceJour < GParametres.LibellesHeures.count()
				? GParametres.LibellesHeures.getLibelle(lElement.finPlaceJour)
				: "";
		lElement.setLibelle(aTrou.libelle);
		lElement.masquerHeureFin = false;
		lElement.styleCours = [
			TypeGenreDisponibiliteUtil.getClass(aTrou.genrePriorite),
		];
	} else {
		lElement.libelleAria = GTraductions.getValeur("EDT.PasDeCours");
		lElement.setLibelle(GTraductions.getValeur("EDT.PasDeCours"));
		lElement.masquerHeureFin = true;
		lElement.classCss = ["pas-de-cours"];
	}
	return lElement;
}
function _ajouterDisponibilite(aListe, aListeDisponibilites, aDate) {
	if (aListeDisponibilites) {
		aListeDisponibilites.forEach((aDisponibilite) => {
			if (aDate && !GDate.estJourEgal(aDisponibilite.date, aDate)) {
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
module.exports = { UtilitaireEDTJournalier };
