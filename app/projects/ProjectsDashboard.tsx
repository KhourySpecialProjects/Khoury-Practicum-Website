'use client'

import {useMemo, useState} from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Grid2X2,
  List,
  Search,
  Server,
} from 'lucide-react'

import {cn} from '@/lib/utils'
import type {
  ProjectItem,
  ProjectProps,
  ProjectsDashboardProps,
} from './types'

const normalize = (value: string) => value.trim().toLowerCase()

const getSearchText = (project: ProjectItem) =>
  [
    project.title,
    project.client,
    project.summary,
    project.status,
    ...(project.techStack || []),
    ...(project.tags || []),
    ...(project.highlights || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

function ProjectMedia({project}: ProjectProps) {
  const imageUrl = project.featuredImage?.asset?.url

  if (imageUrl) {
    return (
      <div
        role="img"
        aria-label={project.featuredImage?.alt || project.title}
        className="h-full w-full object-cover"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-white via-brand-red-light to-amber-50">
      <Server className="h-10 w-10 text-brand-red/45" aria-hidden />
    </div>
  )
}

function ProjectCard({project}: ProjectProps) {
  const techPreview = project.techStack?.slice(0, 4) || []
  const href = project.slug ? `/projects/${project.slug}` : '/projects'

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-lg border border-brand-black/10 bg-brand-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-red/35 hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-red"
    >
      <div className="aspect-16/7 overflow-hidden border-b border-brand-black/10">
        <ProjectMedia project={project} />
      </div>
      <div className="p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
            {project.client}
          </p>
          <h2 className="mt-2 text-xl font-semibold leading-tight text-brand-black">
            {project.title}
          </h2>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-black/65">
          {project.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {techPreview.map((item) => (
            <span
              key={item}
              className="rounded-full bg-brand-red-light px-3 py-1 text-xs font-semibold text-brand-red-dark"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-end border-t border-brand-black/10 pt-4">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-red transition group-hover:text-brand-red-dark">
            View project
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  )
}

function ProjectRow({project}: ProjectProps) {
  const href = project.slug ? `/projects/${project.slug}` : '/projects'

  return (
    <Link
      href={href}
      className="grid gap-4 rounded-lg border border-brand-black/10 bg-brand-white p-4 shadow-sm transition hover:border-brand-red/35 hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:grid-cols-[10rem_1fr]"
    >
      <div className="aspect-video overflow-hidden rounded-md border border-brand-black/10 sm:aspect-auto">
        <ProjectMedia project={project} />
      </div>
      <div className="min-w-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
            {project.client}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-brand-black">
            {project.title}
          </h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-brand-black/65">{project.summary}</p>
        <div className="mt-4 flex justify-end">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-red">
            View project
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function ProjectsDashboard({projects}: ProjectsDashboardProps) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'cards' | 'list'>('cards')
  const [selectedTag, setSelectedTag] = useState('')

  const availableTags = useMemo(
    () =>
      Array.from(new Set(projects.flatMap((project) => project.tags || []))).sort(
        (first, second) => first.localeCompare(second),
      ),
    [projects],
  )

  const filteredProjects = useMemo(() => {
    const term = normalize(query)

    return projects.filter((project) => {
      const matchesSearch = !term || getSearchText(project).includes(term)
      const matchesTag = !selectedTag || project.tags?.includes(selectedTag)

      return matchesSearch && matchesTag
    })
  }, [projects, query, selectedTag])

  return (
    <section className="rise-in rise-in-delay-2 mt-10">
      <div className="flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-md">
          <span className="sr-only">Search projects</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-brand-black/40"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects"
            className="h-11 w-full rounded-md border border-brand-black/10 bg-brand-white/85 pl-10 pr-4 text-sm text-brand-black shadow-sm outline-none transition placeholder:text-brand-black/40 focus:border-brand-red focus:bg-brand-white focus:ring-0"
          />
        </label>

        <div className="inline-flex w-fit rounded-md border border-brand-black/10 bg-brand-white/75 p-1 shadow-sm backdrop-blur">
          <button
            type="button"
            onClick={() => setView('cards')}
            aria-pressed={view === 'cards'}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-sm px-3 text-sm font-semibold transition',
              view === 'cards'
                ? 'bg-brand-red text-brand-white shadow-sm'
                : 'text-brand-black/55 hover:bg-brand-white hover:text-brand-black',
            )}
          >
            <Grid2X2 className="h-4 w-4" aria-hidden />
            Cards
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            aria-pressed={view === 'list'}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-sm px-3 text-sm font-semibold transition',
              view === 'list'
                ? 'bg-brand-red text-brand-white shadow-sm'
                : 'text-brand-black/55 hover:bg-brand-white hover:text-brand-black',
            )}
          >
            <List className="h-4 w-4" aria-hidden />
            List
          </button>
        </div>
      </div>

      {availableTags.length ? (
        <div className="mt-5 border-t border-brand-black/10 pt-5">
          <label className="flex w-full max-w-xs flex-col gap-2 text-sm font-semibold text-brand-black/65">
            Filter by tag
            <select
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              className="h-11 rounded-md border border-brand-black/10 bg-brand-white px-3 text-sm font-medium text-brand-black shadow-sm outline-none transition focus:border-brand-red focus:ring-0"
            >
              <option value="">All tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {filteredProjects.length ? (
        <div
          className={
            view === 'cards'
              ? 'mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
              : 'mt-6 grid gap-4'
          }
        >
          {filteredProjects.map((project) =>
            view === 'cards' ? (
              <ProjectCard key={project._id} project={project} />
            ) : (
              <ProjectRow key={project._id} project={project} />
            ),
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-brand-black/15 bg-brand-white/70 px-5 py-12 text-center">
          <p className="text-base font-semibold text-brand-black">
            No projects match your search.
          </p>
          <p className="mt-2 text-sm text-brand-black/55">
            Try a project name, partner, technology, or a different tag.
          </p>
        </div>
      )}
    </section>
  )
}
