# Dependency update and vulnerability workflow

This repository uses [Renovate](https://docs.renovatebot.com/) to keep dependency
updates and known vulnerabilities visible in a single GitHub issue.

## One-time GitHub setup

1. Install the [Mend Renovate GitHub App](https://github.com/apps/renovate) for
   this repository.
2. In **Settings > Advanced Security**, enable the dependency graph and
   Dependabot alerts.
3. Confirm that the Renovate App has read access to Dependabot alerts.
4. Leave Dependabot version updates and Dependabot security updates disabled.
   Renovate owns both PR types in this repository; enabling both tools would
   create duplicate update PRs. Dependabot alerts themselves must remain enabled.

Committing `renovate.json` to the default branch manually onboards the
repository. After the app's next run, Renovate creates an issue titled
**Dependency and Security Dashboard**.

## Approval flow

1. Renovate scans the root npm workspace, its nested `package.json` files, and
   `package-lock.json`.
2. Available upgrades appear as unchecked items in the dashboard's
   **Pending Approval** section.
3. OSV vulnerability findings are summarized in the dashboard. GitHub
   Dependabot alerts and OSV findings with available fixes also become pending
   security updates.
4. A maintainer approves one update by checking its dashboard checkbox.
5. On its next run, Renovate creates the branch and pull request for that
   approved update.
6. Review CI results and the upstream changelog before merging the PR.

Closing a Renovate PR without merging rejects that update. The dashboard keeps
the rejected update visible and provides a checkbox to recreate it later.

## Security behavior

Renovate normally bypasses dashboard approval for vulnerability-fix PRs. This
repository explicitly overrides that behavior with
`vulnerabilityAlerts.dependencyDashboardApproval: true`, so security fixes also
require a dashboard checkbox before a PR is created.

This provides one consistent approval gate, but it can delay remediation. The
dashboard should therefore be monitored regularly, and critical vulnerabilities
should be approved promptly.

The OSV dashboard integration is experimental and reports direct dependencies
only. GitHub's dependency graph and Dependabot alerts provide the additional
signal Renovate uses for vulnerable packages represented in the lockfile.
