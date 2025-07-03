exports.ObjetMoteurAssistantSaisie = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetRequeteAssistantSaisie_1 = require("ObjetRequeteAssistantSaisie");
const EBoutonFenetreAssistantSaisie_1 = require("EBoutonFenetreAssistantSaisie");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetMoteurPiedDeBulletin_1 = require("ObjetMoteurPiedDeBulletin");
const ObjetRequeteSaisieAssistantSaisie_1 = require("ObjetRequeteSaisieAssistantSaisie");
const AccessApp_1 = require("AccessApp");
class ObjetMoteurAssistantSaisie {
	constructor() {
		this.appSco = (0, AccessApp_1.getApp)();
		this.etatUtilSco = this.appSco.getEtatUtilisateur();
		this.moteurPdB =
			new ObjetMoteurPiedDeBulletin_1.ObjetMoteurPiedDeBulletin();
	}
	avecAssistantSaisie(aParam) {
		if (aParam.estCtxApprGenerale === true) {
			return this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.assistantSaisieAppreciations,
			);
		}
		if (aParam.estCtxPied === true) {
			return this.avecAssistantSaisiePdB(aParam);
		}
		switch (aParam.typeReleveBulletin) {
			case TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes:
			case TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes:
			case TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences:
			case TypeReleveBulletin_1.TypeReleveBulletin
				.AppreciationsBulletinParEleve:
			case TypeReleveBulletin_1.TypeReleveBulletin
				.AppreciationsBulletinProfesseur:
			case TypeReleveBulletin_1.TypeReleveBulletin
				.AppreciationsReleveProfesseur:
				return this.appSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.assistantSaisieAppreciations,
				);
			case TypeReleveBulletin_1.TypeReleveBulletin.LivretScolaire:
				return (
					this.appSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.assistantSaisieAppreciations,
					) &&
					(this.etatUtilSco.getGenreOnglet() ===
						Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations ||
						this.etatUtilSco.getGenreOnglet() ===
							Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche) &&
					this.etatUtilSco.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Professeur
				);
			case TypeReleveBulletin_1.TypeReleveBulletin.AvisProfesseur:
			case TypeReleveBulletin_1.TypeReleveBulletin.AvisParcoursup:
				return false;
			default:
		}
	}
	avecAssistantSaisiePdB(aParam) {
		if (this.moteurPdB.estAppreciationGenerale(aParam)) {
			return (
				aParam.typeReleveBulletin ===
				TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes
			);
		} else if (
			this.moteurPdB.estAppreciationCPE(aParam) ||
			this.moteurPdB.estAppreciationConseilDeClasse(aParam)
		) {
			if (this.moteurPdB.estMention(aParam)) {
				return false;
			} else {
				if (
					aParam.typeReleveBulletin ===
					TypeReleveBulletin_1.TypeReleveBulletin.ReleveCompetences
				) {
					return false;
				} else {
					return (
						aParam.typeReleveBulletin ===
							TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes ||
						aParam.contexte !==
							TypeContexteBulletin_1.TypeContexteBulletin.CB_Classe
					);
				}
			}
		}
		return true;
	}
	avecAssistantSaisieActif(aParam) {
		return (
			this.avecAssistantSaisie(aParam) && this.etatUtilSco.assistantSaisieActif
		);
	}
	getTitleBoutonAssistantSaisie() {
		return this.etatUtilSco.assistantSaisieActif
			? ObjetTraduction_1.GTraductions.getValeur(
					"Appreciations.DesactiverAssistantSaisie",
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"Appreciations.ActiverAssistantSaisie",
				);
	}
	evntBtnAssistant(aParam) {
		this.etatUtilSco.inverserEtatAssistantSaisie();
		aParam.instanceListe.actualiser(true);
		if (
			aParam.instancePied !== null &&
			aParam.instancePied !== undefined &&
			aParam.instancePied.evenementSurAssistant
		) {
			aParam.instancePied.evenementSurAssistant();
		}
	}
	initialiserFenetreAssistantSaisie(aInstance) {
		aInstance.setOptionsFenetre({
			largeur: 700,
			hauteur: 400,
			modale: true,
			avecScroll: false,
		});
	}
	getListeTypesAppreciations(aParam) {
		if (this.avecAssistantSaisie(aParam)) {
			new ObjetRequeteAssistantSaisie_1.ObjetRequeteAssistantSaisie(
				this,
				(aListeTypesAppreciations) => {
					if (aParam && aParam.clbck) {
						aParam.clbck(aListeTypesAppreciations);
					}
				},
			).lancerRequete();
		} else {
			if (aParam && aParam.clbck) {
				aParam.clbck(new ObjetListeElements_1.ObjetListeElements());
			}
		}
	}
	evenementOuvrirAssistantSaisie(aParam) {
		const lFenetre = aParam.instanceFenetreAssistantSaisie;
		const lParam = { tailleMaxAppreciation: aParam.tailleMaxAppreciation };
		if (
			aParam.rangAppreciations !== null &&
			aParam.rangAppreciations !== undefined
		) {
			$.extend(lParam, { rangAppreciations: aParam.rangAppreciations });
		}
		const lAvecEtatSaisie =
			aParam.avecEtatSaisie !== null && aParam.avecEtatSaisie !== undefined
				? aParam.avecEtatSaisie
				: true;
		$.extend(lParam, { avecEtatSaisie: lAvecEtatSaisie });
		lFenetre.setParametres(lParam);
		const lListeElementsTypeAppreciation =
			new ObjetListeElements_1.ObjetListeElements();
		for (let i = 0, lNbr = aParam.tabTypeAppreciation.length; i < lNbr; i++) {
			const lElementTypeAppreciation =
				aParam.listeTypesAppreciations.getElementParGenre(
					aParam.tabTypeAppreciation[i],
				);
			lListeElementsTypeAppreciation.addElement(lElementTypeAppreciation);
		}
		lFenetre.setDonnees(lListeElementsTypeAppreciation);
	}
	evenementAssistantSaisie(aNumeroBouton, aParam) {
		const lFenetre = aParam.instanceFenetreAssistantSaisie;
		let lEstClbckOk = false;
		switch (aNumeroBouton) {
			case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
				.Valider: {
				const lElmtSelectionne = lFenetre.getAppreciationSelectionnee();
				const lTailleMax = lFenetre.getTailleMaxAppreciation();
				const lControle = ObjetChaine_1.GChaine.controleTailleTexte({
					chaine: lElmtSelectionne.getLibelle(),
					tailleTexteMax: lTailleMax,
				});
				if (lControle.controleOK) {
					if (aParam.evntClbck) {
						lEstClbckOk = true;
						aParam.evntClbck({
							cmd: aNumeroBouton,
							eltSelectionne: lElmtSelectionne,
							estAssistantModifie: lFenetre.estAssistantModifie,
							rangAppr: lFenetre.getRangAppreciations(),
						});
					}
				} else {
					this.appSco
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"Appreciations.titreMsgDepasseTailleMax",
							),
							message: ObjetTraduction_1.GTraductions.getValeur(
								"Appreciations.msgDepasseTailleMax",
								[lTailleMax],
							),
						});
				}
				break;
			}
			case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
				.PasserEnSaisie:
				if (aParam.evntClbck) {
					lEstClbckOk = true;
					aParam.evntClbck({
						cmd: aNumeroBouton,
						estAssistantModifie: lFenetre.estAssistantModifie,
						rangAppr: lFenetre.getRangAppreciations(),
					});
				}
				break;
			case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
				.Fermer: {
				lEstClbckOk = true;
				aParam.evntClbck({
					cmd: aNumeroBouton,
					estAssistantModifie: lFenetre.estAssistantModifie,
				});
				break;
			}
		}
		const lNePasUtiliserAssistantActif =
			lFenetre.getEtatCbNePasUtiliserAssistant();
		const lUtiliserAssistantActif = !lNePasUtiliserAssistantActif;
		const lAvecModifAssistantActif =
			this.etatUtilSco.assistantSaisieActif !== lUtiliserAssistantActif;
		if (lAvecModifAssistantActif) {
			this.etatUtilSco.assistantSaisieActif = lUtiliserAssistantActif;
			if (
				aParam.eventChangementUtiliserAssSaisie &&
				aNumeroBouton ===
					EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie.Fermer
			) {
				aParam.eventChangementUtiliserAssSaisie();
			}
		}
		if (
			aParam.evntFinallyClbck !== null &&
			aParam.evntFinallyClbck !== undefined &&
			lEstClbckOk
		) {
			aParam.evntFinallyClbck({ cmd: aNumeroBouton });
		}
	}
	passerEnSaisiePre() {
		let lChangementActiviteAssistantSaisie = false;
		if (this.etatUtilSco.assistantSaisieActif) {
			this.etatUtilSco.inverserEtatAssistantSaisie();
			lChangementActiviteAssistantSaisie = true;
		}
		return lChangementActiviteAssistantSaisie;
	}
	passerEnSaisiePost(aParam) {
		if (aParam.changementActiviteAssistantSaisie) {
			this.etatUtilSco.inverserEtatAssistantSaisie();
		}
	}
	passerEnSaisie(aParam) {
		const lChangementActiviteAssistantSaisie = this.passerEnSaisiePre();
		const lInstanceListe = aParam.instanceListe;
		const lIdColonneAppreciation = aParam.idColonne;
		const lIndexColonneAppreciation = lInstanceListe
			.getDonneesListe()
			.getNumeroColonneDId(lIdColonneAppreciation);
		lInstanceListe.demarrerEditionSurCellule(
			aParam.ligneCell !== null && aParam.ligneCell !== undefined
				? aParam.ligneCell
				: lInstanceListe.getSelection(),
			lIndexColonneAppreciation,
		);
		this.passerEnSaisiePost({
			changementActiviteAssistantSaisie: lChangementActiviteAssistantSaisie,
		});
	}
	validerDonneesSurValider(aParam) {
		aParam.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		const lElmtSelectionne = aParam.eltSelectionne;
		if (lElmtSelectionne && lElmtSelectionne.existeNumero()) {
			aParam.appreciation.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			aParam.appreciation.setLibelle(lElmtSelectionne.getLibelle());
		}
	}
	saisirModifAssSaisieAvantTraitement(aParam) {
		if (aParam.estAssistantModifie) {
			return new ObjetRequeteSaisieAssistantSaisie_1.ObjetRequeteSaisieAssistantSaisie(
				aParam.pere,
			)
				.lancerRequete({
					listeTypesAppreciations: aParam.pere.listeTypesAppreciations,
				})
				.then(() => {
					var _a, _b;
					(_b = (_a = aParam.pere).getListeTypesAppreciations) === null ||
					_b === void 0
						? void 0
						: _b.call(_a);
				})
				.then(() => {
					if (aParam.clbck !== null && aParam.clbck !== undefined) {
						aParam.clbck();
					}
				});
		} else {
			if (aParam.clbck !== null && aParam.clbck !== undefined) {
				aParam.clbck();
			}
		}
	}
}
exports.ObjetMoteurAssistantSaisie = ObjetMoteurAssistantSaisie;
