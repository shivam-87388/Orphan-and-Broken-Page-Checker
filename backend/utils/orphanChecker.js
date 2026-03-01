const axios = require("axios");
const xml2js = require("xml2js");
const cheerio = require("cheerio");

// 1. URL ko saaf karne ke liye logic
const normalizeUrl = (url) => {
    try {
        const parsed = new URL(url);
        let host = parsed.hostname.replace(/^www\./, "");
        let path = parsed.pathname.replace(/\/$/, "") || "/";
        return (host + path).toLowerCase();
    } catch { return null; }
};

// 2. Sitemap se saare URLs nikalne ke liye
const getAllUrlsFromSitemap = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 15000
        });
        const parser = new xml2js.Parser({ explicitArray: false, stripPrefix: true });
        const result = await parser.parseStringPromise(response.data);
        
        let allUrls = [];
        if (result.urlset && result.urlset.url) {
            const urls = Array.isArray(result.urlset.url) ? result.urlset.url : [result.urlset.url];
            allUrls = urls.map(u => u.loc);
        }
        return [...new Set(allUrls)];
    } catch (error) {
        console.error("Sitemap Fetch Error:", error.message);
        return [];
    }
};

// 3. Website crawl karke internal links nikalne ke liye
const getInternalLinks = async (websiteUrl, maxPages = 500) => {
    const visited = new Set();
    const internalLinks = new Set();
    const toVisit = [websiteUrl.endsWith('/') ? websiteUrl : websiteUrl + '/'];
    const baseDomain = new URL(websiteUrl).hostname.replace(/^www\./, "");

    while (toVisit.length > 0 && visited.size < maxPages) {
        const currentUrl = toVisit.shift();
        const normalizedCurrent = normalizeUrl(currentUrl);
        
        if (visited.has(normalizedCurrent)) continue;
        visited.add(normalizedCurrent);

        try {
            const response = await axios.get(currentUrl, { timeout: 10000 });
            const $ = cheerio.load(response.data);

            $('a').each((i, el) => {
                let href = $(el).attr('href');
                if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

                try {
                    const absoluteUrl = new URL(href, currentUrl).href.split('#');
                    if (new URL(absoluteUrl).hostname.replace(/^www\./, "") === baseDomain) {
                        const clean = normalizeUrl(absoluteUrl);
                        if (clean) {
                            internalLinks.add(clean);
                            if (!visited.has(clean)) toVisit.push(absoluteUrl);
                        }
                    }
                } catch (e) {}
            });
        } catch (error) {
            console.log(`Failed to crawl: ${currentUrl}`);
        }
    }
    return [...internalLinks];
};

module.exports = {
    getAllUrlsFromSitemap,
    getInternalLinks,
    normalizeUrl
};