# Contributing

Planning to contribute to a [Choco](https://choco.com/) Open Source project?

Awesome! Contributions are welcome.

Our projects are released under the [Apache 2.0 License](/LICENSE.md), and original creations contributed to this repo are accepted under the same license.

## Types of Contributions

### Report bugs, suggest features or submit feedback

Please use issues for bugs, suggestions or feedback.

### PRs

Feel free to send us PRs fixing bugs or adding features. We'll try and review them as soon as possible.

If you're looking for something to work on check out GitHub issues for the following tags: _bugs_, _good first issues_ or _help wanted_.

## Developer Certificate of Origin

Choco uses a [Developers Certificate of Origin (DCO)](https://developercertificate.org/), a lightweight way for developers to certify that they wrote or otherwise have the right to submit code or documentation to a project.

To certify the code you submit to the repository you'll need to add a `Signed-off-by` line to your commits.

`$ git commit -s -m 'Awesome commit message'`

Which will look something like the following in the repo;

```
Awesome commit message

Signed-off-by: Ludwig Wittgenstein <ludwig.wittgenstein@cambridge.edu.uk>
```

- In case you forgot to add it to the most recent commit, use `git commit --amend --signoff`
- In case you forgot to add it to the last N commits in your branch, use `git rebase --signoff HEAD~N` and replace N with the number of new commits you created in your branch.
- If you have a very deep branch with a lot of commits, run `git rebase -i --signoff $(git merge-base -a master HEAD)`, double check to make sense of the commits (keep all lines as `pick`) and save and close the editor. This should bulk sign all the commits in your PR. Do be careful though. If you have a complex flow with a lot of branching and re-merging of work branches and stuff, merge-base may not be the right solution for you.

Note: If you have already pushed your branch to a remote, you might have to force push: `git push -f` after the rebase.

### Using GitHub Desktop?

If you are using the GitHub Desktop client, you need to manually add the `Signed-off-by` line to the Description field on the Changes tab before committing:

```
Awesome description (commit message)

Signed-off-by: Jane Smith <jane.smith@example.com>
```

In case you forgot to add the line to your most recent commit, you can amend the commit message from the History tab before pushing your branch (GitHub Desktop 2.9 or later).

## Code of Conduct

This project follows the [Choco's Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to honor this code.
