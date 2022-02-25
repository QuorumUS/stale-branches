import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {BranchResponse} from '../types/branches'
import styles from 'ansi-styles'

export async function getBranches(): Promise<BranchResponse[]> {
  let branches: BranchResponse[]
  try {
    const branchResponse = await github.paginate(
      github.rest.repos.listBranches,
      {
        owner,
        repo,
        protected: false,
        per_page: 100
      },
      response => response.data.map(branch => ({branchName: branch.name, commmitSha: branch.commit.sha} as BranchResponse))
    )
    branches = branchResponse

    core.info(`[${styles.magenta.open}${branches.length}${styles.magenta.close}] branches found.`)
    assert.ok(branches, 'Response cannot be empty.')
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(`Failed to retrieve branches for ${repo}. Error: ${err.message}`)
    }
    core.setFailed(`Failed to retrieve branches for ${repo}.`)
    branches = [{branchName: '', commmitSha: ''}]
  }

  return branches
}
