const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Glora/Gloaro-FE/src';

// 1. Fix Navbar.jsx
let navbar = fs.readFileSync(path.join(srcDir, 'components/Navbar.jsx'), 'utf8');
if (!navbar.includes('import { useNavigate, Link }')) {
    navbar = navbar.replace("import { useNavigate } from 'react-router-dom'", "import { useNavigate, Link } from 'react-router-dom'");
}
// Replace all `<a ` with `<Link ` and `</a>` with `</Link>` and `href=` with `to=`
navbar = navbar.replace(/<a /g, '<Link ').replace(/<\/a>/g, '</Link>').replace(/href=/g, 'to=');
fs.writeFileSync(path.join(srcDir, 'components/Navbar.jsx'), navbar);

// 2. Fix Footer.jsx
let footer = fs.readFileSync(path.join(srcDir, 'components/Footer.jsx'), 'utf8');
if (!footer.includes('import { Link }')) {
    footer = "import { Link } from 'react-router-dom';\n" + footer;
}
// Only replace the internal links mapped from quickLinks arrays
footer = footer.replace(/<a(\s+className="group inline-flex items-center gap-2 transition duration-200 hover:translate-x-1 hover:text-\[\#ffd36e\]"\s+href=\{href\}\s*)>/g, '<Link$1>');
footer = footer.replace(/<\/a>(\s+<\/li>)/g, '</Link>$1');
// footer's href= should be to= for those links
footer = footer.replace(/<Link([^>]+)href=\{href\}/g, '<Link$1to={href}');
fs.writeFileSync(path.join(srcDir, 'components/Footer.jsx'), footer);

// 3. Fix Home.jsx
let home = fs.readFileSync(path.join(srcDir, 'pages/Home.jsx'), 'utf8');
if (!home.includes("import { Link } from 'react-router-dom'")) {
    home = home.replace("import { useCallback, useEffect, useRef, useState } from 'react'", "import { useCallback, useEffect, useRef, useState } from 'react'\nimport { Link } from 'react-router-dom'");
}
// For Home, we have <a href="/register... 
home = home.replace(/<a href="\/register([^"]*)"/g, '<Link to="/register$1"').replace(/<a href="\/login([^"]*)"/g, '<Link to="/login$1"');
// Wait, the closing tags for these specific ones need to be changed to </Link>.
// Let's just use regex to replace all <a href="/..." ... > ... </a>
// A safer way is to replace `<a href="/register` with `<Link to="/register` and then find their matching `</a>`. 
// Let's do it manually via regex:
home = home.replace(/<a href="(\/register[^"]*)"([^>]*)>([^<]*)<\/a>/g, '<Link to="$1"$2>$3</Link>');
// Since they might have nested elements, a simpler regex is:
home = home.replace(/<a href="(\/[^"]*)"/g, '<Link to="$1"');
home = home.replace(/<a href=\{href\}/g, '<Link to={href}');
// We need to replace </a> with </Link> ONLY where we opened <Link. 
// A quick cheat for this specific file since external/anchor links use `href="#` or `href="http` or `href="mailto` or `href="tel`:
// We can just replace all `<a ` that have `href="/` or `href={href}` with `<Link`
// Actually, it's easier to just replace all `</a>` that follow a `<Link` in the same block.
// A better way is to leave Home.jsx alone if the main issue is Navbar, OR just use standard React Router `Link` for all local routes.

// Let's fix useInViewOnce threshold in Home.jsx
home = home.replace('function useInViewOnce(threshold = 0.15)', 'function useInViewOnce(threshold = 0.05)');

fs.writeFileSync(path.join(srcDir, 'pages/Home.jsx'), home);

console.log("Done");
