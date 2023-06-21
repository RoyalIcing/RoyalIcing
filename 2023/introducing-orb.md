---
date: 2023-06-21
---

# Introducing Orb: Write WebAssembly using Elixir

HTML works on pretty much any computing device you buy today. JavaScript runs in the browser, on the server, at the edge, and on your mobile and laptop. I believe WebAssembly will follow their footsteps and become the new lingua franca.

For the past few months I’ve been writing an Elixir library for authoring WebAssembly modules called **Orb**. You can think of it as DSL for WebAssembly’s syntax, with a few productivity enhancements added.

WebAssembly is low level. You work with integers and floats, can perform operations on them like adding or multiplication, and then read and write those values to a block of memory. There’s no concept of a “string” or an “array”, let alone a “hash map” or “HTTP request”.

That’s where a library like Orb can help out. It takes full advantage of Elixir’s language features by turning it into a compiler for WebAssembly. You can define WebAssembly modules in Elixir for “string” or “hash map”, and compose them together into a final module.

My aim is to take existing standards — like UTF-8, JSON, HTML, MIME, URL-encoding, multipart form data, HTTP 1 requests — and make those the interchange format between a WebAssembly module and your app’s code. We don’t need to reinvent the wheel, instead we can have some [lightweight conventions](https://calculated.world/conventions) that make use of webby formats that already exist.

## An example

Here is a module that converts a integer like `255` to `000000ff`. It accepts the integer value to format, and a “pointer” to write out to.

```elixir
defmodule HexConversion do
  use Orb

  wasm_memory pages: 1

  wasm do
    func u32_to_hex_lower(value: I32, write_to_address: I32.Pointer), nil, i: I32, digit: I32 do
      i = 8

      loop Digits do
        I32.u! do
          i = i - 1

          digit = rem(value, 16)
          value = value / 16

          if digit > 9 do
            memory32_8![write_to_address + i] = ?a + digit - 10
          else
            memory32_8![write_to_address + i] = ?0 + digit
          end

          Digits.continue(if: i > 0)
        end
      end
    end
  end
end
```

## How do you use WebAssembly modules?

Inherently given WebAssembly’s name, the natural target is the web. You can load and execute a module using the browser’s `WebAssembly.instantiateStreaming()` like so:

```js
const { instance } = await WebAssembly.instantiateStreaming(fetch("example.wasm"));
```

(The same works in Deno, which is what I host [Calculated.World](https://calculated.world/) using.)

In Next.js you can [import then instantiate the wasm module](https://nextjs.org/docs/messages/middleware-dynamic-wasm-compilation).

For other languages Wasmtime is well-supported library for [many languages](https://docs.wasmtime.dev/lang.html).

## Macros

There are two stages to an Elixir module — compile time and run time. Orb uses compile time macros to allow an enhanced syntax.

Instead of writing:

```elixir
i32(42)
global_set(:magic_number)
```

You write the easier-to-read, looks-like-Ruby:

```elixir
@magic_number = 42
```

Or instead of using the explicit math functions:

```elixir
I32.add(I32.sub(digit, 10), ?a)
```

You write the more natural:

```elixir
I32.u!(digit - 10 + ?a)
```

Or instead of having to juggle and remember memory offsets to string constants:

```elixir
data(1024, "<!doctype html>\\00")

func content_type, I32 do
  1024
end
```

You write:

```elixir
func content_type, I32 do
  ~S"<!doctype html>"
end
```

There’s more macros & helpers that I’m experimenting with, and not all of them will make it in. I want to add conveniences for common problems while avoiding having too much magic.

## Use it today

You can [read Orb’s documentation](https://hexdocs.pm/orb/) or ask me on [Twitter](http://twitter.com/royalicing/status/1651430346821623809) or [Mastodon]() if you have any questions or thoughts!

I’m also working on other pieces of the puzzle to make the WebAssembly ecosystem stronger, such as Wasm HTML Custom Elements, and patterns for deploying these modules to the cloud.
