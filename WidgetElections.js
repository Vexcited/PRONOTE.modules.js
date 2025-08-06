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
		var _a, _b;
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
		}
		const lWidget = {
			getHtml: this.composeWidgetElections.bind(this),
			nbrElements:
				(_a = this.donnees.listeElections) === null || _a === void 0
					? void 0
					: _a.count(),
			afficherMessage:
				((_b = this.donnees.listeElections) === null || _b === void 0
					? void 0
					: _b.count()) === 0,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	jsxModeleRadioChoixCandidatUnique(aElection, aCandidat, aName) {
		return {
			getValue: () => {
				if (
					aElection &&
					aCandidat &&
					aElection.vote &&
					aElection.vote.count() > 0
				) {
					return !!aElection.vote.getElementParNumero(aCandidat.getNumero());
				}
				return false;
			},
			setValue: (aValue) => {
				if (aElection && aCandidat && aValue) {
					aElection.vote = new ObjetListeElements_1.ObjetListeElements();
					aElection.vote.addElement(aCandidat);
				}
			},
			getName: () => {
				return `${this.Nom}_${aName}`;
			},
		};
	}
	jsxModeleCheckboxChoixCandidatsMultiple(aElection, aCandidat) {
		return {
			getValue: () => {
				if (
					aElection &&
					aCandidat &&
					aElection.vote &&
					aElection.vote.count() > 0
				) {
					return !!aElection.vote.getElementParNumero(aCandidat.getNumero());
				}
				return false;
			},
			setValue: (aValue) => {
				if (aElection && aCandidat) {
					if (!aElection.vote) {
						aElection.vote = new ObjetListeElements_1.ObjetListeElements();
					}
					const lNumero = aCandidat.getNumero();
					const lIndice = aElection.vote.getIndiceElementParFiltre(
						(aElement) => {
							return aElement.getNumero() === lNumero;
						},
					);
					if (aValue) {
						if (lIndice === -1) {
							aElection.vote.addElement(aCandidat);
						}
					} else {
						if (lIndice !== -1) {
							aElection.vote.remove(lIndice);
						}
					}
				}
			},
			getDisabled: () => {
				if (aElection && aElection.vote && aCandidat) {
					const lCandidatEstSelectionne =
						aElection.vote.getIndiceElementParFiltre((aElement) => {
							return aElement.getNumero() === aCandidat.getNumero();
						}) > -1;
					return (
						aElection.vote.count() >= aElection.nbMaxChoix &&
						!lCandidatEstSelectionne
					);
				}
				return true;
			},
		};
	}
	jsxNodeAfficherConstitutionListe(aElection, aListeCandidate) {
		return (aNode) => {
			$(aNode).eventValidation(() => {
				if (
					aElection &&
					aListeCandidate &&
					aListeCandidate.membres &&
					aListeCandidate.membres.count() > 0
				) {
					aListeCandidate.membres.trier();
					const H = [];
					H.push(
						IE.jsx.str(
							"div",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.elections.constitutionDeLaListe",
								[aListeCandidate.getLibelle()],
							),
						),
					);
					H.push('<div class="Espace">');
					H.push("<ul>");
					aListeCandidate.membres.parcourir((aMembreDeListeCandidate) => {
						H.push("<li>");
						H.push(aMembreDeListeCandidate.getLibelle());
						if (!!aMembreDeListeCandidate.statut) {
							H.push(
								' - <span class="Gras">',
								aMembreDeListeCandidate.statut,
								"</span>",
							);
						}
						H.push("</li>");
					});
					H.push("</ul>");
					H.push("</div>");
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"accueil.elections.candidatsConstitutifsDesListes",
						),
						message: H.join(""),
					});
				}
			});
		};
	}
	jsxModeleBoutonVote(aElection) {
		return {
			event: () => {
				if (aElection) {
					if (
						aElection.nbMaxChoix === 1 &&
						(!aElection.vote || aElection.vote.count() === 0)
					) {
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"accueil.elections.aucunChoixEffectue",
							),
						});
					} else {
						const lElectionPourVote = ObjetElement_1.ObjetElement.create({
							Libelle: aElection.getLibelle(),
							Numero: aElection.getNumero(),
							Genre: aElection.getGenre(),
							vote: undefined,
						});
						if (!aElection.vote && aElection.nbMaxChoix > 1) {
							aElection.vote = new ObjetListeElements_1.ObjetListeElements();
						}
						lElectionPourVote.vote = MethodesObjet_1.MethodesObjet.dupliquer(
							aElection.vote,
						);
						const H = [];
						H.push(
							IE.jsx.str(
								"div",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"accueil.elections.confirmationVote",
									[aElection.getLibelle()],
								),
							),
						);
						H.push('<div class="Espace">');
						H.push("<ul>");
						if (aElection.vote.count() === 0 && aElection.nbMaxChoix > 1) {
							H.push(
								"<li>",
								ObjetTraduction_1.GTraductions.getValeur(
									"accueil.elections.neSePrononcePas",
								),
								"</li>",
							);
						}
						for (let i = 0; i < aElection.vote.count(); i++) {
							H.push("<li>", aElection.vote.getLibelle(i), "</li>");
						}
						H.push("</ul>");
						H.push("</div>");
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: H.join(""),
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
										this,
										this.actionApresSaisieVotant.bind(
											this,
											lElectionPourVote.getLibelle(),
										),
									).lancerRequete({ election: lElectionPourVote });
								}
							},
						});
					}
				}
			},
		};
	}
	composeWidgetElections() {
		const H = [];
		if (
			!!this.donnees.listeElections &&
			this.donnees.listeElections.count() > 0
		) {
			for (const lElection of this.donnees.listeElections) {
				H.push(this.composeElection(lElection));
			}
		}
		return H.join("");
	}
	composeElection(aElection) {
		const H = [];
		const lID = this.donnees.id + "_div_" + aElection.getNumero();
		const lTitre =
			aElection.getLibelle() ||
			ObjetTraduction_1.GTraductions.getValeur("accueil.elections.sansTitre");
		H.push('<fieldset class="no-border" id="', lID, '" tabindex="-1">');
		const lFormat = "%JJ %MMMM %AAAA";
		if (aElection.ouvert) {
			H.push(
				IE.jsx.str(
					"legend",
					{ class: "vote-header" },
					IE.jsx.str("h3", null, lTitre),
					IE.jsx.str(
						"p",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.elections.voteOuvertDuAu",
							[
								ObjetDate_1.GDate.formatDate(aElection.dateDebut, lFormat),
								ObjetDate_1.GDate.formatDate(aElection.dateFin, lFormat),
							],
						),
					),
					aElection.description ? aElection.description : "",
					aElection.nbMaxChoix > 1
						? IE.jsx.str(
								"p",
								{ class: "nombre-choix" },
								ObjetTraduction_1.GTraductions.getValeur(
									"accueil.elections.nbMaxChoix",
									[IE.jsx.str("span", null, aElection.nbMaxChoix)],
								),
							)
						: "",
				),
			);
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
						IE.jsx.str(
							"a",
							{ href: lLienDocument, class: "icon " + lTypefile },
							aDocument.getLibelle(),
						),
					);
				});
				H.push("</div>");
			}
			H.push(this.composeListeCandidats(aElection));
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "vote-footer" },
						IE.jsx.str(
							"ie-bouton",
							{ "ie-model": this.jsxModeleBoutonVote.bind(this, aElection) },
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.elections.voter",
							),
						),
					),
				),
			);
		} else {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"legend",
						{ class: "vote-header" },
						IE.jsx.str(
							"h3",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.elections.prochainementOuverture",
							),
							" : ",
							IE.jsx.str("br", null),
							" ",
							lTitre,
						),
						IE.jsx.str(
							"p",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.elections.leVoteSeraOuvertDuAu",
								[
									ObjetDate_1.GDate.formatDate(aElection.dateDebut, lFormat),
									ObjetDate_1.GDate.formatDate(aElection.dateFin, lFormat),
								],
							),
						),
					),
				),
			);
		}
		H.push("</fieldset>");
		return H.join("");
	}
	composeListeCandidats(aElection) {
		const H = [];
		if (!!aElection.candidats && aElection.candidats.count() > 0) {
			H.push('<ul class="liste-clickable one-line">');
			aElection.candidats.parcourir((aCandidat) => {
				H.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str("li", null, this._composeCandidat(aElection, aCandidat)),
					),
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
	_composeCandidat(aElection, aCandidat) {
		let lChoixCandidat;
		const lAvecChoixMultiples = aElection.nbMaxChoix > 1;
		if (!lAvecChoixMultiples) {
			lChoixCandidat = this._composeRadioCandidat(aElection, aCandidat);
		} else {
			lChoixCandidat = this._composeCBCandidat(aElection, aCandidat);
		}
		return lChoixCandidat;
	}
	_composeCBCandidat(aElection, aCandidat) {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"ie-checkbox",
					{
						"ie-textleft": true,
						"ie-model": this.jsxModeleCheckboxChoixCandidatsMultiple.bind(
							this,
							aElection,
							aCandidat,
						),
					},
					IE.jsx.str("span", { class: "libelle" }, aCandidat.getLibelle()),
					aCandidat.getGenre() ===
						TypeGenreCandidatElection_1.TypeGenreCandidatElection.GCE_Liste
						? IE.jsx.str("i", {
								class: "icon icon_info_sign",
								"ie-node": this.jsxNodeAfficherConstitutionListe(
									aElection,
									aCandidat,
								),
								tabindex: "0",
								role: "button",
								"aria-haspopup": "dialog",
							})
						: "",
				),
			),
		);
		return H.join("");
	}
	_composeRadioCandidat(aElection, aCandidat) {
		const lNameGroupeRadio = "election_" + aElection.getNumero();
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"ie-radio",
					{
						"ie-textleft": true,
						"ie-model": this.jsxModeleRadioChoixCandidatUnique.bind(
							this,
							aElection,
							aCandidat,
							lNameGroupeRadio,
						),
					},
					IE.jsx.str("span", { class: "libelle" }, aCandidat.getLibelle()),
					aCandidat.getGenre() ===
						TypeGenreCandidatElection_1.TypeGenreCandidatElection.GCE_Liste
						? IE.jsx.str("i", {
								class: "icon icon_info_sign",
								"ie-node": this.jsxNodeAfficherConstitutionListe(
									aElection,
									aCandidat,
								),
								tabindex: "0",
								role: "button",
								"aria-haspopup": "dialog",
							})
						: "",
				),
			),
		);
		return H.join("");
	}
}
exports.WidgetElections = WidgetElections;
