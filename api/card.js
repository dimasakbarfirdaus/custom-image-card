module.exports = (req, res) => {
  const { title, site, img, url } = req.query;

  const cardTitle = title || "Promo Spesial Hari Ini";
  const cardSiteName = site || "MEDIA-PROMO.COM";
  const cardImg = img || "https://via.placeholder.com/1200x630.png";
  const targetUrl = url ? decodeURIComponent(url) : "https://shopee.co.id";

  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = /facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|pinterest|slackbot|discordbot|googlebot/i.test(userAgent);

  // Mencegah CDN / Browser menyimpan cache pengalihan
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');

  // 1. STRUKTUR HTML BOT (Persis Seperti Involve Asia)
  if (isBot) {
    const currentUrl = `https://${req.headers.host}${req.url}`;

    const involveStyleHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cardTitle}</title>

  <!-- Open Graph Basic (Involve Asia Standard) -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${cardSiteName}" />
  <meta property="og:title" content="${cardTitle}" />
  <meta property="og:description" content="Klik foto untuk melihat detail lengkap dan klaim promonya." />
  <meta property="og:url" content="${currentUrl}" />
  <link rel="canonical" href="${currentUrl}" />

  <!-- Open Graph Image Properties -->
  <meta property="og:image" content="${cardImg}" />
  <meta property="og:image:secure_url" content="${cardImg}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter Summary Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${cardTitle}" />
  <meta name="twitter:description" content="Klik foto untuk melihat detail promo." />
  <meta name="twitter:image" content="${cardImg}" />
</head>
<body>
  <h3>${cardTitle}</h3>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(involveStyleHtml);
  }

  // 2. REDIRECT MANUSIA
  const humanHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script>window.location.replace("${targetUrl}");</script>
</head>
<body>
  <script>window.location.href = "${targetUrl}";</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(humanHtml);
};
