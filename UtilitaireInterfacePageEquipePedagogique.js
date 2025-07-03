exports.UtilitaireFormaterListeParMatiereEtFonction = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
exports.UtilitaireFormaterListeParMatiereEtFonction = {
	formaterListeParMatiere(aListeEquipePedagogique) {
		let newListe = new ObjetListeElements_1.ObjetListeElements();
		const lListeEquipePedagogique = MethodesObjet_1.MethodesObjet.dupliquer(
			aListeEquipePedagogique,
		);
		newListe.addElement(lListeEquipePedagogique);
		let parMatiere = new ObjetListeElements_1.ObjetListeElements();
		newListe.addElement(parMatiere);
		newListe.setLibelle(1, "parMatiere");
		const lListeDeploiement = lListeEquipePedagogique.getListeElements(
			(aElem) => aElem.estUnDeploiement,
		);
		lListeEquipePedagogique.parcourir((aProf) => {
			if (aProf.estUnDeploiement) {
				parMatiere.addElement(aProf);
			}
			if (aProf.matieres) {
				if (aProf.matieres.count() === 0) {
					let nouvelleMatiere = new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"EquipePedagogique.sansMatiere",
						),
						"",
						Enumere_Ressource_1.EGenreRessource.Enseignant,
					);
					nouvelleMatiere.libelleTri = nouvelleMatiere.getLibelle();
					if (aProf.estTuteur) {
						nouvelleMatiere.estTuteur = true;
					}
					if (aProf.estProfesseurPrincipal) {
						nouvelleMatiere.estProfesseurPrincipal = true;
					}
					parMatiere.addElement(nouvelleMatiere);
					if (aProf.pere && !aProf.estEnleve) {
						nouvelleMatiere.pere = lListeDeploiement
							.getListeElements(
								(aElemDeploiement) =>
									aElemDeploiement.getGenre() ===
										Enumere_Ressource_1.EGenreRessource.Enseignant &&
									!aElemDeploiement.estEnleve,
							)
							.get(0);
					}
					if (aProf.pere && aProf.estEnleve) {
						nouvelleMatiere.estEnleve = true;
						nouvelleMatiere.pere = lListeDeploiement
							.getListeElements(
								(aElemDeploiement) =>
									aElemDeploiement.getGenre() ===
										Enumere_Ressource_1.EGenreRessource.Enseignant &&
									aElemDeploiement.estEnleve,
							)
							.get(0);
					}
					nouvelleMatiere.listeProfesseursParMatiere =
						new ObjetListeElements_1.ObjetListeElements();
					nouvelleMatiere.listeProfesseursParMatiere.addElement(aProf);
				}
				aProf.matieres.parcourir((aMatiere) => {
					if (!aMatiere.estUneSousMatiere) {
						let nouvelleMatiere = new ObjetElement_1.ObjetElement(
							aMatiere.Libelle,
							"",
							Enumere_Ressource_1.EGenreRessource.Enseignant,
						);
						parMatiere.addElement(nouvelleMatiere);
						nouvelleMatiere.libelleTri = nouvelleMatiere.getLibelle();
						if (aProf.estTuteur) {
							nouvelleMatiere.estTuteur = true;
						}
						if (aProf.estProfesseurPrincipal) {
							nouvelleMatiere.estProfesseurPrincipal = true;
						}
						if (aProf.pere && !aProf.estEnleve) {
							nouvelleMatiere.pere = lListeDeploiement
								.getListeElements(
									(aElemDeploiement) =>
										aElemDeploiement.getGenre() ===
											Enumere_Ressource_1.EGenreRessource.Enseignant &&
										!aElemDeploiement.estEnleve,
								)
								.get(0);
						}
						if (aProf.pere && aProf.estEnleve) {
							nouvelleMatiere.estEnleve = true;
							nouvelleMatiere.pere = lListeDeploiement
								.getListeElements(
									(aElemDeploiement) =>
										aElemDeploiement.getGenre() ===
											Enumere_Ressource_1.EGenreRessource.Enseignant &&
										aElemDeploiement.estEnleve,
								)
								.get(0);
						}
						if (aMatiere.volumeHoraire) {
							nouvelleMatiere.volumeHoraire = aMatiere.volumeHoraire;
						}
						nouvelleMatiere.listeProfesseursParMatiere =
							new ObjetListeElements_1.ObjetListeElements();
						nouvelleMatiere.listeProfesseursParMatiere.addElement(aProf);
					} else if (
						parMatiere.getElementParLibelle(aMatiere.Libelle) !== undefined
					) {
						parMatiere
							.getElementParLibelle(aMatiere.Libelle)
							.listeProfesseursParMatiere.addElement(aProf);
						parMatiere.getElementParLibelle(aMatiere.Libelle).volumeHoraire =
							"";
					}
				});
			} else if (aProf.fonction) {
				let nouvelleFonction = new ObjetElement_1.ObjetElement(
					aProf.fonction,
					"",
					Enumere_Ressource_1.EGenreRessource.Personnel,
				);
				parMatiere.addElement(nouvelleFonction);
				nouvelleFonction.pere = lListeDeploiement
					.getListeElements(
						(aElemDeploiement) =>
							aElemDeploiement.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Personnel,
					)
					.get(0);
				nouvelleFonction.libelleTri = nouvelleFonction.getLibelle();
				nouvelleFonction.listePersonnels =
					new ObjetListeElements_1.ObjetListeElements();
				nouvelleFonction.listePersonnels.addElement(aProf);
			}
		});
		parMatiere.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getGenre() !== Enumere_Ressource_1.EGenreRessource.Enseignant;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.estEnleve;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				if (
					D.Libelle ===
					ObjetTraduction_1.GTraductions.getValeur(
						"EquipePedagogique.sansMatiere",
					)
				) {
					return D.libelleTri;
				}
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				if (
					D.Libelle !==
					ObjetTraduction_1.GTraductions.getValeur(
						"EquipePedagogique.sansMatiere",
					)
				) {
					return D.libelleTri;
				}
			}),
		]);
		parMatiere.trier();
		return parMatiere;
	},
};
