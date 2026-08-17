module.exports = (req, res) => {
  const { title, site, img, url } = req.query;

  const cardTitle = title || "Nonton Video Selengkapnya";
  const cardSiteName = site || "LUNA.COM";
  const cardImg = img || "https://via.placeholder.com/1200x630.png";
  const redirectUrl = url ? decodeURIComponent(url) : "https://shopee.co.id";

  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  // Deteksi super ketat untuk crawler Facebook/WhatsApp/Medsos
  const isBot = /facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|pinterest|slackbot|discordbot|googlebot/i.test(userAgent);

  // Jika yang mendatangi link adalah BOT MEDSOS:
  // Berikan MURNI data foto & metadata tanpa script redirect sama sekali.
  if (isBot) {
    const botHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${cardTitle}</title>
  <meta property="og:site_name" content="${cardSiteName}" />
  <meta property="og:title" content="${cardTitle}" />
  <meta property="og:description" content="Klik gambar untuk menonton video selengkapnya." />
  <meta property="og:image" content="${cardImg}" />
  <meta property="og:image:secure_url" content="${cardImg}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://${cardSiteName}" />
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
    return res.status(200).send(botHtml);
  }

  // Jika yang mendatangi link adalah MANUSIA (Pengunjung Real dari Facebook):
  // Tampilkan halaman redirect instan menggunakan JavaScript + Meta Refresh
  const humanHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
  <title>Mengarahkan...</title>
</head>
<body>
  <p>Mengarahkan Anda ke aplikasi...</p>
  <script>
    window.location.replace("${redirectUrl}");
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(humanHtml);
};
