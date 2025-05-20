---
date: 2025-04-19
---

# Do not default to object-oriented or message-passing

Object-oriented programming is good for some problems. Excellent even.

But OOP shouldn’t be used by default. Using OOP by default leads to inheriting (🥁) unnecessary complexity.

Use pure functions by default, mutating closures when you need the extra power, and then OOP when you need even more.

The same applies to message passing. Decoupling via message passing is amazing for some problems.

But I don’t think it should be the default. Both strong coupling and loose coupling are desirable: you want to set up your boundaries so the “right” things are coupled & decoupled.

What determines “right”? Well, that’s the art of programming.

But as a rule, default to statically analyzed, strongly typed, strongly coupled functions. Use the decoupling-enabled message passing for situations where that flexibility unlocks powerful patterns (e.g. I loved using it in Cocoa apps to connect a UI together).
