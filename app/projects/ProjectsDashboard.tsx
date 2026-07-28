'use client'

import {useMemo, useState} from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Grid2X2,
  List,
  Search,
  Server,
  SlidersHorizontal,
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
    project.semester,
    ...(project.techStack || []),
    ...(project.tags || []),
    ...(project.highlights || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

type FilterGroupProps = {
  options: string[]
  selectedOptions: string[]
  onToggle: (option: string) => void
  searchTerm: string
  showAll: boolean
  onShowAll: () => void
}

function FilterGroup({
  options,
  selectedOptions,
  onToggle,
  searchTerm,
  showAll,
  onShowAll,
}: FilterGroupProps) {
  const matchingOptions = options.filter((option) =>
    normalize(option).includes(normalize(searchTerm)),
  )
  const visibleOptions = showAll || searchTerm ? matchingOptions : matchingOptions.slice(0, 12)

  if (!matchingOptions.length) {
    return <p className="text-sm text-brand-black/50">No matching options.</p>
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {visibleOptions.map((option) => {
          const isSelected = selectedOptions.includes(option)

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              aria-pressed={isSelected}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-red',
                isSelected
                  ? 'border-brand-red bg-brand-red text-brand-white'
                  : 'border-brand-black/15 bg-brand-white text-brand-black/70 hover:border-brand-red/40 hover:text-brand-red',
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
      {!showAll && !searchTerm && matchingOptions.length > visibleOptions.length ? (
        <button
          type="button"
          onClick={onShowAll}
          className="mt-4 text-sm font-semibold text-brand-red transition hover:text-brand-red-dark focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          Show all {matchingOptions.length}
        </button>
      ) : null}
    </>
  )
}

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
  const [selectedSemesters, setSelectedSemesters] = useState<string[]>([])
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [filterQuery, setFilterQuery] = useState('')
  const [activeFilterGroup, setActiveFilterGroup] = useState<'semester' | 'tech' | 'tags'>(
    'tags',
  )
  const [showAllFilterOptions, setShowAllFilterOptions] = useState(false)

  const toggleFilter = (
    value: string,
    selectedValues: string[],
    setSelectedValues: (values: string[]) => void,
  ) => {
    setSelectedValues(
      selectedValues.includes(value)
        ? selectedValues.filter((item) => item !== value)
        : [...selectedValues, value],
    )
  }

  const semesters = useMemo(
    () =>
      Array.from(
        new Set(
          projects
            .map((project) => project.semester)
            .filter((semester): semester is string => Boolean(semester)),
        ),
      ).sort((first, second) => second.localeCompare(first)),
    [projects],
  )

  const techStack = useMemo(
    () =>
      Array.from(new Set(projects.flatMap((project) => project.techStack || []))).sort(
        (first, second) => first.localeCompare(second),
      ),
    [projects],
  )

  const tags = useMemo(
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
      const matchesSemester =
        !selectedSemesters.length || selectedSemesters.includes(project.semester || '')
      const matchesTech =
        !selectedTech.length || selectedTech.some((tech) => project.techStack?.includes(tech))
      const matchesTags =
        !selectedTags.length || selectedTags.some((tag) => project.tags?.includes(tag))

      return matchesSearch && matchesSemester && matchesTech && matchesTags
    })
  }, [projects, query, selectedSemesters, selectedTags, selectedTech])

  const activeFilterCount = selectedSemesters.length + selectedTech.length + selectedTags.length
  const hasActiveFilters = activeFilterCount > 0

  const clearFilters = () => {
    setSelectedSemesters([])
    setSelectedTech([])
    setSelectedTags([])
  }

  const filterGroups = [
    {
      id: 'semester' as const,
      label: 'Semester',
      options: semesters,
      selectedOptions: selectedSemesters,
      onToggle: (semester: string) =>
        toggleFilter(semester, selectedSemesters, setSelectedSemesters),
    },
    {
      id: 'tech' as const,
      label: 'Tech stack',
      options: techStack,
      selectedOptions: selectedTech,
      onToggle: (tech: string) => toggleFilter(tech, selectedTech, setSelectedTech),
    },
    {
      id: 'tags' as const,
      label: 'Tags',
      options: tags,
      selectedOptions: selectedTags,
      onToggle: (tag: string) => toggleFilter(tag, selectedTags, setSelectedTags),
    },
  ].filter((group) => group.options.length)

  const currentFilterGroup =
    filterGroups.find((group) => group.id === activeFilterGroup) || filterGroups[0]

  return (
    <section className="rise-in rise-in-delay-2 mt-10">
      <div className="relative flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="flex w-fit items-center gap-2">
          {semesters.length || techStack.length || tags.length ? (
            <button
              type="button"
              onClick={() => {
                setFilterPanelOpen((isOpen) => !isOpen)
                setFilterQuery('')
                setShowAllFilterOptions(false)
              }}
              aria-expanded={filterPanelOpen}
              aria-controls="project-filters"
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-md border px-3 text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-red',
                filterPanelOpen || hasActiveFilters
                  ? 'border-brand-red bg-brand-red text-brand-white'
                  : 'border-brand-black/10 bg-brand-white/85 text-brand-black hover:border-brand-red/40 hover:text-brand-red',
              )}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Filters
              {activeFilterCount ? (
                <span className="rounded-full bg-brand-white/20 px-1.5 py-0.5 text-xs" aria-label={`${activeFilterCount} active filters`}>
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          ) : null}

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

        {filterPanelOpen ? (
          <div
            id="project-filters"
            className="absolute left-0 right-0 top-full z-10 mt-2 rounded-lg border border-brand-black/10 bg-brand-white p-5 shadow-xl sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-base font-semibold text-brand-black">Filter projects</p>
              <div className="flex items-center gap-4">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-brand-red transition hover:text-brand-red-dark focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                Clear filters
              </button>
            ) : null}
                <button
                  type="button"
                  onClick={() => setFilterPanelOpen(false)}
                  className="text-sm font-semibold text-brand-black/60 transition hover:text-brand-black focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  Done
                </button>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 border-b border-brand-black/10 pb-4">
              {filterGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => {
                    setActiveFilterGroup(group.id)
                    setFilterQuery('')
                    setShowAllFilterOptions(false)
                  }}
                  aria-pressed={activeFilterGroup === group.id}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-red',
                    activeFilterGroup === group.id
                      ? 'bg-brand-black text-brand-white'
                      : 'bg-brand-black/5 text-brand-black/60 hover:bg-brand-black/10 hover:text-brand-black',
                  )}
                >
                  {group.label}
                  {group.selectedOptions.length ? ` (${group.selectedOptions.length})` : ''}
                </button>
              ))}
            </div>
            <label className="relative mt-4 block">
              <span className="sr-only">Search filter options</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-black/40"
                aria-hidden
              />
              <input
                value={filterQuery}
                onChange={(event) => setFilterQuery(event.target.value)}
                placeholder={`Search ${currentFilterGroup?.label.toLowerCase() || 'filters'}`}
                className="h-11 w-full rounded-md border border-brand-black/10 bg-brand-white pl-10 pr-4 text-sm text-brand-black outline-none transition placeholder:text-brand-black/40 focus:border-brand-red focus:ring-0"
              />
            </label>
            <p className="mt-3 text-sm text-brand-black/55">
              Select multiple {currentFilterGroup?.label.toLowerCase()} to refine the project list.
            </p>
            <div className="mt-5 max-h-72 overflow-y-auto pr-1">
              {currentFilterGroup ? (
                <FilterGroup
                  options={currentFilterGroup.options}
                  selectedOptions={currentFilterGroup.selectedOptions}
                  searchTerm={filterQuery}
                  showAll={showAllFilterOptions}
                  onShowAll={() => setShowAllFilterOptions(true)}
                  onToggle={currentFilterGroup.onToggle}
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

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
