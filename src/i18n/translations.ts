import type { Language, Translations } from './types';

export const translations: Record<Language, Translations> = {
  es: {
    nav: {
      scan: 'Escanear',
      search: 'Buscar',
      places: 'Locales',
      soon: 'Pronto',
    },
    header: {
      title: 'Halall',
      helpTooltip: 'Guía metodológica',
    },
    scanner: {
      pointBarcode: 'Apunta al código de barras del producto',
      ocrTooltip: 'Tomar foto de ingredientes (OCR)',
      cameraErrorTitle: 'Cámara no disponible',
      cameraErrorDenied: 'Permiso de cámara denegado. Concede acceso a la cámara para escanear.',
      cameraErrorGeneric: 'No se pudo iniciar la cámara en este dispositivo.',
      uploadOrPhoto: 'Subir o tomar foto de ingredientes',
      searchByName: 'Buscar producto por nombre',
    },
    result: {
      analyzing: 'Analizando ingredientes...',
      notFoundTitle: 'Producto no encontrado',
      notFoundDesc: 'El código de barras no está en nuestro índice.',
      ocrButton: 'Fotografiar lista de ingredientes (OCR)',
      scanAnother: 'Escanear otro código',
      scanAnotherProduct: 'Escanear otro producto',
      statusHalal: 'Halal Confirmado',
      statusHaram: 'No Apto (Haram)',
      statusDoubtful: 'Dudoso / Requiere Revisión',
      meatWarningTitle: 'Aviso de carne:',
      meatWarningDesc:
        'Contiene carne terrestre (pollo/pavo/vacuno). Verifica si el paquete incluye sello de certificación halal acreditada.',
      identifiedIngredients: 'Ingredientes identificados',
      showFullIngredients: 'Ver ingredientes completos',
      hideFullIngredients: 'Ocultar ingredientes',
      noIngredientsRecorded:
        'No hay lista de ingredientes registrada para este producto en la base de datos',
      naturalHalalExplanation: 'Alimento o agua natural sin aditivos añadidos',
    },
    search: {
      title: 'Buscar producto',
      subtitle: 'Busca por nombre de producto o marca española',
      placeholder: 'Ej: yogur fresa, galletas digestive...',
      searching: 'Buscando productos indexados...',
      noResultsTitle: 'No encontramos coincidencias',
      noResultsDesc:
        'Si tienes el producto físico delante, usa la cámara para escanear el código de barras o su etiqueta.',
      badgeHalal: 'Halal',
      badgeHaram: 'Haram',
      badgeDoubtful: 'Dudoso',
    },
    locales: {
      phaseBadge: 'Fase 2 del Proyecto',
      title: 'Restaurantes y Carnicerías Halal',
      subtitle:
        'Estamos preparando el mapa y directorio más preciso y verificado de locales halal en toda España.',
      restaurantsTitle: 'Restaurantes',
      restaurantsDesc: 'Certificación comprobada, sin alcohol o con opciones 100% halal.',
      butchersTitle: 'Carnicerías',
      butchersDesc: 'Trazabilidad de matadero y proveedores acreditados por zona.',
    },
    guide: {
      title: 'Guía Metodológica Halall',
      subtitle: 'Criterios claros y transparentes de clasificación',
      close: 'Cerrar',
      trafficLightTitle: 'Sistema de semáforo',
      trafficLightHalal:
        '✅ Halal Confirmado: Productos vegetales, agua natural o con certificación halal sin aditivos conflictivos.',
      trafficLightDoubtful:
        '⚠️ Dudoso: Ingredientes de origen animal no verificado (como E471 o carnes sin sello oficial).',
      trafficLightHaram:
        '❌ No Apto (Haram): Contiene derivados de cerdo, alcohol, carmín de cochinilla (E120) o ingredientes prohibidos.',
      meatRuleTitle: 'Regla estricta de la carne',
      meatRuleDesc:
        'El pollo, vacuno o pavo se clasifica como dudoso a menos que cuente con certificación halal acreditada en el empaque.',
      additivesTitle: 'Criterio de aditivos y números E',
      additivesDesc:
        'Evaluamos los aditivos críticos: el E120 (carmín) es Haram; gelatinas y emulsionantes (E471) son dudosos sin origen vegetal certificado.',
      sourcesTitle: 'Fuentes y verificación',
      sourcesDesc:
        'Datos contrastados con Open Food Facts, análisis inteligente de etiquetas con IA y validación comunitaria continua.',
    },
  },
  en: {
    nav: {
      scan: 'Scan',
      search: 'Search',
      places: 'Places',
      soon: 'Soon',
    },
    header: {
      title: 'Halall',
      helpTooltip: 'Methodology Guide',
    },
    scanner: {
      pointBarcode: 'Point camera at product barcode',
      ocrTooltip: 'Take photo of ingredients (OCR)',
      cameraErrorTitle: 'Camera unavailable',
      cameraErrorDenied: 'Camera permission denied. Grant camera access to scan.',
      cameraErrorGeneric: 'Could not start camera on this device.',
      uploadOrPhoto: 'Upload or take photo of ingredients',
      searchByName: 'Search product by name',
    },
    result: {
      analyzing: 'Analyzing ingredients...',
      notFoundTitle: 'Product not found',
      notFoundDesc: 'The barcode is not in our database yet.',
      ocrButton: 'Photograph ingredients list (OCR)',
      scanAnother: 'Scan another barcode',
      scanAnotherProduct: 'Scan another product',
      statusHalal: 'Halal Verified',
      statusHaram: 'Not Permitted (Haram)',
      statusDoubtful: 'Doubtful / Requires Review',
      meatWarningTitle: 'Meat warning:',
      meatWarningDesc:
        'Contains land meat (poultry/beef). Check packaging for an accredited halal certification label.',
      identifiedIngredients: 'Identified ingredients',
      showFullIngredients: 'View full ingredients',
      hideFullIngredients: 'Hide ingredients',
      noIngredientsRecorded:
        'No ingredient list registered for this product in the database',
      naturalHalalExplanation: 'Natural food or water with no added additives',
    },
    search: {
      title: 'Search product',
      subtitle: 'Search by product name or brand',
      placeholder: 'E.g., strawberry yogurt, digestive biscuits...',
      searching: 'Searching indexed products...',
      noResultsTitle: 'No matches found',
      noResultsDesc:
        'If you have the physical product, use the camera to scan its barcode or label.',
      badgeHalal: 'Halal',
      badgeHaram: 'Haram',
      badgeDoubtful: 'Doubtful',
    },
    locales: {
      phaseBadge: 'Project Phase 2',
      title: 'Halal Restaurants & Butcheries',
      subtitle:
        'Preparing the most accurate and verified directory of halal establishments in Spain.',
      restaurantsTitle: 'Restaurants',
      restaurantsDesc: 'Verified certification, alcohol-free or with 100% halal options.',
      butchersTitle: 'Butcher shops',
      butchersDesc: 'Full traceability from accredited slaughterhouses and suppliers by region.',
    },
    guide: {
      title: 'Halall Methodology Guide',
      subtitle: 'Clear and transparent classification criteria',
      close: 'Close',
      trafficLightTitle: 'Traffic light status system',
      trafficLightHalal:
        '✅ Halal Verified: Plant-based, natural water or certified halal products without problematic additives.',
      trafficLightDoubtful:
        '⚠️ Doubtful: Ingredients of unverified animal origin (such as E471 or meats without an official seal).',
      trafficLightHaram:
        '❌ Not Permitted (Haram): Explicitly contains pork derivatives, alcohol, carmine (E120), or prohibited substances.',
      meatRuleTitle: 'Strict meat policy',
      meatRuleDesc:
        'Land meats (chicken, beef, turkey) are automatically classified as doubtful unless an accredited halal certificate is present on the pack.',
      additivesTitle: 'Food additives criteria (E-numbers)',
      additivesDesc:
        'We evaluate critical additives: E120 (carmine) is Haram; gelatin and emulsifiers (E471) are doubtful unless plant origin is certified.',
      sourcesTitle: 'Data sources and verification',
      sourcesDesc:
        'Cross-referenced with Open Food Facts, AI smart label analysis, and continuous community validation.',
    },
  },
  ar: {
    nav: {
      scan: 'مسح',
      search: 'بحث',
      places: 'أماكن',
      soon: 'قريباً',
    },
    header: {
      title: 'حلال',
      helpTooltip: 'دليل المنهجية',
    },
    scanner: {
      pointBarcode: 'وجّه الكاميرا نحو الرمز الشريطي للمنتج',
      ocrTooltip: 'التقاط صورة للمكونات (OCR)',
      cameraErrorTitle: 'الكاميرا غير متاحة',
      cameraErrorDenied: 'تم رفض إذن الكاميرا. يرجى منح الإذن للتمكن من المسح.',
      cameraErrorGeneric: 'تعذر تشغيل الكاميرا على هذا الجهاز.',
      uploadOrPhoto: 'رفع أو التقاط صورة للمكونات',
      searchByName: 'البحث عن منتج بالاسم',
    },
    result: {
      analyzing: 'جارٍ تحليل المكونات...',
      notFoundTitle: 'المنتج غير موجود',
      notFoundDesc: 'الرمز الشريطي غير مسجل في قاعدتنا حالياً.',
      ocrButton: 'تصوير قائمة المكونات (OCR)',
      scanAnother: 'مسح رمز آخر',
      scanAnotherProduct: 'مسح منتج آخر',
      statusHalal: 'حلال مؤكد',
      statusHaram: 'غير مناسب (حرام)',
      statusDoubtful: 'مشبوه / يتطلب مراجعة',
      meatWarningTitle: 'تنبيه لحوم:',
      meatWarningDesc:
        'يحتوي على لحوم برية (دجاج/ديك رومي/بقر). تحقق من وجود ختم شهادة حلال معتمدة على العبوة.',
      identifiedIngredients: 'المكونات المحددة',
      showFullIngredients: 'عرض المكونات الكاملة',
      hideFullIngredients: 'إخفاء المكونات',
      noIngredientsRecorded: 'لا توجد قائمة مكونات مسجلة لهذا المنتج في قاعدة البيانات',
      naturalHalalExplanation: 'طعام أو ماء طبيعي بدون إضافات',
    },
    search: {
      title: 'البحث عن منتج',
      subtitle: 'ابحث باسم المنتج أو العلامة التجارية في إسبانيا',
      placeholder: 'مثال: زبادي فراولة، بسكويت دايجستف...',
      searching: 'جارٍ البحث في المنتجات المفهرسة...',
      noResultsTitle: 'لم نجد أي تطابق',
      noResultsDesc:
        'إذا كان المنتج الفعلي معك، استخدم الكاميرا لمسح الرمز الشريطي أو ملصق المكونات.',
      badgeHalal: 'حلال',
      badgeHaram: 'حرام',
      badgeDoubtful: 'مشبوه',
    },
    locales: {
      phaseBadge: 'المرحلة الثانية من المشروع',
      title: 'مطاعم وملاحم حلال',
      subtitle: 'نعمل على إعداد الدليل والخريطة الأكثر دقة وموثوقية للمتاجر والمطاعم الحلال في إسبانيا.',
      restaurantsTitle: 'مطاعم',
      restaurantsDesc: 'شهادات معتمدة ومحققة، خالية من الكحول أو بخيارات حلال 100%.',
      butchersTitle: 'ملاحم',
      butchersDesc: 'تتبع لمصادر المذابح والموردين المعتمدين حسب المنطقة.',
    },
    guide: {
      title: 'دليل ومنهجية حلال',
      subtitle: 'معايير واضحة وشفافة لتصنيف المنتجات',
      close: 'إغلاق',
      trafficLightTitle: 'نظام إشارات المرور (السمفور)',
      trafficLightHalal:
        '✅ حلال مؤكد: منتجات نباتية، مياه طبيعية أو بشهادة حلال موثوقة دون إضافات مشبوهة.',
      trafficLightDoubtful:
        '⚠️ مشبوه: يحتوي على إضافات قد تكون حيوانية (مثل E471) أو لحوم دون شهادة معتمدة.',
      trafficLightHaram:
        '❌ غير مناسب (حرام): يحتوي بوضوح على مشتقات الخنزير، كحول، كارمين الحشرات (E120) أو مواد محرمة.',
      meatRuleTitle: 'قاعدة اللحوم الصارمة',
      meatRuleDesc:
        'اللحوم البرية (دجاج، بقر، ديك رومي) تصنف مشبوهة ما لم تكن مصحوبة بشهادة حلال معتمدة رسمياً على العبوة.',
      additivesTitle: 'معايير الإضافات وأرقام E',
      additivesDesc:
        'ندقق في الأرقام الحساسة: E120 (كارمين) حرام؛ الجيلاتين ومستحلبات الدهون (E471) مشبوهة ما لم يثبت مصدرها النباتي.',
      sourcesTitle: 'المصادر والتحقق',
      sourcesDesc:
        'مطابقة البيانات مع Open Food Facts، وقراءة ملصقات المنتجات بالذكاء الاصطناعي مع تدقيق المجتمع المستمر.',
    },
  },
};
