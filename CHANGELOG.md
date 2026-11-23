## Unreleased

### Features

- add words.json with 500 words per category ([`93688ff`](https://github.com/YewTreeWeb/hangman/commit/93688ff64aded516a8f13bbbf925da8dc3e77a26)) by Mathew Teague

  19 categories, each with 500 lowercase single-word entries and a hint.

- add a confirm, countdown and result dialog for the Bomb power ([`27877d0`](https://github.com/YewTreeWeb/hangman/commit/27877d08632d7af10ef9a0cd9804698463a36148)) by Mathew Teague

  - Clicking Bomb opens a dialog explaining the 50/50 chance, with the win
    and lose outcomes side by side and Cancel/Accept buttons
  - Cancel frees the power and returns the bomb to the held powers
  - Accept counts down 3... 2... 1... and the bomb explodes at 0,
    showing whether the player won or lost
  - A lost bomb sets lives to 0 and loses the round; the lost dialog then
    reads Game Over. Only a super shield saves the player
  - The bomb rolls 50/50 on every difficulty
  - Fix "loosing" in the Bomb description

  ci: update the changelog on every push

  - Run the changelog workflow on pushes to any branch, one run per branch
  - Stage CHANGELOG.md before checking for changes; git diff ignored the
    untracked file, so the first changelog was never committed

- add the Bomb power and move round settlement into utils ([`567d6b0`](https://github.com/YewTreeWeb/hangman/commit/567d6b0989d614dac6be932d9d57af713fed06e2)) by Mathew Teague

  - Bomb: a 50/50 roll that either wins the round with the word's points
    plus 1000, without raising the streak, or ends the game unless a
    super shield is up
  - Magic Star wins through revealWord with the word's points and +50
    streak
  - settleWin, settleLoss and revealWord live in lib/utils and read the
    store when called, so powers and guessing share them
  - earned moves to the user store so the win dialog shows the right
    points for every kind of win
  - usePowers no longer takes a revealWord callback
  - Add utils tests for settling wins, losses and reveals

- add Magic Star power and weighted Feeling Lucky rolls ([`9fc8b00`](https://github.com/YewTreeWeb/hangman/commit/9fc8b00e775fc61d88420e441e62e701a286a508)) by Mathew Teague

  Magic Star (easy only) reveals the word, wins the round, boosts streak
  and unlocks powers. Special powers take an optional weight so rare
  powers roll less often. Easy rolls cost 250.

- add revival restore dialog and active button state ([`efb71f5`](https://github.com/YewTreeWeb/hangman/commit/efb71f5d9cec67aaf0082a66010e236119fcbb22)) by Mathew Teague

  - Fix unlocked powers staying disabled (respect local unlock state)
  - Add activeBtn prop to Button with per-variant active styles
  - Add Revival dialog to pick and restore a used power
  - Show failed-power / poisoned dialog when a special power backfires
  - Delay Skip so the used state shows before the next word loads
  - Keep activePowers across rounds; move streak next to score
  - Hide zapped letters from the keyboard

- add special powers and Feeling Lucky dice roll ([`8805acb`](https://github.com/YewTreeWeb/hangman/commit/8805acb29a96ee92172381adcf8e4a1a7553f08f)) by Mathew Teague

  Move the power list into lib/powerList.tsx and add special powers
  (potions, revival, super zap, super shield, Bernard's Watch) won by
  rolling the dice in the Feeling Lucky dialog. Won powers stack, except
  on executioner where only one can be held at a time; executioner rolls
  cost 1000 pts and never miss. Also adds lockable powers, zap, reveal,
  shield feedback, and an endGame helper for the death screen.

- wire up power activation, round results and auto-advance ([`cfcb933`](https://github.com/YewTreeWeb/hangman/commit/cfcb9333a23d1cf688252e5261278a19897097de)) by Mathew Teague

  Powers now render as buttons that record use in the user store and run
  an onUse callback (clue, shield, skip). Guessing tracks losses, streak
  multiplier and lives, and finished rounds auto-load the next word with
  a spinner.

- restyle home page with Inter font and Font Awesome icons ([`b42108c`](https://github.com/YewTreeWeb/hangman/commit/b42108c4a84e5f75c5293ecf444170e21f2469cc)) by Mathew Teague

  Add Inter as the default sans font and Font Awesome for icons. Restyle
  difficulty levels and category picks with active states, and centre
  the separators between difficulty details using flex instead of
  absolute positioning.

- swap power hover cards for tooltips and match lowercase guesses ([`c0348dc`](https://github.com/YewTreeWeb/hangman/commit/c0348dc2d301a3a6ae66e7efc60a4427e4b89531)) by Mathew Teague
- add hangman drawing and letter guessing ([`e89dddf`](https://github.com/YewTreeWeb/hangman/commit/e89dddfe3410286180fc4b6b97f61a12fe19e5b0)) by Mathew Teague

  Render the hangman drawing from wrong guesses, handle keyboard and
  on-screen letter input, and move round reset into a shared resetGame
  helper. Drop the redundant wrongLetters/correctLetters/wrongGuesses
  round fields in favour of deriving them from guessedLetters.

- added hint ([`0286122`](https://github.com/YewTreeWeb/hangman/commit/0286122d656b3d121185073ef087c9247e55219f)) by Mathew Teague
- render game word from store with lowercase difficulty keys ([`3014a30`](https://github.com/YewTreeWeb/hangman/commit/3014a302e737c5038d871d3877a3d59af3f78e21)) by Mathew Teague

  - Add LevelKey (Lowercase<LevelTypes>) and key levelOptions, wordLengths
    and wordScores by it, removing the casts that let "Easy" index a
    lowercase table and crash GamePage
  - Pick the word once on Play and store it in round instead of calling
    getWord on every render
  - Bump persist version to 2 and drop v1 state holding capitalised levels
  - Build game page keyboard, word display, Feeling Lucky and stats
  - Move streak to the user store and remove the voice setting

- add words.json with 300 words and hints per category ([`a0bcfe1`](https://github.com/YewTreeWeb/hangman/commit/a0bcfe1ec27318a8c57b7b9e51731813013ecfe0)) by Mathew Teague
- split game page into HeaderMenu and Powers components ([`d145275`](https://github.com/YewTreeWeb/hangman/commit/d1452750fbf560d4723c52725f1adb7ea1fa181e)) by Mathew Teague

  Extract the header menubar and power cards from GamePage into their own
  components, move PowerTypes into shared types, add dialog and tooltip UI
  primitives, and expand the game store with match, round, record and user
  state persisted via partialize.

- added powers ([`a1cd486`](https://github.com/YewTreeWeb/hangman/commit/a1cd486a1efcd02ee0cb1dda32ed8553316e5b73)) by Mathew Teague
- created game page ([`15d1fc6`](https://github.com/YewTreeWeb/hangman/commit/15d1fc6a9063aeee555547addaaf24412d4aa88d)) by Mathew Teague

  feat: added page folder
  refactor: moved content from app into page
  feat: added commit lint

- added page folder
refactor: moved content from app into page
feat: added commit lint ([`15d1fc6`](https://github.com/YewTreeWeb/hangman/commit/15d1fc6a9063aeee555547addaaf24412d4aa88d)) by Mathew Teague
- created home layout ([`ffc1295`](https://github.com/YewTreeWeb/hangman/commit/ffc129583de4dea01afd604825ab82d1ea50aa89)) by Mathew Teague

  feat: added zustand set values
  feat: imported shadcn components

- added zustand set values
feat: imported shadcn components ([`ffc1295`](https://github.com/YewTreeWeb/hangman/commit/ffc129583de4dea01afd604825ab82d1ea50aa89)) by Mathew Teague

### Bug Fixes

- remove the empty image from difficulty levels ([`c178d2a`](https://github.com/YewTreeWeb/hangman/commit/c178d2a2d6769ef5e71c6a3a53ffd7aba88d75d5)) by Mathew Teague

  An <img> with no src or alt rendered a broken, unlabelled image in each
  level card. Drop it and the empty ItemMedia, move the powers label into a
  helper, and test the card.

- let the Feeling Lucky dialog close from its X button and Escape ([`33c6313`](https://github.com/YewTreeWeb/hangman/commit/33c63136957744bff9515cd334ddaf971ced3ed8)) by Mathew Teague

  The dialog was controlled through open without onOpenChange, so Radix
  could not close it. Close it the same way as the Close button, except
  while a roll is in progress. Test rolling, blocked rolls and closing.

- multiply the word's points by the streak, not the whole score ([`b36c584`](https://github.com/YewTreeWeb/hangman/commit/b36c584c32cdff89d989169b582ce1094848f066)) by Mathew Teague

  A win with a streak above 1 set the score to (score + points) * streak,
  so the total grew with every win instead of adding the round's points.
  The win dialog also recomputed the points from the already-incremented
  streak, showing a different number from the one scored.

  - Add roundPoints and store the points earned when the round is won, so
    the dialog shows what was actually added
  - Magic Star wins show 0 points, since they add streak but no score
  - Narrow wordPoints to a non-null LevelKey and drop its null check
  - Test wordPoints and roundPoints

- free used powers through the store in cancelPower ([`06f27b3`](https://github.com/YewTreeWeb/hangman/commit/06f27b3719102ec037c2216f3bcaa0af8bf31e82)) by Mathew Teague

  cancelPower spliced the store's activePowers array in place, so the
  store never saw the change and the power button stayed disabled. With a
  power missing from the list, indexOf returned -1 and splice removed the
  last power instead. Remove one occurrence via setActivePowers and skip
  unknown names.

- clear oxlint warnings and unused code ([`6e38cfe`](https://github.com/YewTreeWeb/hangman/commit/6e38cfebfa7535a2bd900039b73966261acda8c0)) by Mathew Teague

  - Drop the unused state argument from nine store setters
  - Remove the unused difficulty read in DifficultyLevel
  - Delete card, item and menubar components that nothing imports, and the
    imports only they used
  - Delete APITester and the shadcn components only it used, and remove
    @radix-ui/react-label and @radix-ui/react-select
  - Restore @oxlint/plugins: fallow ignores the vendored plugin, so the
    pre-commit fallow fix dropped it as unused in 41d8d1a. Add it to
    ignoreDependencies so that cannot recur
  - Make build.ts a fallow entry; src/index.ts is already detected
  - Refresh the fallow baselines (dead code is now clear) and point fallow
    audit at them so the gate only fails on new findings

- make LevelKey non-null and pass difficulty to GamePage ([`7825d77`](https://github.com/YewTreeWeb/hangman/commit/7825d776cf163af3fb278bf51e9b08629e9760d9)) by Mathew Teague

  LevelKey included null, which broke every Record<LevelKey, ...> and
  hid whether a level had been picked. It is now the four levels only;
  callers that allow no selection already spell out LevelKey | null.

  - App renders GamePage only when a difficulty is set and passes it as a
    prop, so GamePage no longer handles a null difficulty
  - Type the store's match as non-null; it is never cleared, and the
    nullable type made setMatch's merged result partial

  Fixes all 6 bun check errors.

- resolve anti-slop type assertion and typeof errors ([`959354b`](https://github.com/YewTreeWeb/hangman/commit/959354bdeaabca9f47e14945b23057084f6079cd)) by Mathew Teague

  - Add SAFETY comments stating the invariant behind each type assertion
  - Hoist the levelOptions key cast in HomePage into a named const so the
    comment can sit on its statement
  - Replace the typeof check in DifficultyLevel with a direct comparison
    on the powers value, dropping the numPowers fallback

  frontend.tsx, utils.ts and HomePage.tsx also carry their
  require-readable-spacing blank lines, which could not be committed
  separately while those files still failed the pre-commit lint.

- implement setUnlockPowers in game store ([`5e80055`](https://github.com/YewTreeWeb/hangman/commit/5e800553b8d46d79b1a485072bd6dda276c336c7)) by Mathew Teague
- reset unlocked powers when returning home ([`bafc49a`](https://github.com/YewTreeWeb/hangman/commit/bafc49a94d8bdd0deaea1db5f4320e4422ea5252)) by Mathew Teague
- let either shield prevent life loss ([`30b79b7`](https://github.com/YewTreeWeb/hangman/commit/30b79b78a7ce2e36d24cc59fd1743b87b8e6f657)) by Mathew Teague
- rewrite word hints that leak the answer or state wrong facts ([`967a2c7`](https://github.com/YewTreeWeb/hangman/commit/967a2c786f08bb023c0c44c51d1e6c3f27ca7d91)) by Mathew Teague

### Refactoring

- rename the usePowers revival handler to reviveUsedPower ([`49a5c02`](https://github.com/YewTreeWeb/hangman/commit/49a5c0213682a0a8413e6a9e407deee751f15437)) by Mathew Teague
- restore the restorePower state name in RevivalDialog ([`1dba1d6`](https://github.com/YewTreeWeb/hangman/commit/1dba1d652a0c21b82392f98fcd6a1fefd4bfa56e)) by Mathew Teague
- restore original names lost in the GamePage refactor ([`cca9c82`](https://github.com/YewTreeWeb/hangman/commit/cca9c823e512225055f5960a52e1cd86fd151639)) by Mathew Teague

  misfires, endRound, releasePower, zap, guess and KEYBOARD_ROWS go back
  to sideEffect, resetPowers, cancelPower, zappedLetters, guessedLetter
  and kbdKeys.

- rename held special powers in PowerBar to ownedSpecialPowers ([`4fbfd55`](https://github.com/YewTreeWeb/hangman/commit/4fbfd557961383cc159aec2b10ffdff9304cf8ac)) by Mathew Teague
- split GamePage into board components and a usePowers hook ([`a2fd6fd`](https://github.com/YewTreeWeb/hangman/commit/a2fd6fd62701ae821f459986396eb93aee8ff898)) by Mathew Teague

  - gameBoard.tsx holds the stats, word display, keyboard and power bar
  - usePowers owns power state and effects; useRiskyPowers covers the
    potions and Revival that can backfire on hard levels
  - releasePower in the user store frees one use of a power
  - useGuess splits win and loss settlement out of guess
  - pickZapped in lib/guess picks the letters the Zap powers remove
  - GamePage drops from 384 to about 150 lines
  - Test the board components, usePowers, useGuess, the round timers and
    GamePage rounds, clue and shield

- split the unlock badge out of Powers ([`86c8a74`](https://github.com/YewTreeWeb/hangman/commit/86c8a74c6d97f6edb27e0f6b60c47d3f01aa1e59)) by Mathew Teague

  - UnlockBadge owns the score check and spending the unlock cost
  - Remove a leftover console.log on every power click
  - Test using, multi-use, inactive, locked and unlocking powers

- table-drive the power list and read power state live ([`144f84f`](https://github.com/YewTreeWeb/hangman/commit/144f84f601259c6197630023654fca4b410a4739)) by Mathew Teague

  - Unlock costs per power and level live in one table; getPowers and
    getSpecialPowers build entries from small power and lockable helpers
  - powerList read lives, activePowers and unlockPowers from the store once
    at module load, so potions, Revival and the Magic Star unlock never saw
    later changes. GamePage now passes the current values in
  - Fix "loosing" in the Super Shield description
  - Test unlock costs, Magic Star unlocking and live special-power state

- move GamePage dialogs into gameDialogs.tsx ([`4c9c567`](https://github.com/YewTreeWeb/hangman/commit/4c9c5673fe95d56afa7bcaa4e04a625d0845e3e2)) by Mathew Teague

  - Round lost, round won, reveal, shield, revival and failed-power
    dialogs are now components; GamePage passes state and callbacks
  - RevivalDialog owns the selected power instead of GamePage
  - Fix the reveal dialog's keys, which sat on children of keyless
    fragments, and its ordinals (2nd and 3rd, not 2th and 3th)
  - Fix "loose a life" and "It's affects" in the failed-power text

- move guessing and round scoring into useGuess ([`e804f56`](https://github.com/YewTreeWeb/hangman/commit/e804f56fd61ef8aa5f948c080dab2677000dd15e)) by Mathew Teague

  - useGuess owns letter input, the keypress listener and the score,
    streak, lives and round-count updates when a round ends
  - lib/guess.ts holds the pure win/loss rules, with tests
  - The win and loss dialogs now open from round.status instead of
    separate success/failed flags that could drift from it
  - The keypress listener is added once; useEffectEvent reads the latest
    round instead of re-subscribing on every render
  - Reveal now picks a letter through guess, so revealing the last
    letter wins the round instead of leaving it stuck in progress
  - Magic Star wins through revealWord

- extract the Feeling Lucky dialog from GamePage ([`7d3ba72`](https://github.com/YewTreeWeb/hangman/commit/7d3ba72e577504dc154feba3b23fd0baab8ba46c)) by Mathew Teague

  - FeelingLucky owns the dialog, rolling and result state; GamePage keeps
    the won powers and passes rollBlocked and an onWin callback
  - Move the roll cost and weighted roll into lib/feelingLucky.ts as pure
    functions, with the first bun tests covering them
  - Drop the cleanup closeFeelingLucky returned to onClick, which React
    never called
  - Run bun test in CI and list it in AGENTS.md

- move GamePage round timers into hooks ([`55a3158`](https://github.com/YewTreeWeb/hangman/commit/55a31582a4e47b930c4f5c8df668a1ff4814d2fd)) by Mathew Teague

  - useAutoAdvance owns the loading flag and loads the next word 4s after a
    round ends; useEffectEvent lets it call the latest callback without
    restarting the timers
  - useAutoClose hides the shield popup after 3s

- store words in lowercase ([`8d5b79c`](https://github.com/YewTreeWeb/hangman/commit/8d5b79c300a5838e358e1c2b2a3118c458ff7ca0)) by Mathew Teague

### Documentation

- trim comments that restate the code ([`78fd6a1`](https://github.com/YewTreeWeb/hangman/commit/78fd6a1a3b1b6e1a27a4bf9e614c0c9668168615)) by Mathew Teague

  - Shorten the frontend.tsx header to one line
  - Drop @param/@returns echoes from getWord and wordPoints; document the
    getWord length fallback and the wordPoints scoring formula instead
  - Remove the endGame block and the hmr comment, which narrated the code


### Styling

- add blank lines required by require-readable-spacing ([`124b722`](https://github.com/YewTreeWeb/hangman/commit/124b722df0da35fa6731111f523bc636e1631718)) by Mathew Teague

  Apply oxlint --fix for the anti-slop require-readable-spacing rule.
  Whitespace only; no code changes.

- adding style ([`0286122`](https://github.com/YewTreeWeb/hangman/commit/0286122d656b3d121185073ef087c9247e55219f)) by Mathew Teague

  feat: added hint


### Tests

- add component tests and fix invalid dialog markup ([`fccbb98`](https://github.com/YewTreeWeb/hangman/commit/fccbb9834ebf2edec8dc37a480b58355edaffb6f)) by Mathew Teague

  - Set up happy-dom and React Testing Library, preloaded from bunfig.toml
  - Test the round, reveal, revival, shield and failed-power dialogs
  - The reveal and revival dialogs nested div, p, hr and buttons inside
    DialogDescription, which renders a <p>; React warned about invalid HTML.
    Their header text is now the description and the body is a div


### Build

- **lint**: add oxlint with the vendored anti-slop plugin ([`41d8d1a`](https://github.com/YewTreeWeb/hangman/commit/41d8d1a71fc9e2e22feab329c311f9f630a8190b)) by Mathew Teague

  Vendor dmmulroy/anti-slop at 13909c9 into tools/oxlint/anti-slop and
  enable all 18 generic rules plus oxc/no-accumulating-spread as errors.
  Effect rules stay off because the project does not depend on effect.

  - Pin @oxlint/plugins to 1.94.0 to match oxlint
  - Add oxlint and fallow dev dependencies and run both from lint-staged
  - Ignore agent tooling directories and the vendored plugin in oxlint
  - Exclude the vendored plugin from tsconfig and bun fmt so it stays
    byte-identical to upstream


### CI

- pass fallow baselines only to full runs ([`090433f`](https://github.com/YewTreeWeb/hangman/commit/090433f3724cd8a1de06ac87fdce9836904bf39b)) by Mathew Teague

  fallow audit rejects the generic baseline inputs and already reads its
  baselines from .fallowrc.json, so the pull request job failed.

- update the changelog on every push ([`27877d0`](https://github.com/YewTreeWeb/hangman/commit/27877d08632d7af10ef9a0cd9804698463a36148)) by Mathew Teague
- run checks on pushes to every branch ([`6b2c86d`](https://github.com/YewTreeWeb/hangman/commit/6b2c86d43a1324a1ed775fb3944501e99469f749)) by Mathew Teague
- fetch lockfile tarballs from npm instead of the LAN mirror ([`46b281f`](https://github.com/YewTreeWeb/hangman/commit/46b281f4ff4ebd707d7e10cac9c449f2748dcecf)) by Mathew Teague

  bun.lock records tarball URLs from the LAN-only Verdaccio registry, which
  GitHub runners cannot reach. Rewrite them to registry.npmjs.org before a
  frozen install; Verdaccio proxies npm, so integrity hashes still match.

- add check, fallow and changelog workflows ([`031b806`](https://github.com/YewTreeWeb/hangman/commit/031b806d928d579fa8a19b3a5c7d2bba0755b89e)) by Mathew Teague

  - check: oxlint, bun check and build on bun
  - fallow: audit changed code on pull requests, full analysis against the
    saved baselines on pushes to main
  - changelog: regenerate CHANGELOG.md with commitizen on pushes to main


### Chores

- **fallow**: prune health baseline entries the refactor cleared ([`d9d4193`](https://github.com/YewTreeWeb/hangman/commit/d9d4193af364dc57766e33e39ea15d26e4c00ede)) by Mathew Teague
- **fallow**: prune health baseline entries the refactor cleared ([`4f09412`](https://github.com/YewTreeWeb/hangman/commit/4f09412ea65bfaaf571a6467d54261d3788b553e)) by Mathew Teague
- untrack the stale words-json worktree and ignore local Claude state ([`71d360f`](https://github.com/YewTreeWeb/hangman/commit/71d360f3762cfa06cbcdd12f9a5d1aa4ce2da736)) by Mathew Teague

  .claude/worktrees/words-json was committed as a gitlink to a worktree that
  no longer exists. Ignore Claude Code worktrees and the headroom marker,
  which holds a per-machine PID and port.

- add project-local rtk filter file ([`ea7abd7`](https://github.com/YewTreeWeb/hangman/commit/ea7abd7b71ca9e98ae4daa21ed16e2a4b18f8998)) by Mathew Teague
- **release**: configure commitizen with a detailed changelog ([`5d0d904`](https://github.com/YewTreeWeb/hangman/commit/5d0d9047f85d375e8cf42dd02a371f38b6561365)) by Mathew Teague

  - Parse every conventional commit type and capture the full commit body
  - Map types to readable section names and fix change_type_order, which
    sorts on the mapped names
  - Add the .cz/CHANGELOG.md.j2 template: scope, breaking marker, linked
    short hash, author, merge marker, indented commit body and GitHub
    compare links between versions

- **fallow**: configure fallow and wire it into Claude Code ([`98fcab5`](https://github.com/YewTreeWeb/hangman/commit/98fcab52924d02e3788eb0310e2aa5c7db172e3d)) by Mathew Teague

  - Add .fallowrc.json with the recommended entry points, ignoring the
    vendored anti-slop plugin
  - Save baselines for the existing backlog (24 dead-code, 10 health
    findings) so whole-project runs only fail on new findings
  - Run fallow agent install for Claude Code: AGENTS.md task map imported
    from CLAUDE.md, fallow skills, the fallow MCP server and a PreToolUse
    gate that blocks commits and pushes when fallow audit fails
  - Fill in the AGENTS.md commands for bun and note the vendored plugin
  - Drop the duplicate RTK instructions block from CLAUDE.md; the global
    config already loads them

