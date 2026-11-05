# Profile design and maintenance

This is a GitHub profile README, with an English landing page and a full French version.

## Design direction

- Brand green: `#173D36`, taken from the supplied symbol.
- Pale green surface: `#EDF5F2`; secondary text: `#49675E`.
- Dark diagram surface: `#173D36`; nodes: `#244F44`; focus: `#D5EDE4`.
- Blue `#397CAB` provides a secondary color in the repository chart.
- Segoe UI with Arial/sans-serif fallbacks; clear hierarchy and left-aligned prose.
- The header expresses a data engineer's work through connected source, transformation and delivery nodes.
- Original logo and portrait are included unchanged. Experience, education and certification details come from the current public portfolio. No artificial qualifications, achievements or proficiency scores have been added.
- Each full-width diagram has a separate mobile composition. Plain Markdown keeps the profile usable without custom CSS or scripts.

## Structure

```text
Brand banner + contact / language links
Introduction + supplied portrait
Professional experience: SOCOTEC, STM Group, Shiftbricks
Selected projects + PatentAnalysis architecture
Additional projects + document intelligence overview
Technical toolkit
Education and certification
Public repository snapshot
Contact
```

The project descriptions preserve the collaborative nature of PatentAnalysis and Student Management. The OCR and XTelecom projects link to their portfolio overviews rather than unverified repositories. The current portfolio supplies the dated experience and achievement figures; an older cached search result was not used for the career section.

## References reviewed

- [Anurag Hazra](https://github.com/anuraghazra/anuraghazra): a short introduction and emphasis on concrete work.
- [DenverCoder1](https://github.com/DenverCoder1/DenverCoder1): clear project and toolkit grouping, and careful interpretation of language statistics.
- [Brad Traversy](https://github.com/bradtraversy): discoverability through selected public repositories.

The visual identity and SVG diagrams were created for this profile; no third-party portfolio artwork or text was copied.

## Content sources

Reviewed on 2026-11-05:

- The previous local profile README (existing positioning, Kafka/Airflow/Docker, contact details).
- [Public GitHub profile](https://github.com/lokmane101) (Data and Cloud engineer, Lyon).
- [Personal portfolio](https://akkouhlokmane.netlify.app/) (fetched directly on 2026-11-05: experience, achievement figures, education, certification, RAG and document intelligence).
- [Databricks credential](https://credentials.databricks.com/4ef911d6-f5a3-43ed-bfc5-15ab97abac23) linked from that portfolio.
- README files of [PatentAnalysis](https://github.com/lokmane101/PatentAnalysis), [Laptop Price Prediction](https://github.com/lokmane101/laptop-price-prediction), [Tech News Platform](https://github.com/lokmane101/CI-CD-pipeline-application-on-azure-DevOps), [Exam Management](https://github.com/lokmane101/SpringBootExamManagamentApp), [Student Management](https://github.com/lokmane101/SchoolStudentManagementApp) and [SRCNN](https://github.com/lokmane101/SRCNN).

## Regenerate visuals

Node.js 22 or newer; no packages to install:

```sh
node scripts/build-brand.mjs
node scripts/update-repositories.mjs
```

The first command builds the branded headers and architecture diagrams. The second reads GitHub's public API and writes `assets/repositories.json` and four chart SVGs. It fetches all pages, excludes forks and the profile repository, and counts each repository once under its primary language. This is not a measure of experience or proficiency.

To rebuild charts from the saved snapshot without a network request:

```sh
node scripts/update-repositories.mjs --offline
```

The included GitHub Actions workflow runs on Mondays at 06:23 UTC or manually from the Actions tab. It uses the built-in repository token; no personal access token is required. It commits only generated chart assets. If the API fails, the existing committed visual remains available. Scheduled workflows depend on GitHub Actions being enabled and can be paused by GitHub on inactive public repositories.

The README has no dependency on public stats-card servers, visitor counters or remote icon services.
