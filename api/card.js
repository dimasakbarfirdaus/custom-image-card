module.exports = (req, res) => {
  const { title, site, img, url } = req.query;

  const cardTitle = title || "Nonton Video Selengkapnya";
  const cardSiteName = site || "LUNA.COM";
  // Masukkan gambar default jika parameter img kosong
  const cardImg = img || "https://via.placeholder.com/1200x630.png";
  const redirectUrl = url || "https://shopee.co.id";

  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  // Deteksi bot Facebook, WhatsApp, Twitter, Telegram, dll.
  const isBot = /facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|pinterest|slackbot|discordbot|googlebot/i.test(userAgent);

  // 1. MANUSIA REAL (Diakses dari HP / Laptop) -> REDIRECT KE SHOPEE
  if (!isBot && url) {
    res.writeHead(302, { Location: redirectUrl });
    return res.end();
  }

  // 2. BOT MEDSOS (Crawling Gambar) -> TAMPILKAN METADATA TANPA REDIRECT
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${cardTitle}</title>

  <!-- Open Graph Tags untuk Facebook & WhatsApp -->
  <meta property="og:site_name" content="${cardSiteName}" />
  <meta property="og:title" content="${cardTitle}" />
  <meta property="og:description" content="Klik gambar untuk melihat detail selengkapnya." />
  <meta property="og:image" content="${cardImg}" />
  <meta property="og:image:secure_url" content="${cardImg}" />
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
