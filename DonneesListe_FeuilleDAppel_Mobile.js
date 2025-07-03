exports.DonneesListe_FeuilleDAppel_Mobile = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetDate_1 = require("ObjetDate");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const tag_1 = require("tag");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_FicheEleve_1 = require("ObjetFenetre_FicheEleve");
const TTypePreparerRepas_1 = require("TTypePreparerRepas");
const TypeIconeFeuilleDAppel_1 = require("TypeIconeFeuilleDAppel");
const AccessApp_1 = require("AccessApp");
class DonneesListe_FeuilleDAppel_Mobile extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aMoteur, aParams) {
		const lParams = Object.assign(
			{ avecDeploiement: false, avecEllipsis: false },
			aParams,
		);
		const lDonnees = aMoteur.listeEleves.getListeElements((aElement) => {
			return aElement.existeNumero();
		});
		super(lDonnees);
		this.applicationScoMobile = (0, AccessApp_1.getApp)();
		this.moteur = aMoteur;
		this.maxMinutes =
			this.moteur && this.moteur.Cours && this.moteur.Cours.duree
				? ObjetDate_1.GDate.nombrePlacesEnMillisecondes(
						this.moteur.Cours.duree,
					) /
					(1000 * 60)
				: 120;
		this.enseignant = aParams.enseignant;
		this.avecInfoClasse = aParams.avecInfoClasse;
		this.callback = aParams.evenement;
		this.setOptions({
			avecDeploiement: lParams.avecDeploiement,
			avecTri: false,
			avecSelection: false,
			avecEvnt_Selection: false,
			avecEvnt_SelectionClick: lParams.avecEvnt_Selection,
			avecBoutonActionLigne: false,
			avecEllipsis: lParams.avecEllipsis,
		});
	}
	getControleur(aInstance, aListe) {
		return $.extend(true, super.getControleur(aInstance, aListe), {
			checkAbsence: {
				getValue: function (aNumero, aGenre) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					const lAbsence = aInstance.getAbsenceSurEnsemblePlaces(
						lEleve,
						aGenre,
					);
					return !!lAbsence;
				},
				setValue: function (aNumero, aGenre) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					const lAbsence = aInstance.getAbsenceSurEnsemblePlaces(
						lEleve,
						aGenre,
					);
					const lObjet = {
						numeroEleve: lEleve.getNumero(),
						placeDebut: aInstance.moteur.placeSaisieDebut,
						placeFin: aInstance.moteur.placeSaisieFin,
						typeAbsence: aGenre,
						typeObservation: null,
						typeSaisie: !!lAbsence
							? Enumere_Etat_1.EGenreEtat.Suppression
							: Enumere_Etat_1.EGenreEtat.Creation,
						eleve: lEleve,
						absence: !!lAbsence ? lAbsence : undefined,
						genreAbsence: aGenre,
						avecSaisieDuree:
							aGenre === Enumere_Ressource_1.EGenreRessource.Retard,
						maxDuree: aInstance.maxMinutes,
					};
					if (aInstance.callback) {
						aInstance.callback(
							DonneesListe_FeuilleDAppel_Mobile.GenreAction.saisieAbsence,
							lObjet,
						);
					}
				},
				getLibelle: function (aNumero, aGenre) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					const lColonne =
						aInstance.moteur.listeColonnes.getElementParGenre(aGenre);
					const lAbsence = aInstance.getAbsenceSurEnsemblePlaces(
						lEleve,
						aGenre,
					);
					const lLibelle = lColonne.getLibelle();
					return `${lLibelle}${aInstance.moteur.estUnSaisieVS(lAbsence) ? ' <i class="icon_vs" role="presentation"></i>' : ""}${!!lAbsence && (aGenre === Enumere_Ressource_1.EGenreRessource.Retard) ? ` ${lAbsence.Duree.toString()}'` : ""}`;
				},
				getDisabled: function (aNumero, aGenre) {
					return !aInstance.moteur.genreAbsenceDEleveEstEditable(
						aNumero,
						aGenre,
					);
				},
				node: function (aNumero, aGenre) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					const lAbsence = aInstance.getAbsenceSurEnsemblePlaces(
						lEleve,
						aGenre,
					);
					const lClass =
						aGenre === Enumere_Ressource_1.EGenreRessource.Absence
							? "avec-absence"
							: "avec-retard";
					const lVS =
						lAbsence && aInstance.moteur.estUnSaisieVS(lAbsence) ? "VS" : "";
					const lNode = $(this.node).parent();
					if (!!lAbsence) {
						lNode.addClass(lClass);
						if (!!lVS) {
							lNode.addClass(lVS);
						}
					} else {
						lNode.removeClass(lClass);
						lNode.removeClass("VS");
					}
				},
			},
			chipsAbsence: {
				event: function (aNumero, aGenre) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					const lAbsence = aInstance.moteur.getAbsence(
						lEleve,
						aGenre,
						aInstance.moteur.placeSaisieDebut,
					);
					const lObjet = {
						numeroEleve: lEleve.getNumero(),
						placeDebut: aInstance.moteur.placeSaisieDebut,
						placeFin: aInstance.moteur.placeSaisieFin,
						typeAbsence: aGenre,
						typeObservation: null,
						typeSaisie: !!lAbsence
							? Enumere_Etat_1.EGenreEtat.Suppression
							: Enumere_Etat_1.EGenreEtat.Creation,
						eleve: lEleve,
						absence: !!lAbsence ? lAbsence : undefined,
						genreAbsence: aGenre,
					};
					if (aInstance.callback) {
						aInstance.callback(
							DonneesListe_FeuilleDAppel_Mobile.GenreAction.saisieAbsence,
							lObjet,
						);
					}
				},
				getLibelle: function (aNumero, aGenre) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					const lColonne =
						aInstance.moteur.listeColonnes.getElementParGenre(aGenre);
					const lAbsence = aInstance.moteur.getAbsence(
						lEleve,
						aGenre,
						aInstance.moteur.placeSaisieDebut,
					);
					return `${lColonne.getLibelle()}${aInstance.moteur.estUnSaisieVS(lAbsence) ? ' <i class="icon_vs" role="presentation"></i>' : ""}${!!lAbsence && (aGenre === Enumere_Ressource_1.EGenreRessource.Retard) ? `${lAbsence.Duree.toString()}'` : ""}`;
				},
				getDisabled: function (aNumero, aGenre) {
					return !aInstance.moteur.genreAbsenceDEleveEstEditable(
						aNumero,
						aGenre,
					);
				},
				node: function (aNumero, aGenre) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					const lAbsence = aInstance.moteur.getAbsence(
						lEleve,
						aGenre,
						aInstance.moteur.placeSaisieDebut,
					);
					const lClass =
						aGenre === Enumere_Ressource_1.EGenreRessource.Absence
							? "avec-absence"
							: "avec-retard";
					const lVS = aInstance.moteur.estUnSaisieVS(lAbsence) ? "VS" : "";
					if (!!lAbsence) {
						$(this.node).addClass(lClass);
						if (!!lVS) {
							$(this.node).addClass(lVS);
						}
					} else {
						$(this.node).removeClass(lClass);
						$(this.node).removeClass("VS");
					}
				},
			},
			retard: {
				getValue: function (aNumero) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					const lRetard = aInstance.moteur.getAbsence(
						lEleve,
						Enumere_Ressource_1.EGenreRessource.Retard,
						aInstance.moteur.placeSaisieDebut,
					);
					if (!!lRetard && lRetard.strDuree === undefined) {
						lRetard.strDuree = lRetard.Duree.toString();
					}
					return !!lRetard ? lRetard.strDuree : "";
				},
				setValue: function (aNumero, aValue) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					const lRetard = aInstance.moteur.getAbsence(
						lEleve,
						Enumere_Ressource_1.EGenreRessource.Retard,
						aInstance.moteur.placeSaisieDebut,
					);
					lRetard.strDuree = aValue;
				},
				exitChange: function (aNumero, aValue) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					const lRetard = aInstance.moteur.getAbsence(
						lEleve,
						Enumere_Ressource_1.EGenreRessource.Retard,
						aInstance.moteur.placeSaisieDebut,
					);
					if (!!lRetard) {
						try {
							let lMinutes = parseInt(aValue);
							if (lMinutes < 1 || lMinutes > aInstance.maxMinutes) {
								GApplication.getMessage().afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
									message: ObjetTraduction_1.GTraductions.getValeur(
										"FenetreDevoir.ValeurComprise",
										[1, aInstance.maxMinutes],
									),
									callback: function () {
										if (lMinutes < 1) {
											lMinutes = 1;
										} else if (lMinutes > aInstance.maxMinutes) {
											lMinutes = aInstance.maxMinutes;
										}
										aInstance.actualiserRetard(lRetard, lMinutes, lEleve);
									},
								});
							} else if (lMinutes !== lRetard.Duree) {
								aInstance.actualiserRetard(lRetard, lMinutes, lEleve);
							}
						} catch (e) {
							lRetard.strDuree = lRetard.Duree
								? lRetard.Duree.toString()
								: aInstance.moteur.dureeRetard.toString();
						}
					}
				},
				getDisabled: function (aNumero) {
					return !aInstance.moteur.genreAbsenceDEleveEstEditable(
						aNumero,
						Enumere_Ressource_1.EGenreRessource.Retard,
					);
				},
				visible: function (aNumero) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					const lRetard = aInstance.moteur.getAbsence(
						lEleve,
						Enumere_Ressource_1.EGenreRessource.Retard,
						aInstance.moteur.placeSaisieDebut,
					);
					return !!lRetard;
				},
			},
			btnAutres: {
				event: function (aNumero, aEvent) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					if (aInstance.callback && !!lEleve) {
						const lObjet = { eleve: lEleve, moteur: aInstance.moteur };
						aInstance.callback(
							DonneesListe_FeuilleDAppel_Mobile.GenreAction.saisieAutres,
							lObjet,
						);
					}
				},
				getDisabled: function (aNumero) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					return (
						lEleve.estExclu ||
						lEleve.estSorti ||
						lEleve.sortiePeda ||
						aInstance.moteur.autorisations.jourConsultUniquement
					);
				},
				visible: function (aNumero) {
					let lNbrsContenu = aInstance.getNombreDAutresAbsences(aNumero);
					return (
						lNbrsContenu > 0 ||
						!aInstance.moteur.autorisations.jourConsultUniquement
					);
				},
			},
			btnAbsenceAutre: {
				event: function (
					aNumero,
					aGenre,
					aNumeroObservation,
					aGenreObservation,
				) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					if (aInstance.callback && !!lEleve) {
						const lObjet = {
							eleve: lEleve,
							moteur: aInstance.moteur,
							genre: aGenre,
							numeroObservation: aNumeroObservation,
							genreObservation: aGenreObservation,
						};
						aInstance.callback(
							DonneesListe_FeuilleDAppel_Mobile.GenreAction.editionAutres,
							lObjet,
						);
					}
				},
				getDisabled: function (aNumero, aGenre) {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					return (
						lEleve.estExclu ||
						lEleve.estSorti ||
						lEleve.sortiePeda ||
						aInstance.moteur.autorisations.jourConsultUniquement ||
						aGenre === Enumere_Ressource_1.EGenreRessource.RepasAPreparer
					);
				},
			},
			getHtmlAutres: function (aNumero) {
				return aInstance.construirePastillesAutresAbsences(aNumero);
			},
			getNodeIconEleve: function (aNumero) {
				$(this.node).eventValidation(function () {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					if (!!lEleve) {
						const lListeIcones =
							aInstance.moteur.getListeIconesElevePourFeuilleDAppel(lEleve);
						const lHtml = (0, tag_1.tag)(
							"ul",
							{ class: ["fa_zone_details_icones"] },
							(aContenu) => {
								lListeIcones.parcourir((aElement) => {
									if (aElement.actif) {
										let lLibelle = aElement.getLibelle();
										if (
											aElement.getGenre() ===
											TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel
												.absentCoursPrecedentDuProf
										) {
											lLibelle = lEleve.hintAbsentAuDernierCours;
										}
										aContenu.push(
											(0, tag_1.tag)(
												"li",
												{ class: ["fa_ligne_info_ico"] },
												(0, tag_1.tag)(
													"div",
													{ class: ["fa_info_icone"] },
													(0, tag_1.tag)("i", {
														class: aElement.class,
														"aria-hidden": "true",
													}),
												),
												(0, tag_1.tag)(
													"span",
													{ class: ["fa_info_libelle"] },
													ObjetChaine_1.GChaine.replaceRCToHTML(lLibelle),
												),
											),
										);
									}
								});
							},
						);
						const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_1.ObjetFenetre,
							{
								pere: this,
								initialiser: function (aInstance) {
									aInstance.setOptionsFenetre({
										titre: `${ObjetTraduction_1.GTraductions.getValeur("Legende")}`,
										listeBoutons: [
											ObjetTraduction_1.GTraductions.getValeur("Fermer"),
										],
										avecScroll: true,
									});
								},
							},
							{ avecTailleSelonContenuMobile: true },
						);
						lFenetre.afficher(lHtml);
					}
				});
			},
			getNodeLibelleEleve: function (aNumero) {
				$(this.node).eventValidation(() => {
					const lEleve =
						aInstance.moteur.listeEleves.getElementParNumero(aNumero);
					const lTitleEleve = [];
					let lLibelleEleve =
						lEleve.Libelle +
						(lEleve.complementInfo ? " " + lEleve.complementInfo : "");
					if (lEleve.absentAuDernierCours) {
						lTitleEleve.push(lEleve.hintAbsentAuDernierCours);
					}
					if (!lEleve.estAttendu) {
						lTitleEleve.push(
							ObjetChaine_1.GChaine.format(
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.AutoriseSortirEtab",
								),
								[lLibelleEleve],
							),
						);
					}
					if (lEleve.sortiePeda) {
						if (lTitleEleve.length === 0) {
							lTitleEleve.push(lLibelleEleve);
						}
						lTitleEleve.push(lEleve.hintSortiePeda);
					}
					if (lTitleEleve.length === 0 && lEleve.strStatut) {
						lTitleEleve.push(lEleve.strStatut);
					}
					if (!!lEleve) {
						ObjetFenetre_FicheEleve_1.ObjetFenetre_FicheEleve.ouvrir({
							instance: this,
							avecRequeteDonnees: true,
							donnees: {
								eleve: lEleve,
								listeEleves: aInstance.moteur.listeEleves,
							},
						});
					}
				});
			},
			getClassInfoSuppl: function (aNumero) {
				const lDemandeDispense = aInstance.moteur.getDemandeDeDispense(aNumero);
				const lDispense = aInstance.moteur.getDispense(aNumero, false);
				const lEstDemandeDispenseRefusee =
					lDemandeDispense &&
					lDemandeDispense.estRefusee &&
					lDemandeDispense.estTraitee;
				if (
					lEstDemandeDispenseRefusee &&
					lDemandeDispense.estRefuseeAnnulable &&
					!lDispense
				) {
					return "fa_eleve_demande_dispense";
				}
				return "fa_eleve_dispense";
			},
			getHtmlInfoSuppl: function (aNumero) {
				const lDispense = aInstance.moteur.getDispense(aNumero, false);
				const lDemandeDispense = aInstance.moteur.getDemandeDeDispense(aNumero);
				const lHtml = [];
				const lLibelleDispense = ObjetTraduction_1.GTraductions.getValeur(
					"Absence.DispenseCour",
				).ucfirst();
				if (!!lDispense && lDispense.existe()) {
					lHtml.push(lLibelleDispense);
				} else if (lDemandeDispense) {
					const lEstDemandeDispenseRefusee =
						lDemandeDispense &&
						lDemandeDispense.estRefusee &&
						lDemandeDispense.estTraitee;
					if (lEstDemandeDispenseRefusee) {
						if (
							!lDemandeDispense.estRefuseeAnnulable &&
							lDemandeDispense.strNomPrenomRefusant
						) {
							lHtml.push(
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.demandeDispense.demandeDispenseRefuseePar",
									[lDemandeDispense.strNomPrenomRefusant],
								),
							);
						} else {
							lHtml.push(
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.demandeDispense.dispenseRefusee",
								),
							);
						}
					} else {
						lHtml.push(
							ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.demandeDispense.demandeDeDispenseATraiter",
							),
						);
					}
				}
				return lHtml.join("");
			},
		});
	}
	actualiserRetard(aRetard, aMinutes, aEleve) {
		aRetard.Duree = aMinutes;
		aRetard.strDuree = aRetard.Duree.toString();
		aRetard.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		const lObjet = {
			numeroEleve: aEleve.getNumero(),
			placeDebut: this.moteur.placeSaisieDebut,
			placeFin: this.moteur.placeSaisieFin,
			typeAbsence: Enumere_Ressource_1.EGenreRessource.Retard,
			typeObservation: null,
			typeSaisie: Enumere_Etat_1.EGenreEtat.Modification,
			eleve: aEleve,
			absence: aRetard,
			genreAbsence: Enumere_Ressource_1.EGenreRessource.Retard,
		};
		if (this.callback) {
			this.callback(
				DonneesListe_FeuilleDAppel_Mobile.GenreAction.saisieAbsence,
				lObjet,
			);
		}
	}
	aLeDroitDeSupprimer(aNumero, aGenre) {
		const lEleve = this.moteur.listeEleves.getElementParNumero(aNumero);
		const lAbsence = this.moteur.getAbsence(
			lEleve,
			aGenre,
			this.moteur.placeSaisieDebut,
		);
		const lAvecSaisie =
			(aGenre === Enumere_Ressource_1.EGenreRessource.Absence
				? this.moteur.autorisations.avecSaisieAbsence
				: this.moteur.autorisations.avecSaisieRetard) ||
			this.moteur.autorisations.suppressionAbsenceDeVS;
		return (
			!!lAbsence &&
			!this.moteur.estUnSaisieVS(lAbsence) &&
			lAvecSaisie &&
			!this.moteur.autorisations.jourConsultUniquement
		);
	}
	getNombreDAutresAbsences(aNumero) {
		let lNbrsContenu = 0;
		for (let i = 0; i < this.moteur.listeColonnes.count(); i++) {
			const lColonne = this.moteur.listeColonnes.get(i);
			if (
				![
					Enumere_Ressource_1.EGenreRessource.RepasAPreparer,
					Enumere_Ressource_1.EGenreRessource.Absence,
					Enumere_Ressource_1.EGenreRessource.Retard,
				].includes(lColonne.getGenre()) &&
				this.moteur.aUneAbsence(
					aNumero,
					lColonne.getGenre(),
					lColonne.getNumero(),
					true,
				) > -1
			) {
				lNbrsContenu++;
			} else if (
				lColonne.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.RepasAPreparer
			) {
				const lAbsence = this.moteur.aUneAbsence(aNumero, lColonne.getGenre());
				const lElementAbsence =
					lAbsence > -1
						? this.moteur.listeEleves
								.getElementParNumero(aNumero)
								.ListeAbsences.get(lAbsence)
						: false;
				if (
					lElementAbsence.type === TTypePreparerRepas_1.TTypePreparerRepas.prOui
				) {
					lNbrsContenu++;
				}
			}
		}
		return lNbrsContenu;
	}
	getAbsenceSurEnsemblePlaces(aEleve, aGenreAbsence) {
		let lAbsence = this.moteur.getAbsence(
			aEleve,
			aGenreAbsence,
			this.moteur.placeSaisieDebut,
		);
		if (!lAbsence) {
			let lDeb = this.moteur.placeSaisieDebut;
			let lFin = this.moteur.placeSaisieFin;
			if (
				lDeb !== null &&
				lDeb !== undefined &&
				lFin !== null &&
				lFin !== undefined &&
				lFin > lDeb
			) {
				for (let i = lDeb + 1; i < lFin + 1; i++) {
					if (!lAbsence) {
						lAbsence = this.moteur.getAbsence(aEleve, aGenreAbsence, i);
					}
				}
			}
		}
		return lAbsence;
	}
	composePastilleDeColonne(aColonne, aNumeroEleve) {
		const lIcon = Enumere_Ressource_1.EGenreRessourceUtil.getIconAbsence(
			aColonne.getGenre(),
			{ genreObservation: aColonne.genreObservation },
		);
		const lClass = [lIcon, "avecFond"];
		if (aColonne.getGenre() === Enumere_Ressource_1.EGenreRessource.Dispense) {
			const lEleve = this.moteur.listeEleves.getElementParNumero(aNumeroEleve);
			const lAbsence = this.moteur.getAbsence(
				lEleve,
				aColonne.getGenre(),
				this.moteur.placeSaisieDebut,
			);
			if (
				!!lAbsence &&
				!!lAbsence.documents &&
				lAbsence.documents.count() > 0
			) {
				lClass.push("iconside-icon_piece_jointe");
			}
		} else if (
			aColonne.getGenre() === Enumere_Ressource_1.EGenreRessource.RepasAPreparer
		) {
			const lEleve = this.moteur.listeEleves.getElementParNumero(aNumeroEleve);
			const lAbsence = this.moteur.getAbsence(lEleve, aColonne.getGenre());
			if (
				!!lAbsence &&
				lAbsence.type === TTypePreparerRepas_1.TTypePreparerRepas.prNon
			) {
				lClass.push("mix-icon_remove");
			}
		}
		return (0, tag_1.tag)(
			"ie-btnicon",
			{
				"ie-model": tag_1.tag.funcAttr("btnAbsenceAutre", [
					aNumeroEleve,
					aColonne.getGenre(),
					aColonne.getNumero(),
					aColonne.genreObservation,
				]),
				"aria-label": aColonne.getLibelle(),
				class: lClass,
				onclick: "event.stopPropagation();",
			},
			"",
		);
	}
	construirePastillesAutresAbsences(aNumero) {
		const lHtml = [];
		let lNbrsContenu = 0;
		const lNombreMax = this.getNombreDAutresAbsences(aNumero);
		if (lNombreMax > 0) {
			const lListe = this.moteur.getListeColonnesTriees();
			for (let i = 0; i < lListe.count(); i++) {
				const lColonne = lListe.get(i);
				if (
					![
						Enumere_Ressource_1.EGenreRessource.RepasAPreparer,
						Enumere_Ressource_1.EGenreRessource.Absence,
						Enumere_Ressource_1.EGenreRessource.Retard,
					].includes(lColonne.getGenre()) &&
					this.moteur.aUneAbsence(
						aNumero,
						lColonne.getGenre(),
						lColonne.getNumero(),
						true,
					) > -1
				) {
					lNbrsContenu++;
					if (lNbrsContenu < 3 || lNombreMax === 3) {
						lHtml.push(this.composePastilleDeColonne(lColonne, aNumero));
					}
					if (lNbrsContenu >= 3) {
						break;
					}
				} else if (
					lColonne.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.RepasAPreparer
				) {
					const lAbsence = this.moteur.aUneAbsence(
						aNumero,
						lColonne.getGenre(),
					);
					const lElementAbsence =
						lAbsence > -1
							? this.moteur.listeEleves
									.getElementParNumero(aNumero)
									.ListeAbsences.get(lAbsence)
							: false;
					if (
						lElementAbsence.type ===
						TTypePreparerRepas_1.TTypePreparerRepas.prOui
					) {
						lNbrsContenu++;
						if (lNbrsContenu < 3 || lNombreMax === 3) {
							lHtml.push(this.composePastilleDeColonne(lColonne, aNumero));
						}
						if (lNbrsContenu >= 3) {
							break;
						}
					}
				}
			}
			if (lNombreMax > 3) {
				lHtml.push(
					(0, tag_1.tag)(
						"ie-btnicon",
						{
							"ie-model": tag_1.tag.funcAttr("btnAutres", [aNumero]),
							"aria-label":
								ObjetTraduction_1.GTraductions.getValeur("Absence.Autres"),
							class: "avecFond fa_btn_plus",
							onclick: "event.stopPropagation();",
						},
						"+" + (lNombreMax - 2),
					),
				);
			}
		}
		return lHtml.join("");
	}
	desactiverIndentationParente() {
		return !this.options.avecDeploiement;
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article
			? (0, tag_1.tag)("div", { class: "fa_zone_eleve" }, (aContenu) => {
					const lClass = ["libelle"];
					if (aParams.article.estSorti) {
						lClass.push("Barre");
					}
					if (aParams.article.eleveAjouteAuCours) {
						lClass.push("Italique");
					}
					const lHtml = [];
					lHtml.push('<div class="fa_libelle_eleve">');
					lHtml.push(
						(0, tag_1.tag)(
							"span",
							{ class: lClass },
							`${aParams.article.getLibelle()}${this.avecInfoClasse ? ` (${aParams.article.strClasse})` : ""}`,
						),
					);
					lHtml.push(
						(0, tag_1.tag)("div", {
							"ie-class": tag_1.tag.funcAttr("getClassInfoSuppl", [
								aParams.article.getNumero(),
							]),
							"ie-texte": tag_1.tag.funcAttr("getHtmlInfoSuppl", [
								aParams.article.getNumero(),
							]),
						}),
					);
					if (aParams.article.estDetache) {
						lHtml.push(
							(0, tag_1.tag)(
								"div",
								{ class: ["fa_eleve_detache"] },
								ObjetChaine_1.GChaine.replaceRCToHTML(
									aParams.article.hintDetache,
									" ",
								),
							),
						);
					} else {
						if (aParams.article.complementInfo) {
							lHtml.push(
								(0, tag_1.tag)(
									"div",
									{ class: ["fa_eleve_exclu"] },
									ObjetChaine_1.GChaine.replaceRCToHTML(
										aParams.article.complementInfo,
										" ",
									),
								),
							);
						} else {
							if (aParams.article.sortiePeda) {
								lHtml.push(
									(0, tag_1.tag)(
										"div",
										{ class: ["fa_eleve_sortiePeda"] },
										ObjetChaine_1.GChaine.replaceRCToHTML(
											aParams.article.hintSortiePeda,
											" ",
										),
									),
								);
							}
							if (!aParams.article.estAttendu) {
								lHtml.push(
									(0, tag_1.tag)(
										"div",
										{ class: ["fa_eleve_strStatut"] },
										ObjetChaine_1.GChaine.format(
											ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.AutoriseSortirEtab",
											),
											[aParams.article.getLibelle()],
										),
									),
								);
							} else if (aParams.article.strStatut) {
								lHtml.push(
									(0, tag_1.tag)(
										"div",
										{ class: ["fa_eleve_strStatut"] },
										ObjetChaine_1.GChaine.replaceRCToHTML(
											aParams.article.strStatut,
											" ",
										),
									),
								);
							}
						}
					}
					lHtml.push("</div>");
					aContenu.push(
						`${this.composePhoto(aParams.article)} ${lHtml.join("")}`,
					);
				})
			: "";
	}
	estLigneOff(aParams) {
		return !!aParams.article && aParams.article.estDetache;
	}
	composePhoto(aEleve) {
		let lAvecPhoto =
			!!aEleve &&
			this.applicationScoMobile.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterPhotosEleves,
			);
		const lLibelle = (aEleve && aEleve.getLibelle()) || "";
		return (0, tag_1.tag)("img", {
			"ie-load-src": lAvecPhoto
				? ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aEleve, {
						libelle: "photo.jpg",
					})
				: false,
			class: `PetitEspaceGauche PetitEspaceDroit img-portrait${aEleve.estDetache ? ` fa_voile` : ""}`,
			style: "width: 3rem;height: 3rem;",
			alt: lLibelle,
			"ie-imgviewer": true,
			"data-libelle": lLibelle,
		});
	}
	composeDetailsIconesEleve(aEleve) {
		const lListeIcones =
			this.moteur.getListeIconesElevePourFeuilleDAppel(aEleve);
		return (0, tag_1.tag)(
			"div",
			{
				class: `fa_zone_icones moteurAbsences${aEleve.estDetache ? ` fa_voile` : ""}`,
				tabindex: "0",
				role: "button",
				"aria-haspopup": "dialog",
				"aria-label": ObjetTraduction_1.GTraductions.getValeur("Legende"),
				"ie-node": tag_1.tag.funcAttr("getNodeIconEleve", [aEleve.getNumero()]),
			},
			(aContenu) => {
				lListeIcones.parcourir((aElement) => {
					if (aElement.actif) {
						aContenu.push(
							(0, tag_1.tag)("i", {
								class: aElement.class,
								title: aElement.getLibelle(),
								"aria-label": aElement.getLibelle(),
							}),
						);
					}
				});
			},
		);
	}
	getZoneComplementaire(aParams) {
		return this.composeDetailsIconesEleve(aParams.article);
	}
	getZoneMessage(aParams) {
		if (!!aParams.article && aParams.article.estDetache) {
			return "";
		} else {
			return (0, tag_1.tag)(
				"div",
				{ class: "fa_zone_saisie" },
				(0, tag_1.tag)(
					"div",
					{ class: "fa_zone_absences" },
					(0, tag_1.tag)("ie-checkbox", {
						"ie-model": tag_1.tag.funcAttr("checkAbsence", [
							aParams.article.getNumero(),
							Enumere_Ressource_1.EGenreRessource.Absence,
						]),
						"ie-icon": "none",
						class: "as-chips fa-chb-absence",
					}),
					(0, tag_1.tag)("ie-checkbox", {
						"ie-model": tag_1.tag.funcAttr("checkAbsence", [
							aParams.article.getNumero(),
							Enumere_Ressource_1.EGenreRessource.Retard,
						]),
						"ie-icon": "none",
						class: "as-chips fa-chb-absence",
					}),
					(0, tag_1.tag)("ie-bouton", {
						"ie-icon": "icon_plus_fin",
						"ie-model": tag_1.tag.funcAttr("btnAutres", [
							aParams.article.getNumero(),
						]),
						"ie-display": tag_1.tag.funcAttr("btnAutres.visible", [
							aParams.article.getNumero(),
						]),
						class: "small-bt themeBoutonNeutre fa_btn_autres",
					}),
				),
				(0, tag_1.tag)("div", {
					class: "fa-zone-autres",
					"ie-html": tag_1.tag.funcAttr("getHtmlAutres", [
						aParams.article.getNumero(),
					]),
				}),
			);
		}
	}
	static getColonnes() {
		return [{ taille: "100%" }];
	}
}
exports.DonneesListe_FeuilleDAppel_Mobile = DonneesListe_FeuilleDAppel_Mobile;
(function (DonneesListe_FeuilleDAppel_Mobile) {
	let GenreAction;
	(function (GenreAction) {
		GenreAction[(GenreAction["saisieAbsence"] = 0)] = "saisieAbsence";
		GenreAction[(GenreAction["saisieAutres"] = 1)] = "saisieAutres";
		GenreAction[(GenreAction["editionAutres"] = 2)] = "editionAutres";
	})(
		(GenreAction =
			DonneesListe_FeuilleDAppel_Mobile.GenreAction ||
			(DonneesListe_FeuilleDAppel_Mobile.GenreAction = {})),
	);
})(
	DonneesListe_FeuilleDAppel_Mobile ||
		(exports.DonneesListe_FeuilleDAppel_Mobile =
			DonneesListe_FeuilleDAppel_Mobile =
				{}),
);
