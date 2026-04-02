/*
  CRA/Jest sometimes has trouble resolving package export subpaths like `lenis/react`.
  This wrapper keeps the app code clean and gives tests a safe fallback.
*/

let ReactLenis = () => null;
let useLenis = () => {};

try {
  const mod = require('lenis/react');
  ReactLenis = mod.ReactLenis || ReactLenis;
  useLenis = mod.useLenis || useLenis;
} catch (e) {
  // fallback no-op
}

module.exports = { ReactLenis, useLenis };
