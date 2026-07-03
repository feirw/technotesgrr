/** Πρόγραμμα σπουδών — τύποι και helpers */

import { EKPA_IPT_CURRICULUM as EKPA_IPT_CURRICULUM_FULL } from './ekpaIptCurriculum.generated';
import { EKPA_DIGITAL_INDUSTRY_CURRICULUM as EKPA_DIGITAL_INDUSTRY_CURRICULUM_FULL } from './ekpaDigitalIndustryCurriculum.generated';
import { EKPA_ECONOMIC_SCIENCE_CURRICULUM as EKPA_ECONOMIC_SCIENCE_CURRICULUM_FULL } from './ekpaEconomicScienceCurriculum.generated';
import { EKPA_BUSINESS_ADMINISTRATION_CURRICULUM } from './ekpaBusinessAdministrationCurriculum.generated';
import { EKPA_PORT_SHIPPING_MANAGEMENT_CURRICULUM } from './ekpaPortShippingManagementCurriculum.generated';
import { EKPA_PSACHNA_AGRICULTURAL_DEVELOPMENT_CURRICULUM } from './ekpaPsachnaAgriculturalDevelopmentCurriculum.generated';
import { EKPA_PRIMARY_EDUCATION_CURRICULUM } from './ekpaPrimaryEducationCurriculum.generated';
import { UTH_VOLOS_PRIMARY_EDUCATION_CURRICULUM } from './uthVolosPrimaryEducationCurriculum.generated';
import { UOI_PRIMARY_EDUCATION_CURRICULUM } from './uoiPrimaryEducationCurriculum.generated';
import { UOC_RETHYMNO_PRIMARY_EDUCATION_CURRICULUM } from './uocRethymnoPrimaryEducationCurriculum.generated';
import { DPTH_ALEXANDROUPOLI_PRIMARY_EDUCATION_CURRICULUM } from './dpthAlexandroupoliPrimaryEducationCurriculum.generated';
import { UOWM_FLORINA_PRIMARY_EDUCATION_CURRICULUM } from './uowmFlorinaPrimaryEducationCurriculum.generated';
import { AEGEAN_RHODES_PRIMARY_EDUCATION_CURRICULUM } from './aegeanRhodesPrimaryEducationCurriculum.generated';
import { EKPA_PRESCHOOL_EDUCATION_CURRICULUM } from './ekpaPreschoolEducationCurriculum.generated';
import { AUTH_PRESCHOOL_EDUCATION_CURRICULUM } from './authPreschoolEducationCurriculum.generated';
import { PADA_EARLY_CHILDHOOD_CARE_CURRICULUM } from './padaEarlyChildhoodCareCurriculum.generated';
import { UOP_PATRAS_PRESCHOOL_EDUCATION_CURRICULUM } from './uopPatrasPreschoolEducationCurriculum.generated';
import { UTH_VOLOS_PRESCHOOL_EDUCATION_CURRICULUM } from './uthVolosPreschoolEducationCurriculum.generated';
import { UOI_KINDERGARTEN_EDUCATION_CURRICULUM } from './uoiKindergartenEducationCurriculum.generated';
import { UOC_RETHYMNO_PRESCHOOL_EDUCATION_CURRICULUM } from './uocRethymnoPreschoolEducationCurriculum.generated';
import { DIPAE_THESSALONIKI_EARLY_CHILDHOOD_CARE_CURRICULUM } from './dipaeThessalonikiEarlyChildhoodCareCurriculum.generated';
import { UOWM_FLORINA_KINDERGARTEN_EDUCATION_CURRICULUM } from './uowmFlorinaKindergartenEducationCurriculum.generated';
import { UOI_EARLY_CHILDHOOD_CARE_CURRICULUM } from './uoiEarlyChildhoodCareCurriculum.generated';
import { DPTH_ALEXANDROUPOLI_PRESCHOOL_EDUCATION_CURRICULUM } from './dpthAlexandroupoliPreschoolEducationCurriculum.generated';
import { AEGEAN_RHODES_PRESCHOOL_EDUCATION_CURRICULUM } from './aegeanRhodesPreschoolEducationCurriculum.generated';
import { UTH_VOLOS_SPECIAL_EDUCATION_CURRICULUM } from './uthVolosSpecialEducationCurriculum.generated';
import { UOP_PATRAS_EDUCATION_SOCIAL_WORK_CURRICULUM } from './uopPatrasEducationSocialWorkCurriculum.generated';
import { EKPA_PHYSICAL_EDUCATION_SPORTS_SCIENCE_CURRICULUM } from './ekpaPhysicalEducationSportsScienceCurriculum.generated';
import { EKPA_HISTORY_PHILOSOPHY_OF_SCIENCE_CURRICULUM } from './ekpaHistoryPhilosophyOfScienceCurriculum.generated';
import { EKPA_THEATRE_STUDIES_CURRICULUM } from './ekpaTheatreStudiesCurriculum.generated';
import { EKPA_DIGITAL_ARTS_CINEMA_CURRICULUM } from './ekpaDigitalArtsCinemaCurriculum.generated';
import { AUTH_INFORMATICS_CURRICULUM as AUTH_INFORMATICS_CURRICULUM_FULL } from './authInformaticsCurriculum.generated';
import { AUTH_ECONOMIC_SCIENCE_CURRICULUM as AUTH_ECONOMIC_SCIENCE_CURRICULUM_FULL } from './authEconomicScienceCurriculum.generated';
import { AUTH_THESSALONIKI_PRIMARY_EDUCATION_SOCIAL_CULTURAL_CURRICULUM } from './authThessalonikiPrimaryEducationSocialCulturalCurriculum.generated';
import { AUTH_THESSALONIKI_THEATRE_CURRICULUM } from './authThessalonikiTheatreCurriculum.generated';
import { AUTH_THESSALONIKI_CINEMA_CURRICULUM } from './authThessalonikiCinemaCurriculum.generated';
import { AUTH_THESSALONIKI_PHYSICAL_EDUCATION_CURRICULUM } from './authThessalonikiPhysicalEducationCurriculum.generated';
import { AUTH_SERRES_PHYSICAL_EDUCATION_CURRICULUM } from './authSerresPhysicalEducationCurriculum.generated';
import { OPA_INFORMATICS_CURRICULUM as OPA_INFORMATICS_CURRICULUM_FULL } from './opaInformaticsCurriculum.generated';
import { OPA_ECONOMIC_SCIENCE_CURRICULUM as OPA_ECONOMIC_SCIENCE_CURRICULUM_FULL } from './opaEconomicScienceCurriculum.generated';
import { OPA_REGIONAL_DEVELOPMENT_CURRICULUM as OPA_REGIONAL_DEVELOPMENT_CURRICULUM_FULL } from './opaRegionalDevelopmentCurriculum.generated';
import { OPA_ACCOUNTING_FINANCE_CURRICULUM } from './opaAccountingFinanceCurriculum.generated';
import { OPA_BUSINESS_ADMINISTRATION_CURRICULUM } from './opaBusinessAdministrationCurriculum.generated';
import { OPA_MARKETING_COMMUNICATIONS_CURRICULUM } from './opaMarketingCommunicationsCurriculum.generated';
import { OPA_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM } from './opaManagementScienceTechnologyCurriculum.generated';
import { OPA_INTERNATIONAL_EUROPEAN_ECONOMIC_STUDIES_CURRICULUM } from './opaInternationalEuropeanEconomicStudiesCurriculum.generated';
import { OPA_STATISTICS_CURRICULUM } from './opaStatisticsCurriculum.generated';
import { OPA_PUBLIC_ADMINISTRATION_CURRICULUM } from './opaPublicAdministrationCurriculum.generated';
import { OPA_SOCIAL_POLICY_CURRICULUM } from './opaSocialPolicyCurriculum.generated';
import { UNIPI_INFORMATICS_CURRICULUM as UNIPI_INFORMATICS_CURRICULUM_FULL } from './unipiInformaticsCurriculum.generated';
import { PAMAK_CSC_CURRICULUM } from './pamakCscCurriculum.generated';
import { PAMAK_ECONOMIC_SCIENCE_CURRICULUM as PAMAK_ECONOMIC_SCIENCE_CURRICULUM_FULL } from './pamakEconomicScienceCurriculum.generated';
import { PAMAK_ISC_CURRICULUM } from './pamakIscCurriculum.generated';
import { PAMAK_ACCOUNTING_FINANCE_CURRICULUM } from './pamakAccountingFinanceCurriculum.generated';
import { PAMAK_BUSINESS_ADMINISTRATION_CURRICULUM } from './pamakBusinessAdministrationCurriculum.generated';
import { PAMAK_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM } from './pamakInternationalEuropeanStudiesCurriculum.generated';
import { PANTEION_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM } from './panteionInternationalEuropeanStudiesCurriculum.generated';
import { PAMAK_BALKAN_STUDIES_CURRICULUM } from './pamakBalkanStudiesCurriculum.generated';
import { HAROKOPIO_INFORMATICS_CURRICULUM as HAROKOPIO_INFORMATICS_CURRICULUM_FULL } from './harokopioInformaticsCurriculum.generated';
import { HAROKOPIO_SUSTAINABLE_ECONOMY_CURRICULUM as HAROKOPIO_SUSTAINABLE_ECONOMY_CURRICULUM_FULL } from './harokopioSustainableEconomyCurriculum.generated';
import { HAROKOPIO_GEOGRAPHY_CURRICULUM } from './harokopioGeographyCurriculum.generated';
import { PAPEI_DIGITAL_SYSTEMS_CURRICULUM as PAPEI_DIGITAL_SYSTEMS_CURRICULUM_FULL } from './papeiDigitalSystemsCurriculum.generated';
import { PAPEI_INDUSTRIAL_MANAGEMENT_CURRICULUM as PAPEI_INDUSTRIAL_MANAGEMENT_CURRICULUM_FULL } from './papeiIndustrialManagementCurriculum.generated';
import { PAPEI_ECONOMIC_SCIENCE_CURRICULUM as PAPEI_ECONOMIC_SCIENCE_CURRICULUM_FULL } from './papeiEconomicScienceCurriculum.generated';
import { PAPEI_BANKING_FINANCE_CURRICULUM } from './papeiBankingFinanceCurriculum.generated';
import { PAPEI_BUSINESS_ADMINISTRATION_CURRICULUM } from './papeiBusinessAdministrationCurriculum.generated';
import { PAPEI_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM } from './papeiInternationalEuropeanStudiesCurriculum.generated';
import { PAPEI_STATISTICS_INSURANCE_SCIENCE_CURRICULUM } from './papeiStatisticsInsuranceScienceCurriculum.generated';
import { PAPEI_MARITIME_STUDIES_CURRICULUM } from './papeiMaritimeStudiesCurriculum.generated';
import { PAPEI_TOURISM_STUDIES_CURRICULUM } from './papeiTourismStudiesCurriculum.generated';
import { UOC_CS_CURRICULUM as UOC_CS_CURRICULUM_FULL } from './uocCsCurriculum.generated';
import { UOC_RETHYMNO_ECONOMIC_SCIENCE_CURRICULUM } from './uocRethymnoEconomicScienceCurriculum.generated';
import { DIPAE_CPE_CURRICULUM as DIPAE_CPE_CURRICULUM_FULL } from './dipaeCpeCurriculum.generated';
import { DIPAE_PRODUCTION_MANAGEMENT_CURRICULUM as DIPAE_PRODUCTION_MANAGEMENT_CURRICULUM_FULL } from './dipaeProductionManagementCurriculum.generated';
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
import { TUC_PRODUCTION_MANAGEMENT_CURRICULUM as TUC_PRODUCTION_MANAGEMENT_CURRICULUM_FULL } from './tucProductionManagementCurriculum.generated';
import { DIPAE_SERRES_CPE_CURRICULUM as DIPAE_SERRES_CPE_CURRICULUM_FULL } from './dipaeSerresCpeCurriculum.generated';
import { DIPAE_SERRES_ECONOMIC_SCIENCE_CURRICULUM } from './dipaeSerresEconomicScienceCurriculum.generated';
import { DIPAE_SERRES_BUSINESS_ADMINISTRATION_CURRICULUM } from './dipaeSerresBusinessAdministrationCurriculum.generated';
import { DIPAE_SERRES_INTERIOR_ARCHITECTURE_CURRICULUM } from './dipaeSerresInteriorArchitectureCurriculum.generated';
import { DIPAE_KILKIS_CREATIVE_DESIGN_CLOTHING_CURRICULUM } from './dipaeKilkisCreativeDesignClothingCurriculum.generated';
import { DPTH_KAVALA_INFORMATICS_CURRICULUM as DPTH_KAVALA_INFORMATICS_CURRICULUM_FULL } from './dpthKavalaInformaticsCurriculum.generated';
import { DPTH_KAVALA_ACCOUNTING_FINANCE_CURRICULUM } from './dpthKavalaAccountingFinanceCurriculum.generated';
import { DPTH_KAVALA_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM } from './dpthKavalaManagementScienceTechnologyCurriculum.generated';
import { DPTH_KOMOTINI_ECONOMIC_SCIENCE_CURRICULUM } from './dpthKomotiniEconomicScienceCurriculum.generated';
import { DPTH_KOMOTINI_PHYSICAL_EDUCATION_CURRICULUM } from './dpthKomotiniPhysicalEducationCurriculum.generated';
import { DPTH_KOMOTINI_SOCIAL_POLICY_CURRICULUM } from './dpthKomotiniSocialPolicyCurriculum.generated';
import { DPTH_KOMOTINI_HUMANITIES_CURRICULUM } from './dpthKomotiniHumanitiesCurriculum.generated';
import { DPTH_PRODUCTION_MANAGEMENT_CURRICULUM as DPTH_PRODUCTION_MANAGEMENT_CURRICULUM_FULL } from './dpthProductionManagementCurriculum.generated';
import { DPTH_ORESTIADA_FORESTRY_CURRICULUM } from './dpthOrestiadaForestryCurriculum.generated';
import { DPTH_ORESTIADA_AGRICULTURAL_DEVELOPMENT_CURRICULUM } from './dpthOrestiadaAgriculturalDevelopmentCurriculum.generated';
import { UTH_BIOMED_INFORMATICS_CURRICULUM as UTH_BIOMED_INFORMATICS_CURRICULUM_FULL } from './uthBiomedInformaticsCurriculum.generated';
import { UOP_TRIPOLI_ECONOMIC_SCIENCE_CURRICULUM } from './uopTripoliEconomicScienceCurriculum.generated';
import { UOP_TRIPOLI_ICT_CURRICULUM as UOP_TRIPOLI_ICT_CURRICULUM_FULL } from './uopTripoliIctCurriculum.generated';
import { UOP_PATRAS_ECONOMIC_SCIENCE_CURRICULUM as UOP_PATRAS_ECONOMIC_SCIENCE_CURRICULUM_FULL } from './uopPatrasEconomicScienceCurriculum.generated';
import { UOP_PATRAS_BUSINESS_ADMINISTRATION_CURRICULUM } from './uopPatrasBusinessAdministrationCurriculum.generated';
import { UOP_PATRAS_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM } from './uopPatrasManagementScienceTechnologyCurriculum.generated';
import { UOP_PATRAS_TOURISM_MANAGEMENT_CURRICULUM } from './uopPatrasTourismManagementCurriculum.generated';
import { UOP_PATRAS_THEATRE_STUDIES_CURRICULUM } from './uopPatrasTheatreStudiesCurriculum.generated';
import { UOP_MESOLONGI_FISHERIES_AQUACULTURE_CURRICULUM } from './uopMesolongiFisheriesAquacultureCurriculum.generated';
import { UTH_ICT_CURRICULUM as UTH_ICT_CURRICULUM_FULL } from './uthIctCurriculum.generated';
import { UTH_DIGITAL_SYSTEMS_CURRICULUM as UTH_DIGITAL_SYSTEMS_CURRICULUM_FULL } from './uthDigitalSystemsCurriculum.generated';
import { UOWM_KASTORIA_ECONOMIC_SCIENCE_CURRICULUM } from './uowmKastoriaEconomicScienceCurriculum.generated';
import { UOWM_KASTORIA_INFORMATICS_CURRICULUM as UOWM_KASTORIA_INFORMATICS_CURRICULUM_FULL } from './uowmKastoriaInformaticsCurriculum.generated';
import { UOWM_KASTORIA_DIGITAL_MEDIA_COMMUNICATIONS_CURRICULUM } from './uowmKastoriaDigitalMediaCommunicationsCurriculum.generated';
import { UOWM_KOZANI_PRODUCT_DESIGN_CURRICULUM as UOWM_KOZANI_PRODUCT_DESIGN_CURRICULUM_FULL } from './uowmKozaniProductDesignCurriculum.generated';
import { UOWM_KOZANI_ACCOUNTING_FINANCE_CURRICULUM } from './uowmKozaniAccountingFinanceCurriculum.generated';
import { UOWM_KOZANI_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM } from './uowmKozaniManagementScienceTechnologyCurriculum.generated';
import { UOWM_KOZANI_INTERNATIONAL_EUROPEAN_ECONOMIC_STUDIES_CURRICULUM } from './uowmKozaniInternationalEuropeanEconomicStudiesCurriculum.generated';
import { UOWM_GREVENA_BUSINESS_ADMINISTRATION_CURRICULUM } from './uowmGrevenaBusinessAdministrationCurriculum.generated';
import { UOWM_GREVENA_STATISTICS_CURRICULUM } from './uowmGrevenaStatisticsCurriculum.generated';
import { ELMEPA_ECE_CURRICULUM as ELMEPA_ECE_CURRICULUM_FULL } from './elmepaEceCurriculum.generated';
import { ELMEPA_HERAKLION_ACCOUNTING_FINANCE_CURRICULUM } from './elmepaHeraklionAccountingFinanceCurriculum.generated';
import { ELMEPA_AGIOS_NIKOLAOS_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM } from './elmepaAgiosNikolaosManagementScienceTechnologyCurriculum.generated';
import { ELMEPA_BUSINESS_ADMINISTRATION_TOURISM_CURRICULUM } from './elmepaBusinessAdministrationTourismCurriculum.generated';
import { ELMEPA_RETHYMNO_MUSIC_TECHNOLOGY_CURRICULUM } from './elmepaRethymnoMusicTechnologyCurriculum.generated';
import { PAMAK_MUSIC_ARTS_CURRICULUM } from './pamakMusicArtsCurriculum.generated';
import { EKPA_MUSIC_STUDIES_CURRICULUM } from './ekpaMusicStudiesCurriculum.generated';
import { AUTH_THESSALONIKI_MUSIC_STUDIES_CURRICULUM } from './authThessalonikiMusicStudiesCurriculum.generated';
import { IONIO_CORFU_MUSIC_STUDIES_CURRICULUM } from './ionioCorfuMusicStudiesCurriculum.generated';
import { UOI_ARTA_MUSIC_STUDIES_CURRICULUM } from './uoiArtaMusicStudiesCurriculum.generated';
import { AEGEAN_SAMOS_ICS_CURRICULUM as AEGEAN_SAMOS_ICS_CURRICULUM_FULL } from './aegeanSamosIcsCurriculum.generated';
import { AEGEAN_SAMOS_STATISTICS_CURRICULUM } from './aegeanSamosStatisticsCurriculum.generated';
import { AEGEAN_CHIOS_MEM_CURRICULUM } from './aegeanChiosMemCurriculum.generated';
import { AEGEAN_CHIOS_BUSINESS_ADMINISTRATION_CURRICULUM } from './aegeanChiosBusinessAdministrationCurriculum.generated';
import { AEGEAN_CHIOS_TOURISM_MANAGEMENT_CURRICULUM } from './aegeanChiosTourismManagementCurriculum.generated';
import { AEGEAN_CHIOS_MARITIME_BUSINESS_SERVICES_CURRICULUM } from './aegeanChiosMaritimeBusinessServicesCurriculum.generated';
import { AEGEAN_SYROS_PRODUCT_DESIGN_CURRICULUM as AEGEAN_SYROS_PRODUCT_DESIGN_CURRICULUM_FULL } from './aegeanSyrosProductDesignCurriculum.generated';
import { AEGEAN_RHODES_MEDITERRANEAN_STUDIES_CURRICULUM } from './aegeanRhodesMediterraneanStudiesCurriculum.generated';
import { AEGEAN_MYTILENE_ENVIRONMENT_CURRICULUM } from './aegeanMytileneEnvironmentCurriculum.generated';
import { AEGEAN_MYTILENE_GEOGRAPHY_CURRICULUM } from './aegeanMytileneGeographyCurriculum.generated';
import { AEGEAN_MYTILENE_CULTURAL_TECHNOLOGY_CURRICULUM } from './aegeanMytileneCulturalTechnologyCurriculum.generated';
import { UOP_SPARTA_DIGITAL_SYSTEMS_CURRICULUM as UOP_SPARTA_DIGITAL_SYSTEMS_CURRICULUM_FULL } from './uopSpartaDigitalSystemsCurriculum.generated';
import { UTH_ENERGY_SYSTEMS_CURRICULUM as UTH_ENERGY_SYSTEMS_CURRICULUM_FULL } from './uthEnergySystemsCurriculum.generated';
import { UTH_LARISSA_ENVIRONMENT_CURRICULUM } from './uthLarissaEnvironmentCurriculum.generated';
import { UTH_KARDITSA_FORESTRY_CURRICULUM } from './uthKarditsaForestryCurriculum.generated';
import { UTH_TRIKALA_PHYSICAL_EDUCATION_CURRICULUM } from './uthTrikalaPhysicalEducationCurriculum.generated';
import { UTH_VOLOS_ECONOMIC_SCIENCE_CURRICULUM as UTH_VOLOS_ECONOMIC_SCIENCE_CURRICULUM_FULL } from './uthVolosEconomicScienceCurriculum.generated';
import { UTH_VOLOS_CULTURE_CREATIVE_MEDIA_CURRICULUM } from './uthVolosCultureCreativeMediaCurriculum.generated';
import { UOI_ARTA_ICT_CURRICULUM as UOI_ARTA_ICT_CURRICULUM_FULL } from './uoiArtaIctCurriculum.generated';
import { UOI_ECONOMIC_SCIENCE_CURRICULUM } from './uoiEconomicScienceCurriculum.generated';
import { UOI_PREVEZA_ACCOUNTING_FINANCE_CURRICULUM } from './uoiPrevezaAccountingFinanceCurriculum.generated';
import { IONIO_CORFU_INFORMATICS_CURRICULUM as IONIO_CORFU_INFORMATICS_CURRICULUM_FULL } from './ionioCorfuInformaticsCurriculum.generated';
import { IONIO_CORFU_INFORMATION_SCIENCE_CURRICULUM as IONIO_CORFU_INFORMATION_SCIENCE_CURRICULUM_FULL } from './ionioCorfuInformationScienceCurriculum.generated';
import { IONIO_CORFU_AUDIOVISUAL_ARTS_CURRICULUM } from './ionioCorfuAudiovisualArtsCurriculum.generated';
import { IONIO_ARGOSTOLI_DIGITAL_MEDIA_COMMUNICATIONS_CURRICULUM } from './ionioArgostoliDigitalMediaCommunicationsCurriculum.generated';
import { IONIO_CORFU_TOURISM_CURRICULUM } from './ionioCorfuTourismCurriculum.generated';
import { IONIO_ZAKYNTHOS_ENVIRONMENT_CURRICULUM } from './ionioZakynthosEnvironmentCurriculum.generated';
import { PADA_CPE_CURRICULUM as PADA_CPE_CURRICULUM_FULL } from './padaCpeCurriculum.generated';
import { PADA_INDUSTRIAL_DESIGN_PRODUCTION_CURRICULUM as PADA_INDUSTRIAL_DESIGN_PRODUCTION_CURRICULUM_FULL } from './padaIndustrialDesignProductionCurriculum.generated';
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
import { POLICE_OFFICERS_CURRICULUM } from './policeOfficersCurriculum.generated';
import { POLICE_OFFICERS_FOR_POLICE_CURRICULUM } from './policeOfficersForPoliceCurriculum.generated';
import { POLICE_CONSTABLES_CURRICULUM } from './policeConstablesCurriculum.generated';
import { FIRE_SERVICE_OFFICERS_CURRICULUM } from './fireServiceOfficersCurriculum.generated';
import { FIRE_SERVICE_FIREFIGHTERS_CURRICULUM } from './fireServiceFirefightersCurriculum.generated';
import { FIRE_SERVICE_OFFICERS_FOR_FIREFIGHTERS_CURRICULUM } from './fireServiceOfficersForFirefightersCurriculum.generated';
import { COAST_GUARD_ENSIGNS_CURRICULUM } from './coastGuardEnsignsCurriculum.generated';
import { COAST_GUARD_HARBOR_GUARDS_CURRICULUM } from './coastGuardHarborGuardsCurriculum.generated';
import { COAST_GUARD_STAFF_CURRICULUM } from './coastGuardStaffCurriculum.generated';
import { HAF_ICARUS_SUPPLY_CURRICULUM } from './hafIcarusSupplyCurriculum.generated';
import { HAF_ICARUS_ADMINISTRATIVE_CURRICULUM } from './hafIcarusAdministrativeCurriculum.generated';
import { HAF_NCO_ADMIN_LOGISTICS_CURRICULUM } from './hafNcoAdminLogisticsCurriculum.generated';
import { HAF_NCO_TECHNOLOGICAL_SUPPORT_CURRICULUM } from './hafNcoTechnologicalSupportCurriculum.generated';
import { HAF_NCO_OPERATIONAL_SUPPORT_CURRICULUM } from './hafNcoOperationalSupportCurriculum.generated';
import { HAF_NCO_OPERATIONAL_SUPPORT_RADIONAVIGATORS_CURRICULUM } from './hafNcoOperationalSupportRadionavigatorsCurriculum.generated';
import { ARMY_EVELPIDON_WEAPONS_CURRICULUM } from './armyEvelpidonWeaponsCurriculum.generated';
import { ARMY_EVELPIDON_CORPS_CURRICULUM } from './armyEvelpidonCorpsCurriculum.generated';
import { ARMY_NCO_CORPS_CURRICULUM } from './armyNcoCorpsCurriculum.generated';
import { ARMY_NCO_WEAPONS_CURRICULUM } from './armyNcoWeaponsCurriculum.generated';
import { NAVY_NCO_CURRICULUM } from './navyNcoCurriculum.generated';
import { AUA_AGRICULTURAL_ECONOMICS_CURRICULUM as AUA_AGRICULTURAL_ECONOMICS_CURRICULUM_FULL } from './auaAgriculturalEconomicsCurriculum.generated';
import { AUA_AMFISSA_REGIONAL_DEVELOPMENT_CURRICULUM } from './auaAmfissaRegionalDevelopmentCurriculum.generated';
import { AUA_KARPENISI_FORESTRY_CURRICULUM } from './auaKarpenisiForestryCurriculum.generated';
import { AUA_THEBES_AGRIBUSINESS_MANAGEMENT_CURRICULUM } from './auaThebesAgribusinessManagementCurriculum.generated';

export {
  EKPA_IPT_CURRICULUM_FULL,
  EKPA_DIGITAL_INDUSTRY_CURRICULUM_FULL,
  EKPA_ECONOMIC_SCIENCE_CURRICULUM_FULL,
  EKPA_BUSINESS_ADMINISTRATION_CURRICULUM,
  EKPA_PORT_SHIPPING_MANAGEMENT_CURRICULUM,
  EKPA_PSACHNA_AGRICULTURAL_DEVELOPMENT_CURRICULUM,
  EKPA_HISTORY_PHILOSOPHY_OF_SCIENCE_CURRICULUM,
  EKPA_THEATRE_STUDIES_CURRICULUM,
  EKPA_PHYSICAL_EDUCATION_SPORTS_SCIENCE_CURRICULUM,
  AUTH_INFORMATICS_CURRICULUM_FULL,
  AUTH_ECONOMIC_SCIENCE_CURRICULUM_FULL,
  AUTH_THESSALONIKI_PRIMARY_EDUCATION_SOCIAL_CULTURAL_CURRICULUM,
  AUTH_THESSALONIKI_THEATRE_CURRICULUM,
  AUTH_THESSALONIKI_CINEMA_CURRICULUM,
  AUTH_THESSALONIKI_PHYSICAL_EDUCATION_CURRICULUM,
  AUTH_SERRES_PHYSICAL_EDUCATION_CURRICULUM,
  OPA_INFORMATICS_CURRICULUM_FULL,
  OPA_ECONOMIC_SCIENCE_CURRICULUM_FULL,
  OPA_REGIONAL_DEVELOPMENT_CURRICULUM_FULL,
  OPA_ACCOUNTING_FINANCE_CURRICULUM,
  OPA_BUSINESS_ADMINISTRATION_CURRICULUM,
  OPA_MARKETING_COMMUNICATIONS_CURRICULUM,
  OPA_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  OPA_INTERNATIONAL_EUROPEAN_ECONOMIC_STUDIES_CURRICULUM,
  OPA_STATISTICS_CURRICULUM,
  OPA_PUBLIC_ADMINISTRATION_CURRICULUM,
  OPA_SOCIAL_POLICY_CURRICULUM,
  UNIPI_INFORMATICS_CURRICULUM_FULL,
  PAMAK_CSC_CURRICULUM,
  PAMAK_ECONOMIC_SCIENCE_CURRICULUM_FULL,
  PAMAK_ISC_CURRICULUM,
  PAMAK_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM,
  PANTEION_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM,
  PAMAK_BALKAN_STUDIES_CURRICULUM,
  HAROKOPIO_INFORMATICS_CURRICULUM_FULL,
  HAROKOPIO_SUSTAINABLE_ECONOMY_CURRICULUM_FULL,
  PAPEI_DIGITAL_SYSTEMS_CURRICULUM_FULL,
  PAPEI_INDUSTRIAL_MANAGEMENT_CURRICULUM_FULL,
  PAPEI_ECONOMIC_SCIENCE_CURRICULUM_FULL,
  PAPEI_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM,
  PAPEI_STATISTICS_INSURANCE_SCIENCE_CURRICULUM,
  PAPEI_MARITIME_STUDIES_CURRICULUM,
  PAPEI_TOURISM_STUDIES_CURRICULUM,
  UOC_CS_CURRICULUM_FULL,
  UOC_RETHYMNO_ECONOMIC_SCIENCE_CURRICULUM,
  DIPAE_CPE_CURRICULUM_FULL,
  DIPAE_PRODUCTION_MANAGEMENT_CURRICULUM_FULL,
  TUC_PRODUCTION_MANAGEMENT_CURRICULUM_FULL,
  DIPAE_SERRES_CPE_CURRICULUM_FULL,
  DIPAE_SERRES_ECONOMIC_SCIENCE_CURRICULUM,
  DPTH_KAVALA_INFORMATICS_CURRICULUM_FULL,
  DPTH_KAVALA_ACCOUNTING_FINANCE_CURRICULUM,
  DPTH_KAVALA_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  DPTH_KOMOTINI_ECONOMIC_SCIENCE_CURRICULUM,
  DPTH_KOMOTINI_PHYSICAL_EDUCATION_CURRICULUM,
  DPTH_KOMOTINI_SOCIAL_POLICY_CURRICULUM,
  DPTH_PRODUCTION_MANAGEMENT_CURRICULUM_FULL,
  DPTH_ORESTIADA_FORESTRY_CURRICULUM,
  DPTH_ORESTIADA_AGRICULTURAL_DEVELOPMENT_CURRICULUM,
  UTH_BIOMED_INFORMATICS_CURRICULUM_FULL,
  UOP_TRIPOLI_ECONOMIC_SCIENCE_CURRICULUM,
  UOP_TRIPOLI_ICT_CURRICULUM_FULL,
  UOP_PATRAS_ECONOMIC_SCIENCE_CURRICULUM_FULL,
  UOP_PATRAS_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  UOP_PATRAS_TOURISM_MANAGEMENT_CURRICULUM,
  UOP_MESOLONGI_FISHERIES_AQUACULTURE_CURRICULUM,
  UTH_ICT_CURRICULUM_FULL,
  UTH_DIGITAL_SYSTEMS_CURRICULUM_FULL,
  UOWM_KASTORIA_ECONOMIC_SCIENCE_CURRICULUM,
  UOWM_KASTORIA_INFORMATICS_CURRICULUM_FULL,
  UOWM_KASTORIA_DIGITAL_MEDIA_COMMUNICATIONS_CURRICULUM,
  UOWM_KOZANI_PRODUCT_DESIGN_CURRICULUM_FULL,
  UOWM_KOZANI_ACCOUNTING_FINANCE_CURRICULUM,
  UOWM_KOZANI_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  UOWM_KOZANI_INTERNATIONAL_EUROPEAN_ECONOMIC_STUDIES_CURRICULUM,
  UOWM_GREVENA_BUSINESS_ADMINISTRATION_CURRICULUM,
  UOWM_GREVENA_STATISTICS_CURRICULUM,
  ELMEPA_ECE_CURRICULUM_FULL,
  ELMEPA_HERAKLION_ACCOUNTING_FINANCE_CURRICULUM,
  ELMEPA_AGIOS_NIKOLAOS_MANAGEMENT_SCIENCE_TECHNOLOGY_CURRICULUM,
  AEGEAN_SAMOS_ICS_CURRICULUM_FULL,
  AEGEAN_SAMOS_STATISTICS_CURRICULUM,
  AEGEAN_SYROS_PRODUCT_DESIGN_CURRICULUM_FULL,
  AEGEAN_MYTILENE_ENVIRONMENT_CURRICULUM,
  AEGEAN_MYTILENE_GEOGRAPHY_CURRICULUM,
  AEGEAN_MYTILENE_CULTURAL_TECHNOLOGY_CURRICULUM,
  UOP_SPARTA_DIGITAL_SYSTEMS_CURRICULUM_FULL,
  UTH_ENERGY_SYSTEMS_CURRICULUM_FULL,
  UTH_LARISSA_ENVIRONMENT_CURRICULUM,
  UTH_KARDITSA_FORESTRY_CURRICULUM,
  UTH_TRIKALA_PHYSICAL_EDUCATION_CURRICULUM,
  UTH_VOLOS_ECONOMIC_SCIENCE_CURRICULUM_FULL,
  UOI_ARTA_ICT_CURRICULUM_FULL,
  UOI_ECONOMIC_SCIENCE_CURRICULUM,
  UOI_PREVEZA_ACCOUNTING_FINANCE_CURRICULUM,
  IONIO_CORFU_INFORMATICS_CURRICULUM_FULL,
  IONIO_CORFU_INFORMATION_SCIENCE_CURRICULUM_FULL,
  IONIO_ARGOSTOLI_DIGITAL_MEDIA_COMMUNICATIONS_CURRICULUM,
  IONIO_ZAKYNTHOS_ENVIRONMENT_CURRICULUM,
  PADA_CPE_CURRICULUM_FULL,
  PADA_INDUSTRIAL_DESIGN_PRODUCTION_CURRICULUM_FULL,
  AUA_AGRICULTURAL_ECONOMICS_CURRICULUM_FULL,
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
  /** Επίσημος σύνδεσμος μαθημάτων (όταν δεν εμφανίζεται λίστα στο app) */
  externalCoursesUrl?: string;
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

/** Κοινό κείμενο για σχολές με εξωτερικό link προγράμματος σπουδών */
export const EXTERNAL_CURRICULUM_NOTE = 'Πρόγραμμα σπουδών';

/** Προσωρινά κρυμμένα μαθήματα — εμφανίζεται μόνο εξωτερικό link όπου υπάρχει */
function curriculumWithoutCourses(curriculum: SchoolCurriculum): SchoolCurriculum {
  if (curriculum.externalCoursesUrl) {
    return {
      ...curriculum,
      semesters: [],
      hoursNote: curriculum.hoursNote ?? EXTERNAL_CURRICULUM_NOTE,
    };
  }
  return {
    ...curriculum,
    semesters: [],
    hoursNote: undefined,
    semesterPdfLinks: undefined,
  };
}

/** ΕΚΠΑ Πληροφορικής και Τηλεπικοινωνιών — μαθήματα στο επίσημο site του τμήματος */
const EKPA_DI_COURSES_URL = 'https://www.di.uoa.gr/studies/undergraduate/courses';

export const EKPA_IPT_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής και Τηλεπικοινωνιών',
  subtitle: 'ΕΚΠΑ · Αθήνα',
  externalCoursesUrl: EKPA_DI_COURSES_URL,
  semesters: [],
};

/** ΕΚΠΑ Τεχνολογιών Ψηφιακής Βιομηχανίας — μαθήματα στο επίσημο site του τμήματος */
const EKPA_DIND_COURSES_URL = 'https://www.dind.uoa.gr/';

export const EKPA_DIGITAL_INDUSTRY_CURRICULUM: SchoolCurriculum = {
  title: 'Τεχνολογιών Ψηφιακής Βιομηχανίας',
  subtitle: 'ΕΚΠΑ · Ψαχνά',
  externalCoursesUrl: EKPA_DIND_COURSES_URL,
  semesters: [],
};

/** ΕΚΠΑ Οικονομικών Επιστημών — μαθήματα στο επίσημο site του τμήματος */
const EKPA_ECON_COURSES_URL =
  'https://www.econ.uoa.gr/spoydes/proptychiakes-spoydes/';

export const EKPA_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle: 'Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών · Αθήνα',
  externalCoursesUrl: EKPA_ECON_COURSES_URL,
  semesters: [],
};

/** ΠΑΠΕΙ Πληροφορικής — μαθήματα στο επίσημο site του τμήματος */
const PAPEI_CS_COURSES_URL = 'https://cs.unipi.gr/programma-spoudwn/';

export const UNIPI_INFORMATICS_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής',
  subtitle: 'ΠΑΠΕΙ · Πειραιάς',
  externalCoursesUrl: PAPEI_CS_COURSES_URL,
  semesters: [],
};

/** ΑΠΘ Πληροφορικής — μαθήματα στο επίσημο site του τμήματος */
const AUTH_CSD_COURSES_URL = 'https://csd.auth.gr/studies/undergraduate/courses/';

export const AUTH_INFORMATICS_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής',
  subtitle: 'ΑΠΘ · Θεσσαλονίκη',
  externalCoursesUrl: AUTH_CSD_COURSES_URL,
  semesters: [],
};

/** ΑΠΘ Οικονομικών Επιστημών — μαθήματα στο επίσημο site του τμήματος */
const AUTH_ECON_COURSES_URL =
  'https://www.econ-auth.gr/studies/undergraduate/course-description/';

export const AUTH_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle: 'Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης · Θεσσαλονίκη',
  externalCoursesUrl: AUTH_ECON_COURSES_URL,
  semesters: [],
};

/** ΟΠΑ Πληροφορικής — μαθήματα στο επίσημο site του τμήματος */
const OPA_CS_COURSES_URL = 'https://www.dept.aueb.gr/el/cs/courses';

export const OPA_INFORMATICS_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής',
  subtitle: 'ΟΠΑ · Αθήνα',
  externalCoursesUrl: OPA_CS_COURSES_URL,
  semesters: [],
};

/** ΟΠΑ Οικονομικής Επιστήμης — μαθήματα στο επίσημο site του τμήματος */
const OPA_ECON_COURSES_URL = 'https://www.dept.aueb.gr/el/econ_courses';

export const OPA_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικής Επιστήμης',
  subtitle: 'Οικονομικό Πανεπιστήμιο Αθηνών · Αθήνα',
  externalCoursesUrl: OPA_ECON_COURSES_URL,
  semesters: [],
};

/** Πάντειο Οικονομικής & Περιφερειακής Ανάπτυξης — μαθήματα στο επίσημο site του τμήματος */
const PANTEION_REGIONAL_DEVELOPMENT_COURSES_URL =
  'https://topa.panteion.gr/proptychiakes-spoydes/';

export const OPA_REGIONAL_DEVELOPMENT_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικής & Περιφερειακής Ανάπτυξης',
  subtitle: 'Πάντειο Πανεπιστήμιο · Αθήνα',
  externalCoursesUrl: PANTEION_REGIONAL_DEVELOPMENT_COURSES_URL,
  semesters: [],
};

/** ΠΑΜΑΚ Οικονομικών Επιστημών — πρόγραμμα σπουδών (PDF) στο επίσημο site */
const PAMAK_ECON_COURSES_URL =
  'https://www.uom.gr/assets/site/public/nodes/1299/28646-26190-2025_2026_synoptiko_programma_spoudwn_27_3_2026.pdf';

export const PAMAK_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle: 'Πανεπιστήμιο Μακεδονίας · Θεσσαλονίκη',
  externalCoursesUrl: PAMAK_ECON_COURSES_URL,
  semesters: [],
};

/** Πάτρα Οικονομικών Επιστημών — μαθήματα στο επίσημο site του τμήματος */
const UOP_PATRAS_ECON_COURSES_URL =
  'https://www.econ.upatras.gr/undergraduate/courses/';

export const UOP_PATRAS_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle: 'Πανεπιστήμιο Πατρών · Πάτρα',
  externalCoursesUrl: UOP_PATRAS_ECON_COURSES_URL,
  semesters: [],
};

/** Γεωπονικό Αγροτικής Οικονομίας και Ανάπτυξης — μαθήματα στο επίσημο site του τμήματος */
const AUA_AOA_COURSES_URL = 'https://aoa.aua.gr/el/?page_id=4628';

export const AUA_AGRICULTURAL_ECONOMICS_CURRICULUM: SchoolCurriculum = {
  title: 'Αγροτικής Οικονομίας και Ανάπτυξης',
  subtitle: 'Γεωπονικό Πανεπιστήμιο Αθηνών · Αθήνα',
  externalCoursesUrl: AUA_AOA_COURSES_URL,
  semesters: [],
};

/** Χαροκόπειο Πληροφορικής και Τηλεματικής — μαθήματα στο επίσημο site του τμήματος */
const HAROKOPIO_DIT_COURSES_URL =
  'https://dit.hua.gr/index.php/el/programmata-spoudon/proptyxiako/mathimata';

export const HAROKOPIO_INFORMATICS_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής και Τηλεματικής',
  subtitle: 'ΧΑΡΟΚΟΠΕΙΟ · Αθήνα',
  externalCoursesUrl: HAROKOPIO_DIT_COURSES_URL,
  semesters: [],
};

/** Χαροκόπειο Οικονομίας και Βιώσιμης Ανάπτυξης — μαθήματα στο επίσημο site του τμήματος */
const HAROKOPIO_DHEE_COURSES_URL =
  'https://dhee.hua.gr/index.php/el/proptixiakes-spoudes/xrisimes-plirofories/perigrammata-mathimaton';

export const HAROKOPIO_SUSTAINABLE_ECONOMY_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομίας και Βιώσιμης Ανάπτυξης',
  subtitle: 'Χαροκόπειο Πανεπιστήμιο · Αθήνα',
  externalCoursesUrl: HAROKOPIO_DHEE_COURSES_URL,
  semesters: [],
};

/** ΠΑΠΕΙ Ψηφιακών Συστημάτων — μαθήματα στο επίσημο site του τμήματος */
const PAPEI_DS_COURSES_URL = 'https://www.ds.unipi.gr/courses/';

export const PAPEI_DIGITAL_SYSTEMS_CURRICULUM: SchoolCurriculum = {
  title: 'Ψηφιακών Συστημάτων',
  subtitle: 'ΠΑΠΕΙ · Πειραιάς',
  externalCoursesUrl: PAPEI_DS_COURSES_URL,
  semesters: [],
};

/** ΠΑΠΕΙ Βιομηχανικής Διοίκησης & Τεχνολογίας — μαθήματα στο επίσημο site του τμήματος */
const PAPEI_TEX_COURSES_URL = 'https://www.tex.unipi.gr/undergraduate/courses/';

export const PAPEI_INDUSTRIAL_MANAGEMENT_CURRICULUM: SchoolCurriculum = {
  title: 'Βιομηχανικής Διοίκησης & Τεχνολογίας',
  subtitle: 'ΠΑΠΕΙ · Πειραιάς',
  externalCoursesUrl: PAPEI_TEX_COURSES_URL,
  semesters: [],
};

/** ΠΑΠΕΙ Οικονομικής Επιστήμης — μαθήματα στο επίσημο site του τμήματος */
const PAPEI_ECON_COURSES_URL = 'https://economics-unipi.gr/lessons/';

export const PAPEI_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικής Επιστήμης',
  subtitle: 'Πανεπιστήμιο Πειραιώς · Πειραιάς',
  externalCoursesUrl: PAPEI_ECON_COURSES_URL,
  semesters: [],
};

/** Πανεπιστήμιο Κρήτης Επιστήμης Υπολογιστών — μαθήματα στο επίσημο site του τμήματος */
const UOC_CSD_COURSES_URL =
  'https://www.csd.uoc.gr/index.jsp?content=courses_catalog_new&openmenu=demoAcc3&lang=gr';

export const UOC_CS_CURRICULUM: SchoolCurriculum = {
  title: 'Επιστήμης Υπολογιστών',
  subtitle: 'Πανεπιστήμιο Κρήτης · Ηράκλειο',
  externalCoursesUrl: UOC_CSD_COURSES_URL,
  semesters: [],
};

/** ΠΑΔΑ Μηχανικών Πληροφορικής και Υπολογιστών — μαθήματα στο επίσημο site του τμήματος */
const PADA_ICE_COURSES_URL = 'https://ice.uniwa.gr/education/undergraduate/courses/';

export const PADA_CPE_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Πληροφορικής και Υπολογιστών',
  subtitle: 'Πανεπιστήμιο Δυτικής Αττικής · Αιγάλεω',
  externalCoursesUrl: PADA_ICE_COURSES_URL,
  semesters: [],
};

/** ΠΑΔΑ Μηχανικών Βιομηχανικής Σχεδίασης και Παραγωγής — μαθήματα στο επίσημο site */
const PADA_IDPE_COURSES_URL = 'https://idpe.uniwa.gr/courses';

export const PADA_INDUSTRIAL_DESIGN_PRODUCTION_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Βιομηχανικής Σχεδίασης και Παραγωγής',
  subtitle: 'Πανεπιστήμιο Δυτικής Αττικής · Αιγάλεω',
  externalCoursesUrl: PADA_IDPE_COURSES_URL,
  semesters: [],
};

/** ΔΙΠΑΕ Μηχανικών Πληροφορικής & Ηλεκτρονικών Συστημάτων — μαθήματα στο επίσημο site του τμήματος */
const DIPAE_IEE_COURSES_URL = 'https://www.iee.ihu.gr/udg_courses/';

export const DIPAE_CPE_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Πληροφορικής & Ηλεκτρονικών Συστημάτων',
  subtitle: 'ΔΙΠΑΕ · Θεσσαλονίκη',
  externalCoursesUrl: DIPAE_IEE_COURSES_URL,
  semesters: [],
};

/** ΔΙΠΑΕ Μηχανικών Παραγωγής και Διοίκησης — μαθήματα στο επίσημο site του τμήματος */
const DIPAE_IEM_COURSES_URL = 'https://www.iem.ihu.gr/courses/';

export const DIPAE_PRODUCTION_MANAGEMENT_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Παραγωγής και Διοίκησης',
  subtitle: 'ΔΙΠΑΕ · Θεσσαλονίκη',
  externalCoursesUrl: DIPAE_IEM_COURSES_URL,
  semesters: [],
};

/** Πολυτεχνείο Κρήτης Μηχανικών Παραγωγής και Διοίκησης — μαθήματα στο επίσημο site */
const TUC_PEM_COURSES_URL =
  'https://www.pem.tuc.gr/el/spoydes/proptychiakes-spoydes/proptychiaka-mathimata';

export const TUC_PRODUCTION_MANAGEMENT_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Παραγωγής και Διοίκησης',
  subtitle: 'Πολυτεχνείο Κρήτης · Χανιά',
  externalCoursesUrl: TUC_PEM_COURSES_URL,
  semesters: [],
};

/** ΔΙΠΑΕ Σέρρες Μηχανικών Πληροφορικής — μαθήματα στο επίσημο site του τμήματος */
const DIPAE_SERRES_ICT_COURSES_URL = 'https://www.ict.ihu.gr/courses/';

export const DIPAE_SERRES_CPE_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Πληροφορικής, Υπολογιστών & Τηλεπικοινωνιών',
  subtitle: 'ΔΙΠΑΕ · Σέρρες',
  externalCoursesUrl: DIPAE_SERRES_ICT_COURSES_URL,
  semesters: [],
};

/** ΔΠΘ Πληροφορικής Καβάλας — μαθήματα στο επίσημο site του τμήματος */
const DPTH_KAVALA_CS_COURSES_URL = 'https://www.cs.duth.gr/courses.xhtml';

export const DPTH_KAVALA_INFORMATICS_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής',
  subtitle: 'ΔΠΘ · Καβάλα',
  externalCoursesUrl: DPTH_KAVALA_CS_COURSES_URL,
  semesters: [],
};

/** ΔΠΘ Μηχανικών Παραγωγής και Διοίκησης (Ξάνθη) — μαθήματα στο επίσημο site */
const DPTH_PME_COURSES_URL = 'https://pme.duth.gr/proptixiaka/courses/';

export const DPTH_PRODUCTION_MANAGEMENT_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Παραγωγής και Διοίκησης',
  subtitle: 'ΔΠΘ · Ξάνθη',
  externalCoursesUrl: DPTH_PME_COURSES_URL,
  semesters: [],
};

/** Πανεπιστήμιο Θεσσαλίας Πληροφορική με Εφαρμογές στη Βιοϊατρική — μαθήματα στο επίσημο site */
const UTH_DIB_COURSES_URL = 'https://dib.uth.gr/?page_id=6030';

export const UTH_BIOMED_INFORMATICS_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής με Εφαρμογές στη Βιοϊατρική',
  subtitle: 'Πανεπιστήμιο Θεσσαλίας · Λαμία',
  externalCoursesUrl: UTH_DIB_COURSES_URL,
  semesters: [],
};

/** Πανεπιστήμιο Θεσσαλίας Πληροφορικής και Τηλεπικοινωνιών — μαθήματα στο επίσημο site */
const UTH_DIT_COURSES_URL = 'https://dit.uth.gr/?page_id=36374';

export const UTH_ICT_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής και Τηλεπικοινωνιών',
  subtitle: 'Πανεπιστήμιο Θεσσαλίας · Λαμία',
  externalCoursesUrl: UTH_DIT_COURSES_URL,
  semesters: [],
};

/** Πανεπιστήμιο Θεσσαλίας Ψηφιακών Συστημάτων — μαθήματα στο επίσημο site */
const UTH_DS_COURSES_URL = 'https://ds.uth.gr/undergraduate-studies/';

export const UTH_DIGITAL_SYSTEMS_CURRICULUM: SchoolCurriculum = {
  title: 'Ψηφιακών Συστημάτων',
  subtitle: 'Πανεπιστήμιο Θεσσαλίας · Λάρισα',
  externalCoursesUrl: UTH_DS_COURSES_URL,
  semesters: [],
};

/** Πανεπιστήμιο Θεσσαλίας Συστημάτων Ενέργειας — μαθήματα στο επίσημο site */
const UTH_ENERGY_COURSES_URL =
  'https://energy.uth.gr/www/index.php/el/spoudes/perigrammata-mathimaton';

export const UTH_ENERGY_SYSTEMS_CURRICULUM: SchoolCurriculum = {
  title: 'Συστημάτων Ενέργειας',
  subtitle: 'Πανεπιστήμιο Θεσσαλίας · Λάρισα',
  externalCoursesUrl: UTH_ENERGY_COURSES_URL,
  semesters: [],
};

/** Πανεπιστήμιο Θεσσαλίας Οικονομικών Επιστημών (Βόλος) — μαθήματα στο επίσημο site του τμήματος */
const UTH_VOLOS_ECON_COURSES_URL =
  'https://econ.uth.gr/σπουδές/προπτυχιακό/περιγραφή-μαθημάτων';

export const UTH_VOLOS_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle: 'Πανεπιστήμιο Θεσσαλίας · Βόλος',
  externalCoursesUrl: UTH_VOLOS_ECON_COURSES_URL,
  semesters: [],
};

/** Πανεπιστήμιο Πελοποννήσου Πληροφορικής και Τηλεπικοινωνιών — μαθήματα στο επίσημο site */
const UOP_TRIPOLI_DIT_COURSES_URL = 'https://dit.uop.gr/courses';

export const UOP_TRIPOLI_ICT_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής και Τηλεπικοινωνιών',
  subtitle: 'Πανεπιστήμιο Πελοποννήσου · Τρίπολη',
  externalCoursesUrl: UOP_TRIPOLI_DIT_COURSES_URL,
  semesters: [],
};

/** Πανεπιστήμιο Πελοποννήσου Ψηφιακών Συστημάτων — μαθήματα στο επίσημο site */
const UOP_SPARTA_DS_COURSES_URL = 'https://ds.uop.gr/courses';

export const UOP_SPARTA_DIGITAL_SYSTEMS_CURRICULUM: SchoolCurriculum = {
  title: 'Ψηφιακών Συστημάτων',
  subtitle: 'Πανεπιστήμιο Πελοποννήσου · Σπάρτη',
  externalCoursesUrl: UOP_SPARTA_DS_COURSES_URL,
  semesters: [],
};

/** Ιωαννίνων Πληροφορικής και Τηλεπικοινωνιών (Άρτα) — μαθήματα στο επίσημο site */
const UOI_ARTA_DIT_COURSES_URL = 'https://www.dit.uoi.gr/lessons/';

export const UOI_ARTA_ICT_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής και Τηλεπικοινωνιών',
  subtitle: 'Πανεπιστήμιο Ιωαννίνων · Άρτα',
  externalCoursesUrl: UOI_ARTA_DIT_COURSES_URL,
  semesters: [],
};

/** Ιόνιο Πληροφορικής (Κέρκυρα) — μαθήματα στο επίσημο site του τμήματος */
const IONIO_CORFU_DI_COURSES_URL =
  'https://di.ionio.gr/gr/studies/undergraduate-studies/courses-new/';

export const IONIO_CORFU_INFORMATICS_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής',
  subtitle: 'Ιόνιο Πανεπιστήμιο · Κέρκυρα',
  externalCoursesUrl: IONIO_CORFU_DI_COURSES_URL,
  semesters: [],
};

/** Ιόνιο Επιστήμης της Πληροφορίας (Κέρκυρα) — μαθήματα στο επίσημο site του τμήματος */
const IONIO_CORFU_ILAM_COURSES_URL = 'https://ilam.ionio.gr/';

export const IONIO_CORFU_INFORMATION_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Επιστήμης της Πληροφορίας',
  subtitle: 'Ιόνιο Πανεπιστήμιο · Κέρκυρα',
  externalCoursesUrl: IONIO_CORFU_ILAM_COURSES_URL,
  semesters: [],
};

/** Πανεπιστήμιο Δυτικής Μακεδονίας Πληροφορικής — μαθήματα στο επίσημο site */
const UOWM_KASTORIA_CS_COURSES_URL =
  'https://cs.uowm.gr/archiki-selida/programma-spoudwn/';

export const UOWM_KASTORIA_INFORMATICS_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής',
  subtitle: 'Πανεπιστήμιο Δυτικής Μακεδονίας · Καστοριά',
  externalCoursesUrl: UOWM_KASTORIA_CS_COURSES_URL,
  semesters: [],
};

/** Δυτ. Μακεδονίας Μηχανικών Σχεδίασης Προϊόντων (Κοζάνη) — μαθήματα στο επίσημο site */
const UOWM_KOZANI_IDE_COURSES_URL =
  'https://ide.uowm.gr/programma-spoydon-2025-2026/';

export const UOWM_KOZANI_PRODUCT_DESIGN_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Σχεδίασης Προϊόντων και Συστημάτων',
  subtitle: 'Πανεπιστήμιο Δυτικής Μακεδονίας · Κοζάνη',
  externalCoursesUrl: UOWM_KOZANI_IDE_COURSES_URL,
  semesters: [],
};

/** ΕΛΜΕΠΑ Ηλεκτρονικών Μηχανικών — μαθήματα στο επίσημο site του τμήματος */
const ELMEPA_EE_COURSES_URL =
  'https://ee.hmu.gr/proptyxiakes/neo-etes-programma-spoydwn-tmhmatos-hlektronikwn-mhchanikwn/';

export const ELMEPA_ECE_CURRICULUM: SchoolCurriculum = {
  title: 'Ηλεκτρονικών Μηχανικών',
  subtitle: 'Ελληνικό Μεσογειακό Πανεπιστήμιο · Χανιά',
  externalCoursesUrl: ELMEPA_EE_COURSES_URL,
  semesters: [],
};

/** Αιγαίου ΜΠΕΣ (Σάμος) — μαθήματα στο επίσημο site του τμήματος */
const AEGEAN_SAMOS_ICS_COURSES_URL = 'https://www.icsd.aegean.gr/pps';

export const AEGEAN_SAMOS_ICS_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Πληροφοριακών & Επικοινωνιακών Συστημάτων',
  subtitle: 'Πανεπιστήμιο Αιγαίου · Σάμος',
  externalCoursesUrl: AEGEAN_SAMOS_ICS_COURSES_URL,
  semesters: [],
};

/** Αιγαίου Μηχανικών Σχεδίασης Προϊόντων (Σύρος) — μαθήματα στο επίσημο site */
const AEGEAN_SYROS_COURSES_URL =
  'https://www.syros.aegean.gr/el/spoydes/proptychiakes-spoydes/courses';

export const AEGEAN_SYROS_PRODUCT_DESIGN_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Σχεδίασης Προϊόντων και Συστημάτων',
  subtitle: 'Πανεπιστήμιο Αιγαίου · Σύρος',
  externalCoursesUrl: AEGEAN_SYROS_COURSES_URL,
  semesters: [],
};

export function curriculumHasLab(curriculum: SchoolCurriculum): boolean {
  return curriculum.semesters.some((sem) =>
    sem.courses.some((c) => c.hours?.lab != null && c.hours.lab > 0),
  );
}

/** ΣΣΑΣ — ίδιο ακαδημαϊκό πρόγραμμα με ΑΠΘ Πληροφορικής + στρατιωτική εκπαίδευση */
export const SSAS_INFORMATICS_CURRICULUM: SchoolCurriculum = {
  title: 'Πληροφορικής (ΣΣΑΣ)',
  subtitle: 'ΣΣΑΣ · Θεσσαλονίκη',
  hoursNote:
    'Παρακολουθεί το πρόγραμμα σπουδών της Πληροφορικής ΑΠΘ, με επιπλέον στρατιωτική εκπαίδευση.',
  semesters: [],
};

/** ΣΣΑΣ — ίδιο ακαδημαϊκό πρόγραμμα με ΑΠΘ Οικονομικών Επιστημών + στρατιωτική εκπαίδευση */
export const SSAS_ECONOMICS_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικό (ΣΣΑΣ)',
  subtitle: 'ΣΣΑΣ · Θεσσαλονίκη',
  hoursNote:
    'Ακολουθεί το πρόγραμμα σπουδών των Οικονομικών Επιστημών ΑΠΘ. ' +
    'Παράλληλα παρέχεται στρατιωτική εκπαίδευση.',
  semesters: [],
};

const RAW_SCHOOL_CURRICULA: Record<string, SchoolCurriculum> = {
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
  '164': UTH_VOLOS_PRIMARY_EDUCATION_CURRICULUM,
  '130': UOI_PRIMARY_EDUCATION_CURRICULUM,
  '132': UOC_RETHYMNO_PRIMARY_EDUCATION_CURRICULUM,
  '142': DPTH_ALEXANDROUPOLI_PRIMARY_EDUCATION_CURRICULUM,
  '334': UOWM_FLORINA_PRIMARY_EDUCATION_CURRICULUM,
  '143': AEGEAN_RHODES_PRIMARY_EDUCATION_CURRICULUM,
  '154': EKPA_PRESCHOOL_EDUCATION_CURRICULUM,
  '134': AUTH_PRESCHOOL_EDUCATION_CURRICULUM,
  '673': PADA_EARLY_CHILDHOOD_CARE_CURRICULUM,
  '136': UOP_PATRAS_PRESCHOOL_EDUCATION_CURRICULUM,
  '166': UTH_VOLOS_PRESCHOOL_EDUCATION_CURRICULUM,
  '156': UOI_KINDERGARTEN_EDUCATION_CURRICULUM,
  '158': UOC_RETHYMNO_PRESCHOOL_EDUCATION_CURRICULUM,
  '1610': DIPAE_THESSALONIKI_EARLY_CHILDHOOD_CARE_CURRICULUM,
  '341': UOWM_FLORINA_KINDERGARTEN_EDUCATION_CURRICULUM,
  '1241': UOI_EARLY_CHILDHOOD_CARE_CURRICULUM,
  '160': DPTH_ALEXANDROUPOLI_PRESCHOOL_EDUCATION_CURRICULUM,
  '162': AEGEAN_RHODES_PRESCHOOL_EDUCATION_CURRICULUM,
  '178': UTH_VOLOS_SPECIAL_EDUCATION_CURRICULUM,
  '1286': UOP_PATRAS_EDUCATION_SOCIAL_WORK_CURRICULUM,
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
  '1669': DPTH_KOMOTINI_HUMANITIES_CURRICULUM,
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
  '409': PAMAK_MUSIC_ARTS_CURRICULUM,
  '408': EKPA_MUSIC_STUDIES_CURRICULUM,
  '406': AUTH_THESSALONIKI_MUSIC_STUDIES_CURRICULUM,
  '407': IONIO_CORFU_MUSIC_STUDIES_CURRICULUM,
  '1248': UOI_ARTA_MUSIC_STUDIES_CURRICULUM,
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
  '869': POLICE_OFFICERS_CURRICULUM,
  '872': POLICE_OFFICERS_FOR_POLICE_CURRICULUM,
  '870': POLICE_CONSTABLES_CURRICULUM,
  '877': FIRE_SERVICE_OFFICERS_CURRICULUM,
  '876': FIRE_SERVICE_FIREFIGHTERS_CURRICULUM,
  '871': FIRE_SERVICE_OFFICERS_FOR_FIREFIGHTERS_CURRICULUM,
  '881': COAST_GUARD_ENSIGNS_CURRICULUM,
  '882': COAST_GUARD_HARBOR_GUARDS_CURRICULUM,
  '873': COAST_GUARD_STAFF_CURRICULUM,
  '887': HAF_ICARUS_SUPPLY_CURRICULUM,
  '886': HAF_ICARUS_ADMINISTRATIVE_CURRICULUM,
  '880': HAF_NCO_ADMIN_LOGISTICS_CURRICULUM,
  '878': HAF_NCO_TECHNOLOGICAL_SUPPORT_CURRICULUM,
  '879': HAF_NCO_OPERATIONAL_SUPPORT_CURRICULUM,
  '888': HAF_NCO_OPERATIONAL_SUPPORT_RADIONAVIGATORS_CURRICULUM,
  '801': ARMY_EVELPIDON_WEAPONS_CURRICULUM,
  '806': ARMY_EVELPIDON_CORPS_CURRICULUM,
  '863': ARMY_NCO_CORPS_CURRICULUM,
  '862': ARMY_NCO_WEAPONS_CURRICULUM,
  '864': NAVY_NCO_CURRICULUM,
  '390': PADA_CPE_CURRICULUM,
  '889': SSAS_INFORMATICS_CURRICULUM,
  '867': SSAS_ECONOMICS_CURRICULUM,
};

export const SCHOOL_CURRICULA: Record<string, SchoolCurriculum> = Object.fromEntries(
  Object.entries(RAW_SCHOOL_CURRICULA).map(([id, curriculum]) => [
    id,
    curriculumWithoutCourses(curriculum),
  ]),
);

export function hasSchoolCurriculum(schoolId: string): boolean {
  return schoolId in SCHOOL_CURRICULA;
}

export function canOpenSchoolCurriculum(schoolId: string): boolean {
  const curriculum = SCHOOL_CURRICULA[schoolId];
  if (!curriculum) return false;
  return Boolean(curriculum.externalCoursesUrl);
}
