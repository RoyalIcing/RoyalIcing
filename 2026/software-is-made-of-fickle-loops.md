---
date: 2026-02-03T06:32:00Z
---

# Software is Made of Fickle Loops

You can use the lens of iterative loops to look at software development today. We continuously run tests in CI, we periodicly update dependencies, our web apps and loops turning HTTP requests into responses and events into UI changes.

What makes software development hard is that these are fickle: they are slow, noisy, and prone to failure.

## Code

### Code compilation is a fickle loop of source code into executable instructions

- Loop: edit → compile → link → run
- Why it gets fickle: syntax errors, type errors, missing dependencies, configuration mistakes, language breaking changes.

### CI is a fickle loop of flaky tests on a remote machine

- Loop: install → build → test → fail… → fix… → pass
- Why it gets fickle: flaky tests, slow feedback, dependency drift.

### Dependencies are a fickle loop of independent code changes

- Loop: new release → upgrade → fix breakages → git commit
- Why it gets fickle: transitive dependencies and ecosystem churn.

### Code review is a fickle loop of human opinions

- Loop: pull request → review… → revise… → merge
- Why it gets fickle: human delays, inconsistent standards, unclear feedback.
- Dependency: faster CI loops improve code review loops.

### Tech debt is a fickle loop of labor applied to a running software system

- Loop: add features → fix bugs → meet goals → hire staff
- Why it gets fickle: changing requirements, staff turnover, lack of system understanding.
- Dependency: slows all other loops.

## Networks & storage

### Databases are a loop of writes with durability guarantees and loops of consistent reads

- Loop: connect → open → write → commit → replicate
- Why it gets fickle: network partitions, crashes, conflicts.

### Web servers are a fickle loop of HTTP requests

- Loop: request → handle → cache → respond
- Where fickleness appears: timeouts, partial failure, server load, poor Wi-Fi or cellular connections.
- Dependency: relies on TCP loops.

### RPC is a fickle loop of requests over unreliable networks

- Loop: request → timeout → retry/backoff → acknowledged success/fail
- Where fickleness appears: timeouts, network partitions, server overload.

### TCP is a loop of packets over unreliable networks

- Loop: send → ack/loss → retransmit/adjust
- Where fickleness appears: packet loss, network congestion, variable latency.
- Point: reliability is produced via repetition and feedback, not assumed.

## Product & users

### Iterative Design and Lean Startup are fickle loops of delivering valuable software

- Lean startup loop: build → measure → learn
- Double-diamond loop: discover → define → develop → deliver
- Why they get fickle: noisy signals, misleading or lagging proxy metrics, shifting market conditions, changing user behavior, conflicting management incentives, feature creep.

### User sessions are a fickle loop of authentication and engagement

- Loop: login → interact → timeout/logout
- Why it gets fickle: forgotten passwords, session expirations, engagement drop-offs.

### Subscriptions are a fickle loop of billing and user retention

- Loop: bill → renew/cancel → plan changes
- Why it gets fickle: payment failures, churn, pricing and plan changes.
- Dependency: billing state gates the user session loop.

### Enterprise contracts are a fickle loop of negotiations and renewals

- Loop: negotiate → sign → deliver → renew
- Why it gets fickle: changing requirements, legal reviews, budget cycles.

### Accessibility is a fickle loop of design constraints, legal requirements, and user needs

- Loop: design → implement → test with users → verify compliance → revise
- Why it gets fickle: diverse user needs, evolving standards, limited testing resources, conflicting best practices.

## Trust

### Security is a fickle loop of attack and defense

- Loop: zero-day/attack → detect → mitigate → patch → monitor
- Why it gets fickle: adversarial inputs, supply chain risks, human error, complex systems.

### Compliance is a fickle loop of interpreting laws and auditing

- Loop: regulation changes → implement → audit → report
- Why it gets fickle: evolving regulations, ambiguous laws, regional differences, more reporting requirements.

### Privacy is a fickle loop of data collection and user consent

- Loop: collect data → anonymize parts → store/analyze → comply with requests & laws → delete data
- Why it gets fickle: changing regulations, data breaches, law enforcement requests, encryption.

⸻

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
