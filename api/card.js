module.exports = (req, res) => {
  const { title, site, img, url } = req.query;

  const cardTitle = title || "Nonton Video Selengkapnya";
  const cardSiteName = site || "LUNA.COM";
  const cardImg = img || "https://via.placeholder.com/1200x630.png";
  const redirectUrl = url || "https://shopee.co.id";

  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  // Daftar lengkap User-Agent Bot Crawler Media Sosial
  const isBot = /facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|pinterest|slackbot|discordbot|googlebot/i.test(userAgent);

  // 1. JIKA MANUSIA (Diklik dari Browser HP / Laptop):
  // Langsung lempar (302 Redirect) ke Link Affiliate Shopee
  if (!isBot && url) {
    res.writeHead(302, { Location: redirectUrl });
    return res.end();
  }

  // 2. JIKA BOT MEDSOS (Facebook Crawler, WA, dll):
  // Kirim MURNI HTML Metadata Open Graph TANPA script redirect / meta refresh sama sekali!
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${cardTitle}</title>

  <!-- Meta Tag Utama untuk Facebook / Meta Apps -->
  <meta property="og:site_name" content="${cardSiteName}" />
  <meta property="og:title" content="${cardTitle}" />
  <meta property="og:description" content="Klik gambar untuk melihat detail lengkapnya." />
  <meta property="og:image" content="${cardImg}" />
  <meta property="og:image:secure_url" content="${cardImg}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://${cardSiteName}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${cardTitle}">
  <meta name="twitter:image" content="${cardImg}">
</head>
<body>
  <h1>${cardTitle}</h1>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).send(html);
};
