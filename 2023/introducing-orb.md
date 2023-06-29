---
date: 2023-06-21
---

# Introducing Orb: a friendly Elixir DSL for writing WebAssembly 🕷️🕸️

HTML works on pretty much any computing device you buy today. JavaScript runs in the browser, on the server, at the edge, and on your mobile and laptop. I believe WebAssembly (also spun from the web) will follow their footsteps and become the new lingua franca.

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

  wasm U32 do
    func u32_to_hex_lower(
      value: I32,
      write_ptr: I32.I8.Pointer
    ), i: I32, digit: I32 do
      i = 8

      loop Digits do
        i = i - 1

        digit = rem(value, 16)
        value = value / 16

        if digit > 9 do
          write_ptr[byte_at!: i] = ?a + digit - 10
        else
          write_ptr[byte_at!: i] = ?0 + digit
        end

        Digits.continue(if: i > 0)
      end
    end
  end
end
```

We get a friendly syntax for math like `+` and `-`, conveniences to write bytes to memory, and `if` and `loop` statements. It feels like a lower-level Elixir or Ruby.

The above gets compiled into the following WebAssembly:

```wasm
(module $HexConversion
  (memory (export "memory") 1)
  (func $u32_to_hex_lower (export "u32_to_hex_lower") (param $value i32) (param $write_ptr i32)
    (local $i i32)
    (local $digit i32)
    (i32.const 8)
    (local.set $i)
    (loop $Digits
      (i32.sub (local.get $i) (i32.const 1))
      (local.set $i)
      (i32.rem_u (local.get $value) (i32.const 16))
      (local.set $digit)
      (i32.div_u (local.get $value) (i32.const 16))
      (local.set $value)
      (if (i32.gt_u (local.get $digit) (i32.const 9))
        (then
          (i32.store8 (i32.add (local.get $write_ptr) (local.get $i)) (i32.sub (i32.add (i32.const 97) (local.get $digit)) (i32.const 10)))
        )
        (else
          (i32.store8 (i32.add (local.get $write_ptr) (local.get $i)) (i32.add (i32.const 48) (local.get $digit)))
        )
      )
      (i32.gt_u (local.get $i) (i32.const 0))
      br_if $Digits
    )
  )
)
```

While I actually quite like the Lispy WebAssembly textual syntax, I’m sure you agree this feels quite different.

## Composable puzzle pieces

Writing software is a lot easier if you break a large problem into smaller bite-sized problems. Orb agrees, and lets you compose modules together.

```elixir
defmodule HTMLComponent do
  use Orb
  # Imports WebAssembly module with memory, bump allocator, and string joining.
  use Buffer

  I32.global value: 255

  wasm do
    # Import the u32_to_hex_lower function from the HexConversion module above.
    HexConversion.funcp(:u32_to_hex_lower)

    func set_number(value: I32) do
      @value = value
    end

    func to_html(), I32.String, hex: I32.I8.Pointer do
      hex = alloc(9)
      call(:u32_to_hex_lower, @value, hex)

      Buffer.join!([
        ~S"<p>255 in hex is ", hex, ~S".</p>"
      ])
    end
  end
end
```

These modules don’t have to be just ones you have written. Elixir comes with a great package manager called [Hex](https://hex.pm), and so anyone can publish a package there with a collection of Orb WebAssembly modules ready to compose.

## Macros

There are two stages to an Elixir module — compile time and run time. Orb uses compile time macros to allow an enhanced syntax.

Instead of writing:

```elixir
global_set(:magic_number, i32(42))
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
digit - 10 + ?a
```

Or instead of having to juggle and remember memory offsets to string constants:

```elixir
data(1234, "<!doctype html>\\00")

func content_type, I32 do
  1234
end
```

You write:

```elixir
func content_type, I32.String do
  ~S"<!doctype html>"
end
```

There’s more macros & helpers that I’m experimenting with, and not all of them will make it in. I want conveniences for common problems while avoiding too much magic.

## How do you use WebAssembly modules?

I’m writing guides on how to manage and run WebAssembly modules at [Calculated.World](https://calculated.world).

## Use Orb today

Orb is currently in alpha as I gather feedback working towards a beta and version 1. You can [read Orb’s documentation](https://hexdocs.pm/orb/) or ask me on [Twitter](http://twitter.com/royalicing/status/1651430346821623809) or [Mastodon]() if you have any questions or thoughts!

I’m also working on other pieces of the puzzle to make the WebAssembly ecosystem stronger, such as HTML Custom Elements for WebAssembly, and patterns for deploying these modules to the cloud.
