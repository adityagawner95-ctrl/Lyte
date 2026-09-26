import { PresetTemplate } from '../types';

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'product-catalog',
    name: 'Product Catalog',
    tagline: 'E-commerce inventory table with stock metrics',
    description: 'Transform an XML product catalog into a responsive developer-grade hardware inventory table with live stock indicators and pricing.',
    category: 'Business',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <metadata>
    <generated>2026-09-25</generated>
    <department>Hardware Engineering</department>
    <currency>USD</currency>
  </metadata>

  <product id="PROD-001" status="in-stock">
    <name>Professional Studio Display 32"</name>
    <category>Displays</category>
    <price currency="USD">1499.00</price>
    <stock>34</stock>
    <sku>DSP-32-PRO</sku>
    <rating>4.9</rating>
  </product>

  <product id="PROD-002" status="in-stock">
    <name>Wireless Mechanical Keyboard (Geist Edition)</name>
    <category>Peripherals</category>
    <price currency="USD">189.50</price>
    <stock>112</stock>
    <sku>KB-MECH-W</sku>
    <rating>4.8</rating>
  </product>

  <product id="PROD-003" status="low-stock">
    <name>Precision Haptic Trackpad</name>
    <category>Peripherals</category>
    <price currency="USD">129.00</price>
    <stock>6</stock>
    <sku>TP-HAP-01</sku>
    <rating>4.7</rating>
  </product>

  <product id="PROD-004" status="in-stock">
    <name>Thunderbolt 5 Studio Dock (14-Port)</name>
    <category>Connectivity</category>
    <price currency="USD">349.00</price>
    <stock>45</stock>
    <sku>TB5-DCK-14</sku>
    <rating>4.95</rating>
  </product>

  <product id="PROD-005" status="out-of-stock">
    <name>Active Noise-Cancelling Spatial Headset</name>
    <category>Audio</category>
    <price currency="USD">429.00</price>
    <stock>0</stock>
    <sku>AUD-ANC-PRO</sku>
    <rating>4.6</rating>
  </product>
</catalog>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" encoding="UTF-8" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Inventory Catalog · XML Studio</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #090D16;
            color: #E2E8F0;
            padding: 32px 24px;
            line-height: 1.5;
          }
          .header {
            margin-bottom: 28px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 20px;
          }
          .title {
            font-size: 22px;
            font-weight: 600;
            color: #F8FAFC;
            letter-spacing: -0.02em;
          }
          .meta {
            font-size: 13px;
            color: #94A3B8;
            margin-top: 4px;
          }
          .table-container {
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            overflow: hidden;
            background: #0F172A;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            text-align: left;
          }
          th {
            background: #151F32;
            color: #94A3B8;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-size: 11px;
            padding: 12px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          td {
            padding: 14px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: #CBD5E1;
          }
          tr:hover td {
            background: rgba(255, 255, 255, 0.02);
          }
          .prod-name {
            font-weight: 500;
            color: #F1F5F9;
          }
          .sku {
            font-family: ui-monospace, Menlo, Monaco, monospace;
            font-size: 11px;
            color: #64748B;
            margin-top: 2px;
          }
          .badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 500;
            padding: 2px 8px;
            border-radius: 4px;
          }
          .status-in-stock { background: rgba(34, 197, 94, 0.15); color: #4ADE80; }
          .status-low-stock { background: rgba(245, 158, 11, 0.15); color: #FBBF24; }
          .status-out-of-stock { background: rgba(239, 68, 68, 0.15); color: #F87171; }
          .numeric {
            font-family: ui-monospace, Menlo, Monaco, monospace;
            font-variant-numeric: tabular-nums;
            text-align: right;
          }
          .rating {
            color: #FCD34D;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">Product Catalog</h1>
            <p class="meta">
              Department: <xsl:value-of select="catalog/metadata/department"/> ·
              Generated: <xsl:value-of select="catalog/metadata/generated"/>
            </p>
          </div>
          <div class="meta">
            Total Items: <xsl:value-of select="count(catalog/product)"/>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: center;">Status</th>
                <th style="text-align: right;">Stock</th>
                <th style="text-align: right;">Rating</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="catalog/product">
                <tr>
                  <td>
                    <div class="prod-name"><xsl:value-of select="name"/></div>
                    <div class="sku">SKU: <xsl:value-of select="sku"/> · ID: <xsl:value-of select="@id"/></div>
                  </td>
                  <td><xsl:value-of select="category"/></td>
                  <td class="numeric">$<xsl:value-of select="price"/></td>
                  <td style="text-align: center;">
                    <xsl:choose>
                      <xsl:when test="@status = 'in-stock'">
                        <span class="badge status-in-stock">In Stock</span>
                      </xsl:when>
                      <xsl:when test="@status = 'low-stock'">
                        <span class="badge status-low-stock">Low Stock</span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="badge status-out-of-stock">Backorder</span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td class="numeric"><xsl:value-of select="stock"/></td>
                  <td class="numeric rating">★ <xsl:value-of select="rating"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`,
  },
  {
    id: 'executive-invoice',
    name: 'Executive Invoice',
    tagline: 'Itemized billing statement with computed subtotals',
    description: 'Transform financial XML transaction entries into an executive billing invoice with clean lines, company branding, and tax breakdown.',
    category: 'Business',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<invoice number="INV-2026-8891">
  <issuer>
    <company>Aether Labs Inc.</company>
    <address>540 Market Street, Suite 900</address>
    <city>San Francisco, CA 94104</city>
    <taxId>US-94-382910</taxId>
    <email>billing@aetherlabs.dev</email>
  </issuer>

  <client>
    <name>Nexus Dynamics Corp</name>
    <contact>Marcus Vance</contact>
    <address>100 Montgomery Blvd, Floor 18</address>
    <city>San Francisco, CA 94105</city>
    <email>finance@nexusdynamics.io</email>
  </client>

  <dates>
    <issued>2026-09-20</issued>
    <due>2026-10-20</due>
  </dates>

  <currency code="USD" symbol="$" />

  <items>
    <item id="1">
      <description>Systems Architecture &amp; XSLT Pipeline Setup</description>
      <category>Engineering</category>
      <hours>40</hours>
      <rate>185.00</rate>
      <amount>7400.00</amount>
    </item>
    <item id="2">
      <description>High-Performance XML Parser Hardening</description>
      <category>Optimization</category>
      <hours>25</hours>
      <rate>185.00</rate>
      <amount>4625.00</amount>
    </item>
    <item id="3">
      <description>Enterprise Dedicated Cloud Node (September 2026)</description>
      <category>Infrastructure</category>
      <hours>1</hours>
      <rate>1250.00</rate>
      <amount>1250.00</amount>
    </item>
  </items>

  <financials>
    <subtotal>13275.00</subtotal>
    <taxRate>8.5%</taxRate>
    <taxAmount>1128.38</taxAmount>
    <total>14403.38</total>
  </financials>
</invoice>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" encoding="UTF-8" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Invoice <xsl:value-of select="invoice/@number"/></title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0B0E14;
            color: #E2E8F0;
            padding: 40px;
            max-width: 850px;
            margin: 0 auto;
          }
          .invoice-card {
            background: #111726;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 36px;
          }
          .top-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 28px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          .company-name {
            font-size: 20px;
            font-weight: 700;
            color: #F8FAFC;
            letter-spacing: -0.01em;
          }
          .company-details {
            font-size: 12px;
            color: #94A3B8;
            margin-top: 6px;
            line-height: 1.6;
          }
          .inv-title {
            font-size: 24px;
            font-weight: 700;
            color: #6366F1;
            text-align: right;
            letter-spacing: -0.02em;
          }
          .inv-num {
            font-family: monospace;
            font-size: 13px;
            color: #94A3B8;
            text-align: right;
            margin-top: 4px;
          }
          .parties-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            padding: 24px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 13px;
          }
          .section-label {
            font-size: 11px;
            text-transform: uppercase;
            color: #64748B;
            letter-spacing: 0.05em;
            margin-bottom: 6px;
            font-weight: 600;
          }
          .client-name {
            font-weight: 600;
            color: #F1F5F9;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            font-size: 13px;
          }
          th {
            text-align: left;
            padding: 10px 12px;
            color: #64748B;
            font-size: 11px;
            text-transform: uppercase;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          td {
            padding: 14px 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            color: #CBD5E1;
          }
          .amount-col {
            text-align: right;
            font-family: monospace;
            font-variant-numeric: tabular-nums;
          }
          .totals-wrap {
            display: flex;
            justify-content: flex-end;
            margin-top: 16px;
          }
          .totals-table {
            width: 280px;
            font-size: 13px;
          }
          .totals-table tr td {
            padding: 8px 12px;
            border: none;
          }
          .total-highlight {
            font-size: 16px;
            font-weight: 700;
            color: #F8FAFC;
            border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
          }
        </style>
      </head>
      <body>
        <div class="invoice-card">
          <div class="top-row">
            <div>
              <div class="company-name"><xsl:value-of select="invoice/issuer/company"/></div>
              <div class="company-details">
                <xsl:value-of select="invoice/issuer/address"/><br/>
                <xsl:value-of select="invoice/issuer/city"/><br/>
                Tax ID: <xsl:value-of select="invoice/issuer/taxId"/>
              </div>
            </div>
            <div>
              <div class="inv-title">INVOICE</div>
              <div class="inv-num">#<xsl:value-of select="invoice/@number"/></div>
              <div class="company-details" style="text-align: right; margin-top: 6px;">
                Issued: <xsl:value-of select="invoice/dates/issued"/><br/>
                Due: <xsl:value-of select="invoice/dates/due"/>
              </div>
            </div>
          </div>

          <div class="parties-grid">
            <div>
              <div class="section-label">Billed To</div>
              <div class="client-name"><xsl:value-of select="invoice/client/name"/></div>
              <div style="color: #94A3B8; margin-top: 2px;">
                Attn: <xsl:value-of select="invoice/client/contact"/><br/>
                <xsl:value-of select="invoice/client/address"/><br/>
                <xsl:value-of select="invoice/client/city"/>
              </div>
            </div>
            <div>
              <div class="section-label">Payment Instructions</div>
              <div style="color: #94A3B8; line-height: 1.6;">
                Wire Transfer / ACH<br/>
                Ref: <xsl:value-of select="invoice/@number"/><br/>
                Currency: <xsl:value-of select="invoice/currency/@code"/>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th class="amount-col">Hours / Qty</th>
                <th class="amount-col">Rate</th>
                <th class="amount-col">Amount</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="invoice/items/item">
                <tr>
                  <td style="font-weight: 500; color: #F1F5F9;"><xsl:value-of select="description"/></td>
                  <td style="color: #94A3B8;"><xsl:value-of select="category"/></td>
                  <td class="amount-col"><xsl:value-of select="hours"/></td>
                  <td class="amount-col">$<xsl:value-of select="rate"/></td>
                  <td class="amount-col" style="color: #F8FAFC;">$<xsl:value-of select="amount"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <div class="totals-wrap">
            <table class="totals-table">
              <tr>
                <td style="color: #94A3B8;">Subtotal</td>
                <td class="amount-col">$<xsl:value-of select="invoice/financials/subtotal"/></td>
              </tr>
              <tr>
                <td style="color: #94A3B8;">Tax (<xsl:value-of select="invoice/financials/taxRate"/>)</td>
                <td class="amount-col">$<xsl:value-of select="invoice/financials/taxAmount"/></td>
              </tr>
              <tr class="total-highlight">
                <td>Total Due</td>
                <td class="amount-col" style="color: #6366F1;">$<xsl:value-of select="invoice/financials/total"/></td>
              </tr>
            </table>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`,
  },
  {
    id: 'editorial-feed',
    name: 'Editorial Newsfeed',
    tagline: 'RSS publication feed transformed into an article stream',
    description: 'Transform structured RSS/publication XML feed into an elegant editorial magazine feed with author bylines and timestamps.',
    category: 'Publishing',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Kernel &amp; Schema Chronicle</title>
    <description>Dispatches on distributed architectures, declarative data, and compiler ergonomics.</description>
    <link>https://chronicle.developer.io</link>
    <language>en-us</language>
    <lastBuildDate>2026-09-25T08:00:00Z</lastBuildDate>

    <item>
      <title>Declarative Schema Normalization at Planetary Scale</title>
      <author>Dr. Elena Rostova</author>
      <pubDate>Sep 24, 2026</pubDate>
      <readTime>6 min read</readTime>
      <category>Architecture</category>
      <summary>How strict XML validation models and streaming XSLT pipelines eliminate invariant corruption in multi-region data stores.</summary>
      <comments>48</comments>
    </item>

    <item>
      <title>The Revival of Functional Stylesheets: Why XSLT 1.0 Still Wins</title>
      <author>Julian Brandt</author>
      <pubDate>Sep 21, 2026</pubDate>
      <readTime>4 min read</readTime>
      <category>Languages</category>
      <summary>Examining the pure functional paradigm of pattern-matching template evaluation versus modern imperative templating engines.</summary>
      <comments>92</comments>
    </item>

    <item>
      <title>Benchmarking Browser-Native DOM Transformation Engines</title>
      <author>Aria Chen</author>
      <pubDate>Sep 18, 2026</pubDate>
      <readTime>8 min read</readTime>
      <category>Performance</category>
      <summary>A detailed comparative study on sub-millisecond document fragment parsing across modern WebKit and Chromium engines.</summary>
      <comments>35</comments>
    </item>
  </channel>
</rss>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" encoding="UTF-8" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title><xsl:value-of select="rss/channel/title"/></title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #080B11;
            color: #E2E8F0;
            padding: 48px 24px;
            max-width: 760px;
            margin: 0 auto;
            line-height: 1.6;
          }
          .publication-header {
            margin-bottom: 40px;
            padding-bottom: 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          .pub-title {
            font-size: 26px;
            font-weight: 700;
            color: #F8FAFC;
            letter-spacing: -0.02em;
          }
          .pub-desc {
            color: #94A3B8;
            font-size: 14px;
            margin-top: 8px;
          }
          .articles {
            display: flex;
            flex-direction: column;
            gap: 28px;
          }
          .article-item {
            padding-bottom: 28px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }
          .article-meta {
            font-size: 12px;
            color: #64748B;
            margin-bottom: 6px;
            display: flex;
            gap: 8px;
            align-items: center;
          }
          .category-tag {
            color: #818CF8;
            font-weight: 600;
          }
          .article-title {
            font-size: 18px;
            font-weight: 600;
            color: #F1F5F9;
            margin-bottom: 8px;
            line-height: 1.4;
          }
          .article-summary {
            color: #94A3B8;
            font-size: 14px;
            line-height: 1.6;
          }
          .article-footer {
            margin-top: 12px;
            font-size: 12px;
            color: #64748B;
            display: flex;
            gap: 16px;
          }
        </style>
      </head>
      <body>
        <div class="publication-header">
          <h1 class="pub-title"><xsl:value-of select="rss/channel/title"/></h1>
          <p class="pub-desc"><xsl:value-of select="rss/channel/description"/></p>
        </div>

        <div class="articles">
          <xsl:for-each select="rss/channel/item">
            <div class="article-item">
              <div class="article-meta">
                <span class="category-tag"><xsl:value-of select="category"/></span>
                <span>·</span>
                <span><xsl:value-of select="pubDate"/></span>
                <span>·</span>
                <span><xsl:value-of select="readTime"/></span>
              </div>
              <h2 class="article-title"><xsl:value-of select="title"/></h2>
              <p class="article-summary"><xsl:value-of select="summary"/></p>
              <div class="article-footer">
                <span>By <xsl:value-of select="author"/></span>
                <span><xsl:value-of select="comments"/> responses</span>
              </div>
            </div>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`,
  },
  {
    id: 'svg-chart',
    name: 'SVG Vector Visualizer',
    tagline: 'Direct XML to Vector SVG Graphic generation',
    description: 'Transform an XML dataset directly into a high-precision SVG bar chart with coordinate calculations, gradient fills, and typography.',
    category: 'Data & Graphics',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<report title="Quarterly API Invocations (Millions)" year="2026">
  <metrics>
    <metric quarter="Q1" label="Q1 · Launch" value="45" max="100" />
    <metric quarter="Q2" label="Q2 · Growth" value="72" max="100" />
    <metric quarter="Q3" label="Q3 · Enterprise" value="88" max="100" />
    <metric quarter="Q4" label="Q4 · Global" value="96" max="100" />
  </metrics>
</report>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" encoding="UTF-8" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>SVG Visualization · XML Studio</title>
        <style>
          body {
            background: #080C14;
            color: #F8FAFC;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 24px;
          }
          .chart-box {
            background: #0F172A;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 28px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          }
          .title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #E2E8F0;
            letter-spacing: -0.01em;
          }
        </style>
      </head>
      <body>
        <div class="chart-box">
          <div class="title">
            <xsl:value-of select="report/@title"/> — <xsl:value-of select="report/@year"/>
          </div>

          <svg width="540" height="240" viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#818CF8" />
                <stop offset="100%" stop-color="#4F46E5" />
              </linearGradient>
            </defs>

            <!-- Grid Lines -->
            <line x1="40" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
            <line x1="40" y1="110" x2="500" y2="110" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
            <line x1="40" y1="180" x2="500" y2="180" stroke="rgba(255,255,255,0.15)" />

            <!-- Bars -->
            <xsl:for-each select="report/metrics/metric">
              <!-- Bar Position: 60 + (position() - 1) * 110 -->
              <xsl:variable name="xPos" select="70 + (position() - 1) * 110" />
              <xsl:variable name="barHeight" select="@value * 1.3" />
              <xsl:variable name="yPos" select="180 - $barHeight" />

              <g>
                <rect x="{$xPos}" y="{$yPos}" width="54" height="{$barHeight}" rx="4" fill="url(#barGrad)" />
                <text x="{$xPos + 27}" y="{$yPos - 8}" fill="#A5B4FC" font-size="12" font-weight="600" font-family="monospace" text-anchor="middle">
                  <xsl:value-of select="@value"/>M
                </text>
                <text x="{$xPos + 27}" y="202" fill="#94A3B8" font-size="11" font-weight="500" font-family="sans-serif" text-anchor="middle">
                  <xsl:value-of select="@quarter"/>
                </text>
              </g>
            </xsl:for-each>
          </svg>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`,
  },
];
