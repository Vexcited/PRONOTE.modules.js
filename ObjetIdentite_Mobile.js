exports.ObjetIdentite_Mobile = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetSupport_1 = require("ObjetSupport");
const EGenreDirectionSlide_1 = require("EGenreDirectionSlide");
const ObjetHtml_1 = require("ObjetHtml");
const MethodesObjet_1 = require("MethodesObjet");
class ObjetIdentite_Mobile extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.avecSlide = false;
		this.enSlide = false;
		this.swipeTabActif = false;
	}
	afficher(aHtml, aDirectionSlide) {
		const lElementActuel = $("#" + this.Nom.escapeJQ()),
			lElementAvecContenu = !!lElementActuel.html();
		let lClassSlide = "";
		let lNouveauContainer;
		if (
			!this.enSlide &&
			this.avecSlide &&
			MethodesObjet_1.MethodesObjet.isNumeric(aDirectionSlide) &&
			aDirectionSlide !== EGenreDirectionSlide_1.EGenreDirectionSlide.Aucune &&
			lElementAvecContenu
		) {
			lNouveauContainer = lElementActuel.clone();
			lElementActuel
				.attr("id", "")
				.css({
					position: "absolute",
					width: "100%",
					height: lElementActuel.height() + "px",
				});
			if (
				aDirectionSlide === EGenreDirectionSlide_1.EGenreDirectionSlide.Droite
			) {
				lClassSlide = "slide-to-right";
			} else if (
				aDirectionSlide === EGenreDirectionSlide_1.EGenreDirectionSlide.Gauche
			) {
				lClassSlide = "slide-to-left";
			}
			lElementActuel
				.wrap(
					'<div class="slide-wrapper"><div class="slide-container"></div></div>',
				)
				.after(lNouveauContainer.addClass(lClassSlide));
		}
		super.afficher(aHtml);
		if (
			!this.enSlide &&
			this.avecSlide &&
			MethodesObjet_1.MethodesObjet.isNumeric(aDirectionSlide) &&
			aDirectionSlide !== EGenreDirectionSlide_1.EGenreDirectionSlide.Aucune &&
			lElementAvecContenu
		) {
			this.enSlide = true;
			lElementActuel
				.parent()
				.one(ObjetSupport_1.Support.transitionEndEvent, () => {
					lNouveauContainer.siblings().remove();
					lNouveauContainer.removeClass(lClassSlide);
					lNouveauContainer.unwrap(".slide-container").unwrap(".slide-wrapper");
					this.enSlide = false;
				})
				.addClass(lClassSlide);
		}
	}
	composeAucuneDonnee(aHtml) {
		return ObjetHtml_1.GHtml.composeFondAucuneDonnee(aHtml);
	}
}
exports.ObjetIdentite_Mobile = ObjetIdentite_Mobile;
