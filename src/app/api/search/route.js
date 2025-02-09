import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `https://saavn.dev/api/search/songs?query=${encodeURIComponent(
      query
    )}`;
    // console.log("🔍 Fetching from JioSaavn API:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }, // Prevents blocking
      cache: "no-store", // Ensures fresh fetch each time
    });

    if (!response.ok) {
      throw new Error(`JioSaavn API returned status ${response.status}`);
    }

    const data = await response.json();
    // console.log("🔍 JioSaavn API Response:", JSON.stringify(data, null, 2)); // Debugging

    // Check if response structure is correct
    if (
      !data ||
      typeof data !== "object" ||
      !data.data ||
      !Array.isArray(data.data.results)
    ) {
      const nextRes = NextResponse.json(data);
      nextRes.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      nextRes.headers.set("Pragma", "no-cache");
      nextRes.headers.set("Expires", "0");

      return nextRes;
    }

    const results = data.data.results;

    if (results.length === 0) {
      return NextResponse.json(
        { error: "No results found", rawData: data },
        { status: 404 }
      );
    }

    const firstResult = results[0];
    // console.log("🔍 First result:", firstResult); // Debugging

    // Validate data before accessing properties
    const processedData = {
      id: firstResult.id || "Unknown",
      name: firstResult.name || "Unknown",
      url: firstResult.downloadUrl[4].url || "No URL", // Fixed: The correct song URL
      image: firstResult.image[1].url || "No Image", // Use album image URL
      primaryArtists: firstResult.artists.primary
        ? firstResult.artists.primary.map((artist) => artist.name).join(", ")
        : "Unknown", // Extract all artist names as a comma-separated string
    };

    return NextResponse.json(processedData);
  } catch (error) {
    console.error("🚨 Error fetching from JioSaavn API:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data from Jio Saavn API",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
