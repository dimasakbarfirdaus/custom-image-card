module.exports = (req, res) => {
  const { title, site, img, url } = req.query;

  const cardTitle = title || "Nonton Video Selengkapnya";
  const cardSiteName = site || "LUNA.COM";
  const cardImg = img || "https://via.placeholder.com/1200x630.png";
  const redirectUrl = url || "https://shopee.co.id";

  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  
  // Daftar Bot Media Sosial (Facebook, WA, Twitter, Telegram, dll)
  const isBot = /facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|pinterest|slackbot/i.test(userAgent);

  // 1. MANUSIA REAL -> LANGSUNG REDIRECT KE SHOPEE
  if (!isBot && url) {
    res.writeHead(302, { Location: redirectUrl });
    return res.end();
  }

  // 2. BOT MEDSOS -> BERIKAN METADATA LENGKAP KODE HTML
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${cardTitle}</title>

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:site_name" content="${cardSiteName}" />
  <meta property="og:title" content="${cardTitle}" />
  <meta property="og:description" content="Klik untuk melihat detail video." />
  <meta property="og:image" content="${cardImg}" />
  <meta property="og:image:secure_url" content="${cardImg}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://${cardSiteName}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${cardTitle}">
  <meta name="twitter:image" content="${cardImg}">

  <!-- Fallback Redirect jika dibuka via browser bot -->
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
</head>
<body>
  <script>window.location.href = "${redirectUrl}";</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
};
