---
date: 2023-06-22
---

# How a WebAssembly module is like a Ruby class

## Instances ~= objects

## Functions ~= methods

## Globals ~= instance variables

Globals are variables that live at the top of a WebAssembly module. Any function can read or mutate them.

Globals can be mutable or readonly. They can also be exported or stay internal.

This is very similar to a Ruby class’s instance variable. Instance variables live 'at the top' of a Ruby object. Any method can read or mutate them.

Because of the similarity, I’ve used the same syntax for globals as Ruby uses for instance variables: `@global_name`.
