# VenomVault

A lightweight Manifest V3 browser extension that puts a curated library of security-testing payloads one click away. Built for authorized penetration testing, bug bounty, and security research.

## Features

- **12 vulnerability categories** - XSS, SQLi, OS command injection, SSTI, LFI / path traversal, SSRF, XXE, open redirect, NoSQL injection, CRLF, LDAP injection, and injectable HTTP headers.
- **~100 payloads**, each annotated with a short note on what it does.
- **Live search** across every payload and note.
- **One-click copy** to clipboard.
- **Offline & private** - no network calls, no telemetry, no tracking permissions. All data ships in a single readable `payloads.js` you fully control.

## Install (unpacked)

1. Open `chrome://extensions` (Chrome/Edge/Brave).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Pin the toolbar icon and click it to open the payload vault.

## Customizing payloads

All payloads live in [`payloads.js`](payloads.js) as a plain array of categories:

```js
{ name: "XSS", desc: "Cross-Site Scripting", items: [
  { payload: "<script>alert(1)</script>", note: "Basic proof-of-concept" },
] }
```

Add, edit, or remove entries and reload the extension. `OOB` placeholders mark where to drop your own out-of-band collaborator/Burp host.

## Legal & Ethical Use

VenomVault is intended **only** for testing systems you own or have explicit written authorization to test. Unauthorized use against systems you do not have permission to test is illegal and unethical. You are solely responsible for how you use it.

## License

MIT
