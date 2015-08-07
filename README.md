# amd-noconflictify

[Browserify](http://browserify.org/) plugin for avoiding that libraries register themselves as AMD modules.

*Supports up to Browserify 10*

### What problem this plugin is trying to fix?

Once upon a time, when RequireJS was all the hype, and you were authoring a javascript library, it was common good practice to make your library register itself as an AMD module. Some example libraries are [jQuery](https://github.com/jquery/jquery/blob/master/src/exports/amd.js) or [JSON3](https://github.com/bestiejs/json3/blob/master/lib/json3.js#L907).

So what's the problem there? Isn't this a good practice?

The problem is when you want your code to use those AMD-auto-register-libraries but you want to have absolutely **zero** impact on the Javascript context of the page your code will live in. This is especially important when your code is inserted as a foreign script living inside your clients' pages.

In the precise case where those pages will expose an AMD module loader environment (like RequireJS), the AMD-auto-register-libraries you use inside your code will register themselves in the page's module environment. Thus affecting the Javascript page context, and depending on the pages, may go up to break things. That's annoying.


### How do this plugin fix the problem?

This plugin fixes it by disabling a possible detected AMD module loader environment before your bundle code execute. It does so by wrapping your bundle inside some "noConflict" code.

```js
(function(undefined) {
  if (typeof define === 'function' && define.amd) {
    var idzPreviousDefine = define;
    define = undefined;
  }

  // your code here

  if (idzPreviousDefine) {
    define = idzPreviousDefine;
  }
})();
```
