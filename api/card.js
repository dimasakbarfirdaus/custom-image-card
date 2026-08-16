module.exports = (req, res) => {
  const { title, site, img, url } = req.query;

  const cardTitle = title || "Nonton Video Selengkapnya";
  const cardSiteName = site || "LUNA.COM";
  const cardImg = img || "https://via.placeholder.com/1200x630.png";
  const redirectUrl = url || "https://shopee.co.id";

  const userAgent = req.headers['user-agent'] || '';
  // Cek apakah pengakses adalah Bot Medsos (Facebook, WA, Twitter, Telegram, dll)
  const isBot = /facebookexternalhit|facebot|twitterbot|LinkedInBot|whatsapp|telegrambot|pinterest/i.test(userAgent);

  // JIKA BUKAN BOT (MANUSIA), BARU DI-REDIRECT KE SHOPEE
  if (!isBot && url) {
    res.writeHead(302, { Location: redirectUrl });
    return res.end();
  }

  // JIKA BOT MEDSOS, BERIKAN KODE HTML PREVIEW FOTO KITA
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${cardTitle}</title>
  
  <meta property="og:title" content="${cardTitle}" />
  <meta property="og:site_name" content="${cardSiteName}" />
  <meta property="og:image" content="${cardImg}" />
  <meta property="og:image:secure_url" content="${cardImg}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${cardTitle}">
  <meta name="twitter:image" content="${cardImg}">
</head>
<body>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
};
