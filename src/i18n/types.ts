export type Language = 'es' | 'en' | 'ar';

export interface Translations {
  nav: {
    scan: string;
    search: string;
    places: string;
    soon: string;
  };
  header: {
    title: string;
    helpTooltip: string;
  };
  scanner: {
    pointBarcode: string;
    ocrTooltip: string;
    cameraErrorTitle: string;
    cameraErrorDenied: string;
    cameraErrorGeneric: string;
    uploadOrPhoto: string;
    searchByName: string;
  };
  result: {
    analyzing: string;
    notFoundTitle: string;
    notFoundDesc: string;
    ocrButton: string;
    scanAnother: string;
    scanAnotherProduct: string;
    statusHalal: string;
    statusHaram: string;
    statusDoubtful: string;
    meatWarningTitle: string;
    meatWarningDesc: string;
    identifiedIngredients: string;
    showFullIngredients: string;
    hideFullIngredients: string;
    noIngredientsRecorded: string;
    naturalHalalExplanation: string;
  };
  search: {
    title: string;
    subtitle: string;
    placeholder: string;
    searching: string;
    noResultsTitle: string;
    noResultsDesc: string;
    badgeHalal: string;
    badgeHaram: string;
    badgeDoubtful: string;
  };
  locales: {
    phaseBadge: string;
    title: string;
    subtitle: string;
    restaurantsTitle: string;
    restaurantsDesc: string;
    butchersTitle: string;
    butchersDesc: string;
  };
  guide: {
    title: string;
    subtitle: string;
    close: string;
    trafficLightTitle: string;
    trafficLightHalal: string;
    trafficLightDoubtful: string;
    trafficLightHaram: string;
    meatRuleTitle: string;
    meatRuleDesc: string;
    additivesTitle: string;
    additivesDesc: string;
    sourcesTitle: string;
    sourcesDesc: string;
  };
}
