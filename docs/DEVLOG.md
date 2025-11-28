
# dev log

Notes and tasks (in lieu of a task management system). The format is roughly reverse-chronological by date.

## [11/28/2025]

### Structuring HTML

MDN article on structuring HTML documents: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents

## [09/27/2025]

### Windows 98 icons

I have some icons in the previous project [ezd-web-rc0](https://github.com/EagleLizard/ezd-web-rc0), but I don't know where I got them.

I found this site with icons: https://win98icons.alexmeub.com/

And then there's also 98.css, a good resource & inspiration, but lacking most icons: https://github.com/jdan/98.css

## [09/12/2025]

### 1 - Plain CSS

Using plain CSS is a bit painful in VSCode and Vite.

In VSCode, for example, renaming a shared variable isn't supported across css files. Subsequent references to the css variable fail without error in the bundler and browser, which can make it tricky to see if I've broken anything.

```css
/* ./shared.css */
:root {
  --my-var-renamed: #fff;
}

/* ./my-component.css */
@import "./shared.css";

.my-component {
  color: var(--my-var-original);
}
```

In Vite, when running the build, it is not clear what order the the deduplication of `@import` statements in the stylesheet will happen via PostCSS. This results in situations where a variable may used before it's declared. I'm not sure if this is an error or not, but it seems like it doesn't fit into the cascading part of CSS. It also included the `:root` variable declarations in the 2 files it generated in my case.

I may switch to Sass, even just for the intellisense & compile-time error checks.

#### What I don't love about Sass:

They've made breaking changes to their API, like with the deprecation of `@import` to `@use`; this is not inherently a problem, as I understand that things change and this is bound to happen for long-term project.

There are a few main things about how this deprecation was managed that don't give me high-confidence in the tool or maintainers long-term:

1. Incremental migration was not possible.
    1. This means that you had to update _all `.scss` files at once_. This was hard for big projects.
1. The team did not provide a good migration guide
    1. The only readily available documentation I could find only contained recommendations for using their _codemod cli tooling_ to migrate Sass projects.

Incremental migration nice to have, but I understand that it is a herculean effort and requires a lot of language investment. Typescript was able to provide this, however Typescript had a world-leading language expert and a dedicated team of engineers to support this. Microsoft and the TS team also had a clear incentive for adoption.

The bigger issue to me is the complete lack of effort in providing guidance on migrating _manually without a codemod_. I personally had to migrate relatively large repositories where the bundler had it's own Sass bundling path definitions; the cli codemods simply _did not work for many files_, and I had to figure out through trial and error how to fill in the missing gaps.


## [09/10/2025]

### 1 - ui components (cont.)

I've decided to create my own components on an as-needed basis. For what I need, it's not very complicated. I'm going to keep MUI in the codebase, mostly for reference.

I am concerned with overcomplicating things. To avoid this, I will be doing the following:

* Only create components as I use them
* Wrap base components, e.g. `input`, in React components, and only implement APIs that I use.
*  Only expose parts of the interface in my components that I use, and avoid spreading all `...restProps` to the underlying HTML input.

Some items I don't have solutions for right now: popovers, modals, select lists, search inputs, icon buttons.

These are bridges to cross when I get to them.

## [09/08/2025]

### 1 - ui component libraries

My go-to ui component library for React has been Material UI or MUI for years. Setting it up this time, I found it feels quite outdated. In an unfortunate development, the unstyled MUI codebase, MUI-Base, has been deprecated and its successor has been in alpha/beta for a very long time.

I'm inclined to still use it because it solves many problems I don't want to worry about rolling myself. I've looked at some alternatives like `shadcn`.

`shadcn` depends on tailwind css, and thus is a hard no for me. I don't like tailwind.

I saw some recommendations for [chakra-ui](https://chakra-ui.com/docs/), which looks promising.

Conclusion: I may use MUI for now and try to use as little of the API as possible in case I want to switch. I may also just roll my own basic components until I hit a wall.


