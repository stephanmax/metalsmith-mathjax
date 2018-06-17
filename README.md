# metalsmith-mathjax

Prerender LaTeX, MathML, and AsciiMath notation using [MathJax](https://github.com/mathjax/MathJax) in Metalsmith.

## Installation

Use npm to easily install this package and its dependencies.

```
npm install --save metalsmith-mathjax
```

## Usage

Just add `mathjax: true` in the gray matter and this plugin will prerender your math notation as SVG using MathJax. This cuts down on the JavaScript overhead and eliminates the delay one typically sees where the raw TeX renders for a second before MathJax loads.

## Options

You can pass options to `metalsmith-mathjax` to define the parameters `mjpageConfig` and `mjnodeConfig` of [`mathjax-node-page`](https://github.com/pkra/mathjax-node-page#usage). By default, the options are set to

```javascript
{
    mjpageConfig: {format: ["TeX"]},
    mjnodeConfig: {svg: true}
}
```

## License

MIT