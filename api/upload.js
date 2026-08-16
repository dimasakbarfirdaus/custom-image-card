export const config = {
  api: {
    bodyParser: false, // Matikan bodyParser bawaan agar stream file utuh
  },
};

module.exports = async (req, res) => {
  // Atur Header CORS agar frontend bisa mengakses API ini
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Server Vercel meneruskan file ke server penyimpanan gambar (Catbox)
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      headers: {
        'content-type': req.headers['content-type'],
      },
      body: req,
      duplex: 'half'
    });

    const imgUrl = await response.text();
    return res.status(200).send(imgUrl.trim());
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengunggah file ke server' });
  }
};
