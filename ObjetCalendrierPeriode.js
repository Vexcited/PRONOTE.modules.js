exports.ObjetCalendrierPeriode = exports.CalendrierPeriode = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetChaine_1 = require("ObjetChaine");
const Invocateur_1 = require("Invocateur");
const ToucheClavier_1 = require("ToucheClavier");
const ObjetHtml_1 = require("ObjetHtml");
let C_ordreJoursSemaine = [0, 1, 2, 3, 4, 5, 6];
const uClassAvecEdition = "AvecEdition";
const uClassSurSelectionZone = "surSelectionZone";
const uClassJoursFeries = "date-joursFeries";
const uClassJoursNonOuvres = "date-joursNonOuvres";
const uClassPeriodeDebut = "date-periodeDebut";
const uClassPeriodeFin = "date-periodeFin";
var CalendrierPeriode;
(function (CalendrierPeriode) {
  class ObjetElementZoneCalendrier extends ObjetElement_1.ObjetElement {}
  CalendrierPeriode.ObjetElementZoneCalendrier = ObjetElementZoneCalendrier;
  class ObjetElementPeriodeCalendrier extends ObjetElement_1.ObjetElement {}
  CalendrierPeriode.ObjetElementPeriodeCalendrier =
    ObjetElementPeriodeCalendrier;
})(CalendrierPeriode || (exports.CalendrierPeriode = CalendrierPeriode = {}));
class ObjetCalendrierPeriode extends ObjetIdentite_1.Identite {
  constructor(...aParams) {
    super(...aParams);
    this.options = {
      premiereDate: GParametres.PremiereDate,
      derniereDate: GParametres.DerniereDate,
      premierJourSemaine: GParametres.premierJourSemaine || 2,
      avecJourCourant: true,
      avecJoursNonOuvres: true,
      avecJoursFeries: true,
      avecPeriodes: false,
      marquageJoursAvantDate: null,
      avecZoneDateUnique: false,
      avecZonesFusionnees: true,
      journeeAvecClass: null,
      domaineOuvres: GParametres.JoursOuvres,
      avecEdition: false,
      avecEditionJoursFeries: false,
      avecEditionJoursNonOuvres: false,
      avecSuppressionSurZone: false,
    };
    if (!IE.estMobile) {
      Invocateur_1.Invocateur.abonner(
        GNavigateur.getEventInvocateur("pointerup"),
        () => {
          this.surFinSelection();
        },
        this,
      );
    }
    this.setParametres();
  }
  getControleur(aInstance) {
    this.selection = {
      estSurZone: false,
      avecMouseDown: false,
      dateDepartSelection: null,
      dateFinSelection: null,
    };
    return $.extend(true, super.getControleur(aInstance), {
      getHint: function (aDate) {
        const H = [];
        const lDate = ObjetDate_1.GDate.getDateJour(new Date(aDate));
        H.push(
          IE.jsx.str(
            "div",
            null,
            ObjetDate_1.GDate.formatDate(
              lDate,
              "%JJJJ %JJ %MMMM %AAAA",
            ).ucfirst(),
          ),
        );
        if (!!aInstance.donnees.feries) {
          for (
            let i = 0, lNbr = aInstance.donnees.feries.count();
            i < lNbr;
            i++
          ) {
            const lFeries = aInstance.donnees.feries.get(i);
            if (
              lDate >= aInstance.options.premiereDate &&
              ObjetDate_1.GDate.getDateJour(lFeries.dateDebut) <= lDate &&
              ObjetDate_1.GDate.getDateJour(lFeries.dateFin) >= lDate &&
              lDate <= aInstance.options.derniereDate
            ) {
              H.push(IE.jsx.str("div", null, lFeries.getLibelle()));
            }
          }
        }
        if (!!aInstance.donnees.Zones) {
          for (
            let i = 0, lNbr = aInstance.donnees.Zones.count();
            i < lNbr;
            i++
          ) {
            const lZone = aInstance.donnees.Zones.get(i);
            lZone.donnees.parcourir((aJour) => {
              if (
                lDate >= aInstance.options.premiereDate &&
                ObjetDate_1.GDate.getDateJour(aJour.dateDebut) <= lDate &&
                ObjetDate_1.GDate.getDateJour(aJour.dateFin) >= lDate &&
                lDate <= aInstance.options.derniereDate
              ) {
                const lLibelle =
                  lZone.libelleLegende && lZone.libelleLegende !== ""
                    ? lZone.libelleLegende
                    : aJour.getLibelle();
                H.push(
                  IE.jsx.str(
                    "div",
                    {
                      class: [
                        "CalendrierPeriode",
                        "flex-contain",
                        "EspaceHaut",
                      ],
                    },
                    IE.jsx.str("span", {
                      class: lZone.class,
                      style:
                        "width:2rem;height:2rem;border-radius:50%;margin-right:0.8rem;" +
                        (!!lZone.couleur
                          ? "background-color:" + lZone.couleur + ";"
                          : ""),
                    }),
                    IE.jsx.str(
                      "div",
                      { style: "align-self:center;" },
                      lLibelle,
                    ),
                  ),
                );
                if (!!lZone.icon && !!lZone.libelleIcon) {
                  H.push(
                    IE.jsx.str(
                      "div",
                      { class: "CalendrierPeriode" },
                      IE.jsx.str(
                        "div",
                        {
                          class: [
                            "legende-ObjetCalendrier",
                            "flex-contain",
                            "EspaceHaut",
                          ],
                        },
                        IE.jsx.str("span", {
                          class: ["legende-icon", lZone.icon],
                        }),
                        IE.jsx.str(
                          "div",
                          { style: "align-self:center;margin-left:0.8rem;" },
                          lZone.libelleIcon,
                        ),
                      ),
                    ),
                  );
                }
              }
            });
          }
        }
        if (!!aInstance.donnees.periodes) {
          for (
            let i = 0, lNbr = aInstance.donnees.periodes.count();
            i < lNbr;
            i++
          ) {
            const lPeriode = aInstance.donnees.periodes.get(i);
            lPeriode.donnees.parcourir((aJour) => {
              if (
                lDate >= aInstance.options.premiereDate &&
                ObjetDate_1.GDate.getDateJour(aJour.dateDebut) <= lDate &&
                ObjetDate_1.GDate.getDateJour(aJour.dateFin) >= lDate &&
                lDate <= aInstance.options.derniereDate
              ) {
                H.push(
                  IE.jsx.str(
                    "div",
                    { class: ["flex-contain", "EspaceHaut"] },
                    IE.jsx.str("span", {
                      style:
                        "align-self:center;width:2rem;height:0.3rem;border-radius:1rem;margin-right:0.8rem;background-color:" +
                        lPeriode.couleur +
                        ";",
                    }),
                    IE.jsx.str(
                      "div",
                      { style: "align-self:center;" },
                      lPeriode.getLibelle(),
                    ),
                  ),
                );
              }
            });
          }
        }
        return H.join("");
      },
      getAttr(aDate) {
        const H = [];
        const lDate = ObjetDate_1.GDate.getDateJour(new Date(aDate));
        H.push(
          ObjetDate_1.GDate.formatDate(
            lDate,
            "%JJJJ %JJ %MMMM %AAAA",
          ).ucfirst(),
        );
        if (!!aInstance.donnees.feries) {
          for (
            let i = 0, lNbr = aInstance.donnees.feries.count();
            i < lNbr;
            i++
          ) {
            const lFeries = aInstance.donnees.feries.get(i);
            if (
              lDate >= aInstance.options.premiereDate &&
              ObjetDate_1.GDate.getDateJour(lFeries.dateDebut) <= lDate &&
              ObjetDate_1.GDate.getDateJour(lFeries.dateFin) >= lDate &&
              lDate <= aInstance.options.derniereDate
            ) {
              H.push(lFeries.getLibelle());
            }
          }
        }
        if (!!aInstance.donnees.Zones) {
          for (
            let i = 0, lNbr = aInstance.donnees.Zones.count();
            i < lNbr;
            i++
          ) {
            const lZone = aInstance.donnees.Zones.get(i);
            lZone.donnees.parcourir((aJour) => {
              if (
                lDate >= aInstance.options.premiereDate &&
                ObjetDate_1.GDate.getDateJour(aJour.dateDebut) <= lDate &&
                ObjetDate_1.GDate.getDateJour(aJour.dateFin) >= lDate &&
                lDate <= aInstance.options.derniereDate
              ) {
                const lLibelle =
                  lZone.libelleLegende && lZone.libelleLegende !== ""
                    ? lZone.libelleLegende
                    : aJour.getLibelle();
                H.push(lLibelle);
              }
            });
          }
        }
        if (!!aInstance.donnees.periodes) {
          for (
            let i = 0, lNbr = aInstance.donnees.periodes.count();
            i < lNbr;
            i++
          ) {
            const lPeriode = aInstance.donnees.periodes.get(i);
            lPeriode.donnees.parcourir((aJour) => {
              if (
                lDate >= aInstance.options.premiereDate &&
                ObjetDate_1.GDate.getDateJour(aJour.dateDebut) <= lDate &&
                ObjetDate_1.GDate.getDateJour(aJour.dateFin) >= lDate &&
                lDate <= aInstance.options.derniereDate
              ) {
                H.push(lPeriode.getLibelle());
              }
            });
          }
        }
        return { "aria-label": ObjetChaine_1.GChaine.toTitle(H.join(", ")) };
      },
      surNodeJour: function (aDate) {
        const lAvecEdition =
          aInstance.options.avecEdition &&
          !(
            aInstance.options.marquageJoursAvantDate &&
            ObjetDate_1.GDate.estAvantJour(
              new Date(aDate),
              aInstance.options.marquageJoursAvantDate,
            )
          );
        if (lAvecEdition) {
          $(this.node).eventValidation(() => {
            if (aInstance.options.avecZoneDateUnique) {
              const lDateClick = ObjetDate_1.GDate.getDateJour(new Date(aDate));
              if (!aInstance.avecEditionSurDate(lDateClick)) {
                return null;
              }
              let lZoneClick = null;
              if (!!aInstance.donnees.Zones) {
                for (
                  let i = 0, lNbr = aInstance.donnees.Zones.count();
                  i < lNbr;
                  i++
                ) {
                  const lZone = aInstance.donnees.Zones.get(i);
                  lZone.donnees.parcourir((aJour) => {
                    if (
                      lDateClick >= aInstance.options.premiereDate &&
                      ObjetDate_1.GDate.getDateJour(aJour.dateDebut) <=
                        lDateClick &&
                      ObjetDate_1.GDate.getDateJour(aJour.dateFin) >=
                        lDateClick &&
                      lDateClick <= aInstance.options.derniereDate
                    ) {
                      lZoneClick = lZone;
                    }
                  });
                }
              }
              let lPeriodeClick = null;
              if (!!aInstance.donnees.periodes) {
                for (
                  let i = 0, lNbr = aInstance.donnees.periodes.count();
                  i < lNbr;
                  i++
                ) {
                  const lPeriode = aInstance.donnees.periodes.get(i);
                  lPeriode.donnees.parcourir((aJour) => {
                    if (
                      lDateClick >= aInstance.options.premiereDate &&
                      ObjetDate_1.GDate.getDateJour(aJour.dateDebut) <=
                        lDateClick &&
                      ObjetDate_1.GDate.getDateJour(aJour.dateFin) >=
                        lDateClick &&
                      lDateClick <= aInstance.options.derniereDate
                    ) {
                      lPeriodeClick = lPeriode;
                    }
                  });
                }
              }
              aInstance.callback.appel({
                date: lDateClick,
                periode: lPeriodeClick,
                zone: lZoneClick,
              });
            }
          });
          $(this.node).on({
            pointerdown() {
              if (!IE.estMobile) {
                aInstance.surSelection(aDate);
              }
            },
            pointerenter() {
              if (!IE.estMobile) {
                aInstance.surDragSelection(aDate);
              }
            },
            pointerup() {
              if (IE.estMobile) {
                aInstance.surSelection(aDate);
                aInstance.surFinSelection();
              }
            },
            keyup(aEvent) {
              if (ToucheClavier_1.ToucheClavierUtil.estEventSelection(aEvent)) {
                aInstance.surSelection(aDate);
                aInstance.surFinSelection();
              }
            },
          });
        }
        $(this.node).on({
          keyup(aEvent) {
            let lDate;
            const lDay = ObjetDate_1.GDate.getJourDeDate(new Date(aDate));
            switch (aEvent.which) {
              case ToucheClavier_1.ToucheClavier.FlecheDroite:
                lDate = new Date(
                  new Date(aDate).setDate(new Date(aDate).getDate() + 1),
                );
                break;
              case ToucheClavier_1.ToucheClavier.FlecheGauche:
                lDate = new Date(
                  new Date(aDate).setDate(new Date(aDate).getDate() - 1),
                );
                break;
              case ToucheClavier_1.ToucheClavier.FlecheHaut:
                lDate = new Date(
                  new Date(aDate).setDate(new Date(aDate).getDate() - 7),
                );
                break;
              case ToucheClavier_1.ToucheClavier.FlecheBas:
                lDate = new Date(
                  new Date(aDate).setDate(new Date(aDate).getDate() + 7),
                );
                break;
              case ToucheClavier_1.ToucheClavier.Debut:
                lDate = new Date(
                  new Date(aDate).setDate(
                    new Date(aDate).getDate() -
                      C_ordreJoursSemaine.indexOf(lDay),
                  ),
                );
                break;
              case ToucheClavier_1.ToucheClavier.Fin:
                lDate = new Date(
                  new Date(aDate).setDate(
                    new Date(aDate).getDate() +
                      (6 - C_ordreJoursSemaine.indexOf(lDay)),
                  ),
                );
                break;
            }
            if (lDate) {
              const lCelluleDate = $(".conteneur-ObjetCalendrier").find(
                'td[data-date="' + lDate.toDateString() + '"]',
              );
              if (lCelluleDate && lCelluleDate.get(0)) {
                lCelluleDate.get(0).focus();
              } else if (aEvent.which === ToucheClavier_1.ToucheClavier.Debut) {
                $(".conteneur-ObjetCalendrier")
                  .find(
                    'td[data-date="' +
                      aInstance.options.premiereDate.toDateString() +
                      '"]',
                  )
                  .get(0)
                  .focus();
              } else if (aEvent.which === ToucheClavier_1.ToucheClavier.Fin) {
                $(".conteneur-ObjetCalendrier")
                  .find(
                    'td[data-date="' +
                      aInstance.options.derniereDate.toDateString() +
                      '"]',
                  )
                  .get(0)
                  .focus();
              }
            }
          },
        });
      },
    });
  }
  setParametres(aOptions) {
    $.extend(true, this.options, aOptions);
    this.setOrdreJoursSemaine();
    this.afficher();
  }
  setOrdreJoursSemaine() {
    switch (this.options.premierJourSemaine) {
      case 1:
        C_ordreJoursSemaine = [6, 0, 1, 2, 3, 4, 5];
        break;
      case 2:
        C_ordreJoursSemaine = [0, 1, 2, 3, 4, 5, 6];
        break;
      case 3:
        C_ordreJoursSemaine = [1, 2, 3, 4, 5, 6, 0];
        break;
      case 4:
        C_ordreJoursSemaine = [2, 3, 4, 5, 6, 0, 1];
        break;
      case 5:
        C_ordreJoursSemaine = [3, 4, 5, 6, 0, 1, 2];
        break;
      case 6:
        C_ordreJoursSemaine = [4, 5, 6, 0, 1, 2, 3];
        break;
      case 7:
        C_ordreJoursSemaine = [5, 6, 0, 1, 2, 3, 4];
        break;
      default:
        break;
    }
  }
  setDonnees(aDonnees) {
    let lDate, lElement;
    if ($.isEmptyObject(this.options)) {
      this.setParametres();
    }
    this.donnees = {};
    if (aDonnees) {
      $.extend(true, this.donnees, aDonnees);
    }
    if (this.options.avecJoursNonOuvres) {
      this.donnees.joursNonOuvres = {
        donnees: new ObjetListeElements_1.ObjetListeElements(),
        domaine: this.options.domaineOuvres,
      };
      for (
        lDate = new Date(this.options.premiereDate.getTime());
        lDate <= this.options.derniereDate;
        lDate.setDate(lDate.getDate() + 1)
      ) {
        if (
          this.donnees.joursNonOuvres.domaine.getValeur(
            ObjetDate_1.GDate.getJourDeDate(lDate) + 1,
          )
        ) {
          continue;
        }
        lElement = new ObjetElement_1.ObjetElement();
        lElement.date = new Date(lDate.getTime());
        this.donnees.joursNonOuvres.donnees.addElement(lElement);
      }
    }
    if (this.options.avecJoursFeries) {
      this.donnees.joursFeries = {
        donnees: new ObjetListeElements_1.ObjetListeElements(),
        domaine: GParametres.JoursFeries,
      };
      if (!!this.donnees.feries) {
        this.donnees.feries.parcourir((aJoursFeries) => {
          for (
            lDate = new Date(aJoursFeries.dateDebut);
            lDate <= aJoursFeries.dateFin;
            lDate.setDate(lDate.getDate() + 1)
          ) {
            lElement = new ObjetElement_1.ObjetElement();
            lElement.date = new Date(lDate.getTime());
            this.donnees.joursFeries.donnees.addElement(lElement);
          }
        });
      } else {
        for (
          lDate = new Date(this.options.premiereDate.getTime());
          lDate <= this.options.derniereDate;
          lDate.setDate(lDate.getDate() + 1)
        ) {
          if (
            !this.donnees.joursFeries.domaine.getValeur(
              ObjetDate_1.GDate.getNbrJoursDepuisPremiereLundi(lDate) + 1,
            )
          ) {
            continue;
          }
          lElement = new ObjetElement_1.ObjetElement();
          lElement.date = new Date(lDate.getTime());
          this.donnees.joursFeries.donnees.addElement(lElement);
        }
      }
    }
    if (this.options.avecEdition) {
      if (this.donnees.joursEditables && this.donnees.joursEditables.count()) {
        const lListe = new ObjetListeElements_1.ObjetListeElements();
        this.donnees.joursEditables.parcourir((aJours) => {
          if (aJours.dateDebut && !aJours.date) {
            for (
              lDate = new Date(aJours.dateDebut);
              lDate <= aJours.dateFin;
              lDate.setDate(lDate.getDate() + 1)
            ) {
              lListe.add(
                ObjetElement_1.ObjetElement.create({ date: new Date(lDate) }),
              );
            }
          } else {
            lListe.add(aJours);
          }
        });
        this.donnees.joursEditables = lListe;
      }
    }
    this.afficher();
    if (!!this.donnees.joursFeries) {
      this.donnees.joursFeries.donnees.parcourir((aJourFerie) => {
        let lCelluleDate = $(".conteneur-ObjetCalendrier").find(
          'td[data-date="' + aJourFerie.date.toDateString() + '"]',
        );
        if (!!lCelluleDate && !!lCelluleDate.get(0)) {
          lCelluleDate.addClass(uClassJoursFeries);
          if (
            !this.options.avecEditionJoursFeries &&
            this.options.avecZoneDateUnique
          ) {
            lCelluleDate = $(".conteneur-ObjetCalendrier").find(
              'td[data-date="' +
                aJourFerie.date.toDateString() +
                '"] div.dates > div',
            );
            if (!!lCelluleDate) {
              lCelluleDate.removeClass(uClassAvecEdition);
            }
          }
        }
      });
    }
    if (!!this.donnees.joursNonOuvres) {
      this.donnees.joursNonOuvres.donnees.parcourir((aJourOuvre) => {
        let lCelluleDate = $(".conteneur-ObjetCalendrier").find(
          'td[data-date="' + aJourOuvre.date.toDateString() + '"]',
        );
        if (!!lCelluleDate && !!lCelluleDate.get(0)) {
          lCelluleDate.addClass(uClassJoursNonOuvres);
          if (
            !this.options.avecEditionJoursNonOuvres &&
            this.options.avecZoneDateUnique
          ) {
            lCelluleDate = $(".conteneur-ObjetCalendrier").find(
              'td[data-date="' +
                aJourOuvre.date.toDateString() +
                '"] div.dates > div',
            );
            if (!!lCelluleDate) {
              lCelluleDate.removeClass(uClassAvecEdition);
            }
          }
        }
      });
    }
    if (
      this.options.avecEdition &&
      this.donnees.joursEditables &&
      this.donnees.joursEditables.count() > -1
    ) {
      for (
        lDate = new Date(this.options.premiereDate);
        lDate <= this.options.derniereDate;
        lDate.setDate(lDate.getDate() + 1)
      ) {
        if (
          !this.donnees.joursEditables.getElementParFiltre((aJour) => {
            return ObjetDate_1.GDate.estDateEgale(aJour.date, lDate);
          })
        ) {
          let lCelluleDate = $(".conteneur-ObjetCalendrier").find(
            'td[data-date="' + lDate.toDateString() + '"]',
          );
          if (!!lCelluleDate && !!lCelluleDate.get(0)) {
            lCelluleDate.addClass(uClassJoursNonOuvres);
            lCelluleDate = $(".conteneur-ObjetCalendrier").find(
              'td[data-date="' +
                lDate.toDateString() +
                '"] div.dates.' +
                uClassAvecEdition,
            );
            if (this.options.avecZoneDateUnique) {
              lCelluleDate = $(".conteneur-ObjetCalendrier").find(
                'td[data-date="' + lDate.toDateString() + '"] div.dates > div',
              );
            }
            if (!!lCelluleDate) {
              lCelluleDate.removeClass(uClassAvecEdition);
            }
          }
        }
      }
    }
    if (!!this.donnees.Zones) {
      for (let i = 0, lNbr = this.donnees.Zones.count(); i < lNbr; i++) {
        const lZone = this.donnees.Zones.get(i);
        lZone.donnees.parcourir((aJour) => {
          for (
            let lDate = new Date(aJour.dateDebut);
            lDate <= aJour.dateFin && lDate <= this.options.derniereDate;
            lDate.setDate(lDate.getDate() + 1)
          ) {
            if (lDate >= this.options.premiereDate) {
              let lCelluleDate = $(".conteneur-ObjetCalendrier")
                .find('td[data-date="' + lDate.toDateString() + '"] div.dates')
                .first();
              if (!!lCelluleDate && !!lCelluleDate.get(0)) {
                if (
                  !!lCelluleDate.get(0).dataset.zone &&
                  !this.options.avecZoneDateUnique
                ) {
                  if (lCelluleDate.get(0).dataset.zone !== lZone.id) {
                    if (lDate.getTime() === aJour.dateDebut.getTime()) {
                      const lDateJourAvant = new Date(lDate);
                      lDateJourAvant.setDate(lDate.getDate() - 1);
                      const lCelluleDateAvant = $(".conteneur-ObjetCalendrier")
                        .find(
                          'td[data-date="' +
                            lDateJourAvant.toDateString() +
                            '"] div.dates',
                        )
                        .first();
                      if (
                        !!lCelluleDateAvant &&
                        !!lCelluleDateAvant.get(0) &&
                        lCelluleDateAvant.get(0).dataset.zone &&
                        lCelluleDateAvant.get(0).dataset.zone !== lZone.id
                      ) {
                        lCelluleDateAvant.addClass(uClassPeriodeFin);
                      }
                    }
                    if (lDate.getTime() === aJour.dateFin.getTime()) {
                      const lDateJourApres = new Date(lDate);
                      lDateJourApres.setDate(lDate.getDate() + 1);
                      const lCelluleDateApres = $(".conteneur-ObjetCalendrier")
                        .find(
                          'td[data-date="' +
                            lDateJourApres.toDateString() +
                            '"] div.dates',
                        )
                        .first();
                      if (
                        !!lCelluleDateApres &&
                        !!lCelluleDateApres.get(0) &&
                        lCelluleDateApres.get(0).dataset.zone &&
                        lCelluleDateApres.get(0).dataset.zone !== lZone.id
                      ) {
                        lCelluleDateApres.addClass(uClassPeriodeDebut);
                      }
                    }
                  }
                  lCelluleDate.removeClass(uClassPeriodeDebut);
                  lCelluleDate.removeClass(uClassPeriodeFin);
                }
                lCelluleDate.attr("aria-hidden", "false");
                if (this.options.avecZoneDateUnique) {
                  lCelluleDate = $(".conteneur-ObjetCalendrier").find(
                    'td[data-date="' +
                      lDate.toDateString() +
                      '"] div.dates > div',
                  );
                }
                if (!!lCelluleDate) {
                  if (!!lZone.class) {
                    lCelluleDate.addClass(lZone.class.join(" "));
                  }
                  if (!!lZone.couleur && !lZone.class) {
                    lCelluleDate.attr(
                      "style",
                      "background-color:" +
                        lZone.couleur +
                        ";color:" +
                        (!!lZone.couleurTexte ? lZone.couleurTexte : "black") +
                        ";font-weight:600;",
                    );
                  }
                  if (!!lZone.icon) {
                    lCelluleDate.addClass(lZone.icon);
                  }
                  if (!!lZone.ariaLabel) {
                    lCelluleDate.attr("aria-label", lZone.ariaLabel);
                  }
                  if (this.options.avecZoneDateUnique) {
                    lCelluleDate.removeClass(uClassAvecEdition);
                  }
                  lCelluleDate.attr("data-zone", lZone.id);
                }
              }
            }
          }
          if (!this.options.avecZoneDateUnique) {
            const lCelluleDateDebut = $(".conteneur-ObjetCalendrier")
              .find(
                'td[data-date="' +
                  aJour.dateDebut.toDateString() +
                  '"] div.dates',
              )
              .first();
            const lDateJourAvantDebut = new Date(aJour.dateDebut);
            lDateJourAvantDebut.setDate(lDateJourAvantDebut.getDate() - 1);
            const lCelluleDateAvant = $(".conteneur-ObjetCalendrier")
              .find(
                'td[data-date="' +
                  lDateJourAvantDebut.toDateString() +
                  '"] div.dates',
              )
              .first();
            if (!!lCelluleDateDebut && !!lCelluleDateDebut.get(0)) {
              if (
                this.options.avecZonesFusionnees &&
                !!lCelluleDateAvant &&
                !!lCelluleDateAvant.get(0) &&
                lCelluleDateAvant.get(0).dataset.zone &&
                lCelluleDateAvant.get(0).dataset.zone === lZone.id
              ) {
                lCelluleDateAvant.removeClass(uClassPeriodeFin);
              } else {
                lCelluleDateDebut.addClass(uClassPeriodeDebut);
              }
            }
            const lCelluleDateFin = $(".conteneur-ObjetCalendrier")
              .find(
                'td[data-date="' +
                  aJour.dateFin.toDateString() +
                  '"] div.dates',
              )
              .first();
            if (!!lCelluleDateFin && !!lCelluleDateFin.get(0)) {
              lCelluleDateFin.addClass(uClassPeriodeFin);
            }
          }
        });
      }
    }
    if (!!this.donnees.periodes && this.options.avecPeriodes) {
      for (let i = 0, lNbr = this.donnees.periodes.count(); i < lNbr; i++) {
        const lPeriode = this.donnees.periodes.get(i);
        lPeriode.donnees.parcourir((aJour) => {
          for (
            let lDate = new Date(aJour.dateDebut);
            lDate <= aJour.dateFin && lDate <= this.options.derniereDate;
            lDate.setDate(lDate.getDate() + 1)
          ) {
            if (lDate >= this.options.premiereDate) {
              const lCelluleDate = $(".conteneur-ObjetCalendrier")
                .find(
                  'td[data-date="' +
                    lDate.toDateString() +
                    '"] div.conteneur-periodes',
                )
                .first();
              if (!!lCelluleDate && !!lCelluleDate.get(0)) {
                const lDivPeriode = $(".conteneur-ObjetCalendrier")
                  .find(
                    'td[data-date="' +
                      lDate.toDateString() +
                      '"] div.conteneur-periodes div[data-periode="' +
                      aJour.dataPeriode +
                      '"]',
                  )
                  .first();
                if (lDivPeriode && lDivPeriode.get(0)) {
                  lDivPeriode.get(0).style.backgroundColor = lPeriode.couleur;
                } else {
                  lCelluleDate.ieHtmlAppend(
                    IE.jsx.str("div", {
                      "data-periode": aJour.dataPeriode,
                      style: "background-color:" + lPeriode.couleur + ";",
                    }),
                  );
                }
              }
            }
          }
          this.rechercherPeriodeDeMemeSemaine(aJour.dateDebut, aJour);
          this.rechercherPeriodeDeMemeSemaine(aJour.dateFin, aJour);
        });
      }
    }
    if (this.options.avecJourCourant) {
      const lCelluleDateAJD = $(".conteneur-ObjetCalendrier").find(
        'td[data-date="' +
          ObjetDate_1.GDate.aujourdhui.toDateString() +
          '"] > div',
      );
      if (!!lCelluleDateAJD && !!lCelluleDateAJD.get(0)) {
        lCelluleDateAJD.addClass("date-aujourdhui");
      }
    }
  }
  setFocusSurDate(aDate) {
    const lCelluleDate = $(".conteneur-ObjetCalendrier").find(
      'td[data-date="' + aDate.toDateString() + '"]',
    );
    if (lCelluleDate && lCelluleDate.get(0)) {
      lCelluleDate.get(0).focus();
      const lCelluleMois = $(".conteneur-mois").has(
        'td[data-date="' + aDate.toDateString() + '"]',
      );
      if (
        lCelluleMois &&
        lCelluleMois.get(0) &&
        lCelluleMois.get(0).scrollIntoView
      ) {
        lCelluleMois.get(0).scrollIntoView();
      }
    }
    return ObjetHtml_1.GHtml.getParentScrollable(this.Nom).scrollTop;
  }
  construireAffichage() {
    const H = [];
    if (!!this.donnees) {
      H.push('<div class="conteneur-ObjetCalendrier SansSelectionTexte">');
      let lMoisActuel = this.options.premiereDate.getMonth();
      let lAnneeActuelle = this.options.premiereDate.getFullYear();
      const lNbrMois = ObjetDate_1.GDate.nombreMoisSurPeriode(
        this.options.premiereDate,
        this.options.derniereDate,
      );
      for (let i = 0; i < lNbrMois; i++) {
        if (lMoisActuel === 12) {
          lMoisActuel = 0;
          lAnneeActuelle++;
        }
        const lParam = {};
        if (i === 0 || i === lNbrMois - 1) {
          lParam.date =
            i === 0 ? this.options.premiereDate : this.options.derniereDate;
          lParam.avantDate = i === 0;
        }
        H.push(this.composeHtmlMois(lMoisActuel, lAnneeActuelle, lParam));
        lMoisActuel++;
      }
      H.push("</div>");
    }
    return H.join("");
  }
  composeHtmlMois(aMois, aAnnee, aParams) {
    const H = [];
    H.push('<div class="conteneur-mois">');
    H.push(
      IE.jsx.str(
        "div",
        { class: "nom-mois" },
        ObjetTraduction_1.GTraductions.getValeur("Mois")[aMois].ucfirst() +
          "&nbsp;" +
          aAnnee,
      ),
    );
    H.push('<table class="full-width">');
    H.push('<tr class="ligne-journee">');
    C_ordreJoursSemaine.forEach((i) => {
      let lJourneeClass =
        this.options.domaineOuvres.getValeur(i + 1) ||
        !this.options.avecJoursNonOuvres
          ? ""
          : "journee-nonOuvre";
      if (!!this.options.journeeAvecClass) {
        this.options.journeeAvecClass.forEach((aJourneeClass) => {
          lJourneeClass =
            !!aJourneeClass && aJourneeClass.jours.getValeur(i + 1)
              ? aJourneeClass.class
              : lJourneeClass;
        });
      }
      H.push(
        IE.jsx.str(
          "td",
          { class: lJourneeClass },
          ObjetTraduction_1.GTraductions.getValeur("JoursCourt")[i].ucfirst(),
        ),
      );
    });
    H.push("</tr>");
    let lIndiceJour = 1;
    let lJour = new Date(aAnnee, aMois, lIndiceJour);
    let lDay = ObjetDate_1.GDate.getJourDeDate(lJour);
    if (lDay !== C_ordreJoursSemaine[0]) {
      H.push('<tr class="ligne-date">');
      C_ordreJoursSemaine.forEach((i, index) => {
        if (index < C_ordreJoursSemaine.indexOf(lDay)) {
          H.push("<td></td>");
        }
      });
    }
    let lEstPremiereDateEditable = true;
    while (aMois === lJour.getMonth()) {
      if (lDay === C_ordreJoursSemaine[0]) {
        H.push('<tr class="ligne-date">');
      }
      let lClassHorsPeriode = "";
      let lTabIndex = 1;
      if (!!aParams && !!aParams.date) {
        if (aParams.avantDate) {
          if (lIndiceJour < aParams.date.getDate()) {
            lClassHorsPeriode = "date-horsPeriode";
            lTabIndex = -1;
          }
        } else {
          if (lIndiceJour > aParams.date.getDate()) {
            lClassHorsPeriode = "date-horsPeriode";
            lTabIndex = -1;
          }
        }
      }
      const lAvecEdition =
        this.options.avecEdition &&
        !(
          this.options.marquageJoursAvantDate &&
          ObjetDate_1.GDate.estAvantJour(
            lJour,
            this.options.marquageJoursAvantDate,
          )
        );
      if (
        lEstPremiereDateEditable &&
        lAvecEdition &&
        !lClassHorsPeriode &&
        this.avecEditionSurDate(lJour)
      ) {
        lTabIndex = 0;
        lEstPremiereDateEditable = false;
      }
      H.push(
        IE.jsx.str(
          "td",
          {
            class: lClassHorsPeriode,
            "aria-disabled": lClassHorsPeriode && "true",
            "data-date": lJour.toDateString(),
            "ie-hint": !IE.estMobile ? "getHint('" + lJour + "')" : "",
            "ie-attr": "getAttr('" + lJour + "')",
            tabindex: lTabIndex + "",
            "ie-node": `surNodeJour('${lJour}')`,
          },
          IE.jsx.str(
            "div",
            { class: this.options.avecZoneDateUnique ? "unique" : "" },
            IE.jsx.str(
              "div",
              {
                class: [
                  "dates",
                  !!this.options.marquageJoursAvantDate &&
                  ObjetDate_1.GDate.estAvantJour(
                    lJour,
                    this.options.marquageJoursAvantDate,
                  )
                    ? "avant-date"
                    : "",
                  !this.options.avecZoneDateUnique ? "non-unique" : "",
                  !this.options.avecZoneDateUnique &&
                  lAvecEdition &&
                  !lClassHorsPeriode
                    ? uClassAvecEdition
                    : "",
                ],
              },
              this.options.avecZoneDateUnique
                ? IE.jsx.str(
                    "div",
                    {
                      class: [
                        "dates-uniques",
                        lAvecEdition && !lClassHorsPeriode
                          ? uClassAvecEdition
                          : "",
                      ],
                      "aria-hidden": "true",
                    },
                    lJour.getDate(),
                  )
                : IE.jsx.str(
                    "span",
                    { "aria-hidden": "true" },
                    lJour.getDate(),
                  ),
            ),
            this.options.avecPeriodes
              ? IE.jsx.str("div", { class: "conteneur-periodes" })
              : "",
          ),
        ),
      );
      if (lDay === C_ordreJoursSemaine[6]) {
        H.push("</tr>");
      }
      lIndiceJour++;
      lJour = new Date(aAnnee, aMois, lIndiceJour);
      lDay = ObjetDate_1.GDate.getJourDeDate(lJour);
    }
    H.push("</tr>");
    H.push("</table>");
    H.push("</div>");
    return H.join("");
  }
  composeLegende(aParams) {
    let lListeZones = new ObjetListeElements_1.ObjetListeElements();
    if (!!aParams.listeZones) {
      aParams.listeZones.parcourir((aZone) => {
        lListeZones.add(aZone);
      });
      lListeZones.trier();
    }
    const T = [];
    T.push('<div class="legende-ObjetCalendrier">');
    if (!!aParams.donnees) {
      T.push(
        IE.jsx.str(
          "div",
          { class: "flex-contain" },
          IE.jsx.str(
            "span",
            { class: "EspaceDroit" },
            ObjetTraduction_1.GTraductions.getValeur("VacancesEtJoursFeries"),
          ),
          IE.jsx.str("span", { class: "legende-joursFeries" }),
        ),
      );
      T.push(
        IE.jsx.str(
          "div",
          { class: "flex-contain" },
          IE.jsx.str(
            "span",
            null,
            ObjetTraduction_1.GTraductions.getValeur("Aujourdhui"),
          ),
          IE.jsx.str("span", { class: "legende-aujourdhui" }),
        ),
      );
      if (!!lListeZones && lListeZones.count()) {
        T.push(
          `<div ${!!aParams.libelleZones ? "" : 'class="separation-top"'}>`,
        );
        if (!!aParams.libelleZones) {
          T.push(IE.jsx.str("h5", { class: "ie-titre" }, aParams.libelleZones));
        }
        for (let i = 0; i < lListeZones.count(); i++) {
          const lZone = lListeZones.get(i);
          T.push(
            IE.jsx.str(
              "div",
              { class: "flex-contain" },
              IE.jsx.str(
                "ie-checkbox",
                {
                  class: "legende-cb",
                  "ie-textright": true,
                  "ie-model": "cbSelectZone(" + lZone.getPosition() + ")",
                },
                lZone.libelleLegende,
              ),
              IE.jsx.str("span", {
                class: lZone.class,
                style:
                  "width:2rem;height:2rem;border-radius:50%;margin-left:auto;" +
                  (!!lZone.couleur
                    ? "background-color:" + lZone.couleur + ";"
                    : ""),
              }),
            ),
          );
        }
        T.push("</div>");
      }
      if (!!aParams.listePeriodes && aParams.listePeriodes.count()) {
        T.push(
          `<div ${!!aParams.libellePeriodes ? "" : 'class="separation-top"'}>`,
        );
        if (!!aParams.libellePeriodes) {
          T.push(
            IE.jsx.str("h5", { class: "ie-titre" }, aParams.libellePeriodes),
          );
        }
        for (let i = 0; i < aParams.listePeriodes.count(); i++) {
          const lPeriode = aParams.listePeriodes.get(i);
          T.push(
            IE.jsx.str(
              "div",
              { class: "flex-contain" },
              IE.jsx.str(
                "ie-checkbox",
                {
                  class: "legende-cb",
                  "ie-textright": true,
                  "ie-model": "cbSelectPeriode(" + i + ")",
                },
                lPeriode.getLibelle(),
              ),
              IE.jsx.str("span", {
                style:
                  "width:2rem;height:0.3rem;border-radius:1rem;margin-left:auto;background-color:" +
                  lPeriode.couleur +
                  ";",
              }),
            ),
          );
        }
        T.push("</div>");
      }
    }
    T.push("</div>");
    return T.join("");
  }
  rechercherPeriodeDeMemeSemaine(aDate, aJour) {
    for (
      let lDatePrec = new Date(aDate), lDebutSemaine = false;
      !lDebutSemaine &&
      lDatePrec >= this.options.premiereDate &&
      lDatePrec.getMonth() === aDate.getMonth();
      lDatePrec.setDate(lDatePrec.getDate() - 1)
    ) {
      if (lDatePrec <= this.options.derniereDate) {
        const lCelluleDatePrec = $(".conteneur-ObjetCalendrier")
          .find(
            'td[data-date="' +
              lDatePrec.toDateString() +
              '"] div.conteneur-periodes',
          )
          .first();
        if (!!lCelluleDatePrec && !!lCelluleDatePrec.get(0)) {
          const lDivPeriodePrec = $(".conteneur-ObjetCalendrier")
            .find(
              'td[data-date="' +
                lDatePrec.toDateString() +
                '"] div.conteneur-periodes div[data-periode="' +
                aJour.dataPeriode +
                '"]',
            )
            .first();
          if (!lDivPeriodePrec || !lDivPeriodePrec.get(0)) {
            lCelluleDatePrec.ieHtmlAppend(
              IE.jsx.str("div", { "data-periode": aJour.dataPeriode }),
            );
          }
        }
        lDebutSemaine =
          ObjetDate_1.GDate.getJourDeDate(lDatePrec) === C_ordreJoursSemaine[0];
      }
    }
    for (
      let lDateSuiv = new Date(aDate), lFinSemaine = false;
      !lFinSemaine &&
      lDateSuiv <= this.options.derniereDate &&
      lDateSuiv.getMonth() === aDate.getMonth();
      lDateSuiv.setDate(lDateSuiv.getDate() + 1)
    ) {
      if (lDateSuiv >= this.options.premiereDate) {
        const lCelluleDateSuiv = $(".conteneur-ObjetCalendrier")
          .find(
            'td[data-date="' +
              lDateSuiv.toDateString() +
              '"] div.conteneur-periodes',
          )
          .first();
        if (!!lCelluleDateSuiv && !!lCelluleDateSuiv.get(0)) {
          const lDivPeriodeSuiv = $(".conteneur-ObjetCalendrier")
            .find(
              'td[data-date="' +
                lDateSuiv.toDateString() +
                '"] div.conteneur-periodes div[data-periode="' +
                aJour.dataPeriode +
                '"]',
            )
            .first();
          if (!lDivPeriodeSuiv || !lDivPeriodeSuiv.get(0)) {
            lCelluleDateSuiv.ieHtmlAppend(
              IE.jsx.str("div", { "data-periode": aJour.dataPeriode }),
            );
          }
        }
        lFinSemaine =
          ObjetDate_1.GDate.getJourDeDate(lDateSuiv) === C_ordreJoursSemaine[6];
      }
    }
  }
  avecEditionSurDate(aDateClick) {
    if (
      this.donnees.joursEditables &&
      !this.donnees.joursEditables.getElementParFiltre((aJour) => {
        return ObjetDate_1.GDate.estDateEgale(aJour.date, aDateClick);
      })
    ) {
      return false;
    }
    let lFeriesClick = null;
    if (!!this.donnees.joursFeries && !this.options.avecEditionJoursFeries) {
      for (
        let i = 0, lNbr = this.donnees.joursFeries.donnees.count();
        i < lNbr;
        i++
      ) {
        const lFeries = this.donnees.joursFeries.donnees.get(i);
        if (
          aDateClick >= this.options.premiereDate &&
          ObjetDate_1.GDate.estDateEgale(lFeries.date, aDateClick) &&
          aDateClick <= this.options.derniereDate
        ) {
          lFeriesClick = lFeries;
        }
      }
    }
    if (
      lFeriesClick ||
      (!this.options.avecEditionJoursNonOuvres &&
        this.donnees.joursNonOuvres &&
        !this.donnees.joursNonOuvres.domaine.getValeur(aDateClick.getDay()))
    ) {
      return false;
    }
    return true;
  }
  surSelection(aDate) {
    const lDateClick = ObjetDate_1.GDate.getDateJour(new Date(aDate));
    if (!this.avecEditionSurDate(lDateClick)) {
      return;
    }
    this.selection.dateDepartSelection = lDateClick;
    this.selection.dateFinSelection = lDateClick;
    const lCelluleDate = $(".conteneur-ObjetCalendrier").find(
      'td[data-date="' +
        lDateClick.toDateString() +
        '"] div.dates.' +
        uClassAvecEdition,
    );
    const lZone = this.donnees.Zones.get(0);
    if (
      !!lCelluleDate &&
      lCelluleDate.length &&
      lZone &&
      lDateClick >= this.options.premiereDate &&
      lDateClick <= this.options.derniereDate
    ) {
      const lClassZone = lZone.class.join(" ");
      this.selection.estSurZone = false;
      lZone.donnees.parcourir((aJour) => {
        if (
          ObjetDate_1.GDate.getDateJour(aJour.dateDebut) <= lDateClick &&
          ObjetDate_1.GDate.getDateJour(aJour.dateFin) >= lDateClick
        ) {
          this.selection.estSurZone = true;
        }
      });
      if (this.selection.estSurZone) {
        if (this.options.avecSuppressionSurZone) {
          lCelluleDate.removeClass(lClassZone);
        } else {
          lCelluleDate.addClass(uClassSurSelectionZone);
        }
      } else {
        lCelluleDate.addClass(lClassZone);
      }
      this.selection.avecMouseDown = true;
    }
  }
  surDragSelection(aDate) {
    if (this.selection.avecMouseDown) {
      const lDateClick = ObjetDate_1.GDate.getDateJour(new Date(aDate));
      if (!this.avecEditionSurDate(lDateClick)) {
        return;
      }
      const lZone = this.donnees.Zones.get(0);
      if (
        $(".conteneur-ObjetCalendrier").find(
          'td[data-date="' +
            lDateClick.toDateString() +
            '"] div.dates.' +
            uClassAvecEdition,
        ).length &&
        lZone &&
        lDateClick >= this.options.premiereDate &&
        lDateClick <= this.options.derniereDate
      ) {
        const lClassZone = lZone.class.join(" ");
        if (lDateClick <= this.selection.dateDepartSelection) {
          for (
            let lDate = ObjetDate_1.GDate.getDateJour(new Date(aDate));
            lDate <= this.selection.dateDepartSelection;
            lDate.setDate(lDate.getDate() + 1)
          ) {
            const lCelluleDate = $(".conteneur-ObjetCalendrier").find(
              'td[data-date="' +
                lDate.toDateString() +
                '"] div.dates.' +
                uClassAvecEdition,
            );
            if (lCelluleDate.length) {
              if (this.selection.estSurZone) {
                if (lCelluleDate.hasClass(lClassZone)) {
                  if (this.options.avecSuppressionSurZone) {
                    lCelluleDate.removeClass(lClassZone);
                  } else {
                    lCelluleDate.addClass(uClassSurSelectionZone);
                  }
                }
              } else {
                if (!this.avecEditionSurDate(lDate)) {
                  continue;
                }
                lCelluleDate.addClass(lClassZone);
              }
            }
          }
        } else if (lDateClick > this.selection.dateDepartSelection) {
          for (
            let lDate = ObjetDate_1.GDate.getDateJour(new Date(aDate));
            lDate > this.selection.dateDepartSelection;
            lDate.setDate(lDate.getDate() - 1)
          ) {
            const lCelluleDate = $(".conteneur-ObjetCalendrier").find(
              'td[data-date="' +
                lDate.toDateString() +
                '"] div.dates.' +
                uClassAvecEdition,
            );
            if (lCelluleDate.length) {
              if (this.selection.estSurZone) {
                if (lCelluleDate.hasClass(lClassZone)) {
                  if (this.options.avecSuppressionSurZone) {
                    lCelluleDate.removeClass(lClassZone);
                  } else {
                    lCelluleDate.addClass(uClassSurSelectionZone);
                  }
                }
              } else {
                if (!this.avecEditionSurDate(lDate)) {
                  continue;
                }
                lCelluleDate.addClass(lClassZone);
              }
            }
          }
        }
        if (
          this.selection.dateFinSelection > this.selection.dateDepartSelection
        ) {
          for (
            let lDate = new Date(
              new Date(lDateClick).setDate(lDateClick.getDate() + 1),
            );
            lDate <= this.selection.dateFinSelection;
            lDate.setDate(lDate.getDate() + 1)
          ) {
            if (lDate > this.selection.dateDepartSelection) {
              const lCelluleDate = $(".conteneur-ObjetCalendrier").find(
                'td[data-date="' +
                  lDate.toDateString() +
                  '"] div.dates.' +
                  uClassAvecEdition,
              );
              if (lCelluleDate.length) {
                if (this.selection.estSurZone) {
                  let lEstDateAGerer = false;
                  lZone.donnees.parcourir((aJour) => {
                    if (
                      ObjetDate_1.GDate.getDateJour(aJour.dateDebut) <= lDate &&
                      ObjetDate_1.GDate.getDateJour(aJour.dateFin) >= lDate
                    ) {
                      lEstDateAGerer = true;
                    }
                  });
                  if (lEstDateAGerer) {
                    if (this.options.avecSuppressionSurZone) {
                      lCelluleDate.addClass(lClassZone);
                    } else {
                      lCelluleDate.removeClass(uClassSurSelectionZone);
                    }
                  }
                } else {
                  let lEstDateAGerer = true;
                  lZone.donnees.parcourir((aJour) => {
                    if (
                      ObjetDate_1.GDate.getDateJour(aJour.dateDebut) <= lDate &&
                      ObjetDate_1.GDate.getDateJour(aJour.dateFin) >= lDate
                    ) {
                      lEstDateAGerer = false;
                    }
                  });
                  if (lEstDateAGerer) {
                    lCelluleDate.removeClass(lClassZone);
                  }
                }
              }
            }
          }
        } else if (
          this.selection.dateFinSelection < this.selection.dateDepartSelection
        ) {
          for (
            let lDate = new Date(
              new Date(lDateClick).setDate(lDateClick.getDate() - 1),
            );
            lDate >= this.selection.dateFinSelection;
            lDate.setDate(lDate.getDate() - 1)
          ) {
            if (lDate < this.selection.dateDepartSelection) {
              const lCelluleDate = $(".conteneur-ObjetCalendrier").find(
                'td[data-date="' +
                  lDate.toDateString() +
                  '"] div.dates.' +
                  uClassAvecEdition,
              );
              if (lCelluleDate.length) {
                if (this.selection.estSurZone) {
                  let lEstDateAGerer = false;
                  lZone.donnees.parcourir((aJour) => {
                    if (
                      ObjetDate_1.GDate.getDateJour(aJour.dateDebut) <= lDate &&
                      ObjetDate_1.GDate.getDateJour(aJour.dateFin) >= lDate
                    ) {
                      lEstDateAGerer = true;
                    }
                  });
                  if (lEstDateAGerer) {
                    if (this.options.avecSuppressionSurZone) {
                      lCelluleDate.addClass(lClassZone);
                    } else {
                      lCelluleDate.removeClass(uClassSurSelectionZone);
                    }
                  }
                } else {
                  let lEstDateAGerer = true;
                  lZone.donnees.parcourir((aJour) => {
                    if (
                      ObjetDate_1.GDate.getDateJour(aJour.dateDebut) <= lDate &&
                      ObjetDate_1.GDate.getDateJour(aJour.dateFin) >= lDate
                    ) {
                      lEstDateAGerer = false;
                    }
                  });
                  if (lEstDateAGerer) {
                    lCelluleDate.removeClass(lClassZone);
                  }
                }
              }
            }
          }
        }
        this.selection.dateFinSelection = lDateClick;
      }
    }
  }
  surFinSelection() {
    if (this.selection && this.selection.avecMouseDown) {
      const lDateDebutSaisie =
        this.selection.dateDepartSelection > this.selection.dateFinSelection
          ? this.selection.dateFinSelection
          : this.selection.dateDepartSelection;
      const lDateFinSaisie =
        this.selection.dateFinSelection > this.selection.dateDepartSelection
          ? this.selection.dateFinSelection
          : this.selection.dateDepartSelection;
      if (lDateDebutSaisie && lDateFinSaisie) {
        const lObjet = { dateDebut: lDateDebutSaisie, dateFin: lDateFinSaisie };
        this.callback.appel({
          dates: lObjet,
          estSurZone: this.selection.estSurZone,
          estMultiSelection: !ObjetDate_1.GDate.estDateEgale(
            this.selection.dateDepartSelection,
            this.selection.dateFinSelection,
          ),
        });
      }
      this.selection.avecMouseDown = null;
      this.selection.estSurZone = false;
    }
  }
}
exports.ObjetCalendrierPeriode = ObjetCalendrierPeriode;
