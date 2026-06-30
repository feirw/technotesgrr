/** Πρόγραμμα σπουδών — τύποι και helpers */

import { EKPA_IPT_CURRICULUM } from './ekpaIptCurriculum.generated';
import { EKPA_DIGITAL_INDUSTRY_CURRICULUM } from './ekpaDigitalIndustryCurriculum.generated';
import { EKPA_ECONOMIC_SCIENCE_CURRICULUM } from './ekpaEconomicScienceCurriculum.generated';
import { EKPA_BUSINESS_ADMINISTRATION_CURRICULUM } from './ekpaBusinessAdministrationCurriculum.generated';
import { EKPA_PORT_SHIPPING_MANAGEMENT_CURRICULUM } from './ekpaPortShippingManagementCurriculum.generated';
import { EKPA_PSACHNA_AGRICULTURAL_DEVELOPMENT_CURRICULUM } from './ekpaPsachnaAgriculturalDevelopmentCurriculum.generated';
import { EKPA_PRIMARY_EDUCATION_CURRICULUM } from './ekpaPrimaryEducationCurriculum.generated';
import { EKPA_PHYSICAL_EDUCATION_SPORTS_SCIENCE_CURRICULUM } from './ekpaPhysicalEducationSportsScienceCurriculum.generated';
import { EKPA_HISTORY_PHILOSOPHY_OF_SCIENCE_CURRICULUM } from './ekpaHistoryPhilosophyOfScienceCurriculum.generated';
import { EKPA_THEATRE_STUDIES_CURRICULUM } from './ekpaTheatreStudiesCurriculum.generated';
import { EKPA_DIGITAL_ARTS_CINEMA_CURRICULUM } from './ekpaDigitalArtsCinemaCurriculum.generated';
import { AUTH_INFORMATICS_CURRICULUM } from './authInformaticsCurriculum.generated';
import { AUTH_ECONOMIC_SCIENCE_CURRICULUM } from './authEconomicScienceCurriculum.generated';
import { AUTH_THESSALONIKI_PRIMARY_EDUCATION_SOCIAL_CULTURAL_CURRICULUM } from './authThessalonikiPrimaryEducationSocialCulturalCurriculum.generated';
import { AUTH_THESSALONIKI_THEATRE_CURRICULUM } from './authThessalonikiTheatreCurriculum.generated';
import { AUTH_THESSALONIKI_CINEMA_CURRICULUM } from './authThessalonikiCinemaCurriculum.generated';
import { AUTH_THESSALONIKI_PHYSICAL_EDUCATION_CURRICULUM } from './authThessalonikiPhysicalEducationCurriculum.generated';
import { AUTH_SERRES_PHYSICAL_EDUCATION_CURRICULUM } from './authSerresPhysicalEducationCurriculum.generated';
import { OPA_INFORMATICS_CURRICULUM } from './opaInformaticsCurriculum.generated';
import { OPA_ECONOMIC_SCIENCE_CURRICULUM } from './opaEconomicScienceCurriculum.generated';
import { OPA_REGIONAL_DEVELOPMENT_CURRICULUM } from './opaRegionalDevelopmentCurriculum.generated';
import { OPA_ACCOUNTING_FINANCE_CURRICULUM } from './opaAccountingFinanceCurriculum.generated';
import { OPA_BUSINESS_ADMINISTRATION_CURRICULUM } from './opaBusinessAdministrationCurriculum.generated';
import { OPA_MARKETING_COMMUNICATIONS_CURRICULUM } from './opaMarketingCommunicationsCurriculum.generated';
import { OPA_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM } from './opaManagementScienceTechnologyCurriculum.generated';
import { OPA_INTERNATIONAL_EUROPEAN_ECONOMIC_STUDIES_CURRICULUM } from './opaInternationalEuropeanEconomicStudiesCurriculum.generated';
import { OPA_STATISTICS_CURRICULUM } from './opaStatisticsCurriculum.generated';
import { OPA_PUBLIC_ADMINISTRATION_CURRICULUM } from './opaPublicAdministrationCurriculum.generated';
import { OPA_SOCIAL_POLICY_CURRICULUM } from './opaSocialPolicyCurriculum.generated';
import { UNIPI_INFORMATICS_CURRICULUM } from './unipiInformaticsCurriculum.generated';
import { PAMAK_CSC_CURRICULUM } from './pamakCscCurriculum.generated';
import { PAMAK_ECONOMIC_SCIENCE_CURRICULUM } from './pamakEconomicScienceCurriculum.generated';
import { PAMAK_ISC_CURRICULUM } from './pamakIscCurriculum.generated';
import { PAMAK_ACCOUNTING_FINANCE_CURRICULUM } from './pamakAccountingFinanceCurriculum.generated';
import { PAMAK_BUSINESS_ADMINISTRATION_CURRICULUM } from './pamakBusinessAdministrationCurriculum.generated';
import { PAMAK_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM } from './pamakInternationalEuropeanStudiesCurriculum.generated';
import { PANTEION_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM } from './panteionInternationalEuropeanStudiesCurriculum.generated';
import { PAMAK_BALKAN_STUDIES_CURRICULUM } from './pamakBalkanStudiesCurriculum.generated';
import { HAROKOPIO_INFORMATICS_CURRICULUM } from './harokopioInformaticsCurriculum.generated';
import { HAROKOPIO_SUSTAINABLE_ECONOMY_CURRICULUM } from './harokopioSustainableEconomyCurriculum.generated';
import { HAROKOPIO_GEOGRAPHY_CURRICULUM } from './harokopioGeographyCurriculum.generated';
import { PAPEI_DIGITAL_SYSTEMS_CURRICULUM } from './papeiDigitalSystemsCurriculum.generated';
import { PAPEI_INDUSTRIAL_MANAGEMENT_CURRICULUM } from './papeiIndustrialManagementCurriculum.generated';
import { PAPEI_ECONOMIC_SCIENCE_CURRICULUM } from './papeiEconomicScienceCurriculum.generated';
import { PAPEI_BANKING_FINANCE_CURRICULUM } from './papeiBankingFinanceCurriculum.generated';
import { PAPEI_BUSINESS_ADMINISTRATION_CURRICULUM } from './papeiBusinessAdministrationCurriculum.generated';
import { PAPEI_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM } from './papeiInternationalEuropeanStudiesCurriculum.generated';
import { PAPEI_STATISTICS_INSURANCE_SCIENCE_CURRICULUM } from './papeiStatisticsInsuranceScienceCurriculum.generated';
import { PAPEI_MARITIME_STUDIES_CURRICULUM } from './papeiMaritimeStudiesCurriculum.generated';
import { PAPEI_TOURISM_STUDIES_CURRICULUM } from './papeiTourismStudiesCurriculum.generated';
import { UOC_CS_CURRICULUM } from './uocCsCurriculum.generated';
import { UOC_RETHYMNO_ECONOMIC_SCIENCE_CURRICULUM } from './uocRethymnoEconomicScienceCurriculum.generated';
import { DIPAE_CPE_CURRICULUM } from './dipaeCpeCurriculum.generated';
import { DIPAE_PRODUCTION_MANAGEMENT_CURRICULUM } from './dipaeProductionManagementCurriculum.generated';
import { DIPAE_ACCOUNTING_IS_CURRICULUM } from './dipaeAccountingIsCurriculum.generated';
import { DIPAE_ORGANIZATIONS_MARKETING_TOURISM_CURRICULUM } from './dipaeOrganizationsMarketingTourismCurriculum.generated';
import { DIPAE_SUPPLY_CHAIN_MANAGEMENT_CURRICULUM } from './dipaeSupplyChainManagementCurriculum.generated';
import { DIPAE_THESSALONIKI_LIBRARY_INFORMATION_STUDIES_CURRICULUM } from './dipaeThessalonikiLibraryInformationStudiesCurriculum.generated';
import { PELOPONNESE_ACCOUNTING_FINANCE_CURRICULUM } from './peloponneseAccountingFinanceCurriculum.generated';
import { PELOPONNESE_BUSINESS_ADMINISTRATION_CURRICULUM } from './peloponneseBusinessAdministrationCurriculum.generated';
import { PELOPONNESE_SPORTS_MANAGEMENT_CURRICULUM } from './peloponneseSportsManagementCurriculum.generated';
import { PELOPONNESE_NAFPLIO_PERFORMING_DIGITAL_ARTS_CURRICULUM } from './peloponneseNafplioPerformingDigitalArtsCurriculum.generated';
import { PELOPONNESE_NAFPLIO_THEATRE_STUDIES_CURRICULUM } from './peloponneseNafplioTheatreStudiesCurriculum.generated';
import { UTH_LARISSA_ACCOUNTING_FINANCE_CURRICULUM } from './uthLarissaAccountingFinanceCurriculum.generated';
import { UTH_LARISSA_BUSINESS_ADMINISTRATION_CURRICULUM } from './uthLarissaBusinessAdministrationCurriculum.generated';
import { TUC_PRODUCTION_MANAGEMENT_CURRICULUM } from './tucProductionManagementCurriculum.generated';
import { DIPAE_SERRES_CPE_CURRICULUM } from './dipaeSerresCpeCurriculum.generated';
import { DIPAE_SERRES_ECONOMIC_SCIENCE_CURRICULUM } from './dipaeSerresEconomicScienceCurriculum.generated';
import { DIPAE_SERRES_BUSINESS_ADMINISTRATION_CURRICULUM } from './dipaeSerresBusinessAdministrationCurriculum.generated';
import { DIPAE_SERRES_INTERIOR_ARCHITECTURE_CURRICULUM } from './dipaeSerresInteriorArchitectureCurriculum.generated';
import { DIPAE_KILKIS_CREATIVE_DESIGN_CLOTHING_CURRICULUM } from './dipaeKilkisCreativeDesignClothingCurriculum.generated';
import { DPTH_KAVALA_INFORMATICS_CURRICULUM } from './dpthKavalaInformaticsCurriculum.generated';
import { DPTH_KAVALA_ACCOUNTING_FINANCE_CURRICULUM } from './dpthKavalaAccountingFinanceCurriculum.generated';
import { DPTH_KAVALA_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM } from './dpthKavalaManagementScienceTechnologyCurriculum.generated';
import { DPTH_KOMOTINI_ECONOMIC_SCIENCE_CURRICULUM } from './dpthKomotiniEconomicScienceCurriculum.generated';
import { DPTH_KOMOTINI_PHYSICAL_EDUCATION_CURRICULUM } from './dpthKomotiniPhysicalEducationCurriculum.generated';
import { DPTH_KOMOTINI_SOCIAL_POLICY_CURRICULUM } from './dpthKomotiniSocialPolicyCurriculum.generated';
import { DPTH_PRODUCTION_MANAGEMENT_CURRICULUM } from './dpthProductionManagementCurriculum.generated';
import { DPTH_ORESTIADA_FORESTRY_CURRICULUM } from './dpthOrestiadaForestryCurriculum.generated';
import { DPTH_ORESTIADA_AGRICULTURAL_DEVELOPMENT_CURRICULUM } from './dpthOrestiadaAgriculturalDevelopmentCurriculum.generated';
import { UTH_BIOMED_INFORMATICS_CURRICULUM } from './uthBiomedInformaticsCurriculum.generated';
import { UOP_TRIPOLI_ECONOMIC_SCIENCE_CURRICULUM } from './uopTripoliEconomicScienceCurriculum.generated';
import { UOP_TRIPOLI_ICT_CURRICULUM } from './uopTripoliIctCurriculum.generated';
import { UOP_PATRAS_ECONOMIC_SCIENCE_CURRICULUM } from './uopPatrasEconomicScienceCurriculum.generated';
import { UOP_PATRAS_BUSINESS_ADMINISTRATION_CURRICULUM } from './uopPatrasBusinessAdministrationCurriculum.generated';
import { UOP_PATRAS_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM } from './uopPatrasManagementScienceTechnologyCurriculum.generated';
import { UOP_PATRAS_TOURISM_MANAGEMENT_CURRICULUM } from './uopPatrasTourismManagementCurriculum.generated';
import { UOP_PATRAS_THEATRE_STUDIES_CURRICULUM } from './uopPatrasTheatreStudiesCurriculum.generated';
import { UOP_MESOLONGI_FISHERIES_AQUACULTURE_CURRICULUM } from './uopMesolongiFisheriesAquacultureCurriculum.generated';
import { UTH_ICT_CURRICULUM } from './uthIctCurriculum.generated';
import { UTH_DIGITAL_SYSTEMS_CURRICULUM } from './uthDigitalSystemsCurriculum.generated';
import { UOWM_KASTORIA_ECONOMIC_SCIENCE_CURRICULUM } from './uowmKastoriaEconomicScienceCurriculum.generated';
import { UOWM_KASTORIA_INFORMATICS_CURRICULUM } from './uowmKastoriaInformaticsCurriculum.generated';
import { UOWM_KASTORIA_DIGITAL_MEDIA_COMMUNICATIONS_CURRICULUM } from './uowmKastoriaDigitalMediaCommunicationsCurriculum.generated';
import { UOWM_KOZANI_PRODUCT_DESIGN_CURRICULUM } from './uowmKozaniProductDesignCurriculum.generated';
import { UOWM_KOZANI_ACCOUNTING_FINANCE_CURRICULUM } from './uowmKozaniAccountingFinanceCurriculum.generated';
import { UOWM_KOZANI_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM } from './uowmKozaniManagementScienceTechnologyCurriculum.generated';
import { UOWM_KOZANI_INTERNATIONAL_EUROPEAN_ECONOMIC_STUDIES_CURRICULUM } from './uowmKozaniInternationalEuropeanEconomicStudiesCurriculum.generated';
import { UOWM_GREVENA_BUSINESS_ADMINISTRATION_CURRICULUM } from './uowmGrevenaBusinessAdministrationCurriculum.generated';
import { UOWM_GREVENA_STATISTICS_CURRICULUM } from './uowmGrevenaStatisticsCurriculum.generated';
import { ELMEPA_ECE_CURRICULUM } from './elmepaEceCurriculum.generated';
import { ELMEPA_HERAKLION_ACCOUNTING_FINANCE_CURRICULUM } from './elmepaHeraklionAccountingFinanceCurriculum.generated';
import { ELMEPA_AGIOS_NIKOLAOS_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM } from './elmepaAgiosNikolaosManagementScienceTechnologyCurriculum.generated';
import { ELMEPA_BUSINESS_ADMINISTRATION_TOURISM_CURRICULUM } from './elmepaBusinessAdministrationTourismCurriculum.generated';
import { ELMEPA_RETHYMNO_MUSIC_TECHNOLOGY_CURRICULUM } from './elmepaRethymnoMusicTechnologyCurriculum.generated';
import { AEGEAN_SAMOS_ICS_CURRICULUM } from './aegeanSamosIcsCurriculum.generated';
import { AEGEAN_SAMOS_STATISTICS_CURRICULUM } from './aegeanSamosStatisticsCurriculum.generated';
import { AEGEAN_CHIOS_MEM_CURRICULUM } from './aegeanChiosMemCurriculum.generated';
import { AEGEAN_CHIOS_BUSINESS_ADMINISTRATION_CURRICULUM } from './aegeanChiosBusinessAdministrationCurriculum.generated';
import { AEGEAN_CHIOS_TOURISM_MANAGEMENT_CURRICULUM } from './aegeanChiosTourismManagementCurriculum.generated';
import { AEGEAN_CHIOS_MARITIME_BUSINESS_SERVICES_CURRICULUM } from './aegeanChiosMaritimeBusinessServicesCurriculum.generated';
import { AEGEAN_SYROS_PRODUCT_DESIGN_CURRICULUM } from './aegeanSyrosProductDesignCurriculum.generated';
import { AEGEAN_RHODES_MEDITERRANEAN_STUDIES_CURRICULUM } from './aegeanRhodesMediterraneanStudiesCurriculum.generated';
import { AEGEAN_MYTILENE_ENVIRONMENT_CURRICULUM } from './aegeanMytileneEnvironmentCurriculum.generated';
import { AEGEAN_MYTILENE_GEOGRAPHY_CURRICULUM } from './aegeanMytileneGeographyCurriculum.generated';
import { AEGEAN_MYTILENE_CULTURAL_TECHNOLOGY_CURRICULUM } from './aegeanMytileneCulturalTechnologyCurriculum.generated';
import { UOP_SPARTA_DIGITAL_SYSTEMS_CURRICULUM } from './uopSpartaDigitalSystemsCurriculum.generated';
import { UTH_ENERGY_SYSTEMS_CURRICULUM } from './uthEnergySystemsCurriculum.generated';
import { UTH_LARISSA_ENVIRONMENT_CURRICULUM } from './uthLarissaEnvironmentCurriculum.generated';
import { UTH_KARDITSA_FORESTRY_CURRICULUM } from './uthKarditsaForestryCurriculum.generated';
import { UTH_TRIKALA_PHYSICAL_EDUCATION_CURRICULUM } from './uthTrikalaPhysicalEducationCurriculum.generated';
import { UTH_VOLOS_ECONOMIC_SCIENCE_CURRICULUM } from './uthVolosEconomicScienceCurriculum.generated';
import { UTH_VOLOS_CULTURE_CREATIVE_MEDIA_CURRICULUM } from './uthVolosCultureCreativeMediaCurriculum.generated';
import { UOI_ARTA_ICT_CURRICULUM } from './uoiArtaIctCurriculum.generated';
import { UOI_ECONOMIC_SCIENCE_CURRICULUM } from './uoiEconomicScienceCurriculum.generated';
import { UOI_PREVEZA_ACCOUNTING_FINANCE_CURRICULUM } from './uoiPrevezaAccountingFinanceCurriculum.generated';
import { IONIO_CORFU_INFORMATICS_CURRICULUM } from './ionioCorfuInformaticsCurriculum.generated';
import { IONIO_CORFU_INFORMATION_SCIENCE_CURRICULUM } from './ionioCorfuInformationScienceCurriculum.generated';
import { IONIO_CORFU_AUDIOVISUAL_ARTS_CURRICULUM } from './ionioCorfuAudiovisualArtsCurriculum.generated';
import { IONIO_ARGOSTOLI_DIGITAL_MEDIA_COMMUNICATIONS_CURRICULUM } from './ionioArgostoliDigitalMediaCommunicationsCurriculum.generated';
import { IONIO_CORFU_TOURISM_CURRICULUM } from './ionioCorfuTourismCurriculum.generated';
import { IONIO_ZAKYNTHOS_ENVIRONMENT_CURRICULUM } from './ionioZakynthosEnvironmentCurriculum.generated';
import { PADA_CPE_CURRICULUM } from './padaCpeCurriculum.generated';
import { PADA_INDUSTRIAL_DESIGN_PRODUCTION_CURRICULUM } from './padaIndustrialDesignProductionCurriculum.generated';
import { PADA_ACCOUNTING_FINANCE_CURRICULUM } from './padaAccountingFinanceCurriculum.generated';
import { PADA_BUSINESS_ADMINISTRATION_CURRICULUM } from './padaBusinessAdministrationCurriculum.generated';
import { PADA_TOURISM_MANAGEMENT_CURRICULUM } from './padaTourismManagementCurriculum.generated';
import { PADA_ARCHIVAL_LIBRARY_INFORMATION_STUDIES_CURRICULUM } from './padaArchivalLibraryInformationStudiesCurriculum.generated';
import { PADA_INTERIOR_ARCHITECTURE_CURRICULUM } from './padaInteriorArchitectureCurriculum.generated';
import { PADA_GRAPHIC_DESIGN_VISUAL_COMMUNICATION_CURRICULUM } from './padaGraphicDesignVisualCommunicationCurriculum.generated';
import { PADA_PHOTOGRAPHY_CURRICULUM } from './padaPhotographyCurriculum.generated';
import { ASTE_CRETE_CURRICULUM } from './asteCreteCurriculum.generated';
import { ASTE_RHODES_CURRICULUM } from './asteRhodesCurriculum.generated';
import { AEN_ENGINEERS_CURRICULUM } from './aenEngineersCurriculum.generated';
import { AEN_CAPTAINS_CURRICULUM } from './aenCaptainsCurriculum.generated';
import { AUA_AGRICULTURAL_ECONOMICS_CURRICULUM } from './auaAgriculturalEconomicsCurriculum.generated';
import { AUA_AMFISSA_REGIONAL_DEVELOPMENT_CURRICULUM } from './auaAmfissaRegionalDevelopmentCurriculum.generated';
import { AUA_KARPENISI_FORESTRY_CURRICULUM } from './auaKarpenisiForestryCurriculum.generated';
import { AUA_THEBES_AGRIBUSINESS_MANAGEMENT_CURRICULUM } from './auaThebesAgribusinessManagementCurriculum.generated';

export {
  EKPA_IPT_CURRICULUM,
  EKPA_DIGITAL_INDUSTRY_CURRICULUM,
  EKPA_ECONOMIC_SCIENCE_CURRICULUM,
  EKPA_BUSINESS_ADMINISTRATION_CURRICULUM,
  EKPA_PORT_SHIPPING_MANAGEMENT_CURRICULUM,
  EKPA_PSACHNA_AGRICULTURAL_DEVELOPMENT_CURRICULUM,
  EKPA_HISTORY_PHILOSOPHY_OF_SCIENCE_CURRICULUM,
  EKPA_THEATRE_STUDIES_CURRICULUM,
  EKPA_PHYSICAL_EDUCATION_SPORTS_SCIENCE_CURRICULUM,
  AUTH_INFORMATICS_CURRICULUM,
  AUTH_ECONOMIC_SCIENCE_CURRICULUM,
  AUTH_THESSALONIKI_PRIMARY_EDUCATION_SOCIAL_CULTURAL_CURRICULUM,
  AUTH_THESSALONIKI_THEATRE_CURRICULUM,
  AUTH_THESSALONIKI_CINEMA_CURRICULUM,
  AUTH_THESSALONIKI_PHYSICAL_EDUCATION_CURRICULUM,
  AUTH_SERRES_PHYSICAL_EDUCATION_CURRICULUM,
  OPA_INFORMATICS_CURRICULUM,
  OPA_ECONOMIC_SCIENCE_CURRICULUM,
  OPA_REGIONAL_DEVELOPMENT_CURRICULUM,
  OPA_ACCOUNTING_FINANCE_CURRICULUM,
  OPA_BUSINESS_ADMINISTRATION_CURRICULUM,
  OPA_MARKETING_COMMUNICATIONS_CURRICULUM,
  OPA_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  OPA_INTERNATIONAL_EUROPEAN_ECONOMIC_STUDIES_CURRICULUM,
  OPA_STATISTICS_CURRICULUM,
  OPA_PUBLIC_ADMINISTRATION_CURRICULUM,
  OPA_SOCIAL_POLICY_CURRICULUM,
  UNIPI_INFORMATICS_CURRICULUM,
  PAMAK_CSC_CURRICULUM,
  PAMAK_ECONOMIC_SCIENCE_CURRICULUM,
  PAMAK_ISC_CURRICULUM,
  PAMAK_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM,
  PANTEION_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM,
  PAMAK_BALKAN_STUDIES_CURRICULUM,
  HAROKOPIO_INFORMATICS_CURRICULUM,
  HAROKOPIO_SUSTAINABLE_ECONOMY_CURRICULUM,
  PAPEI_DIGITAL_SYSTEMS_CURRICULUM,
  PAPEI_INDUSTRIAL_MANAGEMENT_CURRICULUM,
  PAPEI_ECONOMIC_SCIENCE_CURRICULUM,
  PAPEI_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM,
  PAPEI_STATISTICS_INSURANCE_SCIENCE_CURRICULUM,
  PAPEI_MARITIME_STUDIES_CURRICULUM,
  PAPEI_TOURISM_STUDIES_CURRICULUM,
  UOC_CS_CURRICULUM,
  UOC_RETHYMNO_ECONOMIC_SCIENCE_CURRICULUM,
  DIPAE_CPE_CURRICULUM,
  DIPAE_PRODUCTION_MANAGEMENT_CURRICULUM,
  TUC_PRODUCTION_MANAGEMENT_CURRICULUM,
  DIPAE_SERRES_CPE_CURRICULUM,
  DIPAE_SERRES_ECONOMIC_SCIENCE_CURRICULUM,
  DPTH_KAVALA_INFORMATICS_CURRICULUM,
  DPTH_KAVALA_ACCOUNTING_FINANCE_CURRICULUM,
  DPTH_KAVALA_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  DPTH_KOMOTINI_ECONOMIC_SCIENCE_CURRICULUM,
  DPTH_KOMOTINI_PHYSICAL_EDUCATION_CURRICULUM,
  DPTH_KOMOTINI_SOCIAL_POLICY_CURRICULUM,
  DPTH_PRODUCTION_MANAGEMENT_CURRICULUM,
  DPTH_ORESTIADA_FORESTRY_CURRICULUM,
  DPTH_ORESTIADA_AGRICULTURAL_DEVELOPMENT_CURRICULUM,
  UTH_BIOMED_INFORMATICS_CURRICULUM,
  UOP_TRIPOLI_ECONOMIC_SCIENCE_CURRICULUM,
  UOP_TRIPOLI_ICT_CURRICULUM,
  UOP_PATRAS_ECONOMIC_SCIENCE_CURRICULUM,
  UOP_PATRAS_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  UOP_PATRAS_TOURISM_MANAGEMENT_CURRICULUM,
  UOP_MESOLONGI_FISHERIES_AQUACULTURE_CURRICULUM,
  UTH_ICT_CURRICULUM,
  UTH_DIGITAL_SYSTEMS_CURRICULUM,
  UOWM_KASTORIA_ECONOMIC_SCIENCE_CURRICULUM,
  UOWM_KASTORIA_INFORMATICS_CURRICULUM,
  UOWM_KASTORIA_DIGITAL_MEDIA_COMMUNICATIONS_CURRICULUM,
  UOWM_KOZANI_PRODUCT_DESIGN_CURRICULUM,
  UOWM_KOZANI_ACCOUNTING_FINANCE_CURRICULUM,
  UOWM_KOZANI_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  UOWM_KOZANI_INTERNATIONAL_EUROPEAN_ECONOMIC_STUDIES_CURRICULUM,
  UOWM_GREVENA_BUSINESS_ADMINISTRATION_CURRICULUM,
  UOWM_GREVENA_STATISTICS_CURRICULUM,
  ELMEPA_ECE_CURRICULUM,
  ELMEPA_HERAKLION_ACCOUNTING_FINANCE_CURRICULUM,
  ELMEPA_AGIOS_NIKOLAOS_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  AEGEAN_SAMOS_ICS_CURRICULUM,
  AEGEAN_SAMOS_STATISTICS_CURRICULUM,
  AEGEAN_SYROS_PRODUCT_DESIGN_CURRICULUM,
  AEGEAN_MYTILENE_ENVIRONMENT_CURRICULUM,
  AEGEAN_MYTILENE_GEOGRAPHY_CURRICULUM,
  AEGEAN_MYTILENE_CULTURAL_TECHNOLOGY_CURRICULUM,
  UOP_SPARTA_DIGITAL_SYSTEMS_CURRICULUM,
  UTH_ENERGY_SYSTEMS_CURRICULUM,
  UTH_LARISSA_ENVIRONMENT_CURRICULUM,
  UTH_KARDITSA_FORESTRY_CURRICULUM,
  UTH_TRIKALA_PHYSICAL_EDUCATION_CURRICULUM,
  UTH_VOLOS_ECONOMIC_SCIENCE_CURRICULUM,
  UOI_ARTA_ICT_CURRICULUM,
  UOI_ECONOMIC_SCIENCE_CURRICULUM,
  UOI_PREVEZA_ACCOUNTING_FINANCE_CURRICULUM,
  IONIO_CORFU_INFORMATICS_CURRICULUM,
  IONIO_CORFU_INFORMATION_SCIENCE_CURRICULUM,
  IONIO_ARGOSTOLI_DIGITAL_MEDIA_COMMUNICATIONS_CURRICULUM,
  IONIO_ZAKYNTHOS_ENVIRONMENT_CURRICULUM,
  PADA_CPE_CURRICULUM,
  PADA_INDUSTRIAL_DESIGN_PRODUCTION_CURRICULUM,
  AUA_AGRICULTURAL_ECONOMICS_CURRICULUM,
  AUA_AMFISSA_REGIONAL_DEVELOPMENT_CURRICULUM,
  AUA_KARPENISI_FORESTRY_CURRICULUM,
  AUA_THEBES_AGRIBUSINESS_MANAGEMENT_CURRICULUM,
};

export type SemesterSlotMark = 'Υ' | 'B';

export type CurriculumSlots = Partial<
  Record<'s1' | 's2' | 's3' | 's4' | 's5' | 's6', SemesterSlotMark>
>;

export type CourseCategory =
  | 'mandatory'
  | 'mandatory-choice'
  | 'elective'
  | 'general'
  | 'lab'
  | 'project';

export type CourseHours = {
  lecture: number;
  /** Ε — εργαστήριο */
  lab?: number;
  /** Φ — φροντιστήριο */
  tutorial?: number;
};

export type CurriculumCourse = {
  name: string;
  code: string;
  ects: number;
  kind: string;
  hours?: CourseHours;
  slots?: CurriculumSlots;
};

export type CurriculumSemester = {
  semester: number;
  courses: CurriculumCourse[];
};

export type CurriculumPdfLink = {
  label: string;
  url: string;
};

export type SchoolCurriculum = {
  title: string;
  subtitle?: string;
  /** Σημείωση για ώρες διδασκαλίας (π.χ. Ε=εργαστήριο, Φ=φροντιστήριο) */
  hoursNote?: string;
  /** PDF περιγράμματα μαθημάτων ανά εξάμηνο (προαιρετικό) */
  semesterPdfLinks?: Partial<Record<number, CurriculumPdfLink[]>>;
  semesters: CurriculumSemester[];
};

export type CurriculumFilter = 'all' | 'mandatory' | 'elective';

const CATEGORY_LABELS: Record<CourseCategory, string> = {
  mandatory: 'Υποχρεωτικό',
  'mandatory-choice': "Κατ' επιλογή",
  elective: 'Επιλογής',
  general: 'Γενικής επιλογής',
  lab: 'Εργαστήριο',
  project: 'Πτυχιακή / Project',
};

const CATEGORY_COLORS: Record<CourseCategory, string> = {
  mandatory: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  'mandatory-choice': 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  elective: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
  general: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
  lab: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
  project: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-200',
};

export function getCourseCategory(kind: string): CourseCategory {
  if (kind.includes('Υποχρεωτικό-Επιλογής') || kind.includes('ΥΠ-ΕΠ')) {
    return 'mandatory-choice';
  }
  if (kind.includes('Εξειδίκευση')) return 'mandatory-choice';
  if (kind.includes('Εργαλειοθήκη')) return 'elective';
  if (kind.includes('Βασικά κατεύθυνσης') || kind.includes('Υποχρεωτικό ροής')) {
    return 'mandatory-choice';
  }
  if (kind.includes('Υποχρεωτικό κατεύθυνσης') || kind.includes('Υποχρεωτικό δευτερεύουσας')) {
    return 'mandatory-choice';
  }
  if (kind.includes('Υποχρεωτικό (ΥΜ)') || kind.includes('Υποχρεωτικό κορμού')) return 'mandatory';
  if (kind.includes('υποβάθρου')) return 'mandatory';
  if (kind.includes('Υποχρεωτικό')) return 'mandatory';
  if (kind.includes('ΕΥΜ') || kind.includes("Κατ' Επιλογή") || kind.includes('Επιλογής Υποχρεωτικό')) {
    return 'mandatory-choice';
  }
  if (kind.includes('ΓΟΕΥ') || kind.includes('Γενικής Ομάδας')) return 'mandatory-choice';
  if (kind.startsWith('Ροής ·')) return 'mandatory-choice';
  if (kind.toLowerCase() === 'project') return 'project';
  if (kind.includes('Διπλωματική') || kind.includes('Πτυχιακή')) return 'project';
  if (kind.includes('Πρακτική') || kind.includes('Δεξιοτήτων')) return 'project';
  if (kind.includes('ΓΠ') || kind.includes('Γενικής') || kind.includes('Γνώσεων') || kind.includes('Ελεύθερης') || kind.includes('Παιδαγωγικής') || kind.includes('Επάρκειας') || kind.includes('Προαιρετικό')) {
    return 'general';
  }
  if (kind.includes('ΕΡ')) return 'lab';
  if (kind.includes('Επιλογής ροής') || kind.includes('Επιλογής (όλες')) return 'elective';
  if (kind.includes('Επιλογής') && !kind.includes('Υποχρεωτικό')) return 'elective';
  return 'elective';
}

export function getCourseCategoryLabel(kind: string): string {
  return CATEGORY_LABELS[getCourseCategory(kind)];
}

export function getCourseCategoryClass(kind: string): string {
  return CATEGORY_COLORS[getCourseCategory(kind)];
}

export function isMandatoryCourse(kind: string): boolean {
  return getCourseCategory(kind) === 'mandatory';
}

export function isElectiveCourse(kind: string): boolean {
  const cat = getCourseCategory(kind);
  return cat === 'elective' || cat === 'lab' || cat === 'project';
}

export function matchesCurriculumFilter(course: CurriculumCourse, filter: CurriculumFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'mandatory') {
    const cat = getCourseCategory(course.kind);
    return cat === 'mandatory' || cat === 'mandatory-choice';
  }
  return isElectiveCourse(course.kind) || getCourseCategory(course.kind) === 'general';
}

export function filterCurriculum(
  curriculum: SchoolCurriculum,
  filter: CurriculumFilter,
): SchoolCurriculum {
  return {
    ...curriculum,
    semesters: curriculum.semesters
      .map((sem) => ({
        ...sem,
        courses: sem.courses.filter((c) => matchesCurriculumFilter(c, filter)),
      }))
      .filter((sem) => sem.courses.length > 0),
  };
}

export function countCurriculumCourses(
  curriculum: SchoolCurriculum,
  predicate: (course: CurriculumCourse) => boolean,
): number {
  return curriculum.semesters.reduce(
    (n, sem) => n + sem.courses.filter(predicate).length,
    0,
  );
}

/** Αντιστοίχιση school.id → πρόγραμμα σπουδών */
export function formatCourseHours(hours: CourseHours): string {
  const parts = [`${hours.lecture}`];
  if (hours.tutorial) parts.push(`${hours.tutorial}Φ`);
  if (hours.lab) parts.push(`${hours.lab}Ε`);
  return parts.join('+');
}

export const CURRICULUM_KIND_NOTE =
  'Σημείωση: Το πρόγραμμα περιλαμβάνει υποχρεωτικά μαθήματα και μαθήματα επιλογής. ' +
  'Η ακριβής κατανομή και οι επιλογές ορίζονται από το τμήμα.';

export function curriculumHasLab(curriculum: SchoolCurriculum): boolean {
  return curriculum.semesters.some((sem) =>
    sem.courses.some((c) => c.hours?.lab != null && c.hours.lab > 0),
  );
}

/** ΣΣΑΣ — ίδιο ακαδημαϊκό πρόγραμμα με ΑΠΘ Πληροφορικής + στρατιωτική εκπαίδευση */
export const SSAS_INFORMATICS_CURRICULUM: SchoolCurriculum = {
  ...AUTH_INFORMATICS_CURRICULUM,
  title: 'Πληροφορικής (ΣΣΑΣ)',
  subtitle: 'ΣΣΑΣ · Θεσσαλονίκη',
  hoursNote:
    'Ακολουθεί το πρόγραμμα σπουδών της Πληροφορικής ΑΠΘ. ' +
    'Παράλληλα παρέχεται στρατιωτική εκπαίδευση.',
};

/** ΣΣΑΣ — ίδιο ακαδημαϊκό πρόγραμμα με ΑΠΘ Οικονομικών Επιστημών + στρατιωτική εκπαίδευση */
export const SSAS_ECONOMICS_CURRICULUM: SchoolCurriculum = {
  ...AUTH_ECONOMIC_SCIENCE_CURRICULUM,
  title: 'Οικονομικό (ΣΣΑΣ)',
  subtitle: 'ΣΣΑΣ · Θεσσαλονίκη',
  hoursNote:
    'Ακολουθεί το πρόγραμμα σπουδών των Οικονομικών Επιστημών ΑΠΘ. ' +
    'Παράλληλα παρέχεται στρατιωτική εκπαίδευση.',
};

export const SCHOOL_CURRICULA: Record<string, SchoolCurriculum> = {
  '309': EKPA_ECONOMIC_SCIENCE_CURRICULUM,
  '330': EKPA_IPT_CURRICULUM,
  '338': AUTH_INFORMATICS_CURRICULUM,
  '311': AUTH_ECONOMIC_SCIENCE_CURRICULUM,
  '402': AUTH_SERRES_PHYSICAL_EDUCATION_CURRICULUM,
  '403': AUTH_THESSALONIKI_PHYSICAL_EDUCATION_CURRICULUM,
  '404': DPTH_KOMOTINI_PHYSICAL_EDUCATION_CURRICULUM,
  '405': UTH_TRIKALA_PHYSICAL_EDUCATION_CURRICULUM,
  '312': OPA_ECONOMIC_SCIENCE_CURRICULUM,
  '347': OPA_ACCOUNTING_FINANCE_CURRICULUM,
  '150': OPA_INTERNATIONAL_EUROPEAN_ECONOMIC_STUDIES_CURRICULUM,
  '152': OPA_REGIONAL_DEVELOPMENT_CURRICULUM,
  '240': OPA_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  '313': OPA_BUSINESS_ADMINISTRATION_CURRICULUM,
  '314': OPA_MARKETING_COMMUNICATIONS_CURRICULUM,
  '355': PAPEI_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM,
  '318': PAPEI_STATISTICS_INSURANCE_SCIENCE_CURRICULUM,
  '316': PAPEI_BUSINESS_ADMINISTRATION_CURRICULUM,
  '159': OPA_SOCIAL_POLICY_CURRICULUM,
  '124': OPA_PUBLIC_ADMINISTRATION_CURRICULUM,
  '329': OPA_STATISTICS_CURRICULUM,
  '333': OPA_INFORMATICS_CURRICULUM,
  '339': UNIPI_INFORMATICS_CURRICULUM,
  '1001': EKPA_PSACHNA_AGRICULTURAL_DEVELOPMENT_CURRICULUM,
  '1004': EKPA_PORT_SHIPPING_MANAGEMENT_CURRICULUM,
  '1005': EKPA_BUSINESS_ADMINISTRATION_CURRICULUM,
  '1008': EKPA_DIGITAL_INDUSTRY_CURRICULUM,
  '173': EKPA_HISTORY_PHILOSOPHY_OF_SCIENCE_CURRICULUM,
  '146': EKPA_THEATRE_STUDIES_CURRICULUM,
  '1011': EKPA_DIGITAL_ARTS_CINEMA_CURRICULUM,
  '140': AUTH_THESSALONIKI_PRIMARY_EDUCATION_SOCIAL_CULTURAL_CURRICULUM,
  '168': AUTH_THESSALONIKI_THEATRE_CURRICULUM,
  '163': AUTH_THESSALONIKI_CINEMA_CURRICULUM,
  '128': EKPA_PRIMARY_EDUCATION_CURRICULUM,
  '401': EKPA_PHYSICAL_EDUCATION_SPORTS_SCIENCE_CURRICULUM,
  '176': PAMAK_BALKAN_STUDIES_CURRICULUM,
  '161': PAMAK_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM,
  '179': PANTEION_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM,
  '1211': PAMAK_CSC_CURRICULUM,
  '1212': PAMAK_ISC_CURRICULUM,
  '317': PAMAK_ECONOMIC_SCIENCE_CURRICULUM,
  '337': PAMAK_ACCOUNTING_FINANCE_CURRICULUM,
  '322': PAMAK_BUSINESS_ADMINISTRATION_CURRICULUM,
  '356': HAROKOPIO_GEOGRAPHY_CURRICULUM,
  '412': HAROKOPIO_INFORMATICS_CURRICULUM,
  '144': HAROKOPIO_SUSTAINABLE_ECONOMY_CURRICULUM,
  '181': AEGEAN_RHODES_MEDITERRANEAN_STUDIES_CURRICULUM,
  '238': AEGEAN_SYROS_PRODUCT_DESIGN_CURRICULUM,
  '276': AEGEAN_MYTILENE_ENVIRONMENT_CURRICULUM,
  '310': AEGEAN_MYTILENE_GEOGRAPHY_CURRICULUM,
  '354': AEGEAN_MYTILENE_CULTURAL_TECHNOLOGY_CURRICULUM,
  '222': AEGEAN_CHIOS_MEM_CURRICULUM,
  '320': AEGEAN_CHIOS_BUSINESS_ADMINISTRATION_CURRICULUM,
  '612': AEGEAN_CHIOS_TOURISM_MANAGEMENT_CURRICULUM,
  '180': AEGEAN_CHIOS_MARITIME_BUSINESS_SERVICES_CURRICULUM,
  '262': PAPEI_DIGITAL_SYSTEMS_CURRICULUM,
  '155': PAPEI_BANKING_FINANCE_CURRICULUM,
  '157': PAPEI_MARITIME_STUDIES_CURRICULUM,
  '375': PAPEI_TOURISM_STUDIES_CURRICULUM,
  '315': PAPEI_ECONOMIC_SCIENCE_CURRICULUM,
  '336': PAPEI_INDUSTRIAL_MANAGEMENT_CURRICULUM,
  '321': UOC_RETHYMNO_ECONOMIC_SCIENCE_CURRICULUM,
  '216': UOC_CS_CURRICULUM,
  '1625': DIPAE_CPE_CURRICULUM,
  '1624': DIPAE_PRODUCTION_MANAGEMENT_CURRICULUM,
  '1606': DIPAE_ACCOUNTING_IS_CURRICULUM,
  '1605': DIPAE_ORGANIZATIONS_MARKETING_TOURISM_CURRICULUM,
  '1609': DIPAE_THESSALONIKI_LIBRARY_INFORMATION_STUDIES_CURRICULUM,
  '1603': DIPAE_SUPPLY_CHAIN_MANAGEMENT_CURRICULUM,
  '1513': PELOPONNESE_ACCOUNTING_FINANCE_CURRICULUM,
  '1514': PELOPONNESE_BUSINESS_ADMINISTRATION_CURRICULUM,
  '400': PELOPONNESE_SPORTS_MANAGEMENT_CURRICULUM,
  '1517': PELOPONNESE_NAFPLIO_PERFORMING_DIGITAL_ARTS_CURRICULUM,
  '362': PELOPONNESE_NAFPLIO_THEATRE_STUDIES_CURRICULUM,
  '1430': UTH_LARISSA_ACCOUNTING_FINANCE_CURRICULUM,
  '1424': UTH_KARDITSA_FORESTRY_CURRICULUM,
  '1427': UTH_LARISSA_BUSINESS_ADMINISTRATION_CURRICULUM,
  '1302': DPTH_KOMOTINI_SOCIAL_POLICY_CURRICULUM,
  '97': DPTH_KOMOTINI_ECONOMIC_SCIENCE_CURRICULUM,
  '212': DPTH_ORESTIADA_FORESTRY_CURRICULUM,
  '353': DPTH_ORESTIADA_AGRICULTURAL_DEVELOPMENT_CURRICULUM,
  '224': DPTH_PRODUCTION_MANAGEMENT_CURRICULUM,
  '230': TUC_PRODUCTION_MANAGEMENT_CURRICULUM,
  '1601': DIPAE_SERRES_BUSINESS_ADMINISTRATION_CURRICULUM,
  '1602': DIPAE_SERRES_ECONOMIC_SCIENCE_CURRICULUM,
  '1627': DIPAE_KILKIS_CREATIVE_DESIGN_CLOTHING_CURRICULUM,
  '1626': DIPAE_SERRES_INTERIOR_ARCHITECTURE_CURRICULUM,
  '1622': DIPAE_SERRES_CPE_CURRICULUM,
  '1604': DPTH_KAVALA_ACCOUNTING_FINANCE_CURRICULUM,
  '1607': DPTH_KAVALA_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  '1630': DPTH_KAVALA_INFORMATICS_CURRICULUM,
  '369': UTH_BIOMED_INFORMATICS_CURRICULUM,
  '319': UOP_PATRAS_ECONOMIC_SCIENCE_CURRICULUM,
  '1282': UOP_PATRAS_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  '1283': UOP_PATRAS_TOURISM_MANAGEMENT_CURRICULUM,
  '352': UOP_PATRAS_BUSINESS_ADMINISTRATION_CURRICULUM,
  '169': UOP_PATRAS_THEATRE_STUDIES_CURRICULUM,
  '1276': UOP_MESOLONGI_FISHERIES_AQUACULTURE_CURRICULUM,
  '361': UOP_TRIPOLI_ECONOMIC_SCIENCE_CURRICULUM,
  '98': UOP_TRIPOLI_ICT_CURRICULUM,
  '99': UTH_ICT_CURRICULUM,
  '1439': UTH_DIGITAL_SYSTEMS_CURRICULUM,
  '1546': UOWM_GREVENA_BUSINESS_ADMINISTRATION_CURRICULUM,
  '1547': UOWM_GREVENA_STATISTICS_CURRICULUM,
  '1542': UOWM_KOZANI_PRODUCT_DESIGN_CURRICULUM,
  '1549': UOWM_KOZANI_INTERNATIONAL_EUROPEAN_ECONOMIC_STUDIES_CURRICULUM,
  '1544': UOWM_KOZANI_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  '1545': UOWM_KOZANI_ACCOUNTING_FINANCE_CURRICULUM,
  '1548': UOWM_KASTORIA_ECONOMIC_SCIENCE_CURRICULUM,
  '1551': UOWM_KASTORIA_DIGITAL_MEDIA_COMMUNICATIONS_CURRICULUM,
  '1554': UOWM_KASTORIA_INFORMATICS_CURRICULUM,
  '1656': ELMEPA_AGIOS_NIKOLAOS_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  '1655': ELMEPA_BUSINESS_ADMINISTRATION_TOURISM_CURRICULUM,
  '1662': ELMEPA_ECE_CURRICULUM,
  '1654': ELMEPA_HERAKLION_ACCOUNTING_FINANCE_CURRICULUM,
  '1664': ELMEPA_RETHYMNO_MUSIC_TECHNOLOGY_CURRICULUM,
  '218': AEGEAN_SAMOS_STATISTICS_CURRICULUM,
  '344': AEGEAN_SAMOS_ICS_CURRICULUM,
  '1519': UOP_SPARTA_DIGITAL_SYSTEMS_CURRICULUM,
  '350': UTH_VOLOS_ECONOMIC_SCIENCE_CURRICULUM,
  '1435': UTH_VOLOS_CULTURE_CREATIVE_MEDIA_CURRICULUM,
  '1434': UTH_LARISSA_ENVIRONMENT_CURRICULUM,
  '1436': UTH_ENERGY_SYSTEMS_CURRICULUM,
  '345': UOI_ECONOMIC_SCIENCE_CURRICULUM,
  '1244': UOI_PREVEZA_ACCOUNTING_FINANCE_CURRICULUM,
  '1250': UOI_ARTA_ICT_CURRICULUM,
  '366': IONIO_CORFU_INFORMATICS_CURRICULUM,
  '342': IONIO_CORFU_INFORMATION_SCIENCE_CURRICULUM,
  '367': IONIO_CORFU_AUDIOVISUAL_ARTS_CURRICULUM,
  '1453': IONIO_ZAKYNTHOS_ENVIRONMENT_CURRICULUM,
  '1455': IONIO_CORFU_TOURISM_CURRICULUM,
  '1456': IONIO_ARGOSTOLI_DIGITAL_MEDIA_COMMUNICATIONS_CURRICULUM,
  '326': AUA_AGRICULTURAL_ECONOMICS_CURRICULUM,
  '1061': AUA_KARPENISI_FORESTRY_CURRICULUM,
  '1063': AUA_THEBES_AGRIBUSINESS_MANAGEMENT_CURRICULUM,
  '1064': AUA_AMFISSA_REGIONAL_DEVELOPMENT_CURRICULUM,
  '389': PADA_INDUSTRIAL_DESIGN_PRODUCTION_CURRICULUM,
  '672': PADA_ACCOUNTING_FINANCE_CURRICULUM,
  '669': PADA_BUSINESS_ADMINISTRATION_CURRICULUM,
  '674': PADA_GRAPHIC_DESIGN_VISUAL_COMMUNICATION_CURRICULUM,
  '675': PADA_INTERIOR_ARCHITECTURE_CURRICULUM,
  '677': PADA_PHOTOGRAPHY_CURRICULUM,
  '668': PADA_ARCHIVAL_LIBRARY_INFORMATION_STUDIES_CURRICULUM,
  '670': PADA_TOURISM_MANAGEMENT_CURRICULUM,
  '614': ASTE_CRETE_CURRICULUM,
  '613': ASTE_RHODES_CURRICULUM,
  '818': AEN_ENGINEERS_CURRICULUM,
  '817': AEN_CAPTAINS_CURRICULUM,
  '390': PADA_CPE_CURRICULUM,
  '889': SSAS_INFORMATICS_CURRICULUM,
  '867': SSAS_ECONOMICS_CURRICULUM,
};

export function hasSchoolCurriculum(schoolId: string): boolean {
  return schoolId in SCHOOL_CURRICULA;
}
