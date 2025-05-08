exports.WidgetQCM = void 0;
const ObjetWidget_1 = require("ObjetWidget");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
class WidgetQCM extends ObjetWidget_1.Widget.ObjetWidget {
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			modelBoutonExecQCM: {
				event(aNumeroExecutionQCM) {
					aInstance.surExecutionQCM(aNumeroExecutionQCM);
				},
			},
		});
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		const H = [];
		if (
			this.donnees.listeExecutionsQCM &&
			this.donnees.listeExecutionsQCM.count() > 0
		) {
			this.donnees.listeExecutionsQCM.setTri([
				ObjetTri_1.ObjetTri.init("dateDebutPublication"),
				ObjetTri_1.ObjetTri.init("Position"),
			]);
			H.push('<ul class="sub-liste">');
			for (let I = 0; I < this.donnees.listeExecutionsQCM.count(); I++) {
				const lExecution = this.donnees.listeExecutionsQCM.get(I);
				let lStrInfosComplementaires;
				if (
					GEtatUtilisateur.pourPrimaire() &&
					lExecution.coefficientEvaluation === 0
				) {
					lStrInfosComplementaires =
						"(" +
						ObjetTraduction_1.GTraductions.getValeur(
							"evaluations.NonComptabiliseDansBilan",
						) +
						")";
				}
				H.push("<li");
				if (!lExecution.fichierDispo) {
					H.push(
						' title="' +
							ObjetTraduction_1.GTraductions.getValeur(
								"ExecutionQCM.FichierIndispo",
							) +
							'"',
					);
				}
				H.push(
					">",
					'<div class="wrap">',
					'<div class="bloc-date-conteneur">',
					ObjetDate_1.GDate.formatDate(
						lExecution.dateDebutPublication,
						"<div>%JJ</div><div>%MMM</div>",
					),
					"</div>",
					'<div class="infos-ds-conteneur">',
				);
				if (
					lExecution.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ExecutionQCM
				) {
					H.push(
						"<h3>",
						lExecution.service.getLibelle(),
						"</h3>",
						'<div class="date">',
						ObjetDate_1.GDate.strDates(
							lExecution.dateDebutPublication,
							lExecution.dateFinPublication,
						).ucfirst(),
						!!lStrInfosComplementaires ? " " + lStrInfosComplementaires : "",
						"</div>",
						'<div><i class="icon_qcm ThemeCat-pedagogie"></i>',
						lExecution.QCM.getLibelle(),
						" (",
						UtilitaireQCM_1.UtilitaireQCM.getStrResumeModalites(lExecution),
						") </div>",
					);
					if (lExecution.estEnPublication) {
						const lIeModelBouton =
							"modelBoutonExecQCM('" + lExecution.getNumero() + "')";
						H.push(
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str(
									"div",
									{ class: "flex-contain btn-qcm" },
									IE.jsx.str(
										"ie-bouton",
										{
											"ie-model": lIeModelBouton,
											class: "themeBoutonSecondaire",
										},
										ObjetTraduction_1.GTraductions.getValeur(
											"TAFEtContenu.executerQCM",
										),
									),
								),
							),
						);
					}
				} else {
					H.push(
						'<span class="date">',
						ObjetDate_1.GDate.strDates(
							lExecution.dateDebutPublication,
							lExecution.dateFinPublication,
						).ucfirst(),
						!!lStrInfosComplementaires ? " " + lStrInfosComplementaires : "",
						"</span>",
					);
					H.push(this.composeExecutionKiosque(lExecution));
				}
				H.push("</div>", "</div>", "</li>");
			}
		}
		const lWidget = {
			html: H.join(""),
			nbrElements: this.donnees.listeExecutionsQCM
				? this.donnees.listeExecutionsQCM.count()
				: 0,
			afficherMessage: this.donnees.listeExecutionsQCM
				? this.donnees.listeExecutionsQCM.count() === 0
				: true,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	composeExecutionKiosque(aExecutionKiosque) {
		const H = [];
		if (!!aExecutionKiosque) {
			H.push("<div>");
			H.push(
				ObjetChaine_1.GChaine.composerUrlLienExterne({
					documentJoint: aExecutionKiosque,
					avecLien: aExecutionKiosque.estEnPublication,
					title: aExecutionKiosque.estEnPublication
						? ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAFARendre.ACompleterEditeur",
							)
						: "",
					libelleEcran: aExecutionKiosque.service.getLibelle(),
				}),
			);
			H.push("<div>", "&nbsp;-&nbsp;", aExecutionKiosque.titre, "</div>");
			H.push("</div>");
		}
		return H.join("");
	}
	surExecutionQCM(aNumeroExecution) {
		const lExecutionQCM =
			this.donnees.listeExecutionsQCM.getElementParNumero(aNumeroExecution);
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.AfficherExecutionQCM,
			lExecutionQCM,
		);
	}
}
exports.WidgetQCM = WidgetQCM;
