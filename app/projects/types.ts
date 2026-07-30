export type ProjectImage = {
  asset?: {
    url?: string
    metadata?: {
      lqip?: string
      dimensions?: {
        width?: number
        height?: number
      }
    }
  }
  alt?: string
}

export type ProjectDetailSection = {
  _key?: string
  heading?: string
  body?: string
}

export type ProjectItem = {
  _id: string
  title: string
  slug?: string
  client: string
  summary: string
  status?: string
  semester?: string
  featuredImage?: ProjectImage
  techStack?: string[]
  tags?: string[]
  highlights?: string[]
  repositoryUrl?: string
  deploymentUrl?: string
  overview?: string
  problem?: string
  solution?: string
  outcome?: string
  detailSections?: ProjectDetailSection[]
}

export type ProjectProps = {
  project: ProjectItem
}

export type ProjectsDashboardProps = {
  projects: ProjectItem[]
}

export type ProjectPageProps = {
  params: Promise<{
    slug: string
  }>
}

export type ProjectDetailBlockProps = {
  heading: string
  body?: string
}

export type ProjectSlug = {
  slug?: string
}
