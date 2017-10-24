Have you ever wanted to program with the ease of assembly\*,
and the speed of a nested interpreter? Well now you can!

\* Comments aren't even support yet lol

`arm7.js` will show you the values in your registers as you
progress through the assembly (either by hand or with a speedy
500 ms delay between instructions) and will highlight the
current line it's interpreting.

All you need to do to get it to run is put the following tags
in your document (scripts at bottom btw):
* `<link rel="stylesheet" href="/link/to/emulator.css">`
* `<script src="/path/to/emulator.js"></script>`
* `<script src="/path/to/emulator.controls.js"></script>`
* `<script src="/path/to/emulator.parser.js"></script>`
* `<script src="/path/to/emulator.ops.js"></script>`

And then wrap your raw arm7 assembly code in a `<pre>` tag
with the id of `src`.

Currently supported:
1. Labels
2. Basic operations (mov, add, branching, conditional branching)
3. Quitting 

Unsupported operations:
1. Basically everything else

This is a perfect tool to write an arm7 virtual machine in!

examples:  
* [fib](//addonovan.github.io/arm7.js/web/examples/fib.html)


