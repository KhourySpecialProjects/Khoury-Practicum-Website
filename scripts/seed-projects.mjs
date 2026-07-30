import {getCliClient} from 'sanity/cli'

const projects = [
  {
    title: 'Galley',
    slug: 'galley',
    client: 'Northeastern University',
    summary:
      'An academic manuscript workflow platform for submissions, editorial review, peer review, copy editing, and publication.',
    status: 'active',
    displayOrder: 3,
    techStack: ['Next.js', 'React', 'Python', 'PostgreSQL', 'Docker', 'AWS S3'],
    highlights: [
      'Role-based workflows for authors, editors, reviewers, and copy editors',
      'Submission-to-publication manuscript lifecycle',
      'Containerized local development environment',
    ],
    overview:
      'Galley is a web application for managing academic manuscript submissions from initial author upload through editorial review and final publication.',
    problem:
      'Academic publishing teams need a clear, accountable way to move manuscripts between authors, editors, peer reviewers, and copy editors while keeping each stage of the workflow organized.',
    solution:
      'Galley pairs a browser-based React and Next.js frontend with a Python backend and PostgreSQL database. Docker Compose brings the application, API, database, and database administration tools together for local development.',
    outcome:
      'The platform creates a shared workflow for submitting, assigning, reviewing, editing, and publishing manuscripts while supporting file uploads and optional email notifications.',
  },
  {
    title: 'Nexus',
    slug: 'nexus',
    client: 'Northeastern University',
    summary:
      'A full-stack operations platform with environment-aware authentication, project data, and secure cloud storage.',
    status: 'active',
    displayOrder: 4,
    techStack: [
      'React 19',
      'TypeScript',
      'Vite',
      'FastAPI',
      'PostgreSQL',
      'AWS Cognito',
      'AWS S3',
    ],
    highlights: [
      'FastAPI and React monorepo architecture',
      'Environment-aware Cognito authentication safeguards',
      'OpenAPI-generated frontend types',
    ],
    overview:
      'Nexus is a full-stack monorepo that combines a FastAPI backend with a React single-page application for managing operational data and projects.',
    problem:
      'Teams need a development workflow that supports local, test, CI, and production environments without allowing local authentication bypasses to reach production builds.',
    solution:
      'The platform uses FastAPI, SQLModel, Alembic, and PostgreSQL on the backend, plus React, TypeScript, Vite, Tailwind CSS, and shadcn/ui on the frontend. AWS Cognito provides authentication and S3 supports file storage.',
    outcome:
      'Developers can work fully offline by default, opt into real Cognito flows when needed, and keep backend API contracts synchronized with generated TypeScript types.',
  },
  {
    title: 'SupplyNet',
    slug: 'supplynet',
    client: 'Massachusetts National Guard',
    summary:
      'A cloud-based inventory platform that replaces paper-based equipment checks with role-based workflows, photos, and compliant Army forms.',
    status: 'active',
    displayOrder: 5,
    techStack: [
      'React',
      'TypeScript',
      'tRPC',
      'AWS CDK',
      'AWS Lambda',
      'DynamoDB',
      'Amazon Cognito',
      'Amazon S3',
    ],
    highlights: [
      'Nested kit and item inventory workflows',
      'Role-based access for technicians and managers',
      'Automated DA Form 2404 PDF and CSV exports',
    ],
    overview:
      'SupplyNet is a browser-based inventory management system built to replace the Massachusetts Army National Guard’s paper-based equipment inventory process.',
    problem:
      'Technicians need to log standalone items and multi-level kits accurately, while managers need reliable oversight and documentation without repeated paper-form checks.',
    solution:
      'The application provides role-based inventory workflows, photos, item and kit status updates, team management, and standardized exports. Its AWS architecture uses CloudFront, Cognito, DynamoDB, S3, Lambda, and CDK-managed infrastructure.',
    outcome:
      'SupplyNet enables faster, lower-training inventory sessions and produces compliant equipment records for supply managers and leadership.',
    repositoryUrl: 'https://github.com/KhourySpecialProjects/MNG_Inventory_System',
  },
  {
    title: 'ExamEngine',
    slug: 'examengine',
    client: 'Northeastern University',
    summary:
      'An intelligent exam scheduling platform that uses graph coloring to generate conflict-free final-exam timetables in minutes.',
    status: 'active',
    displayOrder: 6,
    techStack: [
      'Next.js 15',
      'TypeScript',
      'Tailwind CSS',
      'shadcn/ui',
      'FastAPI',
      'Python 3.12',
      'PostgreSQL 15',
      'Terraform',
      'AWS ECS Fargate',
    ],
    highlights: [
      'DSATUR graph-coloring algorithm for conflict-free schedules',
      'Schedules 15,000+ students across 1,500+ course sections',
      'Reduces scheduling time from weeks to minutes',
    ],
    overview:
      'ExamEngine is an intelligent final-exam scheduling system built for Northeastern University’s Office of the Vice Provost and Office of the University Registrar.',
    problem:
      'Creating final-exam timetables requires balancing student enrollment data, classroom capacities, available time slots, and constraints such as preventing conflicts, avoiding back-to-back exams, and limiting students to two exams per day.',
    solution:
      'ExamEngine uses the DSATUR graph-coloring algorithm to generate conflict-free schedules. The platform combines a Next.js frontend with a FastAPI and PostgreSQL backend, plus Terraform-managed AWS infrastructure.',
    outcome:
      'The system can schedule more than 15,000 students across 1,500 course sections, 270 rooms, and 25 time slots in minutes instead of weeks of manual work.',
    repositoryUrl: 'https://github.com/KhourySpecialProjects/ExamEngine',
  },
]

const tagsByProjectSlug = {
  'video-management-portal': [
    'Management System',
    'Data Management',
  ],
  'guard-connect': ['Management System', 'Workflow Automation'],
  'automated-course-scheduler': [
    'Scheduling',
    'Workflow Automation',
    'Data Management',
  ],
  galley: ['Management System', 'Workflow Automation', 'Academic Publishing'],
  nexus: ['Management System', 'Data Management'],
  supplynet: [
    'Management System',
    'Inventory Management',
    'Workflow Automation',
  ],
  examengine: [
    'Scheduling',
    'Graph Algorithms',
    'Workflow Automation',
  ],
}

const legacyTechnologyTags = new Set(['React', 'AWS', 'FastAPI'])
const semesterPattern = /^(Spring|Summer|Fall|Winter) \d{4}$/i

const client = getCliClient({apiVersion: '2025-02-19'})
const slugs = projects.map((project) => project.slug)
const existing = await client.fetch(
  '*[_type == "project" && slug.current in $slugs]{"slug": slug.current}',
  {slugs},
)
const existingSlugs = new Set(existing.map((project) => project.slug))
const missingProjects = projects.filter((project) => !existingSlugs.has(project.slug))

if (missingProjects.length) {
  const transaction = client.transaction()

  for (const project of missingProjects) {
    const {slug, ...fields} = project
    transaction.create({
      _type: 'project',
      ...fields,
      slug: {_type: 'slug', current: slug},
    })
  }

  await transaction.commit()
}

const tagDocuments = await client.fetch('*[_type == "projectTag"]{_id, title}')
const tagTitleById = new Map(tagDocuments.map((tag) => [tag._id, tag.title]))
const savedProjects = await client.fetch(
  '*[_type == "project" && slug.current in $slugs]{_id, "slug": slug.current, semester, tags}',
  {slugs: Object.keys(tagsByProjectSlug)},
)
const projectsNeedingTags = savedProjects
  .map((project) => {
    const currentTags = project.tags || []
    const hasOnlyStrings = currentTags.every((tag) => typeof tag === 'string')
    const tags = currentTags.length
      ? currentTags
          .map((tag) =>
            typeof tag === 'string' ? tag : tagTitleById.get(tag._ref),
          )
          .filter(Boolean)
      : tagsByProjectSlug[project.slug] || []

    const semester = project.semester || tags.find((tag) => semesterPattern.test(tag))
    const otherTags = [...new Set(tags)].filter(
      (tag) => !legacyTechnologyTags.has(tag) && !semesterPattern.test(tag),
    )
    const hasSameTags =
      hasOnlyStrings &&
      otherTags.length === currentTags.length &&
      otherTags.every((tag) => currentTags.includes(tag))
    const hasSameSemester = semester === project.semester

    return {project, hasOnlyStrings, hasSameSemester, hasSameTags, semester, tags: otherTags}
  })
  .filter(
    ({hasOnlyStrings, hasSameSemester, hasSameTags}) =>
      !hasOnlyStrings || !hasSameTags || !hasSameSemester,
  )

if (projectsNeedingTags.length) {
  const transaction = client.transaction()

  for (const {project, semester, tags} of projectsNeedingTags) {
    transaction.patch(project._id, (patch) =>
      patch.set({tags, ...(semester ? {semester} : {})}),
    )
  }

  await transaction.commit({autoGenerateArrayKeys: true})
}

if (!missingProjects.length && !projectsNeedingTags.length) {
  console.log('All requested projects and tags already exist; no documents were changed.')
  process.exit(0)
}

console.log(
  `Created ${missingProjects.length} project document(s) and updated tags on ${projectsNeedingTags.length} project(s).`,
)
