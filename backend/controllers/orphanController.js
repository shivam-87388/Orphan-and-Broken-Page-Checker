const Scan = require("../models/Scan");
const { getAllUrlsFromSitemap, getInternalLinks, normalizeUrl } = require("../utils/orphanChecker");

const checkOrphanPages = async (req, res) => {
    try {
        const { website } = req.body;
        if (!website) return res.status(400).json({ message: "URL required" });

        const rootUrl = website.replace(/\/$/, "");
        const sitemapUrl = website.toLowerCase().endsWith(".xml") ? website : `${rootUrl}/sitemap.xml`;

        console.log("Checking sitemap at:", sitemapUrl);

        // 1. Fetch Sitemap
        let rawSitemap = await getAllUrlsFromSitemap(sitemapUrl);
        
        // 🛑 Blocking if no sitemap
        if (!rawSitemap || rawSitemap.length === 0) {
            return res.status(200).json({ 
                sitemapExists: false, 
                message: "Sitemap Required!",
                count: 0,
                data: [] 
            });
        }

        // 2. Start Crawling
        let cleanInternal = await getInternalLinks(rootUrl, 500);
        const cleanSitemap = rawSitemap.map(url => normalizeUrl(url)).filter(Boolean);

        // Add home page to internal links
        const homePageNormalized = normalizeUrl(rootUrl);
        if (homePageNormalized && !cleanInternal.includes(homePageNormalized)) {
            cleanInternal.push(homePageNormalized);
        }

        // 3. Compare for Orphans
        const orphanClean = cleanSitemap.filter(sLink => !cleanInternal.includes(sLink));
        const finalOrphans = rawSitemap.filter(orig => 
            orphanClean.includes(normalizeUrl(orig))
        );

        // 4. Save to MongoDB
        await Scan.create({
            user: req.user._id, // Ensure auth middleware provides user id
            website: rootUrl,
            type: "orphan",
            results: finalOrphans,
        });

        return res.status(200).json({
            sitemapExists: true,
            totalInSitemap: rawSitemap.length,
            count: finalOrphans.length,
            data: finalOrphans 
        });

    } catch (error) {
        console.error("Critical Server Error:", error.message);
        return res.status(500).json({ message: "Internal Server Error occurred" });
    }
};

module.exports = { checkOrphanPages };