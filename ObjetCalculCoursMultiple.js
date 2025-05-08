exports.ObjetCalculCoursMultiple = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const ObjetDate_1 = require("ObjetDate");
const TypeStatutCours_1 = require("TypeStatutCours");
class ObjetCalculCoursMultiple {
	calculer(aParametres) {
		let I, lCours, lPlaceDebut, lPlaceFin;
		this.parametres = $.extend(
			{
				listeCours: null,
				avecCoursAnnules: true,
				avecCoursAnnulesSuperposes: true,
				avecCoursPrevus: true,
				getPlaceDebutCours: null,
				getPlaceFinCours: null,
				estCoursDansGrille: null,
				estEDTAnnuel: false,
			},
			aParametres,
		);
		this.listeCours = this.parametres.listeCours;
		if (this.listeCours.__listeCoursBackup) {
			this.listeCours.vider();
			this.listeCours.add(this.listeCours.__listeCoursBackup);
			delete this.listeCours.__listeCoursBackup;
		}
		this.listeCours.__listeCoursBackup =
			MethodesObjet_1.MethodesObjet.dupliquer(this.listeCours);
		this.listeCoursMultiples = new ObjetListeElements_1.ObjetListeElements();
		if (!this.parametres.avecCoursAnnules) {
			this.listeCours.parcourir((aCours) => {
				if (aCours.estAnnule) {
					aCours.Visible = false;
				}
			});
		}
		if (!this.parametres.avecCoursPrevus) {
			this.listeCours.parcourir((aCours) => {
				if (
					aCours.Visible !== false &&
					!aCours.estAnnule &&
					[
						TypeStatutCours_1.TypeStatutCours.EnseignementNormal,
						TypeStatutCours_1.TypeStatutCours.EnseignementHistorique,
						TypeStatutCours_1.TypeStatutCours.EnseignementSuppleant,
					].indexOf(aCours.getGenre()) >= 0
				) {
					aCours.Visible = false;
				}
			});
		}
		if (
			this.parametres.avecCoursAnnules &&
			!this.parametres.avecCoursAnnulesSuperposes
		) {
			let lTrouveAnnuleInvisble = this._rendreInvisibleCoursAnnulesSuperposes();
			while (lTrouveAnnuleInvisble) {
				lTrouveAnnuleInvisble = this._rendreInvisibleCoursAnnulesSuperposes();
			}
		}
		this.placesOccupees = [];
		this.listeCours.parcourir((aCours, aIndex) => {
			if (
				aCours.Visible !== false &&
				!aCours.horsHoraire &&
				this._estCoursDansGrille(aCours)
			) {
				lPlaceDebut = this.parametres.getPlaceDebutCours(aCours);
				if (lPlaceDebut >= 0) {
					lPlaceFin = this.parametres.getPlaceFinCours(aCours);
					for (let lPlace = lPlaceDebut; lPlace <= lPlaceFin; lPlace++) {
						if (
							MethodesObjet_1.MethodesObjet.isUndefined(
								this.placesOccupees[lPlace],
							)
						) {
							this.placesOccupees[lPlace] = aIndex;
						} else {
							this._creationCoursMultiSeances(aIndex);
							break;
						}
					}
				}
			}
		});
		for (I = 0; I < this.listeCoursMultiples.count(); I++) {
			lCours = this.listeCoursMultiples.get(I);
			if (lCours) {
				const lTris = [
					ObjetTri_1.ObjetTri.init((D) => {
						return !!D.estAnnule;
					}),
					ObjetTri_1.ObjetTri.init((D) => {
						return !D.estSortiePedagogique;
					}),
					ObjetTri_1.ObjetTri.init((D) => {
						if (D.estRetenue === "eleve") {
							return false;
						}
						return true;
					}),
				];
				if (this.parametres.estEDTAnnuel) {
					lTris.push(ObjetTri_1.ObjetTri.init("numeroSemaine"));
				}
				lTris.push(
					ObjetTri_1.ObjetTri.init("Debut"),
					ObjetTri_1.ObjetTri.init((E) => {
						return E.Fin - E.Debut;
					}),
					ObjetTri_1.ObjetTri.init((E) => {
						return E.Statut ? E.Statut : "";
					}),
					ObjetTri_1.ObjetTri.init("Position"),
					ObjetTri_1.ObjetTri.init("Numero"),
				);
				lCours.listeCours.setTri(lTris).trier();
				this._calculerPositionnementCouloir(lCours);
				this.listeCours.addElement(lCours);
			}
		}
	}
	_unePlaceEstOccupee(aPlacesCours, aPlacesCouloir) {
		for (const I in aPlacesCours) {
			if (aPlacesCouloir[I]) {
				return true;
			}
		}
		return false;
	}
	_calculerPositionnementCouloir(aCoursMultiple) {
		aCoursMultiple.listeCours.nbCouloirs = 0;
		aCoursMultiple.numeroCouloir = 0;
		const lCouloirs = [];
		for (let I = 0; I < aCoursMultiple.listeCours.count(); I++) {
			lCouloirs[I] = [];
		}
		for (let I = 0; I < aCoursMultiple.listeCours.count(); I++) {
			const lTabOccupation = [];
			const lCours = aCoursMultiple.listeCours.get(I);
			const lPlaceDebut = this.parametres.getPlaceDebutCours(lCours),
				lPlaceFin = this.parametres.getPlaceFinCours(lCours);
			for (let lPlace = lPlaceDebut; lPlace <= lPlaceFin; lPlace++) {
				lTabOccupation[lPlace] = true;
			}
			let lNumeroCouloir = 0;
			while (
				this._unePlaceEstOccupee(lTabOccupation, lCouloirs[lNumeroCouloir])
			) {
				lNumeroCouloir++;
				aCoursMultiple.listeCours.nbCouloirs = Math.max(
					aCoursMultiple.listeCours.nbCouloirs,
					lNumeroCouloir + 1,
				);
			}
			for (const J in lTabOccupation) {
				if (lTabOccupation[J]) {
					lCouloirs[lNumeroCouloir][J] = true;
				}
			}
			lCours.numeroCouloir = lNumeroCouloir;
		}
	}
	_rendreInvisibleCoursAnnulesSuperposes() {
		const lNb = this.listeCours.count();
		let lCours;
		let lCoursSuperpose;
		let lPlaceOccupees = [];
		for (let I = 0; I < lNb; I++) {
			lCours = this.listeCours.get(I);
			const lPlaceDebut = this.parametres.getPlaceDebutCours(lCours),
				lPlaceFin = this.parametres.getPlaceFinCours(lCours);
			if (lCours.Visible !== false && this._estCoursDansGrille(lCours)) {
				for (let lPlace = lPlaceDebut; lPlace <= lPlaceFin; lPlace++) {
					if (
						MethodesObjet_1.MethodesObjet.isUndefined(lPlaceOccupees[lPlace])
					) {
						lPlaceOccupees[lPlace] = I;
					} else {
						const lCoursSuperposees =
							this._getTableauIndicesCoursSuperposesDeCours(I, lPlaceOccupees);
						let lAvecCoursAnnule = false;
						let lAvecCoursNormal = false;
						for (let j = 0; j < lCoursSuperposees.length; j++) {
							lCoursSuperpose = this.listeCours.get(lCoursSuperposees[j]);
							if (!lAvecCoursNormal) {
								lAvecCoursNormal = !lCoursSuperpose.estAnnule;
							}
							if (!lAvecCoursAnnule) {
								lAvecCoursAnnule = lCoursSuperpose.estAnnule;
							}
						}
						if (lAvecCoursNormal && lAvecCoursAnnule) {
							for (let j = 0; j < lCoursSuperposees.length; j++) {
								lCoursSuperpose = this.listeCours.get(lCoursSuperposees[j]);
								if (lCoursSuperpose && lCoursSuperpose.estAnnule) {
									lCoursSuperpose.Visible = false;
									return true;
								}
							}
						}
						break;
					}
				}
			}
		}
		return false;
	}
	_getTableauIndicesCoursSuperposesDeCours(aIndiceCours, aPlaceOccupees) {
		const lCours = this.listeCours.get(aIndiceCours);
		const lCoursSuperposees = [aIndiceCours];
		const lPlaceDebut = this.parametres.getPlaceDebutCours(lCours),
			lPlaceFin = this.parametres.getPlaceFinCours(lCours);
		for (let lPlace = lPlaceDebut; lPlace <= lPlaceFin; lPlace++) {
			const lIndiceCours = aPlaceOccupees[lPlace];
			if (!MethodesObjet_1.MethodesObjet.isUndefined(lIndiceCours)) {
				if (
					lIndiceCours !== aIndiceCours &&
					!lCoursSuperposees.includes(lIndiceCours)
				) {
					lCoursSuperposees.push(lIndiceCours);
				}
			}
		}
		return lCoursSuperposees;
	}
	_creationCoursMultiSeances(aIndiceCours) {
		let lCours = this.listeCours.get(aIndiceCours);
		const lCoursSuperposees = this._getTableauIndicesCoursSuperposesDeCours(
			aIndiceCours,
			this.placesOccupees,
		);
		let lPlaceDebut = lCours.Debut;
		let lPlaceFin = lCours.Fin;
		const lListeCoursDansCoursMultiple =
			new ObjetListeElements_1.ObjetListeElements();
		const lSemaine = lCours.numeroSemaine;
		const lRessource = lCours.ressource;
		let lDateDuCoursFin = MethodesObjet_1.MethodesObjet.isDate(
			lCours.DateDuCoursFin,
		)
			? lCours.DateDuCoursFin
			: 0;
		for (let I = 0; I < lCoursSuperposees.length; I++) {
			if (lCoursSuperposees[I] < 0) {
				const lIndice = -lCoursSuperposees[I] - 1;
				lCours = this.listeCoursMultiples.get(lIndice);
				for (let J = 0; J < lCours.listeCours.count(); J++) {
					lListeCoursDansCoursMultiple.addElement(lCours.listeCours.get(J));
				}
				this.listeCoursMultiples.addElement(null, lIndice);
			} else {
				lCours = this.listeCours.get(lCoursSuperposees[I]);
				const lCoursDuplique = MethodesObjet_1.MethodesObjet.dupliquer(lCours);
				lCoursDuplique.coursOrigine = lCours;
				lCoursDuplique.indiceCoursOrigine = lCoursSuperposees[I];
				lCoursDuplique.Visible = true;
				lListeCoursDansCoursMultiple.addElement(lCoursDuplique);
				lCours.estCoursMSInvisibleCouloir = true;
				lCours.estCoursMS = true;
			}
			lPlaceDebut = Math.min(lPlaceDebut, lCours.Debut);
			lPlaceFin = Math.max(lPlaceFin, lCours.Fin);
			if (
				MethodesObjet_1.MethodesObjet.isDate(lCours.DateDuCoursFin) &&
				(!lDateDuCoursFin || lCours.DateDuCoursFin > lDateDuCoursFin)
			) {
				lDateDuCoursFin = lCours.DateDuCoursFin;
			}
		}
		const lCoursMultiple = new ObjetElement_1.ObjetElement(
			lCours.getLibelle(),
			0,
		);
		lCoursMultiple.coursMultiple = true;
		lCoursMultiple.place = lPlaceDebut;
		lCoursMultiple.Debut = lCoursMultiple.place;
		lCoursMultiple.Fin = lPlaceFin;
		lCoursMultiple.duree = lPlaceFin - lPlaceDebut + 1;
		lCoursMultiple.CouleurFond = GCouleur.nonEditable.fond;
		lCoursMultiple.numeroSemaine = lSemaine;
		lCoursMultiple.ressource = lRessource;
		lCoursMultiple.DateDuCours = ObjetDate_1.GDate.placeEnDate(
			lSemaine,
			lPlaceDebut,
			false,
		);
		if (
			lDateDuCoursFin &&
			MethodesObjet_1.MethodesObjet.isDate(lDateDuCoursFin)
		) {
			lCoursMultiple.DateDuCoursFin = new Date(lDateDuCoursFin.getTime());
		}
		lCoursMultiple.listeCours = lListeCoursDansCoursMultiple;
		lCoursMultiple.ListeContenus =
			new ObjetListeElements_1.ObjetListeElements();
		this.listeCoursMultiples.addElement(lCoursMultiple);
		const lIndiceCoursMultiple = this.listeCoursMultiples.count();
		const lPlaceDebutCoursGrille =
				this.parametres.getPlaceDebutCours(lCoursMultiple),
			lPlaceFinCoursGrille = this.parametres.getPlaceFinCours(lCoursMultiple);
		for (
			let lPlace = lPlaceDebutCoursGrille;
			lPlace <= lPlaceFinCoursGrille;
			lPlace++
		) {
			this.placesOccupees[lPlace] = -lIndiceCoursMultiple;
		}
	}
	_estCoursDansGrille(aCours) {
		if (this.parametres.estCoursDansGrille) {
			return this.parametres.estCoursDansGrille(aCours);
		}
		return true;
	}
}
exports.ObjetCalculCoursMultiple = ObjetCalculCoursMultiple;
