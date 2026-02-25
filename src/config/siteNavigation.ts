export const SITE_NAVIGATION = {
  items: {
    library: { label: '古籍库', href: '/library' },
    search: { label: '智能检索', href: '/search' },
    research: { label: '学术研究', href: '/research' },
    symptoms: { label: '症状方剂', href: '/symptoms' },
    about: { label: '关于我们', href: '/about' },
    resources: { label: '资源中心', href: '/resources' },
    contact: { label: '联系我们', href: '/contact' }
  },
  submenus: {
    library: [
      { labelKey: 'header.medicalClassics', href: '/library?category=medical-classics' },
      { labelKey: 'header.materiaMedica', href: '/library?category=materia-medica' },
      { labelKey: 'header.prescriptions', href: '/library?category=prescriptions' },
      { labelKey: 'header.acupuncture', href: '/library?category=acupuncture' },
      { labelKey: 'header.diagnostics', href: '/library?category=diagnostics' }
    ],
    search: [
      { labelKey: 'header.fullSearch', href: '/search?type=books' },
      { labelKey: 'header.prescriptionSearch', href: '/search?type=prescriptions' },
      { labelKey: 'header.symptomSearch', href: '/search?type=symptoms' },
      { labelKey: 'header.herbSearch', href: '/search?type=herbs' }
    ],
    research: [
      { labelKey: 'header.researchPapers', href: '/research?type=papers' },
      { labelKey: 'header.researchInstitutions', href: '/research?type=institutions' },
      { labelKey: 'header.researchTrends', href: '/research?type=trends' }
    ]
  },
  mega: {
    library: {
      columns: [
        {
          titleKey: 'header.medicalClassics',
          items: [
            { labelKey: 'header.huangdi', href: '/library/huangdi-neijing' },
            { labelKey: 'header.shanghan', href: '/library/shanghan-zabing-lun' },
            { labelKey: 'header.bencao', href: '/library/bencao-gangmu' }
          ]
        },
        {
          titleKey: 'header.categories',
          items: [
            { labelKey: 'header.medical', href: '/library?category=medical' },
            { labelKey: 'header.pharmacology', href: '/library?category=pharmacology' },
            { labelKey: 'header.formulas', href: '/library?category=formulas' }
          ]
        }
      ]
    }
  }
};
