module.exports = (req, res) => {
  // Ambil parameter dari URL
  const { title, site, img, url } = req.query;

  // Set nilai default jika parameter tidak diisi
  const cardTitle = title || "Nonton Video Selengkapnya";
  const cardSiteName = site || "LUNA.COM"; // Nama domain/brand yang muncul di bawah foto
  const cardImg = img || "https://via.placeholder.com/1200x630.png?text=Klik+Untuk+Nonton";
  const redirectUrl = url || "https://shopee.co.id";

  // Cek apakah yang membuka halaman ini adalah Bot Media Sosial atau Manusia
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /facebookexternalhit|twitterbot|LinkedInBot|whatsapp|telegrambot|pinterest/i.test(userAgent);

  // Jika yang mengklik adalah MANUSIA (Pengunjung Real), LANGSUNG LEMPAR KE SHOPEE
  if (!isBot && url) {
    res.writeHead(302, { Location: redirectUrl });
    return res.end();
  }

  // Jika yang membuka adalah BOT MEDSOS, kirimkan Meta Tag HTML untuk nampilin gambarnya
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${cardTitle}</title>
  
  <!-- Open Graph Meta Tags untuk Facebook / WA / Medsos -->
  <meta property="og:title" content="${cardTitle}" />
  <meta property="og:site_name" content="${cardSiteName}" />
  <meta property="og:url" content="https://${cardSiteName}" />
  <meta property="og:image" content="${cardImg}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:type" content="video.other" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${cardTitle}">
  <meta name="twitter:image" content="${cardImg}">

  <!-- Script Redirect Cadangan -->
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
</head>
<body>
  <script>window.location.href = "${redirectUrl}";</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
};
