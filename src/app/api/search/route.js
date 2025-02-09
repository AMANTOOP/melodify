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
    const apiUrl = `https://iodify-dev-backend.onrender.com/api/global-search?query=${encodeURIComponent(
      query
    )}`;
    console.log("🔍 Fetching from JioSaavn API:", apiUrl);

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
    if (!data || typeof data !== "object") {
      const nextRes = NextResponse.json(data);
      nextRes.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      nextRes.headers.set("Pragma", "no-cache");
      nextRes.headers.set("Expires", "0");

      return nextRes;
    }

    const results = data;

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
      url: firstResult.url || "No URL", // Fixed: The correct song URL
      image: firstResult.image|| "No Image", // Use album image URL
      primaryArtists: firstResult.primaryArtists || "Unknown",
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
