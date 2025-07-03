exports.PiedDeBulletinMobile = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetTri_1 = require("ObjetTri");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMoteurPiedDeBulletin_1 = require("ObjetMoteurPiedDeBulletin");
const TypeModuleFonctionnelPiedBulletin_1 = require("TypeModuleFonctionnelPiedBulletin");
const TypeGenreParcoursEducatif_1 = require("TypeGenreParcoursEducatif");
const TypeRubriqueOrientation_1 = require("TypeRubriqueOrientation");
const TypeAvisConseil_1 = require("TypeAvisConseil");
const UtilitaireBulletinEtReleve_Mobile_1 = require("UtilitaireBulletinEtReleve_Mobile");
class PiedDeBulletinMobile extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor() {
		super(...arguments);
		this.moteurPdB =
			new ObjetMoteurPiedDeBulletin_1.ObjetMoteurPiedDeBulletin();
		this.donneesContexte = {
			typeContexteBulletin: 0,
			avecSaisie: false,
			typeReleveBulletin: 0,
		};
		this.donneesPiedDeBulletin = null;
		this.donneesAbsences = null;
	}
	construireAffichage() {
		const lHtml = [];
		const lModulesHorsOnglet = this.moteurPdB.getModulesHorsOnglets(
			this.donneesContexte,
		);
		for (let i = 0; i < lModulesHorsOnglet.length; i++) {
			lHtml.push(
				'<div class="PDB_ModuleFonctionnel">',
				this.construireModuleFonctionnel(lModulesHorsOnglet[i]),
				"</div>",
			);
		}
		const lModulesOnglet = this.moteurPdB.getModulesOnglets(
			this.donneesContexte,
		);
		for (let j = 0; j < lModulesOnglet.length; j++) {
			lHtml.push(
				'<div class="PDB_ModuleFonctionnel">',
				this.construireModuleFonctionnel(lModulesOnglet[j]),
				"</div>",
			);
		}
		return lHtml.join("");
	}
	setDonneesContexte(aDonnees) {
		Object.assign(this.donneesContexte, aDonnees);
	}
	setDonneesPiedDeBulletin(aDonnees, aDonneesAbsences) {
		this.donneesPiedDeBulletin = aDonnees;
		this.donneesAbsences = aDonneesAbsences;
	}
	construireModuleFonctionnel(aTypeModuleFonctionnel) {
		const H = [];
		switch (aTypeModuleFonctionnel) {
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_VieScolaire:
				H.push(
					this._construireVieScolaire(
						this.donneesPiedDeBulletin,
						this.donneesAbsences,
					),
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Certificats:
				H.push(this._construireAttestations(this.donneesPiedDeBulletin));
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Appreciations:
				H.push(this._construireListeAppreciations(this.donneesPiedDeBulletin));
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_ParcoursEducatif:
				H.push(this._construireParcoursEducatif(this.donneesPiedDeBulletin));
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Competences:
				H.push(this._construireBilanDeCycle(this.donneesPiedDeBulletin));
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Stages:
				H.push(this._construireStages(this.donneesPiedDeBulletin));
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Orientations:
				H.push(this._construireOrientations(this.donneesPiedDeBulletin));
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Legende:
				H.push(this._construireLegende(this.donneesPiedDeBulletin));
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Projets:
				H.push(this._construireProjets(this.donneesPiedDeBulletin));
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Credits:
				H.push(this._construireCredits(this.donneesPiedDeBulletin));
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Engagements:
				H.push(this._construireEngagements(this.donneesPiedDeBulletin));
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Mentions:
				H.push(this._construireMentions(this.donneesPiedDeBulletin));
				break;
			default:
				break;
		}
		return H.join("");
	}
	_construireVieScolaire(aDonneesPiedDeBulletin, aDonneesAbsences) {
		const lHtml = [];
		lHtml.push(
			'<div class="m-all-xl">',
			UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeVieScolaire(
				aDonneesAbsences,
			),
			"</div>",
		);
		return lHtml.join("");
	}
	_construireAttestations(aDonneesPiedDeBulletin) {
		const lHtml = [];
		if (
			!!aDonneesPiedDeBulletin &&
			!!aDonneesPiedDeBulletin.ListeAttestationsEleve
		) {
			lHtml.push("<div>", '<ul style="display:table;">');
			aDonneesPiedDeBulletin.ListeAttestationsEleve.parcourir(
				(aAttestation) => {
					lHtml.push(
						'<li style="display:table-row;">',
						'<span style="display:table-cell;">- ',
						aAttestation.getLibelle(),
						"</span>",
						'<div class="Italique GrandEspaceGauche">',
						aAttestation.delivree
							? ObjetTraduction_1.GTraductions.getValeur(
									"FicheEleve.delivree",
								) +
									" " +
									ObjetDate_1.GDate.formatDate(
										aAttestation.date,
										"%JJ/%MM/%AAAA",
									)
							: ObjetTraduction_1.GTraductions.getValeur(
									"FicheEleve.nonDelivree",
								),
						"</div>",
						"</li>",
					);
				},
			);
			lHtml.push("</ul>", "</div>");
		}
		return lHtml.join("");
	}
	_construireListeAppreciations(aDonneesPiedDeBulletin) {
		const lHtml = [];
		if (
			!!aDonneesPiedDeBulletin &&
			!!aDonneesPiedDeBulletin.ListeAppreciations
		) {
			if (
				!!aDonneesPiedDeBulletin.ListeAppreciations.commentaires &&
				!!aDonneesPiedDeBulletin.ListeAppreciations.commentaires.count()
			) {
				const lCommentaires =
					aDonneesPiedDeBulletin.ListeAppreciations.commentaires;
				for (
					let i = 0, lNbrCommentaires = lCommentaires.count();
					i < lNbrCommentaires;
					i++
				) {
					const lCommentaire = lCommentaires.get(i);
					if (
						!!lCommentaire.ListeAppreciations &&
						!!lCommentaire.ListeAppreciations.count() &&
						!!lCommentaires.Intitule &&
						lCommentaires.Intitule !== "" &&
						lCommentaire.ListeAppreciations.getTableauLibelles().join(", ") !==
							""
					) {
						lCommentaire.ListeAppreciations.setTri([
							ObjetTri_1.ObjetTri.init("Genre"),
						]);
						lCommentaire.ListeAppreciations.trier();
						lHtml.push(
							UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
								{
									intituleDAppreciation: lCommentaires.Intitule,
									contenuDAppreciation:
										lCommentaire.ListeAppreciations.getTableauLibelles().join(
											", ",
										),
								},
							),
						);
					}
				}
			}
			if (
				!!aDonneesPiedDeBulletin.ListeAppreciations.conseilDeClasse &&
				!!aDonneesPiedDeBulletin.ListeAppreciations.conseilDeClasse.count()
			) {
				const lAppreciationsConseilDeClasse =
					aDonneesPiedDeBulletin.ListeAppreciations.conseilDeClasse;
				for (
					let i = 0,
						lNbrAppreciationConseilDeClasse =
							lAppreciationsConseilDeClasse.count();
					i < lNbrAppreciationConseilDeClasse;
					i++
				) {
					const lAppConseilDeClass = lAppreciationsConseilDeClasse.get(i);
					if (
						!!lAppConseilDeClass.ListeAppreciations &&
						!!lAppConseilDeClass.ListeAppreciations.count() &&
						!!lAppConseilDeClass.Intitule &&
						lAppConseilDeClass.Intitule !== "" &&
						lAppConseilDeClass.ListeAppreciations.getTableauLibelles().join(
							", ",
						) !== ""
					) {
						lAppConseilDeClass.ListeAppreciations.setTri([
							ObjetTri_1.ObjetTri.init("Genre"),
						]);
						lAppConseilDeClass.ListeAppreciations.trier();
						lHtml.push(
							UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
								{
									intituleDAppreciation: lAppConseilDeClass.Intitule,
									contenuDAppreciation:
										lAppConseilDeClass.ListeAppreciations.getTableauLibelles().join(
											", ",
										),
								},
							),
						);
					}
				}
			}
			if (
				!!aDonneesPiedDeBulletin.ListeAppreciations.cpe &&
				!!aDonneesPiedDeBulletin.ListeAppreciations.cpe.count()
			) {
				const lAppreciationsCpe = aDonneesPiedDeBulletin.ListeAppreciations.cpe;
				for (
					let i = 0, lNbrAppreciationsCpe = lAppreciationsCpe.count();
					i < lNbrAppreciationsCpe;
					i++
				) {
					const lAppCpe = lAppreciationsCpe.get(i);
					if (
						!!lAppCpe.ListeAppreciations &&
						!!lAppCpe.ListeAppreciations.count() &&
						!!lAppCpe.Intitule &&
						lAppCpe.Intitule !== "" &&
						lAppCpe.ListeAppreciations.getTableauLibelles().join(", ") !== ""
					) {
						lAppCpe.ListeAppreciations.setTri([
							ObjetTri_1.ObjetTri.init("Genre"),
						]);
						lAppCpe.ListeAppreciations.trier();
						lHtml.push(
							UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
								{
									intituleDAppreciation: lAppCpe.Intitule,
									contenuDAppreciation:
										lAppCpe.ListeAppreciations.getTableauLibelles().join(", "),
								},
							),
						);
					}
				}
			}
			if (
				!!aDonneesPiedDeBulletin.ListeAppreciations.general &&
				!!aDonneesPiedDeBulletin.ListeAppreciations.general.count()
			) {
				const lAppreciationsGeneral =
					aDonneesPiedDeBulletin.ListeAppreciations.general;
				for (
					let i = 0, lNbrAppreciationsGeneral = lAppreciationsGeneral.count();
					i < lNbrAppreciationsGeneral;
					i++
				) {
					const lAppGeneral = lAppreciationsGeneral.get(i);
					if (
						!!lAppGeneral.ListeAppreciations &&
						!!lAppGeneral.ListeAppreciations.count() &&
						!!lAppGeneral.Intitule &&
						lAppGeneral.Intitule !== "" &&
						lAppGeneral.ListeAppreciations.getTableauLibelles().join(", ") !==
							""
					) {
						lAppGeneral.ListeAppreciations.setTri([
							ObjetTri_1.ObjetTri.init("Genre"),
						]);
						lAppGeneral.ListeAppreciations.trier();
						lHtml.push(
							UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
								{
									intituleDAppreciation: lAppGeneral.Intitule,
									contenuDAppreciation:
										lAppGeneral.ListeAppreciations.getTableauLibelles().join(
											", ",
										),
								},
							),
						);
					}
				}
			}
		}
		return lHtml.join("");
	}
	_construireParcoursEducatif(aDonneesPiedDeBulletin) {
		const lHtml = [];
		if (!!aDonneesPiedDeBulletin) {
			const lListeGenresParcoursPublies =
				new ObjetListeElements_1.ObjetListeElements();
			if (!!aDonneesPiedDeBulletin.listeGenreParcours) {
				aDonneesPiedDeBulletin.listeGenreParcours.parcourir((D) => {
					if (!!D && D.autorise) {
						lListeGenresParcoursPublies.addElement(D);
					}
				});
			}
			const lListeParcoursEducatifs =
				new ObjetListeElements_1.ObjetListeElements();
			if (!!aDonneesPiedDeBulletin.listeEvntsParcoursPeda) {
				aDonneesPiedDeBulletin.listeEvntsParcoursPeda.parcourir((D) => {
					if (!!D && !!D.Descr) {
						lListeParcoursEducatifs.addElement(D);
					}
				});
			}
			if (
				lListeParcoursEducatifs.count() > 0 &&
				lListeGenresParcoursPublies.count() > 0
			) {
				lHtml.push('<div class="notes-data-conteneur">');
				let lCumulGenreParcoursVide;
				lListeGenresParcoursPublies.parcourir((aGenreParcoursEducatif) => {
					lCumulGenreParcoursVide = false;
					lListeParcoursEducatifs.parcourir((aParcoursEducatif) => {
						if (
							aParcoursEducatif.getGenre() === aGenreParcoursEducatif.getGenre()
						) {
							if (!lCumulGenreParcoursVide) {
								lHtml.push(
									'<div class="libelle">',
									TypeGenreParcoursEducatif_1.TypeGenreParcoursEducatifUtil.getLibelle(
										aGenreParcoursEducatif.getGenre(),
									),
									"</div>",
								);
								lCumulGenreParcoursVide = true;
							}
							lHtml.push(
								'<div class="taille-s m-bottom">',
								ObjetDate_1.GDate.formatDate(
									aParcoursEducatif.Date,
									" " +
										ObjetTraduction_1.GTraductions.getValeur("Le") +
										" %JJ/%MM/%AA",
								),
								aParcoursEducatif.SuiviPar !== ""
									? "&nbsp-&nbsp;" +
											ObjetChaine_1.GChaine.format(
												ObjetTraduction_1.GTraductions.getValeur(
													"ParcoursPeda.colonne.suiviParS",
												),
												[aParcoursEducatif.SuiviPar],
											)
									: "",
								"</div>",
								'<div class="descriptif">',
								aParcoursEducatif.Descr,
								"</div>",
							);
						}
					});
				});
				lHtml.push("</div>");
			}
		}
		return lHtml.join("");
	}
	_construireBilanDeCycle(aDonneesPiedDeBulletin) {
		const lHtml = [];
		if (
			!!aDonneesPiedDeBulletin &&
			!!aDonneesPiedDeBulletin.listePiliers &&
			aDonneesPiedDeBulletin.listePiliers.count()
		) {
			lHtml.push('<div class="notes-data-conteneur">');
			lHtml.push(
				'<div class="libelle">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.BilansDeCycle",
					) +
					"</div>",
			);
			lHtml.push('<ul class="liste-piliers">');
			aDonneesPiedDeBulletin.listePiliers.parcourir((aPilier) => {
				if (aPilier.getGenre() === Enumere_Ressource_1.EGenreRessource.Pilier) {
					const lNiveauDAcquisition =
						GParametres.listeNiveauxDAcquisitions.getElementParElement(
							aPilier.niveauDAcquisition,
						);
					lHtml.push(
						"<li>",
						'<div class="fluid-contain">',
						aPilier.getLibelle(),
						"</div>",
						'<div class="fix-bloc">',
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lNiveauDAcquisition,
						),
						"</div>",
						"</li>",
					);
				} else {
					lHtml.push(
						'<li class="libelle-pilier">',
						aPilier.getLibelle(),
						"</li>",
					);
				}
			});
			lHtml.push("</ul>");
			lHtml.push("</div>");
		}
		return lHtml.join("");
	}
	_construireStages(aDonneesPiedDeBulletin) {
		const lHtml = [];
		if (!!aDonneesPiedDeBulletin && !!aDonneesPiedDeBulletin.listeStages) {
			aDonneesPiedDeBulletin.listeStages.parcourir((aStage) => {
				aStage.listeDemandeurs = new ObjetListeElements_1.ObjetListeElements();
				if (!!aStage.listeProfesseurs) {
					aStage.listeDemandeurs.add(aStage.listeProfesseurs);
				}
				if (aStage.listeMaitresDeStage) {
					aStage.listeDemandeurs.add(aStage.listeMaitresDeStage);
				}
				const lExisteDemandeurs =
					!!aStage.listeDemandeurs && aStage.listeDemandeurs.count() > 0;
				lHtml.push('<div class="notes-data-conteneur">');
				if (!!aStage.session) {
					lHtml.push('<div class="libelle">', aStage.session, "</div>");
				}
				const lLibelleStage = [
					'<div class="medium">' + aStage.getLibelle() + "</div>",
				];
				if (!!aStage.dateInterruption) {
					lLibelleStage.push(
						'<div class="sous-libelle"> (',
						ObjetTraduction_1.GTraductions.getValeur("stage.InterrompuLe"),
						" ",
						ObjetDate_1.GDate.formatDate(
							aStage.dateInterruption,
							"%JJ/%MM/%AAAA",
						),
						")</div>",
					);
				}
				lHtml.push(
					'<div class="descriptif">',
					lLibelleStage.join(""),
					"</div>",
				);
				if (lExisteDemandeurs) {
					let existeAppreciations = false;
					for (
						let i = 0, lNbrDemandeur = aStage.listeDemandeurs.count();
						i < lNbrDemandeur;
						i++
					) {
						const lDemandeur = aStage.listeDemandeurs.get(i);
						if (
							(!!lDemandeur.getLibelle() || !!lDemandeur.appreciation) &&
							!existeAppreciations
						) {
							lHtml.push('<ul class="liste-stages browser-default">');
							existeAppreciations = true;
						}
						if (!!lDemandeur.getLibelle() || !!lDemandeur.appreciation) {
							lHtml.push("<li>");
							lHtml.push("<div>", lDemandeur.getLibelle(), "</div>");
							lHtml.push(
								'<div class="semi-bold">',
								lDemandeur.appreciation,
								"</div>",
							);
							lHtml.push("</li>");
						}
						if (
							i === aStage.listeDemandeurs.count() - 1 &&
							!!existeAppreciations
						) {
							lHtml.push("</ul>");
						}
					}
				}
				lHtml.push("</div>");
			});
		}
		return lHtml.join("");
	}
	_construireOrientations(aDonneesPiedDeBulletin) {
		const lHtml = [];
		if (!!aDonneesPiedDeBulletin) {
			const lObjetOrientation = aDonneesPiedDeBulletin.Orientation;
			if (
				!!lObjetOrientation &&
				!!lObjetOrientation.listeRubriques &&
				lObjetOrientation.listeRubriques.count() > 0
			) {
				lHtml.push('<div class="notes-data-conteneur">');
				const construitStrLibelleVoeuOrientation = function (aVoeuOrientation) {
					const lStrOrientation = [];
					if (!!aVoeuOrientation) {
						if (!!aVoeuOrientation.orientation) {
							lStrOrientation.push(aVoeuOrientation.orientation.getLibelle());
						} else if (!!aVoeuOrientation.commentaire) {
							lStrOrientation.push(aVoeuOrientation.commentaire);
						}
						if (!!aVoeuOrientation.listeSpecialites) {
							aVoeuOrientation.listeSpecialites.parcourir((aSpe) => {
								if (!!aSpe && !!aSpe.code) {
									lStrOrientation.push(aSpe.code);
								}
							});
						}
					}
					return lStrOrientation.join(" - ");
				};
				lObjetOrientation.listeRubriques.parcourir((aRubrique) => {
					if (
						aRubrique.getGenre() ===
							TypeRubriqueOrientation_1.TypeRubriqueOrientation
								.RO_IntentionFamille ||
						aRubrique.getGenre() ===
							TypeRubriqueOrientation_1.TypeRubriqueOrientation.RO_VoeuDefinitif
					) {
						if (!!aRubrique.listeVoeux && aRubrique.listeVoeux.count() > 0) {
							let lTitreBloc;
							if (
								aRubrique.getGenre() ===
								TypeRubriqueOrientation_1.TypeRubriqueOrientation
									.RO_IntentionFamille
							) {
								lTitreBloc = ObjetTraduction_1.GTraductions.getValeur(
									"Orientation.Ressources.IntentionsEtAvisProvisoire",
								);
							} else {
								lTitreBloc = ObjetTraduction_1.GTraductions.getValeur(
									"Orientation.Ressources.ChoixEtPropositions",
								);
							}
							lHtml.push('<div class="libelle">', lTitreBloc, "</div>");
							lHtml.push('<div class="descriptif">');
							aRubrique.listeVoeux.parcourir((aVoeu) => {
								lHtml.push(
									'<div class="m-bottom-xl"><div class="libelle-voeux">',
									construitStrLibelleVoeuOrientation(aVoeu),
									"</div>",
								);
								if (!!aVoeu.avecStagePasserelleFamille) {
									lHtml.push(
										' <div class="sous-libelle">(',
										ObjetTraduction_1.GTraductions.getValeur(
											"Orientation.Ressources.DemandeStagePasserelle",
										),
										")</div>",
									);
								}
								if (!!aVoeu.reponseCC || !!aVoeu.motivation) {
									lHtml.push(
										'<div class="m-top-l flex-center flex-contain flex-gap">',
									);
									if (!!aVoeu.reponseCC) {
										let lAvisLibelle =
											TypeAvisConseil_1.TypeAvisConseilUtil.getLibelle(
												aVoeu.reponseCC,
											);
										if (
											aRubrique.getGenre() ===
											TypeRubriqueOrientation_1.TypeRubriqueOrientation
												.RO_VoeuDefinitif
										) {
											lAvisLibelle =
												TypeAvisConseil_1.TypeAvisConseilUtil.getLibelleOuiNon(
													aVoeu.reponseCC,
												);
										}
										lHtml.push(
											'<span class="Bloc_TypeAvisConseil TypeAvis_',
											aVoeu.reponseCC,
											'">',
											lAvisLibelle || "",
											"</span>",
										);
									}
									if (aVoeu.motivation) {
										lHtml.push(aVoeu.motivation);
									}
									if (aVoeu.avecStagePasserelleConseil) {
										lHtml.push(
											" (",
											ObjetTraduction_1.GTraductions.getValeur(
												"Orientation.Ressources.StagePasserellePropose",
											),
											")",
										);
									}
									lHtml.push("</div>");
								}
								lHtml.push("</div>");
							});
						}
					} else {
						const lPremierVoeu =
							!!aRubrique.listeVoeux && aRubrique.listeVoeux.count() > 0
								? aRubrique.listeVoeux.getPremierElement()
								: null;
						if (!!lPremierVoeu) {
							lHtml.push(
								'<div class="libelle">',
								aRubrique.getLibelle(),
								"</div>",
								'<div class="descriptif">',
								'<div class="m-bottom-xl"><div class="libelle-voeux">',
								construitStrLibelleVoeuOrientation(lPremierVoeu),
								"</div>",
							);
							if (!!lPremierVoeu.avecStagePasserelleConseil) {
								lHtml.push(
									' <div class="sous-libelle">(',
									ObjetTraduction_1.GTraductions.getValeur(
										"Orientation.Ressources.StagePasserellePropose",
									),
									")</div>",
								);
							}
							lHtml.push("</div></div>");
						}
					}
				});
				lHtml.push("</div>");
			}
		}
		return lHtml.join("");
	}
	_construireLegende(aDonneesPiedDeBulletin) {
		const lHtml = [];
		if (!!aDonneesPiedDeBulletin && !!aDonneesPiedDeBulletin.legende) {
			lHtml.push(
				'<div class="Italique Espace">',
				aDonneesPiedDeBulletin.legende,
				"</div>",
			);
		}
		return lHtml.join("");
	}
	_construireProjets(aDonneesPiedDeBulletin) {
		const lHtml = [];
		if (!!aDonneesPiedDeBulletin && !!aDonneesPiedDeBulletin.ListeProjets) {
			lHtml.push('<div class="Espace">');
			if (aDonneesPiedDeBulletin.ListeProjets.count() > 0) {
				lHtml.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.Projets.Detail",
						[
							aDonneesPiedDeBulletin.ListeProjets.getTableauLibelles().join(
								", ",
							),
						],
					),
				);
			} else {
				lHtml.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.Projets.Aucun",
					),
				);
			}
			lHtml.push("</div>");
		}
		return lHtml.join("");
	}
	_construireCredits(aDonneesPiedDeBulletin) {
		const lHtml = [];
		if (!!aDonneesPiedDeBulletin && !!aDonneesPiedDeBulletin.listeCredits) {
			aDonneesPiedDeBulletin.listeCredits.parcourir((D) => {
				if (!!D && !!D.credits) {
					lHtml.push(
						"<div><span>",
						D.getLibelle(),
						"</span> <span>",
						D.credits,
						"</span></div>",
					);
				}
			});
		}
		return lHtml.join("");
	}
	_construireEngagements(aDonneesPiedDeBulletin) {
		const H = [];
		if (aDonneesPiedDeBulletin.listeEngagements) {
			let lLibelle = ObjetTraduction_1.GTraductions.getValeur(
				"PiedDeBulletin.AucunEngagement",
			);
			if (aDonneesPiedDeBulletin.listeEngagements.count()) {
				lLibelle = aDonneesPiedDeBulletin.listeEngagements
					.getTableauLibelles()
					.join(", ");
			}
			H.push(
				`<div class="notes-data-conteneur"><p><span class="semi-bold"> ${ObjetTraduction_1.GTraductions.getValeur("PiedDeBulletin.Engagements")}</span> : ${lLibelle}</p></div>`,
			);
		}
		return H.join("");
	}
	_construireMentions(aDonneesPiedDeBulletin) {
		const H = [];
		if (
			aDonneesPiedDeBulletin.ListeMentionsClasse &&
			aDonneesPiedDeBulletin.ListeMentionsClasse.count()
		) {
			let lLibelle = [];
			aDonneesPiedDeBulletin.ListeMentionsClasse.parcourir((aMention) => {
				lLibelle.push(`${aMention.Nombre} ${aMention.getLibelle()}`);
			});
			H.push(
				`<div class="notes-data-conteneur"><p><span class="semi-bold"> ${ObjetTraduction_1.GTraductions.getValeur("Appreciations.Mentions")}</span> : ${lLibelle.join(", ")}</p></div>`,
			);
		}
		return H.join("");
	}
}
exports.PiedDeBulletinMobile = PiedDeBulletinMobile;
