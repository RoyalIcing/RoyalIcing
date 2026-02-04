---
date: 2026-02-03T06:32:00Z
---

# Software is Made of Fickle Loops

You can use the lens of iterative loops to look at software development today. We continuously run tests in CI, we periodicly update dependencies, our web apps and loops turning HTTP requests into responses and events into UI changes.

What makes software development hard is that these are fickle: they are slow, noisy, and prone to failure.

## Code

| Loop                                                                          | Steps                                              | Fickleness                                                                                          | Dependencies/Notes                        |
| ----------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Code compilation is a fickle loop of source code into executable instructions | edit → compile → link → run                        | syntax errors, type errors, missing dependencies, configuration mistakes, language breaking changes |                                           |
| CI is a fickle loop of flaky tests on a remote machine                        | install → build → test → fail… → fix… → pass       | flaky tests, slow feedback, dependency drift                                                        |                                           |
| Dependencies are a fickle loop of independent code changes                    | new release → upgrade → fix breakages → git commit | transitive dependencies and ecosystem churn                                                         |                                           |
| Code review is a fickle loop of human opinions                                | pull request → review… → revise… → merge           | human delays, inconsistent standards, unclear feedback                                              | faster CI loops improve code review loops |
| Tech debt is a fickle loop of labor applied to a running software system      | add features → fix bugs → meet goals → hire staff  | changing requirements, staff turnover, lack of system understanding                                 | slows all other loops                     |

## Networks & storage

| Loop                                                                                    | Steps                                                         | Fickleness                                                                 | Dependencies/Notes                                               |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Databases are a loop of writes with durability guarantees and loops of consistent reads | connect → open → write → commit → replicate                   | network partitions, crashes, conflicts                                     |                                                                  |
| Web servers are a fickle loop of HTTP requests                                          | request → handle → cache → respond                            | timeouts, partial failure, server load, poor Wi-Fi or cellular connections | relies on TCP loops                                              |
| RPC is a fickle loop of requests over unreliable networks                               | request → timeout → retry/backoff → acknowledged success/fail | timeouts, network partitions, server overload                              |                                                                  |
| TCP is a fickle loop of packets over unreliable networks                                | send → ack/loss → retransmit/adjust                           | packet loss, network congestion, variable latency                          | reliability is produced via repetition and feedback, not assumed |

## Product & users

| Loop                                                                                     | Steps                                                                                        | Fickleness                                                                                                                                               | Dependencies/Notes                        |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Lean startup is a fickle loop of validating product-market fit                           | build → measure → learn                                                                       | misleading or lagging proxy metrics, shifting market conditions, changing user behavior, conflicting management incentives |                                           |
| Double-diamond is a fickle loop of exploring and narrowing problem/solution space        | discover → define → develop → deliver                                                         | noisy signals from research, feature creep, conflicting management incentives, shifting user behavior |                                           |
| User sessions are a fickle loop of authentication and engagement                         | login → interact → timeout/logout                                                            | forgotten passwords, session expirations, engagement drop-offs                                                                                           |                                           |
| Subscriptions are a fickle loop of billing and user retention                            | bill → renew/cancel → plan changes                                                           | payment failures, churn, pricing and plan changes                                                                                                        | billing state gates the user session loop |
| Enterprise contracts are a fickle loop of negotiations and renewals                      | negotiate → sign → deliver → renew                                                           | changing requirements, legal reviews, budget cycles                                                                                                      |                                           |
| Accessibility is a fickle loop of design constraints, legal requirements, and user needs | design → implement → test with users → verify compliance → revise                            | diverse user needs, evolving standards, limited testing resources, conflicting best practices                                                            |                                           |

## Trust

| Loop                                                          | Steps                                                                                      | Fickleness                                                                              | Dependencies/Notes |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------ |
| Security is a fickle loop of attack and defense               | zero-day/attack → detect → mitigate → patch → monitor                                      | adversarial inputs, supply chain risks, human error, complex systems                    |                    |
| Compliance is a fickle loop of interpreting laws and auditing | regulation changes → implement → audit → report                                            | evolving regulations, ambiguous laws, regional differences, more reporting requirements |                    |
| Privacy is a fickle loop of data collection and user consent  | collect data → anonymize parts → store/analyze → comply with requests & laws → delete data | changing regulations, data breaches, law enforcement requests, encryption               |                    |

---

## Our loops are getting more encumbered and fickle

- Browsers are more bloated and elaborate.
- Operating systems are more resource intensive and disrespecting of user control.
- Frameworks are larger in scope and have greater complexity over underlying distributed systems.
- Native apps tools are more fragmented and convoluted.
- Cloud infrastructure is more proprietary and less transparent.
- E2E testing has more permutations and more brittle.
- Users are less attentive and more price-sensitive.
- App Store review is more inconsistent and opaque and greedy.
- Key platforms are in loops of enshittification: built for the wants of shareholders not needs of users.

## Streamlining fickle loops

- DORA metrics: measure time to deploy, time to recovery, and change failure rate.
- SRE and SRO: objectively measure end user experience.
- Lean startup: focus on quickly delivering software that has been learned to meet user needs.
- Jepsen: inject faults to find breaks of durability and consistency guarantees.
- Observability platforms: provide visibility into user failure within their loops.
- Feature flags: enable safer deployments and gradual rollouts.
- Chaos engineering: proactively break subsystems to test overall system resilience.

Making successful software is to triumph over these fickle loops to successfully create value in the daily loops of users.

---

## Agentic coding as a new loop, and a loop lubricant

Where does AI coding fit in? Is it a new loop or does it accelerate existing loops? How might it benefit and where could it go wrong?

- Loop of using coding agents: prompt → generate → review → deploy
- Potential: faster iteration inside existing loops (CI, dependencies, review, security, testing, design).
- Risks: amplifying fickleness through over-reliance on generated code, loss of human oversight and understanding.
- Understanding all the loops present and sources of fickleness and their failure modes is as important as ever.
- Improve loops by understanding how they work and what they connect to in the real world, making them faster by removing friction, and make failure loud and unambiguous.
- Focus on loops where humans are involved with agency: user experience, security attackers, legal compliance.
- The loops haven’t disappeared, they are becoming more abstracted.
- Ideally remove unnecessary loops instead of adding more automated loops.
