exports.WidgetElections = void 0;
const ObjetRequeteSaisieElectionVotant_1 = require("ObjetRequeteSaisieElectionVotant");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetDate_1 = require("ObjetDate");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const TypeGenreCandidatElection_1 = require("TypeGenreCandidatElection");
const Enumere_FormatDocJoint_1 = require("Enumere_FormatDocJoint");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetElections extends ObjetWidget_1.Widget.ObjetWidget {
	construire(aParams) {
		this.donnees = aParams.donnees;
		if (
			this.donnees.listeElections &&
			this.donnees.listeElections.count() > 0
		) {
			this.donnees.listeElections.setTri([
				ObjetTri_1.ObjetTri.init("dateDebut"),
				ObjetTri_1.ObjetTri.init("dateFin"),
			]);
			this.donnees.listeElections.trier();
			const lWidget = {
				html: this.composeWidgetElections(),
				nbrElements: this.donnees.listeElections.count(),
				afficherMessage: this.donnees.listeElections.count() === 0,
			};
			$.extend(true, this.donnees, lWidget);
		}
		aParams.construireWidget(this.donnees);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			rdChoixCandidat: {
				getValue(aIndiceElection, aIndiceCandidat) {
					if (!aInstance.donnees) {
						return false;
					}
					const lElection =
						aInstance.donnees.listeElections.get(aIndiceElection);
					const lCandidat = lElection.candidats.get(aIndiceCandidat);
					if (!lElection.vote || lElection.vote.count() === 0) {
						return false;
					} else {
						return !!lElection.vote.getElementParNumero(lCandidat.getNumero());
					}
				},
				setValue(aIndiceElection, aIndiceCandidat, aValue) {
					if (!aInstance.donnees) {
						return false;
					}
					const lElection =
						aInstance.donnees.listeElections.get(aIndiceElection);
					const lCandidat = lElection.candidats.get(aIndiceCandidat);
					if (aValue) {
						lElection.vote = new ObjetListeElements_1.ObjetListeElements();
						lElection.vote.addElement(lCandidat);
					}
				},
			},
			cbChoixCandidat: {
				getValue(aIndiceElection, aIndiceCandidat) {
					if (!aInstance.donnees) {
						return false;
					}
					const lElection =
						aInstance.donnees.listeElections.get(aIndiceElection);
					const lCandidat = lElection.candidats.get(aIndiceCandidat);
					if (!lElection.vote || lElection.vote.count() === 0) {
						return false;
					} else {
						return !!lElection.vote.getElementParNumero(lCandidat.getNumero());
					}
				},
				setValue(aIndiceElection, aIndiceCandidat, aValue) {
					if (!aInstance.donnees) {
						return false;
					}
					const lElection =
						aInstance.donnees.listeElections.get(aIndiceElection);
					const lCandidat = lElection.candidats.get(aIndiceCandidat);
					if (!lElection.vote) {
						lElection.vote = new ObjetListeElements_1.ObjetListeElements();
					}
					const lNumero = lCandidat.getNumero();
					const lIndice = lElection.vote.getIndiceElementParFiltre(
						(aElement) => {
							return aElement.getNumero() === lNumero;
						},
					);
					if (aValue) {
						if (lIndice === -1) {
							lElection.vote.addElement(lCandidat);
						}
					} else {
						if (lIndice !== -1) {
							lElection.vote.remove(lIndice);
						}
					}
				},
				getDisabled(aIndiceElection, aIndiceCandidat) {
					if (!aInstance.donnees || !aInstance.donnees.listeElections) {
						return false;
					}
					const lElection =
						aInstance.donnees.listeElections.get(aIndiceElection);
					if (!lElection || !lElection.vote) {
						return false;
					} else {
						const lCandidat = lElection.candidats.get(aIndiceCandidat);
						const lNumero = lCandidat.getNumero();
						const lCandidatEstSelectionne =
							lElection.vote.getIndiceElementParFiltre((aElement) => {
								return aElement.getNumero() === lNumero;
							}) > -1;
						return (
							lElection.vote.count() >= lElection.nbMaxChoix &&
							!lCandidatEstSelectionne
						);
					}
				},
			},
			btnAfficherConstitutionListe(aIndiceElection, aIndiceCandidat) {
				$(this.node).on({
					click: function () {
						if (aInstance.donnees && aInstance.donnees.listeElections) {
							const lElection =
								aInstance.donnees.listeElections.get(aIndiceElection);
							const lListeCandidate = lElection.candidats.get(aIndiceCandidat);
							if (
								lListeCandidate &&
								lListeCandidate.membres &&
								lListeCandidate.membres.count() > 0
							) {
								lListeCandidate.membres.trier();
								const lHtml = [];
								lHtml.push(
									"<div>",
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.elections.constitutionDeLaListe",
										[lListeCandidate.getLibelle()],
									),
									"</div>",
								);
								lHtml.push('<div class="Espace">');
								lHtml.push("<ul>");
								lListeCandidate.membres.parcourir((aMembreDeListeCandidate) => {
									lHtml.push("<li>");
									lHtml.push(aMembreDeListeCandidate.getLibelle());
									if (!!aMembreDeListeCandidate.statut) {
										lHtml.push(
											' - <span class="Gras">',
											aMembreDeListeCandidate.statut,
											"</span>",
										);
									}
									lHtml.push("</li>");
								});
								lHtml.push("</ul>");
								lHtml.push("</div>");
								GApplication.getMessage().afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
									titre: ObjetTraduction_1.GTraductions.getValeur(
										"accueil.elections.candidatsConstitutifsDesListes",
									),
									message: lHtml.join(""),
								});
							}
						}
						return false;
					},
				});
			},
			btnVote: {
				event(aIndiceElection) {
					if (aInstance.donnees && aInstance.donnees.listeElections) {
						const lElection =
							aInstance.donnees.listeElections.get(aIndiceElection);
						if (
							lElection.nbMaxChoix === 1 &&
							(!lElection.vote || lElection.vote.count() === 0)
						) {
							GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"accueil.elections.aucunChoixEffectue",
								),
							});
						} else {
							const lElectionPourVote = ObjetElement_1.ObjetElement.create({
								Libelle: lElection.getLibelle(),
								Numero: lElection.getNumero(),
								Genre: lElection.getGenre(),
							});
							if (!lElection.vote && lElection.nbMaxChoix > 1) {
								lElection.vote = new ObjetListeElements_1.ObjetListeElements();
							}
							lElectionPourVote.vote = MethodesObjet_1.MethodesObjet.dupliquer(
								lElection.vote,
							);
							const lHtml = [];
							lHtml.push(
								"<div>",
								ObjetTraduction_1.GTraductions.getValeur(
									"accueil.elections.confirmationVote",
									[lElection.getLibelle()],
								),
								"</div>",
							);
							lHtml.push('<div class="Espace">');
							lHtml.push("<ul>");
							if (lElection.vote.count() === 0 && lElection.nbMaxChoix > 1) {
								lHtml.push(
									"<li>",
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.elections.neSePrononcePas",
									),
									"</li>",
								);
							}
							for (let i = 0; i < lElection.vote.count(); i++) {
								lHtml.push("<li>", lElection.vote.getLibelle(i), "</li>");
							}
							lHtml.push("</ul>");
							lHtml.push("</div>");
							GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: lHtml.join(""),
								listeBoutons: [
									{
										libelle: ObjetTraduction_1.GTraductions.getValeur("Oui"),
										theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
										genreAction: Enumere_Action_1.EGenreAction.Valider,
									},
									{
										libelle: ObjetTraduction_1.GTraductions.getValeur("Non"),
										theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
										genreAction: Enumere_Action_1.EGenreAction.NePasValider,
									},
								],
								callback: (aAccepte) => {
									if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
										new ObjetRequeteSaisieElectionVotant_1.ObjetRequeteSaisieElectionVotant(
											aInstance,
											aInstance.actionApresSaisieVotant.bind(
												aInstance,
												lElectionPourVote.getLibelle(),
											),
										).lancerRequete({ election: lElectionPourVote });
									}
								},
							});
						}
					}
				},
			},
		});
	}
	composeWidgetElections() {
		const H = [];
		if (
			!!this.donnees.listeElections &&
			this.donnees.listeElections.count() > 0
		) {
			for (let I = 0; I < this.donnees.listeElections.count(); I++) {
				const lElement = this.donnees.listeElections.get(I);
				H.push(this.composeElection(lElement, I));
			}
		}
		return H.join("");
	}
	composeElection(aElection, aIndiceElection) {
		const H = [];
		const lID = this.donnees.id + "_div_" + aIndiceElection;
		const lTitre =
			aElection.getLibelle() ||
			ObjetTraduction_1.GTraductions.getValeur("accueil.elections.sansTitre");
		H.push('<fieldset id="', lID, '" tabindex="-1">');
		const lFormat = "%JJ %MMMM %AAAA";
		if (aElection.ouvert) {
			H.push(
				'<legend class="vote-header">',
				"<h3>",
				lTitre,
				"</h3>",
				"<p>",
				ObjetTraduction_1.GTraductions.getValeur(
					"accueil.elections.voteOuvertDuAu",
					[
						ObjetDate_1.GDate.formatDate(aElection.dateDebut, lFormat),
						ObjetDate_1.GDate.formatDate(aElection.dateFin, lFormat),
					],
				),
				"</p>",
			);
			if (aElection.description) {
				H.push(aElection.description);
			}
			if (aElection.nbMaxChoix > 1) {
				H.push(
					'<p class="nombre-choix">',
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.elections.nbMaxChoix",
						["<span>" + aElection.nbMaxChoix + "</span>"],
					),
					"</p>",
				);
			}
			H.push("</legend>");
			if (aElection.documents && aElection.documents.count() > 0) {
				H.push('<div class="vote-files">');
				aElection.documents.parcourir((aDocument) => {
					const lSuffixe = ObjetChaine_1.GChaine.extraireExtensionFichier(
						aDocument.getLibelle(),
					);
					const lTypefile =
						Enumere_FormatDocJoint_1.EFormatDocJointUtil.getClassIconDeGenre(
							Enumere_FormatDocJoint_1.EFormatDocJointUtil.getGenreDeFichier(
								lSuffixe,
							),
						);
					const lLienDocument = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
						aDocument,
						{
							genreRessource:
								Enumere_Ressource_1.EGenreRessource.DocJointEtablissement,
						},
					);
					H.push(
						'<a href="',
						lLienDocument,
						'" class="icon ' + lTypefile + '">',
						aDocument.getLibelle(),
						"</a>",
					);
				});
				H.push("</div>");
			}
			H.push(this.composeListeCandidats(aElection, aIndiceElection));
			H.push(
				'<div class="vote-footer">',
				'<ie-bouton  ie-model="btnVote(',
				aIndiceElection,
				')">',
				ObjetTraduction_1.GTraductions.getValeur("accueil.elections.voter"),
				"</ie-bouton>",
				"</div>",
			);
		} else {
			H.push(
				'<legend class="vote-header">',
				"<h3>",
				ObjetTraduction_1.GTraductions.getValeur(
					"accueil.elections.prochainementOuverture",
				),
				" : <br />",
				lTitre,
				"</h3>",
				"<p>",
				ObjetTraduction_1.GTraductions.getValeur(
					"accueil.elections.leVoteSeraOuvertDuAu",
					[
						ObjetDate_1.GDate.formatDate(aElection.dateDebut, lFormat),
						ObjetDate_1.GDate.formatDate(aElection.dateFin, lFormat),
					],
				),
				"</p>",
				"</legend>",
			);
		}
		H.push("</fieldset>");
		return H.join("");
	}
	composeListeCandidats(aElection, aIndiceElection) {
		const H = [];
		if (!!aElection.candidats && aElection.candidats.count() > 0) {
			H.push('<ul class="liste-clickable one-line">');
			aElection.candidats.parcourir((aCandidat, aIndiceCandidat) => {
				H.push(
					"<li>",
					this._composeCandidat(
						aCandidat,
						aIndiceElection,
						aIndiceCandidat,
						aElection.nbMaxChoix > 1,
					),
					"</li>",
				);
			});
			H.push("</ul>");
		}
		return H.join("");
	}
	actionApresSaisieVotant(aTitreElection, aJSONRapport) {
		if (
			aJSONRapport.genreReponse ===
				ObjetRequeteJSON_1.EGenreReponseSaisie.succes &&
			aJSONRapport.JSONRapportSaisie.vote
		) {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				titre: aTitreElection,
				message:
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.elections.votePrisEnCompte",
					) +
					"<br />" +
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.elections.merciParticipation",
					),
				callback: () => {
					this.callback.appel(
						this.donnees.genre,
						Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
					);
				},
			});
		}
	}
	_composeCandidat(
		aCandidat,
		aIndiceElection,
		aIndiceCandidat,
		aAvecChoixMultiple,
	) {
		let lChoixCandidat;
		if (!aAvecChoixMultiple) {
			lChoixCandidat = this._composeRadioCandidat(
				aCandidat,
				aIndiceElection,
				aIndiceCandidat,
			);
		} else {
			lChoixCandidat = this._composeCBCandidat(
				aCandidat,
				aIndiceElection,
				aIndiceCandidat,
			);
		}
		return lChoixCandidat;
	}
	_composeCBCandidat(aCandidat, aIndiceElection, aIndiceCandidat) {
		const H = [];
		H.push(
			'<ie-checkbox ie-textleft ie-model="cbChoixCandidat(',
			aIndiceElection,
			", ",
			aIndiceCandidat,
			')">',
			'<span class="libelle">',
			aCandidat.getLibelle(),
			"</span>",
		);
		if (
			aCandidat.getGenre() ===
			TypeGenreCandidatElection_1.TypeGenreCandidatElection.GCE_Liste
		) {
			H.push(
				'<i class="icon icon_info_sign" ie-node="btnAfficherConstitutionListe(',
				aIndiceElection,
				", ",
				aIndiceCandidat,
				')"></i>',
			);
		}
		H.push("</ie-checkbox>");
		return H.join("");
	}
	_composeRadioCandidat(aCandidat, aIndiceElection, aIndiceCandidat) {
		const lNameGroupeRadio = "election_" + aIndiceElection;
		const H = [];
		H.push(
			'<ie-radio ie-textleft ie-model="rdChoixCandidat(',
			aIndiceElection,
			", ",
			aIndiceCandidat,
			')" name="',
			lNameGroupeRadio,
			'">',
			'<span class="libelle">',
			aCandidat.getLibelle(),
			"</span>",
		);
		if (
			aCandidat.getGenre() ===
			TypeGenreCandidatElection_1.TypeGenreCandidatElection.GCE_Liste
		) {
			H.push(
				'<i class="icon icon_info_sign" ie-node="btnAfficherConstitutionListe(',
				aIndiceElection,
				", ",
				aIndiceCandidat,
				')" ></i>',
			);
		}
		H.push("</ie-checkbox>");
		return H.join("");
	}
}
exports.WidgetElections = WidgetElections;
