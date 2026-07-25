## ADDED Requirements

### Requirement: nginx redirects HTTP to HTTPS
All HTTP traffic on port 80 SHALL be permanently redirected (HTTP 301) to the equivalent HTTPS URL on port 443.

#### Scenario: Browser sends HTTP request
- **WHEN** a client sends an HTTP GET to port 80
- **THEN** nginx responds with HTTP 301 to the same URL on port 443

### Requirement: nginx terminates TLS with corporate CA certificate
nginx SHALL terminate TLS on port 443 using a certificate and private key provided via Docker volume mounts. The paths SHALL be configurable via environment variables `NGINX_SSL_CERT_PATH` and `NGINX_SSL_KEY_PATH`.

#### Scenario: HTTPS request reaches nginx
- **WHEN** a client sends an HTTPS request to port 443
- **THEN** nginx decrypts the request using the mounted corporate CA certificate

#### Scenario: Certificate path is misconfigured
- **WHEN** `NGINX_SSL_CERT_PATH` points to a non-existent file
- **THEN** nginx fails to start and logs a descriptive error

### Requirement: nginx proxies /api/* requests to backend
All requests matching the path prefix `/api/` SHALL be proxied to the backend service on port 5000. The `Host` and `X-Real-IP` headers SHALL be forwarded.

#### Scenario: API request is proxied
- **WHEN** a client sends GET /api/health
- **THEN** nginx forwards the request to backend:5000 and returns the backend response

### Requirement: nginx serves frontend static files with SPA fallback
Requests not matching `/api/` SHALL be served from the frontend container's static files. Unmatched paths SHALL fall back to `index.html` to support client-side routing.

#### Scenario: Deep-linked SPA route is requested
- **WHEN** a client requests /servers/detail/123
- **THEN** nginx serves index.html and the React router handles the route client-side

### Requirement: nginx adds security response headers
nginx SHALL add the following headers to all responses: `Strict-Transport-Security` (max-age=31536000), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`.

#### Scenario: Security header presence verified
- **WHEN** any HTTPS response is returned by nginx
- **THEN** all four security headers are present in the response
