import {defineQuery} from 'next-sanity'

export const HOME_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "homePage"][0] {
    title,
    subtitle,
    callsToAction[] {
      _key,
      label,
      href,
      audience
    }
  }
`)

export const ABOUT_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "aboutPage"][0] {
    heroLabel,
    eyebrow,
    introduction,
    heroCtaLabel,
    heroImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt,
      crop,
      hotspot
    },
    essentialsLabel,
    essentialsTitle,
    essentialsItems[] {
      _key,
      label,
      value,
      body
    },
    modelLabel,
    modelTitle,
    modelBody,
    availabilityLabel,
    availabilityText,
    galleryLabel,
    galleryTitle,
    galleryImages[] {
      _key,
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt,
      crop,
      hotspot
    },
    experienceImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt,
      crop,
      hotspot
    },
    experienceLabel,
    experienceTitle,
    benefits,
    partnersLabel,
    partnersTitle,
    partnersIntroduction,
    partners,
    testimonial,
    testimonialAttribution
  }
`)

export const STUDENTS_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "studentsPage"][0] {
    seoTitle,
    seoDescription,
    heroLabel,
    heroTitle,
    heroIntroduction,
    heroCtaLabel,
    heroCtaUrl,
    heroImage {
      asset-> {
        _id,
        url,
        metadata {lqip, dimensions}
      },
      alt,
      crop,
      hotspot
    },
    factsLabel,
    factsTitle,
    facts[] {_key, label, value, body},
    journeyLabel,
    journeyTitle,
    journeyIntroduction,
    journeyStages[] {_key, title, body},
    expectationsLabel,
    expectationsTitle,
    expectationsIntroduction,
    expectations[] {_key, title, body},
    assessmentLabel,
    assessmentTitle,
    assessmentIntroduction,
    groupAssessmentTitle,
    groupAssessmentPercentage,
    groupAssessmentBody,
    individualAssessmentTitle,
    individualAssessmentPercentage,
    individualAssessmentBody,
    closingLabel,
    closingTitle,
    closingBody,
    closingCtaLabel,
    closingCtaUrl
  }
`)

export const CLIENTS_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "clientsPage"][0] {
    seoTitle,
    seoDescription,
    heroLabel,
    heroTitle,
    heroIntroduction,
    heroCtaLabel,
    heroCtaEmail,
    heroImage {
      asset-> {
        _id,
        url,
        metadata {lqip, dimensions}
      },
      alt,
      crop,
      hotspot
    },
    valueLabel,
    valueTitle,
    valuePropositions[] {_key, title, body},
    modelLabel,
    modelTitle,
    modelIntroduction,
    modelFacts[] {_key, label, value, body},
    processLabel,
    processTitle,
    processIntroduction,
    processStages[] {_key, title, body},
    fitLabel,
    fitTitle,
    fitIntroduction,
    projectQualities,
    fitImage {
      asset-> {
        _id,
        url,
        metadata {lqip, dimensions}
      },
      alt,
      crop,
      hotspot
    },
    partnersLabel,
    partnersTitle,
    partnersIntroduction,
    partners,
    benefitsLabel,
    benefitsTitle,
    benefits[] {_key, title, body},
    closingLabel,
    closingTitle,
    closingBody,
    closingCtaLabel,
    closingCtaEmail
  }
`)

export const PROJECTS_QUERY = defineQuery(/* groq */ `
  *[_type == "project"] | order(displayOrder asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    client,
    summary,
    status,
    displayOrder,
    featuredImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt
    },
    techStack,
    tags,
    highlights,
    overview,
    problem,
    solution,
    outcome,
    detailSections[] {
      _key,
      heading,
      body
    },
    repositoryUrl,
    deploymentUrl
  }
`)

export const PROJECT_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current
  }
`)

export const PROJECT_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    client,
    summary,
    status,
    displayOrder,
    featuredImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt
    },
    techStack,
    tags,
    highlights,
    overview,
    problem,
    solution,
    outcome,
    detailSections[] {
      _key,
      heading,
      body
    },
    repositoryUrl,
    deploymentUrl
  }
`)
